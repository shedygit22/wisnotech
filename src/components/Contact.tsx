import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { sendLead } from "../lib/leadSink";

const EMAIL = "wisnotech@gmail.com";
const WHATSAPP = "https://wa.me/2349153541297";

const NEED_OPTIONS = [
  "AI Solution",
  "AI Automation",
  "Website",
  "Web Application",
  "SaaS Product",
  "Business Management System",
  "Content System",
  "Digital Growth",
  "Other",
];

const BUDGET_OPTIONS = [
  "Under $500",
  "$500 – $1,000",
  "$1,000 – $3,000",
  "$3,000 – $5,000",
  "$5,000+",
  "Not sure yet",
];

const gmailHref = (subject?: string, body?: string) => {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: EMAIL,
  });
  if (subject) params.set("su", subject);
  if (body) params.set("body", body);
  return `https://mail.google.com/mail/?${params.toString()}`;
};

const CONTACT_ITEMS = [
  {
    icon: MapPin,
    label: "Address",
    lines: ["Forest Guard Street,", "Uromi, Edo State, Nigeria."],
    href: "https://www.google.com/maps/search/?api=1&query=Uromi%2C%20Edo%20State%2C%20Nigeria",
  },
  {
    icon: Mail,
    label: "Email",
    lines: [EMAIL],
    href: gmailHref(),
  },
  {
    icon: Phone,
    label: "Phone",
    lines: ["+234 915 354 1297"],
    href: "tel:+2349153541297",
  },
];

const MAP_SRC =
  "https://maps.google.com/maps?q=Uromi%2C%20Edo%20State%2C%20Nigeria&t=&z=13&ie=UTF8&iwloc=&output=embed";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    interest: "",
    budget: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [openMap, setOpenMap] = useState(false);

  const update = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const interest = form.interest || "General inquiry";
    const subject = `Project request from ${form.name || "the website"}`;
    const body =
      `${form.message}\n\nCompany: ${form.company || "—"}\nBudget: ${form.budget || "—"}\n\n— ${form.name}\n${form.email}`;
    // Push to the lead sheet when the webhook is configured (never blocks).
    await sendLead({
      name: form.name,
      email: form.email,
      company: form.company,
      interest,
      budget: form.budget,
      message: form.message,
      source: "contact-form",
    });
    window.open(gmailHref(subject, body), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  const resetForm = () => {
    setForm({ name: "", email: "", company: "", interest: "", budget: "", message: "" });
    setSent(false);
  };

  const selectClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-neon/50 focus:outline-none";

  return (
    <section id="contact" className="section">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="eyebrow">Contact</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Start your project.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Tell us what you need and we&apos;ll get back to you with a clear
            plan and quote. Prefer to talk? Reach us on WhatsApp.
          </p>
        </div>

        <div className="mt-14 grid items-start gap-6 lg:grid-cols-2">
          {/* Left — form + contact info */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4"
          >
            {sent ? (
              <div className="card flex flex-col items-start gap-4 !p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/15">
                  <Send className="h-6 w-6 text-emerald-400" aria-hidden />
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-white">Project request sent.</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    Thanks, {form.name || "there"} — your brief is on its way to
                    our team. We reply within one business day. If a draft email
                    opened, just hit send and we&apos;ll pick it up from there.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm font-medium text-neon underline decoration-neon/30 underline-offset-4 transition-colors hover:text-white"
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="card space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className="mb-1.5 block text-sm font-medium text-white/85">
                    Your name
                  </label>
                  <input
                    id="c-name"
                    value={form.name}
                    onChange={update("name")}
                    required
                    placeholder="Full name"
                    className={selectClass}
                  />
                </div>
                <div>
                  <label htmlFor="c-email" className="mb-1.5 block text-sm font-medium text-white/85">
                    Your email
                  </label>
                  <input
                    id="c-email"
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    required
                    placeholder="you@example.com"
                    className={selectClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="c-company" className="mb-1.5 block text-sm font-medium text-white/85">
                  Company <span className="text-white/35">(optional)</span>
                </label>
                <input
                  id="c-company"
                  value={form.company}
                  onChange={update("company")}
                  placeholder="Your company"
                  className={selectClass}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-interest" className="mb-1.5 block text-sm font-medium text-white/85">
                    What do you need?
                  </label>
                  <select
                    id="c-interest"
                    value={form.interest}
                    onChange={update("interest")}
                    className={`${selectClass} ${form.interest ? "" : "text-white/35"}`}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    {NEED_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#14141c] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="c-budget" className="mb-1.5 block text-sm font-medium text-white/85">
                    Estimated budget
                  </label>
                  <select
                    id="c-budget"
                    value={form.budget}
                    onChange={update("budget")}
                    className={`${selectClass} ${form.budget ? "" : "text-white/35"}`}
                  >
                    <option value="" disabled>
                      Select a range
                    </option>
                    {BUDGET_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#14141c] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="c-message" className="mb-1.5 block text-sm font-medium text-white/85">
                  Project details
                </label>
                <textarea
                  id="c-message"
                  value={form.message}
                  onChange={update("message")}
                  required
                  rows={4}
                  placeholder="Tell us about your project — goals, timeline, anything that helps…"
                  className={`${selectClass} resize-none`}
                />
              </div>

              <button type="submit" className="btn-primary group w-full" disabled={sent}>
                {sent ? "Opening your email…" : "Send Project Request"}
                {!sent && (
                  <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
                )}
              </button>

              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-medium text-emerald-300 transition-colors hover:border-emerald-400/60 hover:bg-emerald-400/15"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                Or send it on WhatsApp
              </a>
            </form>
            )}

            {CONTACT_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="card group flex items-start gap-4 !p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white/80 transition-colors duration-300 group-hover:border-neon/40 group-hover:text-neon">
                  <item.icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-muted">
                    {item.lines.map((l, i) => (
                      <span key={i}>
                        {l}
                        {i < item.lines.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
                <ArrowUpRight
                  className="ml-auto h-4 w-4 shrink-0 text-white/35 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neon"
                  aria-hidden
                />
              </a>
            ))}
          </motion.div>

          {/* Right — interactive map */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="card relative overflow-hidden !p-0">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-neon/40 bg-neon/10 text-neon">
                    <MapPin className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Find us in Uromi</p>
                    <p className="text-xs text-white/50">Edo State, Nigeria</p>
                  </div>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Uromi%2C%20Edo%20State%2C%20Nigeria"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-white/60 transition-colors hover:border-neon/40 hover:text-neon"
                  aria-label="Open in Google Maps"
                >
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>

              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0b0b0f] sm:aspect-[16/11]">
                <div className="absolute inset-0">
                  <iframe
                    title="Wisnotech location — Uromi, Edo State, Nigeria"
                    src={MAP_SRC}
                    className="h-full w-full border-0 grayscale-[35%] contrast-[1.05] transition-all duration-500 hover:grayscale-0"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                {!openMap && (
                  <button
                    type="button"
                    onClick={() => setOpenMap(true)}
                    className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/45 backdrop-blur-[2px] transition-colors hover:bg-black/35"
                    aria-label="Enable interactive map"
                  >
                    <span className="inline-flex flex-col items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-4 backdrop-blur-xl">
                      <MapPin className="h-6 w-6 text-neon" aria-hidden />
                      <span className="text-sm font-medium text-white">Explore the map</span>
                    </span>
                  </button>
                )}
              </div>
            </div>

            <div className="card mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <p className="text-sm text-white/80">We respond within one business day.</p>
              </div>
              <a
                href="https://share.google/fzDWOReUCEYSgaoeA"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors hover:text-neon"
              >
                Read our Google reviews
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}