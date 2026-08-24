import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  Trophy,
  Users,
  Zap,
  Shield,
  Star,
  Play,
  Menu,
  X,
  ChevronDown,
  Gamepad2,
  Crown,
  Target,
} from "lucide-react";

const EDITIONS = [
  {
    name: "Standard",
    price: "$69.99",
    accent: "border-white/10",
    cta: "Buy Now",
    features: ["Base game", "Ultimate Team starter pack", "3-day early access (pre-order)"],
  },
  {
    name: "Ultimate",
    price: "$99.99",
    accent: "border-[#FFD700]/30 shadow-[0_24px_64px_-24px_rgba(255,215,0,0.35)]",
    badge: "Most Chosen",
    cta: "Get Ultimate",
    features: ["Everything in Standard", "4600 FC Points", "Team of the Year loan", "Ultimate Team Hero", "Career mode bonus"],
  },
  {
    name: "Pro Clubs",
    price: "$79.99",
    accent: "border-white/10",
    cta: "Choose Pro",
    features: ["Standard + Pro Clubs season pass", "Exclusive kits & stadium", "Skill tree boost"],
  },
] as const;

const PLAYERS = [
  { name: "MBAPPÉ", pos: "ST", ovr: 91, nation: "🇫🇷", club: "RM", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80&auto=format&fit=crop" },
  { name: "HAALAND", pos: "ST", ovr: 91, nation: "🇳🇴", club: "MCI", img: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80&auto=format&fit=crop" },
  { name: "VINÍCIUS JR.", pos: "LW", ovr: 90, nation: "🇧🇷", club: "RM", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop" },
] as const;

const FAQS = [
  { q: "Is this the official FIFA game?", a: "This is a concept landing for EA SPORTS FC / FIFA Ultimate Team — the world's biggest football gaming experience. Build your squad, compete online, and live the game." },
  { q: "What is Ultimate Team?", a: "Collect player cards, build your dream squad, complete objectives and compete in Division Rivals, Champions and Squad Battles. Every card, every chemistry link matters." },
  { q: "Can I play on any platform?", a: "Yes — PlayStation, Xbox and PC with cross-play. Your Ultimate Team travels with you." },
  { q: "Do I need to pay to win?", a: "You can earn top players through objectives, SBCs and gameplay. FC Points are optional to accelerate your club." },
] as const;

export default function FifaPage() {
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
    <div className="min-h-screen bg-[#06070A] text-white antialiased selection:bg-[#FFD700]/30 selection:text-black">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Bebas+Neue&family=Geist+Mono:wght@400;500&display=swap');`}</style>

      {/* Nav */}
      <header className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${scrolled ? "border-white/[0.08] bg-[#06070A]/85 backdrop-blur-xl" : "border-transparent bg-transparent"}`}>
        <div className="mx-auto flex h-[64px] max-w-[1160px] items-center justify-between px-5 sm:px-8">
          <a href="/fifa" className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-white text-[11px] font-black tracking-[-0.04em] text-black">FIFA</span>
            <span className="font-[Bebas_Neue] text-[22px] tracking-[0.02em] text-white">ULTIMATE TEAM</span>
            <span className="hidden rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] text-white/60 sm:inline">26</span>
          </a>
          <nav className="hidden items-center gap-1 lg:flex">
            {[
              { label: "Squad", href: "#squad" },
              { label: "Game Modes", href: "#modes" },
              { label: "Editions", href: "#editions" },
              { label: "FAQ", href: "#faq" },
            ].map((l) => (
              <a key={l.label} href={l.href} className="rounded-full px-3.5 py-2 text-[13px] font-medium text-white/60 hover:bg-white/[0.06] hover:text-white">{l.label}</a>
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <a href="#editions" className="inline-flex items-center gap-2 rounded-full bg-[#FFD700] px-5 py-2.5 text-[13px] font-bold tracking-[-0.01em] text-black hover:bg-[#FFE44D]">Play Now <Play className="h-3.5 w-3.5 fill-black" /></a>
          </div>
          <button type="button" onClick={() => setMobileNav((v) => !v)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/80 lg:hidden">
            {mobileNav ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
        <AnimatePresence>
          {mobileNav && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="border-t border-white/10 bg-[#06070A] px-5 py-6 lg:hidden">
              <div className="flex flex-col gap-1">
                {[
                  { label: "Squad", href: "#squad" },
                  { label: "Game Modes", href: "#modes" },
                  { label: "Editions", href: "#editions" },
                  { label: "FAQ", href: "#faq" },
                ].map((l) => (
                  <a key={l.label} href={l.href} onClick={() => setMobileNav(false)} className="rounded-xl px-3 py-3 text-[15px] font-medium text-white/75 hover:bg-white/[0.06] hover:text-white">{l.label}</a>
                ))}
                <a href="#editions" onClick={() => setMobileNav(false)} className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-[#FFD700] px-5 py-3.5 text-sm font-bold text-black">Play Now <Play className="h-4 w-4 fill-black" /></a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#06070A] pt-[64px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(255,215,0,0.10),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,rgba(0,0,0,0.6))]" />
        {/* Stadium texture */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent 0 120px, rgba(255,255,255,0.4) 120px 121px)` }} />
        <div className="mx-auto grid max-w-[1160px] gap-8 px-5 pb-10 pt-10 sm:px-8 sm:pt-14 lg:grid-cols-[1.05fr_1.15fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#FFD700]/20 bg-[#FFD700]/10 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#FFD700]">
              <Trophy className="h-3.5 w-3.5" /> SEASON 2026 — ULTIMATE TEAM IS LIVE
            </p>
            <h1 className="mt-5 font-[900] leading-[0.88] tracking-[-0.05em] text-white">
              <span className="block text-[42px] sm:text-[56px] lg:text-[62px]">BUILD YOUR</span>
              <span className="block font-[Bebas_Neue] text-[64px] leading-[0.9] tracking-[0.01em] text-[#FFD700] sm:text-[76px] lg:text-[84px]">ULTIMATE TEAM.</span>
              <span className="block text-[42px] sm:text-[56px] lg:text-[62px]">OWN THE GAME.</span>
            </h1>
            <p className="mt-4 max-w-[44ch] text-[14px] leading-[1.65] text-white/60 sm:text-[15px]">Collect the world&apos;s best players, craft chemistry, complete SBCs and climb Division Rivals to Champions. Your squad, your style — every match matters.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#editions" className="inline-flex items-center gap-2 rounded-full bg-[#FFD700] px-7 py-3.5 text-sm font-black tracking-[-0.01em] text-black shadow-[0_12px_32px_-12px_rgba(255,215,0,0.6)] hover:bg-[#FFE44D]">Play Ultimate Team <ArrowRight className="h-4 w-4" /></a>
              <a href="#squad" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur hover:border-white/25">View Squad Builder</a>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/10 pt-4 text-[11px] font-bold uppercase tracking-[0.12em] text-white/30">
              <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> 12M+ Squads Built</span><span className="h-3 w-px bg-white/10" /><span className="inline-flex items-center gap-1.5"><Zap className="h-3.5 w-3.5" /> Cross-Play</span><span className="h-3 w-px bg-white/10" /><span>PS • XBOX • PC</span>
            </div>
          </div>

          {/* Player cards stack */}
          <div className="relative lg:h-[520px]">
            <div className="relative mx-auto grid max-w-[420px] grid-cols-3 gap-3 lg:absolute lg:inset-0 lg:max-w-none lg:items-center">
              {PLAYERS.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 20, rotate: i === 1 ? 0 : i === 0 ? -4 : 4 }}
                  animate={{ opacity: 1, y: 0, rotate: i === 1 ? 0 : i === 0 ? -4 : 4 }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6, rotate: 0, scale: 1.02 }}
                  className={`relative overflow-hidden rounded-[16px] border bg-gradient-to-b from-[#1A1A1E] to-[#0F0F12] p-2 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.6)] ${i === 1 ? "z-10 scale-[1.06] border-[#FFD700]/40 shadow-[0_24px_64px_-16px_rgba(255,215,0,0.25)]" : "border-white/10 opacity-95"}`}
                  style={{ transform: `translateY(${i === 1 ? "0" : i === 0 ? "16px" : "16px"})` }}
                >
                  <div className="relative aspect-[3/4.2] overflow-hidden rounded-[12px] bg-black">
                    <img src={p.img} alt={p.name} className="h-full w-full object-cover" loading="eager" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute left-2 top-2 flex flex-col items-center gap-1">
                      <span className="rounded bg-white px-1.5 py-0.5 font-mono text-[10px] font-black leading-none text-black">{p.ovr}</span>
                      <span className="font-mono text-[9px] font-bold tracking-[0.08em] text-white">{p.pos}</span>
                    </div>
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/70 to-transparent p-2 pt-6">
                      <p className="font-[800] text-[11px] leading-none tracking-[-0.02em] text-white sm:text-xs">{p.name}</p>
                      <p className="font-mono text-[10px] leading-none text-white/60">{p.nation} • {p.club}</p>
                    </div>
                    <div className="absolute right-2 top-2 h-1.5 w-1.5 animate-pulse rounded-full bg-[#FFD700]" />
                  </div>
                  <div className="mt-2 flex items-center justify-between px-1">
                    <span className="font-mono text-[10px] tracking-[0.08em] text-white/40">CHEM 3/3</span><Shield className="h-3 w-3 text-[#FFD700]/60" />
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="pointer-events-none absolute -right-2 -top-2 hidden rounded-full border border-[#FFD700]/20 bg-[#FFD700]/10 px-3 py-1 font-mono text-[10px] font-bold tracking-[0.12em] text-[#FFD700] lg:flex">TOTY LIVE</motion.div>
          </div>
        </div>
      </section>

      {/* Trusted strip */}
      <section className="border-y border-white/10 bg-[#08080A]">
        <div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/30">Licensed by</p>
          <div className="flex items-center gap-6 text-xs font-bold tracking-[0.08em] text-white/25">
            <span>PREMIER LEAGUE</span><span className="h-3 w-px bg-white/10" /><span>LA LIGA</span><span className="h-3 w-px bg-white/10" /><span>BUNDESLIGA</span><span className="hidden h-3 w-px bg-white/10 sm:inline" /><span className="hidden sm:inline">SERIE A</span>
          </div>
        </div>
      </section>

      {/* Game modes */}
      <section id="modes" className="scroll-mt-20 bg-[#06070A] py-14 sm:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#FFD700]">Game Modes</p>
            <h2 className="mt-3 text-[28px] font-[800] leading-[0.95] tracking-[-0.04em] text-white sm:text-[36px]">Every Way to Play.</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Trophy, title: "Division Rivals", desc: "Climb the ranks week to week. Better division, bigger rewards." },
              { icon: Crown, title: "Champions", desc: "Weekend League — the ultimate test. 20 games, elite rewards." },
              { icon: Target, title: "Squad Battles", desc: "Take on community squads on your schedule." },
              { icon: Gamepad2, title: "Squad Building Challenges", desc: "Trade in squads for packs, players and icons." },
            ].map((m) => (
              <div key={m.title} className="rounded-[16px] border border-white/10 bg-[#111113] p-6">
                <m.icon className="h-5 w-5 text-[#FFD700]" />
                <h3 className="mt-3 text-sm font-bold tracking-[-0.01em] text-white">{m.title}</h3>
                <p className="mt-1.5 text-xs leading-[1.6] text-white/50">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Squad builder */}
      <section id="squad" className="scroll-mt-20 bg-[#08080A] py-14 sm:py-20">
        <div className="mx-auto grid max-w-[1160px] gap-8 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#FFD700]">Squad Builder</p>
            <h2 className="mt-3 text-[28px] font-[800] leading-[0.95] tracking-[-0.04em] text-white sm:text-[36px]">Chemistry Is Everything.</h2>
            <p className="mt-3 max-w-[48ch] text-sm leading-[1.65] text-white/55">Link players by nation, league and club. Hit 33 chemistry and watch your squad come alive — sharper passing, faster reactions, more goals.</p>
            <ul className="mt-6 space-y-2">
              {["33 Chemistry — full team boost", "Position modifiers — play anyone, anywhere", "Evolving players — level up through objectives"].map((t) => (
                <li key={t} className="flex gap-2.5 text-xs leading-[1.5] text-white/70"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FFD700]" />{t}</li>
              ))}
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-[20px] border border-white/10 bg-[#111113] p-4">
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 11 }).map((_, i) => (
                <div key={i} className={`aspect-[3/4] rounded-[10px] border bg-gradient-to-b p-1.5 ${i < 3 ? "border-[#FFD700]/30 from-[#FFD700]/20 to-[#FFD700]/5" : "border-white/10 from-white/[0.04] to-white/[0.02]"}`}>
                  <div className="flex h-full flex-col items-center justify-center">
                    <Star className={`h-4 w-4 ${i < 3 ? "text-[#FFD700]" : "text-white/20"}`} />
                    <span className="mt-1 font-mono text-[9px] tracking-[0.08em] text-white/40">POS {i + 1}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between rounded-full bg-[#FFD700] px-4 py-2">
              <span className="font-mono text-xs font-bold tracking-[0.08em] text-black">CHEMISTRY 33/33</span><span className="text-xs font-bold text-black">● MAX</span>
            </div>
          </div>
        </div>
      </section>

      {/* Editions */}
      <section id="editions" className="scroll-mt-20 bg-[#06070A] py-14 sm:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-white sm:text-[36px]">Choose Your Edition.</h2>
            <p className="mt-2 text-sm text-white/50">All editions include the base game + Ultimate Team. Ultimate is the most chosen.</p>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {EDITIONS.map((e) => {
              const badge = (e as { badge?: string }).badge;
              return (
                <div key={e.name} className={`relative flex flex-col rounded-[20px] border bg-[#111113] p-6 sm:p-7 ${e.accent}`}>
                  {badge && <span className="absolute right-4 top-4 rounded-full bg-[#FFD700] px-3 py-1 font-mono text-[10px] font-bold tracking-[0.12em] text-black">{badge}</span>}
                  <h3 className="text-lg font-bold tracking-[-0.02em] text-white">{e.name}</h3>
                  <p className="mt-4 text-[32px] font-[900] leading-none tracking-[-0.04em] text-white">{e.price}</p>
                  <ul className="mt-5 flex-1 space-y-2">
                    {e.features.map((f) => (
                      <li key={f} className="flex gap-2 text-xs leading-[1.5] text-white/65"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FFD700]" />{f}</li>
                    ))}
                  </ul>
                  <a href="#" className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold transition-colors ${badge ? "bg-[#FFD700] text-black hover:bg-[#FFE44D]" : "border border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.07]"}`}>{e.cta} <ArrowRight className="h-4 w-4" /></a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-[#08080A] py-14 sm:py-20">
        <div className="mx-auto max-w-[760px] px-5 sm:px-8">
          <h2 className="text-[28px] font-[800] tracking-[-0.04em] text-white sm:text-[34px]">Questions, Answered.</h2>
          <div className="mt-8 divide-y divide-white/10 overflow-hidden rounded-[16px] border border-white/10 bg-[#111113]">
            {FAQS.map((f, i) => (
              <div key={f.q}>
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6" aria-expanded={openFaq === i}>
                  <span className="text-[14px] font-medium leading-[1.4] text-white sm:text-[15px]">{f.q}</span>
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all ${openFaq === i ? "rotate-45 border-[#FFD700]/40 bg-[#FFD700]/10 text-[#FFD700]" : "border-white/15 text-white/60"}`}><ChevronDown className={`h-4 w-4 transition-transform ${openFaq === i ? "rotate-180" : ""}`} /></span>
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
      <section className="bg-[#06070A] py-14 sm:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <div className="overflow-hidden rounded-[24px] border border-[#FFD700]/20 bg-gradient-to-br from-[#FFD700]/15 via-[#111113] to-[#111113] px-6 py-10 text-center sm:px-10 sm:py-14">
            <h2 className="mx-auto max-w-[16ch] font-[900] leading-[0.9] tracking-[-0.05em] text-white text-[32px] sm:text-[46px]">THE PITCH IS YOURS.</h2>
            <p className="mx-auto mt-3 max-w-[46ch] text-sm leading-[1.6] text-white/60">Build your Ultimate Team and prove it where it matters — on the pitch.</p>
            <a href="#editions" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FFD700] px-7 py-3.5 text-sm font-black text-black hover:bg-[#FFE44D]">Play Ultimate Team <ArrowRight className="h-4 w-4" /></a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#050508]">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-6 px-5 py-8 sm:px-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5"><span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-white text-[11px] font-black text-black">FIFA</span><span className="font-[Bebas_Neue] text-[18px] tracking-[0.02em] text-white">ULTIMATE TEAM</span></div>
          <p className="text-xs text-white/30">© 2026 FIFA Ultimate Team Concept — Fan-made, not affiliated with EA SPORTS. Built with taste.</p>
        </div>
      </footer>
    </div>
  );
}
