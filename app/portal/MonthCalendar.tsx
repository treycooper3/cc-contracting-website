import Link from "next/link";
import { monthGrid, monthLabel, shiftMonth, todayISO } from "./dates";

export type CalendarEntry = {
  key: string;
  date: string;
  what: string;
  leadId: string | null;
  overdue: boolean;
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Month grid of everything due, drawn from our own events and lead dates.
 *
 * Deliberately a server component with link-based navigation rather than a
 * client widget: prev/next are plain hrefs carrying ?month=, so it works with
 * no client JavaScript and each month is a real, shareable URL.
 *
 * Overdue is never signalled by colour alone. The primary ring is a hint; the
 * word "overdue" is the actual signal, so it survives greyscale printing and
 * colour-blind readers.
 */
export default function MonthCalendar({
  month,
  entries,
}: {
  month: string;
  entries: CalendarEntry[];
}) {
  const weeks = monthGrid(month);
  const today = todayISO();

  const byDate = new Map<string, CalendarEntry[]>();
  for (const entry of entries) {
    byDate.set(entry.date, [...(byDate.get(entry.date) ?? []), entry]);
  }

  return (
    <section className="flex flex-col gap-3">
      <header className="flex items-center justify-between gap-4">
        <h2 className="font-heading text-lg">{monthLabel(month)}</h2>
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href={`/portal/deadlines?month=${shiftMonth(month, -1)}`}
            className="rounded border border-line px-2 py-1 text-muted hover:border-primary hover:text-primary"
          >
            ← {monthLabel(shiftMonth(month, -1)).split(" ")[0]}
          </Link>
          <Link
            href="/portal/deadlines"
            className="rounded border border-line px-2 py-1 text-muted hover:border-primary hover:text-primary"
          >
            Today
          </Link>
          <Link
            href={`/portal/deadlines?month=${shiftMonth(month, 1)}`}
            className="rounded border border-line px-2 py-1 text-muted hover:border-primary hover:text-primary"
          >
            {monthLabel(shiftMonth(month, 1)).split(" ")[0]} →
          </Link>
        </nav>
      </header>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded border border-line bg-line">
        {DAY_NAMES.map((day) => (
          <div key={day} className="bg-card px-2 py-1 text-xs text-muted">
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day[0]}</span>
          </div>
        ))}

        {weeks.flat().map((date) => {
          const outside = date.slice(0, 7) !== month;
          const isToday = date === today;
          const dayEntries = byDate.get(date) ?? [];
          return (
            <div
              key={date}
              className={`min-h-20 bg-card p-1.5 align-top ${outside ? "opacity-40" : ""}`}
            >
              <div className="mb-1 flex items-baseline gap-1">
                <span
                  className={
                    isToday
                      ? "rounded bg-primary px-1.5 text-xs font-semibold text-white"
                      : "px-0.5 text-xs text-muted"
                  }
                >
                  {Number(date.slice(8, 10))}
                </span>
                {isToday && <span className="text-[10px] text-primary">today</span>}
              </div>

              {/* Phones: seven columns cannot hold a job name, and a truncated
                  "Bid …" tells nobody anything. Show how many things are due and
                  let the full list below carry the detail. */}
              {dayEntries.length > 0 && (
                <span className="text-[10px] text-muted sm:hidden">
                  {dayEntries.length} due
                  {dayEntries.some((e) => e.overdue) && (
                    <span className="ml-1 text-danger">· late</span>
                  )}
                </span>
              )}

              <ul className="hidden flex-col gap-1 sm:flex">
                {dayEntries.map((entry) => (
                  <li
                    key={entry.key}
                    className={`rounded border-l-2 px-1 py-0.5 text-[11px] leading-snug ${
                      entry.overdue
                        ? "border-danger bg-danger/10 text-foreground"
                        : "border-line bg-background/40 text-foreground"
                    }`}
                  >
                    {/* The word sits OUTSIDE the truncating span. Inside it, a long
                        job name clips the label away and leaves colour as the only
                        signal, which is exactly what it must never be. */}
                    {entry.overdue && (
                      <span className="block text-[9px] uppercase tracking-wide text-danger">
                        overdue
                      </span>
                    )}
                    {entry.leadId ? (
                      <Link
                        href={`/portal/leads/${entry.leadId}`}
                        className="block truncate hover:text-primary"
                        title={entry.what}
                      >
                        {entry.what}
                      </Link>
                    ) : (
                      <span className="block truncate" title={entry.what}>
                        {entry.what}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
