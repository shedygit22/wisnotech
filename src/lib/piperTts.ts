import type { PiperWebEngine } from "piper-tts-web";

/**
 * Lightweight, free, in-browser TTS via Piper (onnx WASM). No server, no API
 * key — the Piper engine + a voice model run entirely in the visitor's browser
 * (model bytes are fetched once from HuggingFace and cached in memory).
 *
 * Lazily loaded: `piper-tts-web` (which bundles onnxruntime-web) is only
 * fetched the first time a voice reply is needed.
 */

/** Wisne's Piper voice. Female, warm, natural. ~60MB one-time download. */
export const PIPER_VOICE = "en_US-amy-medium";

export type PiperStatus = "unavailable" | "idle" | "loading" | "ready" | "error";

type PiperEngineCtor = new (opts?: Record<string, unknown>) => PiperWebEngine;

let engine: PiperWebEngine | null = null;
let enginePromise: Promise<PiperWebEngine | null> | null = null;
let status: PiperStatus = "unavailable";
let readyVoice: string | null = null;
let lastError: string | null = null;

export function piperSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof WebAssembly !== "undefined" &&
    typeof fetch === "function" &&
    typeof navigator !== "undefined" &&
    !!navigator.hardwareConcurrency
  );
}

export function piperStatus(): PiperStatus {
  return status;
}

export function piperError(): string | null {
  return lastError;
}

export function piperVoice(): string | null {
  return readyVoice;
}

function setStatus(s: PiperStatus, err: string | null = null): void {
  status = s;
  lastError = err;
}

/** Load the Piper engine (idempotent). Safe to call from any UI. */
export async function loadPiper(): Promise<PiperWebEngine | null> {
  if (!piperSupported()) {
    setStatus("unavailable");
    return null;
  }
  if (engine) {
    setStatus("ready");
    return engine;
  }
  if (enginePromise) return enginePromise;

  setStatus("loading");
  enginePromise = (async () => {
    try {
      const mod = (await import("piper-tts-web")) as unknown as {
        PiperWebEngine: PiperEngineCtor;
      };
      engine = new mod.PiperWebEngine();
      setStatus("ready");
      return engine;
    } catch (err) {
      setStatus("error", err instanceof Error ? err.message : "Piper failed to load");
      enginePromise = null;
      return null;
    }
  })();
  return enginePromise;
}

/** Load the engine + warm the voice model so the first reply is fast. */
export async function preloadPiper(voice: string = PIPER_VOICE): Promise<boolean> {
  const eng = await loadPiper();
  if (!eng) return false;
  if (readyVoice === voice) return true;
  try {
    // generate() fetches + caches the voice model bytes; speak a warmup beat
    // and discard it so the first real reply starts instantly.
    await eng.generate(" ", voice, 0);
    readyVoice = voice;
    return true;
  } catch {
    readyVoice = null;
    return false;
  }
}

/** Synthesize `text` with Piper. Returns a WAV Blob, or null on failure. */
export async function piperSpeak(
  text: string,
  voice: string = PIPER_VOICE
): Promise<Blob | null> {
  const eng = await loadPiper();
  if (!eng) return null;
  try {
    const response = await eng.generate(text, voice, 0);
    readyVoice = voice;
    return response.file instanceof Blob ? response.file : null;
  } catch {
    return null;
  }
}