import type { Metadata } from "next";
import SEOLandingPage, { type SEOPageData } from "../components/SEOLandingPage";
import { SITE_URL } from "../lib/site";

const TITLE = "Flood & Water Damage Restoration | Melbourne & Palm Bay, FL";
const DESCRIPTION =
  "Flooded home in Melbourne, Palm Bay, or West Melbourne? Wet drywall and flooring tear-out, drying with air movers and dehumidifiers, and rebuild. Call (321) 336-3750.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/water-damage-restoration-melbourne` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/water-damage-restoration-melbourne` },
};

const data: SEOPageData = {
  slug: "water-damage-restoration-melbourne",
  eyebrow: "Restoration — Melbourne, FL",
  headline: "Water & Flood Damage",
  headlineAccent: "Restoration",
  subheadline:
    "Flooded, leaking, or soaked after the storm? We dry it out and build it back. One crew, from tear-out to final finish.",
  intro: [
    "The November 2026 flooding put homes across Palm Bay, West Melbourne, and Melbourne under water. If yours took on water, from the storm, a roof leak, or a burst pipe, here is how we help you get it dry and get it back.",
    "Water damage gets worse by the hour. Wet drywall wicks moisture up the wall, flooring cups and swells, and in Florida humidity, mold can start growing within 24 to 48 hours. The faster wet materials come out and the structure gets dried, the less you end up rebuilding.",
    "C&C Contracting handles both halves of the job. First the dry-out: we remove saturated drywall, insulation, carpet, and flooring, then set commercial air movers and dehumidifiers to dry the framing and subfloor. Then the rebuild: new drywall, paint, flooring, baseboards, and trim, so you are not hunting for a second contractor once the fans are gone.",
    "We photograph the damage before, during, and after tear-out and give you a written scope and estimate you can submit to your insurance company.",
    "If your home or business took on water, call (321) 336-3750 or use the form below and we will get out to assess it.",
  ],
  serviceName: "Water & Flood Damage Restoration",
  serviceDescription:
    "Water and flood damage restoration in Melbourne, Palm Bay, and West Melbourne, FL: wet material tear-out, structural drying with air movers and dehumidifiers, and drywall, flooring, and trim rebuild.",
  serviceArea: "Melbourne, Palm Bay & West Melbourne, FL",
  highlights: [
    {
      title: "Tear-Out",
      description:
        "Saturated drywall, insulation, carpet, pad, and flooring come out fast, before the water spreads and the damage grows.",
    },
    {
      title: "Structural Drying",
      description:
        "Commercial air movers and dehumidifiers dry the framing and subfloor so nothing gets closed up wet.",
    },
    {
      title: "Rebuild",
      description:
        "Drywall, paint, flooring, baseboards, and trim put back by the same crew that dried it out. One contractor, one schedule.",
    },
  ],
  faqs: [
    {
      question: "My house flooded. What should I do first?",
      answer:
        "Stay safe first: do not walk through water near outlets or appliances, and shut off power at the breaker only if you can reach it while standing somewhere dry. Then photograph and video every room before you move anything, call your insurance company to open a claim, and get wet rugs and furniture out. Call us at (321) 336-3750 to start tear-out and drying before mold sets in.",
    },
    {
      question: "How do I get water out of my house?",
      answer:
        "Standing water can be removed with a wet/dry vac or a pump once it stops coming in. The bigger problem is the water you cannot see: it soaks into drywall, insulation, baseboards, and the subfloor. Those materials have to be cut out or dried with air movers and dehumidifiers, or they will grow mold behind the walls. That part is what we do.",
    },
    {
      question: "How fast should water damage be dried out?",
      answer:
        "As soon as possible. In Florida's heat and humidity, mold can begin growing on wet drywall and wood within 24 to 48 hours. Getting wet materials out and drying equipment running early is the single biggest factor in how much has to be rebuilt.",
    },
    {
      question: "Will you work with my insurance company?",
      answer:
        "We photograph the damage and provide a written scope and estimate you can submit with your claim. Florida law does not allow contractors to negotiate your claim on your behalf or waive your deductible, so be wary of anyone who offers to.",
    },
    {
      question: "Do you handle mold?",
      answer:
        "Fast drying is how mold is prevented. If we find existing mold growth larger than a small area, Florida requires a licensed mold remediator, so we will refer you to one and handle the rebuild once remediation is complete.",
    },
    {
      question: "Can you rebuild after the house is dried?",
      answer:
        "Yes. That is the advantage of using a general contractor for restoration: drywall, paint, flooring, and trim are rebuilt by the same team, on one schedule, without a hand-off between companies.",
    },
    {
      question: "What areas do you serve for water damage?",
      answer:
        "Melbourne, Palm Bay, West Melbourne, Malabar, and the rest of Brevard County, including Viera, Rockledge, Cocoa, and Satellite Beach.",
    },
  ],
  ctaHeadline: "Took On Water? Let's Get It Dry.",
  ctaDescription:
    "Call (321) 336-3750 or send the form. We'll assess the damage and give you a clear plan to dry it out and build it back.",
};

export default function Page() {
  return <SEOLandingPage data={data} />;
}
