import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

/**
 * The wide card is real jobsite video: the radiant heated floor build
 * (PEX layup → self-leveling pour → finished slab), cut from Charles's
 * footage. The photo cards illustrate the service categories.
 */
const PROJECTS: {
  category: string;
  title: string;
  image?: string;
  video?: string;
  poster?: string;
  wide?: boolean;
}[] = [
  {
    category: "In-Floor Heating & Concrete",
    title: "Radiant Heated Floor — Layup, Pour & Finish",
    video: "/heated-floor-montage.mp4",
    poster: "/projects/radiant-floor-layup.jpg",
    wide: true,
  },
  { category: "Residential", title: "Modern Kitchen Renovation", image: "/projects/gen-kitchen-remodel.jpg" },
  { category: "Commercial", title: "Office Tenant Buildout", image: "/projects/gen-office-buildout.jpg" },
  { category: "Residential", title: "Bathroom Remodel", image: "/projects/gen-bathroom-remodel.jpg" },
  { category: "Outdoor Living", title: "Deck & Patio Extension", image: "/projects/gen-deck-patio.jpg" },
];

export default function Projects() {
  return (
    <section id="projects" className="border-t border-line bg-card py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Portfolio"
          title="Our Work"
          description="A selection of residential and commercial projects showcasing our quality and range."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {PROJECTS.map((project, index) => (
            <ScrollReveal
              key={project.title}
              delay={index * 100}
              className={project.wide ? "md:col-span-2" : ""}
            >
              <div className="group relative h-72 overflow-hidden border border-line md:h-96">
                {project.video ? (
                  <video
                    src={project.video}
                    poster={project.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={`${project.category} — ${project.title}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={project.image as string}
                    alt={`${project.category} — ${project.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                )}
                <div className="pointer-events-none absolute bottom-0 left-0 w-full translate-y-2 bg-gradient-to-t from-background/95 to-transparent p-7 transition-transform duration-300 group-hover:translate-y-0">
                  <span className="mb-1 block font-heading text-xs font-bold uppercase tracking-[0.2em] text-accent">
                    {project.category}
                  </span>
                  <h3 className="font-heading text-xl font-bold uppercase text-white">
                    {project.title}
                  </h3>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
