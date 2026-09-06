import Link from "next/link";
import { createServerSupabase, getMember } from "../../lib/supabase-server";
import type { InvoiceRow, LeadRow } from "../../lib/supabase";
import { formatDate, isOverdue } from "../dates";
import { StatTile } from "../charts";
import { upsertInvoice } from "../actions";
import NotAMember from "../NotAMember";

export const dynamic = "force-dynamic";

const field = "rounded border border-line bg-card px-3 py-2 text-foreground";
const label = "text-xs uppercase tracking-wider text-muted";

const money = (amount: number) =>
  amount.toLocaleString("en-US", { style: "currency", currency: "USD" });

/**
 * Receivables. The one screen TnD does not have: C&C's pain is collections,
 * not lead flow — Sonesta pays on a net-30 habit, and the only question that
 * matters here is "what is out, and is it past the date we expected it".
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
  const leads = (leadsResult.data ?? []) as Pick<
    LeadRow,
    "id" | "company" | "contact_name" | "scope" | "stage" | "value_estimate"
  >[];
  const leadName = new Map(leads.map((l) => [l.id, l.scope || l.company || l.contact_name]));

  const outstanding = invoices.filter((inv) => !inv.paid_at);
  const outstandingTotal = outstanding.reduce((sum, inv) => sum + Number(inv.amount), 0);
  const late = outstanding.filter((inv) => isOverdue(inv.expected_at));
  const collectedTotal = invoices
    .filter((inv) => inv.paid_at)
    .reduce((sum, inv) => sum + Number(inv.amount), 0);

  // Everything on the board: cash collected + invoices out + open bids still
  // waiting on a yes. The "if it all lands" number.
  const OPEN_STAGES = new Set(["new", "qualifying", "quoting", "submitted"]);
  const expectedContracts = leads
    .filter((lead) => OPEN_STAGES.has(lead.stage))
    .reduce((sum, lead) => sum + Number(lead.value_estimate ?? 0), 0);
  const allUp = collectedTotal + outstandingTotal + expectedContracts;

  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-wrap items-baseline gap-3">
        <h1 className="font-heading text-2xl">Invoices</h1>
        <p className="text-sm text-muted">
          {outstanding.length} outstanding of {invoices.length}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          href="/portal"
          label="All up"
          value={money(allUp)}
          hint="collected + outstanding + open bids"
        />
        <StatTile
          label="Outstanding"
          value={money(outstandingTotal)}
          alert={late.length > 0}
          hint={
            late.length
              ? `${late.length} past the expected date`
              : outstanding.length
                ? "nothing past due"
                : "all collected"
          }
        />
        <StatTile label="Collected" value={money(collectedTotal)} hint="all time" />
        <StatTile
          href="#add"
          label="Next invoice #"
          value={invoices.length ? Math.max(...invoices.map((i) => i.invoice_no)) + 1 : 1054}
          hint="keep the book sequential"
        />
      </div>

      {invoices.length === 0 && (
        <p className="text-muted">No invoices yet. Add the first one below.</p>
      )}

      {invoices.length > 0 && (
        <div className="overflow-x-auto rounded border border-line">
          <table className="w-full min-w-[46rem] text-sm">
            <thead className="bg-card text-left text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">#</th>
                <th className="px-3 py-2 font-medium">Job</th>
                <th className="px-3 py-2 font-medium">Amount</th>
                <th className="px-3 py-2 font-medium">Sent</th>
                <th className="px-3 py-2 font-medium">Expected</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const lateRow = !inv.paid_at && isOverdue(inv.expected_at);
                return (
                  <tr key={inv.id} className="border-t border-line align-top">
                    <td className="px-3 py-2 tabular-nums">{inv.invoice_no}</td>
                    <td className="px-3 py-2">
                      {inv.lead_id ? (
                        <Link
                          href={`/portal/leads/${inv.lead_id}`}
                          className="hover:text-primary"
                        >
                          {inv.description}
                        </Link>
                      ) : (
                        inv.description
                      )}
                      {inv.lead_id && leadName.get(inv.lead_id) && (
                        <div className="text-xs text-muted">{leadName.get(inv.lead_id)}</div>
                      )}
                    </td>
                    <td className="px-3 py-2 tabular-nums">{money(Number(inv.amount))}</td>
                    <td className="px-3 py-2 text-muted">{formatDate(inv.sent_at)}</td>
                    <td className={`px-3 py-2 ${lateRow ? "text-danger" : "text-muted"}`}>
                      {formatDate(inv.expected_at)}
                    </td>
                    <td className="px-3 py-2">
                      {inv.paid_at ? (
                        <span className="text-muted">
                          paid {formatDate(inv.paid_at)}
                          {inv.method && ` · ${inv.method}`}
                        </span>
                      ) : lateRow ? (
                        <span className="text-danger">late — follow up</span>
                      ) : (
                        <span>outstanding</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <form id="add" action={upsertInvoice} className="flex flex-col gap-3 rounded border border-line p-4">
        <h2 className="font-heading text-sm uppercase tracking-wider text-primary">
          Add or update
        </h2>
        <p className="text-xs text-muted">
          Same invoice # updates the existing row — that is how you mark one paid.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <span className={label}>Invoice #</span>
            <input name="invoice_no" inputMode="numeric" required className={field} />
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
        <button type="submit" className="w-fit rounded bg-primary px-4 py-2 font-heading text-white">
          Save
        </button>
      </form>
    </section>
  );
}
