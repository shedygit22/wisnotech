import { motion } from "framer-motion";
import {
  Bot,
  Workflow,
  Layers,
  Globe,
  Smartphone,
  Sparkles,
  Package,
  Cpu,
  type LucideIcon,
} from "lucide-react";
import { SOLUTIONS } from "../lib/content";

const ICONS: Record<string, LucideIcon> = {
  bot: Bot,
  workflow: Workflow,
  layers: Layers,
  globe: Globe,
  smartphone: Smartphone,
  sparkles: Sparkles,
  package: Package,
  cpu: Cpu,
};

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Solutions() {
  return (
    <section id="solutions" className="section bg-surface/40">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="eyebrow">Solutions</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            What we can build.
          </h2>
        </div>

        <motion.ul
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {SOLUTIONS.map((solution) => {
            const Icon = ICONS[solution.icon] ?? Layers;
            return (
              <motion.li
                key={solution.label}
                variants={item}
                className="group flex items-center gap-4 rounded-xl border border-white/[0.08] bg-[#111111] px-5 py-5 transition-colors hover:border-white/20 hover:bg-[#151515]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white/60 transition-colors group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="text-[15px] font-medium text-white/85">{solution.label}</span>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}