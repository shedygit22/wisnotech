import { motion } from "framer-motion";
import { Search, MapPin, Hammer, Rocket } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Discover",
    description:
      "A short call to understand your goal, audience and what success looks like — no jargon, no pressure.",
  },
  {
    icon: MapPin,
    step: "02",
    title: "Plan",
    description:
      "A concrete scope, timeline and transparent quote. You always know exactly what you're getting.",
  },
  {
    icon: Hammer,
    step: "03",
    title: "Build",
    description:
      "We design, build and iterate in clear milestones, keeping you in the loop at every step.",
  },
  {
    icon: Rocket,
    step: "04",
    title: "Launch & grow",
    description:
      "You go live with support and training included — plus a roadmap for scaling what works.",
  },
];

export default function Process() {
  return (
    <section id="process" className="section bg-white/[0.02]">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="eyebrow">How we work</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            From idea to launch in four steps.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            A clear, predictable process — so working with AI feels like working with a
            partner, not a mystery.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="card group relative flex h-full flex-col"
            >
              <span className="absolute right-6 top-6 text-4xl font-bold text-white/[0.06] transition-colors group-hover:text-neon/20">
                {s.step}
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-neon/40 bg-neon/10 text-neon transition-shadow group-hover:shadow-[0_0_20px_-6px_rgba(80,140,255,0.6)]">
                <s.icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}