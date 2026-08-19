// =============================================================================
// PORTFOLIO — central config for the AI video samples page (/portfolio).
//
// This is the SINGLE place to add new samples. Copy an entry below, point
// `src`/`poster` at a file in public/ (e.g. /wino/videos/my-clip.mp4) and it
// appears on the page automatically — filters, lightbox and all.
//
// Media is shared with the WINO page (public/wino/...) so nothing is duplicated.
// =============================================================================

export interface PortfolioCategory {
  id: string;
  label: string;
  /** Accent color used across chips, badges and the lightbox. */
  accent: string;
}

export interface PortfolioSample {
  id: string;
  type: "video" | "image";
  title: string;
  description: string;
  category: PortfolioCategory["id"];
  src: string;
  poster?: string;
  /** Intrinsic media size (px) — cards keep the real aspect ratio. */
  width: number;
  height: number;
  tags: string[];
  /** Featured samples get a badge and show first in the grid. */
  featured?: boolean;
  /** `false` hides the sample from the public page. */
  published: boolean;
}

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  { id: "cinematic", label: "Cinematic", accent: "#7aa5ff" },
  { id: "character", label: "Character", accent: "#ff7a9e" },
  { id: "text-to-video", label: "Text to Video", accent: "#3b7bff" },
  { id: "image-to-video", label: "Image to Video", accent: "#8b7aff" },
  { id: "social-media", label: "Social", accent: "#2dd4bf" },
  { id: "advertising", label: "Advertising", accent: "#fbbf24" },
  { id: "ai-image", label: "AI Stills", accent: "#a78bfa" },
  { id: "film", label: "Film", accent: "#f472b6" },
];

export const PORTFOLIO_SAMPLES: PortfolioSample[] = [
  {
    id: "p1",
    type: "video",
    title: "Golden Hour, Lagos",
    description: "Text-to-video street scene with a hand-held camera feel and warm dusk light.",
    category: "text-to-video",
    src: "/wino/videos/showreel-1.mp4",
    poster: "/wino/thumbs/video-thumb-1.jpg",
    width: 480,
    height: 852,
    tags: ["street", "golden hour", "9:16"],
    featured: true,
    published: true,
  },
  {
    id: "p2",
    type: "video",
    title: "Product Launch — 15s",
    description: "Short-form advertising spot built from a single prompt.",
    category: "advertising",
    src: "/wino/videos/showreel-2.mp4",
    poster: "/wino/thumbs/video-thumb-2.jpg",
    width: 720,
    height: 1280,
    tags: ["ad", "product", "9:16"],
    featured: true,
    published: true,
  },
  {
    id: "p3",
    type: "video",
    title: "Portrait Push-In",
    description: "Image-to-video camera push on a still portrait.",
    category: "image-to-video",
    src: "/wino/videos/showreel-3.mp4",
    poster: "/wino/thumbs/video-thumb-3.jpg",
    width: 720,
    height: 1280,
    tags: ["portrait", "camera move", "9:16"],
    featured: true,
    published: true,
  },
  {
    id: "p4",
    type: "video",
    title: "Character Study",
    description: "Consistent character with expressive, natural motion.",
    category: "character",
    src: "/wino/videos/showreel-4.mp4",
    poster: "/wino/thumbs/video-thumb-4.jpg",
    width: 720,
    height: 1280,
    tags: ["character", "motion", "9:16"],
    published: true,
  },
  {
    id: "p5",
    type: "video",
    title: "Social Loop",
    description: "Vertical-format loop built for social feeds.",
    category: "social-media",
    src: "/wino/videos/showreel-5.mp4",
    poster: "/wino/thumbs/video-thumb-5.jpg",
    width: 720,
    height: 1280,
    tags: ["loop", "social", "9:16"],
    published: true,
  },
  {
    id: "p6",
    type: "image",
    title: "Neon Market Still",
    description: "AI image generated with WINO — neon-soaked night market.",
    category: "ai-image",
    src: "/wino/images/1.jpeg",
    width: 1536,
    height: 2752,
    tags: ["neon", "night", "still"],
    published: true,
  },
  {
    id: "p7",
    type: "image",
    title: "Portrait Still",
    description: "AI image generated with WINO — dramatic studio portrait.",
    category: "ai-image",
    src: "/wino/images/2.jpeg",
    width: 1536,
    height: 2752,
    tags: ["portrait", "studio", "still"],
    published: true,
  },
  {
    id: "p8",
    type: "image",
    title: "Landscape Still",
    description: "AI image generated with WINO — expansive cinematic landscape.",
    category: "ai-image",
    src: "/wino/images/3.jpeg",
    width: 1536,
    height: 2752,
    tags: ["landscape", "cinematic", "still"],
    published: true,
  },
  {
    id: "p9",
    type: "video",
    title: "Film Teaser",
    description: "Narrative teaser with filmic grading and moody pacing.",
    category: "film",
    src: "/wino/videos/showreel-6.mp4",
    poster: "/wino/thumbs/video-thumb-6.jpg",
    width: 720,
    height: 1280,
    tags: ["film", "teaser", "9:16"],
    published: true,
  },
  {
    id: "p10",
    type: "video",
    title: "Street Loop 01",
    description: "9:16 text-to-video loop built for portrait feeds.",
    category: "social-media",
    src: "/wino/videos/vertical-01.mp4",
    poster: "/wino/thumbs/vertical-01.jpg",
    width: 406,
    height: 720,
    tags: ["street", "loop", "9:16"],
    published: true,
  },
  {
    id: "p11",
    type: "video",
    title: "Street Loop 02",
    description: "9:16 text-to-video loop built for portrait feeds.",
    category: "social-media",
    src: "/wino/videos/vertical-02.mp4",
    poster: "/wino/thumbs/vertical-02.jpg",
    width: 406,
    height: 720,
    tags: ["street", "loop", "9:16"],
    published: true,
  },
  {
    id: "p12",
    type: "video",
    title: "Street Loop 03",
    description: "9:16 text-to-video loop built for portrait feeds.",
    category: "social-media",
    src: "/wino/videos/vertical-03.mp4",
    poster: "/wino/thumbs/vertical-03.jpg",
    width: 406,
    height: 720,
    tags: ["street", "loop", "9:16"],
    published: true,
  },
  {
    id: "p13",
    type: "video",
    title: "Portrait Moment",
    description: "Vertical cinematic study with shallow depth of field.",
    category: "cinematic",
    src: "/wino/videos/portrait-moment.mp4",
    poster: "/wino/thumbs/portrait-moment.jpg",
    width: 720,
    height: 1280,
    tags: ["portrait", "bokeh", "9:16"],
    published: true,
  },
  {
    id: "p14",
    type: "video",
    title: "Cinematic Scene 01",
    description: "16:9 narrative shot with filmic grading and composed blocking.",
    category: "cinematic",
    src: "/wino/videos/cinematic-01.mp4",
    poster: "/wino/thumbs/cinematic-01.jpg",
    width: 1280,
    height: 720,
    tags: ["16:9", "narrative", "filmic"],
    published: true,
  },
  {
    id: "p15",
    type: "video",
    title: "Cinematic Scene 02",
    description: "16:9 narrative shot with filmic grading and subtle camera drift.",
    category: "cinematic",
    src: "/wino/videos/cinematic-02.mp4",
    poster: "/wino/thumbs/cinematic-02.jpg",
    width: 1280,
    height: 720,
    tags: ["16:9", "narrative", "filmic"],
    published: true,
  },
  {
    id: "p16",
    type: "video",
    title: "Showcase Matrix",
    description: "Wide montage of Seedance 2.0 output in a single frame.",
    category: "cinematic",
    src: "/wino/videos/showcase-matrix.mp4",
    poster: "/wino/thumbs/showcase-matrix.jpg",
    width: 1280,
    height: 720,
    tags: ["montage", "16:9", "multi-scene"],
    featured: true,
    published: true,
  },
  {
    id: "p17",
    type: "video",
    title: "Seedance 2.0 Demo",
    description: "Text-to-video generation sample at a wide cinematic aspect.",
    category: "text-to-video",
    src: "/wino/videos/seedance-demo.mp4",
    poster: "/wino/thumbs/seedance-demo.jpg",
    width: 1280,
    height: 548,
    tags: ["text-to-video", "wide", "demo"],
    published: true,
  },
  {
    id: "p18",
    type: "video",
    title: "Action Sequence",
    description: "Extended vertical character sequence with quick cuts and energy.",
    category: "character",
    src: "/wino/videos/johnwick-character.mp4",
    poster: "/wino/thumbs/johnwick-character.jpg",
    width: 1080,
    height: 1920,
    tags: ["action", "character", "9:16"],
    featured: true,
    published: true,
  },
  {
    id: "p19",
    type: "video",
    title: "Factory Ninja",
    description: "Cinematic character vignette set in a gritty workshop.",
    category: "character",
    src: "/wino/videos/factory-ninja.mp4",
    poster: "/wino/thumbs/factory-ninja.jpg",
    width: 1280,
    height: 720,
    tags: ["character", "16:9", "workshop"],
    published: true,
  },
];

/** Published samples, featured first, then original order. */
export function loadPortfolioSamples(): PortfolioSample[] {
  return PORTFOLIO_SAMPLES.filter((s) => s.published).sort(
    (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false)
  );
}

export function categoryById(id: string): PortfolioCategory | undefined {
  return PORTFOLIO_CATEGORIES.find((c) => c.id === id);
}