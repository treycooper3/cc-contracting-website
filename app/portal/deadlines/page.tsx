import Link from "next/link";
import { createServerSupabase, getMember } from "../../lib/supabase-server";
import type { EventRow, LeadRow } from "../../lib/supabase";
import { formatDate, formatDateTime, isOverdue, monthOf, todayISO } from "../dates";
import MonthCalendar from "../MonthCalendar";
import NotAMember from "../NotAMember";

export const dynamic = "force-dynamic";

type Entry = {
  key: string;
  date: string;
  display: string;
  what: string;
  leadId: string | null;
  overdue: boolean;
};

/** ?month=YYYY-MM, or the current month. Anything malformed falls back rather
 * than rendering a grid for the year 0 — the value comes from a URL. */
function resolveMonth(raw: string | string[] | undefined) {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value && /^\d{4}-(0[1-9]|1[0-2])$/.test(value) ? value : monthOf(todayISO());
}

export default async function DeadlinesPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string | string[] }>;
}) {
  const member = await getMember();
  if (!member) return <NotAMember />;
  const month = resolveMonth((await searchParams).month);

  const supabase = await createServerSupabase();
  const [leadsResult, eventsResult] = await Promise.all([
    supabase.from("cc_leads").select("*").not("stage", "in", "(won,lost,declined)"),
    supabase.from("cc_events").select("*").order("starts_at", { ascending: true }),
  ]);

  const leads = (leadsResult.data ?? []) as LeadRow[];
  const events = (eventsResult.data ?? []) as EventRow[];
  const nameOf = (lead: LeadRow) => lead.company || lead.contact_name;

  const entries: Entry[] = [
    ...leads.flatMap((lead) => {
      const rows: Entry[] = [];
      if (lead.quote_due_at)
        rows.push({
          key: `${lead.id}-quote`,
          date: lead.quote_due_at,
          display: formatDate(lead.quote_due_at),
          what: `Quote due — ${nameOf(lead)}`,
          leadId: lead.id,
          overdue: isOverdue(lead.quote_due_at),
        });
      if (lead.bid_due_at)
        rows.push({
          key: `${lead.id}-bid`,
          date: lead.bid_due_at,
          display: formatDate(lead.bid_due_at),
          what: `Bid due — ${nameOf(lead)}`,
          leadId: lead.id,
          overdue: isOverdue(lead.bid_due_at),
        });
      return rows;
    }),
    ...events.map((event) => ({
      key: event.id,
      date: event.starts_at.slice(0, 10),
      display: formatDateTime(event.starts_at),
      what: event.title,
      leadId: event.lead_id,
      // Only a DUE kind can be overdue. C&C's calendar carries backdated
      // milestones (invoices sent, payments received) — a thing that happened
      // is history, not a missed deadline.
      overdue:
        (event.kind === "quote_due" || event.kind === "bid_due") &&
        isOverdue(event.starts_at.slice(0, 10)),
    })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl">Deadlines</h1>
        <p className="text-sm text-muted">
          Quote dates, bid dates and site visits. Subscribe in Google Calendar with the feed URL in
          the portal env (/api/calendar?token=…) to get these on your phone.
        </p>
      </header>

      <MonthCalendar month={month} entries={entries} />

      <h2 className="font-heading text-lg">Everything, in order</h2>
      {entries.length === 0 && <p className="text-muted">Nothing on the calendar.</p>}

      <ul className="flex flex-col divide-y divide-line">
        {entries.map((entry) => (
          <li key={entry.key} className="flex flex-wrap gap-x-4 py-2 text-sm">
            <span className={`w-44 ${entry.overdue ? "text-danger" : "text-muted"}`}>
              {entry.display}
              {entry.overdue && " · overdue"}
            </span>
            {entry.leadId ? (
              <Link href={`/portal/leads/${entry.leadId}`} className="hover:text-primary">
                {entry.what}
              </Link>
            ) : (
              <span>{entry.what}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
