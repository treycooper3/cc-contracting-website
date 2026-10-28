import Link from "next/link";
import type { Metadata } from "next";
import { getMember } from "../lib/supabase-server";
import { isSupabaseConfigured } from "../lib/supabase";
import PortalNav from "./PortalNav";
import SignOutButton from "./SignOutButton";

export const metadata: Metadata = {
  title: "C&C Portal",
  robots: { index: false, follow: false },
};

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const member = isSupabaseConfigured() ? await getMember() : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-line bg-card/40">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
          <Link href="/portal" className="font-heading text-base tracking-wide text-primary">
            C&C Portal
          </Link>
          <div className="ml-auto flex items-center gap-4 text-xs text-muted">
            {member && (
              <>
                <span className="hidden sm:inline">
                  {member.full_name} <span className="text-line">·</span> {member.role}
                </span>
                <SignOutButton />
              </>
            )}
            <Link href="/" className="hover:text-foreground">
              Site
            </Link>
          </div>
          {member && (
            <div className="w-full">
              <PortalNav />
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
