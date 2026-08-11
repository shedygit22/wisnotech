import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 6, suffix: "", label: "Service lines" },
  { value: 10, suffix: "+", label: "Showreel videos" },
  { value: 20, suffix: "+", label: "AI creations" },
  { value: 24, suffix: "h", label: "Response time" },
];

function useCountUp(end: number, start: boolean, duration = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(end * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, end, duration]);
  return n;
}

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const n = useCountUp(value, inView);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative flex flex-col items-center gap-1 border-white/10 px-4 py-6 text-center sm:border-l sm:py-8 first:border-l-0">
      <span className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {n}
        <span className="text-neon">{suffix}</span>
      </span>
      <span className="text-[13px] uppercase tracking-[0.18em] text-muted">{label}</span>
    </div>
  );
}

export default function StatsBar() {
  return (
    <section aria-label="Wisnotech at a glance" className="relative border-y border-white/[0.07] bg-white/[0.02]">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4"
        >
          {STATS.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}