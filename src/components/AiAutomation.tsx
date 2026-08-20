import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CalendarCheck,
  FileSearch,
  FileText,
  Mail,
  MessageSquare,
  PhoneCall,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";

interface Capability {
  icon: LucideIcon;
  label: string;
}

const CAPABILITIES: Capability[] = [
  { icon: UserPlus, label: "Lead capture" },
  { icon: Mail, label: "Email follow-ups" },
  { icon: MessageSquare, label: "Customer support" },
  { icon: CalendarCheck, label: "Appointments & bookings" },
  { icon: FileText, label: "Content generation" },
  { icon: Users, label: "CRM updates" },
  { icon: FileSearch, label: "Document processing" },
  { icon: Bot, label: "Internal AI assistants" },
  { icon: BarChart3, label: "Reporting & insights" },
  { icon: PhoneCall, label: "Sales follow-ups" },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

export default function AiAutomation() {
  return (
    <section id="automation" className="section overflow-hidden bg-white/[0.02]">
      <div className="container-wide grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <motion.div {...fadeUp}>
          <p className="eyebrow">AI Automation</p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
            Turn repetitive work into automated systems.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Your team shouldn&apos;t spend hours on work a system can handle. We
            design automations that capture, organise, respond and report — so
            your people focus on what actually moves the business forward.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="#contact" className="btn-primary group">
              Automate my business
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
            </a>
            <a href="#work" className="text-sm font-medium text-white/70 transition-colors hover:text-neon">
              See what we build
            </a>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
          {CAPABILITIES.map((c, i) => (
            <motion.div
              key={c.label}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.04 }}
              className="card flex items-center gap-3 !p-4"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neon/30 bg-neon/10 text-neon">
                <c.icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="text-sm font-medium text-white/90">{c.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}