import { useMemo } from "react";

const STORAGE_KEY = "wino_referral_code";

/**
 * Captures a referral code from URLs like /wino?ref=CREATOR123 and normalizes
 * + validates it. The code is preserved so it can later be handed to the WINO
 * backend signup/referral system. Never trusts arbitrary input verbatim.
 */
export function parseReferralCode(url: URL): string {
  const raw = url.searchParams.get("ref") ?? "";
  if (!raw) return "";
  const clean = raw.trim().slice(0, 32);
  if (!/^[A-Za-z0-9_-]{2,32}$/.test(clean)) return "";
  return clean.toUpperCase();
}

/**
 * Persists a valid referral code (session-scoped but survives hard refresh)
 * and exposes it to the page + download links.
 */
function readStored(): string {
  if (typeof window === "undefined") return "";
  try {
    return (sessionStorage.getItem(STORAGE_KEY) ?? "").trim().toUpperCase();
  } catch {
    return "";
  }
}

function writeStored(code: string) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, code);
  } catch {
    /* storage unavailable (private mode) — code still works for this session */
  }
}

/**
 * React hook: reads ?ref= on the WINO page, validates & persists it, and
 * returns helpers to attach the code to download links / the future backend.
 */
export function useReferral(): {
  ref: string | null;
  appendTo: (url: string) => string;
} {
  const ref = useMemo(() => {
    const fromUrl = parseReferralCode(typeof window === "undefined" ? new URL("http://localhost") : new URL(window.location.href));
    if (fromUrl) {
      writeStored(fromUrl);
      return fromUrl;
    }
    return readStored() || null;
  }, []);

  const appendTo = useMemo(
    () => (url: string) => {
      if (!ref || !url) return url;
      const u = new URL(url, "https://wisnotech.vercel.app");
      if (!u.searchParams.get("ref")) u.searchParams.set("ref", ref);
      return u.toString();
    },
    [ref]
  );

  return { ref, appendTo };
}