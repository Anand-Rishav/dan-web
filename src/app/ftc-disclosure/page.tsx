import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "FTC Compliance Disclosure",
  description: "How DAN SERVICES ensures every creator campaign meets FTC endorsement disclosure requirements.",
};

export default function FtcDisclosurePage() {
  return (
    <PageShell>
      <main className="min-h-screen bg-background py-28 px-6">
        <article className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-white tracking-tight">FTC Compliance Disclosure</h1>
          <p className="text-sm text-gray-500">Last updated: October 2026</p>

          <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
            <p>
              All campaigns orchestrated by DAN SERVICES are paid partnerships. Every piece of sponsored content
              produced through our network is required to carry a clear and conspicuous disclosure — such as
              &quot;#ad&quot;, &quot;Paid partnership&quot;, or the platform-native paid partnership label — in a form that
              audiences notice and understand before engaging with the content.
            </p>
            <p>
              Our compliance process includes contractual disclosure obligations for every creator, pre-publish
              creative review, and post-publish auditing. Content found without compliant disclosure is corrected
              or removed per our escalation policy with the sponsoring brand.
            </p>
            <p>
              Case studies and performance figures presented on this website reflect specific historical
              campaigns and should not be read as promises of future results. Concerns about any content in our
              network can be reported to <span className="text-primary-300">info@danservices.in</span>.
            </p>
          </div>
        </article>
      </main>
    </PageShell>
  );
}
