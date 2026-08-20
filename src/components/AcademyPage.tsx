import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock, Check, GraduationCap, Users } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { COURSES } from "../lib/courses";

function formatNaira(n: number): string {
  return "₦" + n.toLocaleString("en-NG");
}

export default function AcademyPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-white">
      <Navbar />

      <main className="pt-20">
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
                      href={`#/courses/${c.slug}`}
                      className="btn-primary group/btn whitespace-nowrap"
                    >
                      View course
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

      <Footer />
    </div>
  );
}