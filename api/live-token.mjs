// Vercel serverless function: POST /api/live-token
// Mints a short-lived ephemeral token for the Gemini Live API, so the raw
// GOOGLE_AI_API_KEY never reaches the browser. The browser then opens the
// Live WebSocket directly with this one-use token (new session in ~1 min,
// connection valid ~30 min).
//
// Env:
//   GOOGLE_AI_API_KEY   required — the server-side Gemini key
//   LIVE_MODEL          default gemini-3.1-flash-live-preview
//   LIVE_VOICE          default Kore

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "GOOGLE_AI_API_KEY is not set" });
    return;
  }

  const model = process.env.LIVE_MODEL || "gemini-3.1-flash-live-preview";
  const now = new Date();
  const expireTime = new Date(now.getTime() + 30 * 60 * 1000).toISOString();
  const newSessionExpireTime = new Date(now.getTime() + 60 * 1000).toISOString();

  try {
    const mint = await fetch("https://generativelanguage.googleapis.com/v1beta/auth_tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        uses: 1,
        expireTime,
        newSessionExpireTime,
      }),
    });

    if (!mint.ok) {
      const body = await mint.text().catch(() => "");
      throw new Error(`auth_tokens ${mint.status}: ${body.slice(0, 300)}`);
    }

    const json = await mint.json();
    const tokenName = json?.name ?? json?.token?.name;
    if (!tokenName) throw new Error("auth_tokens returned no token");

    res.status(200).json({ token: tokenName, model, expiresAt: expireTime });
  } catch (err) {
    console.error("live-token error:", err);
    res.status(500).json({ error: err.message });
  }
}