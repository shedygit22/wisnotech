export function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-white">
      <div className="flex flex-col items-center gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" aria-hidden />
        </span>
        <p className="text-sm text-white/50">Loading…</p>
      </div>
    </div>
  );
}
