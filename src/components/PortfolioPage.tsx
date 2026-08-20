import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Check,
  Clapperboard,
  Film,
  Globe,
  Image,
  Megaphone,
  MessageCircle,
  Music,
  Plus,
  Send,
  Share2,
  Smartphone,
  Sparkles,
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
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "How It Works", href: "#process" },
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

const SERVICES = [
  { icon: Megaphone, title: "AI Advertisements", copy: "Cinematic product commercials, launch campaigns and branded ads that make products look like films." },
  { icon: Users, title: "AI UGC", copy: "Creator-style videos built for social advertising and organic content — believable, scrolly and on-brand." },
  { icon: Share2, title: "Social Media Content", copy: "Short-form video for TikTok, Instagram Reels, Facebook and YouTube Shorts." },
  { icon: Bot, title: "AI Characters", copy: "Custom digital characters with a consistent face, wardrobe, personality and world." },
  { icon: Clapperboard, title: "Cinematic Production", copy: "Visually rich AI-generated scenes for brands, campaigns, entertainment and storytelling." },
  { icon: Music, title: "Music Videos", copy: "AI-powered music visuals combining artistic direction, scenes, characters and narrative." },
  { icon: Film, title: "Film & Trailers", copy: "Cinematic trailers, teasers, short films and concept productions." },
  { icon: Image, title: "Campaign Visuals", copy: "High-end AI imagery and video for product launches, advertising and brand communication." },
] as const;

const PRICING = [
  {
    name: "Social Content",
    price: "From $100",
    tagline: "Premium short-form content for businesses, creators and brands.",
    cta: "Start a Project",
    includes: ["Creative concept", "AI-generated visuals", "Short-form video production", "Professional editing", "Basic sound design", "Social-media-ready delivery"],
  },
  {
    name: "AI UGC Video",
    price: "From $150",
    tagline: "Creator-style AI content for products, services and social campaigns.",
    cta: "Request a Project",
    includes: ["AI creator or character", "Script support", "Product integration", "AI voice or narration where required", "Editing", "Social-ready delivery"],
  },
  {
    name: "AI Product Commercial",
    price: "From $300",
    tagline: "Product ads designed to make products look cinematic and desirable.",
    cta: "Create My Ad",
    includes: ["Creative concept", "Product visualization", "Cinematic AI scenes", "Professional editing", "Sound design", "Multiple formats where required"],
  },
  {
    name: "AI Brand Campaign",
    price: "From $750",
    tagline: "For product launches, campaigns and major marketing initiatives.",
    cta: "Build My Campaign",
    includes: ["Creative direction", "Campaign concept", "Multiple visual assets", "AI-generated video", "Product integration", "Editing and sound design", "Campaign-ready deliverables"],
  },
  {
    name: "AI Music Video",
    price: "From $1,000",
    tagline: "A complete AI-powered visual built around the artist, song and concept.",
    cta: "Start a Music Video",
    includes: ["Creative concept", "Visual treatment", "AI-generated scenes", "Character development where required", "Cinematic editing", "Sound synchronization", "Final music video"],
  },
  {
    name: "Film Trailer",
    price: "From $1,500",
    tagline: "Cinematic trailers and teasers for films, series, games, books and brands.",
    cta: "Create a Trailer",
    includes: ["Concept development", "Visual treatment", "Cinematic AI scenes", "Character creation where required", "Professional editing", "Sound design", "Trailer delivery"],
  },
  {
    name: "Short Film",
    price: "From $3,000",
    tagline: "Narrative productions, experimental and branded films with real cinematic craft.",
    cta: "Discuss My Film",
    includes: ["Creative development", "Story and scene planning", "Character development", "AI production", "Cinematic editing", "Sound design", "Final film delivery"],
  },
  {
    name: "Large-Scale Production",
    price: "From $5,000+",
    tagline: "Major campaigns, multiple videos and complex multi-stage productions.",
    cta: "Request a Custom Quote",
    includes: ["Fully customized production plan"],
  },
] as const;

const PROCESS = [
  { step: "01", title: "Send Your Idea", copy: "Tell us what you want to create — a product, a script, an image, a campaign, a character, a reference video, or even a rough idea." },
  { step: "02", title: "Creative Direction", copy: "We review the project and develop the creative direction, production approach, deliverables and estimated timeline." },
  { step: "03", title: "Production", copy: "Your project is created with AI production workflows plus creative direction, editing, compositing, sound and visual refinement." },
  { step: "04", title: "Final Delivery", copy: "Receive the completed content ready for advertising, publishing, social media, presentation or distribution." },
] as const;

const WHY = [
  { icon: Zap, title: "Faster Creative Production", copy: "Move from concept to visual execution faster than traditional production workflows." },
  { icon: Globe, title: "Limitless Worlds", copy: "Create environments, characters and visual worlds that would be difficult or expensive to produce traditionally." },
  { icon: Smartphone, title: "Built for Modern Content", copy: "From social campaigns to cinematic storytelling, production adapts to the platform and the audience." },
  { icon: Sparkles, title: "AI + Human Creativity", copy: "AI is the production technology. Direction, storytelling, editing and taste shape the final result." },
] as const;

const ECOSYSTEM = [
  { title: "Wisnotech Studios", tag: "Studio", href: "/portfolio", copy: "AI-powered creative production for brands, creators, artists and filmmakers." },
  { title: "Wino", tag: "Coming soon", href: "/wino", copy: "AI video creation platform." },
  { title: "Wisnotech AI Academy", tag: "Learn", href: "/#/academy", copy: "Practical AI education — tools, content creation, automation, prompt engineering and video production." },
] as const;

const FAQS = [
  {
    q: "How long does a project take?",
    a: "Most social and UGC content ships within a few days. Larger films take one to four weeks depending on scope. You get the first creative direction within 24 hours of sending your brief.",
  },
  {
    q: "What do I need to start?",
    a: "A rough idea is enough — a product, a script, a reference video, images or a character concept. We develop the creative direction, approach and deliverables from there.",
  },
  {
    q: "Will the footage look real?",
    a: "Yes. Every scene is produced, graded, edited and sound-designed to a professional standard. Creative direction and taste are what separate the work from generic AI output.",
  },
  {
    q: "Do I own the final video?",
    a: "Yes. You receive full rights to the final deliverables for advertising, publishing, social media and distribution.",
  },
  {
    q: "How do revisions work?",
    a: "Every project includes a revision round built into the scope. The exact number depends on the project size and is confirmed before production begins.",
  },
  {
    q: "How do pricing and payment work?",
    a: "The numbers on the pricing section are starting points. International projects are quoted in USD. A deposit begins production and the final balance is due on delivery.",
  },
  {
    q: "Can you match our brand style?",
    a: "Yes. We iterate on tone, palette, characters and formats until the work is unmistakably yours. Nothing ships unapproved.",
  },
] as const;

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
} as const;

/** Client-converting AI creative studio page — standalone at /portfolio. */
export default function PortfolioPage() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  useEffect(() => {
    applyPageMeta({
      title: "Wisnotech | AI-Powered Creative Production Studio",
      description:
        "Wisnotech creates AI-powered advertisements, cinematic videos, UGC content, music videos, film trailers, characters and visual campaigns for brands, creators and filmmakers worldwide.",
      path: "/portfolio",
      type: "website",
      image: "https://wisnotech.vercel.app/assets/portfolio-og.jpg",
      jsonLd: [
        orgSchema(),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "AI-Powered Creative Production Studio", path: "/portfolio" },
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
                  {...fadeUp}
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

        {/* Seen something you like? */}
        <section className="section scroll-mt-20">
          <div className="container-wide">
            <div className="card relative overflow-hidden p-10 text-center sm:p-16">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 50% 60% at 50% 0%, rgba(59,123,255,0.12) 0%, transparent 65%)",
                }}
              />
              <h2 className="relative text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Seen something you like?
              </h2>
              <p className="relative mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted">
                Your idea could be the next project.
              </p>
              <a href="#contact" className="btn-primary relative mt-8">
                Start a Project
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
              </a>
            </div>
          </div>
        </section>

        {/* Services — What We Create */}
        <section id="services" className="section scroll-mt-20 bg-white/[0.02]">
          <div className="container-wide">
            <p className="eyebrow">What we create</p>
            <h2 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
              From a simple idea to a cinematic final product.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
              One studio for every kind of visual — ads, UGC, social content,
              characters, music videos, trailers and films.
            </p>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {SERVICES.map((s) => (
                <motion.div key={s.title} {...fadeUp} className="card group p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05]">
                    <s.icon className="h-5 w-5 text-neon" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.copy}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing — USD starting points */}
        <section id="pricing" className="section scroll-mt-20">
          <div className="container-wide">
            <div className="max-w-2xl">
              <p className="eyebrow">Starting prices</p>
              <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Serious production. Clear starting points.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted">
                Every project is scoped to its creative ambition. The numbers
                below are where the work begins.
              </p>
            </div>

            <div className="mt-12 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {PRICING.map((t) => (
                <motion.div key={t.name} {...fadeUp} className="card flex h-full flex-col p-7">
                  <h3 className="text-lg font-semibold tracking-tight text-white">{t.name}</h3>
                  <p className="mt-3 text-3xl font-bold text-white">{t.price}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{t.tagline}</p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {t.includes.map((inc) => (
                      <li key={inc} className="flex items-start gap-2 text-sm text-white/70">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neon" aria-hidden />
                        {inc}
                      </li>
                    ))}
                  </ul>
                  <a href="#contact" className="btn-secondary mt-6 w-full">
                    {t.cta}
                  </a>
                </motion.div>
              ))}
            </div>

            <p className="mt-10 text-center text-sm leading-relaxed text-white/45">
              Prices shown are starting points. Final project pricing depends on creative scope,
              duration, number of scenes, characters, AI generation requirements, revisions,
              voiceover, sound design, visual effects, formats and production complexity.
            </p>
            <p className="mt-2 text-center text-sm text-white/45">
              International projects are quoted in USD.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section id="process" className="section scroll-mt-20 bg-white/[0.02]">
          <div className="container-wide">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Four steps from idea to finished film.
            </h2>
            <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {PROCESS.map((p, i) => (
                <motion.div
                  key={p.step}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.06 * i }}
                  className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-7"
                >
                  <span aria-hidden className="outline-text text-5xl font-bold">
                    {p.step}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-white">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.copy}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-14 text-center">
              <p className="text-lg leading-relaxed text-muted">
                Have an idea? Let&apos;s turn it into something people remember.
              </p>
              <a href="#contact" className="btn-primary group mt-6">
                Start Your Project
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
              </a>
            </div>
          </div>
        </section>

        {/* Why Wisnotech */}
        <section id="why" className="section scroll-mt-20">
          <div className="container-wide">
            <p className="eyebrow">Why Wisnotech</p>
            <h2 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Cinema without traditional limits.
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted">
              AI makes it possible to explore ideas that would traditionally require large crews,
              locations, equipment and production budgets. Wisnotech combines that technology with
              creative direction to turn ambitious ideas into compelling visual experiences.
            </p>
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
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: 0.05 * i }}
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

        {/* Bring your idea to life */}
        <section className="section scroll-mt-20 bg-white/[0.02]">
          <div className="container-wide">
            <div
              className="relative overflow-hidden rounded-3xl border border-white/10 p-10 sm:p-16"
              style={{
                background:
                  "radial-gradient(ellipse 60% 70% at 50% 0%, rgba(80,140,255,0.16) 0%, transparent 65%), linear-gradient(160deg, rgba(20,24,40,0.9), rgba(8,8,8,0.95))",
              }}
            >
              <div aria-hidden className="film-grain pointer-events-none absolute inset-0" />
              <div className="relative text-center">
                <p className="eyebrow">Bring your idea to life.</p>
                <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
                  A product. A campaign. A character. A music video. A film.
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
                  Bring the idea — Wisnotech will help turn it into something people can see.
                </p>
                <a href="#contact" className="btn-primary group mt-8">
                  Send Your Brief
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="section scroll-mt-20">
          <div className="container-wide">
            <div className="max-w-2xl">
              <p className="eyebrow">Questions, answered</p>
              <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Everything you&apos;d ask before starting.
              </h2>
            </div>
            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              {FAQS.map((f) => (
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

        {/* Contact / final CTA */}
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
                  Your next big idea could start here.
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-muted">
                  A product. A story. A character. A campaign. A world that does not exist yet.
                  Bring the idea. Let&apos;s create it.
                </p>
                <a href="#work" className="btn-secondary mt-8 inline-flex">
                  Explore our work
                </a>
                <CommissionForm />
                <p className="mt-6 text-sm text-white/45">
                  Prefer email? Write to us directly at{" "}
                  <a href={`mailto:wisnotech@gmail.com`} className="text-neon underline decoration-neon/30 underline-offset-4 hover:decoration-neon">
                    wisnotech@gmail.com
                  </a>
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="https://wa.me/2349153541297?text=Hi%20Wisnotech%2C%20I%27d%20like%20to%20start%20a%20project."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex"
                  >
                    <MessageCircle className="h-4 w-4 text-emerald-400" aria-hidden />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ecosystem */}
        <section className="section scroll-mt-20 bg-white/[0.02]">
          <div className="container-wide">
            <p className="eyebrow">Part of the Wisnotech ecosystem</p>
            <h2 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
              One name. Three ways we build.
            </h2>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {ECOSYSTEM.map((e) => (
                <motion.a
                  key={e.title}
                  href={e.href}
                  {...fadeUp}
                  className="group card relative block overflow-hidden p-8"
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-neon">
                    {e.tag}
                  </span>
                  <h3 className="mt-5 text-xl font-semibold tracking-tight text-white">{e.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">{e.copy}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-neon">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                  </span>
                </motion.a>
              ))}
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
              <p className="mt-3 text-sm font-medium text-white/70">AI-Powered Creative Production.</p>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                Ideas into visuals. Visuals into stories. Stories into impact.
              </p>
            </div>

            <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3" aria-label="Studio footer navigation">
              <ul className="space-y-3">
                <li className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">Studio</li>
                <li>
                  <a href="#work" className="text-sm text-white/55 transition-colors hover:text-white">
                    Portfolio
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-sm text-white/55 transition-colors hover:text-white">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-sm text-white/55 transition-colors hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-sm text-white/55 transition-colors hover:text-white">
                    Start a Project
                  </a>
                </li>
              </ul>
              <ul className="space-y-3">
                <li className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">Ecosystem</li>
                <li>
                  <a href="/portfolio" className="text-sm text-white/55 transition-colors hover:text-white">
                    Wisnotech Studios
                  </a>
                </li>
                <li>
                  <a href="/wino" className="text-sm text-white/55 transition-colors hover:text-white">
                    Wino <span className="text-white/35">(coming soon)</span>
                  </a>
                </li>
                <li>
                  <a href="/#/academy" className="text-sm text-white/55 transition-colors hover:text-white">
                    Wisnotech AI Academy
                  </a>
                </li>
              </ul>
              <ul className="space-y-3">
                <li className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">Company</li>
                <li>
                  <a href="/" className="text-sm text-white/55 transition-colors hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/blog" className="text-sm text-white/55 transition-colors hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-sm text-white/55 transition-colors hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-sm text-white/55 transition-colors hover:text-white">
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

const NEED_OPTIONS = [
  "AI Advertisement",
  "AI UGC",
  "Social Media Video",
  "Product Commercial",
  "Brand Campaign",
  "Music Video",
  "Film Trailer",
  "Short Film",
  "AI Character",
  "Campaign Visuals",
  "Other",
];

const BUDGET_OPTIONS = [
  "$100 – $300",
  "$300 – $750",
  "$750 – $1,500",
  "$1,500 – $3,000",
  "$3,000 – $5,000",
  "$5,000+",
  "Not sure yet",
];

const TIMELINE_OPTIONS = ["Urgent", "Within 1 week", "2–4 weeks", "1–2 months", "Flexible"];

/** Project inquiry form — saves the lead to the Wisnotech spreadsheet, with an email fallback. */
function CommissionForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    need: NEED_OPTIONS[0],
    idea: "",
    reference: "",
    budget: "Not sure yet",
    timeline: "Flexible",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "saved" | "email">("idle");

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const message = [
      form.company && `Company: ${form.company}`,
      form.reference && `Reference / project link: ${form.reference}`,
      form.idea,
    ]
      .filter(Boolean)
      .join("\n");
    const ok = await sendLead({
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
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
    const subject = `New project request from ${form.name}`;
    const body = `${form.need}\n\n${message}\n\n— ${form.name}\n${form.email}\n${form.phone ? `Phone / WhatsApp: ${form.phone}\n` : ""}Budget: ${form.budget}\nTimeline: ${form.timeline}`;
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
          {status === "saved" ? "Project request received." : "Your email is ready to send."}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {status === "saved"
            ? "Wisnotech will review your brief and contact you with the next steps, estimated timeline and project quote."
            : "Our spreadsheet is briefly unreachable, so we opened a prefilled email instead — just hit send and we'll pick it up."}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-medium text-neon underline decoration-neon/30 underline-offset-4 hover:decoration-neon"
        >
          Submit another project
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
          placeholder="Full name"
          aria-label="Full name"
          className={inputCls}
        />
        <input
          value={form.email}
          onChange={set("email")}
          type="email"
          required
          placeholder="Email address"
          aria-label="Email address"
          className={inputCls}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={form.phone}
          onChange={set("phone")}
          placeholder="Phone / WhatsApp"
          aria-label="Phone or WhatsApp"
          className={inputCls}
        />
        <input
          value={form.company}
          onChange={set("company")}
          placeholder="Company / brand (optional)"
          aria-label="Company or brand"
          className={inputCls}
        />
      </div>
      <select value={form.need} onChange={set("need")} aria-label="What do you want to create" className={inputCls}>
        {NEED_OPTIONS.map((o) => (
          <option key={o} value={o} className="bg-[#0d0d0d]">
            {o}
          </option>
        ))}
      </select>
      <textarea
        value={form.idea}
        onChange={set("idea")}
        required
        rows={3}
        placeholder="Tell us about your idea, product, story, campaign, or the type of video you want to create."
        aria-label="Tell us about your project"
        className={`${inputCls} resize-none`}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <select value={form.budget} onChange={set("budget")} aria-label="Estimated budget" className={inputCls}>
          {BUDGET_OPTIONS.map((o) => (
            <option key={o} value={o} className="bg-[#0d0d0d]">
              {o}
            </option>
          ))}
        </select>
        <select value={form.timeline} onChange={set("timeline")} aria-label="Project timeline" className={inputCls}>
          {TIMELINE_OPTIONS.map((o) => (
            <option key={o} value={o} className="bg-[#0d0d0d]">
              {o}
            </option>
          ))}
        </select>
      </div>
      <input
        value={form.reference}
        onChange={set("reference")}
        placeholder="Reference / project link (optional)"
        aria-label="Reference or project link"
        className={inputCls}
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary group w-full"
      >
        {status === "sending" ? (
          "Submitting your request…"
        ) : (
          <>
            Submit Project Request
            <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
          </>
        )}
      </button>
    </form>
  );
}