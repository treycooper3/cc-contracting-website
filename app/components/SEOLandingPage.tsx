import Link from "next/link";
import Nav from "./Nav";
import Footer from "./Footer";
import ContactSection from "./ContactSection";
import JsonLd from "./JsonLd";
import ScrollReveal from "./ScrollReveal";
import { faqPageSchema, generalContractorSchema, SITE_URL, type FAQItem } from "../lib/site";

export interface SEOPageData {
  slug: string;
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  subheadline: string;
  intro: string[];
  serviceName: string;
  serviceDescription: string;
  serviceArea: string;
  highlights: { title: string; description: string }[];
  costGuide?: {
    heading: string;
    headingAccent: string;
    intro: string;
    groups: { title: string; tiers: { name: string; range: string; description: string }[] }[];
    disclaimer: string;
  };
  faqs: FAQItem[];
  ctaHeadline: string;
  ctaDescription: string;
}

export default function SEOLandingPage({ data }: { data: SEOPageData }) {
  const pageUrl = `${SITE_URL}/${data.slug}`;
  const businessSchema = generalContractorSchema({
    "@id": `${SITE_URL}/#business`,
    description: data.serviceDescription,
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: data.serviceName,
        description: data.serviceDescription,
        areaServed: { "@type": "Place", name: data.serviceArea },
        provider: { "@id": `${SITE_URL}/#business` },
        url: pageUrl,
      },
    },
  });

  return (
    <>
      <JsonLd data={businessSchema} />
      <JsonLd data={faqPageSchema(data.faqs)} />
      <Nav />
      <main>
        {/* Hero */}
        <section className="relative flex min-h-[60vh] items-center overflow-hidden border-b border-line py-20">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(13,17,23,0.94) 0%, rgba(13,17,23,0.8) 55%, rgba(13,17,23,0.5) 100%), url('/hero-construction.jpg')",
            }}
          />
          <div className="mx-auto w-full max-w-7xl px-6">
            <div className="max-w-3xl">
              <span className="mb-5 block font-heading text-sm font-bold uppercase tracking-[0.3em] text-accent">
                {data.eyebrow}
              </span>
              <h1 className="mb-7 font-heading text-4xl font-extrabold uppercase leading-[1.08] text-white md:text-6xl">
                {data.headline} <span className="text-primary">{data.headlineAccent}</span>
              </h1>
              <p className="mb-9 max-w-xl border-l-[3px] border-primary pl-5 text-lg text-[#c9d1d9]">
                {data.subheadline}
              </p>
              <Link
                href="/#contact"
                className="btn-fill inline-block border-2 border-primary bg-primary px-8 py-4 font-heading text-sm font-bold uppercase tracking-[0.18em] text-white"
              >
                Get a Free Estimate
              </Link>
            </div>
          </div>
        </section>

        {/* Intro copy */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl space-y-6 px-6 text-lg leading-relaxed text-muted">
            {data.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </section>

        {/* Highlights */}
        <section className="border-t border-line bg-card py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-12 text-center font-heading text-3xl font-extrabold uppercase text-foreground">
              What We <span className="text-primary">Deliver</span>
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {data.highlights.map((highlight, index) => (
                <ScrollReveal key={highlight.title} delay={index * 120}>
                  <div className="accent-top h-full border border-line bg-background p-9">
                    <h3 className="mb-3 font-heading text-lg font-bold uppercase text-foreground">
                      {highlight.title}
                    </h3>
                    <p className="text-[0.95rem] text-muted">{highlight.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Cost guide (optional) */}
        {data.costGuide && (
          <section className="border-t border-line py-20">
            <div className="mx-auto max-w-7xl px-6">
              <h2 className="mb-6 text-center font-heading text-3xl font-extrabold uppercase text-foreground">
                {data.costGuide.heading}{" "}
                <span className="text-primary">{data.costGuide.headingAccent}</span>
              </h2>
              <p className="mx-auto mb-12 max-w-2xl text-center text-muted">
                {data.costGuide.intro}
              </p>
              <div className="space-y-14">
                {data.costGuide.groups.map((group) => (
                  <div key={group.title}>
                    <h3 className="mb-8 font-heading text-xl font-bold uppercase text-foreground">
                      <span className="text-primary">{"// "}</span>
                      {group.title}
                    </h3>
                    <div className="grid gap-8 md:grid-cols-3">
                      {group.tiers.map((tier, index) => (
                        <ScrollReveal key={tier.name} delay={index * 120}>
                          <div className="accent-top h-full border border-line bg-card p-9">
                            <h4 className="mb-2 font-heading text-base font-bold uppercase text-foreground">
                              {tier.name}
                            </h4>
                            <div className="mb-3 font-heading text-2xl font-extrabold text-primary">
                              {tier.range}
                            </div>
                            <p className="text-[0.95rem] text-muted">{tier.description}</p>
                          </div>
                        </ScrollReveal>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-10 text-center text-sm text-muted">{data.costGuide.disclaimer}</p>
            </div>
          </section>
        )}

        {/* FAQs */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="mb-12 text-center font-heading text-3xl font-extrabold uppercase text-foreground">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
            <div className="space-y-4">
              {data.faqs.map((faq) => (
                <details key={faq.question} className="group border border-line bg-card p-6">
                  <summary className="cursor-pointer list-none font-heading text-base font-bold uppercase tracking-wide text-foreground">
                    <span className="text-primary">{"// "}</span>
                    {faq.question}
                  </summary>
                  <p className="mt-4 text-muted">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-line py-20 text-center">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="mb-5 font-heading text-3xl font-extrabold uppercase text-foreground md:text-4xl">
              {data.ctaHeadline}
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-muted">{data.ctaDescription}</p>
            <Link
              href="/#contact"
              className="btn-fill inline-block border-2 border-primary bg-primary px-8 py-4 font-heading text-sm font-bold uppercase tracking-[0.18em] text-white"
            >
              Get a Free Estimate
            </Link>
          </div>
        </section>

        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
