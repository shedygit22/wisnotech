import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Check, ChevronDown, Menu, X,
  Clapperboard, Code2, Megaphone, Play, Calendar, Users, Monitor,
} from "lucide-react";
import Logo from "./Logo";
import { getMasterclassContent, type MasterclassContent } from "../lib/cms";
import { usePreview } from "../lib/cmsPreview";
import { PORTFOLIO_SAMPLES } from "../lib/portfolio";

const fallback = getMasterclassContent();
const FALLBACK_PRICING = { early: 100000, late: 250000, save: 150000, deadlineNote: "Early bird closes soon — late registration is ₦250,000." };
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
] as const as MasterclassContent["modules"];
const FALLBACK_PROJECTS: MasterclassContent["projects"] = [
  { n: "01", title: "An AI-Powered SaaS Product", desc: "A functional web application with real product features — auth, dashboard, AI." },
  { n: "02", title: "An Autonomous AI Agent", desc: "A system that handles multi-step tasks, uses tools and delivers results." },
  { n: "03", title: "An AI Automation System", desc: "Connected tools and services that run a workflow automatically." },
  { n: "04", title: "An AI-Powered Mobile Application", desc: "A mobile app idea taken to a functional product." },
  { n: "05", title: "Your Own Product Idea", desc: "Your idea → your blueprint → your product → your launch." },
] as const as MasterclassContent["projects"];
const FALLBACK_FAQS: MasterclassContent["faqs"] = [
  { q: "Do I need to know how to code?", a: "No prior professional programming experience is required. The masterclass is designed to help you understand how to build with modern AI tools. You should be prepared to learn, experiment, troubleshoot and work through technical challenges." },
  { q: "Is this for complete beginners?", a: "Yes. Beginners can join. The training builds from foundational concepts into more advanced product-building, AI agent, automation and deployment workflows." },
  { q: "Will I learn how to build SaaS products?", a: "Yes. The masterclass covers the process and systems involved in building modern AI-powered web products." },
  { q: "Will we build AI agents?", a: "Yes. You will learn the concepts and workflows behind agentic AI systems and how AI agents can perform multi-step tasks." },
  { q: "Will I learn automation?", a: "Yes. You'll explore how APIs, triggers, workflows, AI and external services can be connected to automate useful processes." },
  { q: "What tools will we use?", a: "The AI ecosystem changes quickly. The masterclass focuses on relevant modern tools and, more importantly, the workflows and principles behind using them effectively." },
  { q: "How much is the masterclass?", a: "Early bird is ₦100,000. After early bird closes, it becomes ₦250,000. Joining early saves you ₦150,000." },
  { q: "Will the sessions be recorded?", a: "Yes. You will have access to all sessions." },
  { q: "How long is the masterclass?", a: "1 week intensive." },
  { q: "What happens after I register?", a: "After successful registration, you'll receive onboarding information and instructions for accessing the masterclass." },
] as const as MasterclassContent["faqs"];

function formatNaira(n: number) { return "₦" + n.toLocaleString("en-NG"); }

const VIDEO_POOL = PORTFOLIO_SAMPLES.filter(s => s.type === "video" && s.published);
const HERO_FEATURED = VIDEO_POOL.slice(0, 1);
const VIDEO_GRID = VIDEO_POOL.slice(1, 7);

const FLYER_HIGHLIGHTS = [
  {
    icon: Clapperboard,
    kicker: "01 — Hollywood Craft",
    title: "Hollywood Style AI Movie Production",
    desc: "Learn how to create “Premium” AI movie scenes — lighting, camera, world consistency — that look like they were shot on a multi-million dollar budget.",
    points: ["Cinematic camera & lighting", "Character & world consistency", "Sequence → final film"],
  },
  {
    icon: Code2,
    kicker: "02 — Ship Real Products",
    title: "Vibecoding & AI-Powered Assets",
    desc: "Turn ideas into working products. Auth, databases, testing & debugging AI-generated code, deploying MVPs — the full build loop.",
    points: ["Auth, DB & dashboards", "Debug & harden AI code", "Deploy your MVP live"],
  },
  {
    icon: Megaphone,
    kicker: "03 — Get Paid",
    title: "Building & Marketing an AI Agency",
    desc: "Package your AI skills into offers businesses will actually pay for. Positioning, pricing and delivery — from skill to business model.",
    points: ["Offer & pricing design", "Client acquisition flow", "Delivery systems that scale"],
  },
] as const;

export default function MasterclassPage() {
  const [mobileNav, setMobileNav] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [scrolled, setScrolled] = useState(false);
  const preview = usePreview("masterclass");
  const d = useMemo(() => {
    const c = preview as MasterclassContent | null ?? fallback;
    return {
      pricing: c?.pricing ? { early: c.pricing.earlyBird, late: c.pricing.latePrice, save: c.pricing.save, deadlineNote: c.pricing.deadlineNote } : FALLBACK_PRICING,
      modules: c?.modules ?? FALLBACK_MODULES,
      projects: c?.projects ?? FALLBACK_PROJECTS,
      faqs: c?.faqs ?? FALLBACK_FAQS,
      tools: c?.tools ?? fallback?.tools ?? [],
      paymentMethods: c?.paymentMethods ?? fallback?.paymentMethods ?? [],
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
    <div className="min-h-screen bg-[#060A14] text-white antialiased selection:bg-[#6EA8FF]/30 selection:text-white">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@400;500&display=swap');`}</style>

      {/* NAV */}
      <header className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${scrolled ? "border-white/[0.07] bg-[#060A14]/80 backdrop-blur-xl" : "border-transparent bg-transparent"}`}>
        <div className="mx-auto flex h-[64px] max-w-[1180px] items-center justify-between px-5 sm:px-8">
          <a href="/masterclass" className="shrink-0"><Logo /></a>
          <nav className="hidden items-center gap-1 lg:flex">
            {[
              { label: "What You'll Learn", href: "#learn" },
              { label: "Videos", href: "#videos" },
              { label: "Curriculum", href: "#curriculum" },
              { label: "Pricing", href: "#pricing" },
              { label: "FAQ", href: "#faq" },
            ].map(l => (
              <a key={l.label} href={l.href} className="rounded-full px-3.5 py-2 text-[13px] font-medium text-white/60 hover:bg-white/[0.06] hover:text-white">{l.label}</a>
            ))}
          </nav>
          <a href="https://paystack.shop/pay/tv9m8lungl" target="_blank" rel="noopener noreferrer" className="hidden items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-[#060A14] hover:bg-zinc-100 lg:inline-flex">Secure Early Bird — {formatNaira(d.pricing.early)} <ArrowRight className="h-3.5 w-3.5" /></a>
          <button type="button" onClick={() => setMobileNav(v => !v)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/80 lg:hidden">
            {mobileNav ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
        <AnimatePresence>
          {mobileNav && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="border-t border-white/10 bg-[#060A14] px-5 py-6 lg:hidden">
              <div className="flex flex-col gap-1">
                {[
                  { label: "What You'll Learn", href: "#learn" },
                  { label: "Videos", href: "#videos" },
                  { label: "Curriculum", href: "#curriculum" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "FAQ", href: "#faq" },
                ].map(l => (
                  <a key={l.label} href={l.href} onClick={() => setMobileNav(false)} className="rounded-xl px-3 py-3 text-[15px] font-medium text-white/70 hover:bg-white/[0.06]">{l.label}</a>
                ))}
                <a href="https://paystack.shop/pay/tv9m8lungl" target="_blank" rel="noopener noreferrer" onClick={() => setMobileNav(false)} className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-[#060A14]">Secure Early Bird — {formatNaira(d.pricing.early)} <ArrowRight className="h-4 w-4" /></a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO — dark, flyer-inspired */}
      <section className="relative overflow-hidden bg-[#060A14] pt-[64px]">
        {/* subtle gradients */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_0%,rgba(110,168,255,0.12),transparent_60%),radial-gradient(60%_50%_at_90%_10%,rgba(46,181,166,0.08),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="mx-auto grid max-w-[1180px] gap-10 px-5 pb-8 pt-8 sm:px-8 sm:pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-8">
          {/* left copy */}
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-[#6EA8FF] px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-white">Tech Bootcamp</span>
              <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70 sm:inline-flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Starts Dec, 2026 • Limited Slots</span>
            </div>

            <h1 className="mt-5 text-[40px] font-[900] leading-[0.88] tracking-[-0.05em] sm:text-[54px] lg:text-[62px]">
              <span className="block text-white/60 text-[22px] font-[800] tracking-[-0.03em] sm:text-[26px]">THE</span>
              <span className="block">
                <span className="bg-gradient-to-r from-[#6EA8FF] to-white bg-clip-text text-transparent">AI</span>{" "}
                <span className="text-white">CREATOR</span>
              </span>
              <span className="block text-[#6EA8FF]">MASTERCLASS</span>
              <span className="mt-2 flex items-center gap-3 text-[13px] font-[800] uppercase tracking-[0.22em] text-white sm:text-[14px]">
                Create, Build & Sell <span className="h-px w-12 bg-[#6EA8FF]" />
              </span>
            </h1>

            <p className="mt-4 max-w-[52ch] text-[14px] leading-[1.65] text-white/60 sm:text-[15px]">
              A practical, hands-on masterclass designed to help you master modern AI tools, <span className="font-semibold text-white">create professional content</span>, build real digital assets & solutions and <span className="font-semibold text-white">turn your AI skills into a profitable business model.</span>
            </p>

            {/* meta pills */}
            <div className="mt-6 grid grid-cols-3 gap-2">
              {[
                { icon: Monitor, label: "Remote & Physical" },
                { icon: Calendar, label: "Starts Dec, 2026" },
                { icon: Users, label: "Limited Slots" },
              ].map(m => (
                <div key={m.label} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6EA8FF]/15 text-[#6EA8FF]"><m.icon className="h-3.5 w-3.5" /></span>
                  <span className="text-[11px] font-semibold leading-tight text-white/80 sm:text-xs">{m.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://paystack.shop/pay/tv9m8lungl" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#060A14] shadow-[0_12px_32px_-16px_rgba(255,255,255,0.4)] hover:bg-zinc-100">Secure Early Bird — {formatNaira(d.pricing.early)} <ArrowRight className="h-4 w-4" /></a>
              <a href="#videos" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 py-3.5 text-sm font-medium text-white hover:bg-white/[0.08]"><Play className="h-4 w-4" /> Watch Showreel</a>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#060A14]">FEE {formatNaira(d.pricing.early)}</span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/50 line-through">Late Reg: {formatNaira(d.pricing.late)}</span>
              <span className="rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white">Save {formatNaira(d.pricing.save)}</span>
            </div>
            <p className="mt-2 text-[11px] font-medium tracking-[0.06em] text-white/30">{d.pricing.deadlineNote} • Remote & Physical.</p>
          </div>

          {/* right visual */}
          <div className="relative lg:sticky lg:top-[76px]">
            {/* fee card */}
            <div className="mb-3 ml-auto hidden max-w-[280px] overflow-hidden rounded-2xl border border-white/10 bg-white text-[#0A0A0A] sm:block">
              <div className="bg-[#0F2040] px-4 py-2.5 text-center"><p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-white">Fee: {formatNaira(d.pricing.early)}</p></div>
              <div className="bg-[#6EA8FF] px-4 py-2 text-center"><p className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-[#0F2040] line-through">Late Reg: {formatNaira(d.pricing.late)}</p></div>
            </div>

            <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0D1220] p-2 shadow-[0_40px_80px_-32px_rgba(0,0,0,0.7)]">
              <div className="relative aspect-[4/4.8] overflow-hidden rounded-[18px] bg-[#0A0A0A] lg:aspect-[4/4.6]">
                <img src="/assets/shedrack-akue-640.jpg" alt="AI Creator Masterclass" className="h-full w-full object-cover object-top" loading="eager" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060A14] via-transparent to-transparent opacity-60" />
                {/* floating badge */}
                <div className="absolute bottom-3 left-3 right-3 rounded-2xl border border-white/15 bg-white/95 p-3 backdrop-blur">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0F2040]">Note: Each student gets their own <span className="bg-[#6EA8FF] px-1 text-white">PAID AI VIDEO GEN TOOL!</span></p>
                  <p className="mt-1 text-[11px] font-medium text-black/60">Wisnotech School of Technology • Remote & Physical</p>
                </div>
                <div className="absolute top-3 left-3 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#0F2040] shadow">NYC</div>
              </div>

              {/* mini stats */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="rounded-xl bg-white/[0.06] p-3 text-center border border-white/10"><p className="text-xs font-bold text-white">AI Movie</p><p className="text-[11px] text-white/50">Premium scenes</p></div>
                <div className="rounded-xl bg-[#6EA8FF] p-3 text-center"><p className="text-xs font-bold text-white">Vibecode</p><p className="text-[11px] text-white/80">Ship MVPs</p></div>
                <div className="rounded-xl bg-white/[0.06] p-3 text-center border border-white/10"><p className="text-xs font-bold text-white">Agency</p><p className="text-[11px] text-white/50">Get paid</p></div>
              </div>
            </div>
            <p className="mt-3 text-center font-mono text-[11px] tracking-[0.08em] text-white/25">Wisnotech School of Technology • Whatsapp +2349153541297</p>
          </div>
        </div>
      </section>

      {/* trusted strip */}
      <section className="border-y border-white/10 bg-white/[0.02] py-4">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30 sm:gap-x-8">
          <span>Create</span><span className="h-1 w-1 rounded-full bg-white/15" /><span>Build</span><span className="h-1 w-1 rounded-full bg-white/15" /><span>Sell</span><span className="h-1 w-1 rounded-full bg-white/15" /><span>Remote & Physical</span><span className="h-1 w-1 rounded-full bg-white/15 hidden sm:inline-block" /><span>Dec 2026</span>
        </div>
      </section>

      {/* problem */}
      <section className="bg-[#060A14] py-12 sm:py-16">
        <div className="mx-auto max-w-[760px] px-5 text-center sm:px-8">
          <h2 className="text-[28px] font-[800] leading-[0.95] tracking-[-0.04em] text-white sm:text-[34px]">The Way Software Is Built Has Changed.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[14px] leading-[1.7] text-white/55">A few years ago you needed months, a dev team and multiple languages. Today AI can ship fast — but there is a gap between <span className="font-semibold text-white">randomly prompting an app</span> and <span className="font-semibold text-white">directing AI to build a real product.</span></p>
          <div className="mx-auto mt-6 grid max-w-2xl gap-2 text-left sm:grid-cols-3">
            {["Break down an idea","Design the right system","Direct AI effectively","Debug problems","Connect APIs & services","Build intelligent workflows","Create autonomous agents","Deploy and improve"].map(t => (
              <span key={t} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/70"><span className="h-1.5 w-1.5 rounded-full bg-[#6EA8FF]" />{t}</span>
            ))}
          </div>
          <p className="mt-8 text-[18px] font-[800] tracking-[-0.02em] text-white">That's what this masterclass is about.</p>
        </div>
      </section>

      {/* VIDEO SHOWREEL — from Academy /portfolio */}
      <section id="videos" className="scroll-mt-20 bg-[#070B1E] py-12 sm:py-16">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#6EA8FF]">Showreel • From the Academy</p>
            <h2 className="mt-2 text-[28px] font-[800] tracking-[-0.04em] text-white sm:text-[34px]">See What AI Creation Looks Like.</h2>
            <p className="mt-2 text-sm leading-[1.6] text-white/55">Frames from studio & student work — the same workflow you will learn: cinematic, consistent, premium.</p>
          </div>

          <div className="mt-8 grid gap-3 lg:grid-cols-[1.4fr_1fr]">
            {/* featured */}
            <div className="relative overflow-hidden rounded-[20px] border border-white/10 bg-black">
              {HERO_FEATURED[0] && (
                <video autoPlay loop muted playsInline preload="metadata" poster={HERO_FEATURED[0].poster} className="h-full w-full object-cover aspect-[16/10] lg:aspect-[4/3]">
                  <source src={HERO_FEATURED[0].src} type="video/mp4" />
                </video>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">Featured • Auto-play</span>
              <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#060A14]"><Play className="ml-0.5 h-4 w-4" /></span>
            </div>
            {/* grid */}
            <div className="grid grid-cols-3 gap-3">
              {VIDEO_GRID.map(v => (
                <div key={v.id} className="relative aspect-[3/4] overflow-hidden rounded-[14px] border border-white/10 bg-black">
                  <video autoPlay loop muted playsInline preload="metadata" poster={v.poster} className="h-full w-full object-cover">
                    <source src={v.src} type="video/mp4" />
                  </video>
                  <span className="absolute bottom-2 left-2 rounded-full bg-white px-2 py-0.5 text-[9px] font-bold text-black">{v.category}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-3 text-center font-mono text-[11px] tracking-[0.08em] text-white/25">Pulled from <a href="/academy" className="underline decoration-white/20 hover:text-white">/academy</a> portfolio — real prompts, real products.</p>
        </div>
      </section>

      {/* FLYER HIGHLIGHT — what you will learn 3 cards */}
      <section id="learn" className="scroll-mt-20 bg-[#0A1226] py-12 sm:py-16">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#6EA8FF]">What You Will Learn</p>
            <h2 className="mt-2 text-[28px] font-[800] tracking-[-0.04em] text-white sm:text-[34px]">Create. Build. Sell.</h2>
            <p className="mt-2 text-sm leading-[1.6] text-white/55">Three outcomes — one masterclass. Movie-level creation, real product shipping, and turning skill into income.</p>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {FLYER_HIGHLIGHTS.map(h => (
              <div key={h.title} className="rounded-[20px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#6EA8FF]/20 bg-[#6EA8FF]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#6EA8FF]"><h.icon className="h-3 w-3" /> {h.kicker}</span>
                <h3 className="mt-3 text-[16px] font-bold leading-tight tracking-[-0.01em] text-white">{h.title}</h3>
                <p className="mt-2 text-[13px] leading-[1.6] text-white/55">{h.desc}</p>
                <ul className="mt-4 space-y-1.5">
                  {h.points.map(p => (
                    <li key={p} className="flex gap-2 text-[12px] leading-[1.5] text-white/60"><Check className="mt-0.5 h-3 w-3 shrink-0 text-[#6EA8FF]" />{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-[#6EA8FF]/20 bg-[#6EA8FF] px-5 py-4 text-center">
            <p className="text-sm font-[800] uppercase tracking-[0.06em] text-white"><span className="bg-white px-2 py-0.5 text-[#0F2040]">NOTE:</span> Each student gets their own <span className="underline decoration-white/40">PAID AI VIDEO GEN TOOL</span> — included with enrolment.</p>
            <p className="mt-1 text-xs text-white/80">No extra subscription needed to start creating premium scenes.</p>
          </div>
        </div>
      </section>

      {/* curriculum — existing 10 modules dark */}
      <section id="curriculum" className="scroll-mt-20 bg-[#060A14] py-12 sm:py-16">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-white sm:text-[34px]">Learn the New Way of Building.</h2>
            <p className="mt-2 text-sm leading-[1.6] text-white/55">The full 10-module system behind idea → blueprint → product → launch.</p>
          </div>
          <div className="mt-8 grid gap-[1px] overflow-hidden rounded-[20px] border border-white/10 bg-white/10 sm:grid-cols-2">
            {d.modules.map(m => (
              <div key={m.n} className="bg-[#0D1220] p-6 sm:p-7">
                <div className="flex items-center gap-3"><span className="font-mono text-xs tracking-[0.14em] text-[#6EA8FF]">{m.n}</span><span className="h-px flex-1 bg-white/10" /></div>
                <h3 className="mt-3 text-[15px] font-bold tracking-[-0.01em] text-white">{m.title}</h3>
                <p className="mt-1.5 text-xs leading-[1.6] text-white/50">{m.desc}</p>
                <ul className="mt-3 space-y-1">
                  {m.bullets.map(b => (
                    <li key={b} className="flex gap-2 text-[12px] leading-[1.5] text-white/60"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/20" />{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* what you'll build */}
      <section id="build" className="scroll-mt-20 bg-[#070B1E] py-12 sm:py-16">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <h2 className="text-center text-[24px] font-[800] tracking-[-0.04em] text-white sm:text-[30px]">You Won't Leave With Just Notes.</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm leading-[1.6] text-white/55">Five builds that mirror real client work — you ship them live.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {d.projects.map(p => (
              <div key={p.title} className="rounded-[16px] border border-white/10 bg-white/[0.04] p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-[#060A14]">{p.n}</span>
                <h3 className="mt-3 text-sm font-bold tracking-[-0.01em] text-white">{p.title}</h3>
                <p className="mt-1.5 text-xs leading-[1.6] text-white/50">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* tools */}
      <section id="tools" className="scroll-mt-20 bg-[#060A14] py-12 sm:py-16">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-white sm:text-[34px]">Tools Included — Free to Use.</h2>
            <p className="mt-2 text-sm leading-[1.6] text-white/55">Powerful AI builders you will use hands-on — included with enrolment.</p>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              { img: "/assets/antigravity.jpg", name: "Antigravity", desc: "Agent framework for systems that reason, plan and execute." },
              { img: "/assets/hermes-agent.jpg", name: "Hermes Agent", desc: "Conversational agents that search, analyze and use tools." },
              { img: "/assets/open-code.jpg", name: "Open Code", desc: "AI coding assistant — write, debug and refactor faster." },
            ].map(t => (
              <div key={t.name} className="rounded-[20px] border border-white/10 bg-white/[0.04] p-6">
                <div className="aspect-square overflow-hidden rounded-[12px] bg-black"><img src={t.img} alt={t.name} className="h-full w-full object-cover" loading="lazy" /></div>
                <h3 className="mt-5 text-[16px] font-bold tracking-[-0.01em] text-white">{t.name}</h3>
                <p className="mt-2 text-[13px] leading-[1.6] text-white/55">{t.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-bold text-emerald-400 border border-emerald-500/20">Free to use</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* why different + what you get */}
      <section className="bg-[#0A1226] py-12 sm:py-16">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <h2 className="text-center text-[24px] font-[800] tracking-[-0.04em] text-white sm:text-[30px]">Most People Are Learning Tools. You'll Learn How to Build.</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { n: "01", t: "Product Thinking", d: "Not button-clicking. Learn product, users, features and systems." },
              { n: "02", t: "Hands-On Building", d: "You build, not just watch — the fastest way to understand AI." },
              { n: "03", t: "Future-Ready", d: "Tools change. Principles stay. Adapt as new tools emerge." },
            ].map(s => (
              <div key={s.n} className="rounded-[16px] border border-white/10 bg-white/[0.04] p-6">
                <span className="font-mono text-xs tracking-[0.14em] text-white/30">{s.n}</span>
                <h3 className="mt-2 text-sm font-bold text-white">{s.t}</h3>
                <p className="mt-2 text-xs leading-[1.6] text-white/55">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#060A14] py-12 sm:py-16">
        <div className="mx-auto max-w-[760px] px-5 sm:px-8">
          <h2 className="text-[22px] font-[800] tracking-[-0.03em] text-white sm:text-[28px]">Everything You Need to Start Building.</h2>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {[
              "Complete AI Creator Masterclass","Practical AI building workflows","SaaS product development","AI-powered application training","Agentic AI concepts","AI automation training","API and integration concepts","Mobile application building","Hands-on projects (5)","Product-building frameworks","Prompt frameworks","Hollywood-style AI movie production","Agent & automation blueprints","Community access","Session recordings + Certificate",
            ].map(f => (
              <span key={f} className="flex gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/70"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6EA8FF]" />{f}</span>
            ))}
          </div>
          <div className="mt-6 rounded-[14px] bg-white px-5 py-4 text-center">
            <p className="text-sm font-bold text-[#060A14]">You're not paying for information.</p>
            <p className="mt-1 text-xs leading-[1.6] text-black/60">You're investing in the ability to turn ideas into things that actually exist — and get paid for it.</p>
          </div>
        </div>
      </section>

      {/* Pricing — updated to flyer 100k / 250k */}
      <section id="pricing" className="scroll-mt-20 bg-[#070B1E] py-12 sm:py-16">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#6EA8FF]">Wisnotech School of Technology • Tech Bootcamp</p>
            <h2 className="mt-2 text-[28px] font-[800] tracking-[-0.04em] text-white sm:text-[36px]">Join Before the Price Doubles.</h2>
            <p className="mt-2 text-sm leading-[1.6] text-white/55">Early bird is the lowest price — late registration is {formatNaira(d.pricing.late)}.</p>
          </div>

          <div className="mx-auto mt-8 max-w-[520px] overflow-hidden rounded-[22px] border border-white/10 bg-[#0D1220] shadow-[0_24px_64px_-16px_rgba(0,0,0,0.5)]">
            <div className="bg-white px-6 py-3 text-center"><p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#0F2040]">Early Bird Access</p></div>
            <div className="p-7 sm:p-8">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-[44px] font-[900] tracking-[-0.04em] text-white">{formatNaira(d.pricing.early)}</span>
                <span className="text-xs font-bold tracking-[0.08em] text-white/30">EARLY BIRD</span>
              </div>
              <p className="mt-1 text-center text-xs font-medium text-white/50">FEE — full access</p>
              <ul className="mt-6 space-y-2">
                {["Full masterclass + Hollywood AI movie module","Complete 10-module curriculum","5 hands-on projects","Paid AI video gen tool — yours","Resources, frameworks & vault","Community access"].map(f => (
                  <li key={f} className="flex gap-2.5 text-[13px] leading-[1.5] text-white/70"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#6EA8FF]" />{f}</li>
                ))}
              </ul>
              <a href="https://paystack.shop/pay/tv9m8lungl" target="_blank" rel="noopener noreferrer" className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-bold text-[#060A14] hover:bg-zinc-100">Secure My Seat for {formatNaira(d.pricing.early)} <ArrowRight className="h-4 w-4" /></a>
              <p className="mt-2 text-center text-xs font-bold text-emerald-400">Save {formatNaira(d.pricing.save)}.</p>
            </div>
          </div>

          <div className="mx-auto mt-4 max-w-[520px] overflow-hidden rounded-[16px] border border-white/10 bg-[#0D1220]">
            <div className="grid grid-cols-2 divide-x divide-white/10">
              <div className="bg-emerald-500/10 p-4 text-center">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">Early Bird</p>
                <p className="mt-1 text-[20px] font-[800] tracking-[-0.02em] text-white">{formatNaira(d.pricing.early)}</p>
                <p className="text-[11px] font-medium text-emerald-400">Save {formatNaira(d.pricing.save)}</p>
              </div>
              <div className="p-4 text-center">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">Late Registration</p>
                <p className="mt-1 text-[20px] font-[800] tracking-[-0.02em] text-white/40 line-through">{formatNaira(d.pricing.late)}</p>
                <p className="text-[11px] text-white/30">Standard price</p>
              </div>
            </div>
            <p className="bg-white px-4 py-3 text-center text-xs font-bold text-[#0F2040]">Once early bird closes, the price becomes {formatNaira(d.pricing.late)}. Secure your seat while early bird is live.</p>
          </div>
        </div>
      </section>

      {/* Payment banners — dark */}
      <section className="bg-[#060A14] py-12 sm:py-16">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-white sm:text-[34px]">Choose Your Payment Method.</h2>
            <p className="mt-2 text-sm leading-[1.6] text-white/55">Select the option that works best for your location.</p>
          </div>
          <div className="mx-auto mt-8 grid max-w-[800px] gap-6 sm:grid-cols-2">
            <a href="https://paystack.shop/pay/tv9m8lungl" target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-[20px] border border-white/10 bg-[#0D2136] p-8 text-center hover:border-white/15">
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white/80">For Africa</span>
              <img src="/assets/paystack-banner.png" alt="Paystack" className="mx-auto mt-4 h-16 w-auto object-contain" loading="lazy" />
              <p className="mt-4 text-sm font-semibold text-white">Pay in Naira</p>
              <p className="mt-1 text-xs text-white/50">Secure payment via Paystack</p>
              <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0A0A0A] group-hover:bg-zinc-100">Pay {formatNaira(d.pricing.early)} <ArrowRight className="h-4 w-4" /></span>
            </a>
            <a href="https://selar.com/58h5q98191" target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-[20px] border border-white/10 bg-[#3A1030] p-8 text-center hover:border-white/15">
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white/80">International</span>
              <img src="/assets/selar-banner.png" alt="Selar" className="mx-auto mt-4 h-16 w-auto object-contain" loading="lazy" />
              <p className="mt-4 text-sm font-semibold text-white">Pay in USD</p>
              <p className="mt-1 text-xs text-white/50">Secure payment via Selar</p>
              <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0A0A0A] group-hover:bg-zinc-100">Pay $37.14 <ArrowRight className="h-4 w-4" /></span>
            </a>
          </div>
          <p className="mt-4 text-center font-mono text-[11px] tracking-[0.06em] text-white/25">Questions? Whatsapp & Calls: +2349153541297 • www.wisnotech.vercel.app</p>
        </div>
      </section>

      {/* objection */}
      <section className="bg-[#070B1E] py-12 sm:py-16">
        <div className="mx-auto max-w-[760px] px-5 sm:px-8">
          <h2 className="text-[22px] font-[800] tracking-[-0.03em] text-white sm:text-[28px]">“But I'm Not a Programmer...”</h2>
          <p className="mt-3 text-sm leading-[1.7] text-white/55">That's exactly why this exists. AI has removed the gatekeeping — you work with tools that write, explain, debug and improve software with you. You learn structure, communication, breaking problems down, reviewing outputs, testing, debugging and connecting technologies.</p>
        </div>
      </section>

      {/* instructor */}
      <section className="bg-[#060A14] py-12 sm:py-16">
        <div className="mx-auto grid max-w-[1180px] gap-8 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-white/10 bg-[#0D1220] lg:aspect-[4/4.2]">
            <img src="/assets/shedrack-akue-640.jpg" alt="Shedrack Akue — Founder, Wisnotech" className="h-full w-full object-cover object-top" loading="lazy" />
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/35">Your Instructor</p>
            <h2 className="mt-3 text-[28px] font-[800] leading-[0.95] tracking-[-0.04em] text-white sm:text-[34px]">Learn From Someone Building With AI, Not Just Talking About It.</h2>
            <p className="mt-4 text-sm font-semibold text-white">Shedrack Akue — Founder, Wisnotech</p>
            <p className="mt-3 text-sm leading-[1.65] text-white/55">The gap between idea and product is shrinking daily. Access to tools alone doesn't make a builder. This masterclass gives you the process — and a practical starting point to create with AI.</p>
            <a href="/portfolio" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white underline decoration-white/20 underline-offset-4 hover:decoration-white">Explore My Work <ArrowRight className="h-3.5 w-3.5" /></a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-[#070B1E] py-12 sm:py-16">
        <div className="mx-auto max-w-[760px] px-5 sm:px-8">
          <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-white sm:text-[34px]">Questions, Answered.</h2>
          <div className="mt-8 divide-y divide-white/10 overflow-hidden rounded-[16px] border border-white/10 bg-white/[0.04]">
            {d.faqs.map((f, i) => (
              <div key={f.q}>
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6" aria-expanded={openFaq === i}>
                  <span className="text-[14px] font-semibold leading-[1.4] tracking-[-0.01em] text-white sm:text-[15px]">{f.q}</span>
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all ${openFaq === i ? "rotate-45 border-white bg-white text-[#060A14]" : "border-white/15 text-white/40"}`}><ChevronDown className={`h-4 w-4 transition-transform ${openFaq === i ? "rotate-180" : ""}`} /></span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                      <p className="px-5 pb-5 text-[13px] leading-[1.65] text-white/55 sm:px-6">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* final CTA */}
      <section className="bg-[#060A14] py-14 sm:py-16">
        <div className="mx-auto max-w-[760px] px-5 text-center sm:px-8">
          <h2 className="text-[28px] font-[800] leading-[0.95] tracking-[-0.04em] text-white sm:text-[36px]">The Barrier Between an Idea and a Working Product Is Getting Smaller.</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-[1.6] text-white/55">The people who learn to work with AI now have the advantage — not because AI does everything, but because they know how to direct it, build, test, automate and ship.</p>
          <p className="mt-6 text-sm font-bold tracking-[0.02em] text-white">The question is no longer “Can I build this?”</p>
          <p className="text-[20px] font-[800] tracking-[-0.03em] text-[#6EA8FF]">“What am I going to build?”</p>
          <div className="mx-auto mt-6 flex max-w-[420px] items-center justify-center gap-4 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3">
            <span className="text-xs font-bold text-white">Early Bird {formatNaira(d.pricing.early)}</span><span className="h-3 w-px bg-white/15" /><span className="text-xs text-white/40 line-through">Late {formatNaira(d.pricing.late)}</span><span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">Save {formatNaira(d.pricing.save)}</span>
          </div>
          <p className="mt-2 text-xs font-bold text-emerald-400">Secure your seat now and save {formatNaira(d.pricing.save)}.</p>
          <a href="https://paystack.shop/pay/tv9m8lungl" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#060A14] hover:bg-zinc-100">Join the Masterclass for {formatNaira(d.pricing.early)} <ArrowRight className="h-4 w-4" /></a>
          <p className="mt-3 text-[11px] tracking-[0.06em] text-white/25">Early bird available for a limited period. Then {formatNaira(d.pricing.late)}.</p>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#050914]">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-6 px-5 py-8 sm:px-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5"><Logo /><span className="text-[11px] font-bold tracking-[0.12em] text-white/50">MASTERCLASS</span></div>
          <div className="flex flex-wrap gap-6 text-xs font-medium text-white/50">
            <a href="#learn" className="hover:text-white">Learn</a><a href="#videos" className="hover:text-white">Videos</a><a href="#pricing" className="hover:text-white">Pricing</a><a href="/privacy" className="hover:text-white">Privacy</a>
          </div>
        </div>
        <div className="border-t border-white/10"><div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-4 sm:px-8"><p className="text-xs text-white/30">© {new Date().getFullYear()} Wisnotech School of Technology.</p><p className="hidden text-xs text-white/20 sm:block">Create, Build & Sell.</p></div></div>
      </footer>
    </div>
  );
}
