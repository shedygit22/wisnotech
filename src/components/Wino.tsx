import { motion } from "framer-motion";
import { ArrowRight, Clapperboard, ImagePlus, Sparkles, Type } from "lucide-react";
import { WINO_FEATURES } from "../lib/wino";

const HIGHLIGHTS = [
  {
    icon: Type,
    title: "Text to Video",
    detail: "Turn a written prompt into a moving scene.",
  },
  {
    icon: ImagePlus,
    title: "Image to Video",
    detail: "Bring a still frame to life with natural motion.",
  },
  {
    icon: Sparkles,
    title: "Smarter Prompts",
    detail: "WINO refines rough ideas into cinematic prompts.",
  },
  {
    icon: Clapperboard,
    title: "Mobile-First",
    detail: "Create studio-style videos, straight from Android.",
  },
];

export default function Wino() {
  return (
    <section id="wino" className="section">
      <div className="container-wide">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow">WINO by Wisnotech</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
              AI video creation, in your pocket.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              WINO is Wisnotech&apos;s mobile-first AI video app for Android —
              built for African creators. Generate text-to-video and image-to-video
              clips with an affordable, credit-based model.
            </p>

            <ul className="mt-8 space-y-3">
              {WINO_FEATURES.slice(0, 4).map((feature) => (
                <li key={feature.title} className="flex items-start gap-3 text-white/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neon" aria-hidden />
                  <span className="text-[15px]">
                    <span className="font-medium text-white">{feature.title}</span>
                    <span className="text-white/50"> — {feature.description}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="/wino" className="btn-primary group">
                Explore the WINO App
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </a>
              <a href="/portfolio" className="btn-secondary group">
                Browse the samples
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div
              aria-hidden
              className="absolute -inset-6 rounded-3xl"
              style={{
                background: "radial-gradient(circle at 60% 30%, rgba(255,255,255,0.05) 0%, transparent 60%)",
              }}
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {HIGHLIGHTS.map((h) => (
                <div key={h.title} className="card relative flex min-h-40 flex-col justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                    <h.icon className="h-5 w-5 text-white/70" aria-hidden />
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold text-white">{h.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{h.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
