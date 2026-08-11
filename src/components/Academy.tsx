import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Check } from "lucide-react";

const HIGHLIGHTS = [
  "Artificial intelligence",
  "Automation & workflows",
  "AI content creation",
  "No-code development",
];

export default function Academy() {
  return (
    <section id="academy" className="section">
      <div className="container-wide">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow">Wisnotech Academy</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Learn the technology shaping tomorrow.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Practical training in artificial intelligence, automation, content
              creation, software development and modern digital tools.
            </p>

            <ul className="mt-8 space-y-3">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-center gap-3 text-white/80">
                  <Check className="h-4 w-4 text-white/50" aria-hidden />
                  <span className="text-[15px]">{item}</span>
                </li>
              ))}
            </ul>

            <a href="#/academy" className="btn-primary group mt-10">
              Explore the Academy
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </a>
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
              <div className="card relative flex h-full min-h-52 flex-col justify-between">
                <BookOpenIcon />
                <div>
                  <p className="text-[15px] font-semibold text-white">Hands-on curriculum</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    Project-based lessons you can apply the same week.
                  </p>
                </div>
              </div>
              <div className="card relative flex h-full min-h-52 flex-col justify-between">
                <BookOpenIcon />
                <div>
                  <p className="text-[15px] font-semibold text-white">For everyone</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    Tailored for businesses, creators and professionals.
                  </p>
                </div>
              </div>
              <div className="card relative col-span-1 flex h-full min-h-32 items-center justify-center sm:col-span-2 sm:min-h-28">
                <p className="text-center text-sm text-white/50">
                  Courses opening soon — join the waitlist to get early access.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function BookOpenIcon() {
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
      <BookOpen className="h-5 w-5 text-white/70" aria-hidden />
    </span>
  );
}