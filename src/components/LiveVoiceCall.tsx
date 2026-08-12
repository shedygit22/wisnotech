import { motion } from "framer-motion";
import { PhoneOff, Sparkles } from "lucide-react";
import type { LiveStatus } from "../lib/liveCall";
import { AuroraField } from "./AuroraField";
import { VoiceOrb } from "./VoiceOrb";

interface LiveVoiceCallProps {
  status: LiveStatus;
  /** 0..1 user (mic) energy — real-time analyser value. */
  energy: number;
  /** 0..1 AI (playback) energy — real-time analyser value. */
  aiEnergy: number;
  userTranscript: string;
  assistantTranscript: string;
  bookingLink: string | null;
  error: string | null;
  onStop: () => void;
}

const STATUS_TEXT: Record<LiveStatus, string> = {
  off: "Voice conversation ended",
  connecting: "Connecting to Wisne…",
  listening: "I'm listening",
  thinking: "Thinking…",
  speaking: "Wisne is speaking",
};

/**
 * Fullscreen "phone call" voice mode — a living, voice-reactive orb floats in
 * a breathing aurora. Minimal, premium, immersive: the orb is the hero and
 * everything else recedes into the dark.
 */
export function LiveVoiceCall({
  status,
  energy,
  aiEnergy,
  userTranscript,
  assistantTranscript,
  bookingLink,
  error,
  onStop,
}: LiveVoiceCallProps) {
  const live = status !== "off" && status !== "connecting";
  const transcript = assistantTranscript || userTranscript;
  const orbSize = Math.max(240, Math.min(window.innerWidth, window.innerHeight) * 0.56);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#030409]"
      role="dialog"
      aria-label="Live voice conversation"
    >
      {/* Living ambient backdrop */}
      <AuroraField status={status} />

      {/* Top hairline light */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Hero orb */}
      <div className="relative z-10 flex flex-col items-center">
        <VoiceOrb
          status={status}
          energy={energy}
          aiEnergy={aiEnergy}
          size={orbSize}
          className="relative z-10"
        />

        {/* Status — a single refined line under the orb */}
        <div className="relative z-10 mt-8 flex flex-col items-center gap-3 px-6 text-center">
          <motion.p
            key={status}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2.5 text-base font-light tracking-wide text-white/90 sm:text-lg"
          >
            {status !== "off" && status !== "connecting" && (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-neon" />
              </span>
            )}
            {STATUS_TEXT[status]}
          </motion.p>

          {error ? (
            <p className="max-w-md text-xs text-red-300/90">{error}</p>
          ) : (
            transcript &&
            live && (
              <motion.p
                key={transcript}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-md text-sm leading-relaxed text-white/40"
              >
                {transcript}
              </motion.p>
            )
          )}

          {bookingLink && !error && (
            <motion.a
              href={bookingLink}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-center gap-2 rounded-full border border-neon/30 bg-neon/10 px-5 py-2.5 text-sm font-medium text-neon backdrop-blur transition-colors hover:bg-neon/20"
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              Book your call — pick a slot
            </motion.a>
          )}
        </div>
      </div>

      {/* Controls dock */}
      <div className="relative z-10 mt-10 flex flex-col items-center gap-3">
        <motion.button
          type="button"
          onClick={onStop}
          whileTap={{ scale: 0.92 }}
          aria-label="End voice conversation"
          title="End call"
          className="group flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] shadow-[0_0_30px_-6px_rgba(255,80,80,0.4)] backdrop-blur-xl transition-colors hover:border-red-400/60 hover:bg-red-500/20"
        >
          <PhoneOff className="h-6 w-6 text-white/70 transition-colors group-hover:text-red-300" aria-hidden />
        </motion.button>
        <p className="text-[11px] uppercase tracking-[0.2em] text-white/30">Tap to end call</p>
      </div>

      {/* Brand mark */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1.5 text-white/25">
        <Sparkles className="h-3.5 w-3.5" aria-hidden />
        <span className="text-[11px] tracking-wide">Wisne — Live Voice</span>
      </div>
    </motion.div>
  );
}