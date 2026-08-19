import { useState } from "react";
import { motion } from "framer-motion";
import { Clapperboard, Play, VideoOff, ArrowRight } from "lucide-react";
import { VIDEOS } from "../lib/content";

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Showreel() {
  return (
    <section id="showreel" className="section">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="eyebrow">Showreel</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Video, made with AI.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Studio-grade video content produced with AI — from brand films and
            product launches to short-form social ads.
          </p>
          <a href="/portfolio" className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-neon transition-colors hover:text-white">
            Browse the full AI sample portfolio
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </a>
        </div>

        <motion.div
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {VIDEOS.map((video) => (
            <motion.article key={video.src} variants={card}>
              <VideoCard video={video} />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

interface VideoItem {
  title: string;
  category: string;
  src: string;
  poster: string;
}

function VideoCard({ video }: { video: VideoItem }) {
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);

  if (failed) {
    return (
      <div className="card group flex h-full flex-col items-center justify-center text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
          <VideoOff className="h-5 w-5 text-white/50" aria-hidden />
        </span>
        <p className="mt-4 text-[15px] font-medium text-white">{video.title}</p>
        <p className="mt-1.5 max-w-[260px] text-sm leading-relaxed text-muted">
          Add a video file to <code className="text-white/70">public/videos</code> so it can play here.
        </p>
      </div>
    );
  }

  return (
    <figure className="card group flex h-full flex-col overflow-hidden p-0">
      <div className="relative aspect-video w-full overflow-hidden bg-[#0b0b0b]">
        {!playing ? (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 flex items-center justify-center"
            aria-label={`Play ${video.title}`}
          >
            <img
              src={video.poster}
              alt={`${video.title} preview`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
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
            poster={video.poster}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          >
            <source src={video.src} type="video/mp4" />
          </video>
        )}
      </div>

      <figcaption className="flex flex-1 items-center justify-between px-5 py-4">
        <div>
          <p className="text-[15px] font-semibold text-white">{video.title}</p>
          <p className="text-xs text-muted">{video.category}</p>
        </div>
        <Clapperboard className="h-4 w-4 text-white/35" aria-hidden />
      </figcaption>
    </figure>
  );
}