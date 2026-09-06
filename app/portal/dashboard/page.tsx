import Link from "next/link";
import { createServerSupabase, getMember } from "../../lib/supabase-server";
import type { EventRow, LeadRow } from "../../lib/supabase";
import { formatDate, isOverdue, todayISO } from "../dates";
import { BarList, Donut, Panel, StatTile, type Slice } from "../charts";
import NotAMember from "../NotAMember";

export const dynamic = "force-dynamic";

const OPEN = new Set(["new", "qualifying", "quoting", "submitted"]);

const SOURCE_LABEL: Record<string, string> = {
  web_form: "Website form",
  email: "Email (direct)",
  vapi: "Phone (VAPI agent)",
  referral: "Referral",
  manual: "Added by hand",
};

/** Count by key, biggest first, so the eye lands on the largest slice. */
function tally(items: string[]): Slice[] {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item, (counts.get(item) ?? 0) + 1);
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export default async function DashboardPage() {
  const member = await getMember();
  if (!member) return <NotAMember />;

  const supabase = await createServerSupabase();
  const [leadsResult, eventsResult, membersResult] = await Promise.all([
    supabase.from("cc_leads").select("*"),
    supabase.from("cc_events").select("*"),
    supabase.from("cc_members").select("user_id, full_name"),
  ]);

  const leads = (leadsResult.data ?? []) as LeadRow[];
  const events = (eventsResult.data ?? []) as EventRow[];
  const names = new Map(
    ((membersResult.data ?? []) as { user_id: string; full_name: string }[]).map((m) => [
      m.user_id,
      m.full_name,
    ]),
  );

  const open = leads.filter((l) => OPEN.has(l.stage));
  const won = leads.filter((l) => l.stage === "won");
  const lost = leads.filter((l) => l.stage === "lost" || l.stage === "declined");

  // A submitted bid has met its date by definition, so its quote and bid dates
  // stop being deadlines the moment it goes out. Leaving them in the overdue
  // set paints a delivered proposal red forever, and a dashboard that cries
  // wolf about finished work is one nobody opens.
  const awaitingUs = open.filter((l) => l.stage !== "submitted");
  const overdue = awaitingUs.filter((l) => isOverdue(l.quote_due_at) || isOverdue(l.bid_due_at));
  const unassigned = open.filter((l) => !l.owner_id);
  const noNextAction = open.filter((l) => !l.next_action?.trim());

  const decided = won.length + lost.length;
  const winRate = decided === 0 ? null : Math.round((won.length / decided) * 100);

  // Only open leads, and only the ones actually carrying a number. Counting a
  // lead we have not priced as $0 would quietly understate the pipeline.
  const priced = open.filter((l) => l.value_estimate != null);
  const pipelineValue = priced.reduce((sum, l) => sum + Number(l.value_estimate), 0);

  // Next seven days across quote dates, bid dates and scheduled events.
  const today = todayISO();
  const horizon = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);
  const upcoming = [
    ...open.flatMap((l) =>
      [
        { date: l.quote_due_at, what: `Quote due — ${l.company || l.contact_name}`, id: l.id },
        { date: l.bid_due_at, what: `Bid due — ${l.company || l.contact_name}`, id: l.id },
      ].filter((x) => x.date && x.date >= today && x.date <= horizon),
    ),
    ...events
      .filter((e) => e.starts_at.slice(0, 10) >= today && e.starts_at.slice(0, 10) <= horizon)
      .map((e) => ({ date: e.starts_at.slice(0, 10), what: e.title, id: e.lead_id })),
  ].sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));

  const bySource = tally(open.map((l) => SOURCE_LABEL[l.source] ?? l.source));
  const byStage = tally(open.map((l) => l.stage));
  const byOwner = tally(
    open.map((l) => (l.owner_id ? (names.get(l.owner_id) ?? "Unknown") : "Unassigned")),
  );

  const attention = open
    .map((lead) => {
      const flags: string[] = [];
      if (lead.stage !== "submitted") {
        if (isOverdue(lead.quote_due_at)) flags.push(`quote due ${formatDate(lead.quote_due_at)}`);
        if (isOverdue(lead.bid_due_at)) flags.push(`bid due ${formatDate(lead.bid_due_at)}`);
      }
      if (!lead.owner_id) flags.push("no owner");
      if (!lead.next_action?.trim()) flags.push("no next action");
      return { lead, flags };
    })
    .filter((row) => row.flags.length > 0)
    .sort((a, b) => b.flags.length - a.flags.length);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-baseline gap-3">
        <h1 className="font-heading text-2xl">Dashboard</h1>
        <p className="text-sm text-muted">Everything open, right now</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatTile label="Total leads" value={leads.length} hint={`${open.length} still open`} href="/portal" />
        <StatTile
          href="/portal"
          label="Open pipeline"
          value={
            pipelineValue >= 1000
              ? `$${Math.round(pipelineValue / 1000)}K`
              : `$${pipelineValue.toLocaleString()}`
          }
          hint={
            priced.length === open.length
              ? "every open lead priced"
              : `${priced.length} of ${open.length} priced`
          }
        />
        <StatTile
          href="/portal/deadlines"
          label="Overdue"
          value={overdue.length}
          alert={overdue.length > 0}
          hint={overdue.length ? "past a date we gave" : "nothing past due"}
        />
        <StatTile
          href="/portal"
          label="Unassigned"
          value={unassigned.length}
          alert={unassigned.length > 0}
          hint={unassigned.length ? "nobody owns these" : "all owned"}
        />
        <StatTile
          href="/portal"
          label="Win rate"
          value={winRate === null ? "—" : `${winRate}%`}
          hint={decided === 0 ? "nothing decided yet" : `${won.length} won of ${decided} decided`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Where leads come from" href="/portal">
          {bySource.length ? (
            <Donut slices={bySource} />
          ) : (
            <p className="text-sm text-muted">No open leads.</p>
          )}
        </Panel>

        <Panel title="Leads by stage" href="/portal">
          <BarList rows={byStage} emptyLabel="No open leads." />
        </Panel>

        <Panel title="Workload distribution" href="/portal">
          <BarList rows={byOwner} emptyLabel="No open leads." />
          {unassigned.length > 0 && (
            <p className="text-xs text-muted">
              {unassigned.length} of {open.length} open leads have no owner. Set one on the lead so
              this chart means something.
            </p>
          )}
        </Panel>

        <Panel title="Next seven days" href="/portal/deadlines">
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted">Nothing scheduled in the next week.</p>
          ) : (
            <ul className="flex flex-col gap-2 text-sm">
              {upcoming.map((row, i) => (
                <li key={`${row.id}-${i}`} className="flex flex-wrap gap-x-3">
                  <span className="w-28 text-muted">{formatDate(row.date)}</span>
                  {row.id ? (
                    <Link href={`/portal/leads/${row.id}`} className="hover:text-primary">
                      {row.what}
                    </Link>
                  ) : (
                    <span>{row.what}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel title={`Needs attention (${attention.length})`}>
        {attention.length === 0 ? (
          <p className="text-sm text-muted">
            Every open lead has an owner, a next action, and no past-due dates.
          </p>
        ) : (
          <ul className="flex flex-col gap-2 text-sm">
            {attention.map(({ lead, flags }) => (
              <li key={lead.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <Link
                  href={`/portal/leads/${lead.id}`}
                  className="w-56 shrink-0 truncate hover:text-primary"
                >
                  {lead.company || lead.contact_name}
                </Link>
                <span className="text-danger">{flags.join(" · ")}</span>
              </li>
            ))}
          </ul>
        )}
        {noNextAction.length > 0 && (
          <p className="text-xs text-muted">
            A lead with no next action is the one that goes quiet. Every deal lost here so far was
            lost to delay, not to price.
          </p>
        )}
      </Panel>

    </div>
  );
}
