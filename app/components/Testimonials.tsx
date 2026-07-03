import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

const OUTCOMES = [
  {
    detail:
      "Renovation work delivered at the Sonesta Fort Lauderdale Beach — our first commercial hospitality contract, completed inside an operating beachfront hotel.",
    name: "Commercial Renovation — Sonesta Fort Lauderdale Beach",
    role: "Commercial · Fort Lauderdale, FL",
  },
  {
    detail:
      "Kitchen remodel completed on schedule with a transparent, itemized estimate up front — no change-order surprises.",
    name: "Kitchen Remodel",
    role: "Residential · Melbourne, FL",
  },
  {
    detail:
      "Bathroom renovation permitted and built to Florida Building Code, with inspections passed and a final walkthrough sign-off before completion.",
    name: "Bathroom Renovation",
    role: "Residential · Brevard County, FL",
  },
];

export default function Testimonials() {
  return (
    <section className="border-t border-line bg-card py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow="Proven Work" title="Recent Project Outcomes" />
        {/* TODO: replace with collected client reviews once GBP is live */}
        <div className="grid gap-8 md:grid-cols-3">
          {OUTCOMES.map((outcome, index) => (
            <ScrollReveal key={outcome.name} delay={index * 120}>
              <div className="h-full border border-line bg-background p-10">
                <div className="mb-5 font-heading text-5xl font-extrabold leading-none text-primary">
                  {"//"}
                </div>
                <p className="mb-5 text-muted">{outcome.detail}</p>
                <div className="font-semibold text-foreground">{outcome.name}</div>
                <div className="font-heading text-xs font-semibold uppercase tracking-[0.1em] text-primary">
                  {outcome.role}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
