import ROICalculator from "@/components/ROICalculator";

export default function ROICalculatorPage() {
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Campaign ROI Calculator
        </h1>
        <p className="text-foreground/80">
          Estimate the potential impact of your influencer marketing campaign with our interactive calculator.
        </p>
        <ROICalculator className="mt-12" />
      </div>
    </section>
  );
}