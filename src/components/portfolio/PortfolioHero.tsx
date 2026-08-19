import { motion } from "framer-motion";
import { ArrowDown, Clapperboard, Layers, Sparkles } from "lucide-react";
import { PORTFOLIO_SAMPLES } from "../../lib/portfolio";

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

  return (
    <section className="relative overflow-hidden pt-36 pb-20 sm:pt-40">
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
        className="container-wide relative mx-auto max-w-3xl text-center"
      >
        <motion.div variants={item} className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-white/70">
            <Sparkles className="h-3.5 w-3.5 text-neon" aria-hidden />
            AI Video Portfolio
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          className="mt-8 text-[clamp(2.75rem,7vw,4.75rem)] font-bold leading-[1.03] tracking-tight"
        >
          <span className="text-shimmer">AI-crafted motion,</span>
          <br />
          curated by hand.
        </motion.h1>

        <motion.p variants={item} className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          A personal collection of AI-generated videos and stills — text-to-video,
          image-to-video and character work. Every clip generated, curated and
                          graded for the story it tells.
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="#work" className="btn-primary group">
            <Clapperboard className="h-4 w-4" aria-hidden />
            Browse the work
          </a>
          <a href="/#contact" className="btn-secondary group">
            Commission a sample
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div variants={item} className="mx-auto mt-14 grid max-w-xl grid-cols-3 gap-4">
          <Stat value={String(videos)} label="Video samples" />
          <Stat value={String(categories)} label="Categories" />
          <Stat value="∞" label="Prompts behind it" />
        </motion.div>
      </motion.div>

      <motion.a
        href="#work"
        aria-label="Scroll to samples"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 transition-colors hover:text-white"
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
      <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted">
        <Layers className="h-3 w-3 text-neon/70" aria-hidden />
        {label}
      </p>
    </div>
  );
}