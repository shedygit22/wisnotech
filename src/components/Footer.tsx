import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Logo from "./Logo";

const FOOTER_GROUPS = [
  {
    heading: "Company",
    links: [
      { label: "About", href: "/#about" },
      { label: "Our Work", href: "/#work" },
      { label: "Studio Portfolio", href: "/portfolio" },
      { label: "WINO App", href: "/wino" },
      { label: "AI Academy", href: "/#/academy" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "AI Solutions", href: "/#services" },
      { label: "AI Automation", href: "/#automation" },
      { label: "Software Development", href: "/#services" },
      { label: "Digital Growth", href: "/#services" },
      { label: "Business Management Systems", href: "/#services" },
    ],
  },
  {
    heading: "Get Started",
    links: [
      { label: "Start a Project", href: "/#contact" },
      { label: "Talk on WhatsApp", href: "https://wa.me/2349153541297" },
      { label: "Email Us", href: "mailto:wisnotech@gmail.com" },
      { label: "Call Us", href: "tel:+2349153541297" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a]">
      <div className="container-wide py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <a href="#home" aria-label="Wisnotech home" className="inline-block">
              <Logo />
            </a>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-muted">
              AI • Software • Automation • Digital Growth
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/45">
              We help businesses build AI solutions, automate workflows, develop
              custom software and create digital systems designed for growth.
            </p>

            <div className="mt-7 flex flex-col gap-2.5 text-sm text-white/60">
              <a
                href="mailto:wisnotech@gmail.com"
                className="inline-flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 text-neon" aria-hidden />
                wisnotech@gmail.com
              </a>
              <a
                href="https://wa.me/2349153541297"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <MessageCircle className="h-4 w-4 text-emerald-400" aria-hidden />
                +234 915 354 1297
              </a>
              <span className="inline-flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-white/50" aria-hidden />
                +234 915 354 1297
              </span>
              <span className="inline-flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-white/50" aria-hidden />
                Forest Guard Street, Uromi, Edo State, Nigeria
              </span>
            </div>
          </div>

          <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3" aria-label="Footer navigation">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.heading}>
                <h3 className="text-sm font-semibold text-white">{group.heading}</h3>
                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-sm text-white/55 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 border-t border-white/10 pt-8 sm:flex-row sm:justify-between">
          <p className="text-sm text-white/40">© 2026 Wisnotech. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="text-sm text-white/40 transition-colors hover:text-white/70">
              Privacy
            </a>
            <a href="/terms" className="text-sm text-white/40 transition-colors hover:text-white/70">
              Terms
            </a>
            <a
              href="/#contact"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors hover:text-neon"
            >
              Start a Project
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}