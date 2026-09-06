import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, secretMatches } from "../../lib/supabase-admin";

export const dynamic = "force-dynamic";

/**
 * Read-only .ics feed of every quote date, bid date and site visit, so the
 * deadlines land in the calendar app Donald and Beverley already use instead of
 * a dashboard they have to remember to open.
 *
 * ponytail: one shared token for the whole team, passed as ?token=. Google
 * Calendar cannot send headers on a subscription URL. Anyone holding the URL
 * can read the deadlines, so rotate CC_CALENDAR_TOKEN to revoke. Move to
 * per-user tokens if that ever stops being acceptable.
 */
const escape = (text: string) => text.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");

const stampDate = (date: string) => date.slice(0, 10).replace(/-/g, "");
const stampDateTime = (value: string) =>
  `${new Date(value).toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;

export async function GET(request: NextRequest) {
  if (!secretMatches(request.nextUrl.searchParams.get("token"), process.env.CC_CALENDAR_TOKEN)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const [leadsResult, eventsResult] = await Promise.all([
    supabase
      .from("cc_leads")
      .select("id, company, contact_name, quote_due_at, bid_due_at, stage")
      .not("stage", "in", "(won,lost,declined)"),
    supabase.from("cc_events").select("id, title, starts_at, ends_at, location, notes"),
  ]);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//C&C Contracting//Portal//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:C&C Deadlines",
  ];

  for (const lead of leadsResult.data ?? []) {
    const who = lead.company || lead.contact_name;
    const dates: [string, string | null][] = [
      ["Quote due", lead.quote_due_at],
      ["Bid due", lead.bid_due_at],
    ];
    for (const [what, date] of dates) {
      if (!date) continue;
      lines.push(
        "BEGIN:VEVENT",
        `UID:${lead.id}-${what.split(" ")[0].toLowerCase()}@candcontracting.com`,
        `DTSTAMP:${stampDateTime(new Date().toISOString())}`,
        `DTSTART;VALUE=DATE:${stampDate(date)}`,
        `SUMMARY:${escape(`${what} - ${who}`)}`,
        "END:VEVENT",
      );
    }
  }

  for (const event of eventsResult.data ?? []) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.id}@candcontracting.com`,
      `DTSTAMP:${stampDateTime(new Date().toISOString())}`,
      `DTSTART:${stampDateTime(event.starts_at)}`,
      `DTEND:${stampDateTime(event.ends_at ?? event.starts_at)}`,
      `SUMMARY:${escape(event.title)}`,
    );
    if (event.location) lines.push(`LOCATION:${escape(event.location)}`);
    if (event.notes) lines.push(`DESCRIPTION:${escape(event.notes)}`);
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");

  return new NextResponse(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
