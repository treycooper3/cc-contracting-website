"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/portal/dashboard", label: "Dashboard" },
  { href: "/portal", label: "Pipeline" },
  { href: "/portal/deadlines", label: "Deadlines" },
  { href: "/portal/invoices", label: "Invoices" },
  { href: "/portal/capabilities", label: "Capabilities" },
];

/** A lead page belongs to the pipeline; everything else is its own section. */
function isActive(pathname: string, href: string) {
  if (href === "/portal") return pathname === "/portal" || pathname.startsWith("/portal/leads");
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Client only so it can read the pathname; the layout around it stays a
 * server component. Scrolls sideways on a phone instead of wrapping. */
export default function PortalNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Portal" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex gap-1 whitespace-nowrap text-sm">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-block rounded px-3 py-1.5 transition-colors ${
                  active ? "bg-card-raised text-foreground" : "text-muted hover:bg-card hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
