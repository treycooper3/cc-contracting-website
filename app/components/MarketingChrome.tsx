"use client";

import { usePathname } from "next/navigation";

/**
 * Hides the public-facing chrome (emergency strip, mobile call bar) on the
 * staff portal. Those are conversion elements for customers, and on a phone the
 * call bar sits on top of the portal UI.
 *
 * ponytail: a client wrapper instead of moving every marketing page into an
 * app/(marketing)/ route group. Children still render on the server. Do the
 * route-group split if the portal ever needs a genuinely different root layout.
 */
export default function MarketingChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/portal")) return null;
  return <>{children}</>;
}
