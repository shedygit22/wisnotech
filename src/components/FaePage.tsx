import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Code2,
  Cpu,
  Globe,
  Layers,
  Menu,
  Rocket,
  Smartphone,
  Users,
  X,
  Zap,
  Calendar,
  MapPin,
} from "lucide-react";
import Logo from "./Logo";

const BOOTCAMP = {
  priceNGN: 300000,
  priceUSD: 199,
  deadline: "August 31, 2026",
  start: "September, 2026",
  duration: "3 Months",
  mode: "Remote & Physical",
  seats: "Limited Slots",
  whatsapp: "+2349153541297",
  url: "www.wisnotech.vercel.app/fae/",
} as const;

const CURRICULUM = [
  {
    phase: "Month 1",
    title: "Foundations & AI Core",
    desc: "Master the fundamentals that power every AI product.",
    items: ["AI fundamentals & prompt engineering", "Python for AI & APIs", "Databases & authentication", "Web fundamentals — HTML, CSS, modern JS"],
  },
  {
    phase: "Month 2",
    title: "Full-Stack AI Engineering",
    desc: "Build complete products — frontend to backend to AI.",
    items: ["React & Next.js full-stack", "AI agents & automations", "Building SaaS products", "Web & mobile applications"],
  },
  {
    phase: "Month 3",
    title: "Ship & Monetize",
    desc: "From working product to live business.",
    items: ["Deployment, domains & scaling", "Building client projects", "Portfolio & personal brand", "Monetization & freelance pipeline"],
  },
] as const;

const BUILDS = [
  { icon: Cpu, title: "AI Automations", desc: "Workflows that handle support, sales and operations while you sleep." },
  { icon: Zap, title: "AI Agents", desc: "Autonomous agents that research, reason and execute multi-step tasks." },
  { icon: Globe, title: "Web Applications", desc: "Fast, modern web apps — from landing pages to SaaS platforms." },
  { icon: Smartphone, title: "Mobile Applications", desc: "Premium mobile experiences, built with AI acceleration." },
  { icon: Layers, title: "SaaS Products", desc: "Your own subscription product — auth, payments, dashboard, shipped." },
  { icon: Rocket, title: "Client Projects", desc: "Real briefs from real businesses — portfolio work that pays." },
] as const;

const FAQS = [
  { q: "Do I need coding experience?", a: "No. We start from foundations. If you can use a computer and are willing to build, you can start. The bootcamp is designed for ambitious beginners and those levelling up." },
  { q: "Is it remote or physical?", a: "Both. Join remotely from anywhere or physically where available — same curriculum, same live sessions, all recordings included." },
  { q: "What will I actually build?", a: "AI automations, AI agents, web and mobile applications, SaaS products and client projects — all portfolio-ready and built with modern AI tools." },
  { q: "How long is the program?", a: "3 months, intensive and project-based. Expect live sessions, build sprints and practical assignments each week." },
  { q: "Will I get a certificate?", a: "Yes, on completion — plus a portfolio of shipped products you can show employers and clients." },
  { q: "Can I pay in installments?", a: "Contact us on WhatsApp to discuss flexible payment. The listed price is the full bootcamp fee." },
  { q: "When does it start?", a: "Starts September, 2026. Slots are limited — early application is recommended." },
] as const;

function formatNaira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

export default function FaePage() {
  const [currency, setCurrency] = useState<"NGN" | "USD">("NGN");
  const [mobileNav, setMobileNav] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0F1B4D] antialiased selection:bg-[#14B8A6]/30">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Sora:wght@600;700;800&display=swap');`}</style>

      {/* Nav */}
      <header className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${scrolled ? "border-[#0F1B4D]/10 bg-white/90 backdrop-blur-xl" : "border-transparent bg-transparent"}`}>
        <div className="mx-auto flex h-[68px] max-w-[1160px] items-center justify-between px-5 sm:px-8">
          <a href="/fae" className="flex items-center gap-2.5">
            <Logo />
            <span className="hidden text-[11px] font-bold tracking-[0.12em] text-[#0F1B4D]/60 sm:inline">SCHOOL OF TECHNOLOGY</span>
          </a>
          <nav className="hidden items-center gap-1 lg:flex">
            {[
              { label: "Curriculum", href: "#curriculum" },
              { label: "What You'll Build", href: "#build" },
              { label: "Pricing", href: "#pricing" },
              { label: "FAQ", href: "#faq" },
            ].map((l) => (
              <a key={l.label} href={l.href} className="rounded-full px-3.5 py-2 text-[13px] font-medium text-[#0F1B4D]/60 hover:bg-[#0F1B4D]/5 hover:text-[#0F1B4D]">{l.label}</a>
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <a href="#pricing" className="inline-flex items-center gap-2 rounded-full bg-[#0F1B4D] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#1A2A6B]">Apply Now <ArrowRight className="h-3.5 w-3.5" /></a>
          </div>
          <button type="button" onClick={() => setMobileNav((v) => !v)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#0F1B4D]/10 bg-white text-[#0F1B4D] lg:hidden">
            {mobileNav ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
        <AnimatePresence>
          {mobileNav && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="border-t border-[#0F1B4D]/10 bg-white px-5 py-6 lg:hidden">
              <div className="flex flex-col gap-1">
                {[
                  { label: "Curriculum", href: "#curriculum" },
                  { label: "What You'll Build", href: "#build" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "FAQ", href: "#faq" },
                ].map((l) => (
                  <a key={l.label} href={l.href} onClick={() => setMobileNav(false)} className="rounded-xl px-3 py-3 text-[15px] font-medium text-[#0F1B4D]/75 hover:bg-[#0F1B4D]/5">{l.label}</a>
                ))}
                <a href="#pricing" onClick={() => setMobileNav(false)} className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-[#0F1B4D] px-5 py-3.5 text-sm font-semibold text-white">Apply Now <ArrowRight className="h-4 w-4" /></a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO — flyer expanded */}
      <section className="relative overflow-hidden bg-white pt-[68px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(20,184,166,0.08),transparent_60%)]" />
        <div className="mx-auto grid max-w-[1160px] gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
          <div>
            <span className="inline-flex rounded-full bg-gradient-to-r from-[#3B9DD5] to-[#7DD3E0] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-sm">Tech Bootcamp</span>
            <h1 className="mt-5 font-[900] leading-[0.9] tracking-[-0.04em] text-[#0F1B4D]">
              <span className="block text-[16px] font-bold tracking-[0.12em] text-[#0F1B4D]">BECOME A</span>
              <span className="block text-[42px] sm:text-[52px] lg:text-[56px]">FULL-STACK <span className="text-[#2E6B9E]">AI</span></span>
              <span className="block text-[42px] text-[#2E6B9E] sm:text-[52px] lg:text-[56px]">ENGINEER</span>
            </h1>
            <div className="mt-3 flex items-center gap-3">
              <span className="h-1.5 w-16 bg-[#7DD3E0]" />
              <span className="text-sm font-bold tracking-[0.14em] text-[#0F1B4D]">IN 3 MONTHS</span>
            </div>
            <p className="mt-4 max-w-[46ch] text-[13px] font-bold leading-[1.5] tracking-[0.02em] text-[#0F1B4D] sm:text-sm">BUILD AI AUTOMATIONS, AI AGENTS,<br />WEB & MOBILE APPLICATIONS,<br />SAAS PRODUCTS & MANY MORE!</p>

            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { icon: Users, label: "Remote & Physical" },
                { icon: Calendar, label: "Starts Sept, 2026" },
                { icon: Users, label: "Limited Slots", icon2: true },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2 rounded-xl border border-[#0F1B4D]/10 bg-white px-2.5 py-2.5 shadow-[0_4px_16px_-8px_rgba(15,27,77,0.15)] sm:gap-3 sm:px-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#14B8A6] text-white">
                    {b.icon2 ? <Users className="h-4 w-4" /> : b.label.includes("Starts") ? <Calendar className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                  </span>
                  <span className="text-[11px] font-semibold leading-[1.2] text-[#0F1B4D] sm:text-xs">{b.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#pricing" className="inline-flex items-center gap-2 rounded-full bg-[#0F1B4D] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_32px_-12px_rgba(15,27,77,0.4)] hover:bg-[#1A2A6B]">Secure Your Spot — {formatNaira(BOOTCAMP.priceNGN)} <ArrowRight className="h-4 w-4" /></a>
              <a href="#curriculum" className="inline-flex items-center gap-2 rounded-full border border-[#0F1B4D]/15 bg-white px-7 py-3.5 text-sm font-semibold text-[#0F1B4D] hover:border-[#0F1B4D]/25">Explore Curriculum</a>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[20px] border border-[#0F1B4D]/10 bg-white p-2 shadow-[0_24px_64px_-16px_rgba(15,27,77,0.18)]">
              {/* Top bar like flyer code window */}
              <div className="overflow-hidden rounded-[14px] border border-[#0F1B4D]/10">
                <div className="flex h-7 items-center gap-1.5 bg-[#0F1B4D] px-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/80" /><span className="h-2.5 w-2.5 rounded-full bg-white/80" /><span className="h-2.5 w-2.5 rounded-full bg-white/80" />
                </div>
                <div className="grid grid-cols-[0.9fr_1.4fr_0.9fr] gap-2 bg-[#F0F4F8] p-3">
                  <div className="rounded-xl border border-[#0F1B4D]/10 bg-white p-3">
                    <Code2 className="h-8 w-8 text-[#14B8A6]" />
                    <div className="mt-3 space-y-1.5"><div className="h-1.5 w-full rounded bg-[#0F1B4D]/10" /><div className="h-1.5 w-5/6 rounded bg-[#0F1B4D]/10" /><div className="h-1.5 w-4/6 rounded bg-[#0F1B4D]/10" /></div>
                  </div>
                  <div className="rounded-xl border border-[#0F1B4D]/10 bg-white p-3">
                    <div className="h-16 rounded-lg bg-gradient-to-br from-[#7DD3E0]/30 to-[#14B8A6]/30 p-2">
                      <div className="flex h-full items-end justify-center gap-1">
                        <div className="h-6 w-8 rounded-t bg-[#14B8A6]" /><div className="h-10 w-10 rounded-t bg-[#14B8A6]" /><div className="h-7 w-8 rounded-t bg-[#14B8A6]" />
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-1.5"><div className="h-6 rounded bg-[#14B8A6]/15" /><div className="h-6 rounded bg-[#14B8A6]/15" /><div className="h-6 rounded bg-[#14B8A6]/15" /></div>
                  </div>
                  <div className="rounded-xl bg-[#0F1B4D] p-3 font-mono text-[9px] leading-[1.6] text-white/80">
                    <div className="space-y-1"><div className="h-1 w-12 rounded bg-gradient-to-r from-yellow-300 to-[#7DD3E0]" /><div className="h-1 w-16 rounded bg-[#14B8A6]/60" /><div className="h-1 w-10 rounded bg-[#7DD3E0]" /><div className="h-1 w-14 rounded bg-[#14B8A6]/60" /><div className="h-1 w-8 rounded bg-yellow-300/60" /></div>
                  </div>
                </div>
              </div>
              {/* Woman image from flyer — use CSS placeholder that matches flyer composition */}
              <div className="pointer-events-none absolute -right-2 -top-2 bottom-2 w-[48%] overflow-hidden rounded-[14px] opacity-0 lg:opacity-100" aria-hidden>
                <div className="h-full w-full bg-gradient-to-b from-transparent via-transparent to-white/20" />
              </div>
            </div>
            {/* Flyer hero image — actual uploaded flyer as social proof */}
            <div className="mt-3 overflow-hidden rounded-[16px] border border-[#0F1B4D]/10 bg-white p-1.5">
              <div className="flex items-center gap-2 px-2 py-1">
                <span className="h-2 w-2 rounded-full bg-[#14B8A6] animate-pulse" /><span className="text-[11px] font-bold tracking-[0.08em] text-[#0F1B4D]/60">FULL-STACK AI ENGINEER — FLYER PREVIEW</span>
              </div>
              <div className="mt-1 aspect-[4/3] overflow-hidden rounded-[12px] bg-[#F0F4F8]">
                <img
                  src="/assets/fae-flyer.jpg"
                  alt="Full-Stack AI Engineer Bootcamp flyer"
                  className="h-full w-full object-contain object-top"
                  loading="eager"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
                <div className="hidden h-full w-full items-center justify-center bg-[#0F1B4D]/5 p-6 text-center" style={{ display: "none" }}>
                  <p className="text-sm text-[#0F1B4D]/60">Add flyer image as <span className="font-mono font-semibold">public/assets/fae-flyer.jpg</span> to show it here.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar like flyer */}
        <div className="bg-gradient-to-r from-[#3B9DD5] to-[#7DD3E0] py-4">
          <div className="mx-auto flex max-w-[1160px] flex-col gap-4 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="hidden h-12 w-px bg-white/30 sm:block" aria-hidden />
              <div>
                <p className="flex items-center gap-2 text-sm font-bold text-white"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#3B9DD5]">›</span> Learn More</p>
                <p className="mt-1 flex flex-wrap gap-3 text-xs font-medium text-white/90">
                  <span className="inline-flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> {BOOTCAMP.url}</span>
                  <span className="inline-flex items-center gap-1.5">WhatsApp & Calls: {BOOTCAMP.whatsapp}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden rounded-full bg-white px-3 py-1 text-xs font-bold text-[#3B9DD5] sm:inline">Scan QR</span>
              <div className="h-20 w-20 rounded-lg bg-white p-1.5">
                <div className="flex h-full w-full items-center justify-center bg-[#0F1B4D] text-[8px] font-bold text-white">QR<br />WhatsApp</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What you'll build */}
      <section id="build" className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-[#14B8A6]">What You&apos;ll Build</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-center text-[28px] font-[800] leading-[0.95] tracking-[-0.04em] text-[#0F1B4D] sm:text-[36px]">From Idea to Live Product in 3 Months.</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BUILDS.map((b) => (
              <div key={b.title} className="rounded-[16px] border border-[#0F1B4D]/10 bg-white p-5 shadow-[0_8px_24px_-12px_rgba(15,27,77,0.08)]">
                <b.icon className="h-5 w-5 text-[#14B8A6]" />
                <h3 className="mt-3 text-sm font-bold tracking-[-0.01em] text-[#0F1B4D]">{b.title}</h3>
                <p className="mt-1.5 text-xs leading-[1.6] text-[#0F1B4D]/60">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum — 3 months */}
      <section id="curriculum" className="scroll-mt-20 bg-[#F7F9FC] py-14 sm:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#14B8A6]">Curriculum</p>
          <h2 className="mt-3 max-w-xl text-[28px] font-[800] leading-[0.95] tracking-[-0.04em] text-[#0F1B4D] sm:text-[36px]">A 3-Month Path to Full-Stack AI Engineering.</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {CURRICULUM.map((m) => (
              <div key={m.phase} className="rounded-[16px] border border-[#0F1B4D]/10 bg-white p-6">
                <span className="inline-flex rounded-full bg-[#0F1B4D] px-3 py-1 text-[11px] font-bold tracking-[0.08em] text-white">{m.phase}</span>
                <h3 className="mt-3 text-[16px] font-bold tracking-[-0.01em] text-[#0F1B4D]">{m.title}</h3>
                <p className="mt-1.5 text-xs leading-[1.6] text-[#0F1B4D]/60">{m.desc}</p>
                <ul className="mt-4 space-y-1.5">
                  {m.items.map((it) => (
                    <li key={it} className="flex gap-2 text-xs leading-[1.5] text-[#0F1B4D]/70"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#14B8A6]" />{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mode & Dates */}
      <section className="bg-white py-10">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-[14px] border border-[#0F1B4D]/10 bg-[#F7F9FC] px-4 py-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#14B8A6] text-white"><MapPin className="h-4 w-4" /></span>
              <div><p className="text-xs font-bold text-[#0F1B4D]">{BOOTCAMP.mode}</p><p className="text-[11px] text-[#0F1B4D]/50">Choose your mode</p></div>
            </div>
            <div className="flex items-center gap-3 rounded-[14px] border border-[#0F1B4D]/10 bg-[#F7F9FC] px-4 py-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#14B8A6] text-white"><Calendar className="h-4 w-4" /></span>
              <div><p className="text-xs font-bold text-[#0F1B4D]">Starts {BOOTCAMP.start}</p><p className="text-[11px] text-[#0F1B4D]/50">3 months intensive</p></div>
            </div>
            <div className="flex items-center gap-3 rounded-[14px] border border-[#0F1B4D]/10 bg-[#F7F9FC] px-4 py-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#14B8A6] text-white"><Users className="h-4 w-4" /></span>
              <div><p className="text-xs font-bold text-[#0F1B4D]">{BOOTCAMP.seats}</p><p className="text-[11px] text-[#0F1B4D]/50">Cohort size capped</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing — 300k */}
      <section id="pricing" className="scroll-mt-20 bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#14B8A6]">Enrollment</p>
            <h2 className="mt-3 text-[30px] font-[800] leading-[0.95] tracking-[-0.04em] text-[#0F1B4D] sm:text-[40px]">Become a Full-Stack AI Engineer.</h2>
            <p className="mt-3 text-sm leading-[1.6] text-[#0F1B4D]/60">One bootcamp. Everything you need to build and ship AI products.</p>
          </div>

          <div className="mx-auto mt-6 flex justify-center gap-2">
            <button type="button" onClick={() => setCurrency("NGN")} className={`rounded-full px-5 py-2 text-xs font-bold tracking-[0.08em] ${currency === "NGN" ? "bg-[#0F1B4D] text-white" : "border border-[#0F1B4D]/15 bg-white text-[#0F1B4D]/60"}`}>NGN</button>
            <button type="button" onClick={() => setCurrency("USD")} className={`rounded-full px-5 py-2 text-xs font-bold tracking-[0.08em] ${currency === "USD" ? "bg-[#0F1B4D] text-white" : "border border-[#0F1B4D]/15 bg-white text-[#0F1B4D]/60"}`}>USD</button>
          </div>

          <div className="mx-auto mt-6 max-w-[520px] overflow-hidden rounded-[22px] border-2 border-[#0F1B4D] bg-white shadow-[0_24px_64px_-16px_rgba(15,27,77,0.18)]">
            <div className="bg-[#0F1B4D] px-6 py-3 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">Full-Stack AI Engineer — 3-Month Bootcamp</p>
            </div>
            <div className="p-7 sm:p-8">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-[44px] font-[900] tracking-[-0.04em] text-[#0F1B4D]">{currency === "NGN" ? formatNaira(BOOTCAMP.priceNGN) : `$${BOOTCAMP.priceUSD}`}</span>
                <span className="text-xs font-bold tracking-[0.08em] text-[#0F1B4D]/40">ONE-TIME</span>
              </div>
              <p className="mt-1 text-center text-xs font-medium text-[#0F1B4D]/50">Starts {BOOTCAMP.start} · {BOOTCAMP.mode} · {BOOTCAMP.seats}</p>

              <ul className="mt-6 space-y-2.5 border-t border-[#0F1B4D]/10 pt-6">
                {[
                  "3-month intensive bootcamp",
                  "AI automations & AI agents",
                  "Web & mobile applications",
                  "SaaS products & client work",
                  "Live sessions + recordings",
                  "Real projects & portfolio",
                  "Certificate on completion",
                ].map((f) => (
                  <li key={f} className="flex gap-2.5 text-[13px] leading-[1.5] text-[#0F1B4D]/80"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#14B8A6]" />{f}</li>
                ))}
              </ul>

              <a
                href={`https://wa.me/${BOOTCAMP.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi Wisnotech, I want to join the Full-Stack AI Engineer bootcamp (${currency === "NGN" ? formatNaira(BOOTCAMP.priceNGN) : `$${BOOTCAMP.priceUSD}`})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#14B8A6] px-6 py-4 text-sm font-bold text-white shadow-[0_12px_32px_-12px_rgba(20,184,166,0.5)] hover:bg-[#0F9E8F]"
              >
                Apply on WhatsApp <ArrowRight className="h-4 w-4" />
              </a>
              <a href={`tel:${BOOTCAMP.whatsapp}`} className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-[#0F1B4D]/15 bg-white px-6 py-3.5 text-sm font-semibold text-[#0F1B4D] hover:bg-[#F7F9FC]">
                <Clock className="h-4 w-4" /> Call to Enroll
              </a>
              <p className="mt-3 text-center text-xs text-[#0F1B4D]/40">Secure spot · Pay in NGN or USD · Ends {BOOTCAMP.deadline}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-[#F7F9FC] py-14 sm:py-20">
        <div className="mx-auto max-w-[760px] px-5 sm:px-8">
          <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-[#0F1B4D] sm:text-[34px]">Questions, Answered.</h2>
          <div className="mt-8 divide-y divide-[#0F1B4D]/10 overflow-hidden rounded-[16px] border border-[#0F1B4D]/10 bg-white">
            {FAQS.map((f, i) => (
              <div key={f.q}>
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6" aria-expanded={openFaq === i}>
                  <span className="text-[14px] font-semibold leading-[1.4] tracking-[-0.01em] text-[#0F1B4D] sm:text-[15px]">{f.q}</span>
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all ${openFaq === i ? "rotate-45 border-[#14B8A6] bg-[#14B8A6]/10 text-[#14B8A6]" : "border-[#0F1B4D]/15 text-[#0F1B4D]/40"}`}><ChevronDown className={`h-4 w-4 transition-transform ${openFaq === i ? "rotate-180" : ""}`} /></span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                      <p className="px-5 pb-5 text-[13px] leading-[1.65] text-[#0F1B4D]/60 sm:px-6">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="overflow-hidden rounded-[24px] bg-[#0F1B4D] px-6 py-10 text-center sm:px-10 sm:py-14">
            <h2 className="mx-auto max-w-[16ch] text-[28px] font-[800] leading-[0.92] tracking-[-0.04em] text-white sm:text-[42px]">Your Future as a Full-Stack AI Engineer Starts Here.</h2>
            <p className="mx-auto mt-4 max-w-[46ch] text-[14px] leading-[1.6] text-white/70">Build AI automations, agents, web & mobile apps and SaaS products — in 3 months.</p>
            <a href="#pricing" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#14B8A6] px-7 py-3.5 text-sm font-bold text-white hover:bg-[#0F9E8F]">Claim Your Spot — {formatNaira(BOOTCAMP.priceNGN)} <ArrowRight className="h-4 w-4" /></a>
            <p className="mt-3 flex flex-wrap justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-white/40"><span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Starts Sept 2026</span><span className="h-3 w-px bg-white/20" /><span>{BOOTCAMP.mode}</span><span className="h-3 w-px bg-white/20" /><span>{BOOTCAMP.seats}</span></p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#0F1B4D]/10 bg-[#F7F9FC]">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-6 px-5 py-8 sm:px-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5"><Logo /><span className="text-[11px] font-bold tracking-[0.12em] text-[#0F1B4D]/50">SCHOOL OF TECHNOLOGY</span></div>
          <div className="flex flex-wrap gap-6 text-xs font-medium text-[#0F1B4D]/60">
            <a href="/" className="hover:text-[#0F1B4D]">Home</a><a href="/training" className="hover:text-[#0F1B4D]">Training</a><a href="/academy" className="hover:text-[#0F1B4D]">Academy</a><a href="/privacy" className="hover:text-[#0F1B4D]">Privacy</a>
          </div>
        </div>
        <div className="border-t border-[#0F1B4D]/10"><div className="mx-auto flex max-w-[1160px] items-center justify-between px-5 py-4 sm:px-8"><p className="text-xs text-[#0F1B4D]/40">© {new Date().getFullYear()} Wisnotech School of Technology.</p><p className="hidden text-xs text-[#0F1B4D]/30 sm:block">{BOOTCAMP.url} · {BOOTCAMP.whatsapp}</p></div></div>
      </footer>
    </div>
  );
}
