import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  Check,
  ChevronDown,
  Clapperboard,
  Code2,
  Globe,
  Menu,
  Play,
  Users,
  X,
} from "lucide-react";
import Logo from "./Logo";
import TiltCard from "./TiltCard";
import { PORTFOLIO_SAMPLES } from "../lib/portfolio";
import { getMasterclassContent, type MasterclassContent } from "../lib/cms";
import { usePreview } from "../lib/cmsPreview";

const fallback = getMasterclassContent();

const FALLBACK_PRICING = { early: 100000, late: 150000, save: 50000, deadlineNote: "Limited early bird registration." };

const PAYSTACK_URL = "https://paystack.shop/pay/96toe5qx8t";
const SELAR_URL = "https://selar.com/1zbx702773";
const SELAR_USD = 74.28;
const WHATSAPP_URL = "https://wa.me/2349153541297";

const TOOLS = [
  { img: "/assets/antigravity.jpg", name: "Antigravity", desc: "AI-assisted development and agentic workflows for systems that can reason, plan and execute tasks." },
  { img: "/assets/hermes-agent.jpg", name: "Hermes Agent", desc: "Explore agentic workflows involving search, analysis, generation and external tools." },
  { img: "/assets/open-code.jpg", name: "Open Code", desc: "Use an open-source AI coding assistant to write, modify, debug and refactor software." },
] as const;

const AUDIENCES = [
  { emoji: "🎬", title: "Creators", desc: "You want to create AI movies, commercials, social content and visual stories." },
  { emoji: "🎥", title: "Filmmakers", desc: "You want to understand how AI can become part of your filmmaking toolkit." },
  { emoji: "💻", title: "Aspiring Builders", desc: "You have software ideas but don't know where to begin." },
  { emoji: "🚀", title: "Entrepreneurs", desc: "You want to identify business opportunities created by AI." },
  { emoji: "🎨", title: "Freelancers", desc: "You want to add AI-powered services to your existing skills." },
  { emoji: "📣", title: "Marketers", desc: "You want to use AI to produce content and systems for businesses." },
  { emoji: "🧑🏽\u200D💼", title: "Business Owners", desc: "You want to understand how AI can automate and improve your operations." },
  { emoji: "🧠", title: "Founders", desc: "You want to prototype ideas faster and explore MVPs without immediately building a large technical team." },
  { emoji: "🌱", title: "Beginners", desc: "You've never thought of yourself as technical but you're willing to learn." },
];

const PUBLISHED_VIDEOS = PORTFOLIO_SAMPLES.filter((s) => s.type === "video" && s.published);
const HERO_VIDEO = PUBLISHED_VIDEOS[0];
const HERO_STRIP = PUBLISHED_VIDEOS.slice(1, 5);
const SHOWCASE_VIDEOS = PUBLISHED_VIDEOS.slice(2, 8);

function formatNaira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

const NAV_LINKS = [
  { label: "Overview", href: "#overview" },
  { label: "Videos", href: "#videos" },
  { label: "Learn", href: "#learn" },
  { label: "Projects", href: "#projects" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

export default function MasterclassPage() {
  const [mobileNav, setMobileNav] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [scrolled, setScrolled] = useState(false);
  const preview = usePreview("masterclass");
  const d = useMemo(() => {
    const c = (preview as MasterclassContent | null) ?? fallback;
    return {
      pricing: c?.pricing
        ? { early: c.pricing.earlyBird, late: c.pricing.latePrice, save: c.pricing.save, deadlineNote: c.pricing.deadlineNote }
        : FALLBACK_PRICING,
      faqs: c?.faqs ?? [
        { q: "Do I need to know how to code?", a: "No prior professional programming experience is required. The masterclass is designed to help you understand how to build with modern AI tools. You should be prepared to learn, experiment, troubleshoot and work through technical challenges." },
        { q: "Is this for complete beginners?", a: "Yes. Beginners can join. The training builds from foundational concepts into more advanced product-building, AI agent, automation and deployment workflows." },
        { q: "Will I learn how to build SaaS products?", a: "Yes. The masterclass covers the process and systems involved in building modern AI-powered web products." },
        { q: "Will we build AI agents?", a: "Yes. You will learn the concepts and workflows behind agentic AI systems and how AI agents can perform multi-step tasks." },
        { q: "Will I learn automation?", a: "Yes. You'll explore how APIs, triggers, workflows, AI and external services can be connected to automate useful processes." },
        { q: "What tools will we use?", a: "The AI ecosystem changes quickly. The masterclass focuses on relevant modern tools and, more importantly, the workflows and principles behind using them effectively." },
        { q: "How much is the masterclass?", a: "Early bird is ₦100,000. After early bird closes, it becomes ₦150,000. Joining early saves you ₦50,000." },
        { q: "Will the sessions be recorded?", a: "Yes. You will have access to all sessions." },
        { q: "How long is the masterclass?", a: "1 week intensive." },
        { q: "What happens after I register?", a: "After successful registration, you'll receive onboarding information and instructions for accessing the masterclass." },
        { q: "How do I contact you or learn more?", a: "WhatsApp & calls: +234 915 354 1297. You can also reach us through the website — we respond fast." },
      ],
    };
  }, [preview]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F3EE] antialiased selection:bg-white/20 selection:text-white">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');`}</style>

      {/* ── Nav ── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          scrolled ? "border-white/[0.08] bg-[#0A0A0A]/85 backdrop-blur-xl" : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[64px] max-w-[1160px] items-center justify-between px-5 sm:px-8">
          <a href="/masterclass" className="shrink-0" aria-label="Masterclass home">
            <Logo invert />
          </a>
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="rounded-full px-3.5 py-2 text-[13px] font-medium tracking-[-0.01em] text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <a
            href={PAYSTACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold tracking-[-0.01em] text-[#0A0A0A] transition-all hover:bg-white/90 lg:inline-flex"
          >
            Secure Your Seat <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </a>
          <button
            type="button"
            onClick={() => setMobileNav((v) => !v)}
            aria-label="Toggle menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/80 backdrop-blur lg:hidden"
          >
            {mobileNav ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
        <AnimatePresence>
          {mobileNav && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="border-t border-white/10 bg-[#0A0A0A] px-5 py-6 lg:hidden"
            >
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    onClick={() => setMobileNav(false)}
                    className="rounded-xl px-3 py-3 text-[15px] font-medium text-white/75 hover:bg-white/[0.06] hover:text-white"
                  >
                    {l.label}
                  </a>
                ))}
                <a
                  href={PAYSTACK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileNav(false)}
                  className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-[#0A0A0A]"
                >
                  Secure Your Seat <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ───────────────────────────────────────────────────────
          HERO — Exact .md copy
      ─────────────────────────────────────────────────────── */}
      <section id="overview" className="relative scroll-mt-20 overflow-hidden bg-[#0A0A0A] pt-[64px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(255,255,255,0.04),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,rgba(0,0,0,0.55))]" />
        <div className="mx-auto grid max-w-[1160px] gap-10 px-5 pb-10 pt-10 sm:px-8 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:pt-16">
          <div className="relative">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
              <span className="h-px w-6 bg-white/30" aria-hidden />
              Tech Bootcamp — Wisnotech School of Technology
            </p>
            <h1 className="mt-5 max-w-[15ch] text-[36px] font-[800] leading-[0.92] tracking-[-0.04em] text-[#F5F3EE] sm:text-[46px] lg:text-[56px]">
              The AI Creator Masterclass.{" "}
              <span className="font-[Instrument_Serif] font-normal italic tracking-[-0.03em] text-white/90">
                Create, Build &amp; Sell.
              </span>
            </h1>
            <p className="mt-5 max-w-[48ch] text-[16px] leading-[1.65] text-white/55 sm:text-[17px]">
              Learn how to use AI to create cinematic entertainment, build real software, launch digital products &amp;
              turn your skills into a business.
            </p>
            <ul className="mt-6 space-y-2 text-[14px] leading-[1.6] text-white/55">
              <li className="flex gap-2.5"><span className="shrink-0" aria-hidden>🎬</span> Create cinematic AI movies, scenes and entertainment.</li>
              <li className="flex gap-2.5"><span className="shrink-0" aria-hidden>💻</span> Build real websites, SaaS products and applications.</li>
              <li className="flex gap-2.5"><span className="shrink-0" aria-hidden>📱</span> Create mobile applications.</li>
              <li className="flex gap-2.5"><span className="shrink-0" aria-hidden>🤖</span> Build AI agents that can perform useful tasks.</li>
              <li className="flex gap-2.5"><span className="shrink-0" aria-hidden>⚙️</span> Automate business processes.</li>
              <li className="flex gap-2.5"><span className="shrink-0" aria-hidden>💼</span> Package your AI skills into services.</li>
              <li className="flex gap-2.5"><span className="shrink-0" aria-hidden>💰</span> Turn what you learn into potential business opportunities.</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={PAYSTACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#0A0A0A] shadow-[0_12px_32px_-16px_rgba(255,255,255,0.3)] transition-all hover:bg-white/90"
              >
                Secure Your Seat — {formatNaira(d.pricing.early)} <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="#videos"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-7 py-3.5 text-sm font-medium text-white backdrop-blur hover:border-white/20 hover:bg-white/[0.07]"
              >
                Watch the Work
              </a>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/35">
              <span className="inline-flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-white/30" aria-hidden /> Remote &amp; Physical
              </span>
              <span className="h-3 w-px bg-white/10" aria-hidden />
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5 text-white/30" aria-hidden /> Starts Dec, 2026
              </span>
              <span className="h-3 w-px bg-white/10" aria-hidden />
              <span className="inline-flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-white/30" aria-hidden /> Limited Slots
              </span>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#0A0A0A]">
                Fee: {formatNaira(d.pricing.early)}
              </span>
              <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/50 line-through">
                Late: {formatNaira(d.pricing.late)}
              </span>
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#0A0A0A]">
                Save {formatNaira(d.pricing.save)}
              </span>
            </div>
            <p className="mt-2 text-[11px] font-medium tracking-[0.06em] text-white/30">{d.pricing.deadlineNote}</p>
          </div>

          {/* Showreel visual */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#141414] p-2 shadow-[0_40px_80px_-32px_rgba(0,0,0,0.7)]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-black">
                {HERO_VIDEO && (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    poster={HERO_VIDEO.poster}
                    className="h-full w-full object-cover"
                    style={{ filter: "contrast(1.04) saturate(1.02)" }}
                  >
                    <source src={HERO_VIDEO.src} type="video/mp4" />
                  </video>
                )}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.45),transparent_45%)]" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 backdrop-blur">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90">
                    Student &amp; Studio Work
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => document.getElementById("videos")?.scrollIntoView({ behavior: "smooth" })}
                  className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0A0A0A] shadow-lg"
                  aria-label="View videos"
                >
                  <Play className="ml-0.5 h-4 w-4" aria-hidden />
                </button>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {HERO_STRIP.map((v) => (
                  <div key={v.id} className="relative aspect-[3/4] overflow-hidden rounded-[10px] bg-black">
                    <video autoPlay loop muted playsInline preload="metadata" poster={v.poster} className="h-full w-full object-cover opacity-90">
                      <source src={v.src} type="video/mp4" />
                    </video>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] tracking-[0.08em] text-white/30">
              Real AI video work — the kind you&apos;ll learn to make
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────
          THE AI ERA IS CREATING A NEW KIND OF CREATOR
      ─────────────────────────────────────────────────────── */}
      <section className="border-y border-white/10 bg-[#0A0A0A]">
        <div className="mx-auto max-w-[860px] px-5 py-16 sm:px-8 sm:py-24">
          <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[36px]">
            The AI era is creating a new kind of creator.
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-[1.7] text-white/55">
            <p>For years, the ability to create sophisticated entertainment or software was restricted by access. You needed expensive cameras. Large production crews. Professional studios. Visual-effects teams. Software developers. Designers. Editors. Technical specialists. And, most importantly, money.</p>
            <p>AI is beginning to change the economics of creation. A single skilled person can now sit behind a laptop and produce things that would have required an entire team only a few years ago.</p>
            <p>That doesn't mean AI makes expertise irrelevant.</p>
          </div>
          <p className="mt-6 text-[18px] font-semibold text-white/80">It makes expertise more powerful.</p>
          <div className="mt-6 space-y-4 text-[15px] leading-[1.7] text-white/55">
            <p>The person who knows nothing about filmmaking and simply presses an AI generation button will struggle to produce consistently great work.</p>
            <p>But someone who understands:</p>
            <p className="text-[15px] font-semibold text-white/75">Storytelling + directing + cinematography + prompting + visual consistency + editing + AI tools</p>
            <p>can potentially produce work at a completely different level.</p>
            <p>The same applies to software. Anyone can ask AI to "build me an app." But someone who understands:</p>
            <p className="text-[15px] font-semibold text-white/75">Product thinking + UX + architecture + AI coding + APIs + databases + debugging + deployment</p>
            <p>can actually turn an idea into something people can use.</p>
          </div>
          <p className="mt-6 text-[18px] font-semibold text-white/80">That's the difference we're teaching.</p>
          <div className="mt-8 flex flex-col gap-2">
            <p className="text-[24px] font-[800] tracking-[-0.03em] text-white/30">Not AI consumption.</p>
            <p className="text-[24px] font-[800] tracking-[-0.03em] text-white">AI creation.</p>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────
          THREE SKILLS. ONE BIG OPPORTUNITY.
      ─────────────────────────────────────────────────────── */}
      <section id="learn" className="scroll-mt-20 bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <h2 className="text-[30px] font-[800] leading-[0.95] tracking-[-0.04em] text-[#F5F3EE] sm:text-[40px]">
            Three skills.<br />One big opportunity.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.65] text-white/50">
            The masterclass is built around three capabilities.
          </p>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {([
              { n: "01", label: "CREATE", icon: Clapperboard, title: "Hollywood-Style AI Movie Production", desc: "Learn how to use AI to produce professional visual content and cinematic entertainment." },
              { n: "02", label: "BUILD", icon: Code2, title: "Vibecoding & AI-Powered Asset Building", desc: "Learn how to turn ideas into real digital products, software, AI systems and applications." },
              { n: "03", label: "SELL", icon: Briefcase, title: "Building & Marketing an AI Agency", desc: "Learn how to package what you know into products, services and business opportunities." },
            ] as const).map((p) => (
              <TiltCard key={p.n} intensity={7} className="h-full">
                <div className="flex h-full flex-col rounded-[20px] border border-white/10 bg-[#141414] p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.05]">
                      <p.icon className="h-4.5 w-4.5 text-white/70" aria-hidden />
                    </span>
                    <span className="text-[36px] font-[800] leading-none tracking-[-0.04em] text-white/10" aria-hidden>
                      {p.n}
                    </span>
                  </div>
                  <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">{p.label}</p>
                  <h3 className="mt-2 text-[17px] font-semibold leading-[1.25] tracking-[-0.015em] text-[#F5F3EE]">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-white/50">{p.desc}</p>
                </div>
              </TiltCard>
            ))}
          </div>
          <div className="mt-8 space-y-2 text-[15px] leading-[1.7] text-white/50">
            <p>Because knowing how to create something is valuable.</p>
            <p>Knowing how to build something is valuable.</p>
            <p className="font-semibold text-white/75">But knowing how to create, build AND sell? That's where things become very interesting.</p>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────
          01 — HOLLYWOOD-STYLE AI MOVIE PRODUCTION
      ─────────────────────────────────────────────────────── */}
      <section className="border-t border-white/10 bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">01</p>
          <h2 className="mt-3 text-[30px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[40px]">
            Hollywood-Style AI Movie Production
          </h2>
          <p className="mt-4 text-[15px] font-medium text-white/60">The biggest opportunity in AI filmmaking may not be creating cheaper videos.</p>
          <p className="mt-2 text-[15px] font-medium text-white/80">It may be creating an entirely new generation of filmmakers.</p>
          <div className="mt-6 space-y-4 text-[15px] leading-[1.7] text-white/55">
            <p>For decades, blockbuster filmmaking has been an industry of enormous budgets. Millions of dollars can disappear into locations, crews, equipment, sets, visual effects, post-production and logistics before an audience ever sees the finished movie.</p>
            <p>But AI is introducing another possibility:</p>
            <p className="font-semibold text-white/75">What if creative capability becomes more important than production infrastructure?</p>
            <p>What if a small team of exceptional AI filmmakers can achieve visual results that previously required much larger teams? What if one creator can operate across concept development, storyboarding, visual development, character creation, environment design, shot generation and post-production?</p>
            <p className="font-semibold text-white/75">That's the opportunity we're preparing you for.</p>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────
          CASE STUDY: TRANSFORMERS
      ─────────────────────────────────────────────────────── */}
      <section className="bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="mx-auto max-w-[860px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">Case Study</p>
            <h2 className="mt-3 text-[30px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[40px]">
              Transformers
            </h2>
          </div>
          <div className="mx-auto mt-8 grid max-w-[1000px] gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div className="overflow-hidden rounded-[20px] border border-white/10 bg-[#141414]">
              <img
                src="/assets/transformers-case-study.jpg"
                alt="Transformers: Dark of the Moon — Case Study"
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            </div>
            <div className="space-y-4 text-[15px] leading-[1.7] text-white/55">
              <p>Imagine trying to create something at the scale of a Transformers movie.</p>
              <p><strong className="text-white/75">Transformers: Dark of the Moon</strong> reportedly had a production budget of approximately <strong className="text-white/75">$195 million</strong> and ultimately generated more than <strong className="text-white/75">$1.1 billion worldwide</strong>.</p>
              <p>That is an enormous entertainment business. But think about everything required to create a movie at that level. Massive visual effects. Digital characters. Explosions. Vehicles. Destroyed environments. Large-scale action. Complex camera movements. CGI. Physical production. Sound. Editing. Post-production. Hundreds of creative and technical decisions.</p>
              <p className="font-semibold text-white/75">And behind all of it: an enormous amount of money.</p>
            </div>
          </div>
          <div className="mx-auto mt-12 max-w-[860px] space-y-4 text-[15px] leading-[1.7] text-white/55">
            <p>Now imagine the direction the industry could move as AI becomes more capable.</p>
            <p>Not: <span className="italic text-white/40">"AI will magically make every $200 million movie cost $200,000."</span> That's not realistic.</p>
            <p className="font-semibold text-white/75">Instead: imagine AI becoming another layer of the production pipeline.</p>
            <p>A powerful layer. A layer that allows a smaller number of highly skilled people to accomplish more. A layer that allows filmmakers to prototype scenes before expensive production. A layer that allows studios to explore multiple creative directions faster. A layer that allows independent creators to build worlds that would previously have been financially impossible.</p>
            <p className="font-semibold text-white/75">The technology doesn't remove the need for talented people. It increases the value of people who know how to direct the technology.</p>
          </div>
        </div>
      </section>

      {/* ── THE FUTURE OF HOLLYWOOD ── */}
      <section className="border-t border-white/10 bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8">
          <h2 className="text-[26px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[34px]">
            The future of Hollywood may need a different kind of talent.
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-[1.7] text-white/55">
            <p>Imagine a production company receives a brief: <span className="italic text-white/40">"We need a cinematic 8-minute sci-fi sequence set in a futuristic African megacity."</span></p>
            <p>The traditional approach might involve: location scouting, set design, concept artists, 3D artists, VFX artists, cinematographers, actors, equipment, lighting, crew, post-production — and a long production timeline.</p>
            <p>Now imagine an AI-native production team. A small group of highly skilled creators can begin developing the world digitally. They can explore characters, costumes, architecture, vehicles, lighting, camera angles, environments, action sequences, visual styles, storyboards, shots — and iterate rapidly.</p>
          </div>
          <div className="mt-8 space-y-1">
            <p className="text-[15px] font-semibold text-white/75">The creative director still matters.</p>
            <p className="text-[15px] font-semibold text-white/75">The filmmaker still matters.</p>
            <p className="text-[15px] font-semibold text-white/75">The storyteller still matters.</p>
            <p className="text-[15px] font-semibold text-white/75">The human still matters.</p>
          </div>
          <p className="mt-4 text-[15px] leading-[1.7] text-white/55">But the tools become dramatically more powerful.</p>
        </div>
      </section>

      {/* ── WHERE AI MOVIE PRODUCTION BECOMES A CAREER ── */}
      <section className="bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8">
          <h2 className="text-[26px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[34px]">
            This is where AI movie production becomes a career opportunity.
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-[1.7] text-white/55">
            <p>Hollywood and other major entertainment companies don't simply need people who know how to generate an AI video. They need people who can produce <strong className="text-white/75">usable entertainment</strong>.</p>
            <p>People who can understand a script and translate it into visual sequences. People who understand camera language. People who can maintain character identity across scenes. People who understand lighting. People who can control composition. People who can create believable environments. People who understand pacing. People who can direct AI models toward a specific creative result.</p>
            <p className="font-semibold text-white/75">People who can take dozens of generated shots and turn them into a coherent sequence.</p>
          </div>
          <p className="mt-6 text-[28px] font-[800] tracking-[-0.03em] text-white/80">AI filmmakers.</p>
        </div>
      </section>

      {/* ── DON'T BE THE PERSON WHO CAN ONLY GENERATE A COOL CLIP ── */}
      <section className="border-t border-white/10 bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8">
          <h2 className="text-[26px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[34px]">
            Don't be the person who can only generate a cool clip.
          </h2>
          <p className="mt-3 text-[16px] font-medium text-white/60">Become the person who can produce an entire sequence.</p>
          <div className="mt-6 space-y-4 text-[15px] leading-[1.7] text-white/55">
            <p>There is a massive difference. Anyone can generate: <span className="italic text-white/40">"A futuristic city with a spaceship."</span></p>
            <p>A professional creator needs to think: What is the establishing shot? Where is the camera? What lens language are we simulating? Where is the character? What happened in the previous shot? What happens next? How does the lighting remain consistent? How does the character remain recognizable? How do we make the environment believable? How do we make the audience feel something?</p>
            <p className="font-semibold text-white/75">That's filmmaking. AI is simply becoming one of the most powerful tools available to the filmmaker.</p>
          </div>
        </div>
      </section>

      {/* ── IMAGINE WHAT YOU COULD CREATE ── */}
      <section className="bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[36px]">
            Imagine what you could create.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {([
              { emoji: "🎬", title: "Feature Films", desc: "Develop cinematic stories with AI-assisted visual production." },
              { emoji: "📺", title: "Drama Series", desc: "Create recurring characters and serialized stories." },
              { emoji: "🔥", title: "Season-Based Entertainment", desc: "Build fictional worlds that can continue across multiple episodes and seasons." },
              { emoji: "🚀", title: "Sci-Fi & Fantasy", desc: "Create worlds, creatures, environments and visual concepts that would be incredibly expensive to produce traditionally." },
              { emoji: "❤️", title: "Romance & Drama", desc: "Use AI filmmaking to tell emotionally driven stories." },
              { emoji: "🌍", title: "African Stories", desc: "Imagine taking African mythology, folklore, history and contemporary stories and transforming them into globally appealing cinematic entertainment." },
              { emoji: "🎞️", title: "Short Films", desc: "Produce complete stories designed for YouTube, streaming platforms and social media." },
              { emoji: "📢", title: "AI Commercials", desc: "Create premium advertising concepts for brands." },
              { emoji: "🎥", title: "Music Visuals", desc: "Create cinematic worlds for artists and music projects." },
              { emoji: "📱", title: "Social Entertainment", desc: "Create vertical narrative content designed specifically for modern audiences." },
            ] as const).map((item) => (
              <div key={item.title} className="rounded-[16px] border border-white/10 bg-[#141414] p-5">
                <span className="text-2xl" aria-hidden>{item.emoji}</span>
                <h3 className="mt-3 text-[14px] font-semibold text-[#F5F3EE]">{item.title}</h3>
                <p className="mt-1.5 text-[13px] leading-[1.6] text-white/50">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[16px] font-medium text-white/55">The possibilities are enormous. And we're still early.</p>
        </div>
      </section>

      {/* ── THE AI GOLD RUSH ── */}
      <section className="border-t border-white/10 bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8">
          <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[36px]">
            The AI gold rush.
          </h2>
          <p className="mt-3 text-[16px] font-medium text-white/60">Don't wait until the gold rush is over to start learning how to mine.</p>
          <div className="mt-6 space-y-4 text-[15px] leading-[1.7] text-white/55">
            <p>Every major technological shift creates an early period where a relatively small number of people understand how to use the new tools effectively. Right now, millions of people are experimenting with AI. But experimentation isn't mastery.</p>
            <p>There is a difference between: <span className="text-white/75 font-medium">"I know how to use an AI video generator."</span> and: <span className="text-white/75 font-medium">"I can take a creative brief and produce a polished cinematic sequence."</span></p>
            <p>The second person has a much more valuable skill.</p>
            <p className="font-semibold text-white/75">So the goal isn't simply to start. The goal is to become GOOD.</p>
            <p>Good enough that when a studio, production company, agency or brand needs someone who understands AI filmmaking... your portfolio gives them a reason to call you.</p>
          </div>
        </div>
      </section>

      {/* ── HOW MUCH COULD AN AI CREATOR MAKE? ── */}
      <section className="bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8">
          <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[36px]">
            How much could an AI creator make?
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-[1.7] text-white/55">
            <p>Let's be realistic. There is no guaranteed salary for learning AI filmmaking. Your income will depend on your portfolio, skill level, location, specialization, reputation, client and ability to deliver commercially useful work.</p>
            <p>But the market is already beginning to show examples of paid AI creative work. Some 2026 AI Artist opportunities have advertised rates around <strong className="text-white/75">$500–$800 per day</strong> for experienced creators. Specialized AI/VFX production roles have also advertised annual compensation in the <strong className="text-white/75">$120,000–$140,000 range</strong>.</p>
            <p>These are examples of market opportunities — <strong className="text-white/60">not promises of what you'll earn after this masterclass.</strong></p>
            <p>But they illustrate something important: <span className="font-semibold text-white/75">AI filmmaking is moving from experimentation toward professional work.</span></p>
            <p>And imagine what an exceptional AI filmmaker could potentially command when they can do far more than generate clips. Someone who can conceptualize, direct, generate, maintain consistency, edit, produce, deliver.</p>
            <p className="font-semibold text-white/75">That's a professional.</p>
          </div>
        </div>
      </section>

      {/* ── AND THIS IS WHY YOU SHOULD START NOW ── */}
      <section className="border-t border-white/10 bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8">
          <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[36px]">
            And this is why you should start now.
          </h2>
          <div className="mt-6 space-y-3 text-[15px] leading-[1.7] text-white/55">
            <p>Don't wait until every major studio has an AI production department.</p>
            <p>Don't wait until thousands of people are calling themselves AI filmmakers.</p>
            <p>Don't wait until you need the skill before you start learning it.</p>
          </div>
          <div className="mt-6 space-y-1">
            <p className="text-[15px] font-semibold text-white/75">Build your portfolio now.</p>
            <p className="text-[15px] font-semibold text-white/75">Develop your eye now.</p>
            <p className="text-[15px] font-semibold text-white/75">Learn cinematic prompting now.</p>
            <p className="text-[15px] font-semibold text-white/75">Learn AI production workflows now.</p>
            <p className="text-[15px] font-semibold text-white/75">Create your first short film now.</p>
          </div>
          <div className="mt-6 space-y-2 text-[15px] leading-[1.7] text-white/55">
            <p>Experiment. Fail. Improve. Create again.</p>
            <p className="font-semibold text-white/75">Because when the market becomes much larger... you'll already have experience.</p>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────
          02 — VIBECODING & AI-POWERED PRODUCT BUILDING
      ─────────────────────────────────────────────────────── */}
      <section className="border-t border-white/10 bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">02</p>
          <h2 className="mt-3 text-[30px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[40px]">
            Vibecoding &amp; AI-Powered Asset Building
          </h2>
          <p className="mt-4 text-[16px] font-medium text-white/60">What if you could turn your ideas into working software?</p>
          <div className="mt-6 space-y-4 text-[15px] leading-[1.7] text-white/55">
            <p>You don't need to begin by becoming a traditional software engineer. You need to understand how modern AI-assisted development works.</p>
            <p>You'll learn how to take an idea and move through:</p>
          </div>
          <div className="mt-6 flex flex-col items-start gap-2">
            {["IDEA — What are you actually trying to solve?", "BLUEPRINT — Who is it for? What does it need to do?", "BUILD — Use AI-powered coding tools to begin creating the product.", "TEST — Find what's broken.", "DEBUG — Understand problems and work with AI to fix them.", "IMPROVE — Make the product better.", "DEPLOY — Put it online.", "LAUNCH — Get it in front of real users."].map((step) => (
              <div key={step} className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[13px] text-white/65">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" />
                {step}
              </div>
            ))}
          </div>
          <div className="mt-10">
            <h3 className="text-[20px] font-[700] tracking-[-0.02em] text-[#F5F3EE]">Build real products. Not just landing pages.</h3>
            <p className="mt-3 text-[15px] leading-[1.65] text-white/50">You'll learn the foundations behind:</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { title: "SaaS Products", desc: "Software people can access online and potentially pay for monthly." },
                { title: "AI Applications", desc: "Applications that use AI to generate, analyze, summarize, automate or assist." },
                { title: "Dashboards", desc: "Interfaces that allow users to manage information and interact with systems." },
                { title: "Mobile Apps", desc: "Take ideas toward functional mobile applications." },
                { title: "AI Agents", desc: "Systems that can perform multi-step tasks and interact with tools." },
                { title: "Business Automations", desc: "Systems that connect different services and perform repetitive work automatically." },
              ].map((item) => (
                <div key={item.title} className="rounded-[12px] border border-white/10 bg-[#141414] p-4">
                  <h4 className="text-[14px] font-semibold text-[#F5F3EE]">{item.title}</h4>
                  <p className="mt-1 text-[13px] leading-[1.6] text-white/50">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────
          03 — BUILD AN AI-POWERED BUSINESS
      ─────────────────────────────────────────────────────── */}
      <section className="border-t border-white/10 bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">03</p>
          <h2 className="mt-3 text-[30px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[40px]">
            Build an AI-Powered Business
          </h2>
          <p className="mt-4 text-[16px] font-medium text-white/60">Because a skill becomes much more valuable when you know how to sell the outcome.</p>
          <div className="mt-6 space-y-4 text-[15px] leading-[1.7] text-white/55">
            <p>You can learn AI for years. But if nobody knows what you can do... it doesn't become a business.</p>
            <p>Inside the masterclass, you'll learn how to turn your capabilities into offers.</p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { skill: "AI video production", offer: "Offer cinematic content production to brands." },
              { skill: "AI product commercials", offer: "Create advertising assets for businesses." },
              { skill: "AI automation", offer: "Help businesses reduce repetitive manual work." },
              { skill: "AI agents", offer: "Build systems that handle specific business tasks." },
              { skill: "AI software development", offer: "Build MVPs and internal tools." },
              { skill: "AI content systems", offer: "Help businesses produce content at scale." },
            ].map((item) => (
              <div key={item.skill} className="rounded-[12px] border border-white/10 bg-[#141414] p-4">
                <p className="text-[14px] font-semibold text-white/80">{item.skill}</p>
                <p className="mt-1 text-[13px] leading-[1.6] text-white/50">{item.offer}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-2 text-[15px] leading-[1.7] text-white/55">
            <p>The goal isn't to become a person who says: <span className="italic text-white/40">"I know AI."</span></p>
            <p className="font-semibold text-white/75">The goal is to become someone who can say: "I can solve this problem using AI."</p>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────
          YOU WON'T LEAVE WITH JUST NOTES
      ─────────────────────────────────────────────────────── */}
      <section id="projects" className="scroll-mt-20 border-t border-white/10 bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <h2 className="text-[30px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[40px]">
            You won't leave with just notes.
          </h2>
          <p className="mt-3 text-[16px] font-semibold text-white/60">You'll build.</p>
          <p className="mt-3 text-[15px] leading-[1.65] text-white/50">
            The masterclass includes practical projects designed to give you actual experience.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { n: "01", title: "Build an AI-Powered SaaS", desc: "Create a functional web application with auth, dashboard, AI, APIs and product logic." },
              { n: "02", title: "Build an Autonomous AI Agent", desc: "Create a system that can understand instructions, use tools, perform multiple steps and produce results." },
              { n: "03", title: "Build an AI Automation", desc: "Connect tools and services together so that a workflow can happen automatically." },
              { n: "04", title: "Build an AI-Powered Mobile App", desc: "Take an idea from concept through user flow, interface, features, testing and functional product." },
              { n: "05", title: "Build Your Own Idea", desc: "Bring an idea you've been thinking about. Your idea becomes your classroom." },
            ].map((p) => (
              <div key={p.n} className="rounded-[16px] border border-white/10 bg-[#141414] p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-[#0A0A0A]">
                  {p.n}
                </span>
                <h3 className="mt-4 text-[14px] font-semibold tracking-[-0.01em] text-[#F5F3EE]">{p.title}</h3>
                <p className="mt-2 text-[13px] leading-[1.6] text-white/50">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────
          THE CURRICULUM
      ─────────────────────────────────────────────────────── */}
      <section id="curriculum" className="scroll-mt-20 border-t border-white/10 bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <h2 className="text-[30px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[40px]">
            From your first prompt to your final product.
          </h2>
          <p className="mt-3 text-[16px] font-semibold text-white/60">The Curriculum</p>
          <div className="mt-10 space-y-[1px] overflow-hidden rounded-[20px] border border-white/10 bg-white/10">
            {[
              { n: "01", title: "The New Era of AI-Powered Building", desc: "Understand the modern AI development ecosystem and the opportunities emerging around AI-powered creation.", bullets: ["The modern AI building ecosystem", "How vibe coding actually works", "Choosing the right AI tools", "Why product thinking beats blind prompting"] },
              { n: "02", title: "Turning Ideas Into Product Blueprints", desc: "Before writing code, understand what you're building.", bullets: ["Idea validation", "User definition", "Feature planning", "Use cases", "Product structure", "Build roadmaps"] },
              { n: "03", title: "Vibecoding: Building With AI", desc: "Learn how to use AI coding tools to create real applications — and what to do when the AI gets things wrong.", bullets: ["Product prompting & iteration", "Understanding project structure", "Debugging and fixing features", "Scaling a project"] },
              { n: "04", title: "Building SaaS Products", desc: "The architecture behind modern software products.", bullets: ["User accounts & auth", "Dashboards, DB & admin systems", "Payments, APIs & AI features"] },
              { n: "05", title: "Building AI Applications", desc: "Turn AI capabilities into useful products.", bullets: ["AI assistants", "AI content tools", "AI analysis systems", "AI generation workflows"] },
              { n: "06", title: "Agentic AI", desc: "Go beyond chatbots. Learn the concepts behind AI systems that can reason, plan, use tools, take actions and complete tasks.", bullets: ["Agent architecture & memory", "Tools, actions & decision-making", "Multi-agent orchestration"] },
              { n: "07", title: "AI Automation", desc: "Learn how systems communicate — APIs, webhooks, triggers, actions, notifications, data movement, AI processing.", bullets: ["APIs, webhooks & triggers", "AI-powered business automation", "Data movement & notifications"] },
              { n: "08", title: "Mobile Applications", desc: "Learn how to use AI-assisted workflows to move from an app idea toward a functional mobile application.", bullets: ["App planning & user flows", "Interface & core features", "Testing & iteration"] },
              { n: "09", title: "APIs & Integrations", desc: "Understand how modern products connect — your app, AI, database, payments, external services, automation.", bullets: ["AI, database & payments APIs", "External services & webhooks", "Your product ↔ AI ↔ DB ↔ automation"] },
              { n: "10", title: "Debugging, Deployment & Shipping", desc: "Because building something on your laptop isn't the finish line.", bullets: ["Debug AI-generated projects", "Test, improve & deploy", "Connect domains & go live — Build it. Fix it. Ship it."] },
            ].map((m) => (
              <div key={m.n} className="grid gap-6 bg-[#141414] p-6 sm:grid-cols-[88px_1fr_1.1fr] sm:p-8">
                <span className="text-[36px] font-[800] leading-none tracking-[-0.04em] text-white/10">{m.n}</span>
                <div>
                  <h3 className="text-[16px] font-semibold leading-[1.25] tracking-[-0.015em] text-[#F5F3EE] sm:text-[18px]">
                    {m.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-white/50">{m.desc}</p>
                </div>
                <ul className="space-y-2 self-start">
                  {m.bullets.map((b) => (
                    <li key={b} className="flex gap-2.5 text-[13px] leading-[1.5] text-white/60">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/40" aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────
          THE TOOLS
      ─────────────────────────────────────────────────────── */}
      <section id="tools" className="scroll-mt-20 border-t border-white/10 bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[30px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[40px]">
              The tools.
            </h2>
            <p className="mt-3 text-[15px] leading-[1.6] text-white/50">
              Learn with modern AI tools. You'll get hands-on experience with tools such as:
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
            {TOOLS.map((t) => (
              <div key={t.name} className="rounded-[20px] border border-white/10 bg-[#141414] p-5">
                <div className="aspect-square overflow-hidden rounded-[12px] bg-black">
                  <img src={t.img} alt={t.name} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <h3 className="mt-4 text-[15px] font-semibold tracking-[-0.01em] text-[#F5F3EE]">{t.name}</h3>
                <p className="mt-1.5 text-[13px] leading-[1.6] text-white/50">{t.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-[11px] font-bold text-white/60">
                  Free to use
                </span>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-8 max-w-[600px] rounded-[16px] border border-white/10 bg-[#141414] p-6 text-center">
            <h3 className="text-[14px] font-semibold text-[#F5F3EE]">The Important Part:</h3>
            <p className="mt-2 text-[13px] leading-[1.65] text-white/50">
              Tools will change. New models will appear. Platforms will improve. Some tools will disappear.
            </p>
            <p className="mt-2 text-[14px] font-semibold text-white/75">But the ability to understand the workflow remains. That's what we're teaching.</p>
          </div>
          <div className="mx-auto mt-8 max-w-[600px] rounded-[16px] border border-white/10 bg-[#141414] p-6 text-center">
            <h3 className="text-[14px] font-semibold text-[#F5F3EE]">Your Own AI Video Generation Access</h3>
            <p className="mt-2 text-[13px] leading-[1.65] text-white/50">
              Every student gets access to a paid AI video-generation tool for use during the masterclass. Generate. Direct. Iterate. Compare. Improve.
            </p>
            <p className="mt-2 text-[14px] font-semibold text-white/75">Your goal isn't to make one cool AI clip. Your goal is to develop the ability to consistently create.</p>
          </div>
        </div>
      </section>

      {/* ── "I DON'T KNOW HOW TO CODE." ── */}
      <section className="border-t border-white/10 bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8">
          <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[36px]">
            "I don't know how to code."
          </h2>
          <p className="mt-3 text-[16px] font-medium text-white/60">That's okay.</p>
          <div className="mt-6 space-y-4 text-[15px] leading-[1.7] text-white/55">
            <p>But let's be honest about something. AI doesn't eliminate the need to think. It doesn't mean you can type: <span className="italic text-white/40">"Build Facebook."</span> and magically receive Facebook.</p>
            <p>You still need to understand: What you're building. Who it's for. What it should do. How the pieces connect. How to identify problems. How to test the result.</p>
            <p>That's why we don't teach AI as a magic button.</p>
          </div>
          <p className="mt-4 text-[16px] font-semibold text-white/75">We teach you how to work WITH it.</p>
          <div className="mt-6 space-y-3 text-[15px] leading-[1.7] text-white/55">
            <p>You don't need years of professional programming experience to start. But you need curiosity. You need patience. And you need the willingness to troubleshoot when something doesn't work.</p>
            <p className="font-semibold text-white/75">If you're willing to learn, AI can become an extremely powerful development partner.</p>
          </div>
        </div>
      </section>

      {/* ── "WHAT IF I'M A COMPLETE BEGINNER?" ── */}
      <section className="bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8">
          <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[36px]">
            "What if I'm a complete beginner?"
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-[1.7] text-white/55">
            <p>The masterclass is designed to take you through the process step by step. You don't need to arrive knowing everything. In fact, you're expected not to.</p>
            <p>What matters is that you're prepared to:</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Learn.", "Experiment.", "Build.", "Break things.", "Fix things.", "Build again."].map((s) => (
              <span key={s} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[13px] font-medium text-white/65">{s}</span>
            ))}
          </div>
          <p className="mt-4 text-[15px] leading-[1.7] text-white/55">Because that's how real skills are developed.</p>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────
          WHO IS THIS MASTERCLASS FOR?
      ─────────────────────────────────────────────────────── */}
      <section className="border-t border-white/10 bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[36px]">
            Who is this masterclass for?
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AUDIENCES.map((a) => (
              <div key={a.title} className="rounded-[16px] border border-white/10 bg-[#141414] p-5">
                <span className="text-2xl" aria-hidden>{a.emoji}</span>
                <h3 className="mt-3 text-[14px] font-semibold text-[#F5F3EE]">{a.title}</h3>
                <p className="mt-1.5 text-[13px] leading-[1.6] text-white/50">{a.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-2 text-[15px] leading-[1.7] text-white/55">
            <p>You don't have to know exactly what you want to build yet.</p>
            <p className="font-semibold text-white/75">You just need to be willing to start.</p>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────
          INSTRUCTOR
      ─────────────────────────────────────────────────────── */}
      <section className="bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto grid max-w-[1160px] gap-8 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-white/10 bg-[#141414] lg:aspect-[4/4.2]">
            <img
              src="/assets/shedrack-akue-640.jpg"
              alt="Shedrack Akue — Founder, Wisnotech"
              className="h-full w-full object-cover object-top"
              loading="lazy"
              onError={(e) => ((e.currentTarget.style.display = "none"), ((e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex"))}
            />
            <div className="hidden h-full w-full items-center justify-center p-8 text-center" style={{ display: "none" }}>
              <div>
                <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white text-[22px] font-extrabold text-[#0A0A0A]">SA</span>
                <p className="mt-4 text-sm font-medium text-white/60">Shedrack Akue — Founder, Wisnotech</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">Instructor</p>
            <h2 className="mt-3 text-[30px] font-[800] leading-[0.95] tracking-[-0.04em] text-[#F5F3EE] sm:text-[38px]">
              Learn from someone who actually builds with AI.
            </h2>
            <p className="mt-4 text-[15px] leading-[1.65] text-white/55">
              Wisnotech is a working AI, software and automation studio. The workflows taught inside this masterclass are based on the same kind of AI production, software-building and automation workflows used in real projects.
            </p>
            <p className="mt-3 text-[15px] leading-[1.65] text-white/55">
              The goal isn't to teach you theory for theory's sake. It's to show you how these tools can actually be used to create.
            </p>
            <div className="mt-6 flex items-center gap-4 border-t border-white/10 pt-6">
              <div>
                <p className="text-sm font-semibold text-[#F5F3EE]">Shedrack Akue</p>
                <p className="text-xs tracking-[0.08em] text-white/40">Founder, Wisnotech</p>
              </div>
              <a
                href="/portfolio"
                className="ml-auto inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white hover:border-white/20 hover:text-white"
              >
                Explore My Work <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE DIFFERENCE BETWEEN KNOWING AI AND KNOWING HOW TO USE AI ── */}
      <section className="border-t border-white/10 bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8">
          <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[36px]">
            The difference between knowing AI and knowing how to use AI.
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-[1.7] text-white/55">
            <p>You can watch 100 YouTube videos about AI. You can save 500 prompts. You can download 50 AI tools. You can join 20 communities. And still have nothing to show for it.</p>
            <p>Because information isn't the same as capability.</p>
          </div>
          <p className="mt-4 text-[16px] font-semibold text-white/75">Capability comes from doing.</p>
          <div className="mt-6 space-y-3 text-[15px] leading-[1.7] text-white/55">
            <p>You won't simply hear: <span className="italic text-white/40">"AI can build SaaS."</span> You'll work through building one.</p>
            <p>You won't simply hear: <span className="italic text-white/40">"AI can create movies."</span> You'll work through creating cinematic content.</p>
            <p>You won't simply hear: <span className="italic text-white/40">"AI can automate businesses."</span> You'll build an automation.</p>
            <p>You won't simply hear: <span className="italic text-white/40">"AI agents are the future."</span> You'll learn how agentic systems work.</p>
          </div>
          <div className="mt-6 flex flex-col gap-1">
            <p className="text-[18px] font-[700] text-white/60">Learn.</p>
            <p className="text-[18px] font-[700] text-white/60">Build.</p>
            <p className="text-[18px] font-[700] text-white/60">Repeat.</p>
          </div>
        </div>
      </section>

      {/* ── WHAT YOU'RE REALLY GETTING ── */}
      <section className="bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8">
          <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[36px]">
            What you're really getting.
          </h2>
          <p className="mt-3 text-[15px] leading-[1.65] text-white/50">You're getting more than lessons. You're developing a set of capabilities that can travel with you.</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              { title: "The ability to create", items: ["Cinematic content", "Films", "Commercials", "Stories", "Visual experiences"] },
              { title: "The ability to build", items: ["Websites", "Apps", "SaaS", "AI systems", "Agents", "Automations"] },
              { title: "The ability to sell", items: ["Services", "Products", "Creative work", "AI solutions", "Business outcomes"] },
            ].map((col) => (
              <div key={col.title}>
                <h3 className="text-[16px] font-semibold text-white/80">{col.title}</h3>
                <ul className="mt-3 space-y-1.5">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[14px] text-white/50">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-white/20" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-2 text-[15px] leading-[1.7] text-white/55">
            <p>And that's the real value.</p>
            <p className="text-[18px] font-[700] text-white/80">You are building a capability — not simply completing a course.</p>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────
          YOUR INVESTMENT
      ─────────────────────────────────────────────────────── */}
      <section id="pricing" className="scroll-mt-20 border-t border-white/10 bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8">
          <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[36px]">
            Your investment.
          </h2>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-[44px] font-[800] leading-none tracking-[-0.04em] text-[#F5F3EE]">
              {formatNaira(d.pricing.early)}
            </span>
          </div>
          <div className="mt-6 space-y-4 text-[15px] leading-[1.7] text-white/55">
            <p>At first glance, {formatNaira(d.pricing.early)} may feel like another course expense. But look at what you're actually gaining access to:</p>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              "A complete AI creator curriculum",
              "Hands-on software projects",
              "AI filmmaking training",
              "AI agent development",
              "AI automation",
              "Mobile application building",
              "SaaS development",
              "AI business positioning",
              "Practical resources",
              "Community",
              "Paid AI video-generation access during the training",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[13px] text-white/65">
                <Check className="h-3.5 w-3.5 shrink-0 text-white/40" aria-hidden />
                {item}
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-4 text-[15px] leading-[1.7] text-white/55">
            <p>And most importantly: <span className="font-semibold text-white/75">the opportunity to spend time actually building instead of endlessly consuming information.</span></p>
            <p>You can't guarantee that a course will make someone rich. We won't. Your results depend on what you do with the skills. But a skill that allows you to create products, deliver services, build systems and produce professional content can become valuable in many different ways.</p>
          </div>
          <div className="mt-6 space-y-2 text-[15px] leading-[1.7] text-white/55">
            <p>The question isn't: <span className="italic text-white/40">"Will this course make me money?"</span></p>
            <p className="font-semibold text-white/75">The better question is: "What could I do with these capabilities if I become genuinely good at them?"</p>
          </div>
        </div>
      </section>

      {/* ── VIDEO SHOWCASE ── */}
      <section id="videos" className="scroll-mt-20 border-t border-white/10 bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">Student &amp; Studio Work</p>
              <h2 className="mt-3 text-[30px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[40px]">
                Watch what you'll learn to make.
              </h2>
              <p className="mt-3 text-[15px] leading-[1.65] text-white/50">
                A selection of AI video work from the studio — commercials, cinematic clips and social content, all
                made with the same workflows taught in the masterclass.
              </p>
            </div>
            <a
              href="#pricing"
              className="hidden items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-2.5 text-xs font-medium text-white/70 hover:border-white/20 hover:text-white sm:inline-flex"
            >
              Start creating <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SHOWCASE_VIDEOS.map((v) => (
              <div key={v.id} className="group relative overflow-hidden rounded-[16px] border border-white/10 bg-[#141414]">
                <div className="relative aspect-[4/3] overflow-hidden bg-black">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    poster={v.poster}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                  >
                    <source src={v.src} type="video/mp4" />
                  </video>
                  <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur">
                    Studio Work
                  </span>
                  <span className="absolute bottom-3 left-3 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-[#0A0A0A]">
                    Play
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold tracking-[-0.01em] text-[#F5F3EE]">{v.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-[1.5] text-white/45">{v.description.slice(0, 110)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────
          THE AI GOLD RUSH IS HAPPENING ACROSS MULTIPLE INDUSTRIES
      ─────────────────────────────────────────────────────── */}
      <section className="border-t border-white/10 bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8">
          <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[36px]">
            The AI gold rush is happening across multiple industries.
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Film", "Entertainment", "Advertising", "Software", "Marketing", "Education", "Business automation", "Content creation"].map((i) => (
              <span key={i} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[13px] font-medium text-white/60">{i}</span>
            ))}
          </div>
          <div className="mt-6 space-y-4 text-[15px] leading-[1.7] text-white/55">
            <p>And we're still early. The people who position themselves now have time to experiment, build portfolios and develop expertise.</p>
            <p>Later, the barrier won't be access to AI. Everyone will have access.</p>
            <p className="font-semibold text-white/75">The barrier will be skill.</p>
            <p>Who can produce the best work? Who can solve the hardest problems? Who can direct AI better? Who can build better systems? Who can create better entertainment? Who can deliver better results?</p>
            <p className="font-semibold text-white/75">Start developing those answers now.</p>
          </div>
        </div>
      </section>

      {/* ── YOUR NEXT BIG IDEA ── */}
      <section className="bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8">
          <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[36px]">
            Your next big idea doesn't have to remain an idea.
          </h2>
          <div className="mt-6 space-y-3 text-[15px] leading-[1.7] text-white/55">
            <p>Maybe you've thought about building an app. Maybe you want to start an AI agency. Maybe you want to create a movie. Maybe you want to produce an African drama series. Maybe you want to build an AI SaaS. Maybe you want to automate your business. Maybe you want to become an AI filmmaker. Maybe you want to become a freelance AI creator. Maybe you simply want to understand where all of this is heading.</p>
            <p>You don't have to know the final destination.</p>
            <p className="font-semibold text-white/75">You just need to start moving.</p>
          </div>
        </div>
      </section>

      {/* ── THE PEOPLE WHO BUILD NOW ── */}
      <section className="border-t border-white/10 bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8">
          <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[36px]">
            The people who build now will have something to show later.
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-[1.7] text-white/55">
            <p>When the industry gets more competitive, everyone will say: <span className="italic text-white/40">"I know AI."</span></p>
            <p>But some people will be able to say:</p>
          </div>
          <div className="mt-4 space-y-2">
            {['"Here is the film I created."', '"Here is the SaaS I built."', '"Here is the AI agent I deployed."', '"Here is the automation I created."', '"Here is the client work I produced."', '"Here is my portfolio."'].map((q) => (
              <p key={q} className="text-[15px] font-medium text-white/70">{q}</p>
            ))}
          </div>
          <p className="mt-6 text-[16px] font-semibold text-white/80">Which person would you rather be?</p>
        </div>
      </section>

      {/* ── THE FUTURE ISN'T COMING ── */}
      <section className="bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8">
          <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[36px]">
            The future isn't coming.
          </h2>
          <p className="mt-3 text-[18px] font-medium text-white/60">It's being built right now.</p>
          <div className="mt-6 space-y-4 text-[15px] leading-[1.7] text-white/55">
            <p>AI will continue changing. The tools will improve. The models will become more capable. The workflows will evolve. New opportunities will appear. Some existing jobs will change. New jobs will emerge. And new businesses will be created around capabilities that barely existed a few years ago.</p>
            <p>You don't need to predict exactly what happens.</p>
            <p className="font-semibold text-white/75">You need to develop the ability to adapt.</p>
          </div>
        </div>
      </section>

      {/* ── DON'T GET LEFT BEHIND ── */}
      <section className="border-t border-white/10 bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8">
          <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[36px]">
            Don't get left behind.
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-[1.7] text-white/55">
            <p>Not because AI is going to magically replace everyone. But because people who understand how to work with these technologies will increasingly compete with people who don't.</p>
            <p>You have a choice. You can keep watching. Keep saving tutorials. Keep downloading tools. Keep saying: <span className="italic text-white/40">"I'll start someday."</span></p>
            <p>Or you can start developing the skill now.</p>
          </div>
          <div className="mt-6 space-y-1">
            <p className="text-[15px] font-semibold text-white/75">Start building.</p>
            <p className="text-[15px] font-semibold text-white/75">Start creating.</p>
            <p className="text-[15px] font-semibold text-white/75">Start experimenting.</p>
            <p className="text-[15px] font-semibold text-white/75">Start your portfolio.</p>
            <p className="text-[15px] font-semibold text-white/75">Start positioning yourself.</p>
          </div>
          <div className="mt-6 space-y-3 text-[15px] leading-[1.7] text-white/55">
            <p>Because the opportunity isn't reserved for people who were born programmers. It isn't reserved for Hollywood insiders. It isn't reserved for Silicon Valley. It isn't reserved for people with millions of dollars.</p>
            <p className="font-semibold text-white/75">It is increasingly available to people who are willing to learn how to use the tools.</p>
          </div>
        </div>
      </section>

      {/* ── YOUR SEAT IS YOUR STARTING POINT ── */}
      <section className="bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8">
          <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[36px]">
            Your seat is your starting point.
          </h2>
          <p className="mt-3 text-[16px] font-semibold text-white/60">The AI Creator Masterclass</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: "CREATE.", desc: "Learn how to produce cinematic AI entertainment and professional visual content." },
              { label: "BUILD.", desc: "Learn how to turn ideas into software, SaaS, mobile apps, AI agents and automations." },
              { label: "SELL.", desc: "Learn how to package your capabilities into services, products and business opportunities." },
            ].map((p) => (
              <div key={p.label} className="rounded-[16px] border border-white/10 bg-[#141414] p-5 text-center">
                <p className="text-[18px] font-[800] tracking-[-0.02em] text-white/80">{p.label}</p>
                <p className="mt-2 text-[13px] leading-[1.6] text-white/50">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── YOU DON'T NEED TO KNOW EVERYTHING ── */}
      <section className="border-t border-white/10 bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8">
          <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[36px]">
            You don't need to know everything.
          </h2>
          <p className="mt-3 text-[15px] leading-[1.65] text-white/55">You just need to know that you don't want to remain where you are.</p>
          <p className="mt-3 text-[15px] leading-[1.65] text-white/55">Maybe you want to move from:</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              "Consumer → Creator",
              "Beginner → Builder",
              "Employee → Entrepreneur",
              "Idea → Product",
              "Prompt → Production",
              "Skill → Service",
              "Experiment → Portfolio",
            ].map((t) => (
              <div key={t} className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[13px] font-medium text-white/65">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" />
                {t}
              </div>
            ))}
          </div>
          <p className="mt-6 text-[16px] font-semibold text-white/75">That's the transformation we're building toward.</p>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────
          READY TO CREATE, BUILD & SELL WITH AI?
      ─────────────────────────────────────────────────────── */}
      <section className="bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8">
          <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[36px]">
            Ready to create, build &amp; sell with AI?
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-[1.7] text-white/55">
            <p>The next generation of creators won't simply use AI to generate things. They'll direct it. They'll build with it. They'll create businesses around it. They'll use it to solve problems. They'll use it to tell stories. They'll use it to build products. They'll use it to create entertainment.</p>
            <p className="font-semibold text-white/75">And some of them will become the people major companies call when they need someone who understands what AI can really do.</p>
            <p>You have an opportunity to start developing that skill now.</p>
          </div>
          <div className="mt-8 text-center">
            <p className="text-[22px] font-[800] tracking-[-0.03em] text-[#F5F3EE]">THE AI CREATOR MASTERCLASS</p>
            <p className="mt-2 text-[16px] font-semibold tracking-[0.12em] text-white/50">CREATE. BUILD. SELL.</p>
            <div className="mt-4 flex flex-col gap-1 text-[14px] text-white/55">
              <p>Learn the tools.</p>
              <p>Build the projects.</p>
              <p>Create the portfolio.</p>
              <p>Develop the skill.</p>
              <p>Position yourself for what's coming.</p>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href={PAYSTACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#0A0A0A] transition-all hover:bg-white/90"
              >
                Secure Your Seat — {formatNaira(d.pricing.early)} <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-7 py-3.5 text-sm font-medium text-white hover:border-white/20 hover:bg-white/[0.07]"
              >
                Ask on WhatsApp
              </a>
            </div>
            <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-white/25">
              Remote &amp; Physical • December 2026. Limited slots.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────
          PRICING + PAYMENT METHODS
      ─────────────────────────────────────────────────────── */}
      <section className="border-t border-white/10 bg-[#0A0A0A] py-16 sm:py-24">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">Pricing</p>
            <h2 className="mt-3 text-[30px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[40px]">
              Join before the price moves.
            </h2>
            <p className="mt-3 text-[15px] leading-[1.6] text-white/50">
              Early bird registration gives you full access at the lowest available price.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-[520px] overflow-hidden rounded-[22px] border border-white/20 bg-[#141414] shadow-[0_24px_64px_-24px_rgba(255,255,255,0.1)]">
            <div className="bg-[radial-gradient(70%_80%_at_50%_0%,rgba(255,255,255,0.04),transparent_70%)] p-7 sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">Early Bird Access</p>
              <div className="mt-5 flex items-baseline justify-center gap-3">
                <span className="text-[44px] font-[800] leading-none tracking-[-0.04em] text-[#F5F3EE]">
                  {formatNaira(d.pricing.early)}
                </span>
                <span className="text-xs font-bold tracking-[0.08em] text-white/30">EARLY BIRD</span>
              </div>
              <p className="mt-1 text-center text-xs font-medium text-white/40">Full access to the masterclass</p>
              <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-6">
                {["Full masterclass access", "Complete curriculum", "Hands-on projects", "Resources and frameworks", "Community access"].map(
                  (f) => (
                    <li key={f} className="flex gap-2.5 text-[13px] leading-[1.5] text-white/70">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-white/40" aria-hidden />
                      {f}
                    </li>
                  )
                )}
              </ul>
              <a
                href={PAYSTACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-semibold text-[#0A0A0A] transition-all hover:bg-white/90"
              >
                Secure My Seat for {formatNaira(d.pricing.early)} <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <p className="mt-2.5 text-center text-xs font-bold text-white/50">
                Save {formatNaira(d.pricing.save)}.
              </p>
            </div>
          </div>

          <div className="mx-auto mt-4 grid max-w-[520px] grid-cols-2 divide-x divide-white/10 overflow-hidden rounded-[16px] border border-white/10 bg-[#141414]">
            <div className="p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">Early Bird</p>
              <p className="mt-1 text-[20px] font-[800] tracking-[-0.02em] text-[#F5F3EE]">{formatNaira(d.pricing.early)}</p>
              <p className="text-[11px] font-medium text-white/50">Lowest price · Save {formatNaira(d.pricing.save)}</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">Late Registration</p>
              <p className="mt-1 text-[20px] font-[800] tracking-[-0.02em] text-white/40 line-through">
                {formatNaira(d.pricing.late)}
              </p>
              <p className="text-[11px] text-white/30">Standard price</p>
            </div>
          </div>
          <p className="mx-auto mt-4 max-w-xl text-center text-[11px] uppercase leading-[1.6] tracking-[0.12em] text-white/25">
            Once early bird closes, the price becomes {formatNaira(d.pricing.late)}.
          </p>

          {/* Payment methods */}
          <div className="mx-auto mt-10 max-w-2xl text-center">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
              Choose Your Payment Method
            </h3>
            <p className="mt-2 text-sm leading-[1.6] text-white/50">Select the option that works best for your location.</p>
          </div>
          <div className="mx-auto mt-6 grid max-w-[800px] gap-4 sm:grid-cols-2">
            <a
              href={PAYSTACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-[20px] border border-white/10 bg-[#0D2136] p-7 text-center transition-all hover:border-white/20"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white/80">
                For Africa
              </span>
              <img src="/assets/paystack-banner.png" alt="Paystack" className="mx-auto mt-4 h-14 w-auto object-contain" loading="lazy" />
              <p className="mt-4 text-sm font-semibold text-white">Pay in Naira</p>
              <p className="mt-1 text-xs text-white/60">Secure payment via Paystack</p>
              <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0A0A0A] transition-colors group-hover:bg-white/90">
                Pay {formatNaira(d.pricing.early)} <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            </a>
            <a
              href={SELAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-[20px] border border-white/10 bg-[#5C1A4A] p-7 text-center transition-all hover:border-white/20"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white/80">
                International
              </span>
              <img src="/assets/selar-banner.png" alt="Selar" className="mx-auto mt-4 h-14 w-auto object-contain" loading="lazy" />
              <p className="mt-4 text-sm font-semibold text-white">Pay in USD</p>
              <p className="mt-1 text-xs text-white/60">Secure payment via Selar</p>
              <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0A0A0A] transition-colors group-hover:bg-white/90">
                Pay ${SELAR_USD} <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────
          FINAL CTA
      ─────────────────────────────────────────────────────── */}
      <section className="bg-[#0A0A0A] py-14 sm:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#141414] px-6 py-12 text-center sm:px-12 sm:py-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
              Limited Slots — Remote &amp; Physical
            </p>
            <h2 className="mx-auto mt-4 max-w-[16ch] text-[32px] font-[800] leading-[0.92] tracking-[-0.04em] text-[#F5F3EE] sm:text-[46px]">
              Stop asking what AI can do.
            </h2>
            <p className="mx-auto mt-4 max-w-[48ch] text-[20px] font-[700] leading-[1.4] text-white/70">
              Start building what you want AI to do.
            </p>
            <div className="mx-auto mt-7 flex max-w-[420px] items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3">
              <span className="text-xs font-bold text-white">Early Bird {formatNaira(d.pricing.early)}</span>
              <span className="h-3 w-px bg-white/20" aria-hidden />
              <span className="text-xs text-white/40 line-through">Late {formatNaira(d.pricing.late)}</span>
              <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[#0A0A0A]">
                Save {formatNaira(d.pricing.save)}
              </span>
            </div>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href={PAYSTACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#0A0A0A] transition-all hover:bg-white/90"
              >
                Join the Masterclass for {formatNaira(d.pricing.early)} <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-7 py-3.5 text-sm font-medium text-white hover:border-white/20 hover:bg-white/[0.07]"
              >
                Ask on WhatsApp
              </a>
            </div>
            <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-white/25">
              {d.pricing.deadlineNote} Then {formatNaira(d.pricing.late)}.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="scroll-mt-20 border-t border-white/10 bg-[#0A0A0A] py-14 sm:py-20">
        <div className="mx-auto max-w-[760px] px-5 sm:px-8">
          <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[34px]">Questions, answered.</h2>
          <div className="mt-8 divide-y divide-white/10 overflow-hidden rounded-[16px] border border-white/10 bg-[#141414]">
            {d.faqs.map((f, i) => (
              <div key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                  aria-expanded={openFaq === i}
                >
                  <span className="text-[14px] font-medium leading-[1.4] tracking-[-0.01em] text-[#F5F3EE] sm:text-[15px]">
                    {f.q}
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all ${
                      openFaq === i ? "rotate-45 border-white/30 bg-white/10 text-white" : "border-white/15 text-white/60"
                    }`}
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-5 pb-5 text-[13px] leading-[1.65] text-white/50 sm:px-6">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 bg-[#050505]">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-8 px-5 py-10 sm:px-8 sm:flex-row sm:items-start sm:justify-between sm:py-12">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <Logo invert />
              <span className="text-[11px] font-bold tracking-[0.12em] text-white/40">MASTERCLASS</span>
            </div>
            <p className="mt-3 text-sm leading-[1.6] text-white/40">
              The AI Creator Masterclass — create, build &amp; sell with AI.
            </p>
          </div>
          <div className="flex gap-10 text-sm">
            <div className="space-y-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/30">Navigate</p>
              <a href="#learn" className="block text-white/60 hover:text-white">Learn</a>
              <a href="#videos" className="block text-white/60 hover:text-white">Videos</a>
              <a href="#pricing" className="block text-white/60 hover:text-white">Pricing</a>
              <a href="#faq" className="block text-white/60 hover:text-white">FAQ</a>
            </div>
            <div className="space-y-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/30">Wisnotech</p>
              <a href="/" className="block text-white/60 hover:text-white">Home</a>
              <a href="/academy" className="block text-white/60 hover:text-white">Academy</a>
              <a href="/privacy" className="block text-white/60 hover:text-white">Privacy</a>
              <a href="/terms" className="block text-white/60 hover:text-white">Terms</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1160px] items-center justify-between px-5 py-4 sm:px-8">
            <p className="text-xs text-white/40">© {new Date().getFullYear()} Wisnotech School of Technology.</p>
            <p className="hidden text-xs text-white/30 sm:block">Create, build &amp; sell.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
