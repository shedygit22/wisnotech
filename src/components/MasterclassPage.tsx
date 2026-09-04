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
  MessageCircle,
  Play,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import Logo from "./Logo";
import TiltCard from "./TiltCard";
import { PORTFOLIO_SAMPLES } from "../lib/portfolio";
import { getMasterclassContent, type MasterclassContent } from "../lib/cms";
import { usePreview } from "../lib/cmsPreview";

// ──────────────────────────────────────────────────────────────
// Content — CMS-managed with local fallbacks. Edit in /admin.
// Flyer writeup lives in PILLARS / META below.
// ──────────────────────────────────────────────────────────────
const fallback = getMasterclassContent();

const FALLBACK_PRICING = { early: 100000, late: 150000, save: 50000, deadlineNote: "Limited early bird registration." };
const FALLBACK_MODULES: MasterclassContent["modules"] = [
  { n: "01", title: "The New Era of AI-Powered Building", desc: "Understand how AI is changing software development and where opportunities are emerging.", bullets: ["The modern AI building ecosystem", "How vibe coding actually works", "Choosing the right AI tools", "Why product thinking beats blind prompting"] },
  { n: "02", title: "Turning Ideas Into Product Blueprints", desc: "Before building anything, you need to know what you're building.", bullets: ["Validate and structure an idea", "Break large ideas into features", "Define users and use cases", "Create a build roadmap"] },
  { n: "03", title: "Vibe Coding: Building With AI", desc: "Learn to use AI coding tools to create real applications — and fix them when they break.", bullets: ["Product prompting & iteration", "Understanding project structure", "Debugging and fixing features", "Scaling a project"] },
  { n: "04", title: "Building SaaS Products", desc: "The architecture behind modern software products.", bullets: ["User accounts & auth", "Dashboards, DB & admin systems", "Payments, APIs & AI features"] },
  { n: "05", title: "Building AI-Powered Applications", desc: "Turn AI capabilities into useful products.", bullets: ["AI chat & assistants", "AI content & analysis tools", "AI generation workflows"] },
  { n: "06", title: "Agentic AI: Building Systems That Can Do Work", desc: "Go beyond chatbots — build agents that execute multi-step work.", bullets: ["Agent architecture & memory", "Tools, actions & decision-making", "Multi-agent orchestration"] },
  { n: "07", title: "AI Automation", desc: "Connect systems and automate workflows.", bullets: ["APIs, webhooks & triggers", "AI-powered business automation", "Data movement & notifications"] },
  { n: "08", title: "Building Mobile Applications With AI", desc: "From idea to functional mobile app with AI-accelerated workflows.", bullets: ["App planning & user flows", "Interface & core features", "Testing & iteration"] },
  { n: "09", title: "APIs, Integrations & Connecting Systems", desc: "How modern products communicate.", bullets: ["AI, database & payments APIs", "External services & webhooks", "Your product ↔ AI ↔ DB ↔ automation"] },
  { n: "10", title: "Debugging, Deployment & Shipping", desc: "Building is only the beginning — ship it.", bullets: ["Debug AI-generated projects", "Test, improve & deploy", "Connect domains & go live — Build it. Fix it. Ship it."] },
];
const FALLBACK_PROJECTS: MasterclassContent["projects"] = [
  { n: "01", title: "An AI-Powered SaaS Product", desc: "A functional web application with real product features — auth, dashboard, AI." },
  { n: "02", title: "An Autonomous AI Agent", desc: "A system that handles multi-step tasks, uses tools and delivers results." },
  { n: "03", title: "An AI Automation System", desc: "Connected tools and services that run a workflow automatically." },
  { n: "04", title: "An AI-Powered Mobile Application", desc: "A mobile app idea taken to a functional product." },
  { n: "05", title: "Your Own Product Idea", desc: "Your idea → your blueprint → your product → your launch." },
];
const FALLBACK_FAQS: MasterclassContent["faqs"] = [
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
];

// ──────────────────────────────────────────────────────────────
// Flyer writeup — The AI Creator Masterclass
// ──────────────────────────────────────────────────────────────
const PAYSTACK_URL = "https://paystack.shop/pay/96toe5qx8t";
const SELAR_URL = "https://selar.com/1zbx702773";
const SELAR_USD = 74.28;
const WHATSAPP_URL = "https://wa.me/2349153541297";
const WHATSAPP_DISPLAY = "+234 915 354 1297";

const PILLARS: { n: string; icon: LucideIcon; title: string; desc: string; points: string[] }[] = [
  {
    n: "01",
    icon: Clapperboard,
    title: "Hollywood-Style AI Movie Production",
    desc: "Learn how to create premium AI movie scenes that look like they were made with millions of dollars in budget.",
    points: ["Cinematic prompting & shot direction", "Character and scene consistency", "Premium, broadcast-ready output"],
  },
  {
    n: "02",
    icon: Code2,
    title: "Vibecoding & AI-Powered Asset Building",
    desc: "Turn ideas into working products — authentication, databases, debugging AI-generated code, deploying real MVPs.",
    points: ["Auth, databases & user accounts", "Testing & debugging AI-generated code", "Deploying ideas as live MVPs"],
  },
  {
    n: "03",
    icon: Briefcase,
    title: "Building & Marketing an AI Agency",
    desc: "Package your AI skills into services businesses will pay for — and learn how to sell them.",
    points: ["Offer design & packaging", "Pricing services with confidence", "Finding and closing clients"],
  },
];

const TOOLS = [
  { img: "/assets/antigravity.jpg", name: "Antigravity", desc: "An AI agent framework for building intelligent systems that reason, plan and execute complex tasks." },
  { img: "/assets/hermes-agent.jpg", name: "Hermes Agent", desc: "A platform for creating conversational agents that search, analyze, generate and use external tools." },
  { img: "/assets/open-code.jpg", name: "Open Code", desc: "An open-source AI coding assistant that helps you write, debug and refactor code faster." },
] as const;

const EXTRA_FAQ = {
  q: "How do I contact you or learn more?",
  a: "WhatsApp & calls: +234 915 354 1297. You can also reach us through the website — we respond fast.",
};

// Academy showreel videos, reused for the masterclass.
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
      modules: c?.modules ?? FALLBACK_MODULES,
      projects: c?.projects ?? FALLBACK_PROJECTS,
      faqs: [...(c?.faqs ?? FALLBACK_FAQS), EXTRA_FAQ],
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
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F3EE] antialiased selection:bg-[#FF4D12]/30 selection:text-white">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');`}</style>

      {/* ── Nav ── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          scrolled ? "border-white/[0.08] bg-[#0A0A0A]/85 backdrop-blur-xl" : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[64px] max-w-[1160px] items-center justify-between px-5 sm:px-8">
          <a href="/masterclass" className="shrink-0" aria-label="Masterclass home">
            <Logo />
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
            className="hidden items-center gap-2 rounded-full bg-[#FF4D12] px-5 py-2.5 text-[13px] font-semibold tracking-[-0.01em] text-white transition-all hover:bg-[#E84510] hover:shadow-[0_8px_24px_-12px_rgba(255,77,18,0.6)] lg:inline-flex"
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
                  className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-[#FF4D12] px-5 py-3.5 text-sm font-semibold text-white"
                >
                  Secure Your Seat <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Hero ── */}
      <section id="overview" className="relative scroll-mt-20 overflow-hidden bg-[#0A0A0A] pt-[64px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(255,77,18,0.09),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,rgba(0,0,0,0.55))]" />
        <div className="mx-auto grid max-w-[1160px] gap-10 px-5 pb-10 pt-10 sm:px-8 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:pt-16">
          <div className="relative">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
              <span className="h-px w-6 bg-[#FF4D12]" aria-hidden />
              Tech Bootcamp — Wisnotech School of Technology
            </p>
            <h1 className="mt-5 max-w-[15ch] text-[36px] font-[800] leading-[0.92] tracking-[-0.04em] text-[#F5F3EE] sm:text-[46px] lg:text-[56px]">
              The AI Creator Masterclass.{" "}
              <span className="font-[Instrument_Serif] font-normal italic tracking-[-0.03em] text-white/90">
                Create, Build &amp; Sell.
              </span>
            </h1>
            <p className="mt-5 max-w-[48ch] text-[16px] leading-[1.65] text-white/55 sm:text-[17px]">
              A practical, hands-on masterclass designed to help you master modern AI tools, create professional
              content, build real digital assets &amp; solutions — and turn your AI skills into a profitable business
              model.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={PAYSTACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#FF4D12] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_32px_-16px_rgba(255,77,18,0.7)] transition-all hover:bg-[#E84510] hover:shadow-[0_16px_40px_-16px_rgba(255,77,18,0.8)]"
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
              <span className="rounded-full bg-[#FF4D12] px-3 py-1 text-xs font-bold text-white">
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
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF4D12]" />
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

      {/* ── Audience strip ── */}
      <section className="border-y border-white/10 bg-[#0A0A0A]">
        <div className="mx-auto max-w-[1160px] px-5 py-10 sm:px-8 sm:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[26px] font-[700] tracking-[-0.03em] text-[#F5F3EE] sm:text-[30px]">
              Built for the Next Generation of AI Builders.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-[1.65] text-white/50">
              Whether you want to create films, build products, offer services, or launch an AI-powered business, this
              masterclass gives you the practical skills to do it.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30 sm:gap-x-8">
            {["Creators", "Builders", "Founders", "Freelancers", "Marketers", "Entrepreneurs"].map((t, i, arr) => (
              <span key={t} className="inline-flex items-center gap-6">
                {t}
                {i < arr.length - 1 && <span className="hidden h-1 w-1 rounded-full bg-white/15 sm:inline-block" aria-hidden />}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── What you will learn (flyer pillars) ── */}
      <section id="learn" className="scroll-mt-20 bg-[#0A0A0A] py-14 sm:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#FF4D12]">What You Will Learn</p>
            <h2 className="mt-3 max-w-[20ch] text-[30px] font-[800] leading-[0.95] tracking-[-0.04em] text-[#F5F3EE] sm:text-[40px]">
              Three Skills. One Profitable Business Model.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {PILLARS.map((p) => (
              <TiltCard key={p.n} intensity={7} className="h-full">
                <div className="flex h-full flex-col rounded-[20px] border border-white/10 bg-[#141414] p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#FF4D12]/25 bg-[#FF4D12]/10">
                      <p.icon className="h-4.5 w-4.5 text-[#FF4D12]" aria-hidden />
                    </span>
                    <span className="text-[36px] font-[800] leading-none tracking-[-0.04em] text-white/10" aria-hidden>
                      {p.n}
                    </span>
                  </div>
                  <h3 className="mt-5 text-[17px] font-semibold leading-[1.25] tracking-[-0.015em] text-[#F5F3EE]">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-white/50">{p.desc}</p>
                  <ul className="mt-4 space-y-2 border-t border-white/10 pt-4">
                    {p.points.map((b) => (
                      <li key={b} className="flex gap-2.5 text-[13px] leading-[1.5] text-white/60">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FF4D12]" aria-hidden />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            ))}
          </div>
          <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-[16px] border border-[#FF4D12]/25 bg-[#FF4D12]/[0.07] px-6 py-5 text-center sm:flex-row sm:text-left">
            <p className="text-sm leading-[1.6] text-[#F5F3EE]">
              <span className="font-bold">Note:</span> each student gets their own paid AI video generation tool.
            </p>
            <a
              href="#pricing"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-[#0A0A0A] hover:bg-white/90"
            >
              Claim Your Seat <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>
        </div>
      </section>

      {/* ── Videos ── */}
      <section id="videos" className="scroll-mt-20 bg-[#0A0A0A] py-14 sm:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#FF4D12]">Student &amp; Studio Work</p>
              <h2 className="mt-3 text-[30px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[40px]">
                Watch What You&apos;ll Learn to Make.
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

      {/* ── Curriculum ── */}
      <section id="curriculum" className="scroll-mt-20 bg-[#0A0A0A] py-14 sm:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#FF4D12]">Curriculum</p>
            <h2 className="mt-3 text-[30px] font-[800] leading-[0.95] tracking-[-0.04em] text-[#F5F3EE] sm:text-[40px]">
              From Your First Prompt to Your Final Product.
            </h2>
          </div>
          <div className="mt-10 space-y-[1px] overflow-hidden rounded-[20px] border border-white/10 bg-white/10">
            {d.modules.map((m) => (
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
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FF4D12]" aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section id="projects" className="scroll-mt-20 bg-[#0A0A0A] py-14 sm:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="max-w-2xl">
            <h2 className="text-[30px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[40px]">
              You Won&apos;t Leave With Just Notes.
            </h2>
            <p className="mt-3 text-[15px] leading-[1.65] text-white/50">
              Practical projects designed to give you real experience and portfolio-worthy work.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {d.projects.map((p) => (
              <div key={p.title} className="rounded-[16px] border border-white/10 bg-[#141414] p-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF4D12] text-xs font-bold text-white">
                  {p.n}
                </span>
                <h3 className="mt-4 text-sm font-semibold tracking-[-0.01em] text-[#F5F3EE]">{p.title}</h3>
                <p className="mt-2 text-[13px] leading-[1.6] text-white/50">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tools ── */}
      <section id="tools" className="scroll-mt-20 bg-[#0A0A0A] py-14 sm:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#FF4D12]">Included</p>
            <h2 className="mt-3 text-[30px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[40px]">
              Tools Included — Free to Use.
            </h2>
            <p className="mt-3 text-[15px] leading-[1.6] text-white/50">
              You&apos;ll get hands-on with these AI tools during the masterclass — and they&apos;re all free.
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
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#FF4D12]/25 bg-[#FF4D12]/10 px-3 py-1 text-[11px] font-bold text-[#FF4D12]">
                  Free to use
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="scroll-mt-20 bg-[#0A0A0A] py-14 sm:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#FF4D12]">Pricing</p>
            <h2 className="mt-3 text-[30px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[40px]">
              Join Before the Price Moves.
            </h2>
            <p className="mt-3 text-[15px] leading-[1.6] text-white/50">
              Early bird registration gives you full access at the lowest available price.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-[520px] overflow-hidden rounded-[22px] border border-[#FF4D12]/30 bg-[#141414] shadow-[0_24px_64px_-24px_rgba(255,77,18,0.45)]">
            <div className="bg-[radial-gradient(70%_80%_at_50%_0%,rgba(255,77,18,0.12),transparent_70%)] p-7 sm:p-8">
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
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#FF4D12]" aria-hidden />
                      {f}
                    </li>
                  )
                )}
              </ul>
              <a
                href={PAYSTACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#FF4D12] px-6 py-4 text-sm font-semibold text-white transition-all hover:bg-[#E84510]"
              >
                Secure My Seat for {formatNaira(d.pricing.early)} <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <p className="mt-2.5 text-center text-xs font-bold text-[#FF4D12]">
                Save {formatNaira(d.pricing.save)}.
              </p>
            </div>
          </div>

          <div className="mx-auto mt-4 grid max-w-[520px] grid-cols-2 divide-x divide-white/10 overflow-hidden rounded-[16px] border border-white/10 bg-[#141414]">
            <div className="p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">Early Bird</p>
              <p className="mt-1 text-[20px] font-[800] tracking-[-0.02em] text-[#F5F3EE]">{formatNaira(d.pricing.early)}</p>
              <p className="text-[11px] font-medium text-[#FF4D12]">Lowest price · Save {formatNaira(d.pricing.save)}</p>
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

      {/* ── Contact ── */}
      <section className="bg-[#0A0A0A] py-14 sm:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="flex flex-col items-center justify-between gap-5 rounded-[20px] border border-white/10 bg-[#141414] px-6 py-7 text-center sm:flex-row sm:px-8 sm:text-left">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#FF4D12]/25 bg-[#FF4D12]/10">
                <MessageCircle className="h-5 w-5 text-[#FF4D12]" aria-hidden />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">Learn More</p>
                <p className="mt-1 text-[15px] font-semibold text-[#F5F3EE]">
                  WhatsApp &amp; Calls: {WHATSAPP_DISPLAY}
                </p>
              </div>
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0A0A0A] hover:bg-white/90"
            >
              Chat on WhatsApp <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      </section>

      {/* ── Instructor ── */}
      <section className="bg-[#0A0A0A] py-14 sm:py-20">
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
              Learn From Someone Actually Building With AI.
            </h2>
            <p className="mt-4 text-[15px] leading-[1.65] text-white/55">
              Wisnotech is built by a working studio — products, automations and AI systems shipped for real clients.
              Every workflow in this masterclass is the same one used in production.
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

      {/* ── FAQ ── */}
      <section id="faq" className="scroll-mt-20 bg-[#0A0A0A] py-14 sm:py-20">
        <div className="mx-auto max-w-[760px] px-5 sm:px-8">
          <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-[#F5F3EE] sm:text-[34px]">Questions, Answered.</h2>
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
                      openFaq === i ? "rotate-45 border-[#FF4D12]/40 bg-[#FF4D12]/10 text-[#FF4D12]" : "border-white/15 text-white/60"
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

      {/* ── Final CTA ── */}
      <section className="bg-[#0A0A0A] py-14 sm:py-24">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#141414] px-6 py-12 text-center sm:px-12 sm:py-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#FF4D12]">
              Limited Slots — Remote &amp; Physical
            </p>
            <h2 className="mx-auto mt-4 max-w-[16ch] text-[32px] font-[800] leading-[0.92] tracking-[-0.04em] text-[#F5F3EE] sm:text-[46px]">
              Create, Build &amp; Sell With AI.
            </h2>
            <p className="mx-auto mt-4 max-w-[48ch] text-[15px] leading-[1.6] text-white/50">
              The people learning to work with AI now will have the advantage — not because AI does everything for
              them, but because they know how to direct it, build with it and sell what they make.
            </p>
            <div className="mx-auto mt-7 flex max-w-[420px] items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3">
              <span className="text-xs font-bold text-white">Early Bird {formatNaira(d.pricing.early)}</span>
              <span className="h-3 w-px bg-white/20" aria-hidden />
              <span className="text-xs text-white/40 line-through">Late {formatNaira(d.pricing.late)}</span>
              <span className="rounded-full bg-[#FF4D12] px-2 py-0.5 text-[10px] font-bold text-white">
                Save {formatNaira(d.pricing.save)}
              </span>
            </div>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href={PAYSTACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#FF4D12] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#E84510]"
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

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 bg-[#050505]">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-8 px-5 py-10 sm:px-8 sm:flex-row sm:items-start sm:justify-between sm:py-12">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <Logo />
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
