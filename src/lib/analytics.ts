/** Lightweight event tracking — no third party required.
 * Uses Vercel Web Analytics when available and falls back to console.
 * Extend here to add PostHog / GA4 later without touching call sites.
 */

type AnalyticsEvent =
  | "chat_sent"
  | "chat_reply"
  | "chat_fallback"
  | "tts_request"
  | "tts_success"
  | "tts_fallback"
  | "contact_submit"
  | "contact_success"
  | "voice_start"
  | "voice_end";

export function track(event: AnalyticsEvent, props?: Record<string, string | number | boolean>) {
  try {
    // Vercel Analytics custom events (if @vercel/analytics is present and cookied)
    // The global `va` is injected by the Analytics script.
    const va = (window as unknown as Record<string, unknown>).va as
      | ((action: string, params?: unknown) => void)
      | undefined;
    if (typeof va === "function") {
      va("event", { name: event, ...props });
    }
    // Also emit to console in dev for visibility
    if (import.meta.env.DEV) {
      console.debug(`[analytics] ${event}`, props ?? "");
    }
  } catch {
    /* never throw from analytics */
  }
}
