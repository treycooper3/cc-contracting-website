import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

interface ServiceBlock {
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
  image: string;
  imageAlt: string;
  reversed?: boolean;
}

const SERVICE_BLOCKS: ServiceBlock[] = [
  {
    eyebrow: "RESIDENTIAL",
    title: "Home Renovations & Remodels",
    description:
      "From small updates to full-scale renovations, we bring your vision to life with quality materials and expert craftsmanship.",
    items: [
      "Kitchen & Bathroom Remodels",
      "Flooring & Tile Installation",
      "Drywall & Painting",
      "Decks, Patios & Outdoor Living",
      "Home Additions & Renovations",
      "Handyman Services",
    ],
    image: "/residential-remodel.jpg",
    imageAlt: "High-end residential kitchen remodel with navy cabinetry",
  },
  {
    eyebrow: "COMMERCIAL",
    title: "Commercial Construction",
    description:
      "Professional buildouts and renovations for offices, retail spaces, and commercial properties. We work within your timeline and budget.",
    items: [
      "Tenant Buildouts & Fit-Outs",
      "Office & Retail Renovations",
      "Commercial Renovations",
      "Facility Maintenance & Repairs",
      "ADA Compliance Upgrades",
    ],
    image: "/commercial-buildout.jpg",
    imageAlt: "Commercial office space mid-renovation with exposed steel",
    reversed: true,
  },
  {
    eyebrow: "SPECIALTY",
    title: "Specialty Construction",
    description:
      "Heavy-duty construction services for projects that require specialized equipment, expertise, and precision.",
    items: [
      "Demolition & Site Prep",
      "Concrete & Masonry",
      "Framing & Structural Work",
      "Exterior Siding & Facades",
    ],
    image: "/specialty-concrete.jpg",
    imageAlt: "Concrete foundation and structural framing at a Florida jobsite",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="What We Do"
          title="Full-Service General Contracting"
          description="From concept to completion, we handle every phase of your project with precision and care."
        />

        <div className="space-y-24">
          {SERVICE_BLOCKS.map((block) => (
            <ScrollReveal key={block.eyebrow}>
              <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
                <div
                  className={`h-64 border border-line bg-cover bg-center md:h-[400px] ${block.reversed ? "md:order-2" : ""}`}
                  style={{ backgroundImage: `url('${block.image}')` }}
                  role="img"
                  aria-label={block.imageAlt}
                />
                <div className={block.reversed ? "md:order-1" : ""}>
                  <span className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-primary">
                    {block.eyebrow}
                  </span>
                  <h3 className="mb-5 mt-2 font-heading text-3xl font-bold uppercase leading-tight text-foreground">
                    {block.title}
                  </h3>
                  <p className="mb-8 text-muted">{block.description}</p>
                  <ul className="text-foreground">
                    {block.items.map((item, index) => (
                      <li
                        key={item}
                        className={`pb-2.5 ${index < block.items.length - 1 ? "mb-2.5 border-b border-line" : ""}`}
                      >
                        <span className="text-primary">{"// "}</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="mt-24 border-t border-line pt-16 text-center">
            <h2 className="mb-5 font-heading text-3xl font-extrabold uppercase text-foreground md:text-4xl">
              Ready to Start Your Project?
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-muted">
              Get a free, no-obligation estimate. We&apos;ll visit your site, discuss your goals,
              and put together a transparent proposal.
            </p>
            <Link
              href="/#contact"
              className="btn-fill inline-block border-2 border-primary bg-primary px-8 py-4 font-heading text-sm font-bold uppercase tracking-[0.18em] text-white"
            >
              Get a Free Estimate
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
