import type { Metadata } from "next";
import LegalShell, { LegalContact } from "../components/LegalShell";
import { SITE_URL } from "../lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions | C&C Contracting",
  description:
    "Terms and Conditions governing the C&C Contracting LLC website and the contracting services we provide in Florida.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <LegalShell title="Terms & Conditions" effectiveDate="February 27, 2026">
      <div className="highlight-box">
        <p>
          These Terms and Conditions (&ldquo;Terms&rdquo;) govern your use of the C&amp;C
          Contracting LLC website and the contracting services we provide. By using our website
          or engaging our services, you agree to be bound by these Terms.
        </p>
      </div>

      <h2>1. Company Information</h2>
      <p>
        <strong>C&amp;C Contracting LLC</strong> is a licensed general contractor operating in
        the State of Florida, providing residential and commercial construction, renovation, and
        remodeling services.
      </p>
      <ul>
        <li>Location: Melbourne, Florida</li>
        <li>
          Email: <a href="mailto:info@candcontracting.com">info@candcontracting.com</a>
        </li>
        <li>
          Phone: <a href="tel:+13213363750">(321) 336-3750</a>
        </li>
      </ul>

      <h2>2. Website Use</h2>
      <h3>2.1 Acceptance of Terms</h3>
      <p>
        By accessing and using this website, you accept and agree to be bound by these Terms. If
        you do not agree, please do not use our website.
      </p>
      <h3>2.2 Permitted Use</h3>
      <p>You may use our website for lawful purposes only, including:</p>
      <ul>
        <li>Reviewing our services and qualifications</li>
        <li>Submitting inquiries and estimate requests</li>
        <li>Contacting us for project discussions</li>
      </ul>
      <h3>2.3 Prohibited Activities</h3>
      <p>You agree not to:</p>
      <ul>
        <li>Submit false or misleading information</li>
        <li>Attempt to interfere with website functionality</li>
        <li>Use the website for any unlawful purpose</li>
        <li>Scrape, copy, or reproduce website content without permission</li>
      </ul>

      <h2>3. Estimate Requests and Proposals</h2>
      <h3>3.1 Non-Binding Inquiries</h3>
      <p>
        Submitting an estimate request or inquiry through our website does not create a
        contractual obligation. All proposals and estimates are preliminary and subject to:
      </p>
      <ul>
        <li>Site inspection and assessment</li>
        <li>Review of complete project specifications</li>
        <li>Execution of a formal written contract</li>
      </ul>
      <h3>3.2 Estimate Validity</h3>
      <p>
        Unless otherwise stated in writing, estimates and proposals are valid for thirty (30)
        days from the date of issuance. Prices are subject to change based on material costs,
        labor rates, and project scope modifications.
      </p>

      <h2>4. Construction Contracts</h2>
      <div className="highlight-box">
        <p>
          <strong>Contract Standards:</strong> All construction contracts with C&amp;C
          Contracting LLC are governed by Florida law and incorporate industry-standard
          provisions consistent with AIA (American Institute of Architects) document principles
          and the Florida Contractor&apos;s Manual.
        </p>
      </div>
      <h3>4.1 Written Contracts Required</h3>
      <p>
        Pursuant to Florida Statutes &sect;489.126, all construction work exceeding $2,500
        requires a written contract. No work will commence without a fully executed contract that
        includes:
      </p>
      <ul>
        <li>Scope of work and specifications</li>
        <li>Contract price and payment schedule</li>
        <li>Estimated start and completion dates</li>
        <li>Permit and inspection responsibilities</li>
        <li>Change order procedures</li>
        <li>Warranty terms</li>
      </ul>
      <h3>4.2 Payment Terms</h3>
      <p>Standard payment terms, unless otherwise specified in the contract:</p>
      <ul>
        <li>Deposit: As specified in contract (typically 10-30%)</li>
        <li>Progress payments: Based on work completed</li>
        <li>Final payment: Due upon substantial completion and final inspection</li>
        <li>Payment terms: Net 30 days from invoice date</li>
      </ul>
      <h3>4.3 Change Orders</h3>
      <p>
        Any modifications to the scope of work, materials, or specifications must be documented
        in a written change order signed by both parties. Change orders may affect the contract
        price and schedule.
      </p>

      <h2>5. Florida Construction Law Compliance</h2>
      <h3>5.1 Licensing</h3>
      <p>
        C&amp;C Contracting LLC maintains all licenses required by the Florida Department of
        Business and Professional Regulation (DBPR) and the Florida Construction Industry
        Licensing Board. License information is available upon request.
      </p>
      <h3>5.2 Permits and Inspections</h3>
      <p>In accordance with Florida Building Code requirements:</p>
      <ul>
        <li>Required permits will be obtained prior to work commencement</li>
        <li>All work is subject to inspection by the local building authority</li>
        <li>Certificates of completion will be provided as applicable</li>
      </ul>
      <h3>5.3 Construction Lien Rights</h3>
      <div className="warning-box">
        <p>
          <strong>IMPORTANT NOTICE:</strong> Pursuant to Florida Statutes Chapter 713,
          contractors, subcontractors, and material suppliers who are not paid in full have the
          right to file a lien against the property. Property owners have the right to request
          lien waivers and releases.
        </p>
      </div>
      <h3>5.4 Right to Cure (Florida Statute &sect;558)</h3>
      <p>
        Before filing any legal action for a construction defect, the claimant must comply with
        the notice and opportunity to repair provisions of Florida Statutes Chapter 558. This
        includes:
      </p>
      <ul>
        <li>
          Written notice of the claim at least 60 days before filing suit (residential) or 120
          days (commercial)
        </li>
        <li>Opportunity for inspection of the alleged defect</li>
        <li>Opportunity to make a written offer to repair or settle</li>
      </ul>

      <h2>6. Warranties</h2>
      <h3>6.1 Workmanship Warranty</h3>
      <p>
        C&amp;C Contracting LLC warrants that all work performed will be completed in a
        workmanlike manner, in accordance with applicable building codes, and free from defects
        in workmanship for a period of one (1) year from substantial completion, unless otherwise
        specified in the contract.
      </p>
      <h3>6.2 Manufacturer Warranties</h3>
      <p>
        Equipment and materials are covered by manufacturer warranties, which will be transferred
        to the property owner. C&amp;C Contracting LLC will assist with warranty claims but is
        not responsible for manufacturer defects beyond installation.
      </p>
      <h3>6.3 Warranty Exclusions</h3>
      <p>Warranties do not cover:</p>
      <ul>
        <li>Damage from misuse, neglect, or improper maintenance</li>
        <li>Damage from acts of God, fire, flood, or other casualties</li>
        <li>Modifications made by others after installation</li>
        <li>Normal wear and tear</li>
        <li>Consequential or incidental damages</li>
      </ul>

      <h2>7. Insurance</h2>
      <p>C&amp;C Contracting LLC maintains the following insurance coverage:</p>
      <ul>
        <li>General Liability Insurance</li>
        <li>Workers&apos; Compensation Insurance</li>
        <li>Commercial Auto Insurance</li>
      </ul>
      <p>Certificates of insurance are available upon request.</p>

      <h2>8. Limitation of Liability</h2>
      <h3>8.1 Website Disclaimer</h3>
      <p>
        The information on this website is provided &ldquo;as is&rdquo; without warranties of any
        kind. We do not guarantee the accuracy, completeness, or timeliness of website content.
      </p>
      <h3>8.2 Limitation of Damages</h3>
      <p>
        To the maximum extent permitted by Florida law, C&amp;C Contracting LLC&apos;s liability
        for any claim arising from our services shall not exceed the contract price for the
        specific work in question. We are not liable for indirect, incidental, special, or
        consequential damages.
      </p>

      <h2>9. Dispute Resolution</h2>
      <h3>9.1 Informal Resolution</h3>
      <p>
        The parties agree to attempt to resolve any dispute informally before initiating formal
        proceedings. Either party may request a meeting to discuss the dispute in good faith.
      </p>
      <h3>9.2 Mediation</h3>
      <p>
        If informal resolution is unsuccessful, the parties agree to submit the dispute to
        mediation before a mutually agreed-upon mediator in Brevard County, Florida.
      </p>
      <h3>9.3 Governing Law and Venue</h3>
      <p>
        These Terms and any construction contracts are governed by the laws of the State of
        Florida. Any legal action shall be brought in the courts of Brevard County, Florida, or
        the United States District Court for the Middle District of Florida.
      </p>
      <h3>9.4 Attorney&apos;s Fees</h3>
      <p>
        In any action to enforce these Terms or a construction contract, the prevailing party
        shall be entitled to recover reasonable attorney&apos;s fees and costs.
      </p>

      <h2>10. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless C&amp;C Contracting LLC, its officers,
        employees, and agents from any claims, damages, or expenses arising from your use of our
        website or your breach of these Terms.
      </p>

      <h2>11. Intellectual Property</h2>
      <p>
        All content on this website, including text, graphics, logos, and images, is the property
        of C&amp;C Contracting LLC and is protected by copyright and trademark laws. You may not
        reproduce, distribute, or create derivative works without our written permission.
      </p>

      <h2>12. Severability</h2>
      <p>
        If any provision of these Terms is found to be unenforceable, the remaining provisions
        will continue in full force and effect.
      </p>

      <h2>13. Modifications</h2>
      <p>
        We reserve the right to modify these Terms at any time. Changes will be posted on this
        page with an updated effective date. Continued use of our website constitutes acceptance
        of modified Terms.
      </p>

      <h2>14. Entire Agreement</h2>
      <p>
        These Terms, together with our Privacy Policy and any executed construction contracts,
        constitute the entire agreement between you and C&amp;C Contracting LLC regarding the
        subject matter herein.
      </p>

      <h2>15. Contact Information</h2>
      <p>For questions about these Terms, please contact us:</p>
      <LegalContact />
      <div className="highlight-box">
        <p>
          <strong>Legal Notice:</strong> These Terms and Conditions incorporate principles from
          AIA contract documents and comply with the Florida Contractor&apos;s Manual and
          applicable Florida Statutes. For specific legal advice regarding construction contracts
          or disputes, please consult with a qualified Florida attorney.
        </p>
      </div>
    </LegalShell>
  );
}
