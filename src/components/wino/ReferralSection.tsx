import { Gift } from "lucide-react";
import { useReferral } from "../../lib/winoReferral";

/**
 * REFERRAL — prepares the page for WINO's future creator referral program.
 * Reads + preserves ?ref=CREATOR123 from the URL and shows a subtle badge when
 * a valid code is present. The code is also kept for the future backend.
 */
export function ReferralSection() {
  const { ref } = useReferral();
  if (!ref) return null;

  return (
    <section className="section !py-10" aria-label="Referral">
      <div className="container-wide">
        <div className="mx-auto flex max-w-3xl items-center justify-center gap-3 rounded-2xl border border-neon/25 bg-neon/[0.06] px-6 py-4">
          <Gift className="h-5 w-5 shrink-0 text-neon" aria-hidden />
          <p className="text-center text-sm text-white/75">
            You arrived with a creator referral — <span className="font-semibold text-white">{ref}</span>.
            Referral rewards are coming to WINO soon.
          </p>
        </div>
      </div>
    </section>
  );
}