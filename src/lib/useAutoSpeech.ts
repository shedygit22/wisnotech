import { useRef, useState } from "react";

const AUTO_TTS_KEY = "wisnotech:auto-tts";

/** Persistent "read replies aloud" preference, synced across both chat UIs. */
export function useAutoSpeech() {
  const [enabled, setEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUTO_TTS_KEY) === "1";
    } catch {
      return false;
    }
  });
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const toggle = () => {
    setEnabled((e) => {
      const next = !e;
      try {
        localStorage.setItem(AUTO_TTS_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return { enabled, enabledRef, toggle };
}