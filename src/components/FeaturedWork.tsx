import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Sparkles, Video, GraduationCap, Bot } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ImageWithFallback from "./ImageWithFallback";

interface Project {
  name: string;
  category: string;
  desc: string;
  tech: string[];
  href: string;
  media: string;
  icon: LucideIcon;
}

const PROJECTS: Project[] = [
  {
    name: "Wino",
    category: "AI Product",
    desc: "An AI video creation platform that turns prompts and images into ready-to-publish videos.",
    tech: ["AI generation", "Product platform"],
    href: "/wino",
    media: "/wino/thumbs/showcase-matrix.jpg",
    icon: Video,
  },
  {
    name: "Wisnotech Studios",
    category: "Creative Production",
    desc: "An AI-powered production studio delivering cinematic ads, UGC, trailers and social content.",
    tech: ["AI video", "Creative direction"],
    href: "/portfolio",
    media: "/portfolio/thumbs/dune-trailer.jpg",
    icon: Sparkles,
  },
  {
    name: "Wisne — AI Assistant",
    category: "AI Product",
    desc: "A live AI advisor that answers questions, quotes projects and even talks on a call.",
    tech: ["Chat", "Voice", "Live AI"],
    href: "#assistant",
    media: "/assets/ai-images/1.jpeg",
    icon: Bot,
  },
  {
    name: "Wisnotech AI Academy",
    category: "Education Platform",
    desc: "Hands-on courses in AI, automation, prompt engineering and video production.",
    tech: ["Courses", "Practical training"],
    href: "/#/academy",
    media: "/assets/ai-images/2.jpeg",
    icon: GraduationCap,
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

export default function FeaturedWork() {
  return (
    <section id="work" className="section scroll-mt-20">
      <div className="container-wide">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">Selected work</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Built for real-world problems.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Explore selected digital products, platforms and creative technology
              projects built by Wisnotech.
            </p>
          </div>
          <a
            href="/portfolio"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-neon transition-colors hover:text-white"
          >
            See the full studio portfolio
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
          </a>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {PROJECTS.map((p) => (
            <motion.a
              key={p.name}
              href={p.href}
              {...fadeUp}
              className="group card flex flex-col overflow-hidden p-0"
            >
              {/* Large media */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0b0b0b]">
                <ImageWithFallback
                  src={p.media}
                  alt={`${p.name} — ${p.category}`}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  fallback={
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#14141c] to-[#0b0b0b]">
                      <p.icon className="h-10 w-10 text-white/25" aria-hidden />
                    </div>
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
                  <p.icon className="h-3 w-3 text-neon" aria-hidden />
                  {p.category}
                </span>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold tracking-tight text-white">{p.name}</h3>
                  <ArrowUpRight
                    className="h-5 w-5 shrink-0 text-white/35 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neon"
                    aria-hidden
                  />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.desc}</p>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/55"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-neon">
                  View Case Study
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}