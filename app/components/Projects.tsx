import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

/* TODO: real jobsite photos from Charles — these are branded placeholder panels, not stock. */
const PROJECTS = [
  { category: "Residential", title: "Modern Kitchen Renovation", wide: true },
  { category: "Commercial", title: "Office Tenant Buildout" },
  { category: "Residential", title: "Bathroom Remodel" },
  { category: "Outdoor Living", title: "Deck & Patio Extension" },
  { category: "Commercial", title: "Retail Space Renovation" },
];

const PANEL_GRADIENTS = [
  "linear-gradient(135deg, #10151d 0%, #0d3a6e 60%, #1976d2 130%)",
  "linear-gradient(160deg, #161b22 0%, #113050 70%, #42a5f5 160%)",
  "linear-gradient(120deg, #0d1117 0%, #14294a 65%, #1565c0 140%)",
  "linear-gradient(150deg, #12181f 0%, #0f3560 70%, #1976d2 150%)",
  "linear-gradient(140deg, #0d1117 10%, #123a63 75%, #42a5f5 170%)",
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
                <div
                  className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ background: PANEL_GRADIENTS[index % PANEL_GRADIENTS.length] }}
                >
                  {/* Blueprint grid texture */}
                  <div
                    aria-hidden
                    className="h-full w-full opacity-[0.14]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(230,237,243,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(230,237,243,0.5) 1px, transparent 1px)",
                      backgroundSize: "44px 44px",
                    }}
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-full translate-y-2 bg-gradient-to-t from-background/95 to-transparent p-7 transition-transform duration-300 group-hover:translate-y-0">
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
