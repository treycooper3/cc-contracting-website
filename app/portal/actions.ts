"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase, getMember } from "../lib/supabase-server";

/**
 * Server actions for the portal. Every one re-checks membership: RLS would
 * reject the write anyway, but failing here gives a usable message instead of
 * a silent no-op.
 */

async function requireMember() {
  const member = await getMember();
  if (!member) throw new Error("Not a C&C member.");
  return member;
}

// People type money as money: "8,500.00", "$8,500.00", "8500". Strip the
// formatting instead of rejecting it. A CRM that argues with a dollar sign is
// one people stop updating, and then the pipeline number is a lie.
// Only a genuinely blank box clears the value. Something like a stray "$"
// strips down to nothing too, and treating that as "clear it" would silently
// wipe the number the totals are built from. Typos get an error, not an erasure.
function parseMoney(typed: string) {
  const trimmed = typed.trim();
  if (trimmed === "") return null;
  const raw = trimmed.replace(/[$,\s]/g, "");
  const amount = Number(raw);
  if (raw === "" || !Number.isFinite(amount) || amount < 0) {
    throw new Error(`"${trimmed}" is not an amount we can read.`);
  }
  return amount;
}

export async function updateLead(formData: FormData) {
  await requireMember();
  const id = String(formData.get("id"));
  const supabase = await createServerSupabase();

  const text = (field: string) => {
    const value = String(formData.get(field) ?? "").trim();
    return value === "" ? null : value;
  };

  const money = (field: string) => parseMoney(String(formData.get(field) ?? ""));

  const { error } = await supabase
    .from("cc_leads")
    .update({
      stage: String(formData.get("stage")),
      value_estimate: money("value_estimate"),
      next_action: text("next_action"),
      quote_due_at: text("quote_due_at"),
      bid_due_at: text("bid_due_at"),
      scope: text("scope"),
      site_location: text("site_location"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath(`/portal/leads/${id}`);
  revalidatePath("/portal");
  revalidatePath("/portal/deadlines");
}

export async function addNote(formData: FormData) {
  const member = await requireMember();
  const leadId = String(formData.get("lead_id"));
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("cc_notes")
    .insert({ lead_id: leadId, body, author_id: member.user_id });

  if (error) throw new Error(error.message);
  revalidatePath(`/portal/leads/${leadId}`);
}

export async function addEvent(formData: FormData) {
  const member = await requireMember();
  const leadId = String(formData.get("lead_id"));
  const title = String(formData.get("title") ?? "").trim();
  const startsAt = String(formData.get("starts_at") ?? "").trim();
  if (!title || !startsAt) return;

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("cc_events").insert({
    lead_id: leadId,
    title,
    kind: String(formData.get("kind") || "site_visit"),
    starts_at: new Date(startsAt).toISOString(),
    owner_id: member.user_id,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/portal/leads/${leadId}`);
  revalidatePath("/portal/deadlines");
}

/**
 * One click on "complete": clears the lead's next action and drops what it
 * said into the activity trail, so "what did we do" survives the clearing.
 */
export async function completeNextAction(formData: FormData) {
  const member = await requireMember();
  const leadId = String(formData.get("lead_id"));
  const supabase = await createServerSupabase();

  const { data: lead, error: readError } = await supabase
    .from("cc_leads")
    .select("next_action")
    .eq("id", leadId)
    .maybeSingle();
  if (readError) throw new Error(readError.message);
  if (!lead?.next_action?.trim()) return;

  const { error: noteError } = await supabase.from("cc_notes").insert({
    lead_id: leadId,
    body: `✓ Completed: ${lead.next_action}`,
    author_id: member.user_id,
  });
  if (noteError) throw new Error(noteError.message);

  const { error } = await supabase
    .from("cc_leads")
    .update({ next_action: null, updated_at: new Date().toISOString() })
    .eq("id", leadId);
  if (error) throw new Error(error.message);

  revalidatePath("/portal");
  revalidatePath("/portal/dashboard");
  revalidatePath(`/portal/leads/${leadId}`);
}

export async function upsertInvoice(formData: FormData) {
  await requireMember();
  const supabase = await createServerSupabase();

  const text = (field: string) => {
    const value = String(formData.get(field) ?? "").trim();
    return value === "" ? null : value;
  };

  const invoiceNo = Number(String(formData.get("invoice_no") ?? "").trim());
  if (!Number.isInteger(invoiceNo) || invoiceNo <= 0) {
    throw new Error("Invoice # must be a whole number.");
  }
  const amount = parseMoney(String(formData.get("amount") ?? ""));
  if (amount === null) throw new Error("Amount is required.");

  const { error } = await supabase.from("cc_invoices").upsert(
    {
      invoice_no: invoiceNo,
      lead_id: text("lead_id"),
      description: text("description") ?? `Invoice ${invoiceNo}`,
      amount,
      sent_at: text("sent_at"),
      expected_at: text("expected_at"),
      paid_at: text("paid_at"),
      method: text("method"),
      notes: text("notes"),
    },
    { onConflict: "invoice_no" },
  );

  if (error) throw new Error(error.message);
  revalidatePath("/portal/invoices");
}

export async function upsertCapability(formData: FormData) {
  const member = await requireMember();
  if (member.role === "office") throw new Error("Only admin and ops can change capabilities.");

  const supabase = await createServerSupabase();
  const value = String(formData.get("value") ?? "").trim();

  const { error } = await supabase.from("cc_capabilities").upsert(
    {
      category: String(formData.get("category")),
      key: String(formData.get("key")).trim(),
      answer: String(formData.get("answer")),
      value: value === "" ? null : value,
      notes: String(formData.get("notes") ?? "").trim() || null,
      confirmed_by: member.full_name,
      confirmed_at: new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "category,key" },
  );

  if (error) throw new Error(error.message);
  revalidatePath("/portal/capabilities");
}
