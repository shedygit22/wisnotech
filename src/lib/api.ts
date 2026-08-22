import { ask, type AssistState, type ClientProfile, type Reply } from "./assistant";
import { track } from "./analytics";

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

/** SSE SSE of the assistant reply (token-by-token). Resolves with the full text. */
export async function serverChatStream(
  history: { role: "user" | "assistant"; content: string }[],
  profile: ClientProfile | undefined,
  onChunk: (text: string) => void,
  isVoice = false
): Promise<string> {
  const res = await fetch(endpoint(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: history, profile, stream: true, voice: isVoice }),
  });

  if (!res.ok || !res.body) {
    const body = await res.text().catch(() => "");
    throw new Error(`AI backend ${res.status}: ${body.slice(0, 200)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";

  const handleLine = (line: string): boolean => {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) return false;
    const payload = trimmed.slice(5).trim();
    if (!payload) return false;
    let json: { t?: string; done?: boolean; error?: string };
    try {
      json = JSON.parse(payload);
    } catch {
      return false;
    }
    if (typeof json.error === "string") throw new Error(json.error);
    if (typeof json.t === "string") {
      full += json.t;
      onChunk(json.t);
    }
    if (json.done) return true;
    return false;
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let idx: number;
      while ((idx = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 1);
        if (handleLine(line)) {
          return full;
        }
      }
    }
    // Drain any trailing line.
    if (buffer.trim()) handleLine(buffer);
    if (!full) throw new Error("Empty stream from AI backend");
    return full;
  } finally {
    reader.releaseLock();
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

/**
 * Streaming variant used by the chat UIs: text chunks arrive via `onChunk`
 * while the reply is generated (Gemini-style typing). Falls back to the
 * built-in knowledge bot when the backend is unreachable.
 */
export async function askServerWithFallbackStream(
  question: string,
  state: AssistState,
  history: { role: "user" | "assistant"; content: string }[],
  profile: ClientProfile | undefined,
  onChunk: (text: string) => void,
  isVoice = false
): Promise<Reply> {
  try {
    const text = await serverChatStream(
      [...history, { role: "user", content: question }],
      profile,
      onChunk,
      isVoice
    );
    track("chat_reply", { source: "gemini", streamed: true });
    return { text, href: undefined };
  } catch (err) {
    console.warn("AI backend unavailable, using built-in knowledge:", err);
    track("chat_fallback", { reason: String((err as Error)?.message ?? err).slice(0, 80) });
    const reply = ask(question, state).reply;
    onChunk(reply.text);
    return reply;
  }
}