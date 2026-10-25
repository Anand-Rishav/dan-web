import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Terms of Agency Engagement",
  description: "The terms governing engagement of DAN SERVICES influencer marketing services.",
};

export default function TermsPage() {
  return (
    <PageShell>
      <main className="min-h-screen bg-background py-28 px-6">
        <article className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-white tracking-tight">Terms of Agency Engagement</h1>
          <p className="text-sm text-gray-500">Last updated: October 2026</p>

          <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
            <p>
              These terms govern the influencer marketing services provided by DAN SERVICES LLC. Submitting a
              campaign intake form expresses interest and does not by itself create a binding engagement; work
              begins only under an executed statement of work or campaign agreement.
            </p>
            <p>
              Campaign budgets, deliverables, creator usage rights, exclusivity windows, and payment schedules
              are defined per engagement. Estimates produced by tools on this website — including the ROI
              calculator — are directional forecasts based on historical benchmarks and are not guarantees of
              performance.
            </p>
            <p>
              DAN SERVICES requires all sponsored content arranged through the agency to carry compliant
              disclosures consistent with applicable FTC endorsement guides. Questions about these terms can be
              directed to <span className="text-primary-300">info@danservices.com</span>.
            </p>
          </div>
        </article>
      </main>
    </PageShell>
  );
}
