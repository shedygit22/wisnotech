import { BrainCircuit, Cloud, Database, Layers, MonitorSmartphone, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const BADGES: { icon: LucideIcon; label: string }[] = [
  { icon: BrainCircuit, label: "AI" },
  { icon: Workflow, label: "Automation" },
  { icon: MonitorSmartphone, label: "Web Apps" },
  { icon: Layers, label: "SaaS" },
  { icon: Cloud, label: "Cloud" },
  { icon: Database, label: "Digital Systems" },
];

export default function TrustStrip() {
  return (
    <section
      aria-label="Technology for ambitious businesses"
      className="relative border-y border-white/[0.07] bg-white/[0.02]"
    >
      <div className="container-wide flex flex-col items-center gap-6 py-9 sm:py-10 lg:flex-row lg:justify-between">
        <p className="text-center text-sm font-medium uppercase tracking-[0.22em] text-white/45 lg:text-left">
          Technology for ambitious businesses
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {BADGES.map((b) => (
            <li
              key={b.label}
              className="flex items-center gap-2 text-sm font-semibold text-white/70 transition-colors hover:text-white"
            >
              <b.icon className="h-4 w-4 text-neon/80" aria-hidden />
              {b.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}