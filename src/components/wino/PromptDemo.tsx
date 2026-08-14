import { motion } from "framer-motion";
import { ArrowRight, Coins, Wand2 } from "lucide-react";
import { PROMPT_DEMO } from "../../lib/wino";

/** PROMPT INTELLIGENCE — before/after prompt improvement demo. */
export function PromptDemo() {
  return (
    <section id="prompt-intelligence" className="section">
      <div className="container-wide">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Prompt Intelligence</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            A rough idea becomes a cinematic direction.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {PROMPT_DEMO.explanation}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-14 max-w-3xl"
        >
          {/* Original */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
              You type
            </p>
            <p className="mt-3 text-lg font-medium text-white/85">&quot;{PROMPT_DEMO.original}&quot;</p>
          </div>

          {/* Conversion */}
          <div className="flex items-center justify-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="-my-2 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-neon/40 bg-[#0b1324] text-neon shadow-[0_0_30px_-8px_rgba(80,140,255,0.7)]"
            >
              <Wand2 className="h-5 w-5" aria-hidden />
            </motion.span>
          </div>

          {/* Improved */}
          <div className="rounded-2xl border border-neon/30 bg-gradient-to-br from-[#0b1324]/90 to-[#0d0d16]/90 p-6 sm:p-8">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-neon">
              <Wand2 className="h-3.5 w-3.5" aria-hidden />
              WINO improves it to
            </p>
            <p className="mt-4 text-[15px] leading-[1.9] text-white/85">{PROMPT_DEMO.improved}</p>
            <p className="mt-4 flex items-center gap-2 text-sm text-white/45">
              <Coins className="h-4 w-4" aria-hidden />
              Get the prompt right first — then spend credits on generation.
            </p>
          </div>
        </motion.div>

        <div className="mt-8 flex justify-center">
          <a href="#download" className="btn-secondary group">
            Try WINO
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}