import { useCallback, useEffect, useRef, useState } from "react";
import { piperSpeak, piperStatus, piperSupported } from "./piperTts";

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: unknown) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    length: number;
    [index: number]: { transcript: string };
  }>;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognition(): SpeechRecognitionLike | null {
  const w = window as unknown as Record<string, unknown>;
  const Ctor =
    (w.SpeechRecognition as SpeechRecognitionCtor | undefined) ??
    (w.webkitSpeechRecognition as SpeechRecognitionCtor | undefined);
  return Ctor ? new Ctor() : null;
}

export function speechSupported(): boolean {
  return typeof window !== "undefined" && !!getRecognition();
}

export function speechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Lazy speechSynthesis accessor (avoids "not a constructor" on some browsers). */
function synth(): SpeechSynthesis | null {
  if (typeof window === "undefined") return null;
  try {
    return window.speechSynthesis;
  } catch {
    return null;
  }
}

/** Cached voice list — getVoices() can be async to load on some browsers. */
let cachedVoices: SpeechSynthesisVoice[] = [];
let voicesLoaded = false;

function ensureVoices() {
  const s = synth();
  if (!s || voicesLoaded) return;
  voicesLoaded = true;
  const load = () => {
    cachedVoices = s.getVoices();
  };
  load();
  s.addEventListener?.("voiceschanged", load);
}

function pickVoice(): SpeechSynthesisVoice | null {
  ensureVoices();
  const v = cachedVoices;
  const preferred = v.find((x) => /en[-_]US/i.test(x.lang) && /natural|neural|female|Google/i.test(x.name));
  const fallback = v.find((x) => /en[-_]US/i.test(x.lang));
  return preferred ?? fallback ?? null;
}

/** Strip markdown-ish noise so speech sounds natural. */
export function stripForSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[*_#>`~|]/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Realistic voice: POST to our TTS backend (OpenAI). Returns audio mpeg blob or null. */
async function fetchTts(text: string): Promise<Blob | null> {
  const url =
    import.meta.env.DEV && !import.meta.env.VITE_USE_LOCAL_FUNCTIONS
      ? "http://localhost:8787/tts"
      : "/api/tts";
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return null;
    return await res.blob();
  } catch {
    return null;
  }
}

/** Plays audio from a blob. Resolves when playback ends (or is stopped). */
function playAudio(blob: Blob): Promise<void> {
  return new Promise((resolve) => {
    stopSpeaking();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    currentAudio = audio;
    audio.onended = () => {
      currentAudio = null;
      URL.revokeObjectURL(url);
      resolve();
    };
    audio.onerror = () => {
      currentAudio = null;
      URL.revokeObjectURL(url);
      resolve();
    };
    audio.play().catch(() => {
      currentAudio = null;
      URL.revokeObjectURL(url);
      resolve();
    });
  });
}

let currentAudio: HTMLAudioElement | null = null;

/** Speak via the server TTS (Gemini — smooth, realistic), else Piper, else browser voices. */
export async function speakText(text: string): Promise<void> {
  const clean = stripForSpeech(text);
  if (!clean) return;

  // Prefer the hosted Gemini TTS — it sounds far more natural and smooth.
  // Piper (free/offline) and browser voices are only fallbacks if it fails.
  const hosted = await fetchTts(clean);
  if (hosted) {
    await playAudio(hosted);
    return;
  }

  if (piperSupported() && piperStatus() === "ready") {
    const blob = await piperSpeak(clean);
    if (blob) {
      await playAudio(blob);
      return;
    }
  }

  // Fallback: browser speechSynthesis.
  const s = synth();
  if (!s) return;
  s.cancel();
  const u = new SpeechSynthesisUtterance(clean);
  u.rate = 1.02;
  u.pitch = 1;
  const voice = pickVoice();
  if (voice) u.voice = voice;
  s.speak(u);

  await new Promise<void>((resolve) => {
    const timer = setInterval(() => {
      if (!s.speaking && !s.pending) {
        clearInterval(timer);
        resolve();
      }
    }, 250);
    // Safety net in case the browser never flips flags.
    setTimeout(() => {
      clearInterval(timer);
      resolve();
    }, Math.max(5000, clean.length * 90));
  });
}

export function stopSpeaking(): void {
  const s = synth();
  s?.cancel();
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.src = "";
    } catch {
      /* ignore */
    }
    currentAudio = null;
  }
}

export interface UseVoice {
  supported: boolean;
  listening: boolean;
  /** Starts mic capture; calls onTranscript with final text. No-op if already listening. */
  startListening: (onTranscript: (text: string) => void, onEnd?: () => void) => void;
  stopListening: () => void;
}

/** Mic capture hook — wraps SpeechRecognition with one-shot final capture. */
export function useVoice(): UseVoice {
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const listeningRef = useRef(false);
  const [listening, setListening] = useState(false);
  const supported = speechSupported();

  const stopListening = useCallback(() => {
    listeningRef.current = false;
    recRef.current?.stop();
    setListening(false);
  }, []);

  const startListening = useCallback(
    (onTranscript: (text: string) => void, onEnd?: () => void) => {
      if (!supported || listeningRef.current) return;
      const rec = getRecognition();
      if (!rec) return;
      listeningRef.current = true;
      recRef.current = rec;
      rec.lang = "en-US";
      rec.continuous = false;
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      let gotResult = false;
      rec.onresult = (e) => {
        const len = e.results.length;
        for (let i = 0; i < len; i++) {
          const r = e.results[i];
          if (r.isFinal && r[0]?.transcript) {
            gotResult = true;
            onTranscript(r[0].transcript.trim());
          }
        }
      };
      const ended = () => {
        listeningRef.current = false;
        setListening(false);
        if (!gotResult) onEnd?.();
      };
      rec.onend = ended;
      rec.onerror = () => {
        listeningRef.current = false;
        setListening(false);
        onEnd?.();
      };
      setListening(true);
      try {
        rec.start();
      } catch {
        ended();
      }
    },
    [supported]
  );

  useEffect(() => {
    return () => {
      recRef.current?.abort();
      listeningRef.current = false;
      stopSpeaking();
    };
  }, []);

  return { supported, listening, startListening, stopListening };
}

export type ConversationStatus = "off" | "listening" | "thinking" | "speaking";

export interface UseVoiceConversation {
  supported: boolean;
  active: boolean;
  status: ConversationStatus;
  start: () => void;
  stop: () => void;
}

/**
 * Hands-free voice conversation loop:
 * listen → send to LLM → speak reply → listen again (repeat).
 * `ask` must return the assistant's reply text (or null/empty to pause the loop).
 *
 * Built to stay in the conversation: a silent pause retries listening instead
 * of hanging up, and a failed LLM/TTS turn is logged and retried rather than
 * silently killing the call.
 */
export function useVoiceConversation(ask: (question: string) => Promise<string | null>): UseVoiceConversation {
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState<ConversationStatus>("off");
  const activeRef = useRef(false);
  const statusRef = useRef<ConversationStatus>("off");
  const askRef = useRef(ask);
  askRef.current = ask;
  const { supported, startListening, stopListening } = useVoice();

  const loop = useCallback(async () => {
    let quietRounds = 0;

    while (activeRef.current) {
      statusRef.current = "listening";
      setStatus("listening");

      // Capture one utterance. Resolves fast when the mic ends silently so the
      // loop can listen again instead of stalling on a fixed timeout.
      const text = await new Promise<string | null>((resolve) => {
        let settled = false;
        const finish = (v: string | null) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          resolve(v);
        };
        const timer = setTimeout(() => finish(null), 20000);
        startListening((t) => finish(t), () => finish(null));
      });

      if (!activeRef.current) break;

      // Nothing captured — allow a couple of silent retries before hanging up.
      if (!text) {
        quietRounds++;
        if (quietRounds >= 3) break;
        continue;
      }
      quietRounds = 0;

      statusRef.current = "thinking";
      setStatus("thinking");
      let reply: string | null = null;
      try {
        reply = await askRef.current(text);
      } catch (err) {
        console.warn("Voice: ask failed, retrying next turn:", err);
      }
      if (!activeRef.current) break;

      // No usable reply — keep the call alive rather than dying silently.
      if (!reply) continue;

      statusRef.current = "speaking";
      setStatus("speaking");
      try {
        await speakText(reply);
      } catch (err) {
        console.warn("Voice: speak failed, continuing:", err);
      }
    }

    activeRef.current = false;
    setActive(false);
    setStatus("off");
  }, [startListening]);

  const start = useCallback(() => {
    if (!supported) return;
    activeRef.current = true;
    setActive(true);
    void loop();
  }, [supported, loop]);

  const stop = useCallback(() => {
    activeRef.current = false;
    setActive(false);
    setStatus("off");
    stopListening();
    stopSpeaking();
  }, [stopListening]);

  useEffect(() => {
    return () => {
      activeRef.current = false;
      stopSpeaking();
    };
  }, []);

  return { supported, active, status, start, stop };
}