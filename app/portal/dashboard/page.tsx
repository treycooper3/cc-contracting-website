import Link from "next/link";
import { createServerSupabase, getMember } from "../../lib/supabase-server";
import type { EventRow, InvoiceRow, LeadRow } from "../../lib/supabase";
import { formatDate, isOverdue, monthLabel, todayISO } from "../dates";
import {
  compactMoney,
  fmtPct,
  fmtSigned,
  isLeadOverdue,
  isOpen,
  isUnassigned,
  jobLedger,
  money,
  monthlySeries,
  monthOverMonth,
  pipelineValue,
  winRate,
} from "../calc";
import { BarList, Columns, Donut, Empty, Panel, StatTile, type Slice } from "../charts";
import NotAMember from "../NotAMember";

export const dynamic = "force-dynamic";

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

const shortMonth = (month: string) =>
  new Date(`${month}-01T00:00:00`).toLocaleDateString("en-US", { month: "short" });

export default async function DashboardPage() {
  const member = await getMember();
  if (!member) return <NotAMember />;

  const supabase = await createServerSupabase();
  const [leadsResult, eventsResult, membersResult, invoicesResult] = await Promise.all([
    supabase.from("cc_leads").select("*"),
    supabase.from("cc_events").select("*"),
    supabase.from("cc_members").select("user_id, full_name"),
    supabase.from("cc_invoices").select("*"),
  ]);

  const leads = (leadsResult.data ?? []) as LeadRow[];
  const events = (eventsResult.data ?? []) as EventRow[];
  const invoices = (invoicesResult.data ?? []) as InvoiceRow[];
  const names = new Map(
    ((membersResult.data ?? []) as { user_id: string; full_name: string }[]).map((m) => [m.user_id, m.full_name]),
  );

  const open = leads.filter(isOpen);
  const won = leads.filter((l) => l.stage === "won");
  const lost = leads.filter((l) => l.stage === "lost" || l.stage === "declined");
  const overdue = open.filter(isLeadOverdue);
  const unassigned = open.filter(isUnassigned);
  const noNextAction = open.filter((l) => !l.next_action?.trim());

  const pipeline = pipelineValue(leads);
  const wonValue = won.reduce((sum, l) => sum + Number(l.value_estimate ?? 0), 0);
  const rate = winRate(won.length, lost.length);

  const paid = invoices.filter((i) => i.paid_at);
  const collected = paid.reduce((sum, i) => sum + Number(i.amount), 0);
  const outstanding = invoices.filter((i) => !i.paid_at);
  const outstandingTotal = outstanding.reduce((sum, i) => sum + Number(i.amount), 0);
  const late = outstanding.filter((i) => isOverdue(i.expected_at));
  const ledger = jobLedger(leads, invoices);

  const series = monthlySeries(paid.map((i) => ({ date: i.paid_at, amount: Number(i.amount) })));
  const mom = monthOverMonth(series);

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
  const byOwner = tally(open.map((l) => (l.owner_id ? (names.get(l.owner_id) ?? "Unknown") : "Unassigned")));

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
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl">Dashboard</h1>
          <p className="text-sm text-muted">Everything open, as of {formatDate(today)}</p>
        </div>
        <p className="text-xs text-muted">
          {leads.length} leads · {open.length} open · {invoices.length} invoices
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        <StatTile
          href="/portal?filter=open"
          label="Open pipeline"
          value={compactMoney(pipeline.total)}
          hint={
            pipeline.priced === open.length
              ? `${open.length} open, all priced`
              : `${pipeline.priced} of ${open.length} open priced`
          }
        />
        <StatTile
          href="/portal?filter=won"
          label="Won to date"
          value={compactMoney(wonValue)}
          hint={`${won.length} job${won.length === 1 ? "" : "s"}`}
        />
        <StatTile
          href="/portal/invoices"
          label="Collected"
          value={compactMoney(collected)}
          hint={`${paid.length} invoice${paid.length === 1 ? "" : "s"} paid`}
        />
        <StatTile
          href="/portal/invoices"
          label="Outstanding"
          value={compactMoney(outstandingTotal)}
          alert={late.length > 0}
          hint={late.length ? `${late.length} past the expected date` : outstanding.length ? "invoiced, not paid" : "all collected"}
        />
        <StatTile
          href="/portal/invoices#ledger"
          label="Still to bill"
          value={compactMoney(ledger.toBill)}
          hint={ledger.toBill ? `${ledger.rows.filter((r) => r.toBill > 0).length} won job${ledger.rows.filter((r) => r.toBill > 0).length === 1 ? "" : "s"} half-billed` : "won work fully billed"}
        />
        <StatTile
          href="/portal?filter=overdue"
          label="Overdue"
          value={overdue.length}
          alert={overdue.length > 0}
          hint={overdue.length ? "past a date we gave" : "nothing past due"}
        />
        <StatTile
          href="/portal?filter=won"
          label="Win rate"
          value={fmtPct(rate)}
          hint={won.length + lost.length === 0 ? "nothing decided yet" : `${won.length} won of ${won.length + lost.length} decided`}
        />
      </div>

      <Panel
        title="Revenue by month"
        href="/portal/invoices"
        aside={
          mom.current && mom.previous ? (
            <span className="ml-auto text-xs text-muted">
              {monthLabel(mom.current.month)} vs {monthLabel(mom.previous.month)}:{" "}
              <span className={mom.change !== null && mom.change < 0 ? "text-danger" : "text-foreground"}>
                {fmtSigned(mom.growth)}
              </span>
              {mom.change !== null && ` (${mom.change >= 0 ? "+" : "−"}${compactMoney(Math.abs(mom.change))})`}
            </span>
          ) : series.length > 0 ? (
            <span className="ml-auto text-xs text-muted">Growth needs two complete months</span>
          ) : null
        }
      >
        {series.length === 0 ? (
          <Empty>No payments received yet. Revenue appears here the month an invoice is paid.</Empty>
        ) : (
          <>
            <Columns
              points={series.map((p) => ({
                label: shortMonth(p.month),
                value: p.value,
                complete: p.complete,
                title: `${monthLabel(p.month)}${p.complete ? "" : " (to date)"}: ${money(p.value)}`,
              }))}
              format={compactMoney}
            />
            <p className="text-xs text-muted">
              Paid invoices by the month the money landed. An empty month is a real zero; the current
              month is drawn lighter and left out of the growth figure until it closes.
            </p>
          </>
        )}
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Where open leads come from" href="/portal?filter=open">
          {bySource.length ? <Donut slices={bySource} label="Open leads by source" /> : <Empty>No open leads.</Empty>}
        </Panel>

        <Panel title="Open leads by stage" href="/portal?filter=open">
          <BarList rows={byStage} emptyLabel="No open leads." />
        </Panel>

        <Panel title="Who owns what" href="/portal?filter=unassigned" hrefLabel="Unassigned">
          <BarList rows={byOwner} emptyLabel="No open leads." />
          {unassigned.length > 0 && (
            <p className="text-xs text-muted">
              {unassigned.length} of {open.length} open leads have no owner. Set one on the lead so this
              chart means something.
            </p>
          )}
        </Panel>

        <Panel title="Next seven days" href="/portal/deadlines">
          {upcoming.length === 0 ? (
            <Empty>Nothing scheduled in the next week.</Empty>
          ) : (
            <ul className="flex flex-col gap-2 text-sm">
              {upcoming.map((row, i) => (
                <li key={`${row.id}-${i}`} className="flex flex-wrap gap-x-3">
                  <span className="w-28 shrink-0 tabular-nums text-muted">{formatDate(row.date)}</span>
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

      <Panel title={`Needs attention (${attention.length})`} href="/portal?filter=overdue">
        {attention.length === 0 ? (
          <Empty>Every open lead has an owner, a next action, and no past-due dates.</Empty>
        ) : (
          <ul className="flex flex-col divide-y divide-line text-sm">
            {attention.map(({ lead, flags }) => (
              <li key={lead.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2">
                <Link href={`/portal/leads/${lead.id}`} className="w-56 shrink-0 truncate hover:text-primary">
                  {lead.company || lead.contact_name}
                </Link>
                <span className="text-danger">
                  <span aria-hidden="true">▲ </span>
                  {flags.join(" · ")}
                </span>
              </li>
            ))}
          </ul>
        )}
        {noNextAction.length > 0 && (
          <p className="text-xs text-muted">
            A lead with no next action is the one that goes quiet. Every deal lost here so far was lost
            to delay, not to price.
          </p>
        )}
      </Panel>
    </div>
  );
}
