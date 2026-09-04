import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  ArrowRight,
  ArrowDown,
  Briefcase,
  Check,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Code2,
  Menu,
  Play,
  Plus,
  X,
} from "lucide-react";
import Logo from "./Logo";
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

// Hero slider — best cinematic samples
const HERO_SLIDES = [
  { src: "/portfolio/videos/dune-trailer.mp4", poster: "/portfolio/thumbs/dune-trailer.jpg", label: "A Desert Epic" },
  { src: "/wino/videos/seedance-demo.mp4", poster: "/wino/thumbs/seedance-demo.jpg", label: "The Wide Frame" },
  { src: "/portfolio/videos/web-demo.mp4", poster: "/portfolio/thumbs/web-demo.jpg", label: "Cinema Without Cameras" },
  { src: "/wino/videos/johnwick-character.mp4", poster: "/wino/thumbs/johnwick-character.jpg", label: "Unbroken" },
];

// Cinematic / film / character videos for the Hollywood section (no UGC)
const CINEMATIC_VIDEOS = PORTFOLIO_SAMPLES.filter(
  (s) => s.type === "video" && s.published && ["cinematic", "film", "character"].includes(s.category)
);

// Showcase videos for the "Watch what you'll learn to make" section
const SHOWCASE_VIDEOS = PUBLISHED_VIDEOS.slice(2, 8);

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
} as const;

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
  const [slideIndex, setSlideIndex] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);
  const preview = usePreview("masterclass");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const slideTotal = HERO_SLIDES.length;

  const goSlide = (next: number) => {
    setSlideIndex(((next % slideTotal) + slideTotal) % slideTotal);
    setSlideProgress(0);
  };

  const onSlideTime = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const el = e.currentTarget;
    if (el.dataset.slide !== String(slideIndex)) return;
    setSlideProgress(el.duration ? el.currentTime / el.duration : 0);
  };

  const onSlideEnded = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (e.currentTarget.dataset.slide === String(slideIndex)) goSlide(slideIndex + 1);
  };

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
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-white">
      {/* Scroll progress */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-[#3b7bff] via-[#7aa5ff] to-[#3b7bff]"
        aria-hidden
      />

      {/* Cinematic texture */}
      <div aria-hidden className="film-grain" />
      <div aria-hidden className="film-vignette" />

      {/* ── Header ── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#080808]/85 backdrop-blur-md">
        <nav className="container-wide flex h-16 items-center justify-between py-4" aria-label="Masterclass navigation">
          <a href="/masterclass" aria-label="Masterclass home" className="shrink-0">
            <Logo />
          </a>
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>
          <a
            href={PAYSTACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group hidden items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-[#080808] transition-all hover:bg-zinc-100 md:inline-flex"
          >
            Secure Your Seat
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </a>
          <button
            type="button"
            onClick={() => setMobileNav((v) => !v)}
            aria-label="Toggle menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/80 backdrop-blur md:hidden"
          >
            {mobileNav ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </nav>
        <AnimatePresence>
          {mobileNav && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="border-t border-white/10 bg-[#080808] px-5 py-6 md:hidden"
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
                  className="btn-primary mt-3"
                >
                  Secure Your Seat
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ═══════════════════════════════════════════════════════════
          HERO — Video Slider
      ═══════════════════════════════════════════════════════════ */}
      <section id="overview" className="relative overflow-hidden pt-36 pb-24 sm:pt-40">
        {/* Background video slider */}
        <div aria-hidden className="absolute inset-0 opacity-45">
          <AnimatePresence initial={false}>
            <motion.video
              key={slideIndex}
              data-slide={slideIndex}
              autoPlay
              muted
              playsInline
              preload="auto"
              src={HERO_SLIDES[slideIndex].src}
              poster={HERO_SLIDES[slideIndex].poster}
              onTimeUpdate={onSlideTime}
              onEnded={onSlideEnded}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 0.9, ease: "easeInOut" }, scale: { duration: 6, ease: "linear" } }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
        </div>
        <div aria-hidden className="absolute inset-0 bg-[#080808]/50" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 35%, transparent 0%, rgba(8,8,8,0.55) 70%, #080808 100%)" }}
        />

        {/* Slider controls — bottom right */}
        <div className="absolute bottom-5 right-4 z-20 flex flex-col items-end gap-2.5 sm:bottom-8 sm:right-8">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-2 py-1.5 backdrop-blur">
            <button
              type="button"
              onClick={() => goSlide(slideIndex - 1)}
              aria-label="Previous clip"
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Hero clips">
              {HERO_SLIDES.map((s, i) => (
                <button
                  key={s.src}
                  type="button"
                  role="tab"
                  aria-selected={i === slideIndex}
                  aria-label={s.label}
                  onClick={() => goSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === slideIndex ? "w-5 bg-white" : "w-1.5 bg-white/35 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => goSlide(slideIndex + 1)}
              aria-label="Next clip"
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <div className="flex items-center gap-2.5">
            <p className="text-xs text-white/70">
              {HERO_SLIDES[slideIndex].label}
              <span className="text-white/40"> · {slideIndex + 1}/{slideTotal}</span>
            </p>
            <div className="h-0.5 w-20 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-neon transition-[width] duration-200"
                style={{ width: `${Math.min(100, Math.max(0, slideProgress * 100))}%` }}
              />
            </div>
          </div>
        </div>

        <div className="container-wide relative z-10 mx-auto max-w-3xl text-center">
          <motion.div {...fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-white/70 backdrop-blur">
              Tech Bootcamp — Wisnotech School of Technology
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp}
            className="mt-8 text-[clamp(2.75rem,7vw,4.75rem)] font-bold leading-[1.03] tracking-tight"
          >
            <span className="text-shimmer">The AI Creator Masterclass.</span>
            <br />
            Create, Build &amp; Sell.
          </motion.h1>

          <motion.p {...fadeUp} className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Learn how to use AI to create cinematic entertainment, build real software, launch digital products &amp;
            turn your skills into a business.
          </motion.p>

          <motion.ul {...fadeUp} className="mx-auto mt-6 max-w-xl space-y-2 text-left text-[15px] leading-relaxed text-white/65">
            <li className="flex gap-2.5"><span aria-hidden>🎬</span> Create cinematic AI movies, scenes and entertainment.</li>
            <li className="flex gap-2.5"><span aria-hidden>💻</span> Build real websites, SaaS products and applications.</li>
            <li className="flex gap-2.5"><span aria-hidden>📱</span> Create mobile applications.</li>
            <li className="flex gap-2.5"><span aria-hidden>🤖</span> Build AI agents that can perform useful tasks.</li>
            <li className="flex gap-2.5"><span aria-hidden>⚙️</span> Automate business processes.</li>
            <li className="flex gap-2.5"><span aria-hidden>💼</span> Package your AI skills into services.</li>
            <li className="flex gap-2.5"><span aria-hidden>💰</span> Turn what you learn into potential business opportunities.</li>
          </motion.ul>

          <motion.div {...fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href={PAYSTACK_URL} target="_blank" rel="noopener noreferrer" className="btn-primary group">
              Secure Your Seat — {formatNaira(d.pricing.early)}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
            </a>
            <a href="#videos" className="btn-secondary group">
              <Play className="h-4 w-4" aria-hidden />
              Watch the Work
            </a>
          </motion.div>

          <motion.div {...fadeUp} className="mx-auto mt-14 grid max-w-xl grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 backdrop-blur-xl">
              <p className="text-2xl font-bold text-white">Remote</p>
              <p className="mt-1 text-xs text-muted">&amp; Physical</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 backdrop-blur-xl">
              <p className="text-2xl font-bold text-white">Dec 2026</p>
              <p className="mt-1 text-xs text-muted">Starts then</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 backdrop-blur-xl">
              <p className="text-2xl font-bold text-white">Limited</p>
              <p className="mt-1 text-xs text-muted">Slots available</p>
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#080808]">
              Fee: {formatNaira(d.pricing.early)}
            </span>
            <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/50 line-through">
              Late: {formatNaira(d.pricing.late)}
            </span>
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#080808]">
              Save {formatNaira(d.pricing.save)}
            </span>
          </motion.div>
          <p className="mt-2 text-[11px] font-medium tracking-[0.06em] text-white/30">{d.pricing.deadlineNote}</p>
        </div>

        <motion.a
          href="#content"
          aria-label="Scroll to content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-white/40 transition-colors hover:text-white"
        >
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1 text-[10px] uppercase tracking-[0.3em]"
          >
            Scroll
            <ArrowDown className="h-4 w-4" aria-hidden />
          </motion.span>
        </motion.a>
      </section>

      <main>
        {/* ═══════════════════════════════════════════════════════════
            THE AI ERA IS CREATING A NEW KIND OF CREATOR
        ═══════════════════════════════════════════════════════════ */}
        <section id="content" className="section scroll-mt-20">
          <div className="container-wide">
            <div className="max-w-3xl">
              <p className="eyebrow">Why now</p>
              <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                The AI era is creating a new kind of creator.
              </h2>
            </div>
            <div className="prose-wisnotech mx-auto mt-10 max-w-3xl">
              <p>For years, the ability to create sophisticated entertainment or software was restricted by access. You needed expensive cameras. Large production crews. Professional studios. Visual-effects teams. Software developers. Designers. Editors. Technical specialists. And, most importantly, money.</p>
              <p>AI is beginning to change the economics of creation. A single skilled person can now sit behind a laptop and produce things that would have required an entire team only a few years ago.</p>
              <p>That doesn't mean AI makes expertise irrelevant.</p>
              <h3>It makes expertise more powerful.</h3>
              <p>The person who knows nothing about filmmaking and simply presses an AI generation button will struggle to produce consistently great work.</p>
              <p>But someone who understands:</p>
              <p><strong>Storytelling + directing + cinematography + prompting + visual consistency + editing + AI tools</strong></p>
              <p>can potentially produce work at a completely different level.</p>
              <p>The same applies to software. Anyone can ask AI to "build me an app." But someone who understands:</p>
              <p><strong>Product thinking + UX + architecture + AI coding + APIs + databases + debugging + deployment</strong></p>
              <p>can actually turn an idea into something people can use.</p>
              <h3>That's the difference we're teaching.</h3>
              <blockquote><p>Not AI consumption. <strong>AI creation.</strong></p></blockquote>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            THREE SKILLS. ONE BIG OPPORTUNITY.
        ═══════════════════════════════════════════════════════════ */}
        <section id="learn" className="section scroll-mt-20 bg-white/[0.02]">
          <div className="container-wide">
            <p className="eyebrow">The masterclass</p>
            <h2 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Three skills. One big opportunity.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
              The masterclass is built around three capabilities.
            </p>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {([
                { n: "01", label: "CREATE", icon: Clapperboard, title: "Hollywood-Style AI Movie Production", desc: "Learn how to use AI to produce professional visual content and cinematic entertainment." },
                { n: "02", label: "BUILD", icon: Code2, title: "Vibecoding & AI-Powered Asset Building", desc: "Learn how to turn ideas into real digital products, software, AI systems and applications." },
                { n: "03", label: "SELL", icon: Briefcase, title: "Building & Marketing an AI Agency", desc: "Learn how to package what you know into products, services and business opportunities." },
              ] as const).map((p) => (
                <motion.div key={p.n} {...fadeUp} className="card group relative p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05]">
                    <p.icon className="h-5 w-5 text-neon" aria-hidden />
                  </span>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-neon">{p.label}</p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{p.desc}</p>
                </motion.div>
              ))}
            </div>
            <div className="prose-wisnotech mx-auto mt-10 max-w-3xl">
              <p>Because knowing how to create something is valuable.</p>
              <p>Knowing how to build something is valuable.</p>
              <p><strong>But knowing how to create, build AND sell? That's where things become very interesting.</strong></p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            01 — HOLLYWOOD-STYLE AI MOVIE PRODUCTION
        ═══════════════════════════════════════════════════════════ */}
        <section className="section scroll-mt-20">
          <div className="container-wide">
            <div className="max-w-3xl">
              <p className="eyebrow">01</p>
              <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Hollywood-Style AI Movie Production
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted">The biggest opportunity in AI filmmaking may not be creating cheaper videos.</p>
              <p className="text-lg font-medium text-white/80">It may be creating an entirely new generation of filmmakers.</p>
            </div>
            <div className="prose-wisnotech mx-auto mt-10 max-w-3xl">
              <p>For decades, blockbuster filmmaking has been an industry of enormous budgets. Millions of dollars can disappear into locations, crews, equipment, sets, visual effects, post-production and logistics before an audience ever sees the finished movie.</p>
              <p>But AI is introducing another possibility:</p>
              <p><strong>What if creative capability becomes more important than production infrastructure?</strong></p>
              <p>What if a small team of exceptional AI filmmakers can achieve visual results that previously required much larger teams? What if one creator can operate across concept development, storyboarding, visual development, character creation, environment design, shot generation and post-production?</p>
              <p><strong>That's the opportunity we're preparing you for.</strong></p>
            </div>

            {/* Cinematic video grid — action films, characters, no UGC */}
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {CINEMATIC_VIDEOS.map((v) => (
                <motion.div key={v.id} {...fadeUp} className="card group overflow-hidden p-0">
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
                      {v.category}
                    </span>
                    <span className="absolute bottom-3 left-3 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-[#080808]">
                      Play
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-sm font-semibold tracking-tight text-white">{v.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{v.description.slice(0, 110)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CASE STUDY: TRANSFORMERS ── */}
        <section className="section scroll-mt-20 bg-white/[0.02]">
          <div className="container-wide">
            <div className="max-w-3xl">
              <p className="eyebrow">Case study</p>
              <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Transformers
              </h2>
            </div>
            <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
              <div className="card overflow-hidden p-0">
                <img
                  src="/assets/transformers-case-study.jpg"
                  alt="Transformers: Dark of the Moon — Case Study"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="prose-wisnotech">
                <p>Imagine trying to create something at the scale of a Transformers movie.</p>
                <p><strong>Transformers: Dark of the Moon</strong> reportedly had a production budget of approximately <strong>$195 million</strong> and ultimately generated more than <strong>$1.1 billion worldwide</strong>.</p>
                <p>That is an enormous entertainment business. But think about everything required to create a movie at that level. Massive visual effects. Digital characters. Explosions. Vehicles. Destroyed environments. Large-scale action. Complex camera movements. CGI. Physical production. Sound. Editing. Post-production. Hundreds of creative and technical decisions.</p>
                <p><strong>And behind all of it: an enormous amount of money.</strong></p>
              </div>
            </div>
            <div className="prose-wisnotech mx-auto mt-12 max-w-3xl">
              <p>Now imagine the direction the industry could move as AI becomes more capable.</p>
              <p>Not: <em>"AI will magically make every $200 million movie cost $200,000."</em> That's not realistic.</p>
              <p><strong>Instead: imagine AI becoming another layer of the production pipeline.</strong></p>
              <p>A powerful layer. A layer that allows a smaller number of highly skilled people to accomplish more. A layer that allows filmmakers to prototype scenes before expensive production. A layer that allows studios to explore multiple creative directions faster. A layer that allows independent creators to build worlds that would previously have been financially impossible.</p>
              <p><strong>The technology doesn't remove the need for talented people. It increases the value of people who know how to direct the technology.</strong></p>
            </div>
          </div>
        </section>

        {/* ── THE FUTURE OF HOLLYWOOD ── */}
        <section className="section scroll-mt-20">
          <div className="container-wide">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                The future of Hollywood may need a different kind of talent.
              </h2>
            </div>
            <div className="prose-wisnotech mx-auto mt-10 max-w-3xl">
              <p>Imagine a production company receives a brief: <em>"We need a cinematic 8-minute sci-fi sequence set in a futuristic African megacity."</em></p>
              <p>The traditional approach might involve: location scouting, set design, concept artists, 3D artists, VFX artists, cinematographers, actors, equipment, lighting, crew, post-production — and a long production timeline.</p>
              <p>Now imagine an AI-native production team. A small group of highly skilled creators can begin developing the world digitally. They can explore characters, costumes, architecture, vehicles, lighting, camera angles, environments, action sequences, visual styles, storyboards, shots — and iterate rapidly.</p>
              <blockquote>
                <p>The creative director still matters. The filmmaker still matters. The storyteller still matters. The human still matters.</p>
              </blockquote>
              <p>But the tools become dramatically more powerful.</p>
            </div>
          </div>
        </section>

        {/* ── WHERE AI MOVIE PRODUCTION BECOMES A CAREER ── */}
        <section className="section scroll-mt-20 bg-white/[0.02]">
          <div className="container-wide">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                This is where AI movie production becomes a career opportunity.
              </h2>
            </div>
            <div className="prose-wisnotech mx-auto mt-10 max-w-3xl">
              <p>Hollywood and other major entertainment companies don't simply need people who know how to generate an AI video. They need people who can produce <strong>usable entertainment</strong>.</p>
              <p>People who can understand a script and translate it into visual sequences. People who understand camera language. People who can maintain character identity across scenes. People who understand lighting. People who can control composition. People who can create believable environments. People who understand pacing. People who can direct AI models toward a specific creative result.</p>
              <p><strong>People who can take dozens of generated shots and turn them into a coherent sequence.</strong></p>
              <blockquote><p><strong>AI filmmakers.</strong></p></blockquote>
            </div>
          </div>
        </section>

        {/* ── DON'T BE THE PERSON WHO CAN ONLY GENERATE A COOL CLIP ── */}
        <section className="section scroll-mt-20">
          <div className="container-wide">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Don't be the person who can only generate a cool clip.
              </h2>
              <p className="mt-5 text-lg font-medium text-muted">Become the person who can produce an entire sequence.</p>
            </div>
            <div className="prose-wisnotech mx-auto mt-10 max-w-3xl">
              <p>There is a massive difference. Anyone can generate: <em>"A futuristic city with a spaceship."</em></p>
              <p>A professional creator needs to think: What is the establishing shot? Where is the camera? What lens language are we simulating? Where is the character? What happened in the previous shot? What happens next? How does the lighting remain consistent? How does the character remain recognizable? How do we make the environment believable? How do we make the audience feel something?</p>
              <p><strong>That's filmmaking. AI is simply becoming one of the most powerful tools available to the filmmaker.</strong></p>
            </div>
          </div>
        </section>

        {/* ── IMAGINE WHAT YOU COULD CREATE ── */}
        <section className="section scroll-mt-20 bg-white/[0.02]">
          <div className="container-wide">
            <p className="eyebrow">Possibilities</p>
            <h2 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Imagine what you could create.
            </h2>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                <motion.div key={item.title} {...fadeUp} className="card p-7">
                  <span className="text-2xl" aria-hidden>{item.emoji}</span>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.desc}</p>
                </motion.div>
              ))}
            </div>
            <p className="prose-wisnotech mx-auto mt-10 max-w-3xl">The possibilities are enormous. And we're still early.</p>
          </div>
        </section>

        {/* ── THE AI GOLD RUSH ── */}
        <section className="section scroll-mt-20">
          <div className="container-wide">
            <div className="max-w-3xl">
              <p className="eyebrow">Market timing</p>
              <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                The AI gold rush.
              </h2>
              <p className="mt-5 text-lg font-medium text-muted">Don't wait until the gold rush is over to start learning how to mine.</p>
            </div>
            <div className="prose-wisnotech mx-auto mt-10 max-w-3xl">
              <p>Every major technological shift creates an early period where a relatively small number of people understand how to use the new tools effectively. Right now, millions of people are experimenting with AI. But experimentation isn't mastery.</p>
              <p>There is a difference between: <strong>"I know how to use an AI video generator."</strong> and: <strong>"I can take a creative brief and produce a polished cinematic sequence."</strong></p>
              <p>The second person has a much more valuable skill.</p>
              <p><strong>So the goal isn't simply to start. The goal is to become GOOD.</strong></p>
              <p>Good enough that when a studio, production company, agency or brand needs someone who understands AI filmmaking... your portfolio gives them a reason to call you.</p>
            </div>
          </div>
        </section>

        {/* ── HOW MUCH COULD AN AI CREATOR MAKE? ── */}
        <section className="section scroll-mt-20 bg-white/[0.02]">
          <div className="container-wide">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                How much could an AI creator make?
              </h2>
            </div>
            <div className="prose-wisnotech mx-auto mt-10 max-w-3xl">
              <p>Let's be realistic. There is no guaranteed salary for learning AI filmmaking. Your income will depend on your portfolio, skill level, location, specialization, reputation, client and ability to deliver commercially useful work.</p>
              <p>But the market is already beginning to show examples of paid AI creative work. Some 2026 AI Artist opportunities have advertised rates around <strong>$500–$800 per day</strong> for experienced creators. Specialized AI/VFX production roles have also advertised annual compensation in the <strong>$120,000–$140,000 range</strong>.</p>
              <p>These are examples of market opportunities — <strong>not promises of what you'll earn after this masterclass.</strong></p>
              <p>But they illustrate something important: <strong>AI filmmaking is moving from experimentation toward professional work.</strong></p>
              <p>And imagine what an exceptional AI filmmaker could potentially command when they can do far more than generate clips. Someone who can conceptualize, direct, generate, maintain consistency, edit, produce, deliver.</p>
              <p><strong>That's a professional.</strong></p>
            </div>
          </div>
        </section>

        {/* ── AND THIS IS WHY YOU SHOULD START NOW ── */}
        <section className="section scroll-mt-20">
          <div className="container-wide">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                And this is why you should start now.
              </h2>
            </div>
            <div className="prose-wisnotech mx-auto mt-10 max-w-3xl">
              <p>Don't wait until every major studio has an AI production department.</p>
              <p>Don't wait until thousands of people are calling themselves AI filmmakers.</p>
              <p>Don't wait until you need the skill before you start learning it.</p>
              <p><strong>Build your portfolio now. Develop your eye now. Learn cinematic prompting now. Learn AI production workflows now. Create your first short film now.</strong></p>
              <p>Experiment. Fail. Improve. Create again.</p>
              <p><strong>Because when the market becomes much larger... you'll already have experience.</strong></p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            02 — VIBECODING & AI-POWERED PRODUCT BUILDING
        ═══════════════════════════════════════════════════════════ */}
        <section className="section scroll-mt-20 bg-white/[0.02]">
          <div className="container-wide">
            <div className="max-w-3xl">
              <p className="eyebrow">02</p>
              <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Vibecoding &amp; AI-Powered Asset Building
              </h2>
              <p className="mt-5 text-lg font-medium text-muted">What if you could turn your ideas into working software?</p>
            </div>
            <div className="prose-wisnotech mx-auto mt-10 max-w-3xl">
              <p>You don't need to begin by becoming a traditional software engineer. You need to understand how modern AI-assisted development works.</p>
              <p>You'll learn how to take an idea and move through:</p>
            </div>
            <div className="mx-auto mt-6 flex max-w-xl flex-col items-start gap-2">
              {["IDEA — What are you actually trying to solve?", "BLUEPRINT — Who is it for? What does it need to do?", "BUILD — Use AI-powered coding tools to begin creating the product.", "TEST — Find what's broken.", "DEBUG — Understand problems and work with AI to fix them.", "IMPROVE — Make the product better.", "DEPLOY — Put it online.", "LAUNCH — Get it in front of real users."].map((step) => (
                <div key={step} className="flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm text-white/65">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-neon/50" />
                  {step}
                </div>
              ))}
            </div>
            <div className="mx-auto mt-12 max-w-3xl">
              <h3 className="text-2xl font-semibold tracking-tight text-white">Build real products. Not just landing pages.</h3>
              <p className="mt-3 text-lg leading-relaxed text-muted">You'll learn the foundations behind:</p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { title: "SaaS Products", desc: "Software people can access online and potentially pay for monthly." },
                  { title: "AI Applications", desc: "Applications that use AI to generate, analyze, summarize, automate or assist." },
                  { title: "Dashboards", desc: "Interfaces that allow users to manage information and interact with systems." },
                  { title: "Mobile Apps", desc: "Take ideas toward functional mobile applications." },
                  { title: "AI Agents", desc: "Systems that can perform multi-step tasks and interact with tools." },
                  { title: "Business Automations", desc: "Systems that connect different services and perform repetitive work automatically." },
                ].map((item) => (
                  <div key={item.title} className="card p-6">
                    <h4 className="text-lg font-semibold tracking-tight text-white">{item.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            03 — BUILD AN AI-POWERED BUSINESS
        ═══════════════════════════════════════════════════════════ */}
        <section className="section scroll-mt-20">
          <div className="container-wide">
            <div className="max-w-3xl">
              <p className="eyebrow">03</p>
              <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Build an AI-Powered Business
              </h2>
              <p className="mt-5 text-lg font-medium text-muted">Because a skill becomes much more valuable when you know how to sell the outcome.</p>
            </div>
            <div className="prose-wisnotech mx-auto mt-10 max-w-3xl">
              <p>You can learn AI for years. But if nobody knows what you can do... it doesn't become a business.</p>
              <p>Inside the masterclass, you'll learn how to turn your capabilities into offers.</p>
            </div>
            <div className="mx-auto mt-8 grid max-w-3xl gap-5 sm:grid-cols-2">
              {[
                { skill: "AI video production", offer: "Offer cinematic content production to brands." },
                { skill: "AI product commercials", offer: "Create advertising assets for businesses." },
                { skill: "AI automation", offer: "Help businesses reduce repetitive manual work." },
                { skill: "AI agents", offer: "Build systems that handle specific business tasks." },
                { skill: "AI software development", offer: "Build MVPs and internal tools." },
                { skill: "AI content systems", offer: "Help businesses produce content at scale." },
              ].map((item) => (
                <div key={item.skill} className="card p-6">
                  <p className="text-lg font-semibold tracking-tight text-white">{item.skill}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.offer}</p>
                </div>
              ))}
            </div>
            <div className="prose-wisnotech mx-auto mt-10 max-w-3xl">
              <p>The goal isn't to become a person who says: <em>"I know AI."</em></p>
              <p><strong>The goal is to become someone who can say: "I can solve this problem using AI."</strong></p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            YOU WON'T LEAVE WITH JUST NOTES
        ═══════════════════════════════════════════════════════════ */}
        <section id="projects" className="section scroll-mt-20 bg-white/[0.02]">
          <div className="container-wide">
            <div className="max-w-2xl">
              <p className="eyebrow">Projects</p>
              <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                You won't leave with just notes.
              </h2>
              <p className="mt-3 text-lg font-medium text-muted">You'll build.</p>
              <p className="mt-3 text-lg leading-relaxed text-muted">
                The masterclass includes practical projects designed to give you actual experience.
              </p>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { n: "01", title: "Build an AI-Powered SaaS", desc: "Create a functional web application with auth, dashboard, AI, APIs and product logic." },
                { n: "02", title: "Build an Autonomous AI Agent", desc: "Create a system that can understand instructions, use tools, perform multiple steps and produce results." },
                { n: "03", title: "Build an AI Automation", desc: "Connect tools and services together so that a workflow can happen automatically." },
                { n: "04", title: "Build an AI-Powered Mobile App", desc: "Take an idea from concept through user flow, interface, features, testing and functional product." },
                { n: "05", title: "Build Your Own Idea", desc: "Bring an idea you've been thinking about. Your idea becomes your classroom." },
              ].map((p) => (
                <motion.div key={p.n} {...fadeUp} className="card p-7">
                  <span className="outline-text text-5xl font-bold">{p.n}</span>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-white">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            THE CURRICULUM
        ═══════════════════════════════════════════════════════════ */}
        <section id="curriculum" className="section scroll-mt-20">
          <div className="container-wide">
            <div className="max-w-2xl">
              <p className="eyebrow">Curriculum</p>
              <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                From your first prompt to your final product.
              </h2>
            </div>
            <div className="mt-12 grid gap-5 lg:grid-cols-2">
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
                <motion.div key={m.n} {...fadeUp} className="card flex gap-6 p-7">
                  <span className="outline-text shrink-0 text-5xl font-bold">{m.n}</span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-white">{m.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{m.desc}</p>
                    <ul className="mt-4 space-y-2">
                      {m.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-white/70">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neon" aria-hidden />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            THE TOOLS
        ═══════════════════════════════════════════════════════════ */}
        <section id="tools" className="section scroll-mt-20 bg-white/[0.02]">
          <div className="container-wide">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Included</p>
              <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                The tools.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted">
                Learn with modern AI tools. You'll get hands-on experience with tools such as:
              </p>
            </div>
            <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-3">
              {TOOLS.map((t) => (
                <motion.div key={t.name} {...fadeUp} className="card overflow-hidden p-0">
                  <div className="aspect-square overflow-hidden bg-black">
                    <img src={t.img} alt={t.name} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-7">
                    <h3 className="text-lg font-semibold tracking-tight text-white">{t.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{t.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-neon/25 bg-neon/10 px-3 py-1 text-xs font-semibold text-neon">
                      Free to use
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mx-auto mt-10 grid max-w-3xl gap-5 sm:grid-cols-2">
              <div className="card p-7 text-center">
                <h3 className="text-lg font-semibold tracking-tight text-white">The Important Part:</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Tools will change. New models will appear. Platforms will improve. Some tools will disappear.
                </p>
                <p className="mt-2 text-sm font-medium text-white/80">But the ability to understand the workflow remains. That's what we're teaching.</p>
              </div>
              <div className="card p-7 text-center">
                <h3 className="text-lg font-semibold tracking-tight text-white">Your Own AI Video Generation Access</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Every student gets access to a paid AI video-generation tool for use during the masterclass. Generate. Direct. Iterate. Compare. Improve.
                </p>
                <p className="mt-2 text-sm font-medium text-white/80">Your goal isn't to make one cool AI clip. Your goal is to develop the ability to consistently create.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── "I DON'T KNOW HOW TO CODE." ── */}
        <section className="section scroll-mt-20">
          <div className="container-wide">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                "I don't know how to code."
              </h2>
              <p className="mt-5 text-lg font-medium text-muted">That's okay.</p>
            </div>
            <div className="prose-wisnotech mx-auto mt-10 max-w-3xl">
              <p>But let's be honest about something. AI doesn't eliminate the need to think. It doesn't mean you can type: <em>"Build Facebook."</em> and magically receive Facebook.</p>
              <p>You still need to understand: What you're building. Who it's for. What it should do. How the pieces connect. How to identify problems. How to test the result.</p>
              <p>That's why we don't teach AI as a magic button.</p>
              <h3>We teach you how to work WITH it.</h3>
              <p>You don't need years of professional programming experience to start. But you need curiosity. You need patience. And you need the willingness to troubleshoot when something doesn't work.</p>
              <p><strong>If you're willing to learn, AI can become an extremely powerful development partner.</strong></p>
            </div>
          </div>
        </section>

        {/* ── "WHAT IF I'M A COMPLETE BEGINNER?" ── */}
        <section className="section scroll-mt-20 bg-white/[0.02]">
          <div className="container-wide">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                "What if I'm a complete beginner?"
              </h2>
            </div>
            <div className="prose-wisnotech mx-auto mt-10 max-w-3xl">
              <p>The masterclass is designed to take you through the process step by step. You don't need to arrive knowing everything. In fact, you're expected not to.</p>
              <p>What matters is that you're prepared to:</p>
            </div>
            <div className="mx-auto mt-4 flex max-w-xl flex-wrap gap-2">
              {["Learn.", "Experiment.", "Build.", "Break things.", "Fix things.", "Build again."].map((s) => (
                <span key={s} className="rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/65">{s}</span>
              ))}
            </div>
            <p className="prose-wisnotech mx-auto mt-6 max-w-3xl">Because that's how real skills are developed.</p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            WHO IS THIS MASTERCLASS FOR?
        ═══════════════════════════════════════════════════════════ */}
        <section className="section scroll-mt-20">
          <div className="container-wide">
            <p className="eyebrow">Who it's for</p>
            <h2 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Who is this masterclass for?
            </h2>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {AUDIENCES.map((a) => (
                <motion.div key={a.title} {...fadeUp} className="card p-7">
                  <span className="text-2xl" aria-hidden>{a.emoji}</span>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-white">{a.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{a.desc}</p>
                </motion.div>
              ))}
            </div>
            <div className="prose-wisnotech mx-auto mt-10 max-w-3xl">
              <p>You don't have to know exactly what you want to build yet.</p>
              <p><strong>You just need to be willing to start.</strong></p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            INSTRUCTOR
        ═══════════════════════════════════════════════════════════ */}
        <section className="section scroll-mt-20 bg-white/[0.02]">
          <div className="container-wide">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="card overflow-hidden p-0">
                <img
                  src="/assets/shedrack-akue-640.jpg"
                  alt="Shedrack Akue — Founder, Wisnotech"
                  className="h-full w-full object-cover object-top lg:aspect-[4/4.2]"
                  loading="lazy"
                  onError={(e) => ((e.currentTarget.style.display = "none"), ((e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex"))}
                />
                <div className="hidden h-full w-full items-center justify-center p-8 text-center" style={{ display: "none" }}>
                  <div>
                    <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl font-extrabold text-[#080808]">SA</span>
                    <p className="mt-4 text-sm font-medium text-muted">Shedrack Akue — Founder, Wisnotech</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="eyebrow">Instructor</p>
                <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-[38px]">
                  Learn from someone who actually builds with AI.
                </h2>
                <p className="prose-wisnotech mt-5">
                  Wisnotech is a working AI, software and automation studio. The workflows taught inside this masterclass are based on the same kind of AI production, software-building and automation workflows used in real projects.
                </p>
                <p className="prose-wisnotech">
                  The goal isn't to teach you theory for theory's sake. It's to show you how these tools can actually be used to create.
                </p>
                <div className="mt-6 flex items-center gap-4 border-t border-white/10 pt-6">
                  <div>
                    <p className="text-sm font-semibold text-white">Shedrack Akue</p>
                    <p className="text-xs tracking-[0.08em] text-white/40">Founder, Wisnotech</p>
                  </div>
                  <a
                    href="/portfolio"
                    className="btn-secondary ml-auto text-sm"
                  >
                    Explore My Work <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── THE DIFFERENCE BETWEEN KNOWING AI AND KNOWING HOW TO USE AI ── */}
        <section className="section scroll-mt-20">
          <div className="container-wide">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                The difference between knowing AI and knowing how to use AI.
              </h2>
            </div>
            <div className="prose-wisnotech mx-auto mt-10 max-w-3xl">
              <p>You can watch 100 YouTube videos about AI. You can save 500 prompts. You can download 50 AI tools. You can join 20 communities. And still have nothing to show for it.</p>
              <p>Because information isn't the same as capability.</p>
              <h3>Capability comes from doing.</h3>
              <p>You won't simply hear: <em>"AI can build SaaS."</em> You'll work through building one.</p>
              <p>You won't simply hear: <em>"AI can create movies."</em> You'll work through creating cinematic content.</p>
              <p>You won't simply hear: <em>"AI can automate businesses."</em> You'll build an automation.</p>
              <p>You won't simply hear: <em>"AI agents are the future."</em> You'll learn how agentic systems work.</p>
              <blockquote><p>Learn. Build. Repeat.</p></blockquote>
            </div>
          </div>
        </section>

        {/* ── WHAT YOU'RE REALLY GETTING ── */}
        <section className="section scroll-mt-20 bg-white/[0.02]">
          <div className="container-wide">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                What you're really getting.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted">You're getting more than lessons. You're developing a set of capabilities that can travel with you.</p>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              {[
                { title: "The ability to create", items: ["Cinematic content", "Films", "Commercials", "Stories", "Visual experiences"] },
                { title: "The ability to build", items: ["Websites", "Apps", "SaaS", "AI systems", "Agents", "Automations"] },
                { title: "The ability to sell", items: ["Services", "Products", "Creative work", "AI solutions", "Business outcomes"] },
              ].map((col) => (
                <div key={col.title} className="card p-7">
                  <h3 className="text-lg font-semibold tracking-tight text-white">{col.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {col.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-white/70">
                        <Check className="h-3.5 w-3.5 shrink-0 text-neon" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="prose-wisnotech mx-auto mt-10 max-w-3xl">
              <p>And that's the real value.</p>
              <h3>You are building a capability — not simply completing a course.</h3>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            YOUR INVESTMENT
        ═══════════════════════════════════════════════════════════ */}
        <section id="pricing" className="section scroll-mt-20">
          <div className="container-wide">
            <div className="max-w-3xl">
              <p className="eyebrow">Investment</p>
              <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Your investment.
              </h2>
              <div className="mt-5 flex items-baseline gap-3">
                <span className="text-5xl font-bold text-white">{formatNaira(d.pricing.early)}</span>
              </div>
              <p className="mt-5 text-lg leading-relaxed text-muted">At first glance, {formatNaira(d.pricing.early)} may feel like another course expense. But look at what you're actually gaining access to:</p>
            </div>
            <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
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
                <div key={item} className="flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm text-white/65">
                  <Check className="h-3.5 w-3.5 shrink-0 text-neon" aria-hidden />
                  {item}
                </div>
              ))}
            </div>
            <div className="prose-wisnotech mx-auto mt-10 max-w-3xl">
              <p>And most importantly: <strong>the opportunity to spend time actually building instead of endlessly consuming information.</strong></p>
              <p>You can't guarantee that a course will make someone rich. We won't. Your results depend on what you do with the skills. But a skill that allows you to create products, deliver services, build systems and produce professional content can become valuable in many different ways.</p>
              <p>The question isn't: <em>"Will this course make me money?"</em></p>
              <p><strong>The better question is: "What could I do with these capabilities if I become genuinely good at them?"</strong></p>
            </div>
          </div>
        </section>

        {/* ── VIDEO SHOWCASE ── */}
        <section id="videos" className="section scroll-mt-20 bg-white/[0.02]">
          <div className="container-wide">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="eyebrow">Student &amp; Studio Work</p>
                <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                  Watch what you'll learn to make.
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-muted">
                  A selection of AI video work from the studio — commercials, cinematic clips and social content, all
                  made with the same workflows taught in the masterclass.
                </p>
              </div>
              <a href="#pricing" className="btn-secondary group hidden lg:inline-flex">
                Start creating <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SHOWCASE_VIDEOS.map((v) => (
                <motion.div key={v.id} {...fadeUp} className="card group overflow-hidden p-0">
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
                    <span className="absolute bottom-3 left-3 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-[#080808]">
                      Play
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-sm font-semibold tracking-tight text-white">{v.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{v.description.slice(0, 110)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── THE AI GOLD RUSH IS HAPPENING ACROSS MULTIPLE INDUSTRIES ── */}
        <section className="section scroll-mt-20">
          <div className="container-wide">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                The AI gold rush is happening across multiple industries.
              </h2>
            </div>
            <div className="mx-auto mt-8 flex max-w-3xl flex-wrap gap-2">
              {["Film", "Entertainment", "Advertising", "Software", "Marketing", "Education", "Business automation", "Content creation"].map((i) => (
                <span key={i} className="rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/60">{i}</span>
              ))}
            </div>
            <div className="prose-wisnotech mx-auto mt-10 max-w-3xl">
              <p>And we're still early. The people who position themselves now have time to experiment, build portfolios and develop expertise.</p>
              <p>Later, the barrier won't be access to AI. Everyone will have access.</p>
              <p><strong>The barrier will be skill.</strong></p>
              <p>Who can produce the best work? Who can solve the hardest problems? Who can direct AI better? Who can build better systems? Who can create better entertainment? Who can deliver better results?</p>
              <p><strong>Start developing those answers now.</strong></p>
            </div>
          </div>
        </section>

        {/* ── YOUR NEXT BIG IDEA ── */}
        <section className="section scroll-mt-20 bg-white/[0.02]">
          <div className="container-wide">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Your next big idea doesn't have to remain an idea.
              </h2>
            </div>
            <div className="prose-wisnotech mx-auto mt-10 max-w-3xl">
              <p>Maybe you've thought about building an app. Maybe you want to start an AI agency. Maybe you want to create a movie. Maybe you want to produce an African drama series. Maybe you want to build an AI SaaS. Maybe you want to automate your business. Maybe you want to become an AI filmmaker. Maybe you want to become a freelance AI creator. Maybe you simply want to understand where all of this is heading.</p>
              <p>You don't have to know the final destination.</p>
              <p><strong>You just need to start moving.</strong></p>
            </div>
          </div>
        </section>

        {/* ── THE PEOPLE WHO BUILD NOW ── */}
        <section className="section scroll-mt-20">
          <div className="container-wide">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                The people who build now will have something to show later.
              </h2>
            </div>
            <div className="prose-wisnotech mx-auto mt-10 max-w-3xl">
              <p>When the industry gets more competitive, everyone will say: <em>"I know AI."</em></p>
              <p>But some people will be able to say:</p>
              <blockquote>
                <p>"Here is the film I created."</p>
                <p>"Here is the SaaS I built."</p>
                <p>"Here is the AI agent I deployed."</p>
                <p>"Here is the automation I created."</p>
                <p>"Here is the client work I produced."</p>
                <p>"Here is my portfolio."</p>
              </blockquote>
              <p><strong>Which person would you rather be?</strong></p>
            </div>
          </div>
        </section>

        {/* ── THE FUTURE ISN'T COMING ── */}
        <section className="section scroll-mt-20 bg-white/[0.02]">
          <div className="container-wide">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                The future isn't coming.
              </h2>
              <p className="mt-5 text-lg font-medium text-muted">It's being built right now.</p>
            </div>
            <div className="prose-wisnotech mx-auto mt-10 max-w-3xl">
              <p>AI will continue changing. The tools will improve. The models will become more capable. The workflows will evolve. New opportunities will appear. Some existing jobs will change. New jobs will emerge. And new businesses will be created around capabilities that barely existed a few years ago.</p>
              <p>You don't need to predict exactly what happens.</p>
              <p><strong>You need to develop the ability to adapt.</strong></p>
            </div>
          </div>
        </section>

        {/* ── DON'T GET LEFT BEHIND ── */}
        <section className="section scroll-mt-20">
          <div className="container-wide">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Don't get left behind.
              </h2>
            </div>
            <div className="prose-wisnotech mx-auto mt-10 max-w-3xl">
              <p>Not because AI is going to magically replace everyone. But because people who understand how to work with these technologies will increasingly compete with people who don't.</p>
              <p>You have a choice. You can keep watching. Keep saving tutorials. Keep downloading tools. Keep saying: <em>"I'll start someday."</em></p>
              <p>Or you can start developing the skill now.</p>
              <p><strong>Start building. Start creating. Start experimenting. Start your portfolio. Start positioning yourself.</strong></p>
              <p>Because the opportunity isn't reserved for people who were born programmers. It isn't reserved for Hollywood insiders. It isn't reserved for Silicon Valley. It isn't reserved for people with millions of dollars.</p>
              <p><strong>It is increasingly available to people who are willing to learn how to use the tools.</strong></p>
            </div>
          </div>
        </section>

        {/* ── YOUR SEAT IS YOUR STARTING POINT ── */}
        <section className="section scroll-mt-20 bg-white/[0.02]">
          <div className="container-wide">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Your seat is your starting point.
              </h2>
              <p className="mt-3 text-lg font-medium text-muted">The AI Creator Masterclass</p>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              {[
                { label: "CREATE.", desc: "Learn how to produce cinematic AI entertainment and professional visual content." },
                { label: "BUILD.", desc: "Learn how to turn ideas into software, SaaS, mobile apps, AI agents and automations." },
                { label: "SELL.", desc: "Learn how to package your capabilities into services, products and business opportunities." },
              ].map((p) => (
                <motion.div key={p.label} {...fadeUp} className="card p-7 text-center">
                  <p className="text-2xl font-bold text-white">{p.label}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── YOU DON'T NEED TO KNOW EVERYTHING ── */}
        <section className="section scroll-mt-20">
          <div className="container-wide">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                You don't need to know everything.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted">You just need to know that you don't want to remain where you are.</p>
              <p className="text-lg leading-relaxed text-muted">Maybe you want to move from:</p>
            </div>
            <div className="mx-auto mt-6 grid max-w-xl gap-3 sm:grid-cols-2">
              {[
                "Consumer → Creator",
                "Beginner → Builder",
                "Employee → Entrepreneur",
                "Idea → Product",
                "Prompt → Production",
                "Skill → Service",
                "Experiment → Portfolio",
              ].map((t) => (
                <div key={t} className="flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/65">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-neon/50" />
                  {t}
                </div>
              ))}
            </div>
            <p className="prose-wisnotech mx-auto mt-8 max-w-3xl"><strong>That's the transformation we're building toward.</strong></p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            READY TO CREATE, BUILD & SELL WITH AI?
        ═══════════════════════════════════════════════════════════ */}
        <section className="section scroll-mt-20 bg-white/[0.02]">
          <div className="container-wide">
            <div className="card relative overflow-hidden p-10 text-center sm:p-16">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(ellipse 50% 60% at 50% 0%, rgba(59,123,255,0.14) 0%, transparent 65%)" }}
              />
              <div className="relative mx-auto max-w-2xl">
                <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                  Ready to create, build &amp; sell with AI?
                </h2>
                <div className="prose-wisnotech mx-auto mt-6">
                  <p>The next generation of creators won't simply use AI to generate things. They'll direct it. They'll build with it. They'll create businesses around it. They'll use it to solve problems. They'll use it to tell stories. They'll use it to build products. They'll use it to create entertainment.</p>
                  <p><strong>And some of them will become the people major companies call when they need someone who understands what AI can really do.</strong></p>
                  <p>You have an opportunity to start developing that skill now.</p>
                </div>
                <div className="mt-8">
                  <p className="text-2xl font-bold tracking-tight text-white">THE AI CREATOR MASTERCLASS</p>
                  <p className="mt-2 text-sm font-semibold tracking-[0.22em] text-muted">CREATE. BUILD. SELL.</p>
                  <div className="mt-4 flex flex-col gap-1 text-sm text-muted">
                    <p>Learn the tools. Build the projects. Create the portfolio. Develop the skill. Position yourself for what's coming.</p>
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <a href={PAYSTACK_URL} target="_blank" rel="noopener noreferrer" className="btn-primary group">
                    Secure Your Seat — {formatNaira(d.pricing.early)}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
                  </a>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary group">
                    Ask on WhatsApp
                  </a>
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.14em] text-white/25">
                  Remote &amp; Physical • December 2026. Limited slots.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            PRICING + PAYMENT METHODS
        ═══════════════════════════════════════════════════════════ */}
        <section className="section scroll-mt-20">
          <div className="container-wide">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Pricing</p>
              <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Join before the price moves.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted">
                Early bird registration gives you full access at the lowest available price.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-[520px]">
              <div className="card relative overflow-hidden p-8 text-center">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "radial-gradient(ellipse 70% 80% at 50% 0%, rgba(59,123,255,0.1) 0%, transparent 70%)" }}
                />
                <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-muted">Early Bird Access</p>
                <div className="relative mt-5 flex items-baseline justify-center gap-3">
                  <span className="text-5xl font-bold text-white">{formatNaira(d.pricing.early)}</span>
                  <span className="text-xs font-bold tracking-[0.08em] text-white/30">EARLY BIRD</span>
                </div>
                <p className="relative mt-1 text-center text-xs text-muted">Full access to the masterclass</p>
                <ul className="relative mt-6 space-y-2.5 border-t border-white/10 pt-6">
                  {["Full masterclass access", "Complete curriculum", "Hands-on projects", "Resources and frameworks", "Community access"].map(
                    (f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-white/70">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-neon" aria-hidden />
                        {f}
                      </li>
                    )
                  )}
                </ul>
                <a
                  href={PAYSTACK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary relative mt-7 w-full"
                >
                  Secure My Seat for {formatNaira(d.pricing.early)} <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
                <p className="relative mt-2.5 text-center text-xs font-bold text-neon">
                  Save {formatNaira(d.pricing.save)}.
                </p>
              </div>
            </div>

            <div className="mx-auto mt-4 grid max-w-[520px] grid-cols-2 divide-x divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
              <div className="p-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Early Bird</p>
                <p className="mt-1 text-2xl font-bold text-white">{formatNaira(d.pricing.early)}</p>
                <p className="text-xs font-medium text-neon">Lowest price · Save {formatNaira(d.pricing.save)}</p>
              </div>
              <div className="p-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Late Registration</p>
                <p className="mt-1 text-2xl font-bold text-white/40 line-through">{formatNaira(d.pricing.late)}</p>
                <p className="text-xs text-white/30">Standard price</p>
              </div>
            </div>
            <p className="mx-auto mt-4 max-w-xl text-center text-xs uppercase leading-relaxed tracking-[0.12em] text-white/25">
              Once early bird closes, the price becomes {formatNaira(d.pricing.late)}.
            </p>

            {/* Payment methods */}
            <div className="mx-auto mt-12 max-w-2xl text-center">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Choose Your Payment Method
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">Select the option that works best for your location.</p>
            </div>
            <div className="mx-auto mt-6 grid max-w-[800px] gap-5 sm:grid-cols-2">
              <a
                href={PAYSTACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group card relative overflow-hidden p-7 text-center"
              >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-neon">
                  For Africa
                </span>
                <img src="/assets/paystack-banner.png" alt="Paystack" className="mx-auto mt-4 h-14 w-auto object-contain" loading="lazy" />
                <p className="mt-4 text-sm font-semibold text-white">Pay in Naira</p>
                <p className="mt-1 text-xs text-muted">Secure payment via Paystack</p>
                <span className="btn-primary mt-5 w-full">
                  Pay {formatNaira(d.pricing.early)} <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </a>
              <a
                href={SELAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group card relative overflow-hidden p-7 text-center"
              >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-neon">
                  International
                </span>
                <img src="/assets/selar-banner.png" alt="Selar" className="mx-auto mt-4 h-14 w-auto object-contain" loading="lazy" />
                <p className="mt-4 text-sm font-semibold text-white">Pay in USD</p>
                <p className="mt-1 text-xs text-muted">Secure payment via Selar</p>
                <span className="btn-primary mt-5 w-full">
                  Pay ${SELAR_USD} <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            FINAL CTA
        ═══════════════════════════════════════════════════════════ */}
        <section className="section scroll-mt-20 bg-white/[0.02]">
          <div className="container-wide">
            <div
              className="relative overflow-hidden rounded-3xl border border-white/10 p-10 sm:p-16"
              style={{
                background: "radial-gradient(ellipse 60% 70% at 50% 0%, rgba(80,140,255,0.16) 0%, transparent 65%), linear-gradient(160deg, rgba(20,24,40,0.9), rgba(8,8,8,0.95))",
              }}
            >
              <div aria-hidden className="film-grain pointer-events-none absolute inset-0" />
              <div className="relative text-center">
                <p className="eyebrow">Limited Slots — Remote &amp; Physical</p>
                <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
                  Stop asking what AI can do.
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-xl font-semibold leading-relaxed text-white/70">
                  Start building what you want AI to do.
                </p>
                <div className="mx-auto mt-7 flex max-w-xl flex-wrap items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3">
                  <span className="text-sm font-bold text-white">Early Bird {formatNaira(d.pricing.early)}</span>
                  <span className="h-3 w-px bg-white/20" aria-hidden />
                  <span className="text-sm text-white/40 line-through">Late {formatNaira(d.pricing.late)}</span>
                  <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-bold text-[#080808]">
                    Save {formatNaira(d.pricing.save)}
                  </span>
                </div>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <a href={PAYSTACK_URL} target="_blank" rel="noopener noreferrer" className="btn-primary group">
                    Join the Masterclass for {formatNaira(d.pricing.early)} <ArrowRight className="h-4 w-4" aria-hidden />
                  </a>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary group">
                    Ask on WhatsApp
                  </a>
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.14em] text-white/25">
                  {d.pricing.deadlineNote} Then {formatNaira(d.pricing.late)}.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            FAQ
        ═══════════════════════════════════════════════════════════ */}
        <section id="faq" className="section scroll-mt-20">
          <div className="container-wide">
            <div className="max-w-2xl">
              <p className="eyebrow">Questions, answered</p>
              <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Everything you'd ask before joining.
              </h2>
            </div>
            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              {d.faqs.map((f) => (
                <details
                  key={f.q}
                  className="group card block rounded-2xl p-0"
                  style={{ overflow: "visible" }}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left text-[15px] font-semibold text-white sm:text-base [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/60 transition-transform duration-300 group-open:rotate-45">
                      <Plus className="h-4 w-4" aria-hidden />
                    </span>
                  </summary>
                  <p className="px-6 pb-6 text-sm leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════ */}
      <footer className="border-t border-white/10 bg-[#0a0a0a]">
        <div className="container-wide py-14 md:py-16">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-sm">
              <a href="/" aria-label="Wisnotech home">
                <Logo />
              </a>
              <p className="mt-3 text-sm font-medium text-white/70">The AI Creator Masterclass.</p>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                Create, build &amp; sell with AI.
              </p>
            </div>
            <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3" aria-label="Masterclass footer navigation">
              <ul className="space-y-3">
                <li className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">Navigate</li>
                <li><a href="#learn" className="text-sm text-white/55 transition-colors hover:text-white">Learn</a></li>
                <li><a href="#videos" className="text-sm text-white/55 transition-colors hover:text-white">Videos</a></li>
                <li><a href="#pricing" className="text-sm text-white/55 transition-colors hover:text-white">Pricing</a></li>
                <li><a href="#faq" className="text-sm text-white/55 transition-colors hover:text-white">FAQ</a></li>
              </ul>
              <ul className="space-y-3">
                <li className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">Wisnotech</li>
                <li><a href="/" className="text-sm text-white/55 transition-colors hover:text-white">Home</a></li>
                <li><a href="/academy" className="text-sm text-white/55 transition-colors hover:text-white">Academy</a></li>
                <li><a href="/privacy" className="text-sm text-white/55 transition-colors hover:text-white">Privacy</a></li>
                <li><a href="/terms" className="text-sm text-white/55 transition-colors hover:text-white">Terms</a></li>
              </ul>
            </nav>
          </div>
          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
            <p className="text-sm text-white/40">© {new Date().getFullYear()} Wisnotech.</p>
            <p className="text-sm text-white/30">Create, build &amp; sell.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
