import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "../../lib/supabase-admin";

/**
 * Public contact-form endpoint. Replaces the n8n cc-form webhook, whose cloud
 * instance was deleted, so every submission 404'd. Saves the lead to cc_leads
 * and pings the C&C Telegram group. Succeeds if either one lands, so a
 * Telegram outage never loses a lead and a DB outage still alerts someone.
 */
const MAX_FIELD = 4000;

async function notifyTelegram(text: string) {
  const token = process.env.CC_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.CC_ALERT_CHAT_ID;
  if (!token || !chatId) return false;
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
  });
  return response.ok;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  const str = (key: string) => {
    const value = body[key];
    return typeof value === "string" && value.trim() !== "" ? value.trim().slice(0, MAX_FIELD) : null;
  };

  // Honeypot: bots that post straight to the endpoint skip the client-side check.
  if (str("website_url")) return NextResponse.json({ ok: true });

  const name = str("name");
  const email = str("email");
  if (!name || !email || !email.includes("@")) {
    return NextResponse.json({ error: "name and email are required" }, { status: 400 });
  }
  const lead = {
    company: str("company"),
    phone: str("phone"),
    inquiryType: str("inquiry_type"),
    details: str("details"),
  };

  let saved = false;
  try {
    const { error } = await createAdminClient().from("cc_leads").insert({
      company: lead.company,
      contact_name: name,
      email,
      phone: lead.phone,
      source: "web_form",
      scope: lead.inquiryType,
      details: lead.details,
    });
    saved = !error;
    if (error) console.error("cc_leads insert failed", error.message);
  } catch (error) {
    console.error("cc_leads insert failed", error);
  }

  const text = [
    `🌐 Website form — C&C${lead.inquiryType ? ` (${lead.inquiryType})` : ""}`,
    `Name: ${name}`,
    lead.company && `Company: ${lead.company}`,
    `Email: ${email}`,
    lead.phone && `Phone: ${lead.phone}`,
    "",
    lead.details ?? "(no details)",
    "",
    saved ? "Saved to the portal." : "⚠️ NOT saved to the portal. Copy this lead down.",
  ]
    .filter((line) => line !== null)
    .join("\n");

  let alerted = false;
  try {
    alerted = await notifyTelegram(text);
  } catch (error) {
    console.error("telegram alert failed", error);
  }

  if (!saved && !alerted) {
    return NextResponse.json({ error: "could not submit" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
