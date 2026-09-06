import Link from "next/link";
import { createServerSupabase, getMember } from "../lib/supabase-server";
import { LEAD_STAGES, type LeadRow } from "../lib/supabase";
import { formatDate, isOverdue } from "./dates";
import { completeNextAction } from "./actions";
import NotAMember from "./NotAMember";

export const dynamic = "force-dynamic";

const OPEN_STAGES = new Set(["new", "qualifying", "quoting", "submitted"]);

export default async function PipelinePage() {
  const member = await getMember();
  if (!member) return <NotAMember />;

  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("cc_leads")
    .select("*")
    .order("quote_due_at", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="text-danger">Could not load the pipeline: {error.message}</p>;
  }

  const leads = (data ?? []) as LeadRow[];
  const open = leads.filter((lead) => OPEN_STAGES.has(lead.stage));

  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-wrap items-baseline gap-3">
        <h1 className="font-heading text-2xl">Pipeline</h1>
        <p className="text-sm text-muted">
          {open.length} open of {leads.length}
        </p>
      </header>

      {leads.length === 0 && (
        <p className="text-muted">
          No leads yet. The website form posts to /api/leads, or add one by hand in Supabase.
        </p>
      )}

      {LEAD_STAGES.map((stage) => {
        const rows = leads.filter((lead) => lead.stage === stage);
        if (rows.length === 0) return null;

        return (
          <div key={stage} className="flex flex-col gap-2">
            <h2 className="font-heading text-sm uppercase tracking-wider text-primary">
              {stage} ({rows.length})
            </h2>
            <div className="overflow-x-auto rounded border border-line">
              <table className="w-full min-w-[46rem] text-sm">
                <thead className="bg-card text-left text-muted">
                  <tr>
                    <th className="px-3 py-2 font-medium">Who</th>
                    <th className="px-3 py-2 font-medium">Scope</th>
                    <th className="px-3 py-2 font-medium">Location</th>
                    <th className="px-3 py-2 font-medium">Quote due</th>
                    <th className="px-3 py-2 font-medium">Bid due</th>
                    <th className="px-3 py-2 font-medium">Next action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((lead) => (
                    <tr key={lead.id} className="border-t border-line align-top">
                      <td className="px-3 py-2">
                        <Link href={`/portal/leads/${lead.id}`} className="text-foreground hover:text-primary">
                          {lead.company || lead.contact_name}
                        </Link>
                        {lead.company && (
                          <div className="text-xs text-muted">{lead.contact_name}</div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-muted">{lead.scope}</td>
                      <td className="px-3 py-2 text-muted">{lead.site_location}</td>
                      <td
                        className={`px-3 py-2 ${isOverdue(lead.quote_due_at) ? "text-danger" : "text-muted"}`}
                      >
                        {formatDate(lead.quote_due_at)}
                        {isOverdue(lead.quote_due_at) && " overdue"}
                      </td>
                      <td
                        className={`px-3 py-2 ${isOverdue(lead.bid_due_at) ? "text-danger" : "text-muted"}`}
                      >
                        {formatDate(lead.bid_due_at)}
                        {isOverdue(lead.bid_due_at) && " overdue"}
                      </td>
                      <td className="px-3 py-2 text-muted">
                        {lead.next_action && (
                          <div className="flex items-start gap-2">
                            <span>{lead.next_action}</span>
                            <form action={completeNextAction}>
                              <input type="hidden" name="lead_id" value={lead.id} />
                              <button
                                type="submit"
                                title="Mark this next action complete — it moves into the lead's activity trail"
                                className="whitespace-nowrap rounded border border-line px-2 py-0.5 text-xs text-muted transition-colors hover:border-primary hover:text-primary"
                              >
                                ✓ complete
                              </button>
                            </form>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </section>
  );
}
