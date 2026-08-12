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
  thinking: "Analyzing…",
  speaking: "Wisne is speaking",
};

/**
 * Fullscreen "phone call" voice mode. The orb floats freely in deep space,
 * wrapped in soft blurred light — no hard edges, no boxes. Everything recedes
 * behind a single living point of light in the site's neon blue.
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
  const base = Math.min(window.innerWidth, window.innerHeight);
  const orbSize = Math.max(200, base * 0.5);
  const level = Math.max(energy, aiEnergy);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#05070c]"
      role="dialog"
      aria-label="Live voice conversation"
    >
      {/* Living ambient backdrop */}
      <AuroraField status={status} />

      {/* Top hairline light */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/25 to-transparent" />

      {/* Brand pill */}
      <div className="absolute left-1/2 top-6 z-20 -translate-x-1/2">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-xl"
        >
          <Sparkles className="h-4 w-4 text-neon" aria-hidden />
          <span className="text-[13px] font-medium tracking-wide text-white/80">
            Wisne — Live Voice
          </span>
        </motion.div>
      </div>

      {/* Hero stage — open space, soft light, no box around the orb */}
      <div className="relative z-10 flex items-center justify-center">
        {/* Widescreen soft bloom that breathes with the voice */}
        <motion.div
          aria-hidden
          className="absolute rounded-full"
          animate={{ scale: 1 + level * 0.18 }}
          transition={{ type: "spring", stiffness: 40, damping: 12 }}
          style={{
            width: orbSize * 2.2,
            height: orbSize * 2.2,
            background:
              "radial-gradient(circle, rgba(59,123,255,0.20) 0%, rgba(59,123,255,0.08) 42%, transparent 72%)",
            filter: "blur(46px)",
          }}
        />

        {/* Fine counter-rotating light rings — thin, blurred, ethereal */}
        <motion.div
          aria-hidden
          className="absolute rounded-full"
          style={{ width: orbSize * 1.42, height: orbSize * 1.42, filter: "blur(0.4px)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "1px solid rgba(120,170,255,0.16)",
              maskImage:
                "conic-gradient(transparent 0deg, transparent 260deg, rgba(0,0,0,0.5) 300deg, transparent 360deg)",
              WebkitMaskImage:
                "conic-gradient(transparent 0deg, transparent 260deg, rgba(0,0,0,0.5) 300deg, transparent 360deg)",
            }}
          />
        </motion.div>
        <motion.div
          aria-hidden
          className="absolute rounded-full"
          style={{ width: orbSize * 1.24, height: orbSize * 1.24 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 130, repeat: Infinity, ease: "linear" }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "1px solid rgba(120,170,255,0.10)",
              maskImage:
                "conic-gradient(transparent 0deg, rgba(0,0,0,0.6) 90deg, transparent 160deg)",
              WebkitMaskImage:
                "conic-gradient(transparent 0deg, rgba(0,0,0,0.6) 90deg, transparent 160deg)",
            }}
          />
        </motion.div>

        {/* Breathing containment glow just beyond the orb */}
        <div
          aria-hidden
          className="absolute rounded-full"
          style={{
            width: orbSize,
            height: orbSize,
            background:
              "radial-gradient(circle, rgba(59,123,255,0.10) 0%, transparent 62%)",
            filter: "blur(14px)",
          }}
        />

        <VoiceOrb
          status={status}
          energy={energy}
          aiEnergy={aiEnergy}
          size={orbSize}
          className="relative"
        />
      </div>

      {/* Status + transcript */}
      <div className="relative z-10 mt-6 flex min-h-[110px] flex-col items-center gap-2.5 px-6 text-center">
        <motion.p
          key={status}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2.5 text-base font-light tracking-wide text-white/90 sm:text-lg"
        >
          {live && (
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
            <div className="max-w-md rounded-2xl border border-white/[0.07] bg-white/[0.04] px-5 py-3 backdrop-blur-xl">
              <motion.p
                key={transcript}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm leading-relaxed text-white/55"
              >
                {transcript}
              </motion.p>
            </div>
          )
        )}

        {bookingLink && !error && (
          <motion.a
            href={bookingLink}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 flex items-center gap-2 rounded-full border border-neon/40 bg-neon/10 px-5 py-2.5 text-sm font-medium text-neon backdrop-blur-xl transition-colors hover:bg-neon/20"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Book your call — pick a slot
          </motion.a>
        )}
      </div>

      {/* Controls dock */}
      <div className="relative z-10 mt-6 flex flex-col items-center gap-3">
        <motion.button
          type="button"
          onClick={onStop}
          whileTap={{ scale: 0.92 }}
          aria-label="End voice conversation"
          title="End call"
          className="group flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] shadow-[0_0_40px_-8px_rgba(255,80,80,0.5)] backdrop-blur-xl transition-colors hover:border-red-400/60 hover:bg-red-500/20"
        >
          <PhoneOff className="h-6 w-6 text-white/75 transition-colors group-hover:text-red-300" aria-hidden />
        </motion.button>
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">Tap to end call</p>
      </div>
    </motion.div>
  );
}