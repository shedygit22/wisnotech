import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Workflow,
  Code2,
  MonitorSmartphone,
  GraduationCap,
  Video,
  Compass,
  type LucideIcon,
} from "lucide-react";
import { SERVICES } from "../lib/content";

const ICONS: Record<string, LucideIcon> = {
  workflow: Workflow,
  code: Code2,
  devices: MonitorSmartphone,
  education: GraduationCap,
  video: Video,
  compass: Compass,
};

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Services() {
  return (
    <section id="services" className="section">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="eyebrow">Services</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Technology built around your goals.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            From AI automation to custom software, we turn ideas and business
            challenges into practical digital solutions.
          </p>
        </div>

        <motion.div
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 [perspective:1400px]"
        >
          {SERVICES.map((service) => {
            const Icon = ICONS[service.icon] ?? Workflow;
            return (
              <motion.article
                key={service.title}
                variants={card}
                className="group h-full"
              >
                <ServiceFlip
                  Icon={Icon}
                  title={service.title}
                  description={service.description}
                />
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function ServiceFlip({
  Icon,
  title,
  description,
}: {
  Icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="relative h-full [transform-style:preserve-3d] transition-transform duration-700 group-hover:[transform:rotateY(180deg)]">
      {/* Front — in flow, defines card height */}
      <div className="card relative flex h-full min-h-[280px] flex-col [backface-visibility:hidden]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.04] to-transparent" />
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white/80 transition-colors duration-300 group-hover:border-neon/40 group-hover:text-neon">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <h3 className="mt-6 text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-muted">
          {description}
        </p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors group-hover:text-neon">
          Learn more
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </span>
      </div>

      {/* Back (flipped) */}
      <div className="absolute inset-0 flex flex-col items-start overflow-hidden rounded-2xl border border-neon/40 bg-gradient-to-br from-[#0b1324]/95 to-[#101018]/95 p-7 [backface-visibility:hidden] [transform:rotateY(180deg)] backdrop-blur-xl sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 80% 15%, rgba(80,140,255,0.22) 0%, transparent 55%)",
          }}
        />
        <span className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-neon/40 bg-neon/10 text-neon">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <h3 className="relative mt-6 text-lg font-semibold text-white">{title}</h3>
        <p className="relative mt-3 flex-1 text-[15px] leading-relaxed text-white/70">
          {description}
        </p>
        <a
          href="#contact"
          className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-neon transition-colors hover:text-white"
        >
          Start a project
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
        </a>
      </div>
    </div>
  );
}