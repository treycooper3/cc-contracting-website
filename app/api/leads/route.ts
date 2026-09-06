import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, secretMatches } from "../../lib/supabase-admin";

/**
 * Lead intake. Replaces the Google Sheets node in the n8n workflow
 * (n8n-workflow-complete.json) and is the endpoint the inbox watcher in
 * tools/vapi_lead_notify.py will post to later.
 *
 * Auth is a shared secret in the x-cc-secret header, because the caller is a
 * machine with no user session.
 */
export async function POST(request: NextRequest) {
  if (!secretMatches(request.headers.get("x-cc-secret"), process.env.CC_LEADS_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const str = (key: string) => {
    const value = body[key];
    return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
  };

  const contactName = str("contact_name") ?? str("name");
  if (!contactName) {
    return NextResponse.json({ error: "contact_name is required" }, { status: 400 });
  }

  const source = str("source") ?? "web_form";
  const allowedSources = ["web_form", "email", "vapi", "referral", "manual"];

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("cc_leads")
    .insert({
      lead_ref: str("lead_ref") ?? str("lead_id"),
      company: str("company"),
      contact_name: contactName,
      email: str("email"),
      phone: str("phone"),
      source: allowedSources.includes(source) ? source : "web_form",
      scope: str("scope") ?? str("inquiry_type"),
      site_location: str("site_location"),
      details: str("details") ?? str("message"),
    })
    .select("id, lead_ref")
    .single();

  if (error) {
    // Duplicate lead_ref means n8n retried. Not an error worth alarming on.
    const status = error.code === "23505" ? 200 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json({ id: data.id, lead_ref: data.lead_ref }, { status: 201 });
}
