import { parseFrontmatter, readingTime, excerpt } from "./blog-core.mjs";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  author?: string;
  image?: string;
  body: string;
  html: string;
  readTime: number;
  excerpt: string;
}

const rawModules = import.meta.glob("../../content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

function asString(v: string | string[] | undefined, fallback = ""): string {
  const val = Array.isArray(v) ? v.join(", ") : v;
  return val && val.trim() ? val : fallback;
}

function asList(v: string | string[] | undefined): string[] {
  if (Array.isArray(v)) return v;
  return v ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];
}

export const blogPosts: BlogPost[] = Object.entries(rawModules)
  .map(([path, raw]) => {
    const fileSlug = path.split("/").pop()!.replace(/\.md$/, "");
    const { data, body } = parseFrontmatter(String(raw));
    const title = asString(data.title, fileSlug);
    return {
      slug: asString(data.slug, fileSlug),
      title,
      description: asString(data.description),
      date: asString(data.date),
      category: asString(data.category, "General"),
      tags: asList(data.tags),
      author: asString(data.author),
      image: asString(data.image),
      body,
      html: "",
      readTime: readingTime(body),
      excerpt: asString(data.excerpt, excerpt(body)),
    } as BlogPost;
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export const blogPostBySlug = new Map(blogPosts.map((p) => [p.slug, p]));