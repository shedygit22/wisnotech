import { motion } from "framer-motion";
import {
  AppWindow,
  Bot,
  BrainCircuit,
  Code2,
  Database,
  FileText,
  Globe,
  Layers,
  LineChart,
  MessageSquareText,
  PenTool,
  Plug,
  Repeat,
  Target,
  TrendingUp,
  Wrench,
  Workflow,
  type LucideIcon,
} from "lucide-react";

interface SubService {
  icon: LucideIcon;
  name: string;
  desc: string;
}

interface Pillar {
  icon: LucideIcon;
  name: string;
  intro: string;
  accent: string;
  services: SubService[];
}

const PILLARS: Pillar[] = [
  {
    icon: BrainCircuit,
    name: "AI",
    intro: "Practical AI built into your operations — not an afterthought.",
    accent: "#3b7bff",
    services: [
      { icon: AppWindow, name: "AI Applications", desc: "Custom AI tools built around your workflow." },
      { icon: Workflow, name: "AI Automation", desc: "Workflows that run repetitive tasks without you." },
      { icon: MessageSquareText, name: "AI Assistants", desc: "Support, sales and internal assistants that answer instantly." },
      { icon: FileText, name: "AI Content Systems", desc: "Produce on-brand content at scale." },
      { icon: Plug, name: "AI Integrations", desc: "Connect AI into the tools you already use." },
    ],
  },
  {
    icon: Code2,
    name: "SOFTWARE",
    intro: "Custom software engineered to scale with your business.",
    accent: "#8b7aff",
    services: [
      { icon: AppWindow, name: "Custom Web Applications", desc: "Apps built around how your business actually works." },
      { icon: Layers, name: "SaaS Development", desc: "Multi-tenant platforms built to launch and scale." },
      { icon: Database, name: "Business Management Systems", desc: "One system for orders, clients, stock and operations." },
      { icon: Wrench, name: "Internal Tools", desc: "Private tools that remove friction from your team." },
      { icon: Globe, name: "Websites & Platforms", desc: "Fast, conversion-focused sites and platforms." },
    ],
  },
  {
    icon: TrendingUp,
    name: "GROWTH",
    intro: "Digital systems designed to attract, capture and convert.",
    accent: "#2dd4bf",
    services: [
      { icon: Target, name: "Conversion-Focused Websites", desc: "Sites built to turn visitors into customers." },
      { icon: LineChart, name: "Lead Generation Systems", desc: "Digital systems that attract, capture and convert." },
      { icon: PenTool, name: "Content Systems", desc: "AI-powered content engines for marketing at scale." },
      { icon: Repeat, name: "Business Automation", desc: "End-to-end automation of your operations." },
      { icon: Bot, name: "AI Marketing Tools", desc: "The stack behind predictable digital growth." },
    ],
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

export default function Services() {
  return (
    <section id="services" className="section scroll-mt-20 bg-white/[0.02]">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="eyebrow">Services</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Technology that moves your business forward.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Three pillars, one partner — AI, software and growth systems working
            together toward your business outcomes.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {PILLARS.map((pillar) => (
            <motion.div
              key={pillar.name}
              {...fadeUp}
              className="card flex h-full flex-col p-7"
              style={{ borderTopColor: `${pillar.accent}55`, borderTopWidth: 2 }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: `${pillar.accent}1f`, color: pillar.accent }}
                >
                  <pillar.icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="text-lg font-bold tracking-tight text-white">{pillar.name}</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">{pillar.intro}</p>

              <ul className="mt-6 flex-1 space-y-1">
                {pillar.services.map((s) => (
                  <li
                    key={s.name}
                    className="group flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-white/[0.04]"
                  >
                    <span
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: `${pillar.accent}14`, color: pillar.accent }}
                    >
                      <s.icon className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-[14.5px] font-medium text-white">{s.name}</p>
                      <p className="text-[13px] leading-relaxed text-muted">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}