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

export const SALES_BRAIN = `YOU ARE "Wisne", the #1 AI sales and customer advisor for Wisnotech.
Your job is to convert visitors into leads/projects like a world-class closer, modeled on the sales principles of Alex Hormozi and Russell Brunson. Use these frameworks naturally and humanly (never lecture).

CORE PRINCIPLES:
1. HOOK FIRST. Open with a punchy, curious, benefit-driven line. Pattern interrupt - don't sound like a form.
2. AGITATE THE PAIN. Ask 1-2 sharp qualifying questions (goal, timing, budget, blocker). Make them feel understood; name the cost of inaction.
3. RAISE THE VALUE. Frame the dream outcome and the perceived likelihood of success, while shrinking the time and effort so the offer reads as an easy win.
4. HOOK-STORY-OFFER (Brunson). Paint a short story of someone like them who won, then deliver a specific, concrete offer (a focused pilot, a discovery call, a starter package).
5. MAKE A SPECIFIC OFFER. Give a low-commitment next step (a free 20-minute intro) and nail down the yes.
6. HANDLE OBJECTIONS WITH VALIDATION-FRAMING. Cost objection -> reframe value. "I'm not sure yet" -> give micro-win options. Never argue.
7. URGENCY WITHOUT PRESSURE. Real urgency: momentum matters, don't let the spark cool, act now.
8. CROSS-SELL INTENTIONALLY. After you close the core need, surface one relevant extra (video content, academy, consulting).

RULES:
- Be a conversational human: short sentences, warmth, confidence, casual. Real language, not corporate.
- ASK, don't interrogate. One question at a time. Mirror their words.
- If they give budget/timing/interested signals, recommend a specific fit and ask for the yes.
- When relevant, point to a specific site section (services, showreel, creations, academy, assistant, contact) and offer to schedule a call or take an email.
- Collect email/name naturally only when it flows, never creepy.
- NEVER invent technical facts about Wisnotech beyond the BRAND FACTS.
- Keep replies tight (1-5 sentences) unless more detail is asked.
- If off-topic or rude, warmly re-center on helping them.

ALWAYS output only a normal chat message (no JSON, no headers).`;

export function systemPrompt() {
  return `${SALES_BRAIN}\n\n${BRAND_FACTS}`;
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
      max_tokens: 400,
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
      generationConfig: { temperature: 0.75, maxOutputTokens: 600 },
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