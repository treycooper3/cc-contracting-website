import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Services from "./components/Services";
import WhyChooseUs from "./components/WhyChooseUs";
import Projects from "./components/Projects";
import Process from "./components/Process";
import Testimonials from "./components/Testimonials";
import FAQSection from "./components/FAQSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import JsonLd from "./components/JsonLd";
import { faqPageSchema, generalContractorSchema, SITE_URL } from "./lib/site";

const HOME_FAQS = [
  {
    question: "Who is the best general contractor in Melbourne FL?",
    answer:
      "C&C Contracting is a licensed and insured general contractor based in Melbourne, FL, serving Brevard County and the Space Coast. We handle residential remodels, commercial buildouts, and specialty construction — built to code and beyond, on schedule, with transparent pricing and no runaround. Call (321) 336-3750 for a free estimate.",
  },
  {
    question: "Do you handle commercial renovations?",
    answer:
      "Yes. We deliver tenant buildouts and fit-outs, office and retail renovations, facility maintenance and repairs, and ADA compliance upgrades for commercial properties — working within your timeline and budget.",
  },
  {
    question: "Are you licensed and insured?",
    answer:
      "Yes. C&C Contracting LLC is a licensed and insured general contractor operating in the State of Florida, and we maintain general liability, workers' compensation, and commercial auto coverage. License and insurance documentation is available upon request.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We serve Melbourne, Palm Bay, Viera, Rockledge, Cocoa, Satellite Beach, and the greater Brevard County / Space Coast area of Florida.",
  },
  {
    question: "How do I get an estimate?",
    answer:
      "Estimates are free and no-obligation. Submit the request form on our website, call (321) 336-3750, or email info@candcontracting.com. We'll schedule a free on-site consultation, assess the space, and deliver a detailed, transparent proposal with scope, materials, timeline, and pricing.",
  },
  {
    question: "What residential services do you offer?",
    answer:
      "Kitchen and bathroom remodels, flooring and tile installation, drywall and painting, decks, patios and outdoor living, home additions and renovations, and handyman services.",
  },
  {
    question: "Do you handle demolition and structural work?",
    answer:
      "Yes. Our specialty construction services cover demolition and site prep, concrete and masonry, framing and structural work, and exterior siding and facades — projects that require specialized equipment and precision.",
  },
];

export default function Home() {
  return (
    <>
      <JsonLd
        data={generalContractorSchema({
          "@id": `${SITE_URL}/#business`,
          description:
            "Licensed general contractor serving Florida. Residential remodels, commercial buildouts, and specialty construction. Free estimates.",
        })}
      />
      <JsonLd data={faqPageSchema(HOME_FAQS)} />
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Services />
        <WhyChooseUs />
        <Projects />
        <Process />
        <Testimonials />
        <FAQSection faqs={HOME_FAQS} />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
