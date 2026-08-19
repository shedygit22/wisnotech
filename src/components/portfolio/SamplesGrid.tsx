import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, Search, Wand2, X } from "lucide-react";
import {
  PORTFOLIO_CATEGORIES,
  loadPortfolioSamples,
} from "../../lib/portfolio";
import { cn } from "../../lib/utils";
import { SampleCard } from "./SampleCard";
import { SampleLightbox } from "./SampleLightbox";

/**
 * WORK GRID — category filters + live search + animated grid + lightbox.
 * Filters and search sync to the URL (?category=…&q=…) so views are shareable.
 * A ?sample=id param opens the lightbox directly (used by share links).
 */
export function SamplesGrid() {
  const all = useMemo(() => loadPortfolioSamples(), []);
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const workRef = useRef<HTMLDivElement>(null);

  // Read shareable params once on mount.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    if (cat && (cat === "all" || PORTFOLIO_CATEGORIES.some((c) => c.id === cat))) {
      setActive(cat);
    }
    const q = params.get("q");
    if (q) setQuery(q.slice(0, 60));
    const sampleId = params.get("sample");
    if (sampleId) {
      const idx = all.findIndex((s) => s.id === sampleId);
      if (idx >= 0) {
        setLightbox(idx);
        // Ensure the grid is on screen behind the lightbox.
        setTimeout(() => workRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the URL in sync (replaceState — no history spam).
  useEffect(() => {
    const params = new URLSearchParams();
    if (active !== "all") params.set("category", active);
    if (query) params.set("q", query);
    const next = params.toString();
    const base = window.location.pathname;
    window.history.replaceState(null, "", next ? `${base}?${next}` : base);
  }, [active, query]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const base = active === "all" ? all : all.filter((s) => s.category === active);
    if (!needle) return base;
    return base.filter((s) => {
      const hay = [
        s.title,
        s.description,
        s.tags.join(" "),
        PORTFOLIO_CATEGORIES.find((c) => c.id === s.category)?.label ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [all, active, query]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of all) map[s.category] = (map[s.category] ?? 0) + 1;
    return map;
  }, [all]);

  const selectTag = (tag: string) => {
    setQuery(tag);
    setActive("all");
    workRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clearQuery = () => setQuery("");

  return (
    <section id="work" ref={workRef} className="section scroll-mt-20">
      <div className="container-wide">
        {/* Heading */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow">Selected work</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Proof, not promises.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Every piece below started as a prompt or an image and ended as
              production-ready footage. Browse by what you need — then let&apos;s
              make yours.
            </p>
          </div>
          <p className="flex items-center gap-2 text-sm text-white/50">
            <Wand2 className="h-4 w-4 text-neon/70" aria-hidden />
            {all.length} pieces of work · updated weekly
          </p>
        </div>

        {/* Filters + search */}
        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter the work">
            <span className="mr-1 flex items-center gap-1.5 text-xs uppercase tracking-wider text-white/40">
              <Filter className="h-3.5 w-3.5" aria-hidden />
              What are you after?
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

          <div className="relative w-full max-w-xs">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the work…"
              aria-label="Search the work"
              className="w-full rounded-full border border-white/15 bg-white/[0.04] py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-white/35 transition-colors focus:border-neon/50 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={clearQuery}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 transition-colors hover:text-white"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            )}
          </div>
        </div>

        {/* Active search note */}
        {query && (
          <p className="mt-5 text-sm text-white/60">
            Showing {visible.length} result{visible.length === 1 ? "" : "s"} for{" "}
            <span className="font-medium text-neon">“{query}”</span>
          </p>
        )}

        {/* Grid */}
        <motion.div layout className="mt-12 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                <SampleCard
                  sample={sample}
                  onOpen={() => setLightbox(i)}
                  onTagClick={selectTag}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {visible.length === 0 && (
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-14 text-center">
            <p className="text-white/50">Nothing here matches that search — but we can make it.</p>
            <a href="#contact" className="btn-primary mt-6 inline-flex">
              Start a project
            </a>
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