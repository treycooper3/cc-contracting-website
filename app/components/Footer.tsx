import Link from "next/link";

const MENU_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#projects", label: "Projects" },
  { href: "/#contact", label: "Contact" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

const AREA_LINKS = [
  { href: "/general-contractor-melbourne-fl", label: "Melbourne, FL" },
  { href: "/general-contractor-palm-bay", label: "Palm Bay" },
  { href: "/commercial-renovation-brevard-county", label: "Brevard County" },
  { href: "/kitchen-bathroom-remodeling-melbourne", label: "Remodeling" },
  { href: "/#contact", label: "All of Florida" },
];

function LinkColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <ul>
      <li className="mb-4 font-heading text-sm font-bold uppercase tracking-[0.1em] text-white">
        {title}
      </li>
      {links.map((link) => (
        <li key={link.href} className="mb-2">
          <Link
            href={link.href}
            className="-my-2 inline-block py-2 text-muted transition-colors hover:text-primary"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-line bg-background pb-8 pt-16">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-10 px-6">
        <div>
          <span className="mb-5 block font-heading text-2xl font-extrabold uppercase text-white">
            C&amp;C Contracting
          </span>
          <p className="max-w-xs text-muted">
            Licensed general contractor based in Melbourne, FL — serving residential and
            commercial clients throughout Florida, from the Space Coast to South Florida.
          </p>
        </div>
        <div className="flex flex-wrap gap-12">
          <LinkColumn title="Menu" links={MENU_LINKS} />
          <LinkColumn title="Service Areas" links={AREA_LINKS} />
          <LinkColumn title="Legal" links={LEGAL_LINKS} />
        </div>
      </div>
      <div className="mt-12 text-center text-xs text-[#484f58]">
        &copy; {new Date().getFullYear()} C&amp;C Contracting LLC. All Rights Reserved.
      </div>
    </footer>
  );
}
