import { ShieldCheck, FileCheck2, CalendarClock, Database, Download, AlertTriangle } from "lucide-react";
import { WINO_RELEASE, WINO_DOWNLOAD_URL } from "../../lib/wino";
import { useReferral } from "../../lib/winoReferral";

/**
 * DOWNLOAD TRUST — honest release info for an app distributed outside Google Play.
 * We deliberately do NOT claim the APK is virus-free or security-verified.
 */
export function DownloadTrust() {
  const { appendTo } = useReferral();
  const href = appendTo(WINO_DOWNLOAD_URL);

  const rows = [
    { icon: FileCheck2, label: "Official Wisnotech release", value: "Released by the Wisnotech team" },
    { icon: ShieldCheck, label: "Secure official download", value: "Only from official Wisnotech channels" },
    { icon: Download, label: "Current version", value: WINO_RELEASE.version },
    { icon: CalendarClock, label: "Release date", value: WINO_RELEASE.releaseDate },
    { icon: Database, label: "File size", value: WINO_RELEASE.fileSize },
  ];

  return (
    <section id="trust" className="section">
      <div className="container-wide">
        <div className="mx-auto max-w-3xl">
          <div className="card relative overflow-hidden p-8 sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: "radial-gradient(60% 50% at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 60%)",
              }}
            />

            <p className="eyebrow text-center">Official WINO Download</p>
            <h2 className="mt-4 text-center text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Download WINO with confidence.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-[15px] leading-relaxed text-muted">
              WINO is being distributed directly as an APK. To stay safe, only
              ever download it from official Wisnotech channels linked on this page.
            </p>

            <ul className="mt-8 divide-y divide-white/[0.08]">
              {rows.map((row) => (
                <li key={row.label} className="flex items-center justify-between gap-4 py-3.5">
                  <span className="flex items-center gap-3 text-sm text-white/75">
                    <row.icon className="h-4 w-4 shrink-0 text-neon/80" aria-hidden />
                    {row.label}
                  </span>
                  <span className="text-right text-sm font-medium text-white">{row.value}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-amber-400/20 bg-amber-400/[0.05] p-4 sm:flex-row sm:gap-4">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-300/90" aria-hidden />
              <p className="text-center text-sm leading-relaxed text-white/70 sm:text-left">
                Always download WINO from wisnotech channels. Never install
                unofficial copies from third-party sites.
              </p>
            </div>

            {href ? (
              <a
                href={href}
                download
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-4 text-base font-semibold text-[#080808] transition-all duration-300 hover:bg-zinc-100"
              >
                <Download className="h-5 w-5" aria-hidden />
                Download WINO APK
              </a>
            ) : (
              <p className="mt-6 text-center text-sm text-white/45">
                The APK link will appear here when the first official build is published.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}