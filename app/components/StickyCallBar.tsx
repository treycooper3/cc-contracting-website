import Link from "next/link";
import { PHONE_DISPLAY, PHONE_TEL } from "../lib/site";

// Mobile-only sticky conversion bar. Body gets matching bottom padding in layout.tsx
// so the footer isn't covered.
export default function StickyCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-line pb-[env(safe-area-inset-bottom)] md:hidden">
      <a
        href={`tel:${PHONE_TEL}`}
        className="flex items-center justify-center gap-2 bg-[#0d1117] py-4 font-heading text-xs font-bold uppercase tracking-[0.12em] text-white"
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
        Call {PHONE_DISPLAY}
      </a>
      <Link
        href="/#contact"
        className="flex items-center justify-center bg-primary py-4 font-heading text-xs font-bold uppercase tracking-[0.12em] text-white"
      >
        Free Estimate
      </Link>
    </div>
  );
}
