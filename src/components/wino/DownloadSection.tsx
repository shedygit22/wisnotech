import { ArrowDownToLine, Store } from "lucide-react";
import { WINO_STORES, WINO_DOWNLOAD_URL, type StoreLink } from "../../lib/wino";
import { cn } from "../../lib/utils";
import { useReferral } from "../../lib/winoReferral";

/**
 * DOWNLOAD SECTION
 * Primary APK button + store links. Store buttons show real links only when
 * a store is actually live (`status: "available"` in the config / env vars);
 * otherwise they show a labelled "Coming soon" state.
 */
export function DownloadSection() {
  const { appendTo } = useReferral();
  const apkHref = appendTo(WINO_DOWNLOAD_URL);

  return (
    <section id="download" className="section">
      <div className="container-wide">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Download</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            WINO is ready when you are.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Install the official Wisnotech APK on Android, or grab it from your
            favourite store as soon as it&apos;s published there.
          </p>
        </div>

        <div className="mt-12 flex flex-col items-center gap-6">
          {apkHref ? (
            <a
              href={apkHref}
              download
              className="group inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-[#080808] transition-all duration-300 hover:bg-zinc-100 hover:scale-[1.02]"
            >
              <ArrowDownToLine className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden />
              Download WINO APK
            </a>
          ) : (
            <span className="inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.04] px-8 py-4 text-base font-medium text-white/60">
              <ArrowDownToLine className="h-5 w-5" aria-hidden />
              APK coming soon — set WINO_DOWNLOAD_URL
            </span>
          )}

          <StoreButtons links={WINO_STORES} />
        </div>
      </div>
    </section>
  );
}

/** Secondary store buttons; disabled (Coming Soon) until a store is live. */
export function StoreButtons({ links }: { links: StoreLink[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {links.map((store) => {
        const available = store.status === "available" && Boolean(store.url);
        const inner = (
          <span
            className={cn(
              "inline-flex flex-col items-start rounded-xl border px-5 py-3 text-left transition-all duration-300",
              available
                ? "border-white/20 bg-white/[0.04] hover:border-neon/50 hover:bg-white/[0.07]"
                : "cursor-not-allowed border-white/10 bg-white/[0.02] opacity-55"
            )}
          >
            <span className="flex items-center gap-2 text-sm font-semibold text-white">
              <Store className="h-4 w-4 text-neon/80" aria-hidden />
              {store.label}
            </span>
            <span className="mt-1 text-xs text-white/45">
              {available ? "Available now" : (store.note ?? "Coming soon")}
            </span>
          </span>
        );
        if (!available) {
          return (
            <span key={store.label} aria-disabled="true" title="Coming soon" role="note">
              {inner}
            </span>
          );
        }
        return (
          <a
            key={store.label}
            href={store.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Get WINO on the ${store.label}`}
          >
            {inner}
          </a>
        );
      })}
    </div>
  );
}