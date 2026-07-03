import SectionHeader from "./SectionHeader";
import type { FAQItem } from "../lib/site";

// Visible FAQ accordion — renders the SAME array passed to faqPageSchema so
// markup and structured data stay 1:1 (Google guideline).
export default function FAQSection({ faqs }: { faqs: FAQItem[] }) {
  return (
    <section id="faq" className="border-t border-line py-24">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeader eyebrow="FAQ" title="Frequently Asked Questions" />
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details key={faq.question} className="group border border-line bg-card">
              {/* padding lives on the summary so the whole card header is a >=44px tap target */}
              <summary className="block cursor-pointer list-none p-6 font-heading text-base font-bold uppercase tracking-wide text-foreground">
                <span className="text-primary">{"// "}</span>
                {faq.question}
              </summary>
              <p className="px-6 pb-6 text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
