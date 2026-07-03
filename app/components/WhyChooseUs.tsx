import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

const REASONS = [
  {
    title: "Quality Craftsmanship",
    description:
      "Every project is built to code and beyond. We take pride in delivering work that stands the test of time.",
    path: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  },
  {
    title: "On-Time Delivery",
    description:
      "We set realistic timelines and stick to them. Your project stays on schedule from groundbreaking to final walkthrough.",
    path: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 6v6l4 2",
  },
  {
    title: "Transparent Pricing",
    description:
      "No hidden fees, no surprises. You get a detailed estimate upfront so you know exactly what you're investing.",
    path: "M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="border-t border-line py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow="Why C&C" title="Why Choose Us" />
        <div className="grid gap-8 md:grid-cols-3">
          {REASONS.map((reason, index) => (
            <ScrollReveal key={reason.title} delay={index * 120}>
              <div className="accent-top h-full border border-line bg-card p-10 transition-colors hover:bg-card-raised">
                <svg
                  viewBox="0 0 24 24"
                  width="40"
                  height="40"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-5"
                  aria-hidden
                >
                  <path d={reason.path} />
                </svg>
                <h3 className="mb-3 font-heading text-lg font-bold uppercase text-foreground">
                  {reason.title}
                </h3>
                <p className="text-[0.95rem] text-muted">{reason.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
