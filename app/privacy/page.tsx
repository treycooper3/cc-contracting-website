import type { Metadata } from "next";
import LegalShell, { LegalContact } from "../components/LegalShell";
import { SITE_URL } from "../lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy | C&C Contracting",
  description:
    "How C&C Contracting LLC collects, uses, and safeguards your information in the State of Florida.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" effectiveDate="February 27, 2026">
      <div className="highlight-box">
        <p>
          <strong>C&amp;C Contracting LLC</strong> (&ldquo;Company,&rdquo; &ldquo;we,&rdquo;
          &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting your privacy. This
          Privacy Policy explains how we collect, use, disclose, and safeguard your information
          when you visit our website or engage our services in the State of Florida.
        </p>
      </div>

      <h2>1. Information We Collect</h2>
      <h3>1.1 Personal Information</h3>
      <p>We may collect personal information that you voluntarily provide when you:</p>
      <ul>
        <li>Submit a contact form or estimate request</li>
        <li>Request a quote or service estimate</li>
        <li>Enter into a service contract with us</li>
        <li>Communicate with us via email, phone, or other channels</li>
      </ul>
      <p>This information may include:</p>
      <ul>
        <li>Name and company name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Physical address and project location</li>
        <li>Project details and specifications</li>
        <li>Payment and billing information (for contracted services)</li>
      </ul>
      <h3>1.2 Automatically Collected Information</h3>
      <p>When you access our website, we may automatically collect:</p>
      <ul>
        <li>IP address and browser type</li>
        <li>Device information and operating system</li>
        <li>Pages visited and time spent on site</li>
        <li>Referring website addresses</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Respond to your inquiries and provide customer service</li>
        <li>Process estimate requests and prepare project proposals</li>
        <li>Perform contracted general contracting and construction services</li>
        <li>Send project updates, invoices, and service-related communications</li>
        <li>Comply with Florida contractor licensing requirements and regulations</li>
        <li>Maintain records as required by the Florida Construction Industry Licensing Board</li>
        <li>Improve our website and services</li>
        <li>Protect against fraud and unauthorized transactions</li>
      </ul>

      <h2>3. Disclosure of Your Information</h2>
      <p>We may share your information in the following circumstances:</p>
      <h3>3.1 Service Providers</h3>
      <p>
        We may share information with third-party vendors who perform services on our behalf,
        including:
      </p>
      <ul>
        <li>Website hosting and maintenance</li>
        <li>Email and communication services</li>
        <li>Payment processing</li>
        <li>Project management and scheduling tools</li>
      </ul>
      <h3>3.2 Legal Requirements</h3>
      <p>We may disclose information when required by law, including:</p>
      <ul>
        <li>Compliance with Florida Statutes and regulations</li>
        <li>Response to subpoenas, court orders, or legal process</li>
        <li>Protection of our legal rights and property</li>
        <li>Cooperation with law enforcement agencies</li>
      </ul>
      <h3>3.3 Business Transfers</h3>
      <p>
        In the event of a merger, acquisition, or sale of assets, your information may be
        transferred as part of the transaction.
      </p>

      <h2>4. Florida-Specific Disclosures</h2>
      <div className="highlight-box">
        <p>
          As a licensed contractor operating in Florida, we maintain records in accordance with
          Florida Statutes Chapter 489 (Contracting) and Chapter 553 (Building Construction
          Standards). Project records may be retained for the periods required by law.
        </p>
      </div>
      <h3>4.1 Contractor Records</h3>
      <p>Under Florida law, we maintain project documentation including:</p>
      <ul>
        <li>Contract documents and change orders</li>
        <li>Permits and inspection records</li>
        <li>Lien waivers and payment records</li>
        <li>Warranty documentation</li>
      </ul>
      <p>
        These records are retained for the legally required periods and may contain personal
        information provided during the contracting process.
      </p>
      <h3>4.2 Construction Lien Law Notices</h3>
      <p>
        Pursuant to Florida Statutes Chapter 713, certain project information may be recorded in
        public records as part of the lien process.
      </p>

      <h2>5. Data Security</h2>
      <p>
        We implement appropriate technical and organizational measures to protect your personal
        information, including:
      </p>
      <ul>
        <li>Secure Socket Layer (SSL) encryption for data transmission</li>
        <li>Secure storage of electronic records</li>
        <li>Limited access to personal information on a need-to-know basis</li>
        <li>Regular security assessments and updates</li>
      </ul>
      <p>
        However, no method of transmission over the Internet is 100% secure, and we cannot
        guarantee absolute security.
      </p>

      <h2>6. Your Rights and Choices</h2>
      <p>You have the right to:</p>
      <ul>
        <li>
          <strong>Access:</strong> Request a copy of the personal information we hold about you
        </li>
        <li>
          <strong>Correction:</strong> Request correction of inaccurate information
        </li>
        <li>
          <strong>Deletion:</strong> Request deletion of your information, subject to legal
          retention requirements
        </li>
        <li>
          <strong>Opt-out:</strong> Unsubscribe from marketing communications at any time
        </li>
      </ul>
      <p>To exercise these rights, contact us using the information below.</p>

      <h2>7. Cookies and Tracking Technologies</h2>
      <p>
        Our website may use cookies and similar technologies to enhance your experience. You can
        control cookie settings through your browser preferences. Disabling cookies may affect
        website functionality.
      </p>

      <h2>8. Third-Party Links</h2>
      <p>
        Our website may contain links to third-party websites. We are not responsible for the
        privacy practices of these external sites. We encourage you to review their privacy
        policies before providing any information.
      </p>

      <h2>9. Children&apos;s Privacy</h2>
      <p>
        Our services are not directed to individuals under 18 years of age. We do not knowingly
        collect personal information from children.
      </p>

      <h2>10. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Changes will be posted on this page
        with an updated effective date. Continued use of our website after changes constitutes
        acceptance of the updated policy.
      </p>

      <h2>11. Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy or our privacy practices, please contact
        us:
      </p>
      <LegalContact />
      <div className="highlight-box">
        <p>
          <strong>Legal Notice:</strong> This Privacy Policy is provided for informational
          purposes and is designed to comply with Florida law and industry standards. For
          specific legal advice, please consult with a qualified attorney.
        </p>
      </div>
    </LegalShell>
  );
}
