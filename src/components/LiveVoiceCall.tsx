import { useMemo } from "react";
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

const SEGMENTS = 72;

/** Spans a single arc segment as an SVG path on a centered circle. */
function segmentPath(cx: number, cy: number, r: number, from: number, to: number): string {
  const a = (from * Math.PI) / 180 - Math.PI / 2;
  const b = (to * Math.PI) / 180 - Math.PI / 2;
  const x1 = cx + r * Math.cos(a);
  const y1 = cy + r * Math.sin(a);
  const x2 = cx + r * Math.cos(b);
  const y2 = cy + r * Math.sin(b);
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

/** Circular voice-activity meter — segments light up with audio energy. */
function ActivityRing({
  size,
  level,
  active,
}: {
  size: number;
  level: number; // 0..1
  active: boolean;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 6;
  const seg = (360 - SEGMENTS * 2) / SEGMENTS;
  const segments = useMemo(
    () =>
      Array.from({ length: SEGMENTS }, (_, i) => {
        const from = i * (seg + 2);
        return { path: segmentPath(cx, cy, r, from, from + seg), i };
      }),
    [cx, cy, r, seg]
  );
  const lit = Math.round(level * SEGMENTS);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="absolute inset-0 overflow-visible"
      aria-hidden
    >
      {segments.map((s) => {
        const on = s.i < lit;
        const hot = on && s.i >= lit - Math.min(6, lit);
        return (
          <path
            key={s.i}
            d={s.path}
            fill="none"
            stroke={on ? "#3b7bff" : "rgba(255,255,255,0.09)"}
            strokeWidth={on ? 3.2 : 1.6}
            strokeLinecap="round"
            opacity={on ? (hot ? 1 : 0.65) : 0.5}
            style={
              on
                ? {
                    filter: `drop-shadow(0 0 ${hot ? 8 : 4}px rgba(59,123,255,${hot ? 0.9 : 0.5}))`,
                  }
                : undefined
            }
          />
        );
      })}
      {active && (
        <motion.circle
          cx={cx}
          cy={cy}
          r={r - 4}
          fill="none"
          stroke="rgba(59,123,255,0.25)"
          strokeWidth={1}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: [0.2, 0.45, 0.2], scale: [0.99, 1.01, 0.99] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </svg>
  );
}

/**
 * Fullscreen "phone call" voice mode. The orb floats in a breathing blue aura
 * wrapped by a circular voice-activity meter; controls sit in a quiet glass
 * dock. Colours match the site's neon-blue (#3b7bff) language.
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
  const orbSize = Math.max(220, base * 0.46);
  const ringSize = orbSize + 56;
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

      {/* Hero stage: orb wrapped by the activity meter */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="relative" style={{ width: ringSize, height: ringSize }}>
          <ActivityRing size={ringSize} level={level} active={live} />
          <div
            className="absolute"
            style={{
              inset: (ringSize - orbSize) / 2,
            }}
          >
            <VoiceOrb
              status={status}
              energy={energy}
              aiEnergy={aiEnergy}
              size={orbSize}
              className="h-full w-full"
            />
          </div>
        </div>
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