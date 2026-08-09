import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { AI_IMAGES } from "../lib/content";

const PER_VIEW = 3;

export default function AiGallery() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [perView, setPerView] = useState(PER_VIEW);

  const maxIndex = Math.max(0, AI_IMAGES.length - perView);

  useEffect(() => {
    const compute = () => {
      if (window.innerWidth < 640) setPerView(1);
      else if (window.innerWidth < 1024) setPerView(3);
      else setPerView(PER_VIEW);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const go = useCallback((dir: number) => {
    setIndex((i) => {
      const max = Math.max(0, AI_IMAGES.length - (window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 3 : PER_VIEW));
      return Math.min(Math.max(0, i + dir), max);
    });
  }, []);

  const prev = () => go(-1);
  const next = () => go(1);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => {
        const max = Math.max(0, AI_IMAGES.length - (window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 3 : PER_VIEW));
        return i >= max ? 0 : i + 1;
      });
    }, 3500);
    return () => clearInterval(id);
  }, [paused]);

  useEffect(() => {
    if (index > maxIndex) setIndex(maxIndex);
  }, [index, maxIndex]);

  // Handle keyboard arrows when focused
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  if (AI_IMAGES.length === 0) return null;

  return (
    <section id="creations" className="section">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="eyebrow">AI Creations</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Visuals born from prompts.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            AI-generated imagery crafted for brands, products and campaigns —
            hover a card to flip it, or let the carousel walk you through.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative">
            <div className="overflow-hidden" style={{ perspective: "1400px" }}>
              <div
                className="flex transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: `translateX(-${index * (100 / perView)}%)` }}
              >
                {AI_IMAGES.map((img, i) => (
                  <div
                    key={img.src}
                    className="shrink-0 px-2 sm:px-3"
                    style={{
                      width: `${100 / perView}%`,
                      ...(i === 0 && { WebkitBackfaceVisibility: "visible" }),
                    }}
                  >
                    <FlipCard img={img} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={prev}
              disabled={index === 0}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all duration-300 hover:border-neon/40 hover:bg-neon/10 hover:text-neon disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Previous images"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>

            <div className="flex items-center gap-2">
              {AI_IMAGES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-6 bg-neon" : "w-1.5 bg-white/25 hover:bg-white/50"
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              disabled={index >= maxIndex}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all duration-300 hover:border-neon/40 hover:bg-neon/10 hover:text-neon disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Next images"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FlipCard({ img }: { img: { src: string; title: string; caption?: string } }) {
  return (
    <div className="group relative aspect-[9/16] w-full [perspective:1400px]">
      <div className="relative h-full w-full [transform-style:preserve-3d] transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:[transform:rotateY(180deg)]">
        {/* Front — the image */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_0_0_0_rgba(80,140,255,0)] transition-shadow duration-300 group-hover:border-neon/40 group-hover:shadow-[0_0_30px_-10px_rgba(80,140,255,0.5)] [backface-visibility:hidden]">
          <img
            src={img.src}
            alt={img.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Back — flipped detail */}
        <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border border-neon/40 bg-gradient-to-br from-[#0b1324]/95 to-[#101018]/95 p-6 [backface-visibility:hidden] [transform:rotateY(180deg)] backdrop-blur-xl">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 20%, rgba(80,140,255,0.22) 0%, transparent 55%)",
            }}
          />
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-neon/40 bg-neon/10 text-neon">
            <Sparkles className="h-4 w-4" aria-hidden />
          </span>

          <div className="relative">
            <p className="text-lg font-semibold text-white">{img.title}</p>
            {img.caption && (
              <p className="mt-1.5 text-sm leading-relaxed text-white/60">{img.caption}</p>
            )}
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-neon/80">
              Prompt to pixel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}