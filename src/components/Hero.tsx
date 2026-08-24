import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Bot, Braces, GitBranch, Workflow, Zap } from "lucide-react";
import TiltCard from "./TiltCard";

const TRUST_LINE = ["AI Solutions", "Custom Software", "Automation", "Digital Growth"];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 600], [0, 45]);
  const y2 = useTransform(scrollY, [0, 600], [0, -30]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  return (
    <section id="home" className="relative overflow-hidden pb-20 pt-32 sm:pt-40">
      {/* Ambient glow — now with scroll-linked parallax */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ opacity }}>
        <motion.div
          className="absolute -left-40 top-0 h-[520px] w-[520px] rounded-full opacity-30 blur-3xl"
          style={{ y: y1, background: "radial-gradient(circle, rgba(59,123,255,0.28) 0%, transparent 65%)" }}
        />
        <motion.div
          className="absolute -right-32 bottom-0 h-[480px] w-[480px] rounded-full opacity-20 blur-3xl"
          style={{ y: y2, background: "radial-gradient(circle, rgba(139,122,255,0.24) 0%, transparent 65%)" }}
        />
        <div
          className="absolute left-1/2 top-0 h-px w-[min(920px,92%)] -translate-x-1/2"
          style={{ background: "linear-gradient(90deg, transparent, rgba(80,140,255,0.35), transparent)" }}
        />
        {/* Subtle particle field — 12 dots drifting */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white/20"
              style={{
                left: `${8 + i * 7.5}%`,
                top: `${12 + (i % 3) * 22}%`,
              }}
              animate={{ y: [0, -10, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            />
          ))}
        </div>
      </motion.div>

      <div className="container-wide relative grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-2xl">
          <motion.p variants={item} className="eyebrow">
            AI &bull; Software &bull; Automation
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-6 text-[clamp(2.9rem,6.5vw,4.6rem)] font-bold leading-[1.04] tracking-tight text-white"
          >
            Build Smarter.
            <br />
            Automate Faster.
            <br />
            <span className="text-shimmer">Grow Bigger.</span>
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Wisnotech helps businesses use AI, software and automation to streamline
            operations, attract customers and build digital products that create real
            business value.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#contact" className="btn-primary group">
              Start a Project
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
            <a href="#work" className="btn-secondary group">
              View Our Work
            </a>
          </motion.div>

          <motion.p
            variants={item}
            className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-white/40"
          >
            {TRUST_LINE.join("  \u2022  ")}
          </motion.p>
        </motion.div>

        {/* Premium technology visual — now with 3D tilt and parallax */}
        <TiltCard intensity={8} className="relative mx-auto w-full max-w-[560px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full"
          >
          {/* Soft halo behind the panel */}
          <div
            aria-hidden
            className="absolute inset-8 rounded-[2rem]"
            style={{
              background: "radial-gradient(circle at 50% 40%, rgba(59,123,255,0.14) 0%, transparent 70%)",
            }}
          />

          <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-[#0b0b10]/80 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            {/* Window chrome */}
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
              <span className="ml-3 font-mono text-xs text-white/40">wisnotech.ai/workflow</span>
              <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Live
              </span>
            </div>

            <div className="space-y-3.5 p-5 sm:p-6">
              {/* Workflow nodes */}
              <div className="relative grid grid-cols-3 items-center gap-2">
                <div className="relative z-10 flex flex-col items-center rounded-xl border border-white/12 bg-white/[0.04] px-3 py-4 text-center">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon/15 text-neon">
                    <GitBranch className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="mt-2 text-xs font-medium text-white/80">Input</span>
                  <span className="text-[10px] text-white/40">Forms · Email · Docs</span>
                </div>

                <div className="relative z-10 flex flex-col items-center rounded-xl border border-neon/30 bg-neon/[0.07] px-3 py-4 text-center">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon text-[#080808]">
                    <Bot className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="mt-2 text-xs font-medium text-white">AI Engine</span>
                  <span className="text-[10px] text-white/45">Reasoning · Generation</span>
                </div>

                <div className="relative z-10 flex flex-col items-center rounded-xl border border-white/12 bg-white/[0.04] px-3 py-4 text-center">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-400">
                    <Zap className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="mt-2 text-xs font-medium text-white/80">Output</span>
                  <span className="text-[10px] text-white/40">CRM · Reports · Replies</span>
                </div>

                {/* Connecting lines with moving pulses */}
                <svg
                  aria-hidden
                  className="pointer-events-none absolute inset-x-8 top-1/2 -z-0 h-px w-[calc(100%-4rem)]"
                >
                  <line x1="0" y1="0" x2="100%" y2="0" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                </svg>
              </div>

              {/* Activity feed */}
              <div className="space-y-2 rounded-xl border border-white/10 bg-black/30 p-4">
                {[
                  { icon: Workflow, text: "Workflow completed — lead routed to CRM", tone: "text-white/75" },
                  { icon: Bot, text: "AI assistant replied to a customer in seconds", tone: "text-white/75" },
                  { icon: Braces, text: "Deployed new app build to production", tone: "text-white/55" },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-3 text-[13px]">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/[0.05] text-neon">
                      <row.icon className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <span className={row.tone}>{row.text}</span>
                  </div>
                ))}
              </div>

              {/* Footer bar */}
              <div className="flex items-center justify-between border-t border-white/10 pt-3.5">
                <span className="font-mono text-[11px] text-white/40">Processing…</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-white/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-neon" />
                  Built on modern AI + software
                </span>
              </div>
            </div>
          </div>

          {/* Floating chip — subtle, not overdone */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute -right-3 -top-4 hidden rounded-xl border border-white/12 bg-[#0c0c12]/90 px-4 py-2.5 shadow-xl backdrop-blur-xl sm:block"
          >
            <p className="flex items-center gap-2 text-xs font-medium text-white/80">
              <Zap className="h-3.5 w-3.5 text-emerald-400" aria-hidden />
              Automation that pays for itself
            </p>
          </motion.div>
          </motion.div>
          </TiltCard>
        </div>
      </section>
  );
}