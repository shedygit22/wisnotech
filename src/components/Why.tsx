import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Layers,
  Target,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";

interface Reason {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const REASONS: Reason[] = [
  {
    icon: BrainCircuit,
    title: "AI-First Thinking",
    desc: "AI is considered from the beginning of the project — not added as an afterthought.",
  },
  {
    icon: Target,
    title: "Business-Focused Development",
    desc: "Technology is designed around business objectives, workflows and customer needs.",
  },
  {
    icon: Zap,
    title: "Fast Execution",
    desc: "Modern development and AI-assisted workflows help turn ideas into working products faster.",
  },
  {
    icon: Layers,
    title: "One Technology Partner",
    desc: "Strategy, design, development, automation and digital growth under one roof.",
  },
  {
    icon: TrendingUp,
    title: "Built for Growth",
    desc: "Solutions are designed with scalability, maintainability and future expansion in mind.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

export default function Why() {
  return (
    <section id="why" className="section bg-white/[0.02]">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="eyebrow">Why Wisnotech</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            A technology partner, not just a vendor.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            We care about the outcome, not the checklist. Here&apos;s what makes
            working with Wisnotech different.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((r, i) => (
            <motion.div
              key={r.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.06 }}
              className="card flex h-full flex-col"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-neon/40 bg-neon/10 text-neon">
                <r.icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-white">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{r.desc}</p>
            </motion.div>
          ))}

          <motion.a
            href="#contact"
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.3 }}
            className="card group flex h-full flex-col justify-between border-dashed !p-7 hover:border-neon/40"
          >
            <p className="text-lg font-semibold text-white">
              Have a specific challenge?
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-neon">
              Start a project
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}