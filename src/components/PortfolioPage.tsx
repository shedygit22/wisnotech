import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowRight,
  Check,
  Film,
  Layers,
  Megaphone,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { applyPageMeta, breadcrumbSchema, orgSchema } from "../lib/seo";
import { sendLead } from "../lib/leadSink";
import { PORTFOLIO_CATEGORIES } from "../lib/portfolio";
import Logo from "./Logo";
import { PortfolioHero } from "./portfolio/PortfolioHero";
import { SamplesGrid } from "./portfolio/SamplesGrid";

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "Who it's for", href: "#audience" },
  { label: "Why Wisnotech", href: "#why" },
] as const;

const AUDIENCES = [
  {
    icon: Megaphone,
    title: "Brands scaling UGC",
    copy: "Produce on-brand AI UGC ads in days, not months — so you can test new creatives weekly without a shoot budget.",
    cta: "See ad-style work",
    filter: "ads-ugc",
  },
  {
    icon: Film,
    title: "Filmmakers & studios",
    copy: "From concept frames to shot-ready scenes, we build previs and footage that holds up in the edit — without a crew.",
    cta: "See film work",
    filter: "film",
  },
  {
    icon: Users,
    title: "Creators & channels",
    copy: "Consistent characters, consistent worlds, zero studio days. Feed your channel faster than you can plan it.",
    cta: "See social work",
    filter: "social-content",
  },
] as const;

const WHY = [
  {
    icon: Zap,
    title: "48-hour first cut",
    copy: "Concepts land in your inbox in days, not months. Speed is a feature of the process, not an afterthought.",
  },
  {
    icon: ShieldCheck,
    title: "Brand-safe control",
    copy: "We iterate on the prompt until the tone, face and feel are unmistakably yours. Nothing ships unapproved.",
  },
  {
    icon: Layers,
    title: "One brief, many formats",
    copy: "A single idea becomes a 9:16 cut for TikTok, a 16:9 cut for TV and a still set for ads — automatically.",
  },
  {
    icon: Target,
    title: "Built to convert",
    copy: "Every frame is made with a job to do — sell the product, sell the story, or stop the scroll. Proof over pixels.",
  },
] as const;

/** Client-converting AI video studio page — standalone at /portfolio. */
export default function PortfolioPage() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  useEffect(() => {
    applyPageMeta({
      title: "Wisnotech — AI Video Studio & Portfolio",
      description:
        "Wisnotech is a full AI video studio for brands, filmmakers and creators — text-to-video, image-to-video, character and film work, produced and ready to publish.",
      path: "/portfolio",
      type: "website",
      image: "https://wisnotech.vercel.app/assets/portfolio-og.jpg",
      jsonLd: [
        orgSchema(),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "AI Video Studio", path: "/portfolio" },
        ]),
      ],
    });
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-white">
      {/* Scroll progress */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-[#3b7bff] via-[#7aa5ff] to-[#3b7bff]"
        aria-hidden
      />

      {/* Cinematic texture — fixed grain + vignette over everything */}
      <div aria-hidden className="film-grain" />
      <div aria-hidden className="film-vignette" />

      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#080808]/85 backdrop-blur-md">
        <nav className="container-wide flex h-16 items-center justify-between py-4" aria-label="Studio navigation">
          <a href="/" aria-label="Wisnotech home" className="shrink-0">
            <Logo />
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-[#080808] transition-all hover:bg-zinc-100"
          >
            Start a Project
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </a>
        </nav>
      </header>

      <main>
        <PortfolioHero />

        {/* Capabilities ticker */}
        <div className="relative overflow-hidden border-y border-white/10 bg-white/[0.02] py-5">
          <div className="animate-marquee flex w-max items-center gap-10" aria-hidden>
            {[...PORTFOLIO_CATEGORIES, ...PORTFOLIO_CATEGORIES].map((c, i) => (
              <span key={`${c.id}-${i}`} className="flex items-center gap-10 whitespace-nowrap">
                <span className="text-sm font-medium uppercase tracking-[0.25em] text-white/55">
                  {c.label}
                </span>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.accent }} />
              </span>
            ))}
          </div>
        </div>

        {/* Who it's for */}
        <section id="audience" className="section scroll-mt-20">
          <div className="container-wide">
            <p className="eyebrow">Who this is for</p>
            <h2 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Made for the teams moving at the speed of culture.
            </h2>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {AUDIENCES.map((a) => (
                <motion.a
                  key={a.title}
                  href="#work"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="group card relative block overflow-hidden p-8"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05]">
                    <a.icon className="h-5 w-5 text-neon" aria-hidden />
                  </span>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-white">{a.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{a.copy}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-neon">
                    {a.cta}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        <SamplesGrid />

        {/* Why Wisnotech */}
        <section id="why" className="section scroll-mt-20 bg-white/[0.02]">
          <div className="container-wide">
            <p className="eyebrow">Why Wisnotech</p>
            <h2 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
              A studio without a set. A pipeline without a pause.
            </h2>
            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {WHY.map((w, i) => (
                <div key={w.title} className="relative">
                  <span
                    aria-hidden
                    className="outline-text absolute -top-9 right-2 text-7xl font-bold"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-7"
                  >
                    <w.icon className="h-6 w-6 text-neon" aria-hidden />
                    <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">{w.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted">{w.copy}</p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA / contact */}
        <section id="contact" className="section scroll-mt-20">
          <div className="container-wide">
            <div className="card relative overflow-hidden p-10 text-center sm:p-16">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 50% 60% at 50% 0%, rgba(59,123,255,0.14) 0%, transparent 65%)",
                }}
              />
              <div className="relative mx-auto max-w-2xl">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.05]">
                  <Sparkles className="h-6 w-6 text-neon" aria-hidden />
                </span>
                <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  Tell us the story. We&apos;ll make it move.
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-muted">
                  Send the brief — a product, a scene, a character, a vibe. We&apos;ll
                  reply within 24 hours with a plan, a timeline and a first direction.
                </p>
                <CommissionForm />
                <p className="mt-6 text-sm text-white/45">
                  Prefer email? Write to us directly at{" "}
                  <a href={`mailto:wisnotech@gmail.com`} className="text-neon underline decoration-neon/30 underline-offset-4 hover:decoration-neon">
                    wisnotech@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0a0a0a]">
        <div className="container-wide py-14 md:py-16">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-sm">
              <a href="/" aria-label="Wisnotech home">
                <Logo />
              </a>
              <p className="mt-3 text-sm leading-relaxed text-white/50">
                The AI video studio for brands, filmmakers and creators.
                From prompt to premier.
              </p>
            </div>

            <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3" aria-label="Studio footer navigation">
              <ul className="space-y-3">
                <li>
                  <a href="#work" className="text-sm text-white/55 transition-colors hover:text-white">
                    The work
                  </a>
                </li>
                <li>
                  <a href="#audience" className="text-sm text-white/55 transition-colors hover:text-white">
                    Who it&apos;s for
                  </a>
                </li>
                <li>
                  <a href="#why" className="text-sm text-white/55 transition-colors hover:text-white">
                    Why Wisnotech
                  </a>
                </li>
              </ul>
              <ul className="space-y-3">
                <li>
                  <a href="/" className="text-sm text-white/55 transition-colors hover:text-white">
                    Wisnotech
                  </a>
                </li>
                <li>
                  <a href="/blog" className="text-sm text-white/55 transition-colors hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="/#/academy" className="text-sm text-white/55 transition-colors hover:text-white">
                    Academy
                  </a>
                </li>
              </ul>
              <ul className="space-y-3">
                <li>
                  <a href="#contact" className="text-sm text-white/55 transition-colors hover:text-white">
                    Start a project
                  </a>
                </li>
                <li>
                  <a href="/" className="text-sm text-white/55 transition-colors hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="/" className="text-sm text-white/55 transition-colors hover:text-white">
                    Terms
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
            <p className="text-sm text-white/40">© {new Date().getFullYear()} Wisnotech.</p>
            <p className="text-sm text-white/30">Made in Nigeria, for the world.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const EMAIL = "wisnotech@gmail.com";

function gmailHref(subject: string, body: string) {
  const params = new URLSearchParams({ view: "cm", fs: "1", to: EMAIL });
  params.set("su", subject);
  params.set("body", body);
  return `https://mail.google.com/mail/?${params.toString()}`;
}

/** Brief form — saves the lead to the Wisnotech spreadsheet, with an email fallback. */
function CommissionForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    need: "AI UGC ads",
    idea: "",
    budget: "Flexible",
    timeline: "Exploring",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "saved" | "email">("idle");

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const message = [form.company && `Company: ${form.company}`, form.idea].filter(Boolean).join("\n");
    const ok = await sendLead({
      name: form.name,
      email: form.email,
      interest: form.need,
      timeline: form.timeline,
      budget: form.budget,
      message,
      source: "portfolio-form",
    });
    if (ok) {
      setStatus("saved");
      return;
    }
    const subject = `New project brief from ${form.name}`;
    const body = `${form.need}\n${message}\n\n— ${form.name}\n${form.email}\nBudget: ${form.budget}\nTimeline: ${form.timeline}`;
    window.open(gmailHref(subject, body), "_blank", "noopener,noreferrer");
    setStatus("email");
  };

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-neon/50 focus:outline-none";

  if (status === "saved" || status === "email") {
    return (
      <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-8 text-left">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/15">
          <Check className="h-6 w-6 text-emerald-400" aria-hidden />
        </span>
        <h3 className="mt-5 text-xl font-semibold text-white">
          {status === "saved" ? "Brief received — talk soon." : "Your email is ready to send."}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {status === "saved"
            ? "Your details are in our studio inbox. Expect a reply within 24 hours with a plan and a timeline."
            : "Our spreadsheet is briefly unreachable, so we opened a prefilled email instead — just hit send and we'll pick it up."}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-medium text-neon underline decoration-neon/30 underline-offset-4 hover:decoration-neon"
        >
          Send another brief
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="relative mx-auto mt-8 max-w-2xl space-y-3 text-left">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={form.name}
          onChange={set("name")}
          required
          placeholder="Your name"
          aria-label="Your name"
          className={inputCls}
        />
        <input
          value={form.email}
          onChange={set("email")}
          type="email"
          required
          placeholder="you@example.com"
          aria-label="Your email"
          className={inputCls}
        />
      </div>
      <input
        value={form.company}
        onChange={set("company")}
        placeholder="Company or brand (optional)"
        aria-label="Company or brand"
        className={inputCls}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <select
          value={form.need}
          onChange={set("need")}
          aria-label="What do you need"
          className={inputCls}
        >
          {["AI UGC ads", "Film / trailer work", "Social content", "Brand campaign", "Character / product film", "Something else"].map((o) => (
            <option key={o} value={o} className="bg-[#0d0d0d]">
              {o}
            </option>
          ))}
        </select>
        <select
          value={form.budget}
          onChange={set("budget")}
          aria-label="Budget"
          className={inputCls}
        >
          {["Under $500", "$500–$2,000", "$2,000–$5,000", "$5,000+", "Flexible"].map((o) => (
            <option key={o} value={o} className="bg-[#0d0d0d]">
              {o}
            </option>
          ))}
        </select>
        <select
          value={form.timeline}
          onChange={set("timeline")}
          aria-label="Timeline"
          className={inputCls}
        >
          {["ASAP", "2–4 weeks", "This quarter", "Exploring"].map((o) => (
            <option key={o} value={o} className="bg-[#0d0d0d]">
              {o}
            </option>
          ))}
        </select>
      </div>
      <textarea
        value={form.idea}
        onChange={set("idea")}
        required
        rows={3}
        placeholder="What should we make? Product, scene, character, vibe…"
        aria-label="Project idea"
        className={`${inputCls} resize-none`}
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary group w-full"
      >
        {status === "sending" ? (
          "Sending your brief…"
        ) : (
          <>
            Send the brief
            <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
          </>
        )}
      </button>
    </form>
  );
}