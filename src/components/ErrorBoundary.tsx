import { Component, type ReactNode } from "react";
import { ArrowUpRight, TriangleAlert } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error("UI error boundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10">
            <TriangleAlert className="h-7 w-7 text-amber-300" aria-hidden />
          </span>
          <h1 className="mt-6 text-2xl font-semibold text-white">Something went wrong</h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
            An unexpected error stopped this section from loading. Please refresh the page. If it persists, contact us and we&apos;ll fix it quickly.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-[#080808] transition-colors hover:bg-white/90"
            >
              Refresh page
            </button>
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white transition-colors hover:border-white/30"
            >
              Back to homepage
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
          {import.meta.env.DEV && this.state.error && (
            <pre className="mt-8 max-w-2xl overflow-auto rounded-xl border border-white/10 bg-white/[0.04] p-4 text-left text-xs text-red-200">
              {this.state.error.message}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
