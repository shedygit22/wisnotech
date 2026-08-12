import { useCallback, useEffect, useRef, useState } from "react";
import { startLiveCall, type LiveCallController, type LiveStatus } from "../lib/liveCall";

export interface UseLiveCall {
  active: boolean;
  status: LiveStatus;
  /** 0..1 smoothed user (mic) energy — real-time from the live call analyser. */
  energy: number;
  /** 0..1 smoothed AI (playback) energy — in sync with Wisne's voice audio. */
  aiEnergy: number;
  userTranscript: string;
  assistantTranscript: string;
  /** Calendly booking link Wisne shared during the call, if any. */
  bookingLink: string | null;
  error: string | null;
  /** Surfaces false when the mic / WebSocket cannot be used (fall back to old loop). */
  supported: boolean;
  start: (systemInstruction?: string, greeting?: string) => Promise<void>;
  stop: () => void;
}

/** RMS-ish 0..1 level from an analyser's time-domain signal. */
function analyserLevel(node: AnalyserNode | null): number {
  if (!node) return 0;
  const data = new Uint8Array(node.fftSize);
  node.getByteTimeDomainData(data);
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    const v = data[i] / 128 - 1;
    sum += v * v;
  }
  return Math.min(1, Math.sqrt(sum / data.length) * 3);
}

/**
 * Real-time phone-call style voice conversation via the Gemini Live API.
 * Unlike the old turn-based loop this streams audio in both directions, is
 * near-zero latency, and supports true barge-in (talk over the assistant).
 */
export function useLiveCall(): UseLiveCall {
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState<LiveStatus>("off");
  const [energy, setEnergy] = useState(0);
  const [aiEnergy, setAiEnergy] = useState(0);
  const [userTranscript, setUserTranscript] = useState("");
  const [assistantTranscript, setAssistantTranscript] = useState("");
  const [bookingLink, setBookingLink] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const ctrlRef = useRef<LiveCallController | null>(null);
  const activeRef = useRef(false);
  const smoothedMic = useRef(0);
  const smoothedAI = useRef(0);

  const handleEnd = useCallback(() => {
    activeRef.current = false;
    ctrlRef.current = null;
    setActive(false);
    setStatus("off");
    setEnergy(0);
    setAiEnergy(0);
    smoothedMic.current = 0;
    smoothedAI.current = 0;
  }, []);

  const stop = useCallback(() => {
    activeRef.current = false;
    setStatus("off");
    setEnergy(0);
    setAiEnergy(0);
    smoothedMic.current = 0;
    smoothedAI.current = 0;
    ctrlRef.current?.stop();
    ctrlRef.current = null;
    setActive(false);
  }, []);

  const start = useCallback(
    async (systemInstruction?: string, greeting?: string) => {
      if (activeRef.current) return;
      activeRef.current = true;
      setLastError(null);
      setUserTranscript("");
      setAssistantTranscript("");
      setBookingLink(null);
      setStatus("connecting");
      setActive(true);
      try {
        const ctrl = await startLiveCall(
          {
            onStatus: (s) => {
              if (activeRef.current) setStatus(s);
            },
            onUserTranscript: (t) => setUserTranscript(t),
            onAssistantTranscript: (t) => setAssistantTranscript(t),
            onBookingLink: (url) => setBookingLink(url),
            onEnd: handleEnd,
            onError: (message) => {
              setLastError(message);
              setStatus("off");
            },
          },
          systemInstruction,
          greeting
        );
        if (!activeRef.current) {
          ctrl.stop();
          return;
        }
        ctrlRef.current = ctrl;
      } catch {
        activeRef.current = false;
        setActive(false);
        setStatus("off");
      }
    },
    [handleEnd]
  );

  // Sample both analysers every frame; smooth for a fluid, organic response.
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let stopped = false;
    const tick = () => {
      if (stopped) return;
      const a = ctrlRef.current?.analysers;
      const mic = analyserLevel(a?.mic ?? null);
      const ai = analyserLevel(a?.output ?? null);
      // Attack fast, release slow — spark with speech, settle gently.
      const micSmooth = smoothedMic.current + (mic - smoothedMic.current) * (mic > smoothedMic.current ? 0.5 : 0.12);
      const aiSmooth = smoothedAI.current + (ai - smoothedAI.current) * (ai > smoothedAI.current ? 0.45 : 0.1);
      smoothedMic.current = micSmooth;
      smoothedAI.current = aiSmooth;
      setEnergy(micSmooth);
      setAiEnergy(aiSmooth);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
    };
  }, [active]);

  useEffect(() => {
    return () => {
      activeRef.current = false;
      ctrlRef.current?.stop();
    };
  }, []);

  return {
    active,
    status,
    energy,
    aiEnergy,
    userTranscript,
    assistantTranscript,
    bookingLink,
    supported: typeof navigator !== "undefined" && "mediaDevices" in navigator && !!navigator.mediaDevices?.getUserMedia,
    start,
    stop,
    error: lastError,
  };
}