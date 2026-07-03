import type { Metadata } from "next";
import SEOLandingPage, { type SEOPageData } from "../components/SEOLandingPage";
import { SITE_URL } from "../lib/site";

const TITLE = "General Contractor in Melbourne, FL | C&C Contracting";
const DESCRIPTION =
  "Licensed and insured general contractor in Melbourne, FL. Residential remodels, commercial buildouts, and specialty construction across Brevard County. Free estimates — (321) 336-3750.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/general-contractor-melbourne-fl` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/general-contractor-melbourne-fl` },
};

const data: SEOPageData = {
  slug: "general-contractor-melbourne-fl",
  eyebrow: "Melbourne, Florida",
  headline: "General Contractor in",
  headlineAccent: "Melbourne, FL",
  subheadline:
    "Licensed and insured general contracting for homes and businesses in Melbourne and across the Space Coast. Built right, built to last.",
  intro: [
    "C&C Contracting is a licensed and insured general contractor headquartered in Melbourne, Florida. We serve homeowners, property managers, and business owners throughout Brevard County with one standard: work that is built to code and beyond, delivered on schedule, at a price you understood before the first hammer swung.",
    "Melbourne construction has its own realities — Florida Building Code wind-load requirements, salt-air corrosion near the Indian River Lagoon, permitting through the City of Melbourne and Brevard County building departments, and summer storm seasons that punish shortcuts. We plan around all of it. Every project starts with a free on-site consultation, moves to a detailed written estimate with scope, materials, timeline, and pricing, and finishes with a final walkthrough and client sign-off.",
    "On the residential side, we handle kitchen and bathroom remodels, flooring and tile, drywall and painting, decks and outdoor living, home additions, and handyman work. For commercial clients we deliver tenant buildouts, office and retail renovations, facility maintenance, and ADA compliance upgrades. When a project calls for heavier work — demolition, concrete and masonry, framing and structural — our specialty construction crews take it from site prep to final inspection.",
    "No hidden fees. No surprise change orders. No runaround. Just commercial-grade craftsmanship from a contractor that picks up the phone. Call (321) 336-3750 or request a free estimate below.",
  ],
  serviceName: "General Contracting",
  serviceDescription:
    "Licensed general contracting in Melbourne, FL — residential remodels, commercial buildouts, and specialty construction with free estimates.",
  serviceArea: "Melbourne, FL",
  highlights: [
    {
      title: "Residential Remodels",
      description:
        "Kitchen and bathroom remodels, flooring and tile, drywall and painting, decks and patios, home additions, and handyman services for Melbourne homes.",
    },
    {
      title: "Commercial Buildouts",
      description:
        "Tenant buildouts and fit-outs, office and retail renovations, facility maintenance, and ADA compliance upgrades — on your timeline and budget.",
    },
    {
      title: "Specialty Construction",
      description:
        "Demolition and site prep, concrete and masonry, framing and structural work, and exterior siding and facades handled with specialized equipment and precision.",
    },
  ],
  faqs: [
    {
      question: "Are you a licensed general contractor in Melbourne, FL?",
      answer:
        "Yes. C&C Contracting LLC is a licensed and insured general contractor operating in the State of Florida, based in Melbourne. License and insurance documentation is available upon request.",
    },
    {
      question: "Do you handle permits with the City of Melbourne?",
      answer:
        "Yes. In accordance with Florida Building Code requirements, we obtain required permits before work commences and coordinate all inspections with the local building authority.",
    },
    {
      question: "How much does a general contractor cost in Melbourne?",
      answer:
        "Every project is different, so we price from a free on-site consultation. You get a detailed written estimate covering scope of work, materials, timeline, and pricing before anything starts — no hidden fees, no surprises.",
    },
    {
      question: "Do you work outside Melbourne?",
      answer:
        "Yes. We serve Palm Bay, Viera, Rockledge, Cocoa, Satellite Beach, and the greater Brevard County / Space Coast area.",
    },
    {
      question: "How fast can you start?",
      answer:
        "Request a free estimate online or call (321) 336-3750. We typically schedule the on-site consultation quickly, and we set realistic start dates we actually keep.",
    },
  ],
  ctaHeadline: "Ready to Build in Melbourne?",
  ctaDescription:
    "Get a free, no-obligation estimate. We'll visit your site, discuss your goals, and put together a transparent proposal.",
};

export default function Page() {
  return <SEOLandingPage data={data} />;
}
