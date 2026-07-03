"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#projects", label: "Projects" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" onClick={() => setOpen(false)} className="relative z-50">
          <Image
            src="/cc-logo-transparent.png"
            alt="C&C Contracting"
            width={96}
            height={96}
            priority
            className="h-20 w-20 object-contain brightness-0 invert"
          />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-item font-heading text-sm font-medium uppercase tracking-[0.12em] text-muted transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="btn-fill border-2 border-primary bg-primary px-6 py-3 font-heading text-xs font-bold uppercase tracking-[0.18em] text-white"
          >
            Free Estimate
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="relative z-50 -m-4 flex flex-col gap-[5px] p-4 md:hidden"
        >
          <span
            className={`h-[3px] w-6 bg-foreground transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span className={`h-[3px] w-6 bg-foreground transition-opacity ${open ? "opacity-0" : ""}`} />
          <span
            className={`h-[3px] w-6 bg-foreground transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col items-center gap-8 border-t border-line bg-background/95 py-10 backdrop-blur-md md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-heading text-lg font-medium uppercase tracking-[0.12em] text-muted"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            onClick={() => setOpen(false)}
            className="btn-fill border-2 border-primary bg-primary px-8 py-4 font-heading text-sm font-bold uppercase tracking-[0.18em] text-white"
          >
            Free Estimate
          </Link>
        </nav>
      )}
    </header>
  );
}
