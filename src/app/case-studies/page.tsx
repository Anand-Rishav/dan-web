import CampaignShowcase from "@/components/CampaignShowcase";

export default function CaseStudiesPage() {
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Case Studies
        </h1>
        <p className="text-foreground/80">
          See how we've helped brands achieve explosive growth through strategic creator partnerships.
        </p>
        <CampaignShowcase className="mt-12" />
      </div>
    </section>
  );
}