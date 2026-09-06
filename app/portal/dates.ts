/** Date helpers shared by the pipeline and deadlines screens. */

export const todayISO = () => new Date().toISOString().slice(0, 10);

/** A date-only string that has already passed. Today is not overdue. */
export const isOverdue = (date: string | null) => !!date && date < todayISO();

export const formatDate = (date: string | null) =>
  date
    ? new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

export const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const pad = (n: number) => String(n).padStart(2, "0");

/** A Date to "YYYY-MM-DD" using its LOCAL parts. toISOString() would convert to
 * UTC first, which in US timezones pulls the date back a day after 7pm. */
export const toISO = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** "YYYY-MM" for the month a date falls in. */
export const monthOf = (iso: string) => iso.slice(0, 7);

export const monthLabel = (month: string) =>
  new Date(`${month}-01T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

/** The month before or after `month`, as "YYYY-MM". Day 1 avoids the classic
 * "Jan 31 minus a month" trap. */
export const shiftMonth = (month: string, by: number) => {
  const [year, m] = month.split("-").map(Number);
  return monthOf(toISO(new Date(year, m - 1 + by, 1)));
};

/** Weeks (Sunday-Saturday) covering `month`, as ISO date strings. Pads with
 * days from the neighbouring months so every row has seven cells. */
export function monthGrid(month: string): string[][] {
  const [year, m] = month.split("-").map(Number);
  const lead = new Date(year, m - 1, 1).getDay();     // 0 = Sunday
  const days = new Date(year, m, 0).getDate();        // day 0 of next month
  const cells = Math.ceil((lead + days) / 7) * 7;
  const weeks: string[][] = [];
  for (let i = 0; i < cells; i += 7) {
    weeks.push(
      Array.from({ length: 7 }, (_, d) => toISO(new Date(year, m - 1, 1 - lead + i + d))),
    );
  }
  return weeks;
}

/** Runnable check: node --experimental-strip-types app/portal/dates.ts */
export function demo() {
  const assert = (ok: boolean, why: string) => {
    if (!ok) throw new Error(why);
  };
  assert(isOverdue("2000-01-01"), "a past date is overdue");
  assert(!isOverdue(todayISO()), "today is not overdue");
  assert(!isOverdue(null), "a missing date is not overdue");
  assert(formatDate(null) === "", "no date formats to empty");
  assert(formatDate("2026-09-07").includes("Sep"), "formats month short");
  // Guards against UTC parsing pulling the day backwards in US timezones.
  assert(formatDate("2026-09-07").includes("7"), "keeps the calendar day");

  // toISO must use local parts. Late-evening dates are where UTC drift shows up.
  assert(toISO(new Date(2026, 8, 7, 23, 30)) === "2026-09-07", "toISO stays local");
  assert(toISO(new Date(2026, 0, 1)) === "2026-01-01", "pads month and day");

  assert(shiftMonth("2026-01", -1) === "2025-12", "steps back across a year");
  assert(shiftMonth("2026-12", 1) === "2027-01", "steps forward across a year");
  // Month arithmetic done on day 31 overflows into the following month.
  assert(shiftMonth("2026-03", -1) === "2026-02", "no Jan-31-minus-a-month trap");

  const sept = monthGrid("2026-09");
  assert(sept.every((week) => week.length === 7), "every row has seven days");
  assert(sept.flat().every((d, i, all) => i === 0 || d > all[i - 1]), "strictly ascending");
  assert(new Date(`${sept[0][0]}T00:00:00`).getDay() === 0, "grid starts on a Sunday");
  assert(sept[0].includes("2026-09-01"), "the 1st is in the first week");
  // Sept 2026 has 30 days and starts on a Tuesday, so it needs five rows.
  assert(sept.flat().filter((d) => d.startsWith("2026-09")).length === 30, "all 30 days once");
  assert(sept.length === 5, "September 2026 fits in five weeks");

  // February is where off-by-one day maths goes to die.
  assert(monthGrid("2026-02").flat().filter((d) => d.startsWith("2026-02")).length === 28,
    "2026 is not a leap year");
  assert(monthGrid("2028-02").flat().filter((d) => d.startsWith("2028-02")).length === 29,
    "2028 is a leap year");
  return "ok";
}

if (process.argv[1]?.endsWith("dates.ts")) console.log("dates:", demo());
