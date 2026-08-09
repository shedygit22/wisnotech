// Netlify function: POST /.netlify/functions/chat
// Body: { messages: [{ role: "user" | "assistant", content: string }] }
import { runChat } from "../../api/_core.mjs";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON body" }) };
  }

  if (!Array.isArray(payload?.messages)) {
    return { statusCode: 400, body: JSON.stringify({ error: "messages array is required" }) };
  }

  try {
    const text = await runChat(payload, process.env);
    return { statusCode: 200, body: JSON.stringify({ text }) };
  } catch (err) {
    console.error("LLM error:", err);
    const status = /KEY is not set/.test(err.message) ? 503 : 500;
    return { statusCode: status, body: JSON.stringify({ error: err.message }) };
  }
}