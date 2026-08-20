import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface QA {
  q: string;
  a: string;
}

const FAQS: QA[] = [
  {
    q: "What does Wisnotech do?",
    a: "We help businesses build AI solutions, automate workflows, develop custom software and create digital systems designed for growth — under one roof.",
  },
  {
    q: "Do you work with startups and small businesses?",
    a: "Yes. We work with startups, small and medium businesses and agencies — sizing every project to the stage you're at right now.",
  },
  {
    q: "How much does a project cost?",
    a: "Every project is scoped to its goals. Send us a brief through the contact form and you'll get a clear, fixed quote before work begins — no surprises.",
  },
  {
    q: "How long does a typical project take?",
    a: "It depends on scope. Simple websites and automations can ship in a few weeks, while larger products follow a milestone plan with clear dates you'll see upfront.",
  },
  {
    q: "Can you automate my existing business processes?",
    a: "Yes. Describe the process and we'll build the workflow — lead capture, follow-ups, support, reporting and more — so your team can focus on the work that matters.",
  },
  {
    q: "Can Wisnotech build custom AI applications?",
    a: "Yes. Custom AI tools, assistants and integrations are a core part of what we do — built around your workflow and your data.",
  },
  {
    q: "Do you provide support after launch?",
    a: "Yes. Every launch includes support and training, plus a roadmap for improving the system as your business grows.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section bg-white/[0.02]">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="eyebrow">FAQ</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Frequently asked questions.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Everything you need to know before we start. Still curious? Ask us
            directly through the contact form.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={item.q}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.04 }}
                className={`card overflow-hidden transition-colors ${isOpen ? "border-neon/30" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-[15px] font-medium text-white">{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-white/50 transition-transform duration-300 ${isOpen ? "rotate-180 text-neon" : ""}`}
                    aria-hidden
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5">
                    <p className="text-sm leading-relaxed text-muted">{item.a}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}