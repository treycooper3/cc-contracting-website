import { createServerSupabase } from "../lib/supabase-server";

/**
 * Signed in with Supabase but no cc_members row. Membership is granted by an
 * admin, never by signing up, so this is the expected landing for anyone who
 * should not be here.
 *
 * It also reports WHO you are signed in as and what the membership lookup
 * actually returned. This project is shared with FlipBids and Notary Network,
 * so on localhost they share an auth cookie and it is easy to be signed in as
 * the wrong user. Without this, a stale session and a broken RLS policy look
 * identical from the outside.
 */
export default async function NotAMember() {
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("cc_members")
    .select("user_id, role")
    .eq("user_id", auth.user?.id ?? "")
    .maybeSingle();

  return (
    <section className="flex flex-col gap-4">
      <h1 className="font-heading text-2xl">No access</h1>
      <p className="text-muted">
        This account is not on the C&C member list. Ask Trey to add you, then sign in again.
      </p>

      <dl className="grid gap-1 rounded border border-line bg-card p-4 text-sm">
        <div className="flex gap-2">
          <dt className="w-28 text-muted">Signed in as</dt>
          <dd>{auth.user?.email ?? "nobody"}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-28 text-muted">User id</dt>
          <dd className="break-all">{auth.user?.id ?? "-"}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-28 text-muted">Lookup</dt>
          <dd className={error ? "text-danger" : ""}>
            {error ? `${error.code ?? "error"}: ${error.message}` : "no matching cc_members row"}
          </dd>
        </div>
      </dl>
    </section>
  );
}
