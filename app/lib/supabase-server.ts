import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { MemberRole } from "./supabase";

/**
 * Server Supabase client. Anon key only, so RLS is still the thing enforcing
 * access. The cookie store carries the signed-in member's session.
 */
export async function createServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase environment variables are not configured.");

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component, where cookies are read-only. The
          // middleware refreshes the session, so this is safe to swallow.
        }
      },
    },
  });
}

export type Member = { user_id: string; full_name: string; email: string; role: MemberRole };

/**
 * The signed-in member, or null. Returns null for a signed-in Supabase user who
 * has no cc_members row: authentication is not membership, and someone who
 * signs up on their own gets nothing.
 */
export async function getMember(): Promise<Member | null> {
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data } = await supabase
    .from("cc_members")
    .select("user_id, full_name, email, role")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  return (data as Member) ?? null;
}
