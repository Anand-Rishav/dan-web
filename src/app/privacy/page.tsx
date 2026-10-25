import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How DAN SERVICES collects, uses, and protects information submitted through this website.",
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <main className="min-h-screen bg-background py-28 px-6">
        <article className="max-w-3xl mx-auto prose-invert space-y-8">
          <h1 className="text-4xl font-bold text-white tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-gray-500">Last updated: October 2026</p>

          <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
            <p>
              DAN SERVICES (&quot;we&quot;, &quot;us&quot;) collects only the information you voluntarily submit through our
              brand intake and creator application forms: your name, email address, company or channel details,
              campaign parameters, and any links you provide. We use this information solely to respond to your
              inquiry, match brands with creators, and operate our agency services.
            </p>
            <p>
              We do not sell your personal information. Information may be processed by trusted service providers
              (such as our database, email, and team-communication vendors) strictly to deliver and follow up on
              your request. We retain submissions for as long as needed to serve the underlying business
              relationship, after which they are deleted.
            </p>
            <p>
              You may request access to, correction of, or deletion of your personal data at any time by emailing
              <span className="text-primary-300"> info@danservices.com</span>.
            </p>
          </div>
        </article>
      </main>
    </PageShell>
  );
}
