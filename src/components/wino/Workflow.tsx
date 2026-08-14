import { motion } from "framer-motion";
import { Lightbulb, Type, Wand2, Sparkles, Eye, Download } from "lucide-react";
import { WORKFLOW_STEPS } from "../../lib/wino";

const STEP_ICONS = [Lightbulb, Type, Wand2, Sparkles, Eye, Download];

/** CREATOR WORKFLOW — idea → download. */
export function Workflow() {
  return (
    <section id="workflow" className="section">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="eyebrow">Creator Workflow</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            From idea to video in six steps.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            A clear, mobile-friendly flow that keeps you creating, not stuck in menus.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WORKFLOW_STEPS.map((s, i) => {
            const Icon = STEP_ICONS[i % STEP_ICONS.length];
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="card relative"
              >
                <span className="absolute right-5 top-5 font-display text-4xl font-bold text-white/[0.06]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-neon">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-6 text-lg font-semibold tracking-tight text-white">{s.step}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.detail}</p>

                {i < WORKFLOW_STEPS.length - 1 && (
                  <Arrow />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <div className="pointer-events-none absolute -right-2.5 top-1/2 z-10 hidden -translate-y-1/2 lg:block" aria-hidden>
      <div className="flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-[#0a0a12]">
        <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
          <path d="M1 5h8M6 2l3 3-3 3" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}