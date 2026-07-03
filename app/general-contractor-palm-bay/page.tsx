import type { Metadata } from "next";
import SEOLandingPage, { type SEOPageData } from "../components/SEOLandingPage";
import { SITE_URL } from "../lib/site";

const TITLE = "General Contractor in Palm Bay, FL | C&C Contracting";
const DESCRIPTION =
  "Licensed and insured general contractor serving Palm Bay, FL. Home remodels, commercial renovations, and specialty construction. Free estimates — (321) 336-3750.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/general-contractor-palm-bay` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/general-contractor-palm-bay` },
};

const data: SEOPageData = {
  slug: "general-contractor-palm-bay",
  eyebrow: "Palm Bay, Florida",
  headline: "General Contractor in",
  headlineAccent: "Palm Bay, FL",
  subheadline:
    "Licensed and insured general contracting for Palm Bay homes and businesses — remodels, buildouts, and specialty construction, minutes from our Melbourne base.",
  intro: [
    "Palm Bay is the largest city in Brevard County, and its housing stock spans everything from 1980s concrete-block homes in Port Malabar to brand-new construction pushing south and west. C&C Contracting serves all of it. We are a licensed and insured Florida general contractor based in neighboring Melbourne — close enough that Palm Bay is home turf, not a long-distance service call.",
    "For Palm Bay homeowners, we deliver kitchen and bathroom remodels, flooring and tile installation, drywall and painting, decks, patios and outdoor living, home additions, and handyman services. Older block homes here often need updates that touch structure, plumbing, or electrical — work that legally and practically belongs with a licensed contractor who pulls the right permits with the City of Palm Bay and builds to Florida Building Code, including the wind-load standards that matter every storm season.",
    "For businesses along Malabar Road, Babcock Street, and Palm Bay Road, we handle tenant buildouts, office and retail renovations, facility maintenance and repairs, and ADA compliance upgrades. And when a project needs heavier muscle — demolition and site prep, concrete and masonry, framing and structural work — our specialty construction services cover it with the equipment and precision the job demands.",
    "The process is simple: free on-site consultation, detailed transparent estimate, expert build with regular updates, and a final walkthrough with your sign-off. Call (321) 336-3750 or request your free estimate below.",
  ],
  serviceName: "General Contracting",
  serviceDescription:
    "Licensed general contracting in Palm Bay, FL — residential remodels, commercial renovations, and specialty construction with free estimates.",
  serviceArea: "Palm Bay, FL",
  highlights: [
    {
      title: "Home Remodels & Additions",
      description:
        "Kitchens, bathrooms, flooring, paint, decks, and home additions for Palm Bay homes — from Port Malabar originals to new builds.",
    },
    {
      title: "Commercial Work",
      description:
        "Tenant buildouts, office and retail renovations, facility maintenance, and ADA upgrades for Palm Bay businesses, on your timeline and budget.",
    },
    {
      title: "Specialty & Structural",
      description:
        "Demolition, site prep, concrete and masonry, framing and structural work, and exterior siding and facades handled with precision.",
    },
  ],
  faqs: [
    {
      question: "Do you serve all of Palm Bay?",
      answer:
        "Yes — northeast to southwest, from established Port Malabar neighborhoods to new construction areas. Our Melbourne headquarters puts the whole city within a short drive.",
    },
    {
      question: "Are you licensed and insured?",
      answer:
        "Yes. C&C Contracting LLC is a licensed and insured general contractor operating in the State of Florida, with general liability, workers' compensation, and commercial auto coverage. Documentation is available upon request.",
    },
    {
      question: "Do you pull permits with the City of Palm Bay?",
      answer:
        "Yes. Required permits are obtained before work commences, all work is subject to inspection by the local building authority, and certificates of completion are provided as applicable.",
    },
    {
      question: "Can you remodel older block homes?",
      answer:
        "Yes — concrete-block homes are a large share of Palm Bay's housing stock, and our remodel and specialty crews handle the concrete, masonry, framing, and structural work they often require.",
    },
    {
      question: "How do I get started?",
      answer:
        "Request a free estimate through the form below or call (321) 336-3750. We'll schedule a free on-site consultation and deliver a detailed, transparent proposal with scope, materials, timeline, and pricing.",
    },
  ],
  ctaHeadline: "Building or Remodeling in Palm Bay?",
  ctaDescription:
    "Get a free, no-obligation estimate. We'll visit your site, discuss your goals, and put together a transparent proposal.",
};

export default function Page() {
  return <SEOLandingPage data={data} />;
}
