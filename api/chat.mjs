// Vercel serverless function: POST /api/chat
// Body: { messages: [{ role: "user" | "assistant", content: string }], stream?: boolean }
// When stream:true the response is SSE:  data: {"t":"<text chunk>"} ... data: {"done":true}
import { runChat, runChatStream } from "./_core.mjs";
import { enforceRateLimit } from "./rate-limit.mjs";

// Gemini replies are fast, but streaming keeps a slow first token from cutting
// a visitor off — allow a comfortable ceiling on Hobby (max 60s).
export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // 15 chat requests / minute per IP protects the Gemini spend with no UX cost.
  if (!enforceRateLimit(req, res, { route: "chat", windowMs: 60_000, max: 15 })) return;

  let payload;
  try {
    payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    res.status(400).json({ error: "Invalid JSON body" });
    return;
  }

  if (!Array.isArray(payload?.messages)) {
    res.status(400).json({ error: "messages array is required" });
    return;
  }

  // ---- Streaming path (SSE) ----
  if (payload.stream === true) {
    res.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });
    try {
      let wrote = false;
      for await (const chunk of runChatStream(payload, process.env)) {
        if (!chunk) continue;
        wrote = true;
        res.write(`data: ${JSON.stringify({ t: chunk })}\n\n`);
      }
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (err) {
      console.error("LLM stream error:", err);
      if (!res.writableEnded) {
        res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
        res.end();
      }
    }
    return;
  }

  try {
    const text = await runChat(payload, process.env);
    res.status(200).json({ text });
  } catch (err) {
    console.error("LLM error:", err);
    const status = /KEY is not set/.test(err.message) ? 503 : 500;
    res.status(status).json({ error: err.message });
  }
}