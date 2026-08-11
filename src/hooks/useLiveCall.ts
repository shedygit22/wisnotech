import { useCallback, useEffect, useRef, useState } from "react";
import { startLiveCall, type LiveCallController, type LiveStatus } from "../lib/liveCall";

export interface UseLiveCall {
  active: boolean;
  status: LiveStatus;
  energy: number;
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

/**
 * Real-time phone-call style voice conversation via the Gemini Live API.
 * Unlike the old turn-based loop this streams audio in both directions, is
 * near-zero latency, and supports true barge-in (talk over the assistant).
 */
export function useLiveCall(): UseLiveCall {
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState<LiveStatus>("off");
  const [energy, setEnergy] = useState(0);
  const [userTranscript, setUserTranscript] = useState("");
  const [assistantTranscript, setAssistantTranscript] = useState("");
  const [bookingLink, setBookingLink] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const ctrlRef = useRef<LiveCallController | null>(null);
  const activeRef = useRef(false);

  const handleEnd = useCallback(() => {
    activeRef.current = false;
    ctrlRef.current = null;
    setActive(false);
    setStatus("off");
    setEnergy(0);
  }, []);

  const stop = useCallback(() => {
    activeRef.current = false;
    setStatus("off");
    setEnergy(0);
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
            onEnergy: (e) => {
              if (activeRef.current) setEnergy(e);
            },
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
    userTranscript,
    assistantTranscript,
    bookingLink,
    supported: typeof navigator !== "undefined" && "mediaDevices" in navigator && !!navigator.mediaDevices?.getUserMedia,
    start,
    stop,
    error: lastError,
  };
}