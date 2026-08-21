/**
 * Lightweight in-memory rate limiter for Vercel/Node serverless functions.
 * No external store — sufficient to throttle bursts and protect LLM/TTS spend.
 * Each function instance keeps its own Map; Vercel may spin many instances,
 * so this is a best-effort guard, not a strict global limit.
 */

const buckets = new Map(); // key -> number[] timestamps (ms)

/**
 * Check and record a request.
 * @param {string} key - e.g. IP + ":" + route
 * @param {{ windowMs: number, max: number }} opts
 * @returns {{ allowed: boolean, remaining: number, retryAfterMs: number }}
 */
export function checkRateLimit(key, { windowMs, max }) {
  const now = Date.now();
  const windowStart = now - windowMs;
  let hits = buckets.get(key);
  if (!hits) {
    hits = [];
    buckets.set(key, hits);
  }
  // prune old
  while (hits.length && hits[0] <= windowStart) hits.shift();
  if (hits.length >= max) {
    const retryAfterMs = hits[0] + windowMs - now;
    return { allowed: false, remaining: 0, retryAfterMs };
  }
  hits.push(now);
  // lazy cleanup of empty/old keys to avoid unbounded growth
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.length === 0 || v[v.length - 1] <= windowStart) buckets.delete(k);
    }
  }
  return { allowed: true, remaining: max - hits.length, retryAfterMs: 0 };
}

export function getClientIp(req) {
  const xff = req.headers?.["x-forwarded-for"] || req.headers?.["X-Forwarded-For"];
  if (typeof xff === "string" && xff.trim()) return xff.split(",")[0].trim();
  const realIp = req.headers?.["x-real-ip"] || req.headers?.["X-Real-Ip"];
  if (typeof realIp === "string" && realIp.trim()) return realIp.trim();
  // Node http IncomingMessage
  if (req.socket?.remoteAddress) return req.socket.remoteAddress;
  if (req.ip) return req.ip;
  return "unknown";
}

/**
 * Apply rate limit and, if exceeded, send 429 on the response.
 * Returns true if the request should continue, false if already responded.
 * Works with both Vercel (req,res with .status().json()) and Node http (res.writeHead).
 */
export function enforceRateLimit(req, res, { route, windowMs, max }) {
  const ip = getClientIp(req);
  const key = `${ip}:${route}`;
  const { allowed, retryAfterMs } = checkRateLimit(key, { windowMs, max });
  if (allowed) return true;

  const retryAfterSec = Math.ceil(retryAfterMs / 1000);
  const body = JSON.stringify({
    error: "Too many requests — please wait a moment and try again.",
    retryAfter: retryAfterSec,
  });

  // Vercel-style res
  if (typeof res.status === "function") {
    res.setHeader("Retry-After", String(retryAfterSec));
    res.status(429).json(JSON.parse(body));
    return false;
  }
  // Node http style
  res.writeHead(429, {
    "Content-Type": "application/json",
    "Retry-After": String(retryAfterSec),
  });
  res.end(body);
  return false;
}
