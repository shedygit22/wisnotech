import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { applyPageMeta, breadcrumbSchema, orgSchema } from "../lib/seo";
import { WinoHero } from "./wino/WinoHero";
import { WinoShowcase } from "./wino/WinoShowcase";
import { FeatureGrid } from "./wino/FeatureGrid";
import { PromptDemo } from "./wino/PromptDemo";
import { Workflow } from "./wino/Workflow";
import { AfricaSection } from "./wino/AfricaSection";
import { Pricing } from "./wino/Pricing";
import { DownloadSection } from "./wino/DownloadSection";
import { DownloadTrust } from "./wino/DownloadTrust";
import { ReferralSection } from "./wino/ReferralSection";
import { Faq } from "./wino/Faq";
import { FinalCta } from "./wino/FinalCta";

const FOOTER_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Showcase", href: "#showcase" },
  { label: "Pricing", href: "#pricing" },
  { label: "Download", href: "#download" },
  { label: "FAQ", href: "#faq" },
] as const;

/** WINO — dedicated product page at /wino. Standalone; never touches home UI. */
export default function WinoPage() {
  useEffect(() => {
    applyPageMeta({
      title: "WINO — AI Video Generator for Creators | Wisnotech",
      description:
        "WINO is an AI video creation app by Wisnotech, built to help creators turn prompts and images into AI-powered videos directly from Android.",
      path: "/wino",
      type: "website",
      image: "https://wisnotech.vercel.app/assets/wisnotech-logo.png",
      jsonLd: [
        orgSchema(),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "WINO — AI Video Generation", path: "/wino" },
        ]),
      ],
    });
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-white">
      {/* WINO header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#080808]/85 backdrop-blur-md">
        <nav className="container-wide flex h-16 items-center justify-between py-4" aria-label="WINO navigation">
          <a href="/" aria-label="Wisnotech home">
            <span className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-bold text-sm text-[#080808]">
                W
              </span>
              <span className="text-sm font-semibold tracking-wide text-white">
                WINO <span className="font-normal text-white/40">by Wisnotech</span>
              </span>
            </span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          <a
            href="/"
            className="group inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/35 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
            <span className="hidden sm:inline">Back to Wisnotech</span>
            <span className="sm:hidden">Home</span>
          </a>
        </nav>
      </header>

      <main>
        <WinoHero />
        <ReferralSection />
        <WinoShowcase />
        <FeatureGrid />
        <PromptDemo />
        <Workflow />
        <AfricaSection />
        <Pricing />
        <DownloadSection />
        <DownloadTrust />
        <Faq />
        <FinalCta />
      </main>

      {/* WINO footer */}
      <footer className="border-t border-white/10 bg-[#0a0a0a]">
        <div className="container-wide py-14 md:py-16">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-sm">
              <span className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-bold text-sm text-[#080808]">
                  W
                </span>
                <span className="text-base font-semibold tracking-wide text-white">WINO</span>
              </span>
              <p className="mt-3 text-sm text-white/50">A Wisnotech product.</p>
            </div>

            <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3" aria-label="WINO footer navigation">
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="text-sm text-white/55 transition-colors hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#showcase" className="text-sm text-white/55 transition-colors hover:text-white">
                    Showcase
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-sm text-white/55 transition-colors hover:text-white">
                    Pricing
                  </a>
                </li>
              </ul>
              <ul className="space-y-3">
                <li>
                  <a href="#download" className="text-sm text-white/55 transition-colors hover:text-white">
                    Download
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-sm text-white/55 transition-colors hover:text-white">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="/" className="text-sm text-white/55 transition-colors hover:text-white">
                    Wisnotech
                  </a>
                </li>
              </ul>
              <ul className="space-y-3">
                <li>
                  <a href="/" className="text-sm text-white/55 transition-colors hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="/" className="text-sm text-white/55 transition-colors hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="/#contact" className="text-sm text-white/55 transition-colors hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <motion.div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
            <p className="text-sm text-white/40">
              © {new Date().getFullYear()} Wisnotech. WINO is a Wisnotech product.
            </p>
            <p className="text-sm text-white/30">Made in Nigeria, for the world.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}