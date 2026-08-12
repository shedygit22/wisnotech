import { useEffect, useRef } from "react";
import type { LiveStatus } from "../lib/liveCall";
import { VOICE_PALETTES, type VoicePalette } from "./VoiceOrb";

const MOTES = 64;

/**
 * Living ambient backdrop for the live voice call: layered aurora glows whose
 * hue follows the conversation status, a slow drift of floating dust motes and
 * a soft vignette. Pure canvas, capped DPR for smooth mobile performance.
 */
export function AuroraField({ status }: { status: LiveStatus }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const statusRef = useRef(status);
  statusRef.current = status;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = Math.max(1, Math.min(1.5, window.devicePixelRatio || 1));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Pre-seeded motes (stable across frames).
    const motes = Array.from({ length: MOTES }, (_, i) => {
      let seed = i * 97.13 + 13.7;
      const rnd = () => {
        seed = (seed * 16807) % 2147483647;
        return seed / 2147483647;
      };
      return {
        x: rnd(),
        y: rnd(),
        z: 0.3 + rnd() * 0.7, // depth → size + opacity
        drift: 0.006 + rnd() * 0.02,
        tw: rnd() * Math.PI * 2,
        twSpeed: 0.3 + rnd() * 0.8,
      };
    });

    let raf = 0;
    let tick = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - tick) / 1000) || 0.016;
      tick = now;
      const seconds = now / 1000;
      const pal: VoicePalette = VOICE_PALETTES[statusRef.current];

      // Base near-black with a whisper of the status tint.
      ctx.fillStyle = "#030409";
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      // Aurora pools drifting slowly.
      const pools = [
        { px: 0.5, py: 0.44, r: 0.62, tx: 0.55, ty: 0.5, a: 0.5 },
        { px: 0.2, py: 0.1, r: 0.55, tx: 0.18, ty: 0.08, a: 0.34 },
        { px: 0.85, py: 0.16, r: 0.5, tx: 0.8, ty: 0.2, a: 0.3 },
      ];
      for (let i = 0; i < pools.length; i++) {
        const p = pools[i];
        const ax = p.px + Math.sin(seconds * 0.07 + i * 2.1) * 0.05;
        const ay = p.py + Math.cos(seconds * 0.05 + i * 1.7) * 0.05;
        const rr = Math.max(width, height) * p.r;
        const pulse = 0.8 + Math.sin(seconds * 0.4 + i * 1.3) * 0.2;
        const g = ctx.createRadialGradient(
          ax * width,
          ay * height,
          0,
          ax * width,
          ay * height,
          rr
        );
        g.addColorStop(0, `rgba(${pal.glow[0]},${pal.glow[1]},${pal.glow[2]},${0.05 * pulse * p.a})`);
        g.addColorStop(1, `rgba(${pal.glow[0]},${pal.glow[1]},${pal.glow[2]},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
      }

      // Dust motes drifting slowly upward.
      for (const m of motes) {
        m.y -= m.drift * dt;
        m.tw += dt * m.twSpeed;
        if (m.y < -0.02) m.y = 1.02;
        const x = m.x * width;
        const y = m.y * height;
        const twinkle = 0.25 + 0.75 * Math.abs(Math.sin(m.tw));
        const size = (0.6 + m.z * 1.6) * (0.5 + twinkle * 0.5);
        const alpha = 0.06 * m.z * (0.4 + twinkle);
        const g = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
        g.addColorStop(0, `rgba(${pal.accent[0]},${pal.accent[1]},${pal.accent[2]},${alpha})`);
        g.addColorStop(1, `rgba(${pal.accent[0]},${pal.accent[1]},${pal.accent[2]},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Vignette + soft floor light.
      const vig = ctx.createRadialGradient(
        width * 0.5,
        height * 0.46,
        Math.min(width, height) * 0.2,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75
      );
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, width, height);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}