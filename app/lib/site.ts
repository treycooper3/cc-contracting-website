// Single source of truth for NAP + site constants. Keep these EXACT everywhere.
export const SITE_URL = "https://www.candcontracting.com"; // apex 307s to www — www is canonical on Vercel
export const BUSINESS_NAME = "C&C Contracting";
export const LEGAL_NAME = "C&C Contracting LLC";
export const PHONE_DISPLAY = "(321) 336-3750";
export const PHONE_TEL = "+13213363750";
export const EMAIL = "info@candcontracting.com";
export const CITY = "Melbourne";
export const STATE = "FL";
export const GEO = { latitude: 28.0836, longitude: -80.6081 };
export const HOURS = "Mon - Fri: 7AM - 5PM";
// TODO: drop the FL CGC number in here once DBPR issues it — TrustLine renders "FL CGC #<number>" everywhere automatically.
export const LICENSE_NUMBER: string | null = null;
export const FORM_WEBHOOK_URL = "https://treycooper.app.n8n.cloud/webhook/cc-form";

export const AREA_SERVED = [
  "Melbourne FL",
  "Palm Bay",
  "Viera",
  "Rockledge",
  "Cocoa",
  "Satellite Beach",
  "Brevard County",
  "Space Coast",
  "Orlando",
  "Tampa",
  "Jacksonville",
  "Fort Lauderdale",
  "Miami",
];

// Base GeneralContractor schema — extend per page (e.g. add @id, description).
export function generalContractorSchema(
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: BUSINESS_NAME,
    legalName: LEGAL_NAME,
    url: SITE_URL,
    telephone: PHONE_DISPLAY,
    email: EMAIL,
    image: `${SITE_URL}/cc-logo-transparent.png`,
    logo: `${SITE_URL}/cc-logo-transparent.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: CITY,
      addressRegion: STATE,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: GEO.latitude,
      longitude: GEO.longitude,
    },
    areaServed: [
      { "@type": "State", name: "Florida" },
      ...AREA_SERVED.map((name) => ({ "@type": "Place", name })),
    ],
    openingHours: "Mo-Fr 07:00-17:00",
    priceRange: "$$",
    sameAs: [],
    ...overrides,
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}

export function faqPageSchema(faqs: FAQItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
