import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ImageWithFallback from "./ImageWithFallback";

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container-wide grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow">About Wisnotech</p>
          <h2 className="mt-5 max-w-lg text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
            Technology should solve problems, not create more of them.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-lg leading-relaxed text-muted">
            Wisnotech combines artificial intelligence, software development and
            digital growth to help people and organizations work smarter.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            We focus on practical technology that is useful, scalable and
            accessible — built around real business outcomes, not just features.
          </p>

          {/* Founder */}
          <div className="mt-10 flex items-center gap-5">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-[#12121a]">
              <ImageWithFallback
                src="/assets/shedrack-akue-640.jpg"
                alt="Shedrack Akue — Founder of Wisnotech"
                className="h-full w-full object-cover"
                fallback={
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#14141c] to-[#0b0b0b]">
                    <span className="text-xl font-bold text-white/40">SA</span>
                  </div>
                }
              />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-white">Shedrack Akue</p>
              <p className="mt-0.5 text-sm text-white/50">Founder, Wisnotech</p>
            </div>
          </div>

          <a
            href="/#services"
            className="group mt-9 inline-flex items-center gap-2 text-[15px] font-medium text-white transition-colors hover:text-zinc-300"
          >
            Explore what we do
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </a>
        </motion.div>
      </div>
    </section>
  );
}