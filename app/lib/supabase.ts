import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client for the C&C portal.
 *
 * Only the anon key is ever used here. Every cc_ table is behind RLS with no
 * public policy, so this key can reach exactly what the signed-in member's role
 * allows and nothing otherwise. There is deliberately no service-role key in
 * this file. The one place a service-role key is used is the n8n lead webhook
 * (app/api/leads/route.ts), which runs server-side only.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase environment variables are not configured.");
  return createBrowserClient(url, key);
}

export const isSupabaseConfigured = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export type MemberRole = "admin" | "ops" | "office";

export type LeadStage =
  | "new"
  | "qualifying"
  | "quoting"
  | "submitted"
  | "won"
  | "lost"
  | "declined";

export const LEAD_STAGES: LeadStage[] = [
  "new",
  "qualifying",
  "quoting",
  "submitted",
  "won",
  "lost",
  "declined",
];

export type LeadRow = {
  id: string;
  lead_ref: string | null;
  company: string | null;
  contact_name: string;
  email: string | null;
  phone: string | null;
  source: "web_form" | "email" | "vapi" | "referral" | "manual";
  trade: string[];
  scope: string | null;
  site_location: string | null;
  details: string | null;
  stage: LeadStage;
  owner_id: string | null;
  next_action: string | null;
  quote_due_at: string | null;
  bid_due_at: string | null;
  value_estimate: number | null;
  lost_reason: string | null;
  created_at: string;
  updated_at: string;
};

export type EventRow = {
  id: string;
  lead_id: string | null;
  title: string;
  kind: "site_visit" | "walkthrough" | "quote_due" | "bid_due" | "call" | "other";
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  owner_id: string | null;
  notes: string | null;
};

export type DocumentRow = {
  id: string;
  lead_id: string | null;
  label: string;
  storage_path: string;
  kind: "drawing" | "assessment" | "proposal" | "invoice" | "photo" | "other";
  created_at: string;
};

export type NoteRow = {
  id: string;
  lead_id: string;
  author_id: string | null;
  body: string;
  created_at: string;
};

export type InvoiceRow = {
  id: string;
  invoice_no: number;
  lead_id: string | null;
  description: string;
  amount: number;
  sent_at: string | null;
  expected_at: string | null;
  paid_at: string | null;
  method: string | null;
  notes: string | null;
};

export type CapabilityRow = {
  id: string;
  category: "trade" | "policy" | "service_area" | "vapi_permission";
  key: string;
  answer: "yes" | "no" | "partner_only" | "value";
  value: string | null;
  notes: string | null;
  confirmed_by: string | null;
  confirmed_at: string | null;
};
