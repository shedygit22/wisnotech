// Prerenders the blog to real static HTML files in dist/ so crawlers (Google,
// GPTBot, PerplexityBot, ClaudeBot…) see the full article without executing JS.
// Also writes sitemap.xml, llms.txt, llms-full.txt and an RSS feed.
//
// Run AFTER `vite build` (wired into `npm run build`).

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  renderMarkdown,
  parseFrontmatter,
  readingTime,
  stripMarkdown,
} from "../src/lib/blog-core.mjs";

const SITE_URL = "https://wisnotech.vercel.app";
const DIST = "dist";
const CONTENT = "content/blog";

const indexHtml = readFileSync(join(DIST, "index.html"), "utf8");

function extractAssets(html) {
  const links = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/g)].map((m) => m[0]);
  const scripts = [...html.matchAll(/<script[^>]+type="module"[^>]*><\/script>/g)].map((m) => m[0]);
  // Keep font preloads/preconnects too
  const extras = [...html.matchAll(/<link[^>]+rel="preconnect"[^>]*>|<link[^>]+rel="preload"[^>]*>/g)].map((m) => m[0]);
  return { links, scripts, extras };
}

const assets = extractAssets(indexHtml);

const HEAD_TOP = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/assets/wisnotech-favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#080808" />
`;

const ASSET_INJECT = `
    ${assets.extras.join("\n    ")}
    ${assets.links.join("\n    ")}
`;

/** Third-party embed shown on every page (kept in sync with index.html). */
const WIDGET_SCRIPT = "";

function escapeAttr(s) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function pageTemplate(title, description, canonical, ogImage, jsonLd, body) {
  const og = ogImage && !ogImage.startsWith("http") ? `${SITE_URL}${ogImage}` : ogImage;
  return `${HEAD_TOP}
    <title>${escapeAttr(title)}</title>
    <meta name="description" content="${escapeAttr(description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Wisnotech" />
    <meta property="og:title" content="${escapeAttr(title)}" />
    <meta property="og:description" content="${escapeAttr(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${og ?? `${SITE_URL}/assets/wisnotech-logo.png`}" />
    <meta property="og:locale" content="en_NG" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttr(title)}" />
    <meta name="twitter:description" content="${escapeAttr(description)}" />
    <meta name="twitter:image" content="${og ?? `${SITE_URL}/assets/wisnotech-logo.png`}" />
    <script type="application/ld+json">${jsonLd}</script>
${ASSET_INJECT}
  </head>
  <body>
    ${body}
    ${assets.scripts.join("\n    ")}
    ${WIDGET_SCRIPT}
  </body>
</html>`;
}

function header() {
  return `<header class="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#080808]/85 backdrop-blur-md" style="display:flex;justify-content:space-between;align-items:center;height:64px;padding:0 32px;border-bottom:1px solid rgba(255,255,255,0.1);background:rgba(8,8,8,0.85);backdrop-filter:blur(12px);position:relative">
    <a href="${SITE_URL}/" style="color:#fff;text-decoration:none;font-weight:600">WISNOTECH</a>
    <a href="${SITE_URL}/blog" style="color:rgba(255,255,255,0.7);text-decoration:none;font-size:14px">All articles</a>
  </header>`;
}

function footer() {
  return `<footer style="border-top:1px solid rgba(255,255,255,0.1);padding:24px 32px;color:rgba(255,255,255,0.4);font-size:14px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:16px;background:#0a0a0a">
    <span>&copy; ${new Date().getFullYear()} Wisnotech. All rights reserved.</span>
    <span><a href="${SITE_URL}/" style="color:rgba(255,255,255,0.4)">Back to homepage</a></span>
  </footer>`;
}

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function articleHtml(post) {
  return `${
    `<article style="max-width:680px;margin:0 auto;padding:0 24px 80px;background:#080808;color:#fff">`
  }
  <header style="padding:48px 0 24px">
    <span style="color:#3b7bff;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase">${escapeAttr(post.data.category ?? "General")}</span>
    <h1 style="font-size:40px;line-height:1.15;font-weight:600;margin:16px 0 0;letter-spacing:-0.02em">${escapeAttr(post.data.title ?? post.slug)}</h1>
    <p style="color:rgba(255,255,255,0.55);font-size:14px;margin:12px 0 0">${escapeAttr(fmtDate(String(post.data.date)))} · ${readingTime(post.body)} min read</p>
    ${post.data.description ? `<p style="color:rgba(255,255,255,0.75);font-size:18px;line-height:1.6;margin:20px 0 0">${escapeAttr(String(post.data.description))}</p>` : ""}
  </header>
  <div style="font-size:16px;line-height:1.85;color:rgba(255,255,255,0.8)">${renderMarkdown(post.body)}</div>
  <div style="margin-top:48px;padding:32px;border-radius:16px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);text-align:center">
    <p style="font-weight:600;font-size:15px">Want to actually build with AI?</p>
    <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:8px 0 16px">Explore our practical courses or talk to us about your project.</p>
    <a href="${SITE_URL}/#/academy" style="display:inline-block;background:#fff;color:#080808;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:500;margin-right:8px">Explore courses</a>
    <a href="${SITE_URL}/#contact" style="display:inline-block;border:1px solid rgba(255,255,255,0.3);color:#fff;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:500">Contact us</a>
  </div>
</article>`;
}

// ---- Read posts -------------------------------------------------------------
function readPosts() {
  const files = readdirSync(CONTENT).filter((f) => f.endsWith(".md"));
  return files
    .map((file) => {
      const raw = readFileSync(join(CONTENT, file), "utf8");
      const { data, body } = parseFrontmatter(raw);
      const slug = String(data.slug ?? file.replace(/\.md$/, ""));
      return { slug, data, body, file, raw };
    })
    .sort((a, b) => (String(a.data.date) < String(b.data.date) ? 1 : -1));
}

const posts = readPosts();

function orgLd() {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Wisnotech",
    url: SITE_URL,
    logo: `${SITE_URL}/assets/wisnotech-favicon.png`,
  });
}

function breadcrumbLd(path) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: path.split("/").pop(), item: `${SITE_URL}${path}` },
    ],
  });
}

function articleLd(post) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: String(post.data.title ?? post.slug),
    description: String(post.data.description ?? stripMarkdown(post.raw).slice(0, 160)),
    image: post.data.image && post.data.image.startsWith("http") ? post.data.image : `${SITE_URL}/assets/wisnotech-logo.png`,
    datePublished: String(post.data.date),
    dateModified: String(post.data.date),
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    author: { "@type": "Organization", name: String(post.data.author ?? "Wisnotech"), url: SITE_URL },
    publisher: { "@type": "Organization", name: "Wisnotech", url: SITE_URL },
    inLanguage: "en",
  });
}

// ---- Blog index -------------------------------------------------------------
function blogIndexHtml() {
  const cards = posts
    .map(
      (post) => `
    <a href="${SITE_URL}/blog/${post.slug}" style="display:block;padding:28px;border:1px solid rgba(255,255,255,0.1);border-radius:20px;background:rgba(255,255,255,0.04);text-decoration:none;color:#fff;transition:border-color .3s;margin-bottom:20px">
      <span style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.6)">${escapeAttr(String(post.data.category ?? "General"))}</span>
      <h2 style="font-size:22px;margin:12px 0 8px;font-weight:600;line-height:1.3">${escapeAttr(String(post.data.title ?? post.slug))}</h2>
      <p style="color:rgba(255,255,255,0.6);font-size:14px;line-height:1.6;margin:0 0 14px">${escapeAttr(String(post.data.description ?? stripMarkdown(post.raw).slice(0, 140)))}</p>
      <span style="color:rgba(255,255,255,0.5);font-size:13px">${escapeAttr(fmtDate(String(post.data.date)))} · ${readingTime(post.body)} min read</span>
    </a>`
    )
    .join("\n");

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Wisnotech Blog",
    url: `${SITE_URL}/blog`,
    publisher: { "@type": "Organization", name: "Wisnotech", url: SITE_URL },
    blogPost: posts.map((p) => `${SITE_URL}/blog/${p.slug}`),
  });

  const body = `${header()}
  <main style="min-height:60vh;max-width:760px;margin:0 auto;padding:96px 24px;background:#080808;color:#fff">
    <h1 style="font-size:44px;font-weight:600;letter-spacing:-0.02em;margin:0 0 12px">Guides for the AI-driven business</h1>
    <p style="color:rgba(255,255,255,0.6);font-size:18px;margin:0 0 48px">Practical writing on AI search optimization, automation, chat assistants and building AI-ready businesses.</p>
    ${cards}
  </main>
  ${footer()}`;

  return pageTemplate(
    "Wisnotech Blog — AI, Automation & Business Guides",
    "Practical guides on AI search optimization, automation, chat assistants and building AI-ready businesses — written by Wisnotech.",
    `${SITE_URL}/blog`,
    null,
    JSON.stringify([
      JSON.parse(orgLd()),
      JSON.parse(jsonLd),
      JSON.parse(JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      ] })),
    ]),
    body
  );
}

// ---- Write files ------------------------------------------------------------
mkdirSync(join(DIST, "blog"), { recursive: true });

writeFileSync(join(DIST, "blog", "index.html"), blogIndexHtml());
console.log(`✓ blog index (${posts.length} posts) -> dist/blog/index.html`);

for (const post of posts) {
  const dir = join(DIST, "blog", post.slug);
  mkdirSync(dir, { recursive: true });
  const jsonLd = JSON.stringify([
    JSON.parse(orgLd()),
    JSON.parse(articleLd(post)),
    JSON.parse(breadcrumbLd(`/blog/${post.slug}`)),
  ]);
  const html = pageTemplate(
    `${String(post.data.title ?? post.slug)} — Wisnotech Blog`,
    String(post.data.description ?? stripMarkdown(post.raw).slice(0, 160)),
    `${SITE_URL}/blog/${post.slug}`,
    String(post.data.image ?? ""),
    jsonLd,
    `${header()}${articleHtml(post)}${footer()}`
  );
  writeFileSync(join(dir, "index.html"), html);
  console.log(`✓ post -> dist/blog/${post.slug}/index.html`);
}

// ---- sitemap.xml ------------------------------------------------------------
const now = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: `${SITE_URL}/`, lastmod: now, priority: 1.0 },
  { loc: `${SITE_URL}/blog`, lastmod: now, priority: 0.9 },
  { loc: `${SITE_URL}/wino`, lastmod: now, priority: 0.9 },
  { loc: `${SITE_URL}/portfolio`, lastmod: now, priority: 0.9 },
  ...posts.map((p) => ({
    loc: `${SITE_URL}/blog/${p.slug}`,
    lastmod: String(p.data.date || now),
    priority: 0.8,
  })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <priority>${u.priority}</priority>\n  </url>`).join("\n")}
</urlset>
`;
writeFileSync(join(DIST, "sitemap.xml"), sitemap);
console.log("✓ sitemap.xml");

// ---- llms.txt ---------------------------------------------------------------
const llms = `# Wisnotech

> Wisnotech builds AI solutions, software, websites, and AI courses.
> AI & automation, AI video content, software development, web & mobile apps,
> AI education and consulting. Based in Uromi, Edo State, Nigeria, serving clients worldwide.

## Company
- [Homepage](${SITE_URL}/): Wisnotech — AI, software & digital innovation in Nigeria
- [Contact](${SITE_URL}/#contact): wisnotech@gmail.com · +2349153541297
- [AI Video Samples Portfolio](${SITE_URL}/portfolio): Curated AI-generated video and still samples by Wisnotech

## Courses
- [Wisnotech Academy](${SITE_URL}/#/academy): Practical AI, automation, content and software courses with pricing
- [AI Fundamentals](${SITE_URL}/#/courses/ai-fundamentals): Beginner AI foundation
- [Automation & Workflow Specialist](${SITE_URL}/#/courses/automation-workflow-specialist): No-code automation and AI agents
- [AI Content Creation Pro](${SITE_URL}/#/courses/ai-content-creation-pro): Studio-grade AI content
- [Prompt Engineering & AI Agents](${SITE_URL}/#/courses/prompt-engineering-ai-agents): Advanced prompting and agents
- [No-Code & App Building](${SITE_URL}/#/courses/no-code-app-building): Build apps without code
- [AI for Business Growth](${SITE_URL}/#/courses/ai-for-business-growth): Apply AI across a business
- [Web Development Bootcamp](${SITE_URL}/#/courses/web-development-bootcamp): Front-end, React, deployment
- [Full-Stack Software Engineering](${SITE_URL}/#/courses/full-stack-software-engineering): Full-stack + AI features

## Blog
${posts
  .map(
    (p) =>
      `- [${String(p.data.title ?? p.slug)}](${SITE_URL}/blog/${p.slug}): ${String(
        p.data.description ?? stripMarkdown(p.raw).slice(0, 120)
      )}`
  )
  .join("\n")}
`;
writeFileSync(join(DIST, "llms.txt"), llms);
console.log("✓ llms.txt");

let llmsFull = `# Wisnotech\n\nFull content for AI crawlers.\n\n`;
for (const post of posts) {
  llmsFull += `## ${String(post.data.title ?? post.slug)}\n\n${escapeAttr(stripMarkdown(post.raw))}\n\n`;
}
writeFileSync(join(DIST, "llms-full.txt"), llmsFull.trim() + "\n");
console.log("✓ llms-full.txt");

// ---- RSS --------------------------------------------------------------------
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Wisnotech Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Practical guides on AI search optimization, automation and building AI-ready businesses.</description>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${posts
      .map((p) => {
        const title = String(p.data.title ?? p.slug);
        const desc = String(p.data.description ?? stripMarkdown(p.raw).slice(0, 160));
        const date = new Date(String(p.data.date));
        return `    <item>
      <title>${escapeAttr(title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid>${SITE_URL}/blog/${p.slug}</guid>
      <pubDate>${isNaN(date.getTime()) ? new Date().toUTCString() : date.toUTCString()}</pubDate>
      <description>${escapeAttr(desc)}</description>
    </item>`;
      })
      .join("\n")}
  </channel>
</rss>
`;
writeFileSync(join(DIST, "feed.xml"), rss);
console.log("✓ feed.xml (RSS)");

// ---- Portfolio static prerender ----------------------------------------------
// Renders a static version of /portfolio inside #root so crawlers see the
// samples without JS. Real users get the interactive SPA (React replaces it).
const PF_CATEGORIES = [
  { id: "cinematic", label: "Cinematic", accent: "#7aa5ff" },
  { id: "character", label: "Character", accent: "#ff7a9e" },
  { id: "text-to-video", label: "Text to Video", accent: "#3b7bff" },
  { id: "image-to-video", label: "Image to Video", accent: "#8b7aff" },
  { id: "social-media", label: "Social", accent: "#2dd4bf" },
  { id: "advertising", label: "Advertising", accent: "#fbbf24" },
  { id: "ai-image", label: "AI Stills", accent: "#a78bfa" },
  { id: "film", label: "Film", accent: "#f472b6" },
];

const PF_SAMPLES = [
  { id: "p1", type: "video", title: "Golden Hour, Lagos", desc: "Text-to-video street scene with a hand-held camera feel and warm dusk light.", cat: "text-to-video", src: "/wino/videos/showreel-1.mp4", poster: "/wino/thumbs/video-thumb-1.jpg", dur: "0:15", ratio: "9:16", featured: true },
  { id: "p2", type: "video", title: "Product Launch — 15s", desc: "Short-form advertising spot built from a single prompt.", cat: "advertising", src: "/wino/videos/showreel-2.mp4", poster: "/wino/thumbs/video-thumb-2.jpg", dur: "0:15", ratio: "9:16", featured: true },
  { id: "p3", type: "video", title: "Portrait Push-In", desc: "Image-to-video camera push on a still portrait.", cat: "image-to-video", src: "/wino/videos/showreel-3.mp4", poster: "/wino/thumbs/video-thumb-3.jpg", dur: "0:15", ratio: "9:16", featured: true },
  { id: "p4", type: "video", title: "Character Study", desc: "Consistent character with expressive, natural motion.", cat: "character", src: "/wino/videos/showreel-4.mp4", poster: "/wino/thumbs/video-thumb-4.jpg", dur: "0:08", ratio: "9:16" },
  { id: "p5", type: "video", title: "Social Loop", desc: "Vertical-format loop built for social feeds.", cat: "social-media", src: "/wino/videos/showreel-5.mp4", poster: "/wino/thumbs/video-thumb-5.jpg", dur: "0:15", ratio: "9:16" },
  { id: "p6", type: "image", title: "Neon Market Still", desc: "AI image generated with WINO — neon-soaked night market.", cat: "ai-image", src: "/wino/images/1.jpeg", poster: "/wino/images/1.jpeg", ratio: "9:16" },
  { id: "p7", type: "image", title: "Portrait Still", desc: "AI image generated with WINO — dramatic studio portrait.", cat: "ai-image", src: "/wino/images/2.jpeg", poster: "/wino/images/2.jpeg", ratio: "9:16" },
  { id: "p8", type: "image", title: "Landscape Still", desc: "AI image generated with WINO — expansive cinematic landscape.", cat: "ai-image", src: "/wino/images/3.jpeg", poster: "/wino/images/3.jpeg", ratio: "9:16" },
  { id: "p9", type: "video", title: "Film Teaser", desc: "Narrative teaser with filmic grading and moody pacing.", cat: "film", src: "/wino/videos/showreel-6.mp4", poster: "/wino/thumbs/video-thumb-6.jpg", dur: "0:44", ratio: "9:16" },
  { id: "p10", type: "video", title: "Street Loop 01", desc: "9:16 text-to-video loop built for portrait feeds.", cat: "social-media", src: "/wino/videos/vertical-01.mp4", poster: "/wino/thumbs/vertical-01.jpg", dur: "0:08", ratio: "9:16" },
  { id: "p11", type: "video", title: "Street Loop 02", desc: "9:16 text-to-video loop built for portrait feeds.", cat: "social-media", src: "/wino/videos/vertical-02.mp4", poster: "/wino/thumbs/vertical-02.jpg", dur: "0:08", ratio: "9:16" },
  { id: "p12", type: "video", title: "Street Loop 03", desc: "9:16 text-to-video loop built for portrait feeds.", cat: "social-media", src: "/wino/videos/vertical-03.mp4", poster: "/wino/thumbs/vertical-03.jpg", dur: "0:08", ratio: "9:16" },
  { id: "p13", type: "video", title: "Portrait Moment", desc: "Vertical cinematic study with shallow depth of field.", cat: "cinematic", src: "/wino/videos/portrait-moment.mp4", poster: "/wino/thumbs/portrait-moment.jpg", dur: "0:08", ratio: "9:16" },
  { id: "p14", type: "video", title: "Cinematic Scene 01", desc: "16:9 narrative shot with filmic grading and composed blocking.", cat: "cinematic", src: "/wino/videos/cinematic-01.mp4", poster: "/wino/thumbs/cinematic-01.jpg", dur: "0:08", ratio: "16:9" },
  { id: "p15", type: "video", title: "Cinematic Scene 02", desc: "16:9 narrative shot with filmic grading and subtle camera drift.", cat: "cinematic", src: "/wino/videos/cinematic-02.mp4", poster: "/wino/thumbs/cinematic-02.jpg", dur: "0:08", ratio: "16:9" },
  { id: "p16", type: "video", title: "Showcase Matrix", desc: "Wide montage of Seedance 2.0 output in a single frame.", cat: "cinematic", src: "/wino/videos/showcase-matrix.mp4", poster: "/wino/thumbs/showcase-matrix.jpg", dur: "0:15", ratio: "16:9", featured: true },
  { id: "p17", type: "video", title: "Seedance 2.0 Demo", desc: "Text-to-video generation sample at a wide cinematic aspect.", cat: "text-to-video", src: "/wino/videos/seedance-demo.mp4", poster: "/wino/thumbs/seedance-demo.jpg", dur: "0:08", ratio: "Wide" },
  { id: "p18", type: "video", title: "Action Sequence", desc: "Extended vertical character sequence with quick cuts and energy.", cat: "character", src: "/wino/videos/johnwick-character.mp4", poster: "/wino/thumbs/johnwick-character.jpg", dur: "0:26", ratio: "9:16", featured: true },
  { id: "p19", type: "video", title: "Factory Ninja", desc: "Cinematic character vignette set in a gritty workshop.", cat: "character", src: "/wino/videos/factory-ninja.mp4", poster: "/wino/thumbs/factory-ninja.jpg", dur: "0:15", ratio: "16:9" },
];

function pfCat(id) {
  return PF_CATEGORIES.find((c) => c.id === id) ?? { label: id, accent: "#3b7bff" };
}

function pfCard(s) {
  const cat = pfCat(s.cat);
  const badge = s.featured ? `<span style="position:absolute;top:12px;left:12px;background:rgba(0,0,0,0.55);color:#fff;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:4px 10px;border-radius:999px">★ Featured</span>` : "";
  const meta = s.type === "video" ? `<span style="position:absolute;bottom:12px;left:12px;background:rgba(0,0,0,0.55);color:#fff;font-size:10px;font-weight:600;padding:4px 10px;border-radius:999px">${s.dur} · ${s.ratio}</span>` : "";
  return `<div style="border:1px solid rgba(255,255,255,0.1);border-radius:18px;overflow:hidden;background:rgba(255,255,255,0.03)">
    <div style="position:relative;aspect-ratio:${s.ratio === "9:16" ? "9/16" : "16/9"};overflow:hidden;background:#0b0b0b">
      <img src="${SITE_URL}${s.poster}" alt="${escapeAttr(s.title)}" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover" />
      <span style="position:absolute;bottom:12px;left:12px;background:${cat.accent};color:#080808;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:4px 10px;border-radius:999px">${cat.label}</span>
      ${meta}${badge}
    </div>
    <div style="padding:16px 20px 18px">
      <p style="margin:0;color:#fff;font-weight:600;font-size:15px">${escapeAttr(s.title)}</p>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.55);font-size:12px;line-height:1.5">${escapeAttr(s.desc)}</p>
    </div>
  </div>`;
}

function portfolioHtml() {
  const title = "AI Video Samples Portfolio | Wisnotech";
  const desc = "A personal portfolio of AI-generated video samples by Wisnotech — text-to-video, image-to-video, character and cinematic work, curated and ready to browse.";
  const jsonLd = JSON.stringify([
    JSON.parse(orgLd()),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Wisnotech AI Video Samples Portfolio",
      url: `${SITE_URL}/portfolio`,
      description: desc,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: PF_SAMPLES.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.title,
          url: `${SITE_URL}/portfolio?sample=${s.id}`,
          image: `${SITE_URL}${s.poster}`,
        })),
      },
    },
    JSON.parse(JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "AI Video Samples Portfolio", item: `${SITE_URL}/portfolio` },
      ],
    })),
  ]);

  const cards = PF_SAMPLES.map(pfCard).join("\n");
  const body = `<div id="root">
  <div style="background:#080808;color:#fff;font-family:'Inter',ui-sans-serif,system-ui,sans-serif;min-height:100vh">
    <header style="position:fixed;inset:0 0 auto 0;z-index:50;height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 32px;border-bottom:1px solid rgba(255,255,255,0.1);background:rgba(8,8,8,0.85);backdrop-filter:blur(12px)">
      <a href="${SITE_URL}/" style="display:flex;align-items:center;gap:10px;color:#fff;text-decoration:none;font-weight:600;font-size:14px">Samples <span style="color:rgba(255,255,255,0.4);font-weight:400">by Wisnotech</span></a>
      <a href="${SITE_URL}/" style="color:rgba(255,255,255,0.7);text-decoration:none;font-size:14px;border:1px solid rgba(255,255,255,0.15);padding:8px 16px;border-radius:10px">Back to Wisnotech</a>
    </header>
    <main style="padding-top:120px;text-align:center">
      <span style="display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.04);padding:6px 16px;border-radius:999px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.7)">AI Video Portfolio</span>
      <h1 style="margin:32px 0 0;font-size:64px;line-height:1.03;letter-spacing:-0.02em;font-weight:700;background:linear-gradient(110deg,#fff 20%,#7aa5ff 40%,#3b7bff 50%,#7aa5ff 60%,#fff 80%);background-size:200% auto;-webkit-background-clip:text;background-clip:text;color:transparent">AI-crafted motion,<br/>curated by hand.</h1>
      <p style="max-width:640px;margin:24px auto 0;color:rgba(255,255,255,0.6);font-size:18px;line-height:1.6">A personal collection of AI-generated videos and stills — text-to-video, image-to-video and character work. Every clip generated, curated and graded for the story it tells.</p>
      <div style="display:flex;justify-content:center;gap:12px;margin:40px 0 0;flex-wrap:wrap">
        <a href="#work" style="display:inline-block;background:#fff;color:#080808;padding:14px 24px;border-radius:12px;text-decoration:none;font-weight:500">Browse the work</a>
        <a href="${SITE_URL}/#contact" style="display:inline-block;border:1px solid rgba(255,255,255,0.3);color:#fff;padding:14px 24px;border-radius:12px;text-decoration:none;font-weight:500">Commission a sample</a>
      </div>
      <div style="display:flex;justify-content:center;gap:12px;margin:56px auto 0;max-width:560px">
        <div style="flex:1;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.03);padding:20px;border-radius:16px"><p style="margin:0;font-size:24px;font-weight:700">16</p><p style="margin:6px 0 0;color:rgba(255,255,255,0.5);font-size:12px">Video samples</p></div>
        <div style="flex:1;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.03);padding:20px;border-radius:16px"><p style="margin:0;font-size:24px;font-weight:700">8</p><p style="margin:6px 0 0;color:rgba(255,255,255,0.5);font-size:12px">Categories</p></div>
      </div>
    </main>
    <section id="work" style="max-width:1100px;margin:0 auto;padding:96px 24px">
      <h2 style="font-size:44px;margin:0 0 12px;letter-spacing:-0.02em;font-weight:600">A growing reel.</h2>
      <p style="color:rgba(255,255,255,0.6);font-size:18px;margin:0 0 40px">Every sample below was generated from a prompt or an image. New work lands here as it's made.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;align-items:start">${cards}</div>
    </section>
    <section style="max-width:760px;margin:0 auto;padding:0 24px 96px;text-align:center">
      <h2 style="font-size:36px;margin:0 0 12px;letter-spacing:-0.02em;font-weight:600">Want motion like this in your brand?</h2>
      <p style="color:rgba(255,255,255,0.6);font-size:18px;line-height:1.6">Every sample here started as a prompt. Tell us what your product, film or story needs — we'll craft the generation.</p>
      <a href="${SITE_URL}/#contact" style="display:inline-block;background:#fff;color:#080808;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:500;margin-top:24px">Commission a sample</a>
    </section>
    <footer style="border-top:1px solid rgba(255,255,255,0.1);padding:24px 32px;color:rgba(255,255,255,0.4);font-size:14px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:16px;background:#0a0a0a">
      <span>&copy; ${new Date().getFullYear()} Wisnotech.</span>
      <span><a href="${SITE_URL}/" style="color:rgba(255,255,255,0.4)">Made in Nigeria, for the world.</a></span>
    </footer>
  </div>
</div>`;

  return pageTemplate(
    title,
    desc,
    `${SITE_URL}/portfolio`,
    `${SITE_URL}/assets/portfolio-og.jpg`,
    jsonLd,
    body
  );
}

mkdirSync(join(DIST, "portfolio"), { recursive: true });
writeFileSync(join(DIST, "portfolio", "index.html"), portfolioHtml());
console.log("✓ portfolio -> dist/portfolio/index.html");

console.log("\nPrerender complete.");