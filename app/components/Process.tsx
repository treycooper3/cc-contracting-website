import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

const STEPS = [
  {
    num: "01",
    title: "Consultation",
    description: "Free on-site visit to understand your vision, assess the space, and discuss your budget.",
  },
  {
    num: "02",
    title: "Estimate",
    description: "Detailed, transparent proposal with scope of work, materials, timeline, and pricing.",
  },
  {
    num: "03",
    title: "Build",
    description: "Expert execution with regular updates, quality inspections, and adherence to code.",
  },
  {
    num: "04",
    title: "Deliver",
    description: "Final walkthrough, quality check, and client sign-off. Your project, done right.",
  },
];

export default function Process() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow="Our Process" title="How We Work" />
        <ScrollReveal>
          <div className="grid border-y border-line md:grid-cols-4">
            {STEPS.map((step, index) => (
              <div
                key={step.num}
                className={`relative px-6 py-12 transition-colors hover:bg-card ${
                  index < STEPS.length - 1 ? "border-b border-line md:border-b-0 md:border-r" : ""
                }`}
              >
                <span className="absolute right-5 top-4 font-heading text-5xl font-extrabold text-muted opacity-10">
                  {step.num}
                </span>
                <h3 className="mb-4 mt-5 font-heading text-base font-bold uppercase tracking-wide text-primary">
                  {step.title}
                </h3>
                <p className="text-base text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
