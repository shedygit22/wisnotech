import { useCallback, useEffect, useRef, useState } from "react";
import { piperSpeak, piperStatus, piperSupported } from "./piperTts";
import { track } from "./analytics";

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

/**
 * Split a streaming buffer into complete sentences + the unfinished remainder.
 * A sentence ends at ".!?" followed by whitespace/end, or at a newline.
 */
export function splitSentences(text: string): { complete: string[]; remainder: string } {
  const complete: string[] = [];
  let rest = text;
  while (rest.length) {
    const m = /(?:[.!?]+(?=\s|$)|[\r\n]+)/.exec(rest);
    if (!m) break;
    const end = m.index + m[0].length;
    const sentence = rest.slice(0, end).trim();
    rest = rest.slice(end).trimStart();
    if (sentence) complete.push(sentence);
  }
  return { complete, remainder: rest.trim() };
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

/** Best audio blob for a text: hosted Gemini TTS, else Piper. Null if none. */
async function synthesize(text: string): Promise<Blob | null> {
  track("tts_request", { len: text.length });
  const hosted = await fetchTts(text);
  if (hosted) {
    track("tts_success", { provider: "gemini" });
    return hosted;
  }
  if (piperSupported() && piperStatus() === "ready") {
    const blob = await piperSpeak(text);
    if (blob) {
      track("tts_success", { provider: "piper" });
      return blob;
    }
  }
  track("tts_fallback", { reason: "no_blob" });
  return null;
}

/** Speak via the server TTS (Gemini — smooth, realistic), else Piper, else browser voices. */
export async function speakText(text: string): Promise<void> {
  const clean = stripForSpeech(text);
  if (!clean) return;

  const blob = await synthesize(clean);
  if (blob) {
    await playAudio(blob);
    return;
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
 * The ask function a voice conversation uses. `onSentence` is called with each
 * complete sentence as soon as it's ready, so the UI can speak it immediately
 * while the rest of the reply is still being generated.
 */
export type VoiceAsk = (
  question: string,
  onSentence?: (sentence: string) => void
) => Promise<string | null>;

/**
 * Hands-free voice conversation loop:
 * listen → send to LLM → speak reply → listen again (repeat).
 *
 * Replies are spoken sentence-by-sentence as they stream in — the first audio
 * starts as soon as the first sentence is ready (not after the whole reply),
 * and TTS for later sentences is pipelined behind playback so Wisne keeps
 * talking without gaps.
 *
 * Built to stay in the conversation: a silent pause retries listening instead
 * of hanging up, and a failed LLM/TTS turn is logged and retried rather than
 * silently killing the call.
 */
export function useVoiceConversation(ask: VoiceAsk): UseVoiceConversation {
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState<ConversationStatus>("off");
  const activeRef = useRef(false);
  const statusRef = useRef<ConversationStatus>("off");
  const askRef = useRef<VoiceAsk>(ask);
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

      // Pipeline: generate audio for each sentence as it arrives and play it
      // in order, starting the next sentence's audio while the previous plays.
      let playing = Promise.resolve();
      const speakSentence = (sentence: string) => {
        const clean = stripForSpeech(sentence);
        if (!clean) return;
        statusRef.current = "speaking";
        setStatus("speaking");
        const gen = synthesize(clean);
        playing = playing.then(async () => {
          if (!activeRef.current) return;
          const blob = await gen;
          if (blob) await playAudio(blob);
        });
      };

      try {
        await askRef.current(text, speakSentence);
      } catch (err) {
        console.warn("Voice: ask failed, continuing:", err);
      }
      if (!activeRef.current) break;

      // Wait for the last queued sentence to finish before listening again.
      await playing;
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