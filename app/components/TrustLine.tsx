import { LICENSE_NUMBER } from "../lib/site";

// Single source for the license/insurance trust line — shown in the trust strip
// and next to the contact form. Flips to the real number via LICENSE_NUMBER in lib/site.ts.
export default function TrustLine({ className = "" }: { className?: string }) {
  const license = LICENSE_NUMBER
    ? `FL CGC #${LICENSE_NUMBER}`
    : "Florida Certified General Contractor (license pending issuance)";
  return (
    <p className={`text-sm text-muted ${className}`}>
      {license} &middot; General liability &amp; workers&apos; comp insured &middot; COI available
      on request
    </p>
  );
}
