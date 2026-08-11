import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Check, GraduationCap, Users } from "lucide-react";
import Logo from "./Logo";

interface Course {
  title: string;
  tagline: string;
  duration: string;
  level: string;
  format: string;
  usd: number;
  naira: number;
  topics: string[];
  featured?: boolean;
}

const COURSES: Course[] = [
  {
    title: "AI Fundamentals",
    tagline: "The zero-to-one foundation in artificial intelligence for complete beginners.",
    duration: "4 weeks",
    level: "Beginner",
    format: "Live + recorded",
    usd: 199,
    naira: 350000,
    topics: ["How AI actually works", "Using the best AI tools", "Prompting essentials", "Your first AI workflow"],
  },
  {
    title: "Automation & Workflow Specialist",
    tagline: "Automate repetitive business tasks with no-code tools, workflows and AI agents.",
    duration: "5 weeks",
    level: "Beginner–Intermediate",
    format: "Live + recorded",
    usd: 299,
    naira: 520000,
    topics: ["No-code automation tools", "Business process mapping", "AI customer support bots", "Workflow SOPs"],
  },
  {
    title: "AI Content Creation Pro",
    tagline: "Produce studio-grade videos, images and campaign content with AI.",
    duration: "5 weeks",
    level: "Beginner–Intermediate",
    format: "Live + recorded",
    usd: 249,
    naira: 430000,
    topics: ["AI video generation", "Avatars & talking heads", "AI image creation", "Content repurposing"],
  },
  {
    title: "Prompt Engineering & AI Agents",
    tagline: "Master advanced prompting and build autonomous AI agents that do real work.",
    duration: "4 weeks",
    level: "Intermediate",
    format: "Live + recorded",
    usd: 279,
    naira: 490000,
    topics: ["Advanced prompt design", "Chain-of-thought patterns", "Building AI agents", "Agent tooling & APIs"],
  },
  {
    title: "No-Code & App Building",
    tagline: "Build and launch functional web apps without writing code.",
    duration: "6 weeks",
    level: "Beginner",
    format: "Live + recorded",
    usd: 299,
    naira: 520000,
    topics: ["No-code platforms", "Databases & logic", "Launching your first app", "Monetization basics"],
  },
  {
    title: "AI for Business Growth",
    tagline: "A practical roadmap to apply AI across marketing, sales, operations and service.",
    duration: "5 weeks",
    level: "All levels",
    format: "Live + recorded",
    usd: 349,
    naira: 610000,
    topics: ["AI growth strategy", "Sales & marketing automation", "Customer experience", "ROI measurement"],
    featured: true,
  },
  {
    title: "Web Development Bootcamp",
    tagline: "From zero to building modern, production-ready websites that actually ship.",
    duration: "8 weeks",
    level: "Beginner",
    format: "Live + recorded",
    usd: 399,
    naira: 700000,
    topics: ["HTML, CSS & JavaScript", "React fundamentals", "Responsive design", "Deploying to production"],
  },
  {
    title: "Full-Stack Software Engineering",
    tagline: "A complete program covering front-end, back-end, APIs and AI integration.",
    duration: "12 weeks",
    level: "Intermediate",
    format: "Live + recorded",
    usd: 599,
    naira: 1050000,
    topics: ["Front-end with React", "Back-end & databases", "REST & GraphQL APIs", "Integrating AI features"],
    featured: true,
  },
];

function formatNaira(n: number): string {
  return "₦" + n.toLocaleString("en-NG");
}

export default function AcademyPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-white">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#080808]/85 backdrop-blur-md">
        <nav className="container-wide flex h-16 items-center justify-between py-4">
          <a href="#home" aria-label="Wisnotech home">
            <Logo />
          </a>
          <a
            href="#home"
            className="group inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/35 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
            Back to home
          </a>
        </nav>
      </header>

      <main className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(59,123,255,0.12),transparent_70%)]" />
          <div className="container-wide relative">
            <p className="eyebrow">Wisnotech Academy</p>
            <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
              Courses, pricing & <span className="text-neon">what you&apos;ll learn</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Practical, project-based training in AI, automation, content creation and software.
              All prices shown in US Dollars and Nigerian Naira.
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm text-white/50">
              <Clock className="h-4 w-4" aria-hidden />
              New cohorts start monthly · Live + recorded lessons
            </p>
          </div>
        </section>

        {/* Courses */}
        <section className="pb-24 md:pb-32">
          <div className="container-wide">
            <div className="grid gap-6 md:grid-cols-2">
              {COURSES.map((c, i) => (
                <motion.article
                  key={c.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: (i % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className={`card group flex flex-col rounded-2xl p-7 sm:p-8 ${
                    c.featured ? "border-neon/40" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-neon">
                      <GraduationCap className="h-6 w-6" aria-hidden />
                    </span>
                    {c.featured && (
                      <span className="rounded-full border border-neon/40 bg-neon/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-neon">
                        Popular
                      </span>
                    )}
                  </div>

                  <h2 className="mt-6 text-2xl font-semibold tracking-tight text-white">{c.title}</h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{c.tagline}</p>

                  <ul className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {c.topics.map((t) => (
                      <li key={t} className="flex items-center gap-2.5 text-sm text-white/80">
                        <Check className="h-4 w-4 shrink-0 text-neon/80" aria-hidden />
                        {t}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/10 pt-5 text-sm text-white/55">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-4 w-4" aria-hidden /> {c.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-4 w-4" aria-hidden /> {c.level}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" aria-hidden /> {c.format}
                    </span>
                  </div>

                  <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-3xl font-semibold tracking-tight text-white">
                        ${c.usd.toLocaleString("en-US")}
                        <span className="ml-2 text-sm font-normal text-white/45">
                          / {formatNaira(c.naira)}
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        One-time fee · Naira rate indicative of current exchange
                      </p>
                    </div>
                    <a
                      href="#contact"
                      className="btn-primary group/btn whitespace-nowrap"
                    >
                      Enquire / Enrol
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5"
                        aria-hidden
                      />
                    </a>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8">
        <div className="container-wide flex flex-col items-center justify-between gap-4 text-sm text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Wisnotech. All rights reserved.</p>
          <a href="#home" className="inline-flex items-center gap-1.5 transition-colors hover:text-white/70">
            Back to homepage
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </footer>
    </div>
  );
}