import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  aspectLabel,
  categoryById,
  formatDuration,
  type PortfolioSample,
} from "../../lib/portfolio";
import { cn } from "../../lib/utils";

interface LightboxProps {
  samples: PortfolioSample[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/**
 * Fullscreen sample viewer. Videos autoplay on open; images render full size.
 * Includes a thumbnail filmstrip and hidden preload tags for the previous/next
 * clips so navigation feels instant.
 * Keyboard: Esc closes, ←/→ navigate. Body scroll is locked while open.
 */
export function SampleLightbox({ samples, index, onClose, onNavigate }: LightboxProps) {
  const sample = samples[index];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const total = samples.length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % total);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNavigate, index, total]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    setFailed(false);
    if (sample?.type === "video") {
      const t = setTimeout(() => videoRef.current?.play().catch(() => undefined), 120);
      return () => clearTimeout(t);
    }
  }, [sample]);

  if (!sample) return null;

  const cat = categoryById(sample.category);
  const accent = cat?.accent ?? "#3b7bff";
  const ratio = `${sample.width} / ${sample.height}`;

  const next = samples[(index + 1) % total];
  const prev = samples[(index - 1 + total) % total];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={sample.title}
    >
      {/* Preload neighbours */}
      <link rel="preload" href={next.src} as="video" />
      <link rel="preload" href={prev.src} as="video" />

      {/* Nav arrows */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index - 1 + total) % total);
            }}
            aria-label="Previous sample"
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/70 transition-colors hover:border-white/40 hover:text-white sm:left-6"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index + 1) % total);
            }}
            aria-label="Next sample"
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/70 transition-colors hover:border-white/40 hover:text-white sm:right-6"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </>
      )}

      <button
        type="button"
        onClick={onClose}
        aria-label="Close viewer"
        className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/70 transition-colors hover:border-white/40 hover:text-white sm:right-6 sm:top-6"
      >
        <X className="h-5 w-5" aria-hidden />
      </button>

      <motion.div
        key={sample.id}
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -8 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex max-h-full w-full max-w-5xl flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
          style={{ aspectRatio: ratio, maxHeight: "min(60vh, 560px)", width: "auto", maxWidth: "100%" }}
        >
          {sample.type === "video" ? (
            failed ? (
              <div className="flex h-full w-full items-center justify-center text-sm text-white/50">
                Video unavailable.
              </div>
            ) : (
              <video
                ref={videoRef}
                controls
                autoPlay
                playsInline
                preload="metadata"
                poster={sample.poster}
                onError={() => setFailed(true)}
                className="h-full w-full object-contain"
              >
                <source src={sample.src} type="video/mp4" />
              </video>
            )
          ) : (
            <img src={sample.src} alt={sample.title} className="h-full w-full object-contain" />
          )}
        </div>

        {/* Meta */}
        <div className="mt-6 w-full max-w-2xl text-center">
          <div className="flex items-center justify-center gap-3">
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-black"
              style={{ background: accent }}
            >
              {cat?.label ?? sample.category}
            </span>
            {sample.type === "video" && (
              <span className="rounded-full border border-white/15 bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold tabular-nums text-white/70">
                {formatDuration(sample.durationSeconds)} · {aspectLabel(sample.width, sample.height)}
              </span>
            )}
            <span className="text-xs tabular-nums text-white/45">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>

          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {sample.title}
          </h3>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{sample.description}</p>

          <p className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {sample.tags.map((t) => (
              <span
                key={t}
                className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/60"
              >
                {t}
              </span>
            ))}
          </p>
        </div>

        {/* Filmstrip */}
        {total > 1 && (
          <div
            className="mt-6 flex w-full max-w-3xl gap-2 overflow-x-auto pb-2"
            onClick={(e) => e.stopPropagation()}
            role="tablist"
            aria-label="Sample thumbnails"
          >
            {samples.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Open ${s.title}`}
                onClick={() => onNavigate(i)}
                className={cn(
                  "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border transition-all duration-200",
                  i === index
                    ? "border-white ring-2 ring-white/20"
                    : "border-white/10 opacity-60 hover:opacity-100"
                )}
                style={{ background: accent }}
              >
                {s.poster || s.type === "image" ? (
                  <img
                    src={s.poster || s.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-black">
                    {s.title.slice(0, 1)}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}