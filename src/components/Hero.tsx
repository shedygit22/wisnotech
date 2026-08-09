import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const TRUST_ITEMS = ["AI Solutions", "Automation", "Software", "Digital Innovation"];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Hero() {
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <section id="home" className="relative overflow-hidden pt-32 pb-16 sm:pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 72% 40%, rgba(255,255,255,0.05) 0%, transparent 60%)",
        }}
      />

      <div className="container-wide relative grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-xl"
        >
          <motion.p variants={item} className="eyebrow">
            AI &bull; Software &bull; Innovation
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-6 text-[clamp(3rem,7vw,4.5rem)] font-bold leading-[1.04] tracking-tight text-white"
          >
            Building What&apos;s Next With AI.
          </motion.h1>

          <motion.p variants={item} className="mt-6 text-lg leading-relaxed text-muted">
            Wisnotech helps businesses and ambitious people use AI and modern
            technology to build smarter, automate faster and grow with confidence.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#contact" className="btn-primary group">
              Start a Project
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#services" className="btn-secondary">
              Explore What We Do
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[650px]"
        >
          <div
            aria-hidden
            className="absolute inset-8 rounded-full"
            style={{
              background: "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.08) 0%, transparent 65%)",
            }}
          />
          <div className="relative">
            {!videoFailed ? (
              <div className="relative z-10 mx-auto max-w-[320px] overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
                <video
                  src="/videos/hero-digital-human.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  onError={() => setVideoFailed(true)}
                  className="block h-auto w-full object-cover"
                />
              </div>
            ) : (
              <WomanPlaceholder />
            )}
          </div>
        </motion.div>
      </div>

      <div className="container-wide mt-20 border-t border-white/10 pt-8">
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:justify-between">
          {TRUST_ITEMS.map((label, i) => (
            <li
              key={label}
              className="text-xs font-semibold uppercase tracking-[0.25em] text-white/35"
            >
              {i > 0 && <span className="mr-10 hidden text-white/20 sm:inline">/</span>}
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function WomanPlaceholder() {
  return (
    <div className="relative flex aspect-[4/5] w-full max-w-[560px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#151515] to-[#0b0b0b]">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.06) 0%, transparent 55%)",
        }}
      />
      <div className="relative text-center">
        <svg
          width="72"
          height="72"
          viewBox="0 0 24 24"
          fill="none"
          className="mx-auto text-white/20"
          aria-hidden
        >
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M4.5 19.5c1.2-3.6 4.1-5.5 7.5-5.5s6.3 1.9 7.5 5.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
        <p className="mt-4 text-sm text-white/30">
          Hero model placeholder — replace with your image
        </p>
      </div>
    </div>
  );
}