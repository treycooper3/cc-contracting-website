import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

const TESTIMONIALS = [
  {
    quote:
      "C&C transformed our outdated kitchen into a modern showpiece. The attention to detail was incredible, and they finished ahead of schedule.",
    name: "Sarah Mitchell",
    role: "Homeowner, Melbourne FL",
  },
  {
    quote:
      "We hired C&C for a full tenant buildout on our retail space. Professional, organized, and the final product exceeded expectations.",
    name: "Marcus Rivera",
    role: "Property Manager",
  },
  {
    quote:
      "Great communication throughout the entire project. They kept us informed at every step and delivered exactly what was promised.",
    name: "Jennifer Park",
    role: "Business Owner",
  },
];

export default function Testimonials() {
  return (
    <section className="border-t border-line bg-card py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow="Testimonials" title="What Our Clients Say" />
        <div className="grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <ScrollReveal key={testimonial.name} delay={index * 120}>
              <div className="h-full border border-line bg-background p-10">
                <div className="mb-5 font-serif text-5xl leading-none text-primary">&ldquo;</div>
                <p className="mb-5 italic text-muted">{testimonial.quote}</p>
                <div className="font-semibold text-foreground">{testimonial.name}</div>
                <div className="font-heading text-xs font-semibold uppercase tracking-[0.1em] text-primary">
                  {testimonial.role}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
