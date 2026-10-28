/**
 * Every number the portal shows passes through here, so a tile, a chart, a
 * table and a filter can never disagree about what "open", "overdue" or "$1.00M"
 * means. Pure functions, no I/O. The runnable check at the bottom is the audit:
 *   node --experimental-strip-types app/portal/calc.ts
 */

import { isOverdue, monthOf, shiftMonth, todayISO } from "./dates.ts";

export const OPEN_STAGES = new Set(["new", "qualifying", "quoting", "submitted"]);

type LeadLike = {
  stage: string;
  quote_due_at: string | null;
  bid_due_at: string | null;
  owner_id: string | null;
  value_estimate: number | string | null;
};

export const isOpen = (lead: { stage: string }) => OPEN_STAGES.has(lead.stage);

/** A submitted bid has met its date by definition, so its quote and bid dates
 * stop being deadlines the moment it goes out. Leaving them in the overdue set
 * paints a delivered proposal red forever. */
export const isLeadOverdue = (lead: LeadLike) =>
  isOpen(lead) &&
  lead.stage !== "submitted" &&
  (isOverdue(lead.quote_due_at) || isOverdue(lead.bid_due_at));

export const isUnassigned = (lead: LeadLike) => isOpen(lead) && !lead.owner_id;

/** Only open leads, and only the ones actually carrying a number. Counting a
 * lead we have not priced as $0 would quietly understate the pipeline. */
export function pipelineValue(leads: LeadLike[]) {
  const priced = leads.filter((l) => isOpen(l) && l.value_estimate != null);
  return {
    total: priced.reduce((sum, l) => sum + Number(l.value_estimate), 0),
    priced: priced.length,
  };
}

// ---------------------------------------------------------------------------
// Ratios. Every one returns null for a zero or negative denominator, and the UI
// renders null as "N/A". Never Infinity, never NaN, never a silent 0.
// ---------------------------------------------------------------------------

export const pct = (part: number, whole: number) =>
  whole > 0 ? Math.round((part / whole) * 100) : null;

export const winRate = (won: number, lost: number) => pct(won, won + lost);

/** (current − comparison) ÷ comparison × 100, rounded. */
export const growth = (current: number, comparison: number) =>
  comparison > 0 ? Math.round(((current - comparison) / comparison) * 100) : null;

export const fmtPct = (value: number | null) => (value === null ? "N/A" : `${value}%`);

export const fmtSigned = (value: number | null) =>
  value === null ? "N/A" : `${value > 0 ? "+" : ""}${value}%`;

// ---------------------------------------------------------------------------
// Money.
// ---------------------------------------------------------------------------

export const money = (amount: number) =>
  amount.toLocaleString("en-US", { style: "currency", currency: "USD" });

/** $1,234 → "$1,234" · $135,326 → "$135K" · $999,600 → "$1.00M". The unit is
 * chosen from the ROUNDED thousands, so it can never print "$1000K"; the
 * millions figure is taken from the raw amount, so it is not rounded twice. */
export function compactMoney(amount: number) {
  const thousands = Math.round(amount / 1000);
  if (thousands >= 1000) return `$${(amount / 1e6).toFixed(2)}M`;
  if (thousands >= 1) return `$${thousands}K`;
  return `$${Math.round(amount).toLocaleString("en-US")}`;
}

// ---------------------------------------------------------------------------
// Revenue over time. Paid invoices bucketed by calendar month.
// ---------------------------------------------------------------------------

export type MonthPoint = { month: string; value: number; complete: boolean };

/** One point per month from the first paid month to the current one. A month
 * with nothing paid is an explicit zero, not a gap: every invoice is in the
 * table, so an empty month really was empty. The current month is marked
 * incomplete so growth maths can leave it out. */
export function monthlySeries(
  items: { date: string | null; amount: number }[],
  today = todayISO(),
): MonthPoint[] {
  const sums = new Map<string, number>();
  for (const item of items) {
    if (!item.date) continue;
    const month = monthOf(item.date);
    sums.set(month, (sums.get(month) ?? 0) + item.amount);
  }
  if (sums.size === 0) return [];
  const months = [...sums.keys()].sort();
  const current = monthOf(today);
  const last = months[months.length - 1] > current ? months[months.length - 1] : current;
  const out: MonthPoint[] = [];
  for (let m = months[0]; m <= last; m = shiftMonth(m, 1)) {
    out.push({ month: m, value: sums.get(m) ?? 0, complete: m < current });
  }
  return out;
}

/** Month-over-month on the last two COMPLETE months. Null pieces mean "not
 * enough history yet"; a null growth with two months means the comparison
 * month was zero, which the UI shows as N/A beside the absolute change. */
export function monthOverMonth(series: MonthPoint[]) {
  const complete = series.filter((p) => p.complete);
  const current = complete[complete.length - 1] ?? null;
  const previous = complete[complete.length - 2] ?? null;
  return {
    current,
    previous,
    growth: current && previous ? growth(current.value, previous.value) : null,
    change: current && previous ? current.value - previous.value : null,
  };
}

// ---------------------------------------------------------------------------
// Job ledger. One row per WON job: what the contract is worth, what has been
// invoiced against it, what of that is in the bank, what is out, and what has
// not been billed yet. The last column is the "next 50%" — money the job will
// owe us that no invoice has asked for. Only invoices linked to a lead count.
// ---------------------------------------------------------------------------

export type LedgerRow<L> = {
  lead: L;
  contract: number;
  invoiced: number;
  collected: number;
  outstanding: number;
  /** contract − invoiced. Negative means we have billed more than the contract. */
  toBill: number;
};

export function jobLedger<L extends { id: string; stage: string; value_estimate: number | string | null }>(
  leads: L[],
  invoices: { lead_id: string | null; amount: number | string; paid_at: string | null }[],
) {
  const sums = new Map<string, { invoiced: number; collected: number }>();
  for (const inv of invoices) {
    if (!inv.lead_id) continue;
    const s = sums.get(inv.lead_id) ?? { invoiced: 0, collected: 0 };
    s.invoiced += Number(inv.amount);
    if (inv.paid_at) s.collected += Number(inv.amount);
    sums.set(inv.lead_id, s);
  }
  const rows: LedgerRow<L>[] = leads
    .filter((l) => l.stage === "won" && l.value_estimate != null)
    .map((lead) => {
      const contract = Number(lead.value_estimate);
      const { invoiced, collected } = sums.get(lead.id) ?? { invoiced: 0, collected: 0 };
      return { lead, contract, invoiced, collected, outstanding: invoiced - collected, toBill: contract - invoiced };
    })
    .sort((a, b) => b.toBill + b.outstanding - (a.toBill + a.outstanding));
  const total = (key: "contract" | "invoiced" | "collected" | "outstanding") =>
    rows.reduce((s, r) => s + r[key], 0);
  return {
    rows,
    contract: total("contract"),
    invoiced: total("invoiced"),
    collected: total("collected"),
    outstanding: total("outstanding"),
    // Over-billed jobs do not offset under-billed ones.
    toBill: rows.reduce((s, r) => s + Math.max(r.toBill, 0), 0),
  };
}

// ---------------------------------------------------------------------------
// Receivables aging. Non-overlapping buckets on calendar days past the expected
// date. Due today is Current. No expected date is Current too: there is no date
// to be past.
// ---------------------------------------------------------------------------

export const AGING_BUCKETS = ["Current", "1–30", "31–60", "61–90", "91+"] as const;
export type AgingBucket = (typeof AGING_BUCKETS)[number];

export function daysPast(due: string | null, today = todayISO()) {
  if (!due) return 0;
  return Math.round((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${due}T00:00:00Z`)) / 864e5);
}

export function agingBucket(days: number): AgingBucket {
  if (days <= 0) return "Current";
  if (days <= 30) return "1–30";
  if (days <= 60) return "31–60";
  if (days <= 90) return "61–90";
  return "91+";
}

/** Positive balances only. Overpayments are credits, reported separately. */
export function agingTotals(
  items: { due: string | null; balance: number }[],
  today = todayISO(),
): Record<AgingBucket, number> {
  const totals = Object.fromEntries(AGING_BUCKETS.map((b) => [b, 0])) as Record<AgingBucket, number>;
  for (const item of items) {
    if (item.balance <= 0) continue;
    totals[agingBucket(daysPast(item.due, today))] += item.balance;
  }
  return totals;
}

// ---------------------------------------------------------------------------
// Runnable check. Charles's own test values are the assertions.
// ---------------------------------------------------------------------------
export function demo() {
  const assert = (ok: boolean, why: string) => {
    if (!ok) throw new Error(why);
  };

  assert(growth(100_000, 80_000) === 25, "80,000 → 100,000 is 25% growth");
  assert(growth(50, 100) === -50, "a fall is negative");
  assert(growth(10, 0) === null, "zero comparison is N/A, not Infinity");
  assert(fmtSigned(growth(100_000, 80_000)) === "+25%", "growth carries its sign");
  assert(fmtPct(null) === "N/A", "null renders as N/A");

  assert(winRate(3, 0) === 100, "3 won of 3 decided");
  assert(winRate(0, 0) === null, "nothing decided is N/A");
  // Margins come from summed amounts, never an average of row percentages:
  // 50% on 100 plus 10% on 900 is 140 on 1,000.
  assert(pct(50 + 90, 100 + 900) === 14, "weighted margin is 14%, not 30%");

  assert(compactMoney(999_600) === "$1.00M", "rounds to thousands before picking the unit");
  assert(compactMoney(1_234_567) === "$1.23M", "millions to two places");
  assert(compactMoney(135_326) === "$135K", "thousands");
  assert(compactMoney(450) === "$450", "under a thousand stays exact");
  assert(money(13950) === "$13,950.00", "invoice money keeps cents");

  const paid = [
    { date: "2026-06-26", amount: 8500 },
    { date: "2026-07-24", amount: 5000 },
    { date: "2026-08-21", amount: 9640 },
    { date: "2026-10-15", amount: 13950 },
    { date: null, amount: 999 },
  ];
  const series = monthlySeries(paid, "2026-10-27");
  assert(series.map((p) => p.month).join() === "2026-06,2026-07,2026-08,2026-09,2026-10", "every month present");
  assert(series[3].value === 0, "September is an explicit zero");
  assert(series[4].complete === false && series[3].complete === true, "current month is incomplete");
  assert(series.reduce((s, p) => s + p.value, 0) === 37090, "unpaid rows are excluded from revenue");
  const mom = monthOverMonth(series);
  assert(mom.current?.month === "2026-09" && mom.previous?.month === "2026-08", "compares the last two complete months");
  assert(mom.growth === -100 && mom.change === -9640, "Sept vs Aug: -100%, -9,640");
  assert(monthOverMonth(monthlySeries([{ date: "2026-10-01", amount: 1 }], "2026-10-27")).growth === null, "one month is not enough history");
  assert(monthlySeries([], "2026-10-27").length === 0, "no revenue, no series");

  assert(daysPast("2026-10-27", "2026-10-27") === 0 && agingBucket(0) === "Current", "due today is Current");
  assert(agingBucket(1) === "1–30" && agingBucket(30) === "1–30", "1 and 30 share a bucket");
  assert(agingBucket(31) === "31–60" && agingBucket(90) === "61–90" && agingBucket(91) === "91+", "buckets do not overlap");
  assert(daysPast("2026-09-15", "2026-10-27") === 42, "calendar days, not business days");
  const ar = [
    { due: "2026-10-20", balance: 1000 },
    { due: "2026-08-01", balance: 250 },
    { due: null, balance: 40 },
    { due: "2026-01-01", balance: -75 },
  ];
  const totals = agingTotals(ar, "2026-10-27");
  const positive = ar.filter((i) => i.balance > 0).reduce((s, i) => s + i.balance, 0);
  assert(Object.values(totals).reduce((s, v) => s + v, 0) === positive, "buckets sum to positive outstanding");
  assert(totals["1–30"] === 1000 && totals["61–90"] === 250 && totals.Current === 40, "each balance lands once");

  // The real C&C book on 2026-10-27: AHU half-billed and half-paid, railing
  // half-billed and unpaid, stairs fully billed in two halves, an open bid that
  // must not appear, and a won job with no invoices at all.
  const ledger = jobLedger(
    [
      { id: "ahu", stage: "won", value_estimate: "27900" },
      { id: "rail", stage: "won", value_estimate: 8500 },
      { id: "stairs", stage: "won", value_estimate: 17000 },
      { id: "fancoil", stage: "submitted", value_estimate: 135326 },
      { id: "fresh", stage: "won", value_estimate: 1000 },
    ],
    [
      { lead_id: "ahu", amount: "13950", paid_at: "2026-10-15" },
      { lead_id: "rail", amount: 4250, paid_at: null },
      { lead_id: "stairs", amount: 8500, paid_at: "2026-06-26" },
      { lead_id: "stairs", amount: 8500, paid_at: "2026-08-21" },
      { lead_id: null, amount: 999, paid_at: null },
    ],
  );
  assert(ledger.rows.length === 4, "won jobs only");
  const byId = Object.fromEntries(ledger.rows.map((r) => [r.lead.id, r]));
  assert(byId.ahu.toBill === 13950 && byId.ahu.outstanding === 0 && byId.ahu.collected === 13950, "AHU: next 50% unbilled");
  assert(byId.rail.toBill === 4250 && byId.rail.outstanding === 4250 && byId.rail.collected === 0, "railing: deposit out, balance unbilled");
  assert(byId.stairs.toBill === 0 && byId.stairs.outstanding === 0, "stairs: fully billed and paid");
  assert(byId.fresh.toBill === 1000 && byId.fresh.invoiced === 0, "a won job with no invoice is wholly unbilled");
  assert(ledger.toBill === 13950 + 4250 + 1000 && ledger.outstanding === 4250, "totals");
  assert(ledger.invoiced === 13950 + 4250 + 17000, "an invoice with no lead is not on the ledger");
  assert(ledger.rows[0].lead.id === "ahu", "biggest money still to come sorts first");

  const leads = [
    { stage: "quoting", quote_due_at: "2000-01-01", bid_due_at: null, owner_id: null, value_estimate: "100" },
    { stage: "submitted", quote_due_at: "2000-01-01", bid_due_at: null, owner_id: "x", value_estimate: 200 },
    { stage: "won", quote_due_at: "2000-01-01", bid_due_at: null, owner_id: "x", value_estimate: 5000 },
    { stage: "new", quote_due_at: null, bid_due_at: null, owner_id: "x", value_estimate: null },
  ];
  assert(isLeadOverdue(leads[0]) && !isLeadOverdue(leads[1]) && !isLeadOverdue(leads[2]), "only unsubmitted open leads go overdue");
  assert(isUnassigned(leads[0]) && !isUnassigned(leads[2]), "unassigned means open with no owner");
  const pipe = pipelineValue(leads);
  assert(pipe.total === 300 && pipe.priced === 2, "pipeline counts open priced leads only, strings included");
  return "ok";
}

if (process.argv[1]?.endsWith("calc.ts")) console.log("calc:", demo());
