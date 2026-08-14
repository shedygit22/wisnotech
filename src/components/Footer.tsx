import { Youtube, Instagram, Linkedin, Twitter } from "lucide-react";
import Logo from "./Logo";

const SOCIALS = [
  { label: "YouTube", icon: Youtube },
  { label: "Instagram", icon: Instagram },
  { label: "LinkedIn", icon: Linkedin },
  { label: "X", icon: Twitter },
];

const FOOTER_GROUPS = [
  {
    heading: "Company",
    links: [
      { label: "Home", href: "#home" },
      { label: "About", href: "#about" },
      { label: "WINO App", href: "/wino" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "AI & Automation", href: "#services" },
      { label: "Software Development", href: "#services" },
      { label: "Web & Mobile", href: "#services" },
      { label: "AI Education", href: "#services" },
    ],
  },
  {
    heading: "Academy",
    links: [
      { label: "Courses", href: "#/academy" },
      { label: "Curriculum", href: "#/academy" },
      { label: "Waitlist", href: "#contact" },
      { label: "FAQs", href: "#/academy" },
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
              AI, software and digital innovation for a smarter future.
            </p>

            <div className="mt-8 flex items-center gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/60 transition-colors hover:border-white/25 hover:text-white"
                >
                  <social.icon className="h-4 w-4" aria-hidden />
                </a>
              ))}
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
            <a href="#" className="text-sm text-white/40 transition-colors hover:text-white/70">
              Privacy
            </a>
            <a href="#" className="text-sm text-white/40 transition-colors hover:text-white/70">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}