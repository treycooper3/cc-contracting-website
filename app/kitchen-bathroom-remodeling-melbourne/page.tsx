import type { Metadata } from "next";
import SEOLandingPage, { type SEOPageData } from "../components/SEOLandingPage";
import { SITE_URL } from "../lib/site";

const TITLE = "Kitchen & Bathroom Remodeling in Melbourne, FL | C&C Contracting";
const DESCRIPTION =
  "Kitchen and bathroom remodeling in Melbourne, FL by a licensed general contractor. Cabinets, counters, tile, plumbing fixtures — free estimates. (321) 336-3750.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/kitchen-bathroom-remodeling-melbourne` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/kitchen-bathroom-remodeling-melbourne` },
};

const data: SEOPageData = {
  slug: "kitchen-bathroom-remodeling-melbourne",
  eyebrow: "Remodeling — Melbourne, FL",
  headline: "Kitchen & Bathroom",
  headlineAccent: "Remodeling",
  subheadline:
    "From dated to showpiece. Licensed remodeling for Melbourne homes — quality materials, expert craftsmanship, and a schedule we actually keep.",
  intro: [
    "Kitchens and bathrooms are where remodeling dollars work hardest — and where cut corners show first. C&C Contracting remodels kitchens and bathrooms across Melbourne and Brevard County as a licensed and insured Florida general contractor, which means your project gets real project management: permits pulled where required, work built to Florida Building Code, licensed trades coordinated, and inspections passed — not just new surfaces over old problems.",
    "A kitchen remodel with us can run from cabinet and countertop replacement to a full gut: layout changes, flooring and tile, drywall and paint, lighting, and finish carpentry. Bathroom remodels cover tub-to-shower conversions, tile showers and floors, vanities and counters, fixtures, and ventilation done right — critical in Florida humidity, where poor moisture control turns a pretty bathroom into a mold problem.",
    "Every project follows the same four-step process: a free on-site consultation to understand your vision and budget; a detailed, transparent estimate with scope, materials, timeline, and pricing; expert execution with regular updates and quality inspections; and a final walkthrough with your sign-off before we call it done. One of our recent clients put it simply: we transformed an outdated kitchen into a modern showpiece and finished ahead of schedule.",
    "If your kitchen or bathroom is stuck in a past decade, get a free, no-obligation estimate. Call (321) 336-3750 or use the form below.",
  ],
  serviceName: "Kitchen & Bathroom Remodeling",
  serviceDescription:
    "Kitchen and bathroom remodeling in Melbourne, FL — cabinets, countertops, tile, showers, vanities, flooring, and full renovations by a licensed general contractor.",
  serviceArea: "Melbourne, FL",
  highlights: [
    {
      title: "Kitchen Remodels",
      description:
        "Cabinets, countertops, backsplashes, flooring, lighting, and full layout changes — from refresh to complete gut renovation.",
    },
    {
      title: "Bathroom Remodels",
      description:
        "Tile showers, tub conversions, vanities, fixtures, and ventilation engineered for Florida humidity — built to last, not just to look good on day one.",
    },
    {
      title: "Whole-Home Upgrades",
      description:
        "Pair your remodel with flooring and tile installation, drywall and painting, or a home addition — one contractor, one schedule, one standard.",
    },
  ],
  // TODO(Charles): adjust these ranges to actual C&C pricing — currently conservative
  // nationally-cited remodeling ranges (Remodeling Magazine Cost vs. Value ballparks).
  costGuide: {
    heading: "What Does a Remodel Cost in",
    headingAccent: "Melbourne?",
    intro:
      "These are typical ranges, not quotes — every project is quoted individually from a free on-site visit, with a detailed written estimate before any work begins.",
    groups: [
      {
        title: "Kitchen Remodeling",
        tiers: [
          {
            name: "Minor Refresh",
            range: "$15K – $30K",
            description:
              "Cabinet refacing or repainting, new countertops, backsplash, fixtures, and hardware — same layout, new look.",
          },
          {
            name: "Mid-Range Remodel",
            range: "$30K – $75K",
            description:
              "New cabinets, stone counters, flooring, lighting, and appliances, with modest layout adjustments.",
          },
          {
            name: "Full Gut Renovation",
            range: "$75K+",
            description:
              "Down to the studs — layout changes, plumbing and electrical relocation, custom cabinetry, and premium finishes.",
          },
        ],
      },
      {
        title: "Bathroom Remodeling",
        tiers: [
          {
            name: "Minor Refresh",
            range: "$8K – $15K",
            description:
              "New vanity, fixtures, tile accents, lighting, and paint — a clean update without moving anything.",
          },
          {
            name: "Mid-Range Remodel",
            range: "$15K – $35K",
            description:
              "Tile shower or tub-to-shower conversion, new tile floors, vanity and counters, and proper ventilation.",
          },
          {
            name: "Full Gut Renovation",
            range: "$35K+",
            description:
              "Complete teardown and rebuild — layout changes, curbless showers, custom tile work, and premium fixtures.",
          },
        ],
      },
    ],
    disclaimer:
      "Typical ranges only — final pricing depends on size, materials, and scope. Every project is quoted individually with a free, no-obligation on-site estimate.",
  },
  faqs: [
    {
      question: "How long does a kitchen or bathroom remodel take?",
      answer:
        "It depends on scope — a straightforward bathroom refresh moves much faster than a full kitchen gut with layout changes. Your written estimate includes a realistic timeline, and we set schedules we stick to, from demo to final walkthrough.",
    },
    {
      question: "Do I need a permit to remodel a kitchen or bathroom in Melbourne?",
      answer:
        "Many remodels involving plumbing, electrical, or structural changes require permits under the Florida Building Code. As a licensed contractor, we obtain required permits before work begins and coordinate all inspections.",
    },
    {
      question: "Can you work from my design ideas?",
      answer:
        "Yes. The free on-site consultation exists to understand your vision, assess the space, and discuss your budget. We then translate that into a detailed scope with materials and pricing before anything is demoed.",
    },
    {
      question: "What does a remodel cost?",
      answer:
        "Pricing depends on size, materials, and scope, so we quote from a free on-site visit. You get a transparent, detailed estimate up front — no hidden fees, no surprises — and changes only happen through written change orders you approve.",
    },
    {
      question: "How much does a kitchen remodel cost in Melbourne, FL?",
      answer:
        "Typical ranges: a minor refresh (refacing, counters, backsplash, fixtures) runs roughly $15K–$30K; a mid-range remodel with new cabinets, stone counters, and flooring roughly $30K–$75K; a full gut renovation with layout changes $75K and up. These are typical ranges only — every project is quoted individually from a free on-site estimate.",
    },
    {
      question: "How much does a bathroom remodel cost in Melbourne, FL?",
      answer:
        "Typical ranges: a minor refresh (vanity, fixtures, lighting, paint) runs roughly $8K–$15K; a mid-range remodel with a tile shower or tub conversion roughly $15K–$35K; a full gut renovation with layout changes $35K and up. These are typical ranges only — every project is quoted individually from a free on-site estimate.",
    },
    {
      question: "Do you remodel outside Melbourne?",
      answer:
        "Yes — we remodel kitchens and bathrooms throughout Brevard County, including Palm Bay, Viera, Rockledge, Cocoa, and Satellite Beach.",
    },
  ],
  ctaHeadline: "Ready for the Kitchen or Bath You Actually Want?",
  ctaDescription:
    "Get a free, no-obligation estimate. We'll visit your home, talk through your vision, and put together a transparent proposal.",
};

export default function Page() {
  return <SEOLandingPage data={data} />;
}
