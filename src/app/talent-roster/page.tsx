import TalentRoster from "@/components/TalentRoster";

export default function TalentRosterPage() {
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Talent Roster
        </h1>
        <p className="text-foreground/80">
          Browse our curated roster of top-tier creators across multiple platforms and niches.
        </p>
        <TalentRoster className="mt-12" />
      </div>
    </section>
  );
}