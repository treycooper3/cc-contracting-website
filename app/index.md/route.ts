const HOMEPAGE_MARKDOWN = `# C&C Contracting — General Contractor | Melbourne, FL

> C&C Contracting LLC is a licensed and insured general contractor serving Florida. Residential remodels, commercial buildouts, and specialty construction. Based in Melbourne, FL, serving Brevard County and the Space Coast. Free estimates.

**Website**: [https://candcontracting.com](https://candcontracting.com)
**Phone**: (321) 336-3750
**Email**: info@candcontracting.com
**Hours**: Mon–Fri 7AM–5PM (emergency service available)

---

## Built Right. Built to Last.

Quality general contracting for residential and commercial projects. From kitchen remodels to full commercial buildouts, we deliver craftsmanship you can count on.

- Licensed & Insured
- Residential & Commercial
- Quality Guaranteed
- Free Estimates

---

## Full-Service General Contracting

From concept to completion, we handle every phase of your project with precision and care.

### Residential — Home Renovations & Remodels
From small updates to full-scale renovations, we bring your vision to life with quality materials and expert craftsmanship.

- Kitchen & Bathroom Remodels
- Flooring & Tile Installation
- Drywall & Painting
- Decks, Patios & Outdoor Living
- Home Additions & Renovations
- Handyman Services

### Commercial — Commercial Construction
Professional buildouts and renovations for offices, retail spaces, and commercial properties. We work within your timeline and budget.

- Tenant Buildouts & Fit-Outs
- Office & Retail Renovations
- Commercial Renovations
- Facility Maintenance & Repairs
- ADA Compliance Upgrades

### Specialty — Specialty Construction
Heavy-duty construction services for projects that require specialized equipment, expertise, and precision.

- Demolition & Site Prep
- Concrete & Masonry
- Framing & Structural Work
- Exterior Siding & Facades

---

## Why Choose Us

- **Quality Craftsmanship** — Every project is built to code and beyond. We take pride in delivering work that stands the test of time.
- **On-Time Delivery** — We set realistic timelines and stick to them. Your project stays on schedule from groundbreaking to final walkthrough.
- **Transparent Pricing** — No hidden fees, no surprises. You get a detailed estimate upfront so you know exactly what you're investing.

---

## Our Process

1. **Consultation** — Free on-site visit to understand your vision, assess the space, and discuss your budget.
2. **Estimate** — Detailed, transparent proposal with scope of work, materials, timeline, and pricing.
3. **Build** — Expert execution with regular updates, quality inspections, and adherence to code.
4. **Deliver** — Final walkthrough, quality check, and client sign-off. Your project, done right.

---

## What Our Clients Say

> "C&C transformed our outdated kitchen into a modern showpiece. The attention to detail was incredible, and they finished ahead of schedule." — Sarah Mitchell, Homeowner, Melbourne FL

> "We hired C&C for a full tenant buildout on our retail space. Professional, organized, and the final product exceeded expectations." — Marcus Rivera, Property Manager

> "Great communication throughout the entire project. They kept us informed at every step and delivered exactly what was promised." — Jennifer Park, Business Owner

---

## Service Areas

Melbourne FL, Palm Bay, Viera, Rockledge, Cocoa, Satellite Beach, Brevard County, and the greater Space Coast.

## More Pages

- [General Contractor in Melbourne, FL](https://candcontracting.com/general-contractor-melbourne-fl)
- [Commercial Renovation in Brevard County](https://candcontracting.com/commercial-renovation-brevard-county)
- [Kitchen & Bathroom Remodeling in Melbourne](https://candcontracting.com/kitchen-bathroom-remodeling-melbourne)
- [General Contractor in Palm Bay, FL](https://candcontracting.com/general-contractor-palm-bay)

## Contact

- **Location**: Melbourne, FL
- **Phone**: (321) 336-3750
- **Email**: info@candcontracting.com
- **Free estimate**: [https://candcontracting.com/#contact](https://candcontracting.com/#contact)
- **LLM context file**: [https://candcontracting.com/llms.txt](https://candcontracting.com/llms.txt)

---

*© ${new Date().getFullYear()} C&C Contracting LLC. All Rights Reserved. | Melbourne, Florida*
`;

export async function GET() {
  return new Response(HOMEPAGE_MARKDOWN, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
