import { motion } from "framer-motion";
import { PhoneOff, Sparkles } from "lucide-react";
import type { LiveStatus } from "../lib/liveCall";
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
 * Fullscreen "phone call" voice mode — a living, voice-reactive orb is the
 * single hero element. Everything else stays in the background so the user's
 * attention stays on the breathing intelligence in front of them.
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#030409]"
      role="dialog"
      aria-label="Live voice conversation"
    >
      {/* Ambient atmosphere */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 42% at 50% 46%, rgba(70,120,255,0.10), transparent 72%), radial-gradient(120% 90% at 50% 110%, rgba(80,150,255,0.08), transparent 60%)",
        }}
      />

      {/* Hero orb — sized to viewport, centered */}
      <VoiceOrb
        status={status}
        energy={energy}
        aiEnergy={aiEnergy}
        size={Math.min(window.innerWidth, window.innerHeight) * 0.62}
        className="relative z-10 drop-shadow-[0_0_80px_rgba(90,150,255,0.25)]"
      />

      {/* Status — kept minimal, below the orb */}
      <div className="relative z-10 mt-5 flex flex-col items-center gap-2 px-6 text-center">
        <p className="text-sm font-medium tracking-wide text-white/85 sm:text-base">
          {STATUS_TEXT[status]}
        </p>

        {error ? (
          <p className="max-w-md text-xs text-red-300/90">{error}</p>
        ) : (
          transcript &&
          live && (
            <p className="max-w-md text-xs leading-relaxed text-white/40">{transcript}</p>
          )
        )}

        {/* Booking link surfaces only when Wisne offers it */}
        {bookingLink && !error && (
          <motion.a
            href={bookingLink}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 rounded-full border border-neon/30 bg-neon/10 px-4 py-2 text-xs font-medium text-neon backdrop-blur transition-colors hover:bg-neon/20"
          >
            Book your call — pick a slot
          </motion.a>
        )}
      </div>

      {/* Gentle pulsing live indicator */}
      {live && (
        <div className="relative z-10 mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-neon" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
            Live
          </span>
        </div>
      )}

      {/* Hang up — the only action control */}
      <motion.button
        type="button"
        onClick={onStop}
        whileTap={{ scale: 0.92 }}
        aria-label="End voice conversation"
        title="End call"
        className="relative z-10 mt-8 flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/70 backdrop-blur transition-colors hover:border-red-400/50 hover:bg-red-500/20 hover:text-red-300"
      >
        <PhoneOff className="h-6 w-6" aria-hidden />
      </motion.button>

      {/* Brand mark */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 text-white/20">
        <Sparkles className="h-3.5 w-3.5" aria-hidden />
        <span className="text-[11px] tracking-wide">Wisne — Live Voice</span>
      </div>
    </motion.div>
  );
}