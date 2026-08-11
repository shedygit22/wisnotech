import { useEffect } from "react";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import Logo from "./Logo";
import { blogPosts } from "../lib/posts";
import { applyPageMeta, breadcrumbSchema, orgSchema } from "../lib/seo";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function BlogPage() {
  useEffect(() => {
    applyPageMeta({
      title: "Wisnotech Blog — AI, Automation & Business Guides",
      description:
        "Practical guides on AI search optimization, automation, chat assistants and building AI-ready businesses — written by Wisnotech.",
      path: "/blog",
      type: "website",
      jsonLd: [
        orgSchema(),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ]),
      ],
    });
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const featured = blogPosts[0];

  return (
    <div className="relative min-h-screen bg-background text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#080808]/85 backdrop-blur-md">
        <nav className="container-wide flex h-16 items-center justify-between gap-4 py-4">
          <a href="/" aria-label="Wisnotech home" className="shrink-0">
            <Logo />
          </a>
          <a
            href="/"
            className="group inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/35 hover:text-white"
          >
            <ArrowRight className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-0.5" aria-hidden />
            Back to home
          </a>
        </nav>
      </header>

      <main className="pt-16">
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(59,123,255,0.12),transparent_70%)]" />
          <div className="container-wide relative">
            <p className="eyebrow">Wisnotech Blog</p>
            <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
              Guides for the <span className="text-neon">AI-driven</span> business
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Practical, no-fluff writing on AI search optimization, automation, chat
              assistants and building businesses that both people and AI can understand.
            </p>
          </div>
        </section>

        {featured && (
          <section className="pb-12">
            <div className="container-wide">
              <a href={`/blog/${featured.slug}`} className="card group block overflow-hidden p-0">
                <div className="grid items-stretch gap-0 md:grid-cols-2">
                  <div className="flex flex-col justify-center p-7 sm:p-10">
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-neon/40 bg-neon/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-neon">
                      Latest post
                    </span>
                    <h2 className="mt-5 text-2xl font-semibold leading-snug text-white md:text-3xl">
                      {featured.title}
                    </h2>
                    <p className="mt-4 text-[15px] leading-relaxed text-muted">
                      {featured.excerpt}
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/50">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" aria-hidden /> {formatDate(featured.date)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" aria-hidden /> {featured.readTime} min read
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5" aria-hidden /> {featured.category}
                      </span>
                    </div>
                    <span className="btn-primary group/btn mt-7 w-fit">
                      Read the guide
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" aria-hidden />
                    </span>
                  </div>
                  <div className="relative min-h-52 bg-[radial-gradient(80%_80%_at_50%_50%,rgba(59,123,255,0.18),transparent_70%)]" />
                </div>
              </a>
            </div>
          </section>
        )}

        <section className="pb-24 md:pb-32">
          <div className="container-wide">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <a
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="card group flex flex-col !p-0 overflow-hidden transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="flex flex-1 flex-col p-7">
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/60">
                      {post.category}
                    </span>
                    <h3 className="mt-4 text-xl font-semibold leading-snug text-white">
                      {post.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                      {post.excerpt}
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.06] pt-5 text-xs text-white/50">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" aria-hidden /> {formatDate(post.date)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" aria-hidden /> {post.readTime} min
                      </span>
                    </div>
                    <span className="group/btn mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors group-hover:text-neon">
                      Read article
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" aria-hidden />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8">
        <div className="container-wide flex flex-col items-center justify-between gap-4 text-sm text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Wisnotech. All rights reserved.</p>
          <a href="/" className="group inline-flex items-center gap-1.5 transition-colors hover:text-white/70">
            Back to homepage
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
          </a>
        </div>
      </footer>
    </div>
  );
}