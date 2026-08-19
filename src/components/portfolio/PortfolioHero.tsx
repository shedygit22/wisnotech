import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Sparkles,
} from "lucide-react";
import { PORTFOLIO_SAMPLES } from "../../lib/portfolio";
import { cn } from "../../lib/utils";

const SLIDES = [
  { src: "/portfolio/videos/dune-trailer.mp4", poster: "/portfolio/thumbs/dune-trailer.jpg", label: "A Desert Epic" },
  { src: "/wino/videos/seedance-demo.mp4", poster: "/wino/thumbs/seedance-demo.jpg", label: "The Wide Frame" },
  { src: "/portfolio/videos/web-demo.mp4", poster: "/portfolio/thumbs/web-demo.jpg", label: "Cinema Without Cameras" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export function PortfolioHero() {
  const videos = PORTFOLIO_SAMPLES.filter((s) => s.type === "video").length;
  const categories = new Set(PORTFOLIO_SAMPLES.map((s) => s.category)).size;
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const total = SLIDES.length;

  const go = (next: number) => {
    setIndex(((next % total) + total) % total);
    setProgress(0);
  };

  const onTime = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const el = e.currentTarget;
    if (el.dataset.slide !== String(index)) return;
    setProgress(el.duration ? el.currentTime / el.duration : 0);
  };

  const onEnded = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (e.currentTarget.dataset.slide === String(index)) go(index + 1);
  };

  return (
    <section className="relative overflow-hidden pt-36 pb-24 sm:pt-40">
      {/* Ambient hero slider — crossfades between featured clips */}
      <div aria-hidden className="absolute inset-0 opacity-45">
        <AnimatePresence initial={false}>
          <motion.video
            key={index}
            data-slide={index}
            autoPlay
            muted
            playsInline
            preload="auto"
            src={SLIDES[index].src}
            poster={SLIDES[index].poster}
            onTimeUpdate={onTime}
            onEnded={onEnded}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.9, ease: "easeInOut" }, scale: { duration: 6, ease: "linear" } }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
      </div>

      {/* Overlays keep the copy readable */}
      <div aria-hidden className="absolute inset-0 bg-[#080808]/50" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 35%, transparent 0%, rgba(8,8,8,0.55) 70%, #080808 100%)",
        }}
      />

      {/* Animated aurora backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="animate-aurora absolute -left-32 top-10 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(59,123,255,0.35) 0%, transparent 65%)" }}
        />
        <div
          className="animate-aurora absolute right-[-120px] top-40 h-[460px] w-[460px] rounded-full opacity-30 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(139,122,255,0.32) 0%, transparent 65%)",
            animationDelay: "-6s",
          }}
        />
        <div
          className="absolute bottom-0 left-1/2 h-px w-[min(720px,90%)] -translate-x-1/2"
          style={{ background: "linear-gradient(90deg, transparent, rgba(80,140,255,0.4), transparent)" }}
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container-wide relative z-10 mx-auto max-w-3xl text-center"
      >
        <motion.div variants={item} className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-white/70 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-neon" aria-hidden />
            Wisnotech — AI Video Studio
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          className="mt-8 text-[clamp(2.75rem,7vw,4.75rem)] font-bold leading-[1.03] tracking-tight"
        >
          <span className="text-shimmer">Video that sells.</span>
          <br />
          Scenes that stick.
        </motion.h1>

        <motion.p variants={item} className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          Wisnotech is a full AI video studio for brands, filmmakers and creators.
          We turn a single prompt into UGC ads, film scenes and channel content —
          produced, graded and ready to publish. No cameras. No waiting. No limits.
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="#contact" className="btn-primary group">
            Start a Project
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
          </a>
          <a href="#work" className="btn-secondary group">
            <Clapperboard className="h-4 w-4" aria-hidden />
            See the Work
          </a>
        </motion.div>

        {/* Proof stats */}
        <motion.div variants={item} className="mx-auto mt-14 grid max-w-xl grid-cols-3 gap-4">
          <Stat value={String(videos)} label="Pieces of work" />
          <Stat value={String(categories)} label="Disciplines" />
          <Stat value="48h" label="First cut" />
        </motion.div>
      </motion.div>

      {/* Slider controls — bottom-right, clear of the copy */}
      <div className="absolute bottom-5 right-4 z-20 flex flex-col items-end gap-2.5 sm:bottom-8 sm:right-8">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-2 py-1.5 backdrop-blur">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous clip"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>

          <div className="flex items-center gap-1.5" role="tablist" aria-label="Hero clips">
            {SLIDES.map((s, i) => (
              <button
                key={s.src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={s.label}
                onClick={() => go(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === index ? "w-5 bg-white" : "w-1.5 bg-white/35 hover:bg-white/60"
                )}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next clip"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <p className="text-xs text-white/70">
            {SLIDES[index].label}
            <span className="text-white/40"> · {index + 1}/{total}</span>
          </p>
          <div className="h-0.5 w-20 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-neon transition-[width] duration-200"
              style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
            />
          </div>
        </div>
      </div>

      <motion.a
        href="#work"
        aria-label="Scroll to the work"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-white/40 transition-colors hover:text-white"
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1 text-[10px] uppercase tracking-[0.3em]"
        >
          Scroll
          <ArrowDown className="h-4 w-4" aria-hidden />
        </motion.span>
      </motion.a>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 backdrop-blur-xl transition-colors duration-300 hover:border-white/25">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}