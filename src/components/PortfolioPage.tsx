import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, Clapperboard, Send, Check } from "lucide-react";
import { applyPageMeta, breadcrumbSchema, orgSchema } from "../lib/seo";
import { sendLead } from "../lib/leadSink";
import { PORTFOLIO_CATEGORIES } from "../lib/portfolio";
import { PortfolioHero } from "./portfolio/PortfolioHero";
import { SamplesGrid } from "./portfolio/SamplesGrid";

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "Categories", href: "#work" },
  { label: "Wisnotech", href: "/" },
] as const;

/** Personal AI video samples portfolio — standalone page at /portfolio. */
export default function PortfolioPage() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  useEffect(() => {
    applyPageMeta({
      title: "AI Video Samples Portfolio | Wisnotech",
      description:
        "A personal portfolio of AI-generated video samples by Wisnotech — text-to-video, image-to-video, character and cinematic work, curated and ready to browse.",
      path: "/portfolio",
      type: "website",
      image: "https://wisnotech.vercel.app/assets/portfolio-og.jpg",
      jsonLd: [
        orgSchema(),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "AI Video Samples Portfolio", path: "/portfolio" },
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

      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#080808]/85 backdrop-blur-md">
        <nav className="container-wide flex h-16 items-center justify-between py-4" aria-label="Portfolio navigation">
          <a href="/" aria-label="Wisnotech home">
            <span className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-bold text-sm text-[#080808]">
                P
              </span>
              <span className="text-sm font-semibold tracking-wide text-white">
                Samples <span className="font-normal text-white/40">by Wisnotech</span>
              </span>
            </span>
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
            href="/"
            className="group inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/35 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
            <span className="hidden sm:inline">Back to Wisnotech</span>
            <span className="sm:hidden">Home</span>
          </a>
        </nav>
      </header>

      <main>
        <PortfolioHero />

        {/* Marquee strip */}
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

        <SamplesGrid />

        {/* CTA */}
        <section className="section">
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
                  <Clapperboard className="h-6 w-6 text-neon" aria-hidden />
                </span>
                <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  Want motion like this in your brand?
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-muted">
                  Every sample here started as a prompt. Tell us what your product,
                  film or story needs — we'll craft the generation.
                </p>
                <CommissionForm />
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
              <span className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-bold text-sm text-[#080808]">
                  P
                </span>
                <span className="text-base font-semibold tracking-wide text-white">Samples</span>
              </span>
              <p className="mt-3 text-sm text-white/50">A Wisnotech creative portfolio.</p>
            </div>

            <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3" aria-label="Portfolio footer navigation">
              <ul className="space-y-3">
                <li>
                  <a href="#work" className="text-sm text-white/55 transition-colors hover:text-white">
                    All samples
                  </a>
                </li>
                <li>
                  <a href="#work" className="text-sm text-white/55 transition-colors hover:text-white">
                    Categories
                  </a>
                </li>
                <li>
                  <a href="/wino" className="text-sm text-white/55 transition-colors hover:text-white">
                    WINO
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
                  <a href="/#contact" className="text-sm text-white/55 transition-colors hover:text-white">
                    Commission work
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

/** Commission form — pushes a lead and opens a prefilled email, without leaving the page. */
function CommissionForm() {
  const [form, setForm] = useState({ name: "", email: "", idea: "" });
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `AI video commission from ${form.name || "the portfolio"}`;
    const body = `${form.idea}\n\n— ${form.name}\n${form.email}`;
    await sendLead({
      name: form.name,
      email: form.email,
      interest: "AI video commission (portfolio)",
      message: form.idea,
      source: "portfolio-cta",
    });
    window.open(gmailHref(subject, body), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <form onSubmit={submit} className="relative mx-auto mt-8 max-w-lg space-y-3 text-left">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          placeholder="Your name"
          aria-label="Your name"
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-neon/50 focus:outline-none"
        />
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          type="email"
          required
          placeholder="you@example.com"
          aria-label="Your email"
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-neon/50 focus:outline-none"
        />
      </div>
      <textarea
        value={form.idea}
        onChange={(e) => setForm({ ...form, idea: e.target.value })}
        required
        rows={3}
        placeholder="What should we generate? Style, length, platform…"
        aria-label="Project idea"
        className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-neon/50 focus:outline-none"
      />
      <button
        type="submit"
        disabled={sent}
        className="btn-primary group w-full"
      >
        {sent ? (
          <>
            <Check className="h-4 w-4 text-emerald-500" aria-hidden />
            Opening your email…
          </>
        ) : (
          <>
            Send commission request
            <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
          </>
        )}
      </button>
    </form>
  );
}