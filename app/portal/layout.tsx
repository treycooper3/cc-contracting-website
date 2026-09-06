import Link from "next/link";
import type { Metadata } from "next";
import { getMember } from "../lib/supabase-server";
import { isSupabaseConfigured } from "../lib/supabase";
import SignOutButton from "./SignOutButton";

export const metadata: Metadata = {
  title: "C&C Portal",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/portal/dashboard", label: "Dashboard" },
  { href: "/portal", label: "Pipeline" },
  { href: "/portal/deadlines", label: "Deadlines" },
  { href: "/portal/invoices", label: "Invoices" },
  { href: "/portal/capabilities", label: "Capabilities" },
];

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const member = isSupabaseConfigured() ? await getMember() : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-4">
          <Link href="/portal" className="font-heading text-lg tracking-wide text-primary">
            C&C Portal
          </Link>
          {member && (
            <nav className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} className="text-muted hover:text-foreground">
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
          <div className="ml-auto flex items-center gap-4 text-sm text-muted">
            {member && (
              <>
                <span>
                  {member.full_name} · {member.role}
                </span>
                <SignOutButton />
              </>
            )}
            <Link href="/" className="hover:text-foreground">
              Site
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
