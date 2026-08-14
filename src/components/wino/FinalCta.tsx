import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { WINO_DOWNLOAD_URL } from "../../lib/wino";
import { useReferral } from "../../lib/winoReferral";

export function FinalCta() {
  const { appendTo } = useReferral();
  const href = appendTo(WINO_DOWNLOAD_URL);

  return (
    <section className="section relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 100%, rgba(59,123,255,0.12) 0%, transparent 65%)",
        }}
      />
      <div className="container-wide relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="eyebrow">Get started</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-6xl">
            Your next video starts with an idea.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Download WINO and turn that idea into a video — from your phone,
            with your creativity at the centre.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {href ? (
              <a href={href} download className="btn-primary group">
                Download WINO
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </a>
            ) : (
              <a href="#download" className="btn-primary group">
                Download WINO
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </a>
            )}
            <a href="#showcase" className="btn-secondary group">
              <Sparkles className="h-4 w-4" aria-hidden />
              Explore WINO
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}