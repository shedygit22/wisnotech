import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { WINO_PLANS } from "../../lib/wino";
import { cn } from "../../lib/utils";

/**
 * PRICING PREVIEW — configurable via src/lib/wino.ts (WINO_PLANS).
 * Prices here are a preview and may change; edit them in the config only.
 */
export function Pricing() {
  return (
    <section id="pricing" className="section">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="eyebrow">Pricing Preview</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Plans that fit how creators create.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Start with trial credits, grow into packs, or pay as you go. Every
            plan includes prompt improvement so you spend credits wisely.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.08 }}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {WINO_PLANS.map((plan) => (
            <motion.article
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "card flex flex-col p-7",
                plan.featured && "border-neon/40 bg-gradient-to-b from-[#0b1324]/70 to-white/[0.03]"
              )}
            >
              {plan.featured && (
                <span className="mb-4 inline-flex w-fit items-center rounded-full border border-neon/40 bg-neon/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-neon">
                  Most popular
                </span>
              )}

              <h3 className="text-lg font-semibold tracking-tight text-white">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted">{plan.tagline}</p>

              <div className="mt-6">
                <p className="text-4xl font-semibold tracking-tight text-white">{plan.price}</p>
                <p className="mt-1 text-xs text-white/45">{plan.priceNote}</p>
              </div>

              <p className="mt-5 flex items-center gap-2 text-sm text-white/70">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-neon" aria-hidden />
                {plan.credits}
              </p>
              <p className="mt-1.5 text-sm text-white/45">~{plan.capacity}</p>

              <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white/70">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-neon" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#download"
                className={cn(
                  "mt-8 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-300",
                  plan.featured
                    ? "bg-white text-[#080808] hover:bg-zinc-100"
                    : "border border-white/15 text-white hover:border-white/35 hover:bg-white/5"
                )}
              >
                {plan.ctaLabel}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </motion.article>
          ))}
        </motion.div>

        <p className="mt-8 text-center text-sm text-white/40">
          Final pricing, credit costs and availability will be confirmed at launch.
        </p>
      </div>
    </section>
  );
}