import { PHONE_DISPLAY, PHONE_TEL } from "../lib/site";

// Thin offer strip above the nav. Not sticky — it scrolls away and the sticky
// nav takes top-0 as before, so no scroll-offset changes are needed.
export default function TopStrip() {
  return (
    <div className="border-b border-line bg-primary px-4 py-2 text-center font-heading text-[11px] font-bold uppercase tracking-[0.14em] text-white sm:text-xs">
      Free Estimates &middot; Serving All of Florida —{" "}
      <a
        href={`tel:${PHONE_TEL}`}
        className="-my-[15px] inline-block py-[15px] underline underline-offset-2 hover:text-accent"
      >
        {PHONE_DISPLAY}
      </a>
    </div>
  );
}
