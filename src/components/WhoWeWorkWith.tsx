import { motion } from "framer-motion";
import { Building2, Handshake, Rocket, type LucideIcon } from "lucide-react";

interface Group {
  icon: LucideIcon;
  title: string;
  intro: string;
  points: string[];
}

const GROUPS: Group[] = [
  {
    icon: Rocket,
    title: "Startups",
    intro: "For founders who need to move from idea to working product — fast.",
    points: ["MVP development", "SaaS products", "AI applications"],
  },
  {
    icon: Building2,
    title: "Small & Medium Businesses",
    intro: "For businesses that want to run smarter and grow consistently.",
    points: ["Business automation", "Management systems", "Customer acquisition"],
  },
  {
    icon: Handshake,
    title: "Agencies",
    intro: "For teams that need reliable technical power behind their services.",
    points: ["White-label development", "AI implementation", "Technical support"],
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

export default function WhoWeWorkWith() {
  return (
    <section id="who" className="section">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="eyebrow">Who we work with</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Built for businesses ready to move forward.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            From first-time founders to established teams — we size the work to
            your stage.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {GROUPS.map((g, i) => (
            <motion.div
              key={g.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className="card flex h-full flex-col"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-neon/40 bg-neon/10 text-neon">
                <g.icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-white">{g.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{g.intro}</p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {g.points.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm text-white/85">
                    <span className="h-1.5 w-1.5 rounded-full bg-neon" aria-hidden />
                    {p}
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