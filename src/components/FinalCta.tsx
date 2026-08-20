import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

export default function FinalCta() {
  return (
    <section id="cta" className="section">
      <div className="container-wide">
        <motion.div
          {...fadeUp}
          className="card relative overflow-hidden !p-10 text-center md:!p-16"
        >
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-neon/15 blur-[100px]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-neon/10 blur-[100px]"
            aria-hidden
          />
          <div className="relative">
            <p className="eyebrow">Start building</p>
            <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
              Ready to build something better?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
              AI, software and automation built around your business goals. Tell
              us what you want to achieve — we&apos;ll handle the technology.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="#contact" className="btn-primary group">
                Start a Project
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
              </a>
              <a
                href="https://wa.me/2349153541297?text=Hi%20Wisnotech%2C%20I%27d%20like%20to%20talk%20about%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-[15px] font-medium text-white transition-colors hover:text-neon"
              >
                <MessageCircle className="h-4 w-4 text-neon" aria-hidden />
                Talk to Wisnotech
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}