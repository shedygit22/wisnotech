import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Wisnotech pitched in, built our AI chat assistant and automated our order follow-ups. We stopped losing leads to slow replies.",
    name: "Chika O.",
    role: "Fashion retail owner, Uromi",
  },
  {
    quote:
      "The AI videos they produced got more reach in a week than a month of our old clips. Studio quality without a studio.",
    name: "Tunde A.",
    role: "Social media creator",
  },
  {
    quote:
      "Clear scope, fast delivery, and they actually explained how to use everything after launch. Rare find.",
    name: "Blessing E.",
    role: "Small business consultant",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="section">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="eyebrow">What clients say</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Trusted by people who ship.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Real outcomes from automating, building and creating with AI.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.blockquote
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="card flex h-full flex-col"
            >
              <Quote className="h-6 w-6 text-neon/70" aria-hidden />
              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-white/80">"{t.quote}"</p>
              <footer className="mt-6 border-t border-white/10 pt-4">
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="text-xs text-muted">{t.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-white/40">
          Sample testimonials — replace with real client quotes before launch.
        </p>
      </div>
    </section>
  );
}