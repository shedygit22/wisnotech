import { useRef } from "react";
import { motion } from "framer-motion";
import { Play, ImageIcon, Star } from "lucide-react";
import { categoryById, type PortfolioSample } from "../../lib/portfolio";

/**
 * Interactive portfolio card: mouse-follow spotlight, aspect-ratio media,
 * category badge + tags. Clicking opens the sample in the lightbox.
 */
export function SampleCard({ sample, onOpen }: { sample: PortfolioSample; onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const cat = categoryById(sample.category);
  const accent = cat?.accent ?? "#3b7bff";
  const ratio = `${sample.width} / ${sample.height}`;

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onOpen}
      onMouseMove={handleMove}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="group relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-left shadow-[0_0_0_0_rgba(80,140,255,0)] backdrop-blur-xl transition-all duration-300 hover:border-white/25"
      style={
        {
          "--mx": "50%",
          "--my": "50%",
        } as React.CSSProperties
      }
      aria-label={`Open ${sample.title}`}
    >
      {/* Spotlight that follows the cursor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), ${accent}1f 0%, transparent 70%)`,
        }}
      />

      {/* Media */}
      <div className="relative w-full overflow-hidden bg-[#0b0b0b]" style={{ aspectRatio: ratio }}>
        {sample.type === "video" ? (
          <>
            {sample.poster && (
              <img
                src={sample.poster}
                alt={`${sample.title} preview`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
            <span
              className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full text-[#080808] shadow-xl transition-transform duration-300 group-hover:scale-110"
              style={{ background: accent }}
            >
              <Play className="h-5 w-5 translate-x-0.5" aria-hidden />
            </span>
          </>
        ) : (
          <>
            <img
              src={sample.src}
              alt={sample.title}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
            <span
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/40 backdrop-blur"
              style={{ color: accent }}
            >
              <ImageIcon className="h-4 w-4" aria-hidden />
            </span>
          </>
        )}

        {/* Featured badge */}
        {sample.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
            <Star className="h-3 w-3" style={{ color: accent }} aria-hidden />
            Featured
          </span>
        )}

        {/* Category chip */}
        <span
          className="absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-black"
          style={{ background: accent }}
        >
          {cat?.label ?? sample.category}
        </span>
      </div>

      {/* Caption */}
      <div className="px-5 py-4">
        <p className="truncate text-[15px] font-semibold text-white">{sample.title}</p>
        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted">{sample.description}</p>
        {sample.tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {sample.tags.map((t) => (
              <span
                key={t}
                className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/55"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.button>
  );
}