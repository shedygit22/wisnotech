// =============================================================================
// WINO — central product configuration.
//
// This is the SINGLE place to edit WINO's public product details: download
// URLs, store links, pricing, showcase media and copy. Components only read
// from this module — change things here, never in individual components.
//
// Public URLs can also be set via Vite env vars (see .env.example) which take
// precedence over the defaults below:
//   VITE_WINO_DOWNLOAD_URL     direct APK download link
//   VITE_WINO_GALAXY_STORE_URL Samsung Galaxy Store listing
//   VITE_WINO_AMAZON_STORE_URL Amazon Appstore listing
//
// IMPORTANT: no private credentials ever belong here. This module only holds
// public marketing content. If media is private, serve it from a secure
// backend via signed URLs instead of putting it in this file.
// =============================================================================

export interface WinoMediaItem {
  /** Stable id (used by an admin/backend later). */
  id: string;
  /** "video" | "image" */
  type: "video" | "image";
  title: string;
  description?: string;
  /** One of the showcase categories below. */
  category: WinoCategory;
  /** Media URL. Empty string renders a graceful "sample pending" card. */
  src: string;
  /** Poster/thumbnail URL. For images this falls back to `src`. */
  poster?: string;
  /** Intrinsic media size (px). Used so cards keep each item's real aspect ratio. */
  width: number;
  height: number;
  /** Featured items appear first / get a badge. */
  featured?: boolean;
  /** `false` hides the item from the public gallery (like an admin unpublish). */
  published: boolean;
  /** Manual display order (ascending). */
  order: number;
}

export type WinoCategory =
  | "ai-video"
  | "ai-image"
  | "text-to-video"
  | "image-to-video"
  | "cinematic"
  | "advertising"
  | "character"
  | "social-media"
  | "film";

export const WINO_CATEGORIES: { id: WinoCategory; label: string }[] = [
  { id: "ai-video", label: "AI Videos" },
  { id: "ai-image", label: "AI Images" },
  { id: "text-to-video", label: "Text to Video" },
  { id: "image-to-video", label: "Image to Video" },
  { id: "cinematic", label: "Cinematic" },
  { id: "advertising", label: "Advertising" },
  { id: "character", label: "Character" },
  { id: "social-media", label: "Social Media" },
  { id: "film", label: "Film" },
];

/**
 * SHOWCASE MEDIA
 * --------------
 * Upload your real WINO videos to public/wino/videos/, thumbnails to
 * public/wino/thumbs/ and images to public/wino/images/, then point the
 * entries below at them (e.g. src: "/wino/videos/my-clip.mp4").
 *
 * `placeholder: true` items are marked with a "Demo" badge so they are never
 * mistaken for real WINO output. When you have real samples, drop the flag.
 *
 * A future admin/backend can replace `loadShowcaseItems()` with a fetch to a
 * CMS/API that returns the same shape (id, type, title, category, src, poster,
 * featured, published, order) — the gallery UI will work unchanged.
 */
export const WINO_SHOWCASE: WinoMediaItem[] = [
  {
    id: "w1",
    type: "video",
    title: "Lagos at Golden Hour",
    description: "Text-to-video street scene with hand-held camera feel.",
    category: "text-to-video",
    src: "/wino/videos/showreel-1.mp4",
    poster: "/wino/thumbs/video-thumb-1.jpg",
    width: 480,
    height: 852,
    featured: true,
    published: true,
    order: 1,
  },
  {
    id: "w2",
    type: "video",
    title: "Product Launch — 15s Ad",
    description: "Short-form advertising spot built from a single prompt.",
    category: "advertising",
    src: "/wino/videos/showreel-2.mp4",
    poster: "/wino/thumbs/video-thumb-2.jpg",
    width: 720,
    height: 1280,
    featured: true,
    published: true,
    order: 2,
  },
  {
    id: "w3",
    type: "video",
    title: "Cinematic Portrait Study",
    description: "Image-to-video camera push on a still portrait.",
    category: "image-to-video",
    src: "/wino/videos/showreel-3.mp4",
    poster: "/wino/thumbs/video-thumb-3.jpg",
    width: 720,
    height: 1280,
    featured: true,
    published: true,
    order: 3,
  },
  {
    id: "w4",
    type: "video",
    title: "Character Moment",
    description: "Consistent character, expressive motion.",
    category: "character",
    src: "/wino/videos/showreel-4.mp4",
    poster: "/wino/thumbs/video-thumb-4.jpg",
    width: 720,
    height: 1280,
    published: true,
    order: 4,
  },
  {
    id: "w5",
    type: "video",
    title: "Social Loop",
    description: "Vertical-format loop built for social feeds.",
    category: "social-media",
    src: "/wino/videos/showreel-5.mp4",
    poster: "/wino/thumbs/video-thumb-5.jpg",
    width: 720,
    height: 1280,
    published: true,
    order: 5,
  },
  {
    id: "w6",
    type: "image",
    title: "Still Frame — Neon Market",
    description: "AI image generated in WINO.",
    category: "ai-image",
    src: "/wino/images/1.jpeg",
    width: 1536,
    height: 2752,
    published: true,
    order: 6,
  },
  {
    id: "w7",
    type: "image",
    title: "Still Frame — Portrait",
    description: "AI image generated in WINO.",
    category: "ai-image",
    src: "/wino/images/2.jpeg",
    width: 1536,
    height: 2752,
    published: true,
    order: 7,
  },
  {
    id: "w8",
    type: "image",
    title: "Still Frame — Landscape",
    description: "AI image generated in WINO.",
    category: "ai-image",
    src: "/wino/images/3.jpeg",
    width: 1536,
    height: 2752,
    published: true,
    order: 8,
  },
  {
    id: "w9",
    type: "video",
    title: "Film Style — Teaser",
    description: "Narrative teaser with filmic grading.",
    category: "film",
    src: "/wino/videos/showreel-6.mp4",
    poster: "/wino/thumbs/video-thumb-6.jpg",
    width: 720,
    height: 1280,
    published: true,
    order: 9,
  },
  {
    id: "w10",
    type: "video",
    title: "Vertical Street Clip 01",
    description: "9:16 text-to-video loop built for portrait feeds.",
    category: "social-media",
    src: "/wino/videos/vertical-01.mp4",
    poster: "/wino/thumbs/vertical-01.jpg",
    width: 406,
    height: 720,
    published: true,
    order: 10,
  },
  {
    id: "w11",
    type: "video",
    title: "Vertical Street Clip 02",
    description: "9:16 text-to-video loop built for portrait feeds.",
    category: "social-media",
    src: "/wino/videos/vertical-02.mp4",
    poster: "/wino/thumbs/vertical-02.jpg",
    width: 406,
    height: 720,
    published: true,
    order: 11,
  },
  {
    id: "w12",
    type: "video",
    title: "Vertical Street Clip 03",
    description: "9:16 text-to-video loop built for portrait feeds.",
    category: "social-media",
    src: "/wino/videos/vertical-03.mp4",
    poster: "/wino/thumbs/vertical-03.jpg",
    width: 406,
    height: 720,
    published: true,
    order: 12,
  },
  {
    id: "w13",
    type: "video",
    title: "Portrait Moment",
    description: "Vertical cinematic study with shallow depth of field.",
    category: "cinematic",
    src: "/wino/videos/portrait-moment.mp4",
    poster: "/wino/thumbs/portrait-moment.jpg",
    width: 720,
    height: 1280,
    published: true,
    order: 13,
  },
  {
    id: "w14",
    type: "video",
    title: "Cinematic Scene 01",
    description: "16:9 narrative shot with filmic grading.",
    category: "cinematic",
    src: "/wino/videos/cinematic-01.mp4",
    poster: "/wino/thumbs/cinematic-01.jpg",
    width: 1280,
    height: 720,
    published: true,
    order: 14,
  },
  {
    id: "w15",
    type: "video",
    title: "Cinematic Scene 02",
    description: "16:9 narrative shot with filmic grading.",
    category: "cinematic",
    src: "/wino/videos/cinematic-02.mp4",
    poster: "/wino/thumbs/cinematic-02.jpg",
    width: 1280,
    height: 720,
    published: true,
    order: 15,
  },
  {
    id: "w16",
    type: "video",
    title: "Showcase Matrix",
    description: "Wide montage of Seedance 2.0 output in one frame.",
    category: "ai-video",
    src: "/wino/videos/showcase-matrix.mp4",
    poster: "/wino/thumbs/showcase-matrix.jpg",
    width: 1280,
    height: 720,
    featured: true,
    published: true,
    order: 16,
  },
  {
    id: "w17",
    type: "video",
    title: "Seedance 2.0 Demo",
    description: "Text-to-video generation sample at wide aspect.",
    category: "text-to-video",
    src: "/wino/videos/seedance-demo.mp4",
    poster: "/wino/thumbs/seedance-demo.jpg",
    width: 1280,
    height: 548,
    published: true,
    order: 17,
  },
  {
    id: "w18",
    type: "video",
    title: "Character Action",
    description: "Extended vertical character sequence with quick cuts.",
    category: "character",
    src: "/wino/videos/johnwick-character.mp4",
    poster: "/wino/thumbs/johnwick-character.jpg",
    width: 1080,
    height: 1920,
    featured: true,
    published: true,
    order: 18,
  },
  {
    id: "w19",
    type: "video",
    title: "Factory Ninja",
    description: "Cinematic character vignette set in a workshop.",
    category: "character",
    src: "/wino/videos/factory-ninja.mp4",
    poster: "/wino/thumbs/factory-ninja.jpg",
    width: 1280,
    height: 720,
    published: true,
    order: 19,
  },
];

/**
 * Loads the gallery items. Kept as a function so a future admin/backend can
 * swap the implementation (fetch from an API) without touching the UI.
 */
export function loadShowcaseItems(): WinoMediaItem[] {
  return WINO_SHOWCASE;
}

// -----------------------------------------------------------------------------
// DOWNLOADS & STORES
// -----------------------------------------------------------------------------

export interface StoreLink {
  /** "available" when published, "coming-soon" otherwise. */
  status: "available" | "coming-soon";
  label: string;
  url: string;
  note?: string;
}

/** Direct APK download (https://). Leave empty until you publish one. */
export const WINO_DOWNLOAD_URL =
  (import.meta.env.VITE_WINO_DOWNLOAD_URL as string | undefined) ?? "";

export const WINO_STORES: StoreLink[] = [
  {
    status: "coming-soon",
    label: "Samsung Galaxy Store",
    url: (import.meta.env.VITE_WINO_GALAXY_STORE_URL as string | undefined) ?? "",
    note: "Coming soon",
  },
  {
    status: "coming-soon",
    label: "Amazon Appstore",
    url: (import.meta.env.VITE_WINO_AMAZON_STORE_URL as string | undefined) ?? "",
    note: "Coming soon",
  },
];

// -----------------------------------------------------------------------------
// RELEASE / TRUST INFO (update these when you ship a new build)
// -----------------------------------------------------------------------------

export const WINO_RELEASE = {
  version: "1.0.0",
  releaseDate: "Upcoming release",
  fileSize: "Pending",
  lastUpdated: "TBD",
};

// -----------------------------------------------------------------------------
// FEATURES
// -----------------------------------------------------------------------------

export interface WinoFeature {
  title: string;
  description: string;
}

export const WINO_FEATURES: WinoFeature[] = [
  {
    title: "Text-to-Video",
    description: "Turn a written prompt into a moving scene, directly on your phone.",
  },
  {
    title: "Image-to-Video",
    description: "Bring a photo or still frame to life with natural motion.",
  },
  {
    title: "AI Image Creation",
    description: "Generate polished stills to use on their own or as video frames.",
  },
  {
    title: "Prompt Improvement",
    description: "WINO refines rough ideas into detailed cinematic prompts before you spend credits.",
  },
  {
    title: "Mobile-First Creation",
    description: "Designed for Android creators — no desktop or studio required.",
  },
  {
    title: "Credit-Based Generation",
    description: "Pay for what you generate, starting with affordable starter credit.",
  },
  {
    title: "Video History & Downloads",
    description: "Every generation is saved to your history so you can review and download.",
  },
];

// -----------------------------------------------------------------------------
// PROMPT INTELLIGENCE DEMO
// -----------------------------------------------------------------------------

export const PROMPT_DEMO = {
  original: "woman walking in Lagos",
  improved:
    "A young Nigerian woman in a flowing ankara dress walks along a sunlit Lagos street at golden hour, surrounded by warm market life and soft haze. Camera follows her in a slow tracking shot, shallow depth of field, cinematic 35mm grade, low-angle warm lighting, balanced composition with the street leading into the frame.",
  explanation:
    "WINO expands your idea into a full visual brief — subject, action, environment, camera movement, lighting and composition — before you spend a single credit.",
};

// -----------------------------------------------------------------------------
// CREATOR WORKFLOW
// -----------------------------------------------------------------------------

export const WORKFLOW_STEPS = [
  { step: "Idea", detail: "Start with a thought or a rough concept." },
  { step: "Prompt", detail: "Describe your scene in your own words." },
  { step: "Improve", detail: "WINO sharpens it into a cinematic prompt." },
  { step: "Generate", detail: "Spend credits to create your video." },
  { step: "Review", detail: "Watch, iterate and refine the result." },
  { step: "Download", detail: "Export and share your finished video." },
] as const;

// -----------------------------------------------------------------------------
// PRICING PREVIEW — configurable. Edit here; the UI renders whatever you set.
// -----------------------------------------------------------------------------

export interface WinoPlan {
  id: string;
  name: string;
  tagline: string;
  /** Display price, e.g. "$0", "$9.99". Leave as string so you control formatting. */
  price: string;
  priceNote: string;
  credits: string;
  capacity: string;
  features: string[];
  featured?: boolean;
  ctaLabel: string;
}

export const WINO_PLANS: WinoPlan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Try WINO and make your first videos.",
    price: "$0",
    priceNote: "One-time trial credits",
    credits: "15 credits",
    capacity: "~1–2 short videos",
    features: [
      "Text-to-video",
      "AI image creation",
      "Prompt improvement",
      "Video history",
    ],
    ctaLabel: "Download WINO",
  },
  {
    id: "creator",
    name: "Creator",
    tagline: "For regular creators making weekly content.",
    price: "$9.99",
    priceNote: "per month",
    credits: "150 credits",
    capacity: "~15–25 short videos",
    features: [
      "Everything in Starter",
      "Image-to-video",
      "Higher resolution outputs",
      "Faster generation queue",
      "Priority support",
    ],
    featured: true,
    ctaLabel: "Download WINO",
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Serious output for agencies and professionals.",
    price: "$24.99",
    priceNote: "per month",
    credits: "450 credits",
    capacity: "~50–75 short videos",
    features: [
      "Everything in Creator",
      "Largest credit packs",
      "Film & cinematic presets",
      "Batch creation",
    ],
    ctaLabel: "Download WINO",
  },
  {
    id: "payg",
    name: "Pay As You Go",
    tagline: "Flexible credits, no subscription.",
    price: "From $1",
    priceNote: "per credit pack",
    credits: "Any pack size",
    capacity: "Spend when you create",
    features: [
      "All creation features",
      "No recurring billing",
      "Credits never expire",
      "Available on demand",
    ],
    ctaLabel: "Download WINO",
  },
];

// -----------------------------------------------------------------------------
// FAQ
// -----------------------------------------------------------------------------

export const WINO_FAQ: { q: string; a: string }[] = [
  {
    q: "What is WINO?",
    a: "WINO is a mobile-first AI video generation app for Android, created by Wisnotech. It helps African creators and storytellers turn text and images into AI-generated videos using an affordable, credit-based model.",
  },
  {
    q: "What can WINO create?",
    a: "WINO is designed for AI video creation — text-to-video, image-to-video and AI image generation. You can create short cinematic scenes, advertising clips, character moments, social media loops and more, all from your phone.",
  },
  {
    q: "Can I generate videos from text?",
    a: "Yes. WINO supports text-to-video: describe a scene, and WINO converts your prompt into a generated video.",
  },
  {
    q: "Can I animate images?",
    a: "Yes. WINO supports image-to-video, letting you bring a still photo or generated frame to life with motion.",
  },
  {
    q: "How does the credit system work?",
    a: "WINO uses a credit-based model. Each generation uses a number of credits, and you can start with affordable trial credits or buy packs. Subscriptions bundle larger credit allowances for regular creators. WINO also suggests prompt improvements so you spend credits wisely.",
  },
  {
    q: "Is WINO available on Android?",
    a: "Yes, WINO is being built for Android and is distributed as an APK. We are also preparing listings for the Samsung Galaxy Store and Amazon Appstore.",
  },
  {
    q: "Where can I download WINO?",
    a: "Always download WINO from official Wisnotech channels — this page and Wisnotech's official accounts. We will add verified store links here as soon as they are live.",
  },
  {
    q: "Why isn't WINO on Google Play yet?",
    a: "WINO is launching directly to creators first. A Google Play release is planned, but for now the official APK is the recommended way to install it.",
  },
  {
    q: "How do I get support?",
    a: "Contact Wisnotech at wisnotech@gmail.com or through the contact section of this site. We're happy to help with installs, credits and creating.",
  },
];
