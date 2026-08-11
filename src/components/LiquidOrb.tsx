import { useMemo } from "react";
import { motion } from "framer-motion";
import type { LiveStatus } from "../lib/liveCall";

interface LiquidOrbProps {
  status: LiveStatus;
  /** 0..1 mic energy — makes the liquid churn "alive". */
  energy?: number;
  size?: number;
}

type Palette = {
  core: string;
  glow: string;
  blobs: string[];
  ring: string;
};

/**
 * A glowing, churning "liquid ball" — the always-on visual heartbeat of live
 * voice. Multiple gooey color blobs orbit inside a soft-shaded sphere while
 * outer rings, a specular sheen and particle motes keep it feeling wet,
 * glossy and alive. Reacts to conversation state + live mic energy.
 */
export function LiquidOrb({ status, energy = 0, size = 280 }: LiquidOrbProps) {
  const palettes = useMemo<Record<LiveStatus, Palette>>(
    () => ({
      off: {
        core: "linear-gradient(135deg, #1b2a4a, #0e1830 60%, #070d1c)",
        glow: "rgba(80,140,255,0.18)",
        blobs: ["#2b4a8c", "#1f3a78"],
        ring: "rgba(120,160,255,0.28)",
      },
      connecting: {
        core: "linear-gradient(135deg, #2a2f5a, #171b3a 55%, #0a0d20)",
        glow: "rgba(140,130,255,0.4)",
        blobs: ["#3d3f9e", "#5a2f8f", "#274bb0"],
        ring: "rgba(160,150,255,0.6)",
      },
      listening: {
        core: "linear-gradient(135deg, #0c4a34, #0a3240 55%, #071420)",
        glow: "rgba(52,220,160,0.45)",
        blobs: ["#14b866", "#0e9f8f", "#34d399", "#0a7a7a"],
        ring: "rgba(70,220,170,0.65)",
      },
      thinking: {
        core: "linear-gradient(135deg, #2a1f52, #1b1440 55%, #0c0920)",
        glow: "rgba(170,120,255,0.45)",
        blobs: ["#7c4dff", "#a855f7", "#5b6bff", "#8b6bff"],
        ring: "rgba(180,140,255,0.6)",
      },
      speaking: {
        core: "linear-gradient(135deg, #123a86, #0b2458 50%, #071536)",
        glow: "rgba(80,160,255,0.6)",
        blobs: ["#3b82f6", "#60a5fa", "#2563eb", "#38bdf8", "#1e40af"],
        ring: "rgba(120,180,255,0.75)",
      },
    }),
    []
  );

  const pal = palettes[status];
  const alive = status !== "off";
  const wobble = 0.06 + energy * 0.3;
  const s = size;

  /* Gooey orbiting blobs — the "liquid" that thrashes when you speak. */
  const orbBlobs = [
    { ring: 0.92, size: 0.34, speed: 5.2, delay: 0, x: -0.35, y: -0.2, c: 2 },
    { ring: 0.86, size: 0.28, speed: 6.4, delay: 0.9, x: 0.4, y: 0.25, c: 3 },
    { ring: 0.98, size: 0.3, speed: 4.4, delay: 1.6, x: 0.2, y: -0.45, c: 0 },
    { ring: 0.9, size: 0.36, speed: 5.8, delay: 2.3, x: -0.4, y: 0.4, c: 1 },
    { ring: 0.88, size: 0.24, speed: 7.2, delay: 3.0, x: 0.35, y: -0.4, c: 0 },
    { ring: 0.94, size: 0.3, speed: 4.9, delay: 3.7, x: -0.2, y: 0.45, c: 3 },
  ];
  const moteDur = status === "speaking" ? 2.6 : 4.5;

  return (
    <div className="relative flex items-center justify-center" style={{ width: s, height: s }} aria-hidden>
      {/* Outer halo */}
      <div
        className="absolute rounded-full transition-all duration-700"
        style={{
          inset: -s * 0.12,
          background: `radial-gradient(circle, ${pal.glow} 0%, transparent 62%)`,
          filter: "blur(8px)",
          opacity: alive ? 1 : 0.5,
        }}
      />

      {/* Ripple rings */}
      {alive && (
        <>
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ border: `2px solid ${pal.ring}` }}
            animate={{ scale: [1, 1.4], opacity: [0.55, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ border: `1.5px solid ${pal.ring}` }}
            animate={{ scale: [1.15, 1.65], opacity: [0.4, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
          />
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ border: `1px solid ${pal.ring}`, backgroundColor: pal.ring.replace(/[\d.]+\)$/, "0.05)") }}
            animate={{ scale: [1.3, 1.9], opacity: [0.3, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 1.6 }}
          />
        </>
      )}

      {/* Liquid sphere */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: pal.core, boxShadow: `inset 0 0 ${s * 0.18}px rgba(255,255,255,0.06), inset 0 -${s * 0.12}px ${s * 0.2}px rgba(0,0,0,0.55)` }}
        animate={{ scale: [1, 1 + wobble * 0.16, 1] }}
        transition={{ duration: alive ? (status === "speaking" ? 1.1 : 2.6) : 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Gooey inner blobs */}
        <div className="absolute inset-0 overflow-hidden rounded-full" style={{ filter: "blur(10px)" }}>
          {orbBlobs.map((b, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full mix-blend-screen"
              style={{
                width: s * b.size,
                height: s * b.size,
                left: `${50 + b.x * 100}%`,
                top: `${50 + b.y * 100}%`,
                marginLeft: -s * b.size * 0.5,
                marginTop: -s * b.size * 0.5,
                background: `radial-gradient(circle at 35% 35%, ${pal.blobs[b.c]} 0%, transparent 70%)`,
                opacity: 0.92,
              }}
              animate={{
                x: [
                  Math.cos(0) * s * b.ring * 0.35,
                  Math.cos(Math.PI / 2) * s * b.ring * 0.35,
                  Math.cos(Math.PI) * s * b.ring * 0.35,
                  Math.cos(Math.PI * 1.5) * s * b.ring * 0.35,
                  Math.cos(Math.PI * 2) * s * b.ring * 0.35,
                ],
                y: [
                  Math.sin(0) * s * b.ring * 0.35,
                  Math.sin(Math.PI / 2) * s * b.ring * 0.35,
                  Math.sin(Math.PI) * s * b.ring * 0.35,
                  Math.sin(Math.PI * 1.5) * s * b.ring * 0.35,
                  Math.sin(Math.PI * 2) * s * b.ring * 0.35,
                ],
                scale: [b.size * (1 - wobble), b.size * (1 + wobble), b.size * (1 - wobble * 0.7), b.size * (1 + wobble * 0.5), b.size * (1 - wobble)],
              }}
              transition={{
                duration: b.speed * (1 - energy * 0.3),
                repeat: Infinity,
                ease: "linear",
                delay: b.delay,
              }}
            />
          ))}
        </div>

        {/* Inner depth vignette */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, transparent 42%, rgba(0,0,0,0.45) 100%)",
          }}
        />
      </motion.div>

      {/* Glossy specular highlight */}
      <div
        className="absolute rounded-full"
        style={{
          width: s * 0.42,
          height: s * 0.16,
          left: "16%",
          top: "13%",
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.18) 55%, transparent 75%)",
          filter: "blur(2px)",
          transform: "rotate(-24deg)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: s * 0.16,
          height: s * 0.07,
          left: "30%",
          top: "17%",
          background: "rgba(255,255,255,0.6)",
          filter: "blur(1px)",
        }}
      />

      {/* Rim light */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: `inset 0 1px ${s * 0.02}px rgba(255,255,255,0.28), 0 0 ${s * 0.16}px -8px ${pal.glow}`,
        }}
      />

      {/* Rising particles / motes inside the liquid */}
      {alive &&
        [0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              width: s * 0.02 + i * s * 0.004,
              height: s * 0.02 + i * s * 0.004,
              left: `${22 + i * 13}%`,
              bottom: "18%",
              background: `${pal.ring}`,
              filter: "blur(0.5px)",
            }}
            animate={{ y: [0, -s * 0.55], opacity: [0, 0.7, 0] }}
            transition={{
              duration: moteDur,
              repeat: Infinity,
              ease: "easeOut",
              delay: i * 0.55,
            }}
          />
        ))}

      {/* Pulsing outer glow that brightens as the mic hears you */}
      <motion.div
        className="absolute rounded-full"
        style={{ background: `radial-gradient(circle, ${pal.glow} 0%, transparent 65%)` }}
        animate={{ inset: [s * 0.35, s * 0.2, s * 0.35], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}