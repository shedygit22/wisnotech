import { useEffect } from "react";
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { blogPostBySlug, blogPosts } from "../lib/posts";
import { renderMarkdown } from "../lib/blog-core.mjs";
import { applyPageMeta, articleSchema, breadcrumbSchema, orgSchema } from "../lib/seo";

function formatDate(iso: string): string {
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

interface BlogPostPageProps {
  slug: string;
}

export default function BlogPostPage({ slug }: BlogPostPageProps) {
  const post = blogPostBySlug.get(slug);
  const html = post ? renderMarkdown(post.body) : "";

  useEffect(() => {
    if (!post) {
      applyPageMeta({
        title: "Post not found — Wisnotech",
        description: "The article you're looking for doesn't exist.",
        path: `/blog/${slug}`,
        robots: "noindex",
      });
      return;
    }
    applyPageMeta({
      title: `${post.title} — Wisnotech Blog`,
      description: post.description || post.excerpt,
      path: `/blog/${slug}`,
      type: "article",
      image: post.image,
      jsonLd: [
        orgSchema(),
        articleSchema({
          title: post.title,
          description: post.description || post.excerpt,
          date: post.date,
          author: post.author,
          image: post.image,
          path: `/blog/${slug}`,
          categories: [post.category, ...post.tags],
        }),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${slug}` },
        ]),
      ],
    });
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [slug, post]);

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
        <p className="text-white/60">This article doesn't exist or was moved.</p>
        <a href="/blog" className="btn-primary">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to the blog
        </a>
      </div>
    );
  }

  const related = blogPosts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <div className="relative min-h-screen bg-background text-white">
      <Navbar />

      <main className="pt-20">
        <article className="pb-24 md:pb-32">
          <header className="relative overflow-hidden py-16 md:py-20">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(59,123,255,0.1),transparent_70%)]" />
            <div className="container-wide relative max-w-3xl">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-neon/40 bg-neon/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-neon">
                <Tag className="h-3 w-3" aria-hidden /> {post.category}
              </span>
              <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
                {post.title}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/55">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-neon" aria-hidden /> {formatDate(post.date)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-neon" aria-hidden /> {post.readTime} min read
                </span>
                {post.author && <span>{post.author}</span>}
              </div>
              {post.description && (
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
                  {post.description}
                </p>
              )}
            </div>
          </header>

          <div className="container-wide max-w-3xl">
            <div
              className="prose-wisnotech"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-white/10 pt-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/60"
                >
                  <Tag className="h-3 w-3" aria-hidden /> {tag}
                </span>
              ))}
            </div>

            <div className="card mt-12 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-[15px] font-semibold text-white">Want to actually build with AI?</p>
                <p className="mt-1 text-sm text-muted">
                  Explore our practical courses or talk to us about your project.
                </p>
              </div>
              <div className="flex shrink-0 gap-3">
                <a href="/blog" className="btn-secondary">
                  All posts
                </a>
                <a href="/" className="btn-primary">
                  Learn more
                </a>
              </div>
            </div>
          </div>
        </article>

        <section className="pb-24 md:pb-32">
          <div className="container-wide">
            <p className="eyebrow">Keep reading</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {related.map((r) => (
                <a key={r.slug} href={`/blog/${r.slug}`} className="card group flex flex-col">
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/60">
                    {r.category}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold leading-snug text-white">
                    {r.title}
                  </h3>
                  <span className="group/btn mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors group-hover:text-neon">
                    Read article
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" aria-hidden />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}