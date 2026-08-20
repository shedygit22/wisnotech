import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { applyPageMeta } from "../lib/seo";

interface Block {
  heading: string;
  body: string;
}

interface LegalContent {
  title: string;
  eyebrow: string;
  intro: string;
  updated: string;
  sections: Block[];
}

const PRIVACY: LegalContent = {
  title: "Privacy Policy",
  eyebrow: "Wisnotech",
  intro:
    "This policy explains what information we collect when you use the Wisnotech website, how we use it, and the choices you have.",
  updated: "Last updated: August 2026",
  sections: [
    {
      heading: "Information we collect",
      body:
        "When you use the contact form, AI assistant or course enquiry forms, we collect the details you choose to provide — such as your name, email address, company and project information.",
    },
    {
      heading: "How we use your information",
      body:
        "We use the information you provide to respond to your enquiries, prepare project proposals, manage course enquiries and improve our services. We do not sell your personal information.",
    },
    {
      heading: "Analytics and site data",
      body:
        "Like most websites, we may collect basic technical data (such as browser type and pages visited) to understand how the site is used and keep it working reliably.",
    },
    {
      heading: "AI assistant",
      body:
        "Conversations with the Wisnotech AI assistant are used to answer your questions and may be reviewed to improve its responses. Avoid sharing sensitive personal or financial details in chat.",
    },
    {
      heading: "Data sharing",
      body:
        "We do not rent or sell your personal information. We only share data with service providers needed to operate the site (such as hosting) or when required by law.",
    },
    {
      heading: "Contact us",
      body:
        "Questions about this policy? Email wisnotech@gmail.com or message +234 915 354 1297.",
    },
  ],
};

const TERMS: LegalContent = {
  title: "Terms of Service",
  eyebrow: "Wisnotech",
  intro:
    "These terms govern your use of the Wisnotech website and services. By using the site, you agree to these terms.",
  updated: "Last updated: August 2026",
  sections: [
    {
      heading: "Our services",
      body:
        "Wisnotech provides AI solutions, automation, software development and digital growth services. Project specifics, scope, pricing and timelines are agreed in writing for each engagement.",
    },
    {
      heading: "Quotes and payment",
      body:
        "Every project is scoped before work begins and you receive a clear quote upfront. Payment terms are confirmed per project. Prices shown on the site are starting points unless stated otherwise.",
    },
    {
      heading: "Intellectual property",
      body:
        "Once a project is paid for in full, deliverables are yours per the agreed terms. Wisnotech may showcase completed work in its portfolio unless we agree otherwise.",
    },
    {
      heading: "Your use of the site",
      body:
        "You agree not to misuse the website, interfere with its operation, or attempt to access systems you are not authorised to use.",
    },
    {
      heading: "Limitation of liability",
      body:
        "The site and its content are provided as-is. To the fullest extent permitted by law, Wisnotech is not liable for indirect or consequential losses arising from use of the site or services.",
    },
    {
      heading: "Contact us",
      body:
        "Questions about these terms? Email wisnotech@gmail.com or message +234 915 354 1297.",
    },
  ],
};

export default function LegalPage({ kind }: { kind: "privacy" | "terms" }) {
  const content = kind === "privacy" ? PRIVACY : TERMS;

  useEffect(() => {
    applyPageMeta({
      title: `${content.title} — Wisnotech`,
      description: content.intro,
      path: `/${kind}`,
      type: "website",
    });
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [kind, content]);

  return (
    <div className="relative min-h-screen bg-background text-white">
      <Navbar />
      <main className="pt-28 pb-24 md:pt-36 md:pb-32">
        <div className="container-wide max-w-3xl">
          <a
            href="/"
            className="group inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
            Back to home
          </a>
          <p className="eyebrow mt-10">{content.eyebrow}</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            {content.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">{content.intro}</p>
          <p className="mt-2 text-sm text-white/45">{content.updated}</p>

          <div className="mt-12 space-y-10 border-t border-white/10 pt-10">
            {content.sections.map((s) => (
              <div key={s.heading}>
                <h2 className="text-lg font-semibold text-white">{s.heading}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}