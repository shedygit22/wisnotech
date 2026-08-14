import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play, ImageIcon, VideoOff, Sparkles } from "lucide-react";
import { WINO_CATEGORIES, loadShowcaseItems, type WinoCategory, type WinoMediaItem } from "../../lib/wino";
import { cn } from "../../lib/utils";

/**
 * AI VIDEO SHOWCASE
 * Renders every published item from the WINO config (or a future backend API)
 * behind the same data shape. Lazy-loaded thumbnails; videos play only on
 * request so multiple clips never autoplay at once.
 */
export function WinoShowcase() {
  const items = useMemo(() => loadShowcaseItems(), []);
  const [active, setActive] = useState<WinoCategory | "all">("all");

  const visible = useMemo(
    () =>
      items
        .filter((i) => i.published)
        .filter((i) => active === "all" || i.category === active)
        .sort((a, b) => a.order - b.order),
    [items, active]
  );

  return (
    <section id="showcase" className="section">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="eyebrow">Showcase</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Made with WINO.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Real generations from the app — text-to-video, image-to-video and
            AI images. Samples are marked as demos until official WINO output
            is published.
          </p>
        </div>

        {/* Category filter */}
        <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter showcase">
          <FilterChip active={active === "all"} onClick={() => setActive("all")}>
            All
          </FilterChip>
          {WINO_CATEGORIES.map((c) => (
            <FilterChip key={c.id} active={active === c.id} onClick={() => setActive(c.id)}>
              {c.label}
            </FilterChip>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((item) =>
            item.type === "video" ? (
              <VideoCard key={item.id} item={item} />
            ) : (
              <ImageCard key={item.id} item={item} />
            )
          )}
        </motion.div>

        {visible.length === 0 && (
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center text-white/50">
            No samples in this category yet.
          </div>
        )}
      </div>
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
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
      {children}
    </button>
  );
}

/** Lazy thumbnail + click-to-play video. Only one video can play at a time. */
export function VideoCard({ item }: { item: WinoMediaItem }) {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const poster = item.poster || "";
  const ratio = `${item.width} / ${item.height}`;

  if (failed) {
    return (
      <figure className="card group flex h-full flex-col items-center justify-center overflow-hidden p-0 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
          <VideoOff className="h-5 w-5 text-white/50" aria-hidden />
        </span>
        <p className="mt-4 text-[15px] font-medium text-white">{item.title}</p>
        <p className="mt-1.5 max-w-[260px] text-sm leading-relaxed text-muted">
          Add a video to <code className="text-white/70">public/wino/videos</code> and update{" "}
          <code className="text-white/70">src/lib/wino.ts</code>.
        </p>
      </figure>
    );
  }

  if (!item.src) {
    return <PendingCard item={item} />;
  }

  return (
    <figure className="card group flex h-full flex-col overflow-hidden p-0">
      <div className="relative w-full overflow-hidden bg-[#0b0b0b]" style={{ aspectRatio: ratio }}>
        {!playing ? (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 flex items-center justify-center"
            aria-label={`Play ${item.title}`}
          >
            {poster ? (
              <img
                src={poster}
                alt={`${item.title} preview`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <span className="absolute inset-0 bg-gradient-to-br from-[#131320] to-[#0a0a12]" />
            )}
            <span className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/20" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#080808] shadow-lg transition-transform duration-300 group-hover:scale-105">
              <Play className="h-5 w-5 translate-x-0.5" aria-hidden />
            </span>
          </button>
        ) : (
          <video
            controls
            autoPlay
            playsInline
            preload="metadata"
            poster={poster || undefined}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          >
            <source src={item.src} type="video/mp4" />
          </video>
        )}
      </div>
      <MediaCaption item={item} />
    </figure>
  );
}

/** Lazy-loaded AI image with caption. */
export function ImageCard({ item }: { item: WinoMediaItem }) {
  const [failed, setFailed] = useState(false);
  const ratio = `${item.width} / ${item.height}`;

  if (!item.src || failed) {
    return <PendingCard item={item} />;
  }

  return (
    <figure className="card group flex h-full flex-col overflow-hidden p-0">
      <div className="relative w-full overflow-hidden bg-[#0b0b0b]" style={{ aspectRatio: ratio }}>
        <img
          src={item.src}
          alt={item.title}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <MediaCaption item={item} />
    </figure>
  );
}

/** Graceful empty card for a config entry that has no media yet. */
function PendingCard({ item }: { item: WinoMediaItem }) {
  return (
    <figure className="card group flex h-full flex-col items-center justify-center overflow-hidden p-0 text-center">
      <div className="flex w-full flex-1 items-center justify-center bg-gradient-to-br from-[#12121d] to-[#0a0a12] py-14">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
          <ImageIcon className="h-5 w-5 text-white/40" aria-hidden />
        </span>
      </div>
      <div className="w-full px-5 py-4 text-left">
        <p className="text-[15px] font-semibold text-white">{item.title}</p>
        <p className="text-xs text-muted">Sample pending — add media in {`public/wino/`}.</p>
      </div>
    </figure>
  );
}

function MediaCaption({ item }: { item: WinoMediaItem }) {
  const cat = WINO_CATEGORIES.find((c) => c.id === item.category)?.label ?? item.category;
  return (
    <figcaption className="flex flex-1 items-center justify-between gap-4 px-5 py-4">
      <div className="min-w-0">
        <p className="truncate text-[15px] font-semibold text-white">{item.title}</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
          <Sparkles className="h-3 w-3 text-neon/70" aria-hidden />
          {cat}
        </p>
      </div>
    </figcaption>
  );
}
