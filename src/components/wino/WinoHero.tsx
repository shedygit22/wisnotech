import { motion } from "framer-motion";
import { ArrowDownToLine, PlayCircle } from "lucide-react";
import { WINO_DOWNLOAD_URL } from "../../lib/wino";
import { useReferral } from "../../lib/winoReferral";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

/**
 * WINO HERO — premium phone mockup on the right, headline + CTAs on the left.
 * The phone runs a CSS-only WINO "app" so no media (and no video) is required.
 */
export function WinoHero() {
  const { appendTo } = useReferral();
  const href = appendTo(WINO_DOWNLOAD_URL);

  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 75% 40%, rgba(255,255,255,0.05) 0%, transparent 60%)",
        }}
      />

      <div className="container-wide relative grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-xl">
          <motion.p variants={item} className="eyebrow">
            WINO by Wisnotech
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-6 text-[clamp(2.75rem,7vw,4.5rem)] font-bold leading-[1.02] tracking-tight text-white"
          >
            Create more.
            <br />
            Imagine without limits.
          </motion.h1>

          <motion.p variants={item} className="mt-6 text-lg leading-relaxed text-muted">
            WINO is a mobile-first AI video creation app for Android, built for
            African creators. Turn text and images into AI-generated videos with
            an affordable, credit-based model and smarter prompts.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
            {href ? (
              <a href={href} download className="btn-primary group">
                Download WINO
                <ArrowDownToLine className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden />
              </a>
            ) : (
              <a href="#download" className="btn-primary group">
                Download WINO
                <ArrowDownToLine className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden />
              </a>
            )}
            <a href="#showcase" className="btn-secondary group">
              <PlayCircle className="h-4 w-4" aria-hidden />
              Watch demos
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-semibold text-white">Android</span>
              <span className="text-sm text-white/40">First · Mobile</span>
            </div>
            <span className="hidden h-5 w-px bg-white/15 sm:block" aria-hidden />
            <div className="flex items-center gap-3">
              <span className="text-2xl font-semibold text-white">Credits</span>
              <span className="text-sm text-white/40">Start free</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Phone mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[360px]"
        >
          <div
            aria-hidden
            className="absolute inset-6 rounded-full"
            style={{
              background: "radial-gradient(circle at 50% 40%, rgba(80,140,255,0.14) 0%, transparent 60%)",
            }}
          />
          <PhoneMock />
        </motion.div>
      </div>
    </section>
  );
}

function PhoneMock() {
  return (
    <div className="relative z-10 mx-auto w-[280px] rounded-[2.5rem] border border-white/15 bg-[#0d0d14] p-2.5 shadow-[0_40px_90px_rgba(0,0,0,0.7)]">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#101019] to-[#0a0a10]">
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pb-2 pt-4">
          <span className="text-xs font-semibold text-white/70">WINO</span>
          <span className="h-4 w-16 rounded-full bg-white/10" aria-hidden />
        </div>

        {/* App visual */}
        <div className="px-5">
          <p className="eyebrow !text-[9px]">Now generating</p>
          <p className="mt-2 text-lg font-semibold leading-snug text-white">
            Lagos, golden hour
          </p>

          {/* Frame preview */}
          <div className="relative mt-4 aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1f33] via-[#0c1120] to-[#2b1b28]">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(60% 45% at 65% 25%, rgba(255,190,90,0.25) 0%, transparent 55%), radial-gradient(50% 60% at 20% 85%, rgba(90,140,255,0.18) 0%, transparent 60%)",
              }}
            />
            <div className="absolute left-4 right-4 top-4 flex items-center justify-between text-[10px] text-white/60">
              <span>00:02 / 00:08</span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-neon" aria-hidden /> HD
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4">
              <div className="flex items-center justify-center gap-1.5">
                {[22, 28, 18, 34, 26, 30, 20, 24].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 rounded-full bg-white/40"
                    style={{ height: `${h}px` }}
                    aria-hidden
                  />
                ))}
              </div>
            </div>
            <span className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#080808]">
              <PlayGlyph />
            </span>
          </div>

          <p className="mt-4 text-xs text-white/45">Prompt improved · ready to generate</p>
        </div>

        {/* Bottom actions */}
        <div className="mt-5 flex items-center justify-between px-5 pb-5">
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="rounded-xl border border-white/15 px-4 py-2 text-[11px] font-medium text-white/70"
          >
            Improve
          </button>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="rounded-xl bg-white px-5 py-2 text-[11px] font-semibold text-[#080808]"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}

function PlayGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path d="M5 3.5v9l7-4.5-7-4.5z" fill="currentColor" />
    </svg>
  );
}