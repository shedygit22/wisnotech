// Vercel serverless function: POST /api/tts
// Body: { text: string }
// Returns: audio bytes from the configured provider.
//
// Provider selection (server-side env):
//   TTS_PROVIDER=gemini     -> Gemini TTS (REALISTIC, hosted, uses your existing
//                              GOOGLE_AI_API_KEY. Best free option for this site.)
//   TTS_PROVIDER=voicebox   -> Voicebox (local-first; requires VOICEBOX_URL reachable)
//   TTS_PROVIDER=elevenlabs -> ElevenLabs (free tier ~10k credits/mo)
//   TTS_PROVIDER=openai     -> OpenAI gpt-4o-mini-tts (needs billing)
//
// Env:
//   GOOGLE_AI_API_KEY       AIza... from aistudio.google.com/apikey (same key the
//                           chatbot can use for the LLM). Required for gemini.
//   GEMINI_TTS_MODEL        default gemini-3.1-flash-tts-preview
//   GEMINI_TTS_VOICE        default "Puck" (or Kore / Charon / Zephyr / Asteria)
//   VOICEBOX_URL            base URL of a running Voicebox backend
//   VOICEBOX_PROFILE_ID     profile uuid; default "default" (or a preset voice)
//   VOICEBOX_ENGINE         qwen | qwen_custom_voice | luxtts | chatterbox |
//                           chatterbox_turbo | tada | kokoro (default "kokoro")
//   VOICEBOX_LANGUAGE       default "en"
//   ELEVENLABS_API_KEY      xi_...  (ElevenLabs dashboard)
//   ELEVENLABS_VOICE_ID     default "21m00Tcm4TlvDq8ikWAM" (Rachel)
//   OPENAI_API_KEY          sk-...
//   OPENAI_TTS_VOICE        default "nova"
//
// If the configured provider's key/endpoint is missing we return 503 and the
// client falls back to the browser's built-in (robotic) voice.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  let payload;
  try {
    payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    res.status(400).json({ error: "Invalid JSON body" });
    return;
  }

  const text = String(payload?.text ?? "").trim();
  if (!text) {
    res.status(400).json({ error: "text is required" });
    return;
  }

  const provider = (process.env.TTS_PROVIDER || "gemini").toLowerCase();

  try {
    let result = null;
    if (provider === "gemini") result = await geminiTts(text, process.env);
    else if (provider === "elevenlabs") result = await elevenlabsTts(text, process.env);
    else if (provider === "openai") result = await openaiTts(text, process.env);
    else result = await voiceboxTts(text, process.env);

    if (!result) {
      res.status(503).json({ error: "No TTS provider key/endpoint configured" });
      return;
    }
    res.setHeader("Content-Type", result.contentType);
    res.setHeader("Cache-Control", "public, max-age=60");
    res.status(200).send(result.audio);
  } catch (err) {
    console.error("TTS error:", err);
    res.status(500).json({ error: err.message });
  }
}

/** Gemini TTS — hosted, realistic, uses GOOGLE_AI_API_KEY. Returns audio bytes. */
async function geminiTts(text, env) {
  const apiKey = env.GOOGLE_AI_API_KEY;
  if (!apiKey) return null;
  const model = env.GEMINI_TTS_MODEL || "gemini-3.1-flash-tts-preview";
  const voice = env.GEMINI_TTS_VOICE || "Puck";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Gemini TTS ${res.status}: ${body.slice(0, 300)}`);
  }
  const json = await res.json();
  const part = json?.candidates?.[0]?.content?.parts?.find((p) => p?.inlineData?.data);
  if (!part?.inlineData?.data) throw new Error("Gemini TTS returned no audio");
  let buf = Buffer.from(part.inlineData.data, "base64");
  const mime = part.inlineData.mimeType || "audio/wav";

  // Gemini streams raw PCM (audio/l16), which <audio> can't play — wrap in WAV.
  if (mime.startsWith("audio/l16")) {
    const rate = Number((mime.match(/rate=(\d+)/) || [])[1]) || 24000;
    const channels = Number((mime.match(/channels=(\d+)/) || [])[1]) || 1;
    buf = wrapWav(buf, rate, channels);
  }

  return { audio: buf, contentType: "audio/wav" };
}

/** Wrap 16-bit little-endian PCM samples in a WAV container. */
function wrapWav(pcm, sampleRate, channels) {
  const bitsPerSample = 16;
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;
  const dataSize = pcm.length;
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // fmt chunk size
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);
  return Buffer.concat([header, pcm]);
}

/**
 * Voicebox (local-first). Flow: POST /generate -> { id } then GET /audio/{id}.
 * Generation is queued server-side, so poll a few times if the model is still
 * warming up (first run downloads the model).
 */
async function voiceboxTts(text, env) {
  const base = (env.VOICEBOX_URL || "http://localhost:17493").replace(/\/$/, "");
  const profileId = env.VOICEBOX_PROFILE_ID || "default";
  const engine = env.VOICEBOX_ENGINE || "kokoro";
  const language = env.VOICEBOX_LANGUAGE || "en";

  const gen = await fetch(`${base}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      profile_id: profileId,
      text,
      language,
      engine,
    }),
  });
  if (!gen.ok) {
    const body = await gen.text().catch(() => "");
    throw new Error(`Voicebox /generate ${gen.status}: ${body.slice(0, 300)}`);
  }
  const meta = await gen.json();
  const id = meta?.id;
  if (!id) throw new Error("Voicebox /generate returned no id");

  // Poll for the audio (generation is serialized through a queue).
  for (let i = 0; i < 40; i++) {
    const audio = await fetch(`${base}/audio/${id}`).catch(() => null);
    if (audio && audio.ok) {
      const buf = Buffer.from(await audio.arrayBuffer());
      return { audio: buf, contentType: audio.headers.get("content-type") || "audio/wav" };
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("Voicebox timed out waiting for audio");
}

async function openaiTts(text, env) {
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const model = env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";
  const voice = env.OPENAI_TTS_VOICE || "nova";
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, voice, input: text, response_format: "mp3" }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`OpenAI TTS ${res.status}: ${body.slice(0, 300)}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  return { audio: buf, contentType: "audio/mpeg" };
}

async function elevenlabsTts(text, env) {
  const apiKey = env.ELEVENLABS_API_KEY;
  if (!apiKey) return null;
  const voice = env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
  const model = env.ELEVENLABS_MODEL || "eleven_multilingual_v2";
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: model,
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    }
  );
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`ElevenLabs TTS ${res.status}: ${body.slice(0, 300)}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  return { audio: buf, contentType: "audio/mpeg" };
}