import { motion } from "framer-motion";
import { ArrowRight, Compass, Hammer, Rocket, Search } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Discover",
    description:
      "We start by understanding your goals, your business and what success actually looks like. No jargon, no assumptions — just clarity.",
  },
  {
    icon: Compass,
    step: "02",
    title: "Strategize",
    description:
      "A clear plan, a defined scope and a transparent quote. You know exactly what you're getting before anything is built.",
  },
  {
    icon: Hammer,
    step: "03",
    title: "Build",
    description:
      "We design, build and iterate in visible milestones — keeping you in the loop at every step until it's right.",
  },
  {
    icon: Rocket,
    step: "04",
    title: "Launch & Grow",
    description:
      "You go live with support and training included, plus a roadmap for improving the system as your business grows.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

export default function Process() {
  return (
    <section id="process" className="section">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            From idea to launch in four clear steps.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            A clear, predictable process — so working with technology feels like
            working with a partner, not a mystery.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.step}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
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

        <motion.div
          {...fadeUp}
          className="card mt-8 flex flex-col items-center justify-between gap-4 !p-7 text-center sm:flex-row sm:text-left"
        >
          <div>
            <p className="text-lg font-semibold text-white">Ready to start your project?</p>
            <p className="mt-1 text-sm text-muted">
              Tell us where you want to go — we&apos;ll map the path from idea to launch.
            </p>
          </div>
          <a href="#contact" className="btn-primary group shrink-0">
            Start Your Project
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
          </a>
        </motion.div>
      </div>
    </section>
  );
}