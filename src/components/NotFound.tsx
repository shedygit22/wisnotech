import { ArrowUpRight, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-white">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
          <SearchX className="h-7 w-7 text-white/60" aria-hidden />
        </span>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">Page not found</h1>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-white/60">
          The page you&apos;re looking for doesn&apos;t exist or was moved. Let&apos;s get you back on track.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="/" className="btn-primary">
            Back to homepage
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/[0.08]"
          >
            Contact us
          </a>
        </div>
      </div>
    </div>
  );
}
