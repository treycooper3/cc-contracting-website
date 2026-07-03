import ContactForm from "./ContactForm";
import { EMAIL, HOURS, PHONE_DISPLAY, PHONE_TEL } from "../lib/site";

const INFO_BLOCKS = [
  { label: "Location", value: <>Melbourne, FL</> },
  {
    label: "Phone",
    value: (
      <a href={`tel:${PHONE_TEL}`} className="hover:text-accent">
        {PHONE_DISPLAY}
      </a>
    ),
  },
  {
    label: "Email",
    value: (
      <a href={`mailto:${EMAIL}`} className="text-primary hover:text-accent">
        {EMAIL}
      </a>
    ),
  },
  {
    label: "Hours",
    value: (
      <>
        {HOURS}
        <br />
        <span className="text-sm text-muted">Emergency service available</span>
      </>
    ),
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="border-t border-line py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-2">
          <div className="flex flex-col justify-center bg-card p-10 md:p-16">
            <h2 className="mb-12 font-heading text-4xl font-extrabold uppercase leading-[1.1] text-foreground md:text-5xl">
              Let&apos;s Build
              <br />
              <span className="text-primary">Together</span>
            </h2>
            {INFO_BLOCKS.map((block) => (
              <div key={block.label} className="mb-8">
                <span className="mb-1 block font-heading text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  {block.label}
                </span>
                <div className="text-lg text-foreground">{block.value}</div>
              </div>
            ))}
          </div>
          <div className="border border-line bg-background p-10 md:p-16">
            <h3 className="mb-8 font-heading text-xl font-bold uppercase tracking-wide text-foreground">
              Request a Free Estimate
            </h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
