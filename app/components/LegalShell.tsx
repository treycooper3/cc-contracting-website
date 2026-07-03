import Link from "next/link";
import type { ReactNode } from "react";
import { EMAIL, PHONE_DISPLAY, PHONE_TEL } from "../lib/site";

interface LegalShellProps {
  title: string;
  effectiveDate: string;
  children: ReactNode;
}

export function LegalContact() {
  return (
    <p>
      <strong>C&amp;C Contracting LLC</strong>
      <br />
      Melbourne, Florida
      <br />
      Email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
      <br />
      Phone: <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
    </p>
  );
}

export default function LegalShell({ title, effectiveDate, children }: LegalShellProps) {
  return (
    <div className="legal">
      <header className="border-b border-line bg-card py-5">
        <div className="mx-auto max-w-4xl px-5">
          <Link href="/" className="font-heading text-2xl font-extrabold uppercase !text-foreground no-underline">
            C&amp;C<span className="!text-primary">Contracting</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-10">
        <h1>{title}</h1>
        <p className="effective-date">
          Effective Date: {effectiveDate} | Last Updated: {effectiveDate}
        </p>
        {children}
        <Link
          href="/"
          className="btn-fill mt-10 inline-block bg-primary px-8 py-3 font-heading text-sm font-semibold uppercase tracking-[0.1em] !text-white no-underline"
        >
          Back to Home
        </Link>
      </div>

      <footer className="mt-16 border-t border-line bg-card py-8 text-center">
        <p className="!mb-0 text-sm text-muted">
          &copy; {new Date().getFullYear()} C&amp;C Contracting LLC. All Rights Reserved. |
          Melbourne, Florida
        </p>
      </footer>
    </div>
  );
}
