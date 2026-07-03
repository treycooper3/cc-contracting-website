import type { Metadata } from "next";
import SEOLandingPage, { type SEOPageData } from "../components/SEOLandingPage";
import { SITE_URL } from "../lib/site";

const TITLE = "Commercial Renovation in Brevard County | C&C Contracting";
const DESCRIPTION =
  "Commercial renovations, tenant buildouts, and facility upgrades across Brevard County, FL. Licensed and insured general contractor. Free estimates — (321) 336-3750.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/commercial-renovation-brevard-county` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/commercial-renovation-brevard-county` },
};

const data: SEOPageData = {
  slug: "commercial-renovation-brevard-county",
  eyebrow: "Brevard County, Florida",
  headline: "Commercial Renovation in",
  headlineAccent: "Brevard County",
  subheadline:
    "Tenant buildouts, office and retail renovations, and facility upgrades for commercial properties across the Space Coast — on your timeline and budget.",
  intro: [
    "When a commercial space in Brevard County needs to be renovated, every week of construction is a week of lost rent, delayed openings, or disrupted operations. C&C Contracting builds commercial renovation schedules around that reality. We are a licensed and insured Florida general contractor based in Melbourne, delivering tenant buildouts, office and retail renovations, facility maintenance, and ADA compliance upgrades for property managers, landlords, and business owners from Palm Bay to Titusville.",
    "Our commercial work starts with a free site visit and a detailed written proposal — scope of work, materials, timeline, and pricing — so ownership groups and facility managers can make decisions with real numbers. Once contracted, we obtain the required permits, coordinate inspections with the local building authority, run the job to Florida Building Code, and keep you updated at every phase. Change orders are documented in writing and signed by both parties before they affect price or schedule.",
    "We understand what commercial clients in Brevard County are up against: hurricane-rated envelope requirements, aging retail stock along US-1 and Wickham Road that needs modernization, and the steady demand for office and flex space driven by the Space Coast economy. Whether it's a full tenant fit-out, a phased renovation of an occupied building, or ongoing facility repairs, we deliver commercial-grade craftsmanship without the runaround.",
    "Request a free estimate below or call (321) 336-3750 to discuss your property.",
  ],
  serviceName: "Commercial Renovation",
  serviceDescription:
    "Commercial renovations, tenant buildouts, office and retail fit-outs, facility maintenance, and ADA compliance upgrades across Brevard County, FL.",
  serviceArea: "Brevard County, FL",
  highlights: [
    {
      title: "Tenant Buildouts & Fit-Outs",
      description:
        "Vanilla shell to move-in ready. We build out office, retail, and flex spaces to spec so your tenants can open on time.",
    },
    {
      title: "Office & Retail Renovations",
      description:
        "Modernize aging commercial space — interior demolition, framing, drywall, flooring, paint, and finish work executed to code with minimal disruption.",
    },
    {
      title: "Facility Maintenance & ADA",
      description:
        "Ongoing facility maintenance and repairs plus ADA compliance upgrades that keep your property safe, accessible, and lease-ready.",
    },
  ],
  faqs: [
    {
      question: "Do you renovate occupied commercial buildings?",
      answer:
        "Yes. We plan phasing, containment, and work hours around your tenants and operations, and we keep you informed at every step so business disruption stays minimal.",
    },
    {
      question: "Are you licensed and insured for commercial work in Florida?",
      answer:
        "Yes. C&C Contracting LLC is a licensed and insured general contractor operating in the State of Florida, carrying general liability, workers' compensation, and commercial auto coverage. Certificates are available upon request.",
    },
    {
      question: "What parts of Brevard County do you cover?",
      answer:
        "We serve the full county — Melbourne, Palm Bay, Viera, Rockledge, Cocoa, Satellite Beach, and the surrounding Space Coast communities.",
    },
    {
      question: "How do commercial estimates work?",
      answer:
        "We start with a free site visit, then deliver a detailed written proposal with scope of work, materials, timeline, and pricing. Estimates are valid for thirty days, and all work over $2,500 is covered by a written contract per Florida Statutes §489.126.",
    },
    {
      question: "Can you handle ADA compliance upgrades?",
      answer:
        "Yes. ADA compliance upgrades are a core commercial service — from accessible restrooms and entries to path-of-travel corrections — built to Florida Building Code and inspected by the local authority.",
    },
  ],
  ctaHeadline: "Have a Commercial Property That Needs Work?",
  ctaDescription:
    "Get a free, no-obligation estimate. We'll walk the property, scope the project, and deliver a transparent proposal your ownership group can act on.",
};

export default function Page() {
  return <SEOLandingPage data={data} />;
}
