/**
 * Shared LLM core for the Wisnotech AI sales assistant.
 * Provider-agnostic (DeepSeek + Google Gemini/Gemma + NVIDIA NIM),
 * runs in serverless functions (Vercel/Netlify) and the local dev server.
 *
 * Env vars (never ship these to the browser):
 *   LLM_PROVIDER        "deepseek" (default) | "google" | "nvidia"
 *   DEEPSEEK_API_KEY     sk-... for api.deepseek.com
 *   DEEPSEEK_MODEL       default deepseek-chat
 *   GOOGLE_AI_API_KEY    AIza... from Google AI Studio
 *   GOOGLE_AI_MODEL      default gemini-2.0-flash (or a gemma model id)
 *   NVIDIA_API_KEY       nvapi-... from build.nvidia.com / NVIDIA API Catalog
 *   NVIDIA_MODEL         default google/gemma-4-31b-it
 */

export const BRAND_FACTS = `BRAND FACTS ABOUT WISNOTECH:
- Wisnotech helps businesses and ambitious people use AI and modern technology to build smarter, automate faster and grow with confidence.
- Location: Forest Guard Street, Uromi, Edo State, Nigeria.
- Email: wisnotech@gmail.com | Phone: +234 915 354 1297.
- Six service lines:
  1. AI & Automation — intelligent workflows, AI assistants and automated business systems.
  2. AI Video Content Creation — studio-grade videos with AI (scripts, avatars, editing, motion graphics).
  3. Software Development — custom web apps, SaaS platforms, scaled business software.
  4. Web & Mobile — modern websites and mobile apps for real users and results.
  5. AI Education — practical training for businesses, creators and professionals (Wisnotech Academy).
  6. AI Consulting — clear guidance on where AI creates real value and how to get there.
- Site sections: #home, #services, #showreel (videos), #creations (AI images), #about, #solutions, #academy, #assistant (AI Studio), #contact.
- Pricing is per-scope (cases vary), always anchored via a short discovery call.`;

export const SYSTEM_PROMPT = `You are Wisne, a friendly, capable AI assistant on the Wisnotech website. You are a real AI — you answer questions on almost any topic (technology, programming, AI, business, marketing, education, general knowledge) clearly, accurately and conversationally, like a knowledgeable human friend. You run in two modes and switch fluidly:

GENERAL MODE (default):
- Whenever the user asks something that is NOT specifically about hiring Wisnotech or getting a project built/automated/learned through Wisnotech, just answer the question properly and fully. You are a neutral, competent assistant — explain concepts, write code, debug, advise, brainstorm. Use markdown lightly (short lists, code blocks) when it helps.
- Do not force Wisnotech into the answer. It's fine to mention its services only if it is genuinely relevant to what they asked.

WISNOTECH MODE:
- When the user is clearly interested in Wisnotech — asking about its services, pricing, courses, or wanting help building, automating or learning through Wisnotech — switch into a warm advisor. Ask brief qualifying questions (goal, timing, budget, blocker), name the cost of inaction, then recommend a fitting service or Academy course and offer a low-commitment next step (a short discovery call or the contact section). Use the BRAND FACTS below and never invent facts about Wisnotech.
- One question at a time; mirror their words. Collect email/name naturally only when it flows, never creepy.

RULES:
- Be conversational and human: short-ish sentences, warmth, no corporate-speak, no lecturing.
- Always answer what was actually asked. If you don't know something, say so honestly instead of inventing.
- Keep replies tight unless more detail is genuinely needed.
- ALWAYS output only a normal chat message (no JSON, no headers).`;

export function systemPrompt() {
  return `${SYSTEM_PROMPT}\n\n${BRAND_FACTS}`;
}

async function callDeepSeek(messages, env) {
  const base = "https://api.deepseek.com";
  const model = env.DEEPSEEK_MODEL ?? "deepseek-chat";
  const apiKey = env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY is not set. Add it to env (see .env.example).");

  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.75,
      max_tokens: 800,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`DeepSeek API ${res.status}: ${body.slice(0, 300)}`);
  }
  const json = await res.json();
  const text = json.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Empty response from DeepSeek.");
  return text;
}

async function callGoogle(messages, env) {
  const apiKey = env.GOOGLE_AI_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_AI_API_KEY is not set. Add it to env (see .env.example).");
  const model = env.GOOGLE_AI_MODEL ?? "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const systemText = messages
    .filter((m) => m.role === "system")
    .map((m) => m.content)
    .join("\n");
  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: systemText ? { parts: [{ text: systemText }] } : undefined,
      contents,
      generationConfig: { temperature: 0.75, maxOutputTokens: 800 },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Google AI API ${res.status}: ${body.slice(0, 300)}`);
  }
  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? "")
    .join("")
    .trim();
  if (!text) throw new Error("Empty response from Google AI.");
  return text;
}

async function callNvidia(messages, env) {
  const base = "https://integrate.api.nvidia.com/v1";
  const model = env.NVIDIA_MODEL ?? "google/gemma-4-31b-it";
  const apiKey = env.NVIDIA_API_KEY;
  if (!apiKey) throw new Error("NVIDIA_API_KEY is not set. Add it to env (see .env.example).");
  // enable_thinking keeps responses snappy for a sales bot; flip via env if you want deeper reasoning.
  const thinking = env.NVIDIA_ENABLE_THINKING === "true";
  // NVIDIA NIM instances can cold-start for a long time — never let a visitor wait forever.
  const timeoutMs = Number(env.LLM_TIMEOUT_MS) || 40000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 800,
        stream: false,
        chat_template_kwargs: { enable_thinking: thinking },
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`NVIDIA API ${res.status}: ${body.slice(0, 300)}`);
    }
    const json = await res.json();
    const text = json.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("Empty response from NVIDIA.");
    return text;
  } finally {
    clearTimeout(timer);
  }
}

export async function runChat(payload, env) {
  const provider = (env.LLM_PROVIDER ?? "deepseek").toLowerCase();
  const messages = [{ role: "system", content: systemPrompt() }, ...payload.messages];

  if (provider === "google") {
    return callGoogle(messages, env);
  }
  if (provider === "nvidia") {
    return callNvidia(messages, env);
  }
  return callDeepSeek(messages, env);
}