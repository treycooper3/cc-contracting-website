import { createServerSupabase, getMember } from "../../lib/supabase-server";
import type { CapabilityRow } from "../../lib/supabase";
import { upsertCapability } from "../actions";
import NotAMember from "../NotAMember";

export const dynamic = "force-dynamic";

const CATEGORIES: CapabilityRow["category"][] = [
  "service_area",
  "trade",
  "policy",
  "vapi_permission",
];

const field = "rounded border border-line bg-card px-3 py-2 text-foreground";

export default async function CapabilitiesPage() {
  const member = await getMember();
  if (!member) return <NotAMember />;

  const canEdit = member.role !== "office";
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("cc_capabilities")
    .select("*")
    .order("category")
    .order("key");

  const rows = (data ?? []) as CapabilityRow[];

  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl">Capability matrix</h1>
        <p className="text-sm text-muted">
          What C&C does, where, and how fast. This is what makes an inbound RFQ answerable
          without a phone call.
        </p>
      </header>

      {rows.length === 0 && (
        <p className="text-muted">
          Empty. Run the interview first, then fill this in. An empty matrix is the honest state
          until Donald has answered.
        </p>
      )}

      {CATEGORIES.map((category) => {
        const inCategory = rows.filter((row) => row.category === category);
        if (inCategory.length === 0) return null;

        return (
          <div key={category} className="flex flex-col gap-2">
            <h2 className="font-heading text-sm uppercase tracking-wider text-primary">
              {category.replace("_", " ")}
            </h2>
            <div className="overflow-x-auto rounded border border-line">
              <table className="w-full min-w-[40rem] text-sm">
                <thead className="bg-card text-left text-muted">
                  <tr>
                    <th className="px-3 py-2 font-medium">Item</th>
                    <th className="px-3 py-2 font-medium">Answer</th>
                    <th className="px-3 py-2 font-medium">Notes</th>
                    <th className="px-3 py-2 font-medium">Confirmed</th>
                  </tr>
                </thead>
                <tbody>
                  {inCategory.map((row) => (
                    <tr key={row.id} className="border-t border-line align-top">
                      <td className="px-3 py-2">{row.key}</td>
                      <td className="px-3 py-2 text-primary">
                        {row.answer === "value" ? row.value : row.answer.replace("_", " ")}
                      </td>
                      <td className="px-3 py-2 text-muted">{row.notes}</td>
                      <td className="px-3 py-2 text-xs text-muted">
                        {row.confirmed_by} {row.confirmed_at}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {canEdit ? (
        <form action={upsertCapability} className="flex flex-col gap-3 rounded border border-line p-4">
          <h2 className="font-heading text-sm uppercase tracking-wider text-primary">
            Add or update
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <select name="category" className={field} defaultValue="trade">
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <input name="key" placeholder="structural_steel_fabrication" required className={field} />
            <select name="answer" className={field} defaultValue="yes">
              <option value="yes">yes</option>
              <option value="no">no</option>
              <option value="partner_only">partner only</option>
              <option value="value">value (fill in below)</option>
            </select>
            <input name="value" placeholder="150 miles / 5 business days" className={field} />
            <input name="notes" placeholder="Exception rule, caveats" className={`${field} sm:col-span-2`} />
          </div>
          <button type="submit" className="w-fit rounded bg-primary px-4 py-2 font-heading text-white">
            Save
          </button>
        </form>
      ) : (
        <p className="text-sm text-muted">
          Read only for the office role. Ask Trey or Donald to change what C&C says it does.
        </p>
      )}
    </section>
  );
}
