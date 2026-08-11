import { motion } from "framer-motion";
import { PhoneOff, MicOff, Sparkles, Calendar } from "lucide-react";
import type { LiveStatus } from "../lib/liveCall";
import { LiquidOrb } from "./LiquidOrb";

interface LiveVoiceCallProps {
  status: LiveStatus;
  energy: number;
  userTranscript: string;
  assistantTranscript: string;
  bookingLink: string | null;
  error: string | null;
  onStop: () => void;
}

const STATUS_TEXT: Record<LiveStatus, string> = {
  off: "Voice conversation ended",
  connecting: "Connecting…",
  listening: "I'm listening — go ahead",
  thinking: "Thinking…",
  speaking: "Wisne is speaking",
};

/**
 * Fullscreen "phone call" voice mode — ChatGPT-style hands-free conversation
 * with a glowing liquid orb that comes alive when the call is active.
 */
export function LiveVoiceCall({
  status,
  energy,
  userTranscript,
  assistantTranscript,
  bookingLink,
  error,
  onStop,
}: LiveVoiceCallProps) {
  const active = status !== "off";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05070c]/92 backdrop-blur-2xl"
      role="dialog"
      aria-label="Live voice conversation"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_45%_at_50%_40%,rgba(59,123,255,0.12),transparent_70%)]" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        {/* Orbs */}
        <div className="relative">
          <LiquidOrb status={status} energy={energy} size={280} />
          <div className="absolute -right-6 top-4 animate-pulse">
            <span
              className={`flex gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-widest uppercase ${
                active
                  ? "border-neon/40 bg-neon/10 text-neon"
                  : "border-white/10 bg-white/5 text-white/40"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              Live
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="min-h-[6rem]">
          <p className="text-lg font-medium text-white sm:text-xl">{STATUS_TEXT[status]}</p>

          {(userTranscript || assistantTranscript) && !error && (
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/50">
              {assistantTranscript || userTranscript}
            </p>
          )}

          {error && (
            <p className="mx-auto mt-3 max-w-md text-sm text-red-300/90">{error}</p>
          )}
        </div>

        {/* Transcript */}
        {(userTranscript || assistantTranscript) && !error && (
          <div className="flex w-full max-w-md flex-col gap-1.5 text-left">
            {userTranscript && (
              <p className="text-[13px] text-neon/80">
                <span className="font-semibold text-neon">You:</span> {userTranscript}
              </p>
            )}
            {assistantTranscript && (
              <p className="text-[13px] text-white/60">
                <span className="font-semibold text-white/80">Wisne:</span> {assistantTranscript}
              </p>
            )}
          </div>
        )}

        {bookingLink && !error && (
          <motion.a
            href={bookingLink}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-2xl border border-neon/30 bg-neon/10 px-5 py-3.5 text-left transition-colors hover:bg-neon/20"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neon/20 text-neon">
              <Calendar className="h-5 w-5" aria-hidden />
            </span>
            <span>
              <span className="block text-sm font-semibold text-white">Book your call</span>
              <span className="block text-xs text-white/60">Pick a Thursday slot — 30 minutes</span>
            </span>
          </motion.a>
        )}

        {/* Hang up */}
        <motion.button
          type="button"
          onClick={onStop}
          whileTap={{ scale: 0.94 }}
          aria-label="End voice conversation"
          title="End call"
          className="mt-2 flex h-16 w-16 items-center justify-center rounded-full border border-red-400/40 bg-red-500/20 text-red-300 transition-colors hover:bg-red-500/30"
        >
          <PhoneOff className="h-7 w-7" aria-hidden />
        </motion.button>

        <p className="flex items-center gap-1.5 text-xs text-white/35">
          <MicOff className="h-3.5 w-3.5" aria-hidden />
          Tap to end the live conversation
        </p>
      </div>

      {/* Brand mark */}
      <div className="absolute bottom-6 flex items-center gap-2 text-white/25">
        <Sparkles className="h-4 w-4" aria-hidden />
        <span className="text-xs tracking-wide">Wisne — Live Voice</span>
      </div>
    </motion.div>
  );
}