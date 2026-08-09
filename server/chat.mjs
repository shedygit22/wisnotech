// Local dev server for the AI chat — mirrors the serverless function.
// Run: `node server/chat-local.mjs` (already wired to `npm run chat:dev`).
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runChat } from "../api/_core.mjs";

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

  if (req.method !== "POST" || url.pathname !== "/chat") {
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

  if (!Array.isArray(payload?.messages)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "messages array is required" }));
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