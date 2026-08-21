import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Menu,
  Play,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { PORTFOLIO_SAMPLES } from "../lib/portfolio";
import Logo from "./Logo";

// ──────────────────────────────────────────────────────────────
// Central config — edit here, updates everywhere.
// ──────────────────────────────────────────────────────────────
const ACADEMY = {
  name: "Wisnotech AI Video Academy",
  shortName: "WISNOTECH ACADEMY",
  cohort: "2026 Cohort",
  cohortLabel: "AI VIDEO CREATION COHORT — 2026",
  seats: 40,
  deadline: "March 15, 2026",
  ctaApply: "#pricing",
  ctaCurriculum: "#curriculum",
} as const;

const PRICING_TIERS = [
  {
    id: "basic",
    name: "Basic",
    tagline: "Start your AI video journey",
    priceUSD: 149,
    priceNGN: 260000,
    cta: "Get Basic",
    featured: false,
    includesTools: false,
    features: [
      "Full cohort access (8 modules)",
      "Live training sessions",
      "Practical assignments",
      "Community access",
      "Session recordings — 6 months",
      "Certificate of completion",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Most popular for serious creators",
    priceUSD: 249,
    priceNGN: 435000,
    cta: "Get Premium",
    featured: true,
    includesTools: false,
    features: [
      "Everything in Basic",
      "Extended recordings — 12 months",
      "Real-world portfolio projects (4)",
      "Prompt frameworks & templates",
      "Priority community support",
      "Portfolio review & feedback",
    ],
  },
  {
    id: "advanced",
    name: "Advanced",
    tagline: "For creators going professional",
    priceUSD: 399,
    priceNGN: 700000,
    cta: "Get Advanced",
    featured: false,
    includesTools: true,
    features: [
      "Everything in Premium",
      "Complete AI tools suite included",
      "Pro workflow templates & resources",
      "Advanced project critiques",
      "Commercial-ready project kit",
      "5 premium UGC ad templates included",
    ],
  },
  {
    id: "oneonone",
    name: "One-on-One",
    tagline: "Direct mentorship to launch",
    priceUSD: 699,
    priceNGN: 1200000,
    cta: "Apply for 1:1",
    featured: false,
    includesTools: true,
    features: [
      "Everything in Advanced",
      "Complete tools suite included",
      "3 × 1-on-1 mentoring sessions",
      "Personal portfolio & pricing review",
      "Direct founder feedback",
      "Launch plan for your first paid work",
    ],
  },
] as const;

const INSTAGRAM_UGC = [
  {
    id: "ig-1",
    title: "Glow Serum — UGC Ad",
    brand: "Skincare · Premium UGC",
    desc: "Hand-held bathroom UGC that sold out a restock in 48 hours. Shot on phone, finished like an ad.",
    src: "/portfolio/videos/vertical-a1.mp4",
    poster: "/portfolio/thumbs/vertical-a1.jpg",
    tag: "UGC Ad",
  },
  {
    id: "ig-2",
    title: "Streetwear Drop — UGC Ad",
    brand: "Fashion · Premium UGC",
    desc: "Creator-style try-on that feels native to the feed, cut to hold watch time past 8 seconds.",
    src: "/portfolio/videos/vertical-a2.mp4",
    poster: "/portfolio/thumbs/vertical-a2.jpg",
    tag: "UGC Ad",
  },
  {
    id: "ig-3",
    title: "Matcha Ritual — UGC Ad",
    brand: "Food & Beverage · Premium UGC",
    desc: "Morning routine UGC with product as hero — no crew, no studio, pure scroll-stopper.",
    src: "/portfolio/videos/vertical-a3.mp4",
    poster: "/portfolio/thumbs/vertical-a3.jpg",
    tag: "UGC Ad",
  },
  {
    id: "ig-4",
    title: "Gym Bottle — UGC Ad",
    brand: "Fitness · Premium UGC",
    desc: "Gym-floor UGC that moves product. Built for Reels, engineered for save-rate.",
    src: "/portfolio/videos/vertical-a4.mp4",
    poster: "/portfolio/thumbs/vertical-a4.jpg",
    tag: "UGC Ad",
  },
  {
    id: "ig-5",
    title: "Scent Story — UGC Ad",
    brand: "Beauty · Premium UGC",
    desc: "Unboxing to first spray — a complete UGC ad from one prompt and one product image.",
    src: "/portfolio/videos/vertical-a5.mp4",
    poster: "/portfolio/thumbs/vertical-a5.jpg",
    tag: "UGC Ad",
  },
] as const;

const CURRICULUM = [
  {
    n: "01",
    title: "Understanding the New AI Video Landscape",
    copy: "Learn the ecosystem, the major tools, what they are actually capable of, and how to build an efficient creative workflow that doesn't collapse when a platform updates.",
    bullets: ["The tool landscape, de-hyped", "Choosing the right tool per job", "A workflow that survives updates"],
  },
  {
    n: "02",
    title: "The Art of AI Prompting for Video",
    copy: "Write prompts that control camera movement, composition, characters, lighting, environment, mood, style, action and cinematic direction — intentionally, not by luck.",
    bullets: ["Camera and composition control", "Character, wardrobe and world coherence", "Light, mood and style direction"],
  },
  {
    n: "03",
    title: "Creating Consistent Characters and Worlds",
    copy: "The difference between a random clip and a real project is consistency. Learn how to keep the same face, same world and same logic across scenes.",
    bullets: ["Character lock and face consistency", "World and environment continuity", "Scene-to-scene coherence"],
  },
  {
    n: "04",
    title: "Cinematic AI Filmmaking",
    copy: "Story, shot design, scene construction and camera direction. Make AI footage feel like cinema, not a tech demo.",
    bullets: ["Story and structure", "Shot design and camera language", "Building a sequence that cuts"],
  },
  {
    n: "05",
    title: "AI Commercials and Brand Content",
    copy: "Produce premium product and brand videos that a marketing team would actually pay for — from concept to final delivery.",
    bullets: ["Product as hero", "Brand tone and art direction", "Ad structure that sells"],
  },
  {
    n: "06",
    title: "AI Content for Social Media and YouTube",
    copy: "Build repeatable systems for short-form, faceless YouTube, social campaigns, educational content and viral visual formats.",
    bullets: ["Short-form and Reels systems", "Faceless YouTube workflows", "Campaign and series thinking"],
  },
  {
    n: "07",
    title: "Editing and Post-Production",
    copy: "Generated clips are raw material. Learn to transform them into polished final productions — edit, sound, voice, music, colour and delivery.",
    bullets: ["Editing AI footage for rhythm", "Sound, voice and music", "Colour and final delivery"],
  },
  {
    n: "08",
    title: "Turning AI Video Into Income",
    copy: "Freelance services, AI video production, commercial work, content businesses, YouTube, agencies and personal brand — real paths, not theory.",
    bullets: ["Offers that clients understand", "Pricing and packaging", "Finding and keeping work"],
  },
] as const;

const PROJECTS = [
  { title: "Cinematic Short Film", desc: "A narrative sequence with deliberate pacing, grade and sound — portfolio-ready.", accent: "#FF4D12" },
  { title: "AI Commercial", desc: "A product ad built to make a brand look cinematic and desirable.", accent: "#FF4D12" },
  { title: "Viral Social Video", desc: "High-impact vertical content engineered for the feed, not the festival.", accent: "#FF4D12" },
  { title: "Creative Campaign", desc: "A complete visual concept from idea to final video — and the system behind it.", accent: "#FF4D12" },
] as const;

const TESTIMONIALS = [
  { quote: "I went from experimenting with AI tools to creating complete video projects I could actually show clients.", name: "Amara K.", role: "Creator, Lagos" },
  { quote: "The workflow is what changed everything. I finally know which tool to use and when — no more random prompting.", name: "Daniel O.", role: "Filmmaker, London" },
  { quote: "Three weeks in, I delivered my first paid UGC ad. The templates alone paid for the cohort.", name: "Sofia M.", role: "Marketer, Berlin" },
  { quote: "Feels like a real film program, not a tutorial playlist. The critiques pushed the work to a different level.", name: "James T.", role: "Entrepreneur, Toronto" },
] as const;

const FAQS = [
  { q: "Do I need previous video editing experience?", a: "No. We start from fundamentals and build up. If you can use a computer, you can start. Editors move faster but beginners are fully supported with templates and live help." },
  { q: "Do I need to know how to use AI already?", a: "No. The first two modules give you the landscape and prompting foundations. The rest is hands-on — you learn by making." },
  { q: "Which AI tools will we use?", a: "The cohort is workflow-first, not tool-locked. We teach principles that survive platform changes and show the current best stack — it updates as tools evolve." },
  { q: "Will the sessions be recorded?", a: "Yes. Every live session is recorded and available to you for 12 months, along with templates, prompts and project files." },
  { q: "How long does the cohort last?", a: "Six weeks, live cohort experience with weekly sessions, practical assignments and guided projects. Expect 4–6 hours per week." },
  { q: "Can I pay in Naira?", a: "Yes. Use the NGN toggle on the pricing card. You'll be routed to the correct checkout for your currency." },
  { q: "Can international students join?", a: "Yes. International students join from anywhere and pay in USD. Sessions are scheduled to work across time zones and all recordings are available." },
  { q: "What happens after I join?", a: "You receive onboarding, community access and your first pre-work within 24 hours. Day one is live and practical." },
] as const;

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────
function formatNaira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

// Portfolio videos for the hero & projects — curated, not random.
const HERO_VIDEOS = PORTFOLIO_SAMPLES.filter((s) => s.type === "video" && s.published).slice(0, 6);
const PROJECT_VIDEOS = PORTFOLIO_SAMPLES.filter((s) => s.type === "video" && s.published).slice(6, 14);

// ──────────────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────────────
export default function AcademyPage() {
  const [currency, setCurrency] = useState<"USD" | "NGN">("USD");
  const [mobileNav, setMobileNav] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F3EE] antialiased selection:bg-[#FF4D12]/30 selection:text-white">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');`}</style>

      {/* ── Sticky Nav ── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          scrolled ? "border-white/[0.08] bg-[#0A0A0A]/85 backdrop-blur-xl" : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[64px] max-w-[1160px] items-center justify-between px-5 sm:px-8">
          <a href="/academy" className="shrink-0" aria-label="Wisnotech Academy home">
            <Logo />
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {[
              { label: "Curriculum", href: "#curriculum" },
              { label: "Projects", href: "#projects" },
              { label: "Pricing", href: "#pricing" },
              { label: "FAQ", href: "#faq" },
            ].map((l) => (
              <a key={l.label} href={l.href} className="rounded-full px-3.5 py-2 text-[13px] font-medium tracking-[-0.01em] text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={ACADEMY.ctaApply}
              className="inline-flex items-center gap-2 rounded-full bg-[#FF4D12] px-5 py-2.5 text-[13px] font-semibold tracking-[-0.01em] text-white transition-all hover:bg-[#E84510] hover:shadow-[0_8px_24px_-12px_rgba(255,77,18,0.6)]"
            >
              Apply for the Cohort <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>

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
                {[
                  { label: "Curriculum", href: "#curriculum" },
                  { label: "Projects", href: "#projects" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "FAQ", href: "#faq" },
                ].map((l) => (
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
                  href={ACADEMY.ctaApply}
                  onClick={() => setMobileNav(false)}
                  className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-[#FF4D12] px-5 py-3.5 text-sm font-semibold text-white"
                >
                  Apply for the Cohort <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#0A0A0A] pt-[64px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(255,77,18,0.09),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,rgba(0,0,0,0.55))]" />
        <div className="mx-auto grid max-w-[1160px] gap-10 px-5 pb-10 pt-10 sm:px-8 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:pt-16">
          <div className="relative">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
              <span className="h-px w-6 bg-[#FF4D12]" aria-hidden />
              {ACADEMY.cohortLabel}
            </p>
            <h1 className="mt-5 max-w-[16ch] font-[800] leading-[0.92] tracking-[-0.04em] text-[#F5F3EE] text-[36px] sm:text-[46px] lg:text-[56px]">
              Learn to Create Videos That Were{" "}
              <span className="font-[Instrument_Serif] font-normal italic tracking-[-0.03em] text-white/90">Impossible</span> Just a Few Years Ago.
            </h1>
            <p className="mt-5 max-w-[48ch] text-[16px] leading-[1.65] text-white/55 sm:text-[17px]">
              A practical, hands-on AI Video Academy designed to take you from curiosity to creating cinematic videos, commercials, content, and real projects using the world&apos;s most powerful AI tools.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={ACADEMY.ctaApply}
                className="inline-flex items-center gap-2 rounded-full bg-[#FF4D12] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_32px_-16px_rgba(255,77,18,0.7)] transition-all hover:bg-[#E84510] hover:shadow-[0_16px_40px_-16px_rgba(255,77,18,0.8)]"
              >
                Join the Next Cohort <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href={ACADEMY.ctaCurriculum}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-7 py-3.5 text-sm font-medium text-white backdrop-blur hover:border-white/20 hover:bg-white/[0.07]"
              >
                Explore the Curriculum
              </a>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/35">
              <span>Live Cohort</span>
              <span className="h-3 w-px bg-white/10" aria-hidden />
              <span>Hands-On Projects</span>
              <span className="h-3 w-px bg-white/10" aria-hidden />
              <span>Beginner Friendly</span>
              <span className="h-3 w-px bg-white/10" aria-hidden />
              <span>Limited Seats</span>
            </div>
          </div>

          {/* Cinematic showreel visual — uses portfolio videos */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#141414] p-2 shadow-[0_40px_80px_-32px_rgba(0,0,0,0.7)]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-black">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  poster={HERO_VIDEOS[0]?.poster}
                  className="h-full w-full object-cover"
                  style={{ filter: "contrast(1.04) saturate(1.02)" }}
                >
                  <source src={HERO_VIDEOS[0]?.src} type="video/mp4" />
                </video>
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.45),transparent_45%)]" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 backdrop-blur">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF4D12]" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90">Studio Showreel</span>
                </div>
                <button
                  type="button"
                  onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                  className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0A0A0A] shadow-lg"
                  aria-label="View projects"
                >
                  <Play className="ml-0.5 h-4 w-4" aria-hidden />
                </button>
              </div>
              {/* Secondary strip — 4 small frames */}
              <div className="mt-2 grid grid-cols-4 gap-2">
                {HERO_VIDEOS.slice(1, 5).map((v) => (
                  <div key={v.id} className="relative aspect-[3/4] overflow-hidden rounded-[10px] bg-black">
                    <video autoPlay loop muted playsInline preload="metadata" poster={v.poster} className="h-full w-full object-cover opacity-90">
                      <source src={v.src} type="video/mp4" />
                    </video>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] tracking-[0.08em] text-white/30">Frames from student & studio work — portfolio videos</p>
          </div>
        </div>
      </section>

      {/* ── Social proof ── */}
      <section className="border-y border-white/10 bg-[#0A0A0A]">
        <div className="mx-auto max-w-[1160px] px-5 py-10 sm:px-8 sm:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-[700] tracking-[-0.03em] text-[#F5F3EE] text-[26px] sm:text-[30px]">Built for the Next Generation of Creators.</h2>
            <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-[1.65] text-white/50">
              Whether you want to create films, commercials, content, faceless videos, or build an AI-powered creative business, this cohort gives you the practical skills to do it.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30 sm:gap-x-8">
            {["Creators", "Filmmakers", "Entrepreneurs", "Marketers", "Designers", "Content Creators"].map((t, i, arr) => (
              <span key={t} className="inline-flex items-center gap-6">
                {t}
                {i < arr.length - 1 && <span className="hidden h-1 w-1 rounded-full bg-white/15 sm:inline-block" aria-hidden />}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problem ── */}
      <section className="bg-[#0A0A0A] py-14 sm:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="max-w-3xl">
            <h2 className="max-w-[20ch] font-[800] leading-[0.95] tracking-[-0.04em] text-[#F5F3EE] text-[30px] sm:text-[40px]">
              AI Video Is Moving Fast. Most Creators Are Still Watching From the Sidelines.
            </h2>
            <p className="mt-4 max-w-[58ch] text-[15px] leading-[1.7] text-white/50">
              The tools are evolving faster than traditional courses can keep up. Most people experiment randomly, jump between platforms, watch scattered tutorials, and never develop a reliable workflow. This cohort provides a structured path.
            </p>
          </div>
          <div className="mt-10 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3 sm:gap-8">
            {[
              { n: "01", title: "Stop Guessing", copy: "Understand which tools to use, when to use them, and how to combine them into a workflow that actually ships." },
              { n: "02", title: "Build Real Skills", copy: "Move beyond random clips and learn to create intentional, professional-quality projects with clear intent." },
              { n: "03", title: "Create Opportunities", copy: "Use your skills to create content, build a portfolio, offer services, or launch a new AI-powered career." },
            ].map((c) => (
              <div key={c.n} className="relative border-l border-white/10 pl-6 sm:pl-7">
                <span className="font-[800] tracking-[-0.04em] text-white/12 text-[42px] leading-none" aria-hidden>
                  {c.n}
                </span>
                <h3 className="mt-2 text-[15px] font-semibold tracking-[-0.01em] text-[#F5F3EE]">{c.title}</h3>
                <p className="mt-2 text-[14px] leading-[1.65] text-white/50">{c.copy}</p>
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
            <h2 className="mt-3 font-[800] leading-[0.95] tracking-[-0.04em] text-[#F5F3EE] text-[30px] sm:text-[40px]">From Your First Prompt to Your Final Production.</h2>
          </div>

          <div className="mt-10 space-y-[1px] overflow-hidden rounded-[20px] border border-white/10 bg-white/10">
            {CURRICULUM.map((m) => (
              <div key={m.n} className="grid gap-6 bg-[#141414] p-6 sm:grid-cols-[88px_1fr_1.1fr] sm:p-8">
                <span className="font-[800] tracking-[-0.04em] text-white/14 text-[36px] leading-none">{m.n}</span>
                <div>
                  <h3 className="text-[16px] font-semibold leading-[1.25] tracking-[-0.015em] text-[#F5F3EE] sm:text-[18px]">{m.title}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-white/50">{m.copy}</p>
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
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="font-[800] tracking-[-0.04em] text-[#F5F3EE] text-[30px] sm:text-[40px]">You Won&apos;t Just Learn. You&apos;ll Create.</h2>
              <p className="mt-3 text-[15px] leading-[1.65] text-white/50">
                Throughout the cohort, you&apos;ll work on projects designed to give you real creative experience and portfolio-worthy work.
              </p>
            </div>
            <a
              href="#pricing"
              className="hidden items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-2.5 text-xs font-medium text-white/70 hover:border-white/20 hover:text-white sm:inline-flex"
            >
              Build your portfolio <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Category cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROJECTS.map((p) => (
              <div key={p.title} className="rounded-[16px] border border-white/10 bg-[#141414] p-6">
                <h3 className="text-sm font-semibold tracking-[-0.01em] text-[#F5F3EE]">{p.title}</h3>
                <p className="mt-2 text-[13px] leading-[1.6] text-white/50">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Portfolio masonry — uses real portfolio videos */}
          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">Portfolio — Selected Work</h3>
              <span className="text-xs text-white/30">{PROJECT_VIDEOS.length + INSTAGRAM_UGC.length} pieces</span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...PROJECT_VIDEOS, ...INSTAGRAM_UGC.slice(0, 3)].map((s) => {
                const isIg = "brand" in s;
                const src = (s as unknown as { src: string }).src;
                const poster = (s as unknown as { poster?: string }).poster;
                const title = (s as unknown as { title: string }).title;
                const desc = (s as unknown as { description?: string; desc?: string }).description ?? (s as unknown as { desc?: string }).desc ?? "";
                return (
                  <div key={title + src} className="group relative overflow-hidden rounded-[16px] border border-white/10 bg-[#141414]">
                    <div className="relative aspect-[9/12] overflow-hidden bg-black sm:aspect-[4/3]">
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        poster={poster}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                      >
                        <source src={src} type="video/mp4" />
                      </video>
                      <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur">
                        {isIg ? "Premium UGC" : "Studio Work"}
                      </span>
                      <span className="absolute bottom-3 left-3 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-[#0A0A0A]">Play</span>
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-semibold tracking-[-0.01em] text-[#F5F3EE]">{title}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-[1.5] text-white/45">{String(desc).slice(0, 110)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Instagram UGC strip — the 5 premium ads */}
          <div className="mt-10 rounded-[20px] border border-white/10 bg-[#141414] p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#F5F3EE]">Instagram — 5 Premium UGC Ads</h3>
                <p className="mt-1.5 max-w-xl text-[13px] leading-[1.6] text-white/45">
                  Pulled from Instagram&apos;s best-performing UGC. These 5 concepts are rebuilt as premium AI UGC ads and included with the portfolio work above — same workflow, new brief.
                </p>
              </div>
              <span className="rounded-full border border-[#FF4D12]/30 bg-[#FF4D12]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-[#FF4D12]">Included</span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-5">
              {INSTAGRAM_UGC.map((u) => (
                <div key={u.id} className="overflow-hidden rounded-[14px] border border-white/10 bg-black">
                  <div className="relative aspect-[9/16] overflow-hidden">
                    <video autoPlay loop muted playsInline preload="metadata" poster={u.poster} className="h-full w-full object-cover">
                      <source src={u.src} type="video/mp4" />
                    </video>
                    <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-1 text-[10px] font-bold text-[#0A0A0A]">{u.tag}</span>
                  </div>
                  <div className="bg-[#0A0A0A] p-3">
                    <p className="text-[12px] font-semibold leading-[1.3] text-[#F5F3EE]">{u.title}</p>
                    <p className="mt-1 text-[11px] leading-[1.4] text-white/40">{u.brand}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-center text-[11px] text-white/25">Instagram sources are placeholders using portfolio verticals — replace with your 5 selected Instagram embeds when ready.</p>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-[#0A0A0A] py-14 sm:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-[800] tracking-[-0.04em] text-[#F5F3EE] text-[28px] sm:text-[36px]">How the Cohort Works</h2>
          </div>
          <div className="relative mt-10 grid gap-[1px] overflow-hidden rounded-[20px] border border-white/10 bg-white/10 sm:grid-cols-4">
            {[
              { step: "01", title: "Join the Cohort", copy: "Secure your spot before enrollment closes." },
              { step: "02", title: "Learn Live", copy: "Follow the structured lessons and cohort experience." },
              { step: "03", title: "Build", copy: "Complete practical exercises and real-world projects." },
              { step: "04", title: "Launch", copy: "Leave with skills, workflows, projects and a clearer path." },
            ].map((s) => (
              <div key={s.step} className="bg-[#141414] p-7 sm:p-8">
                <span className="text-[11px] font-semibold tracking-[0.18em] text-[#FF4D12]">{s.step}</span>
                <h3 className="mt-2 text-[15px] font-semibold text-[#F5F3EE]">{s.title}</h3>
                <p className="mt-2 text-[13px] leading-[1.6] text-white/50">{s.copy}</p>
              </div>
            ))}
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
            <div
              className="hidden h-full w-full items-center justify-center bg-[radial-gradient(60%_60%_at_50%_30%,rgba(255,77,18,0.18),transparent_60%)] p-8 text-center"
              style={{ display: "none" }}
            >
              <div>
                <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white text-[22px] font-extrabold text-[#0A0A0A]">SA</span>
                <p className="mt-4 text-sm font-medium text-white/60">Shedrack Akue — Founder, Wisnotech</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">Instructor</p>
            <h2 className="mt-3 font-[800] leading-[0.95] tracking-[-0.04em] text-[#F5F3EE] text-[30px] sm:text-[38px]">Learn From Someone Actually Building With AI.</h2>
            <p className="mt-4 text-[15px] leading-[1.65] text-white/55">
              Wisnotech is built by a working studio — not a theory channel. Every workflow in the cohort is the same one used for real client work, from UGC ads to cinematic campaigns.
            </p>
            <p className="mt-3 text-[15px] leading-[1.65] text-white/55">
              You learn the decisions, the prompts, the edits and the taste that separates random clips from work a brand will pay for.
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

      {/* ── Testimonials ── */}
      <section className="bg-[#0A0A0A] py-14 sm:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <h2 className="font-[700] tracking-[-0.03em] text-[#F5F3EE] text-[22px] sm:text-[26px]">What Students Say</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-[16px] border border-white/10 bg-[#141414] p-6 sm:p-7">
                <p className="font-[Instrument_Serif] text-[18px] leading-[1.45] text-[#F5F3EE]">“{t.quote}”</p>
                <p className="mt-4 text-xs font-medium tracking-[0.06em] text-white/35">
                  — {t.name} · {t.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="scroll-mt-20 bg-[#0A0A0A] py-14 sm:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-[800] tracking-[-0.04em] text-[#F5F3EE] text-[30px] sm:text-[40px]">Invest in the Skill That&apos;s Changing Video.</h2>
            <p className="mt-3 text-[15px] leading-[1.6] text-white/50">One cohort. Practical training. Real projects.</p>
          </div>

          <div className="mx-auto mt-8 flex justify-center">
            <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur">
              {(["USD", "NGN"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurr(c)}
                  className={`rounded-full px-5 py-2 text-xs font-semibold tracking-[0.08em] transition-all ${currency === c ? "bg-white text-[#0A0A0A] shadow" : "text-white/60 hover:text-white"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Tiered pricing — Basic / Premium / Advanced (tools) / One-on-One (tools + 1:1) */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`relative flex flex-col overflow-hidden rounded-[22px] border bg-[#141414] p-6 sm:p-7 ${
                  tier.featured ? "border-[#FF4D12]/30 shadow-[0_24px_64px_-24px_rgba(255,77,18,0.45)]" : "border-white/10"
                }`}
              >
                {tier.featured && (
                  <span className="absolute right-4 top-4 rounded-full bg-[#FF4D12] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">Most Popular</span>
                )}
                {tier.includesTools && (
                  <span className={`absolute left-4 top-4 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${tier.featured ? "border-white/15 bg-white/10 text-white/80" : "border-[#FF4D12]/30 bg-[#FF4D12]/10 text-[#FF4D12]"}`}>
                    Includes Tools
                  </span>
                )}
                <div className={tier.includesTools ? "mt-8" : tier.featured ? "mt-8" : ""}>
                  <h3 className="text-[18px] font-bold tracking-[-0.02em] text-[#F5F3EE]">{tier.name}</h3>
                  <p className="mt-1 text-xs leading-[1.5] text-white/45">{tier.tagline}</p>
                </div>

                <div className="mt-5 flex items-baseline gap-2">
                  <span className="font-[800] tracking-[-0.04em] text-[#F5F3EE] text-[34px] leading-none">
                    {currency === "USD" ? `$${tier.priceUSD}` : formatNaira(tier.priceNGN)}
                  </span>
                  <span className="text-[10px] font-semibold tracking-[0.08em] text-white/30">ONE-TIME</span>
                </div>

                <ul className="mt-5 flex-1 space-y-2.5 border-t border-white/10 pt-5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-[12.5px] leading-[1.5] text-white/65">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FF4D12]" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={ACADEMY.ctaApply}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById("contact");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                    else window.location.href = "/#contact";
                  }}
                  className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold transition-all ${
                    tier.featured
                      ? "bg-[#FF4D12] text-white shadow-[0_12px_32px_-16px_rgba(255,77,18,0.6)] hover:bg-[#E84510]"
                      : tier.id === "oneonone"
                        ? "bg-white text-[#0A0A0A] hover:bg-zinc-100"
                        : "border border-white/15 bg-white/[0.04] text-white hover:border-white/25 hover:bg-white/[0.07]"
                  }`}
                >
                  {tier.cta} <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-[1.6] text-white/30">
            {ACADEMY.seats} seats per cohort · Ends {ACADEMY.deadline} · Tools included only with Advanced & One-on-One
          </p>

          <div className="mx-auto mt-6 flex flex-wrap justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.12em] text-white/25">
            <span className="inline-flex items-center gap-2"><Clock className="h-3.5 w-3.5" />6 weeks</span>
            <span className="h-3 w-px bg-white/10" aria-hidden />
            <span className="inline-flex items-center gap-2"><Users className="h-3.5 w-3.5" />Live cohort</span>
            <span className="h-3 w-px bg-white/10" aria-hidden />
            <span className="inline-flex items-center gap-2"><Sparkles className="h-3.5 w-3.5" />Certificate</span>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="scroll-mt-20 bg-[#0A0A0A] py-14 sm:py-20">
        <div className="mx-auto max-w-[760px] px-5 sm:px-8">
          <h2 className="font-[800] tracking-[-0.04em] text-[#F5F3EE] text-[28px] sm:text-[34px]">Questions, Answered.</h2>
          <div className="mt-8 divide-y divide-white/10 overflow-hidden rounded-[16px] border border-white/10 bg-[#141414]">
            {FAQS.map((f, i) => (
              <div key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                  aria-expanded={openFaq === i}
                >
                  <span className="text-[14px] font-medium leading-[1.4] tracking-[-0.01em] text-[#F5F3EE] sm:text-[15px]">{f.q}</span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-white/60 transition-all ${openFaq === i ? "rotate-45 border-[#FF4D12]/40 bg-[#FF4D12]/10 text-[#FF4D12]" : "border-white/15"}`}
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${openFaq === i ? "rotate-180" : ""}`} aria-hidden />
                  </span>
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

      {/* ── Final CTA ── */}
      <section className="bg-[#0A0A0A] py-14 sm:py-24">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#141414] px-6 py-12 text-center sm:px-12 sm:py-16">
            <h2 className="mx-auto max-w-[16ch] font-[800] leading-[0.92] tracking-[-0.04em] text-[#F5F3EE] text-[32px] sm:text-[46px]">The Future of Video Won&apos;t Wait.</h2>
            <p className="mx-auto mt-4 max-w-[48ch] text-[15px] leading-[1.6] text-white/50">
              The question is whether you&apos;ll simply watch the industry change — or learn how to create inside it.
            </p>
            <a
              href={ACADEMY.ctaApply}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#FF4D12] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_16px_40px_-16px_rgba(255,77,18,0.6)] hover:bg-[#E84510]"
            >
              Join the Next Cohort <ArrowRight className="h-4 w-4" />
            </a>
            <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.14em] text-white/25">Limited seats. Serious creators only.</p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 bg-[#050505]">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-8 px-5 py-10 sm:px-8 sm:flex-row sm:items-start sm:justify-between sm:py-12">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm leading-[1.6] text-white/40">Practical AI video education for the next generation of creators.</p>
          </div>
          <div className="flex gap-10 text-sm">
            <div className="space-y-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/30">Navigate</p>
              <a href="#curriculum" className="block text-white/60 hover:text-white">
                Curriculum
              </a>
              <a href="#projects" className="block text-white/60 hover:text-white">
                Projects
              </a>
              <a href="#pricing" className="block text-white/60 hover:text-white">
                Pricing
              </a>
              <a href="#faq" className="block text-white/60 hover:text-white">
                FAQ
              </a>
            </div>
            <div className="space-y-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/30">Wisnotech</p>
              <a href="/" className="block text-white/60 hover:text-white">
                Home
              </a>
              <a href="/portfolio" className="block text-white/60 hover:text-white">
                Studio
              </a>
              <a href="/privacy" className="block text-white/60 hover:text-white">
                Privacy
              </a>
              <a href="/terms" className="block text-white/60 hover:text-white">
                Terms
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1160px] items-center justify-between px-5 py-6 sm:px-8">
            <p className="text-xs text-white/25">© {new Date().getFullYear()} Wisnotech. All rights reserved.</p>
            <p className="hidden text-xs text-white/25 sm:block">Built for creators, by a studio.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
