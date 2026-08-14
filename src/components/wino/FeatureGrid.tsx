import { motion } from "framer-motion";
// Icons are only for surfacing — content always comes from the WINO config.
import { TextCursorInput, ImageUp, Image, Wand2, Smartphone, Coins, Download } from "lucide-react";
import { WINO_FEATURES } from "../../lib/wino";

const ICONS = [TextCursorInput, ImageUp, Image, Wand2, Smartphone, Coins, Download];

export function FeatureGrid() {
  return (
    <section id="features" className="section">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="eyebrow">Features</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Everything you need to create, on one phone.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            WINO is built for the way creators actually work — from a first idea
            to a finished, downloadable video, without leaving the app.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.08 }}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {WINO_FEATURES.map((f, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.article
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="card group"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-neon transition-colors duration-300 group-hover:border-neon/40">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-6 text-xl font-semibold tracking-tight text-white">{f.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{f.description}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}