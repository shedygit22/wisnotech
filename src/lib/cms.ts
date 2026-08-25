/**
 * CMS Content Loader
 *
 * Reads content JSON files at build time via Vite's import.meta.glob.
 * Page components import from here to get CMS-managed content.
 * Falls back to hardcoded defaults if CMS content is missing.
 */

// Vite imports all JSON files in content/cms/ at build time
const cmsModules = import.meta.glob("/content/cms/*.json", { eager: true }) as Record<string, { default: Record<string, unknown> }>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadPage<T extends Record<string, any>>(slug: string): T | null {
  const key = `/content/cms/${slug}.json`;
  const mod = cmsModules[key];
  if (!mod) return null;
  const data = { ...mod.default };
  // Remove internal fields
  delete data._createdAt;
  delete data._updatedAt;
  return data as T;
}

// --- Page content types ---
export interface MasterclassContent {
  title: string;
  hero: { tagline: string; headline: string; subheadline: string; description: string };
  pricing: { earlyBird: number; latePrice: number; save: number; deadlineNote: string };
  tools: { name: string; image: string; description: string }[];
  modules: { n: string; title: string; desc: string; bullets: string[] }[];
  projects: { n: string; title: string; desc: string }[];
  paymentMethods: { label: string; provider: string; url: string; image: string; currency: string; price: number }[];
  faqs: { q: string; a: string }[];
  images: { instructor?: string };
}

export interface AcademyContent {
  title: string;
  hero: { headline: string; subheadline: string };
  curriculum: { n: string; title: string; desc: string; bullets: string[] }[];
  pricing: { tiers: { name: string; price: number; currency: string; usdPrice: number; features: string[] }[] };
  faqs: { q: string; a: string }[];
}

export interface TrainingContent {
  title: string;
  hero: { headline: string; subheadline: string };
  curriculum: { n: string; title: string; desc: string; bullets: string[] }[];
  pricing: { price: number; currency: string; usdPrice: number };
  projects: { n: string; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  testimonials: { name: string; role: string; text: string }[];
  resources: { name: string; desc: string }[];
}

export interface FaeContent {
  title: string;
  hero: { headline: string; subheadline: string };
  curriculum: { month: string; title: string; topics: string[] }[];
  pricing: { price: number; currency: string; usdPrice: number };
  builds: { n: string; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  images: { flyer?: string };
}

export interface PortfolioContent {
  title: string;
  hero: { headline: string; subheadline: string };
  audiences: { icon: string; title: string; desc: string }[];
  services: { title: string; desc: string }[];
  pricing: { name: string; price: string; includes: string[] }[];
  process: { n: string; title: string; desc: string }[];
  whyWisnotech: { title: string; desc: string }[];
  ecosystem: { name: string; desc: string }[];
  faqs: { q: string; a: string }[];
  images: { og?: string };
}

export interface HomepageContent {
  title: string;
  hero: { headline: string; subheadline: string };
  nav: { label: string; href: string }[];
  services: { title: string; desc: string }[];
  solutions: { title: string; desc: string }[];
}

// --- Exported loaders with type safety ---
export function getMasterclassContent(): MasterclassContent | null {
  return loadPage<MasterclassContent>("masterclass");
}

export function getAcademyContent(): AcademyContent | null {
  return loadPage<AcademyContent>("academy");
}

export function getTrainingContent(): TrainingContent | null {
  return loadPage<TrainingContent>("training");
}

export function getFaeContent(): FaeContent | null {
  return loadPage<FaeContent>("fae");
}

export function getPortfolioContent(): PortfolioContent | null {
  return loadPage<PortfolioContent>("portfolio");
}

export function getHomepageContent(): HomepageContent | null {
  return loadPage<HomepageContent>("homepage");
}
