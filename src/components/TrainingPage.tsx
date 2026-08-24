import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Layers,
  Menu,
  Smartphone,
  Workflow,
  X,
  Bot,
  Rocket,
} from "lucide-react";
import Logo from "./Logo";

// ── Config — edit here ──────────────────────────────────────────
const TRAINING = {
  cohort: "Cohort 01 — 2026",
  label: "ADVANCED VIBE CODING + AGENTIC AI COHORT",
  seats: 40,
  deadline: "March 15, 2026",
  priceUSD: 89,
  priceNGN: 150000,
  cta: "#pricing",
} as const;

const CURRICULUM = [
  { n: "01", title: "Vibe Coding", desc: "Communicate product ideas to AI coding systems — architecture, iteration, debugging and understanding what the AI is doing.", bullets: ["Product prompting & architecture", "AI-assisted coding & iteration", "Debugging generated code"] },
  { n: "02", title: "Building SaaS Products", desc: "Auth, databases, dashboards, payments, APIs and deployment — the real SaaS stack.", bullets: ["Auth, DB & dashboards", "Payments & user accounts", "SaaS architecture & deployment"] },
  { n: "03", title: "AI Agents", desc: "Design autonomous systems where AI performs multi-step work with tools, memory and delegation.", bullets: ["Agent architecture & memory", "Multi-agent orchestration", "Tool use & decision-making"] },
  { n: "04", title: "AI Automation", desc: "Connect systems with APIs, webhooks and triggers — automate real business workflows.", bullets: ["API & webhook connections", "AI-powered workflows", "Trigger-based business systems"] },
  { n: "05", title: "Web Applications", desc: "Modern web apps — SaaS platforms, AI tools, portals, marketplaces and internal tools.", bullets: ["SaaS & AI tools", "Client portals & dashboards", "Marketplaces & internal tools"] },
  { n: "06", title: "Mobile Applications", desc: "Turn ideas into premium mobile apps — onboarding to analytics, built with AI.", bullets: ["Onboarding & dashboards", "AI chat & profiles", "Premium native feel"] },
  { n: "07", title: "AI APIs & Integrations", desc: "How apps talk to AI models, databases, payments and third-party platforms.", bullets: ["AI, DB & payments APIs", "Third-party integrations", "Clean architecture diagrams"] },
  { n: "08", title: "Deployment & Shipping", desc: "From local build to live product — test, debug, deploy and iterate after launch.", bullets: ["Testing & debugging", "Deploy & domains", "Monitoring & iteration"] },
] as const;

const PROJECTS = [
  { title: "AI SaaS Platform", desc: "Landing, dashboard, AI features — a complete web product.", icon: Layers },
  { title: "Autonomous AI Agent", desc: "Multi-step agent that researches, reasons, builds and delivers.", icon: Bot },
  { title: "AI-Powered Mobile App", desc: "Premium 3D mobile experience — onboarding to analytics.", icon: Smartphone },
  { title: "Business Automation System", desc: "Forms → CRM → AI → Email → DB — a workflow that runs itself.", icon: Workflow },
  { title: "Your Own Product", desc: "Your idea, your system, your launch — the cohort is built around it.", icon: Rocket },
] as const;

const RESOURCES = [
  "AI PRODUCT BLUEPRINT.pdf",
  "SAAS ARCHITECTURE FRAMEWORK",
  "AGENT DESIGN SYSTEM",
  "AUTOMATION PLAYBOOK",
  "DEBUGGING GUIDE",
  "PRODUCT PROMPT LIBRARY",
  "API INTEGRATION TEMPLATES",
  "DEPLOYMENT CHECKLIST",
] as const;

const FAQS = [
  { q: "Do I need to be a professional programmer?", a: "No. This is an advanced program but starts from product thinking. If you can follow logical steps and are comfortable with a computer, we teach the rest — including how to direct AI to write the code." },
  { q: "Can a complete beginner join?", a: "Yes, if you're ambitious and willing to build. Beginners move slightly slower on week one, then accelerate. The projects are designed to be achievable with AI assistance from day one." },
  { q: "Will I learn to build SaaS products?", a: "Yes — authentication, databases, dashboards, payments, APIs and deployment are core. You ship at least one SaaS-style product." },
  { q: "Will we build mobile applications?", a: "Yes. You'll turn ideas into premium mobile experiences, including at least one mobile project with multiple screens and AI features." },
  { q: "What are AI agents?", a: "Systems where AI performs multi-step work autonomously — researching, reasoning, using tools, remembering context and delivering outcomes. We build them from scratch." },
  { q: "Will I learn automation?", a: "Yes — APIs, webhooks, triggers and AI-powered business process automation. You'll connect real systems." },
  { q: "Which AI coding tools will we use?", a: "The stack evolves fast, so we teach workflows and principles, not tool-lock. You'll use the current best AI coding and agent platforms — updated each cohort." },
  { q: "How long is the cohort?", a: "Six weeks, live cohort with weekly live sessions, build sessions, challenges and ongoing support. Expect 6–8 hours per week plus building time." },
  { q: "Are sessions recorded?", a: "Yes, 12 months access to all recordings, plus the resource vault and community." },
  { q: "Can I pay in Naira?", a: "Yes — toggle NGN on the pricing card. You'll be routed to the correct checkout." },
  { q: "Can international students join?", a: "Yes, from anywhere. Pay in USD, join live or via recordings." },
  { q: "What happens after payment?", a: "Onboarding + community access within 24 hours, plus pre-work to hit day one ready." },
] as const;

const TESTIMONIALS = [
  { quote: "The biggest difference was learning how to think about the product before asking AI to build it. I stopped generating random apps and started shipping real systems.", name: "Amara K.", role: "Product Builder, Lagos" },
  { quote: "I shipped my first SaaS in week four. Auth, payments, the whole thing — I didn't think that was possible without a dev team.", name: "Daniel O.", role: "Founder, London" },
  { quote: "The agent module alone was worth the cohort. My business now has an AI that handles research and client follow-ups while I sleep.", name: "Sofia M.", role: "Automation Lead, Berlin" },
] as const;

function formatNaira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

export default function TrainingPage() {
  const [currency, setCurrency] = useState<"USD" | "NGN">("USD");
  const [mobileNav, setMobileNav] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [scrolled, setScrolled] = useState(false);
  const [showcase, setShowcase] = useState<"saas" | "mobile" | "agent" | "automation">("saas");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    const saved = localStorage.getItem("wisnotech.currency") as "USD" | "NGN" | null;
    if (saved === "USD" || saved === "NGN") setCurrency(saved);
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const setCurr = (c: "USD" | "NGN") => {
    setCurrency(c);
    localStorage.setItem("wisnotech.currency", c);
  };

  // Continuous looping showcase — auto-rotates every 4s
  useEffect(() => {
    const order: Array<typeof showcase> = ["saas", "mobile", "agent", "automation"];
    const id = setInterval(() => {
      setShowcase((prev) => order[(order.indexOf(prev) + 1) % order.length]);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-[#090909] text-[#F4F4F0] antialiased selection:bg-[#C8FF00]/30 selection:text-black">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap');`}</style>

      {/* Nav */}
      <header className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${scrolled ? "border-white/[0.08] bg-[#090909]/85 backdrop-blur-xl" : "border-transparent bg-transparent"}`}>
        <div className="mx-auto flex h-[64px] max-w-[1160px] items-center justify-between px-5 sm:px-8">
          <a href="/training" className="shrink-0" aria-label="Training home"><Logo /></a>
          <nav className="hidden items-center gap-1 lg:flex">
            {[
              { label: "Overview", href: "#overview" },
              { label: "What You'll Build", href: "#build" },
              { label: "Curriculum", href: "#curriculum" },
              { label: "Projects", href: "#projects" },
              { label: "Pricing", href: "#pricing" },
              { label: "FAQ", href: "#faq" },
            ].map((l) => (
              <a key={l.label} href={l.href} className="rounded-full px-3.5 py-2 text-[13px] font-medium tracking-[-0.01em] text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white">{l.label}</a>
            ))}
          </nav>
          <div className="hidden lg:flex">
            <a href="#pricing" className="inline-flex items-center gap-2 rounded-full bg-[#C8FF00] px-5 py-2.5 text-[13px] font-semibold tracking-[-0.01em] text-black transition-all hover:bg-[#B8EE00] hover:shadow-[0_8px_24px_-12px_rgba(200,255,0,0.6)]">Apply for the Cohort <ArrowRight className="h-3.5 w-3.5" /></a>
          </div>
          <button type="button" onClick={() => setMobileNav((v) => !v)} aria-label="Toggle menu" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/80 lg:hidden">
            {mobileNav ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
        <AnimatePresence>
          {mobileNav && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="border-t border-white/10 bg-[#090909] px-5 py-6 lg:hidden">
              <div className="flex flex-col gap-1">
                {[
                  { label: "Overview", href: "#overview" },
                  { label: "What You'll Build", href: "#build" },
                  { label: "Curriculum", href: "#curriculum" },
                  { label: "Projects", href: "#projects" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "FAQ", href: "#faq" },
                ].map((l) => (
                  <a key={l.label} href={l.href} onClick={() => setMobileNav(false)} className="rounded-xl px-3 py-3 text-[15px] font-medium text-white/75 hover:bg-white/[0.06] hover:text-white">{l.label}</a>
                ))}
                <a href="#pricing" onClick={() => setMobileNav(false)} className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-[#C8FF00] px-5 py-3.5 text-sm font-semibold text-black">Apply for the Cohort <ArrowRight className="h-4 w-4" /></a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO */}
      <section id="overview" className="relative overflow-hidden bg-[#090909] pt-[64px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(200,255,0,0.07),transparent_60%)]" />
        <div className="mx-auto grid max-w-[1160px] gap-10 px-5 pb-10 pt-10 sm:px-8 sm:pt-14 lg:grid-cols-[1.05fr_1.15fr] lg:items-center lg:gap-10">
          <div>
            <p className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-white/40"><span className="h-px w-6 bg-[#C8FF00]" />{TRAINING.label}</p>
            <h1 className="mt-5 max-w-[15ch] text-[38px] font-[800] leading-[0.92] tracking-[-0.04em] text-[#F4F4F0] sm:text-[48px] lg:text-[54px]">Build Software at the Speed of Your Ideas.</h1>
            <p className="mt-5 max-w-[46ch] text-[16px] leading-[1.65] text-white/55 sm:text-[17px]">Learn how to use AI coding tools, autonomous agents, APIs and modern product workflows to design, build, debug and launch real SaaS products, apps and digital businesses.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={TRAINING.cta} className="inline-flex items-center gap-2 rounded-full bg-[#C8FF00] px-7 py-3.5 text-sm font-semibold text-black shadow-[0_12px_32px_-16px_rgba(200,255,0,0.6)] transition-colors hover:bg-[#B8EE00]">Join the Next Cohort <ArrowRight className="h-4 w-4" /></a>
              <a href="#build" className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-7 py-3.5 text-sm font-medium text-white hover:border-white/20 hover:bg-white/[0.07]">See What You&apos;ll Build</a>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-white/30">
              <span>Live Cohort</span><span className="h-3 w-px bg-white/10" /> <span>Hands-On Projects</span><span className="h-3 w-px bg-white/10" /> <span>Real Products</span><span className="h-3 w-px bg-white/10" /> <span>Limited Seats</span>
            </div>
          </div>

          {/* Interactive hero layers — continuous looping */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#111111] p-2 shadow-[0_40px_80px_-32px_rgba(0,0,0,0.7)]"
            >
              <div className="grid gap-2">
                {/* Layer 1 — SaaS Dashboard with looping bars */}
                <div className="relative overflow-hidden rounded-[14px] border border-white/10 bg-[#161616] p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.14em] text-white/30">SYSTEM STATUS: READY</span>
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C8FF00] opacity-60" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C8FF00]" />
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[
                      { k: "Revenue", v: "$42,380", sub: "+12.4%" },
                      { k: "Active Users", v: "1,284", sub: "last 7d" },
                      { k: "Agent Tasks", v: "342", sub: "automated" },
                    ].map((s) => (
                      <motion.div
                        key={s.k}
                        className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                        animate={{ scale: [1, 1.01, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/30">{s.k}</p>
                        <p className="mt-1 text-sm font-semibold text-white">{s.v}</p>
                        <p className="text-[11px] text-[#C8FF00]">{s.sub}</p>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-3 h-16 rounded-xl border border-white/10 bg-white/[0.02] p-3">
                    <div className="flex h-full items-end gap-1">
                      {[30, 55, 40, 70, 50, 85, 60, 90, 45].map((h, i) => (
                        <motion.div
                          key={i}
                          className="flex-1 rounded-sm bg-[#C8FF00]/80"
                          animate={{ height: [`${h}%`, `${Math.min(95, h + 22)}%`, `${h}%`] }}
                          transition={{ duration: 2.2 + i * 0.15, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 }}
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-[1.1fr_0.9fr] gap-2">
                  {/* Layer 2 — Mobile with continuous float */}
                  <div className="relative flex items-center justify-center overflow-hidden rounded-[14px] border border-white/10 bg-[#0F0F0F] p-4">
                    <motion.div
                      animate={{ y: [0, -6, 0], rotateY: [0, 4, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="relative h-[180px] w-[95px] rounded-[18px] border border-white/15 bg-[#1A1A1A] p-1.5 shadow-xl"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <div className="flex h-full flex-col rounded-[14px] bg-[#111111] p-2">
                        <div className="h-2 w-8 self-center rounded-full bg-white/10" />
                        <div className="mt-3 space-y-1.5">
                          <motion.div className="h-2 w-full rounded bg-white/15" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} />
                          <motion.div className="h-2 w-3/4 rounded bg-white/10" animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} />
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-1.5">
                          <motion.div className="h-10 rounded-lg bg-[#C8FF00]/15" animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2.5, repeat: Infinity }} />
                          <div className="h-10 rounded-lg bg-white/[0.06]" />
                        </div>
                        <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-2">
                          <Smartphone className="h-3 w-3 text-white/30" /><span className="font-mono text-[8px] text-white/30">AI APP</span>
                        </div>
                      </div>
                      <div className="pointer-events-none absolute inset-0 rounded-[18px] bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-60" />
                    </motion.div>
                    <motion.div
                      className="absolute inset-0 rounded-[14px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 3.2, repeat: Infinity, ease: "linear", repeatDelay: 1.2 }}
                      style={{ mixBlendMode: "overlay" as const }}
                    />
                  </div>
                  {/* Layer 3 & 4 — Agent + Code with looping signals */}
                  <div className="space-y-2">
                    <div className="rounded-[14px] border border-white/10 bg-[#0F0F0F] p-3">
                      <p className="font-mono text-[10px] tracking-[0.12em] text-white/30">AGENT WORKFLOW</p>
                      <div className="mt-2 space-y-1.5 font-mono text-[10px]">
                        {[
                          { label: "USER REQUEST →", active: false },
                          { label: "RESEARCH AGENT", active: true },
                          { label: "BUILD AGENT →", active: true },
                          { label: "TEST → DEPLOY", active: false },
                        ].map((item, i) => (
                          <div key={item.label} className="flex items-center gap-2">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className={`absolute inline-flex h-full w-full rounded-full ${item.active ? "bg-[#C8FF00] opacity-60" : "bg-white/20"}`} style={item.active ? { animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite" } as React.CSSProperties : undefined} />
                              <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${item.active ? "bg-[#C8FF00]" : "bg-white/20"}`} />
                            </span>
                            <span className={item.label.includes("DEPLOY") || item.label.includes("BUILD") ? "text-[#C8FF00]" : "text-white/60"}>{item.label}</span>
                            {item.active && (
                              <motion.span
                                className="ml-auto h-px w-6 bg-gradient-to-r from-[#C8FF00] to-transparent"
                                animate={{ opacity: [0, 1, 0], x: [-6, 6, -6] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[14px] border border-white/10 bg-[#0F0F0F] p-3 font-mono text-[10px] leading-[1.6]">
                      {[
                        { text: "> initializing project", color: "text-white/30", delay: 0 },
                        { text: "✓ architecture generated", color: "text-[#C8FF00]", delay: 0.6 },
                        { text: "✓ database connected", color: "text-[#C8FF00]", delay: 1.2 },
                        { text: "✓ API configured", color: "text-[#C8FF00]", delay: 1.8 },
                        { text: "● PRODUCT LIVE", color: "text-white/90", delay: 2.4 },
                      ].map((line) => (
                        <motion.p
                          key={line.text}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: line.delay, repeat: Infinity, repeatDelay: 4.5, repeatType: "reverse" as const }}
                          className={line.color}
                        >
                          {line.text}
                        </motion.p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            <p className="mt-3 text-center font-mono text-[11px] tracking-[0.08em] text-white/25">Idea → System → Product — interactive build environment</p>
          </motion.div>
        </div>
      </section>

      {/* Value prop */}
      <section className="border-y border-white/10 bg-[#090909] py-10 sm:py-14">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-[#F4F4F0] sm:text-[34px]">You Don&apos;t Need to Do Everything Yourself Anymore.</h2>
            <p className="mx-auto mt-3 max-w-2xl text-[14px] leading-[1.7] text-white/50">Modern AI has changed how software is created. The new advantage is knowing how to direct intelligent systems, understand architecture, connect technologies and ship real products.</p>
          </div>
          <motion.div
            className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-[11px] tracking-[0.12em] text-white/40 sm:gap-3 sm:text-xs"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[#F4F4F0]">IDEA</span>
            <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="text-white/20">+</motion.span>
            <span className="text-[#C8FF00]">AI</span>
            <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} className="text-white/20">+</motion.span>
            <span>PRODUCT THINKING</span>
            <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }} className="text-white/20">+</motion.span>
            <span>AUTOMATION</span>
            <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 0.9 }} className="text-white/20">=</motion.span>
            <motion.span
              className="rounded-full bg-[#C8FF00] px-3 py-1 font-bold text-black"
              animate={{ scale: [1, 1.03, 1], boxShadow: ["0 0 0px rgba(200,255,0,0)", "0 0 20px rgba(200,255,0,0.35)", "0 0 0px rgba(200,255,0,0)"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              REAL SOFTWARE
            </motion.span>
          </motion.div>
        </div>
      </section>

      {/* What you'll learn — 8 modules */}
      <section id="curriculum" className="scroll-mt-20 bg-[#090909] py-14 sm:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C8FF00]">Curriculum</p>
          <h2 className="mt-3 max-w-xl text-[30px] font-[800] leading-[0.95] tracking-[-0.04em] text-[#F4F4F0] sm:text-[40px]">Learn the New Stack for Building With AI.</h2>
          <div className="mt-10 grid gap-[1px] overflow-hidden rounded-[20px] border border-white/10 bg-white/10 sm:grid-cols-2">
            {CURRICULUM.map((m, idx) => (
              <motion.div
                key={m.n}
                className="bg-[#111111] p-6 sm:p-7"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
              >
                <div className="flex items-center gap-3">
                  <motion.span className="font-mono text-xs tracking-[0.14em] text-[#C8FF00]" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 3, repeat: Infinity, delay: idx * 0.2 }}>{m.n}</motion.span>
                  <motion.span className="h-px flex-1 bg-white/10" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2.5, repeat: Infinity, delay: idx * 0.15 }} />
                </div>
                <h3 className="mt-3 text-[16px] font-semibold tracking-[-0.015em] text-[#F4F4F0]">{m.title}</h3>
                <p className="mt-2 text-[13px] leading-[1.6] text-white/50">{m.desc}</p>
                <ul className="mt-3 space-y-1.5">
                  {m.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-[12px] leading-[1.5] text-white/55"><Check className="mt-0.5 h-3 w-3 shrink-0 text-[#C8FF00]" />{b}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What you'll build */}
      <section id="build" className="scroll-mt-20 bg-[#090909] py-14 sm:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-[#F4F4F0] sm:text-[36px]">Don&apos;t Just Watch Tutorials. Ship Products.</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {PROJECTS.map((p, idx) => (
              <motion.div
                key={p.title}
                className="rounded-[16px] border border-white/10 bg-[#111111] p-5"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -2, borderColor: "rgba(200,255,0,0.25)" }}
              >
                <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 3, repeat: Infinity, delay: idx * 0.3 }}>
                  <p.icon className="h-5 w-5 text-[#C8FF00]" aria-hidden />
                </motion.div>
                <h3 className="mt-3 text-sm font-semibold tracking-[-0.01em] text-[#F4F4F0]">{p.title}</h3>
                <p className="mt-2 text-xs leading-[1.6] text-white/50">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive showcase */}
      <section className="bg-[#090909] py-10 sm:py-14">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="overflow-hidden rounded-[20px] border border-white/10 bg-[#111111]">
            <div className="flex flex-wrap gap-1 border-b border-white/10 p-2">
              {(["saas", "mobile", "agent", "automation"] as const).map((k) => (
                <button key={k} onClick={() => setShowcase(k)} className={`rounded-full px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] transition-colors ${showcase === k ? "bg-[#C8FF00] text-black" : "bg-white/[0.04] text-white/60 hover:bg-white/[0.07] hover:text-white"}`}>{k}</button>
              ))}
            </div>
            <div className="p-6 sm:p-8">
              {showcase === "saas" && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="rounded-[14px] border border-white/10 bg-[#161616] p-4">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-3"><div className="h-2 w-2 rounded-full bg-red-400/60" /><div className="h-2 w-2 rounded-full bg-yellow-400/60" /><div className="h-2 w-2 rounded-full bg-green-400/60" /><span className="ml-2 font-mono text-[10px] text-white/30">saas.wisnotech.app — Dashboard</span></div>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <motion.div className="rounded-xl bg-white/[0.04] p-4" animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 3, repeat: Infinity }}><p className="font-mono text-[10px] text-white/30">MRR</p><p className="mt-1 font-semibold text-white">$18.4k</p><motion.p className="text-[11px] text-[#C8FF00]" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}>+12.4%</motion.p></motion.div>
                    <motion.div className="rounded-xl bg-white/[0.04] p-4" animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 3, repeat: Infinity, delay: 0.4 }}><p className="font-mono text-[10px] text-white/30">Users</p><p className="mt-1 font-semibold text-white">2,401</p><p className="text-[11px] text-white/40">last 7d</p></motion.div>
                    <motion.div className="rounded-xl bg-[#C8FF00]/10 p-4" animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 2.5, repeat: Infinity }}><p className="font-mono text-[10px] text-[#C8FF00]">AI Insights</p><p className="mt-1 text-xs text-white">3 opportunities found</p></motion.div>
                  </div>
                  <div className="mt-3 flex h-10 items-end gap-1">
                    {[30, 55, 40, 70, 50, 85, 60].map((h, i) => (
                      <motion.div key={i} className="flex-1 rounded-sm bg-[#C8FF00]/70" animate={{ height: [`${h}%`, `${Math.min(95, h + 18)}%`, `${h}%`] }} transition={{ duration: 2 + i * 0.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }} style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </motion.div>
              )}
              {showcase === "mobile" && (
                <div className="flex justify-center py-4">
                  <motion.div
                    className="h-[320px] w-[160px] rounded-[24px] border border-white/15 bg-[#1A1A1A] p-2 shadow-2xl"
                    animate={{ y: [0, -6, 0], rotateY: [0, 3, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformStyle: "preserve-3d" as const }}
                  >
                    <div className="flex h-full flex-col rounded-[18px] bg-[#0F0F0F] p-3"><div className="mx-auto h-1 w-8 rounded-full bg-white/20" /><p className="mt-4 text-center text-xs font-semibold text-white">AI Companion</p><div className="mt-3 flex-1 rounded-xl bg-white/[0.04] p-2"><p className="font-mono text-[10px] text-white/30">Today</p><motion.div className="mt-2 h-2 w-full rounded bg-[#C8FF00]/30" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.8, repeat: Infinity }} /><motion.div className="mt-1 h-2 w-2/3 rounded bg-white/10" animate={{ width: ["66%", "85%", "66%"] }} transition={{ duration: 2.2, repeat: Infinity }} /></div></div>
                  </motion.div>
                </div>
              )}
              {showcase === "agent" && (
                <div className="mx-auto max-w-md rounded-[14px] border border-white/10 bg-[#0F0F0F] p-6 font-mono text-xs">
                  {["USER REQUEST", "RESEARCH → ANALYZE", "CREATE → VERIFY", "DELIVER"].map((t, i) => (
                    <motion.div key={t} className="flex items-center gap-3 py-2" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15, duration: 0.3 }}>
                      <span className="relative flex h-2 w-2">
                        <motion.span className={`absolute inline-flex h-full w-full rounded-full ${i === 2 || i === 3 ? "bg-[#C8FF00]" : "bg-white/20"}`} animate={i === 2 || i === 3 ? { scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7] } : {}} transition={{ duration: 1.6, repeat: Infinity }} />
                        <span className={`relative inline-flex h-2 w-2 rounded-full ${i === 2 || i === 3 ? "bg-[#C8FF00]" : "bg-white/20"}`} />
                      </span>
                      <span className={i === 3 ? "text-[#C8FF00]" : "text-white/60"}>{t}</span>
                      {i < 3 && <motion.span className="ml-auto text-[#C8FF00]/60" animate={{ x: [0, 4, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}>→</motion.span>}
                    </motion.div>
                  ))}
                </div>
              )}
              {showcase === "automation" && (
                <div className="mx-auto flex max-w-lg items-center justify-between gap-1 rounded-[14px] border border-white/10 bg-[#0F0F0F] p-6">
                  {["Form", "CRM", "AI", "Email", "DB"].map((n, i) => (
                    <div key={n} className="flex items-center gap-1 sm:gap-2">
                      <motion.div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[10px] text-white/70" animate={i === 2 ? { scale: [1, 1.05, 1], borderColor: ["rgba(255,255,255,0.1)", "rgba(200,255,0,0.4)", "rgba(255,255,255,0.1)"] } : {}} transition={{ duration: 2, repeat: Infinity }}>
                        {n}
                      </motion.div>
                      {i < 4 && (
                        <span className="relative h-px w-4 overflow-hidden bg-white/10 sm:w-6">
                          <motion.span className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-transparent via-[#C8FF00] to-transparent" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.4, repeat: Infinity, ease: "linear", delay: i * 0.3 }} />
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How it works — continuous pipeline signal */}
      <section className="bg-[#090909] py-14 sm:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <h2 className="text-center text-[28px] font-[800] tracking-[-0.04em] text-[#F4F4F0] sm:text-[36px]">Learn. Build. Break Things. Fix Them. Ship.</h2>
          <div className="relative mt-10 overflow-hidden rounded-[20px] border border-white/10 bg-white/10">
            <div className="absolute inset-x-0 top-0 h-px overflow-hidden">
              <motion.div className="h-px w-1/3 bg-gradient-to-r from-transparent via-[#C8FF00] to-transparent" animate={{ x: ["-100%", "300%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
            </div>
            <div className="grid gap-[1px] sm:grid-cols-5">
              {[
                { n: "01", t: "LEARN", d: "Understand principles and tools." },
                { n: "02", t: "BUILD", d: "Create real products." },
                { n: "03", t: "DEBUG", d: "Find and solve problems." },
                { n: "04", t: "AUTOMATE", d: "Connect systems & agents." },
                { n: "05", t: "SHIP", d: "Deploy to the real world." },
              ].map((s, idx) => (
                <motion.div
                  key={s.n}
                  className="bg-[#111111] p-6 text-center sm:p-7"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06 }}
                >
                  <motion.span className="font-mono text-[11px] tracking-[0.18em] text-[#C8FF00]" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.5, repeat: Infinity, delay: idx * 0.3 }}>
                    {s.n}
                  </motion.span>
                  <p className="mt-2 font-mono text-sm font-bold tracking-[0.08em] text-[#F4F4F0]">{s.t}</p>
                  <p className="mt-1 text-xs leading-[1.5] text-white/45">{s.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cohort experience — continuous subtle pulse */}
      <section className="bg-[#090909] py-14 sm:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <h2 className="text-[24px] font-[700] tracking-[-0.03em] text-[#F4F4F0] sm:text-[28px]">An Environment Designed for Builders.</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { title: "Live Sessions", desc: "Learn in real time, ask questions, see builds happen." },
              { title: "Build Sessions", desc: "Work on actual products with guidance, not just slides." },
              { title: "Challenges", desc: "Solve real technical problems that make you better." },
              { title: "Resources", desc: "Frameworks, templates, prompts and workflows you keep." },
              { title: "Community", desc: "Connect with other builders — accountability and help." },
              { title: "Support", desc: "Get unstuck fast with cohort support." },
            ].map((c, idx) => (
              <motion.div
                key={c.title}
                className="rounded-[16px] border border-white/10 bg-[#111111] p-6"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -2, borderColor: "rgba(200,255,0,0.25)" }}
              >
                <motion.div className="h-1 w-8 rounded-full bg-[#C8FF00]/20" animate={{ width: ["32px", "40px", "32px"] }} transition={{ duration: 3, repeat: Infinity, delay: idx * 0.3 }} />
                <h3 className="mt-3 text-sm font-semibold text-[#F4F4F0]">{c.title}</h3>
                <p className="mt-2 text-xs leading-[1.6] text-white/50">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resource vault — continuous arrow drift */}
      <section className="bg-[#090909] py-14 sm:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <h2 className="text-[24px] font-[700] tracking-[-0.03em] text-[#F4F4F0] sm:text-[28px]">Don&apos;t Start From Zero.</h2>
          <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {RESOURCES.map((r, idx) => (
              <motion.div
                key={r}
                className="group flex items-center justify-between rounded-[12px] border border-white/10 bg-[#111111] px-4 py-3.5"
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.04 }}
                whileHover={{ borderColor: "rgba(200,255,0,0.3)", backgroundColor: "rgba(255,255,255,0.03)" }}
              >
                <span className="font-mono text-[11px] tracking-[0.06em] text-white/70">{r}</span>
                <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 2, repeat: Infinity, delay: idx * 0.15 }}>
                  <ArrowRight className="h-3.5 w-3.5 text-white/20 group-hover:text-[#C8FF00]" />
                </motion.span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructor */}
      <section className="bg-[#090909] py-14 sm:py-20">
        <div className="mx-auto grid max-w-[1160px] gap-8 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-white/10 bg-[#111111] lg:aspect-[4/4.2]">
            <img src="/assets/shedrack-akue-640.jpg" alt="Shedrack Akue — Founder, Wisnotech" className="h-full w-full object-cover object-top" loading="lazy" />
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/35">Your Guide</p>
            <h2 className="mt-3 text-[30px] font-[800] leading-[0.95] tracking-[-0.04em] text-[#F4F4F0] sm:text-[38px]">Learn From Someone Building Inside the AI Revolution.</h2>
            <p className="mt-4 text-[15px] leading-[1.65] text-white/55">Wisnotech is built by a working studio — products, automations and AI systems shipped for real clients. Every workflow in this masterclass is the same one used in production.</p>
            <div className="mt-6 flex items-center gap-4 border-t border-white/10 pt-6">
              <div><p className="text-sm font-semibold text-[#F4F4F0]">Shedrack Akue</p><p className="text-xs tracking-[0.08em] text-white/40">Founder, Wisnotech</p></div>
              <a href="/portfolio" className="ml-auto inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white hover:border-white/20">Explore My Work <ArrowRight className="h-3.5 w-3.5" /></a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#090909] py-14 sm:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-[16px] border border-white/10 bg-[#111111] p-6 sm:p-7">
                <p className="text-[15px] leading-[1.6] text-[#F4F4F0]">“{t.quote}”</p>
                <p className="mt-4 font-mono text-xs tracking-[0.06em] text-white/35">— {t.name} · {t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-20 bg-[#090909] py-14 sm:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[30px] font-[800] tracking-[-0.04em] text-[#F4F4F0] sm:text-[40px]">Your Next Product Could Start Here.</h2>
            <p className="mt-3 text-[15px] leading-[1.6] text-white/50">One advanced cohort. Real skills. Real projects.</p>
          </div>
          <div className="mx-auto mt-8 flex justify-center">
            <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1">
              {(["USD", "NGN"] as const).map((c) => (
                <button key={c} type="button" onClick={() => setCurr(c)} className={`rounded-full px-5 py-2 font-mono text-xs font-semibold tracking-[0.08em] transition-all ${currency === c ? "bg-[#C8FF00] text-black shadow" : "text-white/60 hover:text-white"}`}>{c}</button>
              ))}
            </div>
          </div>
          <div className="mx-auto mt-6 max-w-[520px] overflow-hidden rounded-[22px] border border-[#C8FF00]/30 bg-[#111111] shadow-[0_32px_80px_-32px_rgba(200,255,0,0.25)]">
            <div className="bg-[radial-gradient(70%_80%_at_50%_0%,rgba(200,255,0,0.12),transparent_70%)] p-7 sm:p-8">
              <p className="font-mono text-[11px] tracking-[0.18em] text-white/40">ADVANCED VIBE CODING + AGENTIC AI — {TRAINING.cohort}</p>
              <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.015em] text-[#F4F4F0]">Complete Cohort Access</h3>
              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-[42px] font-[800] leading-none tracking-[-0.04em] text-[#F4F4F0]">{currency === "USD" ? `$${TRAINING.priceUSD}` : formatNaira(TRAINING.priceNGN)}</span>
                <span className="font-mono text-xs tracking-[0.08em] text-white/35">ONE-TIME</span>
              </div>
              <p className="mt-1 font-mono text-xs text-white/40">One-time · {TRAINING.seats} seats</p>
              <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-6">
                {[
                  "Complete masterclass curriculum (8 modules)",
                  "Live training + build sessions",
                  "AI vibe coding workflows",
                  "SaaS, mobile & AI agent training",
                  "Automation systems & API integration",
                  "Real-world projects",
                  "Prompt frameworks + resource vault",
                  "Community & cohort support",
                  "Session recordings (12 months)",
                ].map((f) => (
                  <li key={f} className="flex gap-2.5 text-[13px] leading-[1.5] text-white/70"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#C8FF00]" />{f}</li>
                ))}
              </ul>
              <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }} className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#C8FF00] px-6 py-4 text-sm font-semibold text-black shadow-[0_16px_40px_-16px_rgba(200,255,0,0.6)] hover:bg-[#B8EE00]">Secure Your Seat <ArrowRight className="h-4 w-4" /></a>
              <p className="mt-2.5 text-center font-mono text-xs text-white/30">Secure checkout · Instant confirmation</p>
            </div>
          </div>
          <p className="mx-auto mt-6 max-w-xl text-center font-mono text-[11px] uppercase tracking-[0.12em] text-white/25">Limited seats for each cohort.</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-[#090909] py-14 sm:py-20">
        <div className="mx-auto max-w-[760px] px-5 sm:px-8">
          <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-[#F4F4F0] sm:text-[34px]">Questions, Answered.</h2>
          <div className="mt-8 divide-y divide-white/10 overflow-hidden rounded-[16px] border border-white/10 bg-[#111111]">
            {FAQS.map((f, i) => (
              <div key={f.q}>
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6" aria-expanded={openFaq === i}>
                  <span className="text-[14px] font-medium leading-[1.4] tracking-[-0.01em] text-[#F4F4F0] sm:text-[15px]">{f.q}</span>
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-white/60 transition-all ${openFaq === i ? "rotate-45 border-[#C8FF00]/40 bg-[#C8FF00]/10 text-[#C8FF00]" : "border-white/15"}`}><ChevronDown className={`h-4 w-4 transition-transform ${openFaq === i ? "rotate-180" : ""}`} /></span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                      <p className="px-5 pb-5 text-[13px] leading-[1.65] text-white/50 sm:px-6">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#090909] py-14 sm:py-24">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#111111] px-6 py-12 text-center sm:px-12 sm:py-16">
            <h2 className="mx-auto max-w-[16ch] text-[32px] font-[800] leading-[0.92] tracking-[-0.04em] text-[#F4F4F0] sm:text-[46px]">The People Building Tomorrow&apos;s Software Are Starting Today.</h2>
            <p className="mx-auto mt-4 max-w-[48ch] text-[15px] leading-[1.6] text-white/50">You can keep watching AI change the way software is built. Or you can learn how to build with it.</p>
            <a href="#pricing" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#C8FF00] px-7 py-3.5 text-sm font-semibold text-black hover:bg-[#B8EE00]">Join the Next Cohort <ArrowRight className="h-4 w-4" /></a>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-white/25">Limited seats · Live cohort · Real products</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#050505]">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-8 px-5 py-10 sm:px-8 sm:flex-row sm:items-start sm:justify-between sm:py-12">
          <div className="max-w-sm"><Logo /><p className="mt-3 text-sm leading-[1.6] text-white/40">Advanced training for the next generation of AI builders.</p></div>
          <div className="flex gap-10 text-sm">
            <div className="space-y-2.5"><p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/30">Navigate</p><a href="#curriculum" className="block text-white/60 hover:text-white">Curriculum</a><a href="#projects" className="block text-white/60 hover:text-white">Projects</a><a href="#pricing" className="block text-white/60 hover:text-white">Pricing</a><a href="#faq" className="block text-white/60 hover:text-white">FAQ</a></div>
            <div className="space-y-2.5"><p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/30">Wisnotech</p><a href="/" className="block text-white/60 hover:text-white">Home</a><a href="/academy" className="block text-white/60 hover:text-white">Academy</a><a href="/privacy" className="block text-white/60 hover:text-white">Privacy</a><a href="/terms" className="block text-white/60 hover:text-white">Terms</a></div>
          </div>
        </div>
        <div className="border-t border-white/10"><div className="mx-auto flex max-w-[1160px] items-center justify-between px-5 py-6 sm:px-8"><p className="font-mono text-xs text-white/25">© {new Date().getFullYear()} Wisnotech.</p><p className="hidden font-mono text-xs text-white/25 sm:block">Think. Build. Ship.</p></div></div>
      </footer>
    </div>
  );
}
