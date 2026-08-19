import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, Wand2 } from "lucide-react";
import {
  PORTFOLIO_CATEGORIES,
  loadPortfolioSamples,
} from "../../lib/portfolio";
import { cn } from "../../lib/utils";
import { SampleCard } from "./SampleCard";
import { SampleLightbox } from "./SampleLightbox";

/**
 * PORTFOLIO GRID — category filters + animated grid + fullscreen lightbox.
 * Samples render in a natural-aspect masonry layout; filters are live.
 */
export function SamplesGrid() {
  const all = useMemo(() => loadPortfolioSamples(), []);
  const [active, setActive] = useState<string>("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const visible = useMemo(
    () => (active === "all" ? all : all.filter((s) => s.category === active)),
    [all, active]
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of all) map[s.category] = (map[s.category] ?? 0) + 1;
    return map;
  }, [all]);

  const openAt = (i: number) => setLightbox(i);

  return (
    <section id="work" className="section scroll-mt-20">
      <div className="container-wide">
        {/* Heading */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow">The Work</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
              A growing reel.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Every sample below was generated from a prompt or an image. New
              work lands here as it's made.
            </p>
          </div>
          <p className="flex items-center gap-2 text-sm text-white/50">
            <Wand2 className="h-4 w-4 text-neon/70" aria-hidden />
            {all.length} samples · updated regularly
          </p>
        </div>

        {/* Filters */}
        <div className="mt-10 flex flex-wrap items-center gap-2" role="group" aria-label="Filter samples">
          <span className="mr-1 flex items-center gap-1.5 text-xs uppercase tracking-wider text-white/40">
            <Filter className="h-3.5 w-3.5" aria-hidden />
            Filter
          </span>
          <FilterChip
            active={active === "all"}
            label={`All ${all.length}`}
            onClick={() => setActive("all")}
          />
          {PORTFOLIO_CATEGORIES.map((c) => (
            <FilterChip
              key={c.id}
              active={active === c.id}
              accent={c.accent}
              label={`${c.label} ${counts[c.id] ?? 0}`}
              onClick={() => setActive(c.id)}
            />
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="mt-12 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((sample, i) => (
              <motion.div
                key={sample.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.04 * (i % 6) }}
              >
                <SampleCard sample={sample} onOpen={() => openAt(i)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {visible.length === 0 && (
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-14 text-center text-white/50">
            No samples in this category yet — new work is on the way.
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && visible[lightbox] && (
          <SampleLightbox
            samples={visible}
            index={lightbox}
            onClose={() => setLightbox(null)}
            onNavigate={(i) => setLightbox(i)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function FilterChip({
  active,
  label,
  accent,
  onClick,
}: {
  active: boolean;
  label: string;
  accent?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-200",
        active
          ? "border-white bg-white text-[#080808]"
          : "border-white/15 bg-white/[0.03] text-white/60 hover:border-white/30 hover:text-white"
      )}
    >
      {active && accent ? (
        <span
          className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle"
          style={{ background: accent }}
          aria-hidden
        />
      ) : null}
      {label}
    </button>
  );
}