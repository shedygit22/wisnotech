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
const WIDGET_SCRIPT = `
    <script src="https://cdn.wisnotech.ai/widget.js" data-team="demo" data-employee="emp_i29t887aij" data-name="Shedy" data-greeting="Hi, I'm Shedy. How can I help?"></script>
`;

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

console.log("\nPrerender complete.");