import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

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
          <a
            href="#services"
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