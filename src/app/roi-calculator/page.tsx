import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import ROICalculator from "@/components/ROICalculator";

export const metadata: Metadata = {
  title: "ROI Calculator",
  description: "Estimate the potential impact of your influencer marketing campaign with the DAN SERVICES interactive ROI calculator.",
};

export default function ROICalculatorPage() {
  return (
    <PageShell>
      <main className="min-h-screen bg-background pt-28">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Campaign ROI Calculator</h1>
          <p className="text-gray-400 max-w-2xl">
            Estimate the potential impact of your influencer marketing campaign with our interactive calculator.
          </p>
        </div>
        <ROICalculator className="mt-6" />
      </main>
    </PageShell>
  );
}
