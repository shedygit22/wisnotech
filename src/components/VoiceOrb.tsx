import { useEffect, useRef } from "react";
import type { LiveStatus } from "../lib/liveCall";

interface VoiceOrbProps {
  /** Conversation state drives the orb mode. */
  status: LiveStatus;
  /** 0..1 smoothed user (mic) energy — live from the analyser. */
  energy?: number;
  /** 0..1 smoothed AI (playback) energy — live from the analyser. */
  aiEnergy?: number;
  /** Canvas box size in px (square). */
  size?: number;
  className?: string;
}

type RGB = [number, number, number];

export interface VoicePalette {
  core: RGB;
  glow: RGB;
  accent: RGB;
  rim: RGB;
}

export const VOICE_PALETTES: Record<LiveStatus, VoicePalette> = {
  off: {
    core: [18, 30, 60],
    glow: [59, 123, 255],
    accent: [120, 165, 255],
    rim: [150, 185, 255],
  },
  connecting: {
    core: [30, 42, 96],
    glow: [59, 123, 255],
    accent: [150, 170, 255],
    rim: [180, 195, 255],
  },
  listening: {
    core: [10, 56, 118],
    glow: [59, 150, 255],
    accent: [120, 190, 255],
    rim: [150, 205, 255],
  },
  thinking: {
    core: [36, 32, 110],
    glow: [125, 115, 255],
    accent: [180, 160, 255],
    rim: [200, 185, 255],
  },
  speaking: {
    core: [10, 58, 132],
    glow: [80, 165, 255],
    accent: [130, 200, 255],
    rim: [165, 215, 255],
  },
};

/** 0..1 pseudo-random, stable per index. */
function orbRand(index: number): number {
  const x = Math.sin(index * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function lerpRGB(a: RGB, b: RGB, t: number): RGB {
  t = Math.max(0, Math.min(1, t));
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function css(c: RGB, alpha: number): string {
  return `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${alpha})`;
}

interface Wave {
  age: number;
  amp: number;
}

const PARTICLE_COUNT = 46;

/**
 * The hero of the live-voice experience: a luminous, living orb rendered on a
 * canvas. It breathes on its own, and its scale, glow, outer ring, waves and
 * particle field are driven in real time by smoothed Web Audio analyser values
 * (`energy` = the user's mic, `aiEnergy` = Wisne's playback). Conversation
 * status selects the mode, but every mode flows into the next without cuts.
 */
export function VoiceOrb({
  status,
  energy = 0,
  aiEnergy = 0,
  size = 300,
  className,
}: VoiceOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Keep the live audio values accessible to the rAF loop without restarting it.
  const energyRef = useRef(energy);
  const aiEnergyRef = useRef(aiEnergy);
  energyRef.current = energy;
  aiEnergyRef.current = aiEnergy;
  const statusRef = useRef(status);
  statusRef.current = status;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = size / 2;
    const cy = size / 2;
    let raf = 0;
    let tick = 0;

    // Current blended palette — slides towards the target status palette.
    let cur: VoicePalette = { ...VOICE_PALETTES[status] };
    // Smoothed detection so animation responds with presence (fast attack, slow release).
    let smLevel = 0;
    let waveHold = 0;

    const waves: Wave[] = [];

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);

      const dt = Math.min(0.05, (now - tick) / 1000) || 0.016;
      tick = now;
      const seconds = now / 1000;

      const curStatus = statusRef.current;
      const target = VOICE_PALETTES[curStatus];

      // Seamless palette fade between states.
      const fade = 0.035;
      cur.core = lerpRGB(cur.core, target.core, fade);
      cur.glow = lerpRGB(cur.glow, target.glow, fade);
      cur.accent = lerpRGB(cur.accent, target.accent, fade);
      cur.rim = lerpRGB(cur.rim, target.rim, fade);

      // --- Audio drive (live analyser values, read every frame) ---
      const mic = Math.max(0, Math.min(1, energyRef.current));
      const ai = Math.max(0, Math.min(1, aiEnergyRef.current));
      // AI speech or the user talking: whichever is active animates the orb.
      const level = curStatus === "speaking" ? Math.max(mic, ai) : mic;
      smLevel += (level - smLevel) * (level > smLevel ? 0.28 : 0.07);
      const L = smLevel;

      ctx.clearRect(0, 0, size, size);

      const isOff = curStatus === "off";
      const isConnecting = curStatus === "connecting";
      const isListening = curStatus === "listening";
      const isThinking = curStatus === "thinking";
      const isSpeaking = curStatus === "speaking";

      // --- Breathing (always alive, never a static icon) ---
      const breathe =
        1 +
        Math.sin(seconds * 1.45) * 0.018 +
        Math.sin(seconds * 2.9 + 1.2) * 0.006 +
        (isOff ? 0 : Math.sin(seconds * 4.6) * 0.004 * L);

      const baseR = size * 0.3;
      const drive = isOff ? 0.12 : 0.8;
      const liveScale = isSpeaking ? Math.max(L, 0.35) : L;
      const R = baseR * breathe * (1 + liveScale * 0.22) * (0.7 + drive);

      // --- Soft outer atmosphere (aura) ---
      const auraR = R * (2.2 + L * 1.1);
      const aura = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, Math.max(R + 40, auraR));
      const auraAlpha = isOff ? 0.07 : 0.13 + L * 0.22;
      aura.addColorStop(0, css(cur.glow, auraAlpha));
      aura.addColorStop(0.5, css(cur.glow, auraAlpha * 0.55));
      aura.addColorStop(1, css(cur.glow, 0));
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, size, size);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      // --- Concentric wave ripples emitted at the rhythm of speech ---
      if (!isOff && !isConnecting) {
        waveHold += dt;
        const emitEvery = isSpeaking ? 0.34 : isListening ? 0.55 : 0.85;
        if (waveHold >= emitEvery && L > 0.06) {
          waveHold = 0;
          waves.push({ age: 0, amp: 0.25 + L * 0.6 });
          if (waves.length > 7) waves.shift();
        }
        for (let i = waves.length - 1; i >= 0; i--) {
          const w = waves[i];
          w.age += dt;
          const life = isThinking ? 2.2 : 1.6;
          const k = w.age / life;
          if (k >= 1) {
            waves.splice(i, 1);
            continue;
          }
          const speed = 1 + L * 1.4;
          const rr = R * 0.55 + R * 1.9 * k * speed;
          const alpha = Math.max(0, 1 - k) * (0.12 + w.amp * 0.25);
          ctx.strokeStyle = css(cur.glow, alpha);
          ctx.lineWidth = 1.5 + L * 2;
          ctx.beginPath();
          ctx.arc(cx, cy, Math.min(rr, size * 0.95), 0, Math.PI * 2);
          ctx.stroke();
          // Outer glow rim on the ripple
          ctx.strokeStyle = css(cur.accent, alpha * 0.25);
          ctx.lineWidth = 6 + L * 6;
          ctx.stroke();
        }
      }

      // --- Thinking: rotating energy flow instead of a solid disc ---
      if (isThinking) {
        const spin = seconds * 0.6;
        const RR = R * 0.86;
        const grad = ctx.createConicGradient(spin, cx, cy);
        grad.addColorStop(0, css(cur.glow, 0));
        grad.addColorStop(0.25, css(cur.accent, 0.65));
        grad.addColorStop(0.5, css(cur.glow, 0.15));
        grad.addColorStop(0.75, css(cur.accent, 0.4));
        grad.addColorStop(1, css(cur.glow, 0));
        ctx.strokeStyle = grad;
        ctx.lineWidth = Math.max(3, R * 0.12);
        ctx.beginPath();
        ctx.arc(cx, cy, RR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = css(cur.accent, 0.35);
        ctx.lineWidth = Math.max(2, R * 0.06);
        ctx.beginPath();
        ctx.arc(cx, cy, RR * 0.7, seconds * 1.4, seconds * 1.4 + Math.PI * 1.2);
        ctx.stroke();
      }

      // --- Volumetric orb core ---
      const coreGrad = ctx.createRadialGradient(
        cx - R * 0.28,
        cy - R * 0.32,
        R * 0.05,
        cx,
        cy,
        R
      );
      const hot = lerpRGB(cur.core, cur.accent, isOff ? 0.05 : 0.28 + L * 0.3);
      coreGrad.addColorStop(0, css(lerpRGB(hot, [255, 255, 255], 0.35 + L * 0.25), 1));
      coreGrad.addColorStop(0.45, css(hot, 0.95));
      coreGrad.addColorStop(1, css(cur.core, 0.88));
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      // Translucent liquid layers swirling inside (churn with voice)
      const blobCount = 3;
      for (let i = 0; i < blobCount; i++) {
        const a = seconds * (0.7 + i * 0.21) * (1 + L) + i * 2.1;
        const off = R * (0.24 + orbRand(i + 10) * 0.12);
        const bx = cx + Math.cos(a) * off;
        const by = cy + Math.sin(a * 1.1) * off * 0.8;
        const br = R * (0.5 + L * 0.3);
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        g.addColorStop(0, css(lerpRGB(cur.accent, [255, 255, 255], 0.25), 0.5 + L * 0.3));
        g.addColorStop(1, css(cur.accent, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
      }

      // Inner depth — soft lower-edge shadow
      const vignette = ctx.createRadialGradient(cx, cy, R * 0.35, cx, cy, R);
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(0.75, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.42)");
      ctx.fillStyle = vignette;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      // Specular highlight — glossy, non-cartoon light (ellipse via transform)
      ctx.save();
      ctx.translate(cx - R * 0.32, cy - R * 0.42);
      ctx.rotate(-0.5);
      ctx.scale(1, 0.55);
      const hi = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.42);
      hi.addColorStop(0, `rgba(255,255,255,${0.28 + L * 0.25})`);
      hi.addColorStop(0.55, `rgba(255,255,255,${0.05 + L * 0.06})`);
      hi.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = hi;
      ctx.beginPath();
      ctx.arc(0, 0, R * 0.42, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Rim light for a volumetric edge
      ctx.lineCap = "round";
      ctx.strokeStyle = css(cur.rim, 0.2 + L * 0.3);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, R - 0.5, -2.6, -0.6);
      ctx.stroke();

      // --- Listening: soft outer ring with subtle rotating dash ---
      if (!isOff && !isConnecting) {
        const ringR = R * (1.18 + (isThinking ? Math.sin(seconds * 2) * 0.02 : L * 0.1));
        const ringPulse = 0.22 + L * 0.4 + Math.sin(seconds * 2.4) * 0.12;
        ctx.strokeStyle = css(cur.accent, ringPulse);
        ctx.lineWidth = 1.4 + L * 1.4;
        ctx.beginPath();
        ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = css(cur.accent, ringPulse * 0.5);
        ctx.lineWidth = 3 + L * 2;
        ctx.setLineDash([2, 14]);
        ctx.lineDashOffset = -seconds * (6 + L * 14);
        ctx.beginPath();
        ctx.arc(cx, cy, ringR * 0.985, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // --- Fine particle / wisp cloud, energized by audio ---
      const count = isOff ? 16 : PARTICLE_COUNT;
      for (let i = 0; i < count; i++) {
        const r1 = orbRand(i);
        const r2 = orbRand(i + 40);
        const baseSpeed = 0.25 + r2 * 0.9;
        const angle = Math.PI * 2 * r1 + seconds * baseSpeed * (1 + L * 2.4);
        const ring = r2 > 0.5 ? 1.25 : 0.75;
        const orbitR = R * (0.62 + ring + L * 0.5) + 6;
        const px = cx + Math.cos(angle) * orbitR;
        const py = cy + Math.sin(angle * 1.15) * orbitR * 0.82;
        if (px < 0 || py < 0 || px > size || py > size) continue;
        const sparkR = 0.8 + r1 * 1.7 + L * 2.2;
        const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(seconds * (2 + r1 * 3) + r1 * 7));
        const alpha = (0.12 + L * 0.5) * twinkle * (isOff ? 0.35 : 1);

        const pg = ctx.createRadialGradient(px, py, 0, px, py, Math.max(1, sparkR * 2));
        pg.addColorStop(0, css(cur.accent, alpha));
        pg.addColorStop(1, css(cur.accent, 0));
        ctx.fillStyle = pg;
        ctx.beginPath();
        ctx.arc(px, py, Math.max(1, sparkR * 2), 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Wisp trails orbiting the rim (organic, breathing particles) ---
      const wisps = isOff ? 4 : 7;
      for (let i = 0; i < wisps; i++) {
        const a = seconds * (0.4 + i * 0.13) * (1 + L) + orbRand(i + 80) * Math.PI * 2;
        const wob = Math.sin(seconds * 1.8 + i * 2) * 0.5;
        const pr = R * 1.05 + wob * R * 0.12;
        const px = cx + Math.cos(a) * pr;
        const py = cy + Math.sin(a) * pr * 0.9;
        if (px < 0 || py < 0 || px > size || py > size) continue;
        const wa = (0.05 + L * 0.28) * (0.5 + 0.5 * Math.sin(seconds * 2 + i * 2));
        const wg = ctx.createRadialGradient(px, py, 0, px, py, R * 0.16);
        wg.addColorStop(0, css(lerpRGB(cur.accent, cur.glow, 0.5), wa));
        wg.addColorStop(1, css(cur.accent, 0));
        ctx.fillStyle = wg;
        ctx.beginPath();
        ctx.arc(px, py, R * 0.16, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      canvas.width = 0;
      canvas.height = 0;
    };
  }, [size]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: size,
        height: size,
        maskImage: "radial-gradient(circle, #000 58%, transparent 76%)",
        WebkitMaskImage: "radial-gradient(circle, #000 58%, transparent 76%)",
      }}
      aria-hidden
    />
  );
}