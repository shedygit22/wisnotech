import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { WINO_FAQ } from "../../lib/wino";

export function Faq() {
  return (
    <section id="faq" className="section">
      <div className="container-wide max-w-4xl">
        <p className="eyebrow text-center">FAQ</p>
        <h2 className="mt-4 text-center text-3xl font-semibold tracking-tight text-white md:text-4xl">
          Questions, answered.
        </h2>
        <div className="mt-10 space-y-3">
          {WINO_FAQ.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card !p-0 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-5 py-4 text-left sm:px-6"
      >
        <HelpCircle className="h-5 w-5 shrink-0 text-neon" aria-hidden />
        <span className="flex-1 text-[15px] font-medium text-white">{q}</span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/60 transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
          aria-hidden
        >
          +
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-5 pl-14 text-sm leading-relaxed text-muted sm:px-6 sm:pl-[70px]">
          {a}
        </div>
      </motion.div>
    </div>
  );
}