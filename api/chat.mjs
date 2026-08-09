// Vercel serverless function: POST /api/chat
// Body: { messages: [{ role: "user" | "assistant", content: string }] }
import { runChat } from "./_core.mjs";

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

  if (!Array.isArray(payload?.messages)) {
    res.status(400).json({ error: "messages array is required" });
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