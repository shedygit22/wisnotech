import { motion } from "framer-motion";
import { Workflow, Code2, TrendingUp, Megaphone, type LucideIcon } from "lucide-react";

const PROBLEMS: { icon: LucideIcon; title: string; copy: string }[] = [
  {
    icon: Workflow,
    title: "Automate Your Business",
    copy: "Replace repetitive manual tasks with intelligent AI-powered workflows that run themselves.",
  },
  {
    icon: Code2,
    title: "Build Your Software",
    copy: "Turn your idea into a scalable web app, SaaS platform or internal business tool.",
  },
  {
    icon: TrendingUp,
    title: "Generate More Customers",
    copy: "Build digital systems designed to attract, capture and convert prospects.",
  },
  {
    icon: Megaphone,
    title: "Create Content at Scale",
    copy: "Use AI-powered content systems to produce more marketing content without expanding your team.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

export default function Problems() {
  return (
    <section id="solutions" className="section scroll-mt-20">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="eyebrow">What are you trying to solve?</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            What are you trying to solve?
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Every project starts with a business problem. Tell us yours — we&apos;ll
            bring the technology.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROBLEMS.map((p) => (
            <motion.div key={p.title} {...fadeUp} className="card group p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] transition-colors duration-300 group-hover:border-neon/40">
                <p.icon className="h-5 w-5 text-neon" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}