import { motion } from "framer-motion";
import { MapPin, Smartphone, Coins } from "lucide-react";

const PILLARS = [
  {
    icon: Smartphone,
    title: "Mobile-first by design",
    description:
      "A generation workflow that fits a phone screen, an unstable connection, and the reality of creating on the go.",
  },
  {
    icon: Coins,
    title: "Made to stay affordable",
    description:
      "Flexible credits and starter packs designed around what creators actually spend — not enterprise prices.",
  },
  {
    icon: MapPin,
    title: "Built with African creators in mind",
    description:
      "Local context, local stories and usable AI — from Lagos streets to Nollywood energy to brand content.",
  },
];

/** AFRICA-FIRST — honest positioning, no stereotypes. */
export function AfricaSection() {
  return (
    <section id="africa" className="section">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="eyebrow">Africa-first</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Built with African creators in mind.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            WINO is designed around the way creators in Africa actually work —
            generous mobile-first tools, affordable credit-based access and AI
            video creation that doesn&apos;t require a studio, a desktop or a big budget.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="card"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-neon">
                <p.icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-6 text-lg font-semibold tracking-tight text-white">{p.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}