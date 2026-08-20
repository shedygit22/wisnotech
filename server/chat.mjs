// Local dev server for the AI chat — mirrors the serverless function.
// Run: `node server/chat-local.mjs` (already wired to `npm run chat:dev`).
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runChat, runChatStream } from "../api/_core.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const envFile = join(root, ".env");
try {
  const env = readFileSync(envFile, "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
} catch {
  console.warn("[chat] No .env found — supply DEEPSEEK_API_KEY or GOOGLE_AI_API_KEY");
}

const PORT = process.env.PORT || 8787;

async function readBody(req) {
  let data = "";
  for await (const chunk of req) data += chunk;
  return data;
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
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);
  return Buffer.concat([header, pcm]);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== "POST" || (url.pathname !== "/chat" && url.pathname !== "/tts")) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  let payload;
  try {
    payload = JSON.parse((await readBody(req)) || "{}");
  } catch {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid JSON body" }));
    return;
  }

  if (url.pathname === "/tts") {
    const text = String(payload?.text ?? "").trim();
    if (!text) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "text is required" }));
      return;
    }
    const provider = (process.env.TTS_PROVIDER || "gemini").toLowerCase();
    let result = null;
    if (provider === "gemini") {
      try {
        const apiKey = process.env.GOOGLE_AI_API_KEY;
        if (apiKey) {
          const model = process.env.GEMINI_TTS_MODEL || "gemini-3.1-flash-tts-preview";
          const voice = process.env.GEMINI_TTS_VOICE || "Kore";
          const tts = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
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
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } },
                  },
                },
              }),
            }
          );
          if (!tts.ok) {
            const body = await tts.text().catch(() => "");
            throw new Error(`Gemini TTS ${tts.status}: ${body.slice(0, 300)}`);
          }
          const json = await tts.json();
          const part = json?.candidates?.[0]?.content?.parts?.find((p) => p?.inlineData?.data);
          if (!part?.inlineData?.data) throw new Error("Gemini TTS returned no audio");
          let buf = Buffer.from(part.inlineData.data, "base64");
          let type = part.inlineData.mimeType || "audio/wav";
          // Gemini streams raw PCM (audio/l16), which <audio> can't play — wrap in WAV.
          if (type.startsWith("audio/l16")) {
            const rate = Number((type.match(/rate=(\d+)/) || [])[1]) || 24000;
            const channels = Number((type.match(/channels=(\d+)/) || [])[1]) || 1;
            buf = wrapWav(buf, rate, channels);
            type = "audio/wav";
          }
          result = { buf, type };
        }
      } catch (err) {
        console.error("TTS error:", err.message);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        return;
      }
    } else if (provider === "elevenlabs") {
      try {
        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (apiKey) {
          const voice = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
          const model = process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2";
          const tts = await fetch(
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
          if (!tts.ok) {
            const body = await tts.text().catch(() => "");
            throw new Error(`ElevenLabs TTS ${tts.status}: ${body.slice(0, 300)}`);
          }
          result = { buf: Buffer.from(await tts.arrayBuffer()), type: "audio/mpeg" };
        }
      } catch (err) {
        console.error("TTS error:", err.message);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        return;
      }
    } else if (provider === "openai") {
      try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (apiKey) {
          const model = process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";
          const voice = process.env.OPENAI_TTS_VOICE || "nova";
          const tts = await fetch("https://api.openai.com/v1/audio/speech", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({ model, voice, input: text, response_format: "mp3" }),
          });
          if (!tts.ok) {
            const body = await tts.text().catch(() => "");
            throw new Error(`OpenAI TTS ${tts.status}: ${body.slice(0, 300)}`);
          }
          result = { buf: Buffer.from(await tts.arrayBuffer()), type: "audio/mpeg" };
        }
      } catch (err) {
        console.error("TTS error:", err.message);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        return;
      }
    } else {
      // Voicebox — local-first backend.
      try {
        const base = (process.env.VOICEBOX_URL || "http://localhost:17493").replace(/\/$/, "");
        const profileId = process.env.VOICEBOX_PROFILE_ID || "default";
        const engine = process.env.VOICEBOX_ENGINE || "kokoro";
        const language = process.env.VOICEBOX_LANGUAGE || "en";
        const gen = await fetch(`${base}/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile_id: profileId, text, language, engine }),
        });
        if (!gen.ok) {
          const body = await gen.text().catch(() => "");
          throw new Error(`Voicebox /generate ${gen.status}: ${body.slice(0, 300)}`);
        }
        const meta = await gen.json();
        const id = meta?.id;
        if (!id) throw new Error("Voicebox /generate returned no id");
        let audio = null;
        for (let i = 0; i < 40 && !audio; i++) {
          const a = await fetch(`${base}/audio/${id}`).catch(() => null);
          if (a && a.ok) {
            audio = {
              buf: Buffer.from(await a.arrayBuffer()),
              type: a.headers.get("content-type") || "audio/wav",
            };
          } else {
            await new Promise((r) => setTimeout(r, 500));
          }
        }
        if (audio) result = audio;
      } catch (err) {
        console.error("TTS error:", err.message);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        return;
      }
    }
    if (!result) {
      res.writeHead(503, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "No TTS provider key configured" }));
      return;
    }
    res.writeHead(200, { "Content-Type": result.type, "Content-Length": result.buf.length });
    res.end(result.buf);
    return;
  }

  if (!Array.isArray(payload?.messages)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "messages array is required" }));
    return;
  }

  if (payload.stream === true) {
    res.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });
    try {
      for await (const chunk of runChatStream(payload, process.env)) {
        if (chunk) res.write(`data: ${JSON.stringify({ t: chunk })}\n\n`);
      }
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (err) {
      console.error("LLM stream error:", err.message);
      if (!res.writableEnded) {
        res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
        res.end();
      }
    }
    return;
  }

  try {
    const text = await runChat(payload, process.env);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ text }));
  } catch (err) {
    console.error("LLM error:", err.message);
    const status = /KEY is not set/.test(err.message) ? 503 : 500;
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
});

server.listen(PORT, () => {
  console.log(`AI chat dev server listening on http://localhost:${PORT}/chat`);
  startWarmup();
});

/**
 * NVIDIA NIM instances cold-start for a very long time. Keep the instance
 * hot while this dev server is running so visitor requests are snappy.
 * Runs on its own timer and never rejects.
 */
let warmingUp = false;
function warm() {
  const provider = (process.env.LLM_PROVIDER ?? "deepseek").toLowerCase();
  if (provider !== "nvidia" || !process.env.NVIDIA_API_KEY || warmingUp) return;
  warmingUp = true;
  const t0 = Date.now();
  runChat({ messages: [{ role: "user", content: "ping" }] }, process.env)
    .then(() => {
      if (process.env.LOG_LLM === "true") {
        console.log(`[warm] NVIDIA instance warm (${Date.now() - t0}ms)`);
      }
    })
    .catch((err) => {
      console.warn(`[warm] NVIDIA ping failed: ${err.message}`);
    })
    .finally(() => {
      warmingUp = false;
    });
}

function startWarmup() {
  const interval = Number(process.env.WARMUP_MS) || 120000;
  warm(); // kick once on boot so the first visitor isn't cold
  setInterval(warm, interval);
}