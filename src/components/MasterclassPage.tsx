import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, ChevronDown, Menu, X, Play } from "lucide-react";
import Logo from "./Logo";
import { getMasterclassContent, type MasterclassContent } from "../lib/cms";
import { usePreview } from "../lib/cmsPreview";

const fallback = getMasterclassContent();

const FALLBACK_PRICING = { early: 50000, late: 100000, save: 50000, deadlineNote: "Limited early bird registration." };
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
  { q: "How much is the masterclass?", a: "Early bird is ₦50,000. After early bird closes, it becomes ₦100,000. Joining early saves you ₦50,000." },
  { q: "Will the sessions be recorded?", a: "Yes. You will have access to all sessions." },
  { q: "How long is the masterclass?", a: "1 week intensive." },
  { q: "What happens after I register?", a: "After successful registration, you'll receive onboarding information and instructions for accessing the masterclass." },
];

function formatNaira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

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
    <div className="min-h-screen bg-[#FCFCF9] text-[#0A0A0A] antialiased selection:bg-[#0A0A0A] selection:text-white">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Instrument+Serif:ital@0;1&display=swap');`}</style>

      {/* Nav */}
      <header className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${scrolled ? "border-black/[0.08] bg-white/90 backdrop-blur-xl" : "border-transparent bg-transparent"}`}>
        <div className="mx-auto flex h-[64px] max-w-[1160px] items-center justify-between px-5 sm:px-8">
          <a href="/masterclass" className="shrink-0"><Logo className="text-black" invert /></a>
          <nav className="hidden items-center gap-1 lg:flex">
            {[
              { label: "What You'll Learn", href: "#learn" },
              { label: "What You'll Build", href: "#build" },
              { label: "Tools Included", href: "#tools" },
              { label: "Curriculum", href: "#curriculum" },
              { label: "Pricing", href: "#pricing" },
              { label: "FAQ", href: "#faq" },
            ].map((l) => (
              <a key={l.label} href={l.href} className="rounded-full px-3.5 py-2 text-[13px] font-medium text-black/55 hover:bg-black/[0.06] hover:text-black">{l.label}</a>
            ))}
          </nav>
          <a href="https://paystack.shop/pay/96toe5qx8t" target="_blank" rel="noopener noreferrer" className="hidden items-center gap-2 rounded-full bg-[#0A0A0A] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-black lg:inline-flex">Secure Early Bird Access <ArrowRight className="h-3.5 w-3.5" /></a>
          <button type="button" onClick={() => setMobileNav((v) => !v)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-black/70 lg:hidden">
            {mobileNav ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
        <AnimatePresence>
          {mobileNav && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="border-t border-black/10 bg-white px-5 py-6 lg:hidden">
              <div className="flex flex-col gap-1">
                {[
                  { label: "What You'll Learn", href: "#learn" },
                  { label: "What You'll Build", href: "#build" },
                  { label: "Tools Included", href: "#tools" },
                  { label: "Curriculum", href: "#curriculum" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "FAQ", href: "#faq" },
                ].map((l) => (
                  <a key={l.label} href={l.href} onClick={() => setMobileNav(false)} className="rounded-xl px-3 py-3 text-[15px] font-medium text-black/70 hover:bg-black/[0.04]">{l.label}</a>
                ))}
                <a href="https://paystack.shop/pay/96toe5qx8t" target="_blank" rel="noopener noreferrer" onClick={() => setMobileNav(false)} className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-[#0A0A0A] px-5 py-3.5 text-sm font-semibold text-white">Secure Early Bird Access <ArrowRight className="h-4 w-4" /></a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#FCFCF9] pt-[64px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(0,0,0,0.04),transparent_60%)]" />
        <div className="mx-auto grid max-w-[1160px] gap-10 px-5 pb-10 pt-10 sm:px-8 sm:pt-14 lg:grid-cols-[1.05fr_0.9fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-black/60">Agentic AI + Vibe Coding Masterclass</p>
            <h1 className="mt-5 max-w-[14ch] text-[36px] font-[800] leading-[0.92] tracking-[-0.04em] text-[#0A0A0A] sm:text-[48px] lg:text-[52px]">Stop Watching AI Build the Future. <span className="font-[Instrument_Serif] font-normal italic tracking-[-0.03em]">Start Building With It.</span></h1>
            <p className="mt-4 max-w-[48ch] text-[15px] leading-[1.6] text-black/60">Learn how to turn your ideas into real software, AI agents, SaaS products, mobile apps and automated systems using the new generation of AI-powered building tools.</p>
            <p className="mt-3 max-w-[52ch] text-[13px] leading-[1.6] text-black/50">A practical masterclass that teaches you how to think like a product builder, direct AI effectively, connect intelligent systems, solve problems and ship products into the real world.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="https://paystack.shop/pay/96toe5qx8t" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#0A0A0A] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_32px_-12px_rgba(0,0,0,0.3)] hover:bg-black">Secure Your Early Bird Seat — {formatNaira(100000)} <ArrowRight className="h-4 w-4" /></a>
              <a href="#learn" className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-7 py-3.5 text-sm font-medium text-black hover:border-black/20">See What You&apos;ll Learn</a>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-black/10 pt-4">
              <span className="rounded-full bg-[#0A0A0A] px-3 py-1 text-xs font-bold text-white">Early Bird: {formatNaira(d.pricing.early)}</span>
              <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-black/60 line-through">Late: {formatNaira(d.pricing.late)}</span>
              <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">Save {formatNaira(d.pricing.save)}</span>
            </div>
            <p className="mt-2 text-[11px] font-medium tracking-[0.06em] text-black/40">Limited early bird registration.</p>
          </div>
          <div className="relative">
            <div className="relative overflow-hidden rounded-[20px] border border-black/10 bg-white p-3 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.12)]">
              <div className="rounded-[14px] bg-[#0A0A0A] p-4 text-white">
                <div className="flex items-center justify-between"><span className="font-mono text-[10px] tracking-[0.12em] text-white/40">MASTERCLASS PREVIEW</span><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /></div>
                <div className="mt-4 space-y-2 font-mono text-[11px] leading-[1.6]">
                  <p className="text-white/50">› idea → blueprint</p>
                  <p className="text-emerald-400">✓ vibe coding — feature shipped</p>
                  <p className="text-emerald-400">✓ agent reasons → uses tools → delivers</p>
                  <p className="text-white">● product live</p>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-white/[0.06] p-2 text-center"><p className="font-mono text-[9px] tracking-[0.08em] text-white/40">SAAS</p><p className="mt-1 text-xs font-bold">● Live</p></div>
                  <div className="rounded-lg bg-white/[0.06] p-2 text-center"><p className="font-mono text-[9px] tracking-[0.08em] text-white/40">AGENT</p><p className="mt-1 text-xs font-bold">● Active</p></div>
                  <div className="rounded-lg bg-white/[0.06] p-2 text-center"><p className="font-mono text-[9px] tracking-[0.08em] text-white/40">MOBILE</p><p className="mt-1 text-xs font-bold">● Shipped</p></div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-black/10 bg-[#FCFCF9] p-3 text-center"><p className="text-xs font-bold text-[#0A0A0A]">SaaS</p><p className="text-[11px] text-black/50">Web product</p></div>
                <div className="rounded-xl border border-black/10 bg-[#FCFCF9] p-3 text-center"><p className="text-xs font-bold text-[#0A0A0A]">Agent</p><p className="text-[11px] text-black/50">Does work</p></div>
                <div className="rounded-xl border border-black/10 bg-[#FCFCF9] p-3 text-center"><p className="text-xs font-bold text-[#0A0A0A]">Mobile</p><p className="text-[11px] text-black/50">In your hands</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-y border-black/10 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-[760px] px-5 text-center sm:px-8">
          <h2 className="text-[26px] font-[800] leading-[0.95] tracking-[-0.04em] text-[#0A0A0A] sm:text-[32px]">The Way Software Is Built Has Changed.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[14px] leading-[1.7] text-black/60">A few years ago, turning an idea into a working product often meant learning multiple programming languages, hiring developers, or spending months building a prototype. Today, AI can help you move much faster. But there is a major difference between <span className="font-semibold text-black">asking AI to randomly generate an app</span> and <span className="font-semibold text-black">knowing how to direct AI to help you build a real product.</span></p>
          <div className="mx-auto mt-6 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
            {[
              "Break down an idea",
              "Design the right system",
              "Direct AI effectively",
              "Debug problems",
              "Connect APIs & services",
              "Build intelligent workflows",
              "Create autonomous agents",
              "Deploy and improve real products",
            ].map((t) => (
              <span key={t} className="flex items-center gap-2 rounded-full border border-black/10 bg-[#FCFCF9] px-3 py-2 text-xs font-medium text-black/70"><span className="h-1.5 w-1.5 rounded-full bg-[#0A0A0A]" />{t}</span>
            ))}
          </div>
          <p className="mt-8 text-[18px] font-[800] tracking-[-0.02em] text-[#0A0A0A]">That&apos;s what this masterclass is about.</p>
        </div>
      </section>

      {/* Transformation */}
      <section className="bg-[#0A0A0A] py-12 text-white sm:py-16">
        <div className="mx-auto max-w-[760px] px-5 text-center sm:px-8">
          <h2 className="text-[26px] font-[800] tracking-[-0.04em] sm:text-[32px]">From “I Have an Idea” to “I Built It.”</h2>
          <div className="mx-auto mt-8 max-w-md space-y-3">
            <div className="rounded-[14px] border border-white/10 bg-white/[0.04] p-4 text-left"><p className="font-mono text-[10px] tracking-[0.14em] text-white/40">BEFORE</p><p className="mt-1 text-sm font-medium">You have ideas but don&apos;t know how to turn them into products.</p></div>
            <div className="flex justify-center text-white/20">↓</div>
            <div className="rounded-[14px] border border-white/10 bg-white/[0.04] p-4 text-left"><p className="font-mono text-[10px] tracking-[0.14em] text-white/40">DURING THE MASTERCLASS</p><p className="mt-1 text-sm font-medium">You learn how to use AI as a powerful building partner.</p></div>
            <div className="flex justify-center text-white/20">↓</div>
            <div className="rounded-[14px] bg-white p-4 text-left text-black"><p className="font-mono text-[10px] tracking-[0.14em] text-black/40">AFTER</p><p className="mt-1 text-sm font-bold">You can confidently create, test, automate, improve and launch your own digital products.</p></div>
          </div>
          <p className="mx-auto mt-6 max-w-xl text-xs leading-[1.6] text-white/40">This isn&apos;t about becoming dependent on one AI tool. It&apos;s about learning a modern way of building — because the tools will continue to change, but product thinking remains valuable.</p>
        </div>
      </section>

      {/* Who it's for */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-[760px] px-5 sm:px-8">
          <h2 className="text-[22px] font-[800] tracking-[-0.03em]">This Is for You If...</h2>
          <div className="mt-6 space-y-2">
            {[
              "You have software or app ideas but don't know how to build them.",
              "You want to build SaaS products without waiting months for developers.",
              "You want to use AI to create real websites and applications.",
              "You want to understand vibe coding beyond just generating random projects.",
              "You want to build AI agents that can perform useful tasks.",
              "You want to automate repetitive business processes.",
              "You want to build AI-powered tools for clients or businesses.",
              "You are a freelancer or entrepreneur looking for high-value skills.",
              "You want to launch your own digital product.",
              "You want to understand how modern AI-powered software is actually being built.",
            ].map((t) => (
              <div key={t} className="flex gap-3 rounded-xl border border-black/10 bg-[#FCFCF9] px-4 py-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0A0A0A]" /><span className="text-[13px] leading-[1.5] text-black/70">{t}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[14px] bg-[#0A0A0A] px-5 py-4 text-center">
            <p className="text-sm font-bold text-white">You don&apos;t need to already be an expert programmer.</p>
            <p className="mt-1 text-xs leading-[1.6] text-white/60">This is hands-on for people willing to experiment, build, break things, fix them and improve.</p>
          </div>
        </div>
      </section>

      {/* What you'll learn */}
      <section id="learn" className="scroll-mt-20 bg-[#F7F7F5] py-12 sm:py-16">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[28px] font-[800] tracking-[-0.04em] sm:text-[34px]">Learn the New Way of Building.</h2>
            <p className="mt-2 text-sm leading-[1.6] text-black/60">You&apos;ll move beyond tutorials and explore the practical workflow behind turning an idea into a working product.</p>
          </div>
          <div className="mt-8 grid gap-[1px] overflow-hidden rounded-[20px] border border-black/10 bg-black/10 sm:grid-cols-2">
            {d.modules.map((m) => (
              <div key={m.n} className="bg-white p-6 sm:p-7">
                <div className="flex items-center gap-3"><span className="font-mono text-xs tracking-[0.14em] text-black/30">{m.n}</span><span className="h-px flex-1 bg-black/10" /></div>
                <h3 className="mt-3 text-[15px] font-bold tracking-[-0.01em]">{m.title}</h3>
                <p className="mt-1.5 text-xs leading-[1.6] text-black/55">{m.desc}</p>
                <ul className="mt-3 space-y-1">
                  {m.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-[12px] leading-[1.5] text-black/60"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-black/20" />{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you'll build */}
      <section id="build" className="scroll-mt-20 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <h2 className="text-center text-[24px] font-[800] tracking-[-0.04em] sm:text-[30px]">You Won&apos;t Leave With Just Notes.</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm leading-[1.6] text-black/60">Practical projects designed to help you understand how real AI-powered products are created.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {d.projects.map((p) => (
              <div key={p.title} className="rounded-[16px] border border-black/10 bg-[#FCFCF9] p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0A0A0A] text-xs font-bold text-white">{p.n}</span>
                <h3 className="mt-3 text-sm font-bold tracking-[-0.01em]">{p.title}</h3>
                <p className="mt-1.5 text-xs leading-[1.6] text-black/55">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools included */}
      <section id="tools" className="scroll-mt-20 bg-[#F7F7F5] py-12 sm:py-16">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[28px] font-[800] tracking-[-0.04em] sm:text-[34px]">Tools Included — Free to Use.</h2>
            <p className="mt-2 text-sm leading-[1.6] text-black/60">You&apos;ll get hands-on with these powerful AI tools during the masterclass — and they&apos;re all free.</p>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              {
                img: "/assets/antigravity.jpg",
                name: "Antigravity",
                desc: "A versatile AI agent framework for building intelligent systems that reason, plan and execute complex tasks autonomously.",
              },
              {
                img: "/assets/hermes-agent.jpg",
                name: "Hermes Agent",
                desc: "A powerful AI assistant platform for creating conversational agents that can search, analyze, generate and interact with external tools.",
              },
              {
                img: "/assets/open-code.jpg",
                name: "Open Code",
                desc: "An open-source AI coding assistant that helps you write, debug, and refactor code faster with intelligent suggestions and context-aware completions.",
              },
            ].map((t) => (
              <div key={t.name} className="rounded-[20px] border border-black/10 bg-white p-6 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.06)]">
                <div className="aspect-square overflow-hidden rounded-[12px] bg-[#FCFCF9]">
                  <img src={t.img} alt={t.name} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <h3 className="mt-5 text-[16px] font-bold tracking-[-0.01em]">{t.name}</h3>
                <p className="mt-2 text-[13px] leading-[1.6] text-black/60">{t.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">Free to use</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video showcase */}
      <section className="scroll-mt-20 bg-[#090909] py-12 sm:py-16">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[28px] font-[800] tracking-[-0.04em] sm:text-[34px]">Watch the Projects Come to Life.</h2>
            <p className="mt-2 text-sm leading-[1.6] text-white/60">See exactly what you\'ll build in the masterclass — real projects, real results.</p>
          </div>
          <div className="mx-auto mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group relative overflow-hidden rounded-[16px] border border-white/10 bg-[#111111] p-4 text-center">
              <div className="relative aspect-video overflow-hidden rounded-[12px] bg-black">
                <img src="/assets/masterclass-project-1.jpg" alt="AI SaaS Product" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/80 shadow-lg">
                    <Play className="h-5 w-5 text-[#C8FF00]" />
                  </div>
                </div>
              </div>
              <h3 className="mt-3 text-sm font-bold text-white">AI SaaS Product</h3>
              <p className="mt-1 text-xs text-white/50">Dashboard with AI features</p>
            </div>
            <div className="group relative overflow-hidden rounded-[16px] border border-white/10 bg-[#111111] p-4 text-center">
              <div className="relative aspect-video overflow-hidden rounded-[12px] bg-black">
                <img src="/assets/masterclass-project-2.jpg" alt="Agent Workflow" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/80 shadow-lg">
                    <Play className="h-5 w-5 text-[#C8FF00]" />
                  </div>
                </div>
              </div>
              <h3 className="mt-3 text-sm font-bold text-white">Agent Workflow</h3>
              <p className="mt-1 text-xs text-white/50">Multi-step AI agents</p>
            </div>
            <div className="group relative overflow-hidden rounded-[16px] border border-white/10 bg-[#111111] p-4 text-center">
              <div className="relative aspect-video overflow-hidden rounded-[12px] bg-black">
                <img src="/assets/masterclass-project-3.jpg" alt="Mobile App" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/80 shadow-lg">
                    <Play className="h-5 w-5 text-[#C8FF00]" />
                  </div>
                </div>
              </div>
              <h3 className="mt-3 text-sm font-bold text-white">Mobile App</h3>
              <p className="mt-1 text-xs text-white/50">Premium mobile experience</p>
            </div>
            <div className="group relative overflow-hidden rounded-[16px] border border-white/10 bg-[#111111] p-4 text-center">
              <div className="relative aspect-video overflow-hidden rounded-[12px] bg-black">
                <img src="/assets/masterclass-project-4.jpg" alt="Automation System" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/80 shadow-lg">
                    <Play className="h-5 w-5 text-[#C8FF00]" />
                  </div>
                </div>
              </div>
              <h3 className="mt-3 text-sm font-bold text-white">Automation</h3>
              <p className="mt-1 text-xs text-white/50">Workflow automation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why different */}
      <section className="bg-[#0A0A0A] py-12 text-white sm:py-16">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <h2 className="text-center text-[24px] font-[800] tracking-[-0.04em] sm:text-[30px]">Most People Are Learning Tools. You&apos;ll Learn How to Build.</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { n: "01", t: "Product Thinking", d: "You won't just learn which buttons to click. You'll learn how to think about products, users, features and systems." },
              { n: "02", t: "Hands-On Building", d: "The fastest way to understand this technology is to use it. You'll build, not just watch." },
              { n: "03", t: "Future-Ready Skills", d: "Tools will evolve. This masterclass focuses on principles so you can adapt as new tools emerge." },
            ].map((s) => (
              <div key={s.n} className="rounded-[16px] border border-white/10 bg-white/[0.04] p-6">
                <span className="font-mono text-xs tracking-[0.14em] text-white/30">{s.n}</span>
                <h3 className="mt-2 text-sm font-bold">{s.t}</h3>
                <p className="mt-2 text-xs leading-[1.6] text-white/60">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-[760px] px-5 sm:px-8">
          <h2 className="text-[22px] font-[800] tracking-[-0.03em] sm:text-[28px]">Everything You Need to Start Building.</h2>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {[
              "Complete Agentic AI & Vibe Coding Masterclass",
              "Practical AI building workflows",
              "SaaS product development training",
              "AI-powered application development",
              "Agentic AI concepts and workflows",
              "AI automation training",
              "API and integration concepts",
              "Mobile application building",
              "Hands-on projects",
              "Product-building frameworks",
              "Prompt frameworks",
              "Resource vault",
              "Community access",
              "Session recordings",
              "Certificate of completion",
            ].map((f) => (
              <span key={f} className="flex gap-2 rounded-full border border-black/10 bg-[#FCFCF9] px-3 py-2 text-xs font-medium text-black/70"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-black" />{f}</span>
            ))}
          </div>
          <div className="mt-6 rounded-[14px] bg-[#0A0A0A] px-5 py-4 text-center">
            <p className="text-sm font-bold text-white">You&apos;re not paying for information.</p>
            <p className="mt-1 text-xs leading-[1.6] text-white/60">You&apos;re investing in the ability to turn ideas into things that actually exist.</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-20 bg-[#F7F7F5] py-12 sm:py-16">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[28px] font-[800] tracking-[-0.04em] sm:text-[36px]">Join Before the Price Doubles.</h2>
            <p className="mt-2 text-sm leading-[1.6] text-black/60">Early bird registration gives you full access at the lowest available price.</p>
          </div>

          <div className="mx-auto mt-8 max-w-[520px] overflow-hidden rounded-[22px] border-2 border-[#0A0A0A] bg-white shadow-[0_24px_64px_-16px_rgba(0,0,0,0.12)]">
            <div className="bg-[#0A0A0A] px-6 py-3 text-center">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">Early Bird Access</p>
            </div>
            <div className="p-7 sm:p-8">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-[44px] font-[900] tracking-[-0.04em]">{formatNaira(d.pricing.early)}</span>
                <span className="text-xs font-bold tracking-[0.08em] text-black/30">EARLY BIRD</span>
              </div>
              <p className="mt-1 text-center text-xs font-medium text-black/50">Full access to the masterclass</p>
              <ul className="mt-6 space-y-2">
                {["Full masterclass access", "Complete curriculum", "Hands-on projects", "Resources and frameworks", "Community access"].map((f) => (
                  <li key={f} className="flex gap-2.5 text-[13px] leading-[1.5] text-black/70"><Check className="mt-0.5 h-4 w-4 shrink-0 text-black" />{f}</li>
                ))}
              </ul>
              <a href="https://paystack.shop/pay/96toe5qx8t" target="_blank" rel="noopener noreferrer" className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#0A0A0A] px-6 py-4 text-sm font-bold text-white hover:bg-black">Secure My Seat for {formatNaira(100000)} <ArrowRight className="h-4 w-4" /></a>
              <p className="mt-2 text-center text-xs font-bold text-emerald-600">Save {formatNaira(d.pricing.save)}.</p>
            </div>
          </div>

          <div className="mx-auto mt-4 max-w-[520px] overflow-hidden rounded-[16px] border border-black/10 bg-white">
            <div className="grid grid-cols-2 divide-x divide-black/10">
              <div className="bg-emerald-50 p-4 text-center">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-black/40">Early Bird</p>
                <p className="mt-1 text-[20px] font-[800] tracking-[-0.02em]">{formatNaira(d.pricing.early)}</p>
                <p className="text-[11px] font-medium text-emerald-700">Lowest price · Save {formatNaira(d.pricing.save)}</p>
              </div>
              <div className="bg-white p-4 text-center">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-black/40">Late Registration</p>
                <p className="mt-1 text-[20px] font-[800] tracking-[-0.02em] text-black/60 line-through">{formatNaira(d.pricing.late)}</p>
                <p className="text-[11px] text-black/40">Standard price</p>
              </div>
            </div>
            <p className="bg-[#0A0A0A] px-4 py-3 text-center text-xs font-bold text-white">Once early bird closes, the price becomes {formatNaira(d.pricing.late)}. Secure your seat now while early bird is available.</p>
          </div>
        </div>
      </section>

      {/* Payment banners */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[28px] font-[800] tracking-[-0.04em] sm:text-[34px]">Choose Your Payment Method.</h2>
            <p className="mt-2 text-sm leading-[1.6] text-black/60">Select the option that works best for your location.</p>
          </div>
          <div className="mx-auto mt-8 grid max-w-[800px] gap-6 sm:grid-cols-2">
            <a
              href="https://paystack.shop/pay/96toe5qx8t"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-[20px] border-2 border-[#0A0A0A] bg-[#0D2136] p-8 text-center transition-all hover:shadow-[0_24px_64px_-16px_rgba(0,0,0,0.25)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white/80">For Africa</span>
                <img src="/assets/paystack-banner.png" alt="Paystack" className="mx-auto mt-4 h-16 w-auto object-contain" loading="lazy" />
                <p className="mt-4 text-sm font-semibold text-white">Pay in Naira</p>
                <p className="mt-1 text-xs text-white/60">Secure payment via Paystack</p>
                <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0A0A0A] transition-colors group-hover:bg-zinc-100">
                  Pay {formatNaira(100000)} <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </a>
            <a
              href="https://selar.com/1zbx702773"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-[20px] border-2 border-[#0A0A0A] bg-[#5C1A4A] p-8 text-center transition-all hover:shadow-[0_24px_64px_-16px_rgba(0,0,0,0.25)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white/80">International</span>
                <img src="/assets/selar-banner.png" alt="Selar" className="mx-auto mt-4 h-16 w-auto object-contain" loading="lazy" />
                <p className="mt-4 text-sm font-semibold text-white">Pay in USD</p>
                <p className="mt-1 text-xs text-white/60">Secure payment via Selar</p>
                <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0A0A0A] transition-colors group-hover:bg-zinc-100">
                  Pay $74.28 <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Objection */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-[760px] px-5 sm:px-8">
          <h2 className="text-[22px] font-[800] tracking-[-0.03em] sm:text-[28px]">“But I&apos;m Not a Programmer...”</h2>
          <p className="mt-3 text-sm leading-[1.7] text-black/60">That&apos;s exactly why this masterclass exists. Traditional software development can feel intimidating because there are so many things to learn before you can build anything meaningful. AI has changed that.</p>
          <p className="mt-3 text-sm leading-[1.7] text-black/60">You can now work with powerful tools that assist with writing, explaining, debugging and improving software. But AI is not magic. To get meaningful results, you need to understand how to structure ideas, communicate clearly, break down problems, review outputs, test systems, debug issues and connect technologies. That&apos;s what you&apos;ll learn.</p>
        </div>
      </section>

      {/* Instructor */}
      <section className="bg-[#F7F7F5] py-12 sm:py-16">
        <div className="mx-auto grid max-w-[1160px] gap-8 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-black/10 bg-white lg:aspect-[4/4.2]">
            <img src="/assets/shedrack-akue-640.jpg" alt="Shedrack Akue — Founder, Wisnotech" className="h-full w-full object-cover object-top" loading="lazy" />
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-black/40">Your Instructor</p>
            <h2 className="mt-3 text-[28px] font-[800] leading-[0.95] tracking-[-0.04em] sm:text-[34px]">Learn From Someone Building With AI, Not Just Talking About It.</h2>
            <p className="mt-4 text-sm font-semibold text-black">Shedrack Akue — Founder, Wisnotech</p>
            <p className="mt-3 text-sm leading-[1.65] text-black/60">The gap between having an idea and building a product is getting smaller every day. But access to AI tools alone doesn&apos;t automatically make someone a builder. This masterclass was created to help ambitious people understand the new building process — and give them a practical starting point for creating with AI.</p>
            <a href="/portfolio" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-black underline decoration-black/20 underline-offset-4 hover:decoration-black">Explore My Work <ArrowRight className="h-3.5 w-3.5" /></a>
          </div>
        </div>
      </section>

      {/* Testimonials fallback */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-[760px] px-5 text-center sm:px-8">
          <h2 className="text-[22px] font-[800] tracking-[-0.03em] sm:text-[26px]">What You Could Build Starts With What You Decide to Build.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-[1.6] text-black/60">Real project possibilities — SaaS dashboards, AI agents, automations, mobile apps — built with the same workflows you&apos;ll learn.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[14px] border border-black/10 bg-[#FCFCF9] p-4"><p className="text-xs font-bold">SaaS</p><p className="mt-1 text-xs leading-[1.5] text-black/50">A working web product with auth and AI features.</p></div>
            <div className="rounded-[14px] border border-black/10 bg-[#FCFCF9] p-4"><p className="text-xs font-bold">Agent</p><p className="mt-1 text-xs leading-[1.5] text-black/50">An agent that reasons, uses tools and delivers.</p></div>
            <div className="rounded-[14px] border border-black/10 bg-[#FCFCF9] p-4"><p className="text-xs font-bold">Automation</p><p className="mt-1 text-xs leading-[1.5] text-black/50">A workflow that saves hours every week.</p></div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-[#F7F7F5] py-12 sm:py-16">
        <div className="mx-auto max-w-[760px] px-5 sm:px-8">
          <h2 className="text-[28px] font-[800] tracking-[-0.04em] sm:text-[34px]">Questions, Answered.</h2>
          <div className="mt-8 divide-y divide-black/10 overflow-hidden rounded-[16px] border border-black/10 bg-white">
            {d.faqs.map((f, i) => (
              <div key={f.q}>
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6" aria-expanded={openFaq === i}>
                  <span className="text-[14px] font-semibold leading-[1.4] tracking-[-0.01em] sm:text-[15px]">{f.q}</span>
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all ${openFaq === i ? "rotate-45 border-black bg-black text-white" : "border-black/15 text-black/40"}`}><ChevronDown className={`h-4 w-4 transition-transform ${openFaq === i ? "rotate-180" : ""}`} /></span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                      <p className="px-5 pb-5 text-[13px] leading-[1.65] text-black/60 sm:px-6">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#0A0A0A] py-14 text-white sm:py-16">
        <div className="mx-auto max-w-[760px] px-5 text-center sm:px-8">
          <h2 className="text-[26px] font-[800] leading-[0.95] tracking-[-0.04em] sm:text-[34px]">The Barrier Between an Idea and a Working Product Is Getting Smaller.</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-[1.6] text-white/60">The people who learn how to work with AI now will have an advantage — not because AI does everything for them, but because they know how to direct it, think, build, test, automate and ship.</p>
          <p className="mt-6 text-sm font-bold tracking-[0.02em]">The question is no longer “Can I build this?”</p>
          <p className="text-[20px] font-[800] tracking-[-0.03em]">“What am I going to build?”</p>
          <div className="mx-auto mt-6 flex max-w-[420px] items-center justify-center gap-4 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3">
            <span className="text-xs font-bold">Early Bird {formatNaira(d.pricing.early)}</span><span className="h-3 w-px bg-white/20" /><span className="text-xs text-white/40 line-through">Late {formatNaira(d.pricing.late)}</span><span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold">Save {formatNaira(d.pricing.save)}</span>
          </div>
          <p className="mt-2 text-xs font-bold text-emerald-400">Secure your seat now and save {formatNaira(d.pricing.save)}.</p>
          <a href="https://paystack.shop/pay/96toe5qx8t" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-black hover:bg-zinc-100">Join the Masterclass for {formatNaira(100000)} <ArrowRight className="h-4 w-4" /></a>
          <p className="mt-3 text-[11px] tracking-[0.06em] text-white/30">Early bird available for a limited registration period. Then {formatNaira(d.pricing.late)}.</p>
        </div>
      </section>

      <footer className="border-t border-black/10 bg-white">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-6 px-5 py-8 sm:px-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5"><Logo className="text-black" invert /><span className="text-[11px] font-bold tracking-[0.12em] text-black/50">MASTERCLASS</span></div>
          <div className="flex flex-wrap gap-6 text-xs font-medium text-black/60">
            <a href="#learn" className="hover:text-black">Learn</a><a href="#build" className="hover:text-black">Build</a><a href="#pricing" className="hover:text-black">Pricing</a><a href="/privacy" className="hover:text-black">Privacy</a>
          </div>
        </div>
        <div className="border-t border-black/10"><div className="mx-auto flex max-w-[1160px] items-center justify-between px-5 py-4 sm:px-8"><p className="text-xs text-black/40">© {new Date().getFullYear()} Wisnotech.</p><p className="hidden text-xs text-black/30 sm:block">AI is changing how software is built. Learn to build with it.</p></div></div>
      </footer>
    </div>
  );
}
