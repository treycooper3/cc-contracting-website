import Link from "next/link";
import { createServerSupabase, getMember } from "../../lib/supabase-server";
import type { InvoiceRow, LeadRow } from "../../lib/supabase";
import { formatDate, isOverdue } from "../dates";
import { AGING_BUCKETS, agingTotals, daysPast, isOpen, jobLedger, money } from "../calc";
import { BarList, cell, head, Empty, Panel, StatTile, Table } from "../charts";
import { upsertInvoice } from "../actions";
import NotAMember from "../NotAMember";

export const dynamic = "force-dynamic";

/** What the "next #" tile says before the first row exists. The book is
 * sequential after that: max + 1. */
const FIRST_INVOICE_NO = 1054;

// w-full + min-w-0: an <input> has an intrinsic width and will not shrink to
// its grid cell on its own, which pushed the whole page sideways on a phone.
const field = "w-full min-w-0 rounded border border-line bg-card px-3 py-2 text-foreground";
const label = "text-xs uppercase tracking-wider text-muted";

/**
 * Receivables. The screen for the only question that matters once a job is
 * won: what is out, and is it past the date we expected it. Aging runs off the
 * EXPECTED date — there is no contractual due date on these invoices, the
 * expected date is the net-30 habit the business actually chases against.
 */
export default async function InvoicesPage() {
  const member = await getMember();
  if (!member) return <NotAMember />;

  const supabase = await createServerSupabase();
  const [invoicesResult, leadsResult] = await Promise.all([
    supabase.from("cc_invoices").select("*").order("invoice_no", { ascending: false }),
    supabase.from("cc_leads").select("id, company, contact_name, scope, stage, value_estimate"),
  ]);

  const invoices = (invoicesResult.data ?? []) as InvoiceRow[];
  const leads = (leadsResult.data ?? []) as Pick<LeadRow, "id" | "company" | "contact_name" | "scope" | "stage" | "value_estimate">[];
  const leadName = new Map(leads.map((l) => [l.id, l.scope || l.company || l.contact_name]));

  const outstanding = invoices.filter((inv) => !inv.paid_at);
  const outstandingTotal = outstanding.reduce((sum, inv) => sum + Number(inv.amount), 0);
  const late = outstanding.filter((inv) => isOverdue(inv.expected_at));
  const collectedTotal = invoices.filter((inv) => inv.paid_at).reduce((sum, inv) => sum + Number(inv.amount), 0);

  // Everything on the board: cash collected + invoices out + the half of each
  // won job nobody has billed yet + open bids still waiting on a yes. The "if
  // it all lands" number. Leaving the unbilled balances out understated this
  // by the AHU's second $13,950 for a month.
  const ledger = jobLedger(leads, invoices);
  const openBids = leads.filter(isOpen).reduce((sum, lead) => sum + Number(lead.value_estimate ?? 0), 0);
  const allUp = collectedTotal + outstandingTotal + ledger.toBill + openBids;

  const aging = agingTotals(outstanding.map((inv) => ({ due: inv.expected_at, balance: Number(inv.amount) })));
  const agingRows = AGING_BUCKETS.map((bucket) => ({ label: bucket, value: aging[bucket] }));
  const nextNo = invoices.length ? Math.max(...invoices.map((i) => i.invoice_no)) + 1 : FIRST_INVOICE_NO;

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl">Invoices</h1>
          <p className="text-sm text-muted">
            {outstanding.length} outstanding of {invoices.length}
          </p>
        </div>
        <a href="#add" className="text-xs text-primary hover:underline">
          Add or update →
        </a>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatTile href="/portal?filter=open" label="All up" value={money(allUp)} hint="collected + out + to bill + open bids" />
        <StatTile label="Collected" value={money(collectedTotal)} hint="all time" />
        <StatTile
          label="Outstanding"
          value={money(outstandingTotal)}
          alert={late.length > 0}
          hint={late.length ? `${late.length} past the expected date` : outstanding.length ? "invoiced, not yet paid" : "all collected"}
        />
        <StatTile
          href="#ledger"
          label="Still to bill"
          value={money(ledger.toBill)}
          hint={ledger.toBill ? "won work with no invoice yet" : "every won job fully billed"}
        />
        <StatTile href="#add" label="Next invoice #" value={nextNo} hint="keep the book sequential" />
      </div>

      <Panel
        title="Job ledger"
        aside={<span className="ml-auto text-xs text-muted">won jobs · contract → invoiced → paid</span>}
      >
        {ledger.rows.length === 0 ? (
          <Empty>No won jobs yet.</Empty>
        ) : (
          <div id="ledger" className="overflow-x-auto">
            <table className="w-full min-w-[46rem] text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className={`${head} min-w-[14rem]`}>Job</th>
                  <th className={`${head} text-right`}>Contract</th>
                  <th className={`${head} text-right`}>Invoiced</th>
                  <th className={`${head} text-right`}>Collected</th>
                  <th className={`${head} text-right`}>Outstanding</th>
                  <th className={`${head} text-right`}>Still to bill</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {ledger.rows.map((row) => (
                  <tr key={row.lead.id}>
                    <td className={cell}>
                      {/* The scope's first clause is the job's name; the rest is the spec. */}
                      <Link href={`/portal/leads/${row.lead.id}`} className="hover:text-primary">
                        {(row.lead.scope || row.lead.company || row.lead.contact_name).split(" — ")[0]}
                      </Link>
                    </td>
                    <td className={`${cell} text-right tabular-nums text-muted`}>{money(row.contract)}</td>
                    <td className={`${cell} text-right tabular-nums text-muted`}>{money(row.invoiced)}</td>
                    <td className={`${cell} text-right tabular-nums`}>{money(row.collected)}</td>
                    <td className={`${cell} text-right tabular-nums ${row.outstanding > 0 ? "text-foreground" : "text-muted"}`}>
                      {money(row.outstanding)}
                    </td>
                    <td className={`${cell} text-right tabular-nums ${row.toBill > 0 ? "text-foreground" : row.toBill < 0 ? "text-danger" : "text-muted"}`}>
                      {money(row.toBill)}
                      {row.toBill < 0 && " over"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-line font-medium">
                  <td className={cell}>Total</td>
                  <td className={`${cell} text-right tabular-nums`}>{money(ledger.contract)}</td>
                  <td className={`${cell} text-right tabular-nums`}>{money(ledger.invoiced)}</td>
                  <td className={`${cell} text-right tabular-nums`}>{money(ledger.collected)}</td>
                  <td className={`${cell} text-right tabular-nums`}>{money(ledger.outstanding)}</td>
                  <td className={`${cell} text-right tabular-nums`}>{money(ledger.toBill)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
        <p className="text-xs text-muted">
          Contract is the won value on the lead. An invoice counts against a job only when it is linked to
          that lead, so link every invoice.
        </p>
      </Panel>

      <Panel title="Receivables aging" aside={<span className="ml-auto text-xs text-muted">days past the expected date</span>}>
        {outstandingTotal === 0 ? (
          <Empty>Nothing outstanding. Every invoice on the book has been paid.</Empty>
        ) : (
          <BarList rows={agingRows} format={money} />
        )}
      </Panel>

      {invoices.length === 0 ? (
        <Empty>No invoices yet. Add the first one below.</Empty>
      ) : (
        <Table minWidth="48rem">
          <thead>
            <tr className="border-b border-line">
              <th className={head}>#</th>
              <th className={head}>Job</th>
              <th className={`${head} text-right`}>Amount</th>
              <th className={head}>Sent</th>
              <th className={head}>Expected</th>
              <th className={head}>Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {invoices.map((inv) => {
              const lateRow = !inv.paid_at && isOverdue(inv.expected_at);
              const days = daysPast(inv.expected_at);
              return (
                <tr key={inv.id} className="align-top">
                  <td className={`${cell} tabular-nums text-muted`}>{inv.invoice_no}</td>
                  <td className={cell}>
                    {inv.lead_id ? (
                      <Link href={`/portal/leads/${inv.lead_id}`} className="hover:text-primary">
                        {inv.description}
                      </Link>
                    ) : (
                      inv.description
                    )}
                    {inv.lead_id && leadName.get(inv.lead_id) && (
                      <div className="text-xs text-muted">{leadName.get(inv.lead_id)}</div>
                    )}
                  </td>
                  <td className={`${cell} text-right tabular-nums`}>{money(Number(inv.amount))}</td>
                  <td className={`${cell} whitespace-nowrap tabular-nums text-muted`}>{formatDate(inv.sent_at)}</td>
                  <td className={`${cell} whitespace-nowrap tabular-nums ${lateRow ? "text-danger" : "text-muted"}`}>
                    {formatDate(inv.expected_at)}
                  </td>
                  <td className={cell}>
                    {inv.paid_at ? (
                      <span className="text-muted">
                        paid {formatDate(inv.paid_at)}
                        {inv.method && ` · ${inv.method}`}
                      </span>
                    ) : lateRow ? (
                      <span className="text-danger">
                        <span aria-hidden="true">▲ </span>
                        {days} day{days === 1 ? "" : "s"} late — follow up
                      </span>
                    ) : (
                      <span>outstanding</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      <form id="add" action={upsertInvoice} className="flex flex-col gap-3 rounded-lg border border-line p-4">
        <h2 className="font-heading text-sm uppercase tracking-[0.12em] text-foreground">Add or update</h2>
        <p className="text-xs text-muted">Same invoice # updates the existing row — that is how you mark one paid.</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <span className={label}>Invoice #</span>
            <input name="invoice_no" inputMode="numeric" required defaultValue={nextNo} className={field} />
          </div>
          <div className="flex flex-col gap-1">
            <span className={label}>Amount</span>
            <input name="amount" placeholder="8,500.00" inputMode="decimal" required className={field} />
          </div>
          <div className="flex flex-col gap-1">
            <span className={label}>Job / description</span>
            <input name="description" className={field} />
          </div>
          <div className="flex flex-col gap-1">
            <span className={label}>Sent</span>
            <input type="date" name="sent_at" className={field} />
          </div>
          <div className="flex flex-col gap-1">
            <span className={label}>Expected (net-30 by habit)</span>
            <input type="date" name="expected_at" className={field} />
          </div>
          <div className="flex flex-col gap-1">
            <span className={label}>Paid</span>
            <input type="date" name="paid_at" className={field} />
          </div>
          <div className="flex flex-col gap-1">
            <span className={label}>Method</span>
            <input name="method" placeholder="ACH (Yardi)" className={field} />
          </div>
          <div className="flex flex-col gap-1 sm:col-span-2">
            <span className={label}>Link to lead (optional)</span>
            <select name="lead_id" className={field} defaultValue="">
              <option value="">— none —</option>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.scope || lead.company || lead.contact_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className="w-fit rounded bg-primary px-4 py-2 font-heading text-on-primary">
          Save
        </button>
      </form>
    </section>
  );
}
