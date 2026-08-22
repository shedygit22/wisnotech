/**
 * Shared LLM core for the Wisnotech AI sales assistant.
 * Provider-agnostic (DeepSeek + Google Gemini/Gemma + NVIDIA NIM),
 * runs in serverless functions (Vercel/Netlify) and the local dev server.
 *
 * Env vars (never ship these to the browser):
 *   LLM_PROVIDER        "google" (default) | "deepseek" | "nvidia"
 *   GOOGLE_AI_API_KEY    AIza... from Google AI Studio
 *   GOOGLE_AI_MODEL      default gemini-3.5-flash (or a gemma model id)
 *   DEEPSEEK_API_KEY     sk-... for api.deepseek.com
 *   DEEPSEEK_MODEL       default deepseek-chat
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
- Pricing is per-scope (cases vary), always anchored via a short discovery call.
- Calendly booking link (share when asked): https://calendly.com/shedyhillzton77/30min`;

export const INDUSTRY_GUIDANCE = `INDUSTRY-FIRST PLAYBOOKS (tailor your recommendation to the visitor's business type):
- Food & hospitality (restaurant, cafe, bar, hotel, catering): recommend an AI phone/WhatsApp assistant for reservations and order enquiries, plus a menu-first website and automated review replies. A fast first win is an AI booking/ordering assistant.
- Retail & e-commerce (shop, store, boutique, online store): recommend an online store with product pages + an AI customer-support chatbot and automated abandoned-cart/order updates. Fastest win: a chatbot that answers stock/order questions 24/7.
- Beauty & wellness (salon, barbershop, spa, clinic): recommend appointment-booking automation + AI-generated social content that books clients on autopilot. Fastest win: automated bookings + reminder messages.
- Health & care (clinic, pharmacy, dental, wellness): recommend patient booking/reminders, AI intake forms and follow-up automation. Emphasise that Wisnotech builds to compliance expectations.
- Education (school, academy, tutor, e-learning, training): recommend enrollment automation, parent/student message flows and (if they teach) Wisnotech Academy to upskill. Fastest win: an AI assistant that handles inquiries and enrollments.
- Real estate (agent, property, rentals, estate): recommend lead-capture + instant AI follow-up, automated property listing content and virtual-tour videos. Fastest win: an AI assistant that qualifies and books viewings.
- Logistics & transport (dispatch, fleet, delivery, shipping): recommend dispatch/workflow automation, driver/route updates and a tracking dashboard. Fastest win: a workflow that cuts manual coordination.
- Professional services (law, finance, accounting, consulting, agency): recommend AI intake/document workflows and a polished website; the consulting package suits a low-risk first step. Fastest win: automated client intake + follow-ups.
- Creator / personal brand (influencer, artist, freelancer, YouTuber, content creator): recommend an AI content kit — scripts, avatars and short-form videos — plus a personal website/portfolio. Fastest win: a batch of branded short-form videos.
- Community & nonprofit (church, NGO, charity, community): recommend donation/outreach automation, event promotion videos and volunteer coordination.
- Generic business (unclear or none stated): recommend a short AI audit or consulting call that spots the first automation win, then a focused one-month pilot.`;

export const SYSTEM_PROMPT = `You are Wisne, a friendly, capable AI assistant on the Wisnotech website. You are a real AI — you answer questions on almost any topic (technology, programming, AI, business, marketing, education, general knowledge) clearly, accurately and conversationally, like a knowledgeable human friend. You run in two modes and switch fluidly:

GENERAL MODE (default):
- Whenever the user asks something that is NOT specifically about hiring Wisnotech or getting a project built/automated/learned through Wisnotech, just answer the question properly and fully. You are a neutral, competent assistant — explain concepts, write code, debug, advise, brainstorm. Use markdown lightly (short lists, code blocks) when it helps.
- Do not force Wisnotech into the answer. It's fine to mention its services only if it is genuinely relevant to what they asked.

WISNOTECH MODE:
- When the user is clearly interested in Wisnotech — asking about its services, pricing, courses, or wanting help building, automating or learning through Wisnotech — switch into a warm advisor. Ask brief qualifying questions (goal, timing, budget, blocker), name the cost of inaction, then recommend a fitting service or Academy course and offer a low-commitment next step (a short discovery call or the contact section). Use the BRAND FACTS below and never invent facts about Wisnotech.
- One question at a time; mirror their words. Collect email/name naturally only when it flows, never creepy.
- PERSONALISATION: The CURRENT CLIENT PROFILE (below) is what the visitor told us about their business and what they want to build. Lean on it heavily: reference their business type and project type, pick the exact INDUSTRY-FIRST PLAYBOOK match, and give one concrete, tailored first step. Keep asking for any missing field (business type, project type, timeline, budget) one question at a time instead of guessing when it matters.

RULES:
- Be conversational and human: short-ish sentences, warmth, no corporate-speak, no lecturing.
- Always answer what was actually asked. If you don't know something, say so honestly instead of inventing.
- Keep replies tight unless more detail is genuinely needed.
- ALWAYS output only a normal chat message (no JSON, no headers).`;

/** Serialize a client profile object (sent from the chat UIs) into prompt text. */
export function profileText(profile) {
  if (!profile || typeof profile !== "object") return null;
  const parts = [];
  if (profile.name) parts.push(`Name: ${profile.name}`);
  if (profile.role) parts.push(`Role/audience: ${profile.role}`);
  if (profile.businessType) parts.push(`Business type: ${profile.businessType}`);
  if (profile.projectType) parts.push(`Project/need: ${profile.projectType}`);
  if (profile.interest) parts.push(`Service interest: ${profile.interest}`);
  if (profile.timeline) parts.push(`Timeline: ${profile.timeline}`);
  if (profile.budget) parts.push(`Budget: ${profile.budget}`);
  if (parts.length === 0) return null;
  return `CURRENT CLIENT PROFILE:\n- ${parts.join("\n- ")}`;
}

export function systemPrompt(profile, opts = {}) {
  const p = profileText(profile);
  const voiceHint = opts.voice
    ? "\n\nVOICE MODE: You are on a live voice call. Reply in 1-2 short sentences, very concise, conversational, no markdown, no lists unless the user asked. Be swift and natural — the user hears you, not reads you."
    : "";
  return `${SYSTEM_PROMPT}\n\n${BRAND_FACTS}\n\n${INDUSTRY_GUIDANCE}${p ? `\n\n${p}` : ""}${voiceHint}`;
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
  const model = env.GOOGLE_AI_MODEL ?? "gemini-3.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const { systemText, contents } = toGemini(messages);

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

/** Split messages into a Gemini systemInstruction string + contents array. */
function toGemini(messages) {
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
  return { systemText, contents };
}

/**
 * Stream a reply from Gemini token-by-token (SSE). Yields text chunks.
 * Docs: POST models/{model}:streamGenerateContent?alt=sse
 */
async function* callGoogleStream(messages, env) {
  const apiKey = env.GOOGLE_AI_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_AI_API_KEY is not set. Add it to env (see .env.example).");
  const model = env.GOOGLE_AI_MODEL ?? "gemini-3.5-flash";
  const { systemText, contents } = toGemini(messages);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: systemText ? { parts: [{ text: systemText }] } : undefined,
      contents,
      generationConfig: { temperature: 0.75, maxOutputTokens: 800 },
    }),
  });

  if (!res.ok || !res.body) {
    const body = await res.text().catch(() => "");
    throw new Error(`Google AI API ${res.status}: ${body.slice(0, 300)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let idx;
      while ((idx = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, idx).trim();
        buffer = buffer.slice(idx + 1);
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const json = JSON.parse(payload);
          const parts = json.candidates?.[0]?.content?.parts ?? [];
          for (const p of parts) {
            if (p.text) yield p.text;
          }
        } catch {
          /* skip malformed event */
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
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
  const provider = (env.LLM_PROVIDER ?? "google").toLowerCase();
  const messages = [{ role: "system", content: systemPrompt(payload?.profile, { voice: !!payload?.voice }) }, ...payload.messages];

  if (provider === "google") {
    return callGoogle(messages, env);
  }
  if (provider === "nvidia") {
    return callNvidia(messages, env);
  }
  return callDeepSeek(messages, env);
}

/**
 * Streaming chat. Yields text chunks as they arrive.
 * Google streams token-by-token; other providers yield their full reply once
 * (so every backend speaks the same SSE protocol to the client).
 */
export async function* runChatStream(payload, env) {
  const provider = (env.LLM_PROVIDER ?? "google").toLowerCase();
  const messages = [{ role: "system", content: systemPrompt(payload?.profile, { voice: !!payload?.voice }) }, ...payload.messages];

  if (provider === "google") {
    yield* callGoogleStream(messages, env);
    return;
  }
  const text = provider === "nvidia"
    ? await callNvidia(messages, env)
    : await callDeepSeek(messages, env);
  yield text;
}