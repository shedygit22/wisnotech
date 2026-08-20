export const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Solutions", href: "#solutions" },
  { label: "Our Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const SERVICES = [
  {
    icon: "workflow",
    title: "AI & Automation",
    description:
      "Build intelligent workflows, AI assistants and automated business systems that remove repetitive work.",
  },
  {
    icon: "video",
    title: "AI Video Content Creation",
    description:
      "Scripts, AI avatars, editing and motion graphics that produce studio-grade videos without a studio.",
  },
  {
    icon: "code",
    title: "Software Development",
    description:
      "Custom web applications, SaaS platforms and business software engineered to scale with you.",
  },
  {
    icon: "devices",
    title: "Web & Mobile",
    description:
      "Modern websites and mobile applications designed around real users and real results.",
  },
  {
    icon: "education",
    title: "AI Education",
    description:
      "Practical AI training for businesses, creators, professionals and ambitious entrepreneurs.",
  },
  {
    icon: "compass",
    title: "AI Consulting",
    description:
      "Clear guidance on where AI creates real value in your business — and how to get there.",
  },
] as const;

export const VIDEOS = [
  {
    title: "Showreel 01",
    category: "AI Video",
    src: "/videos/showreel-1.mp4",
    poster: "/assets/video-thumb-1.jpg",
  },
  {
    title: "Showreel 02",
    category: "AI Video",
    src: "/videos/showreel-2.mp4",
    poster: "/assets/video-thumb-2.jpg",
  },
  {
    title: "Showreel 03",
    category: "AI Video",
    src: "/videos/showreel-3.mp4",
    poster: "/assets/video-thumb-3.jpg",
  },
  {
    title: "Showreel 04",
    category: "AI Video",
    src: "/videos/showreel-4.mp4",
    poster: "/assets/video-thumb-4.jpg",
  },
  {
    title: "Showreel 05",
    category: "AI Video",
    src: "/videos/showreel-5.mp4",
    poster: "/assets/video-thumb-5.jpg",
  },
  {
    title: "Showreel 06",
    category: "AI Video",
    src: "/videos/showreel-6.mp4",
    poster: "/assets/video-thumb-6.jpg",
  },
  {
    title: "Shop the Look",
    category: "AI Video",
    src: "/videos/showreel-7.mp4",
    poster: "/assets/video-thumb-7.jpg",
  },
  {
    title: "Showreel 08",
    category: "AI Video",
    src: "/videos/showreel-8.mp4",
    poster: "/assets/video-thumb-8.jpg",
  },
  {
    title: "Showreel 09",
    category: "AI Video",
    src: "/videos/showreel-9.mp4",
    poster: "/assets/video-thumb-9.jpg",
  },
  {
    title: "Showreel 10",
    category: "AI Video",
    src: "/videos/showreel-10.mp4",
    poster: "/assets/video-thumb-10.jpg",
  },
] as const;

export const AI_IMAGES: { src: string; title: string; caption?: string }[] = Array.from(
  { length: 20 },
  (_, i) => ({
    src: `/assets/ai-images/${i + 1}.jpeg`,
    title: `Creation ${String(i + 1).padStart(2, "0")}`,
    caption: "AI-generated visual",
  })
);

export const SOLUTIONS = [
  { icon: "bot", label: "AI Agents" },
  { icon: "workflow", label: "Business Automation" },
  { icon: "layers", label: "SaaS Platforms" },
  { icon: "globe", label: "Web Applications" },
  { icon: "smartphone", label: "Mobile Applications" },
  { icon: "sparkles", label: "AI Content Systems" },
  { icon: "package", label: "Digital Products" },
  { icon: "cpu", label: "Custom AI Solutions" },
] as const;