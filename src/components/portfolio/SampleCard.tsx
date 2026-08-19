import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, ImageIcon, Star, Clock } from "lucide-react";
import {
  aspectLabel,
  categoryById,
  formatDuration,
  type PortfolioSample,
} from "../../lib/portfolio";
import { LazyPoster } from "./LazyMedia";

/**
 * Interactive portfolio card: cursor spotlight, hover-to-preview muted loop,
 * aspect/duration badges, clickable tags, scroll parallax on the media and a
 * prompt → frame reveal that shows the generation prompt on hover.
 * Clicking opens the lightbox.
 */
export function SampleCard({
  sample,
  onOpen,
  onTagClick,
}: {
  sample: PortfolioSample;
  onOpen: () => void;
  onTagClick?: (tag: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const cat = categoryById(sample.category);
  const accent = cat?.accent ?? "#3b7bff";
  const ratio = `${sample.width} / ${sample.height}`;

  // Subtle scroll parallax on the media — the poster drifts slower than the page.
  const { scrollYProgress } = useScroll({
    target: mediaRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  const open = () => onOpen();

  return (
    <motion.div
      ref={ref}
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="group relative block w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-left shadow-[0_0_0_0_rgba(80,140,255,0)] backdrop-blur-xl transition-all duration-300 hover:border-white/25"
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
        className="pointer-events-none absolute inset-0 z-30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), ${accent}1f 0%, transparent 70%)`,
        }}
      />

      {/* Media */}
      <div
        ref={mediaRef}
        className="relative w-full overflow-hidden bg-[#0b0b0b]"
        style={{ aspectRatio: ratio }}
      >
        {sample.type === "video" ? (
          <>
            {/* Parallax poster */}
            <motion.div style={{ y }} className="absolute inset-0 scale-[1.25] will-change-transform">
              {sample.poster && <LazyPoster src={sample.poster} alt={`${sample.title} preview`} />}
            </motion.div>

            {/* Hover-to-preview muted loop */}
            {hovering && (
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 z-10 h-full w-full object-cover"
              >
                <source src={sample.src} type="video/mp4" />
              </video>
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
            <motion.div style={{ y }} className="absolute inset-0 scale-[1.25] will-change-transform">
              <LazyPoster src={sample.src} alt={sample.title} />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
            <span
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-black/40 backdrop-blur"
              style={{ color: accent }}
            >
              <ImageIcon className="h-4 w-4" aria-hidden />
            </span>
          </>
        )}

        {/* Signature badge */}
        {sample.featured && (
          <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
            <Star className="h-3 w-3" style={{ color: accent }} aria-hidden />
            Signature
          </span>
        )}

        {/* Bottom badges: category + duration/aspect */}
        <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-1.5">
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-black"
            style={{ background: accent }}
          >
            {cat?.label ?? sample.category}
          </span>
          {sample.type === "video" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-[10px] font-semibold tabular-nums text-white backdrop-blur">
              <Clock className="h-3 w-3" aria-hidden />
              {formatDuration(sample.durationSeconds)} · {aspectLabel(sample.width, sample.height)}
            </span>
          )}
        </div>
      </div>

      {/* Caption */}
      <div className="px-5 py-4">
        <p className="truncate text-[15px] font-semibold text-white">{sample.title}</p>
        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted">{sample.description}</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          {sample.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {sample.tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTagClick?.(t);
                  }}
                  className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/55 transition-colors hover:border-neon/50 hover:text-neon"
                  title={`Filter by "${t}"`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
          <span className="shrink-0 text-[11px] font-medium text-neon opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            View →
          </span>
        </div>
      </div>
    </motion.div>
  );
}