import { ask, type AssistState, type ClientProfile, type Reply } from "./assistant";

function endpoint(): string {
  if (import.meta.env.DEV && !import.meta.env.VITE_USE_LOCAL_FUNCTIONS) {
    return "http://localhost:8787/chat";
  }
  return "/api/chat";
}

export async function serverChat(
  history: { role: "user" | "assistant"; content: string }[],
  profile?: ClientProfile
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(endpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history, profile }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`AI backend ${res.status}: ${body.slice(0, 200)}`);
    }
    const json = await res.json();
    if (typeof json.text !== "string") throw new Error("Unexpected AI backend response");
    return json.text;
  } finally {
    clearTimeout(timer);
  }
}

export async function askServerWithFallback(
  question: string,
  state: AssistState,
  history: { role: "user" | "assistant"; content: string }[],
  profile?: ClientProfile
): Promise<Reply> {
  try {
    const text = await serverChat(
      [
        ...history,
        { role: "user", content: question },
      ],
      profile
    );
    return { text, href: undefined };
  } catch (err) {
    console.warn("AI backend unavailable, using built-in knowledge:", err);
    return ask(question, state).reply;
  }
}