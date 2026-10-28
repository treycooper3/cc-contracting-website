import Link from "next/link";
import { createServerSupabase, getMember } from "../lib/supabase-server";
import { LEAD_STAGES, type LeadRow } from "../lib/supabase";
import { formatDate, isOverdue } from "./dates";
import { isLeadOverdue, isOpen, isUnassigned } from "./calc";
import { cell, head, Empty, Table } from "./charts";
import { completeNextAction } from "./actions";
import NotAMember from "./NotAMember";

export const dynamic = "force-dynamic";

/** The dashboard tiles link here with ?filter=…, so "click a card to see its
 * records" is a URL, not a modal. Same predicates as the tiles, from calc.ts. */
const FILTERS = {
  all: { label: "All", keep: () => true },
  open: { label: "Open", keep: isOpen },
  overdue: { label: "Overdue", keep: isLeadOverdue },
  unassigned: { label: "Unassigned", keep: isUnassigned },
  won: { label: "Won", keep: (l: LeadRow) => l.stage === "won" },
} satisfies Record<string, { label: string; keep: (lead: LeadRow) => boolean }>;
type FilterKey = keyof typeof FILTERS;

function resolveFilter(raw: string | string[] | undefined): FilterKey {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value && value in FILTERS ? (value as FilterKey) : "all";
}

export default async function PipelinePage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string | string[] }>;
}) {
  const member = await getMember();
  if (!member) return <NotAMember />;
  const filter = resolveFilter((await searchParams).filter);

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
  const open = leads.filter(isOpen);
  const shown = leads.filter(FILTERS[filter].keep);

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl">Pipeline</h1>
          <p className="text-sm text-muted">
            {open.length} open of {leads.length}
            {filter !== "all" && ` · showing ${shown.length} ${FILTERS[filter].label.toLowerCase()}`}
          </p>
        </div>
        <nav aria-label="Filter" className="flex flex-wrap gap-1 text-sm">
          {(Object.keys(FILTERS) as FilterKey[]).map((key) => (
            <Link
              key={key}
              href={key === "all" ? "/portal" : `/portal?filter=${key}`}
              aria-current={key === filter ? "true" : undefined}
              className={`rounded px-3 py-1 transition-colors ${
                key === filter ? "bg-card-raised text-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              {FILTERS[key].label}
            </Link>
          ))}
        </nav>
      </header>

      {leads.length === 0 && (
        <Empty>No leads yet. The website form posts to /api/leads, or add one by hand in Supabase.</Empty>
      )}
      {leads.length > 0 && shown.length === 0 && (
        <Empty>Nothing matches “{FILTERS[filter].label}”. That is usually good news.</Empty>
      )}

      {LEAD_STAGES.map((stage) => {
        const rows = shown.filter((lead) => lead.stage === stage);
        if (rows.length === 0) return null;

        return (
          <div key={stage} className="flex flex-col gap-2">
            <h2 className="font-heading text-sm uppercase tracking-[0.12em] text-primary">
              {stage} <span className="text-muted">({rows.length})</span>
            </h2>
            <Table minWidth="46rem">
              <thead>
                <tr className="border-b border-line">
                  <th className={head}>Who</th>
                  <th className={head}>Scope</th>
                  <th className={head}>Location</th>
                  <th className={head}>Quote due</th>
                  <th className={head}>Bid due</th>
                  <th className={head}>Next action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((lead) => {
                  // A date on a closed or submitted lead is history, not a missed
                  // deadline. Same rule as isLeadOverdue, per date.
                  const canBeLate = isOpen(lead) && stage !== "submitted";
                  const quoteLate = canBeLate && isOverdue(lead.quote_due_at);
                  const bidLate = canBeLate && isOverdue(lead.bid_due_at);
                  return (
                    <tr key={lead.id} className="align-top">
                      <td className={cell}>
                        <Link href={`/portal/leads/${lead.id}`} className="text-foreground hover:text-primary">
                          {lead.company || lead.contact_name}
                        </Link>
                        {lead.company && <div className="text-xs text-muted">{lead.contact_name}</div>}
                      </td>
                      <td className={`${cell} text-muted`}>{lead.scope}</td>
                      <td className={`${cell} text-muted`}>{lead.site_location}</td>
                      <td className={`${cell} whitespace-nowrap tabular-nums ${quoteLate ? "text-danger" : "text-muted"}`}>
                        {formatDate(lead.quote_due_at)}
                        {quoteLate && " · overdue"}
                      </td>
                      <td className={`${cell} whitespace-nowrap tabular-nums ${bidLate ? "text-danger" : "text-muted"}`}>
                        {formatDate(lead.bid_due_at)}
                        {bidLate && " · overdue"}
                      </td>
                      <td className={`${cell} text-muted`}>
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
                  );
                })}
              </tbody>
            </Table>
          </div>
        );
      })}
    </section>
  );
}
