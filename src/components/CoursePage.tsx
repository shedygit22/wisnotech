import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Clock,
  GraduationCap,
  HelpCircle,
  Layers,
  Rocket,
  Sparkles,
  Users,
} from "lucide-react";
import Logo from "./Logo";
import { getCourseBySlug } from "../lib/courses";
import { sendLead } from "../lib/leadSink";
import { applyPageMeta, orgSchema, breadcrumbSchema, courseSchema } from "../lib/seo";

const EMAIL = "wisnotech@gmail.com";

const gmailHref = (subject: string, body: string) => {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: EMAIL,
    su: subject,
    body: body,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
};

interface CoursePageProps {
  slug: string;
}

const FAQS = [
  {
    q: "Am I too much of a beginner?",
    a: "No — every course starts from where you are and moves step by step. Live sessions go at the pace of the room, and everything is recorded so you can rewatch.",
  },
  {
    q: "What does 'live + recorded' mean?",
    a: "You join scheduled live sessions with the instructor, and every session is recorded for you to rewatch or catch up on anytime. Perfect if you work during class times.",
  },
  {
    q: "How do I pay?",
    a: "Pay once, upfront — no subscriptions. Prices are shown in US Dollars and Nigerian Naira. Payment details are shared after you register your interest.",
  },
  {
    q: "Will I get a certificate?",
    a: "Yes. Complete the course and you'll receive a certificate you can add to LinkedIn and your CV.",
  },
  {
    q: "What if I miss a session?",
    a: "No problem. Every live session is recorded, and you keep lifetime access to the course materials, community and updates.",
  },
];

export default function CoursePage({ slug }: CoursePageProps) {
  const course = useMemo(() => getCourseBySlug(slug), [slug]);

  const [form, setForm] = useState({ name: "", email: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [slug]);

  useEffect(() => {
    if (!course) return;
    applyPageMeta({
      title: `${course.title} — Wisnotech Academy`,
      description: course.tagline,
      path: `/courses/${course.slug}`,
      type: "product",
      jsonLd: [
        orgSchema(),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Academy", path: "/#/academy" },
          { name: course.title, path: `/courses/${course.slug}` },
        ]),
        courseSchema({
          name: course.title,
          description: course.tagline,
          path: `/courses/${course.slug}`,
          duration: course.duration,
          priceUsd: course.usd,
        }),
      ],
    });
  }, [course]);

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
        <p className="text-white/60">Course not found.</p>
        <a href="#/academy" className="btn-primary">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to all courses
        </a>
      </div>
    );
  }

  const enrollHref = "#enroll";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Enrolment interest — ${course.title}`;
    const body = `I'd like to enrol in ${course.title} (${course.duration}, ${course.format}).\n\n— ${form.name}\n${form.email}`;
    await sendLead({
      name: form.name,
      email: form.email,
      interest: `Course: ${course.title}`,
      message: `Enrolment interest in ${course.title}`,
      source: `course-page:${course.slug}`,
    });
    window.open(gmailHref(subject, body), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <div className="relative min-h-screen bg-background text-white">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#080808]/85 backdrop-blur-md">
        <nav className="container-wide flex h-16 items-center justify-between gap-4 py-4">
          <a href="#/academy" aria-label="Wisnotech Academy" className="shrink-0">
            <Logo />
          </a>
          <div className="flex items-center gap-3">
            <a
              href="#/academy"
              className="hidden items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/35 hover:text-white sm:inline-flex"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              All courses
            </a>
            <a href={enrollHref} className="btn-primary !px-5 !py-2 text-sm whitespace-nowrap">
              Enrol now
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </nav>
      </header>

      <main className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(59,123,255,0.14),transparent_70%)]" />
          <div className="container-wide relative">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/50">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-neon/40 bg-neon/10 px-3 py-1 text-neon">
                <GraduationCap className="h-3.5 w-3.5" aria-hidden />
                {course.badge ?? course.level}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
                {course.level}
              </span>
              {course.featured && (
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
                  Popular
                </span>
              )}
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
              {course.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
              {course.tagline}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/60">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-neon" aria-hidden /> {course.duration}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4 text-neon" aria-hidden /> {course.level}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-neon" aria-hidden /> {course.format}
              </span>
            </div>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a href={enrollHref} className="btn-primary group">
                Reserve my spot
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
              </a>
              <a href="#what-you-learn" className="btn-secondary">
                See what you&apos;ll learn
              </a>
            </div>

            <p className="mt-5 flex items-center gap-2 text-xs text-white/50">
              <Sparkles className="h-4 w-4 text-neon" aria-hidden />
              New cohorts start monthly · Live + recorded lessons · Certificate on completion
            </p>
          </div>
        </section>

        {/* What you'll learn */}
        <section id="what-you-learn" className="pb-24 md:pb-32">
          <div className="container-wide">
            <p className="eyebrow">What you&apos;ll learn</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Skills you can apply the same week
            </h2>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {course.topics.map((topic, i) => (
                <motion.div
                  key={topic}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: (i % 2) * 0.08 }}
                  className="card flex items-center gap-4 !p-5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neon/30 bg-neon/10 text-neon">
                    <Check className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="text-[15px] font-medium text-white/90">{topic}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Curriculum */}
        <section className="pb-24 md:pb-32">
          <div className="container-wide">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div className="max-w-xl">
                <p className="eyebrow">Curriculum</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  {course.duration} of step-by-step training
                </h2>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              {course.modules.map((mod, i) => (
                <motion.div
                  key={mod.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                  className="card !p-6"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-neon">
                      <Layers className="h-5 w-5" aria-hidden />
                    </span>
                    <div className="w-full">
                      <h3 className="text-lg font-semibold text-white">{mod.title}</h3>
                      <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                        {mod.lessons.map((lesson) => (
                          <li key={lesson} className="flex items-start gap-2.5 text-sm text-white/70">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-neon/80" aria-hidden />
                            {lesson}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Is this for you */}
        <section className="pb-24 md:pb-32">
          <div className="container-wide grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="eyebrow">Is this for you?</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                This course fits if…
              </h2>
              <ul className="mt-8 space-y-4">
                {course.areYou.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/80">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-neon/40 bg-neon/10 text-xs text-neon">
                      ✓
                    </span>
                    <span className="text-[15px] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="eyebrow">Outcomes</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                You&apos;ll leave with these
              </h2>
              <div className="mt-8 space-y-4">
                {course.outcomes.map((outcome) => (
                  <div key={outcome.title} className="card !p-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-neon/40 bg-neon/10 text-neon">
                        <Rocket className="h-4 w-4" aria-hidden />
                      </span>
                      <h3 className="text-base font-semibold text-white">{outcome.title}</h3>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{outcome.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Includes + Price + Enroll */}
        <section id="enroll" className="pb-24 md:pb-32">
          <div className="container-wide">
            <div className="card card-border-gradient relative overflow-hidden rounded-3xl p-8 sm:p-10">
              <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-neon/10 blur-[100px]" />
              <div className="relative grid gap-10 lg:grid-cols-2 lg:gap-16">
                <div>
                  <p className="eyebrow">Everything included</p>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                    What you get when you enrol
                  </h2>
                  <ul className="mt-8 space-y-4">
                    {course.includes.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-white/80">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-neon" aria-hidden />
                        <span className="text-[15px] leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card !p-0 overflow-hidden">
                  <div className="border-b border-white/10 p-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white/70">One-time payment</p>
                      {course.featured && (
                        <span className="rounded-full bg-neon/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-neon">
                          Most popular
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-5xl font-semibold tracking-tight">${course.usd.toLocaleString("en-US")}</span>
                      <span className="text-lg text-white/45">/ ₦{course.naira.toLocaleString("en-NG")}</span>
                    </div>
                    <p className="mt-3 text-xs text-muted">
                      No subscription. Naira rate indicative of current exchange. Certificate included.
                    </p>
                  </div>

                  <div className="p-6">
                    {!sent ? (
                      <form onSubmit={submit} className="space-y-3">
                        <input
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          required
                          placeholder="Your name"
                          aria-label="Your name"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-neon/50 focus:outline-none"
                        />
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          required
                          placeholder="you@example.com"
                          aria-label="Your email"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-neon/50 focus:outline-none"
                        />
                        <button type="submit" className="btn-primary group w-full">
                          Reserve my spot for ${course.usd.toLocaleString("en-US")}
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
                        </button>
                        <p className="text-center text-xs text-muted">
                          We&apos;ll confirm availability and payment details within one business day.
                        </p>
                      </form>
                    ) : (
                      <div className="flex flex-col items-center gap-3 py-8 text-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                          <Check className="h-6 w-6" aria-hidden />
                        </span>
                        <p className="text-lg font-semibold text-white">Almost there!</p>
                        <p className="max-w-xs text-sm text-muted">
                          We&apos;ve opened your email to confirm your interest in {course.title}. Reply and we&apos;ll
                          reserve your spot.
                        </p>
                        <a href="#/academy" className="group inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-white/70 transition-colors hover:text-neon">
                          Back to all courses
                          <ArrowUpRight className="h-4 w-4" aria-hidden />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Faq */}
        <section className="pb-24 md:pb-32">
          <div className="container-wide max-w-4xl">
            <p className="eyebrow text-center">Common questions</p>
            <h2 className="mt-4 text-center text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Before you enrol
            </h2>
            <div className="mt-10 space-y-3">
              {FAQS.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container-wide flex flex-col items-center justify-between gap-4 text-sm text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Wisnotech. All rights reserved.</p>
          <a href="#/academy" className="group inline-flex items-center gap-1.5 transition-colors hover:text-white/70">
            Back to all courses
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
          </a>
        </div>
      </footer>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card !p-0 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-5 py-4 text-left sm:px-6"
      >
        <HelpCircle className="h-5 w-5 shrink-0 text-neon" aria-hidden />
        <span className="flex-1 text-[15px] font-medium text-white">{q}</span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/60 transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
          aria-hidden
        >
          +
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 pl-14 text-sm leading-relaxed text-muted sm:px-6 sm:pl-[70px]">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}