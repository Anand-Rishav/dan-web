import ServicesGrid from "@/components/ServicesGrid";

export default function ServicesPage() {
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Our Services
        </h1>
        <p className="text-foreground/80">
          We offer a full suite of influencer marketing services tailored to your brand's needs.
          Explore our service offerings below.
        </p>
        <ServicesGrid className="mt-12" />
      </div>
    </section>
  );
}