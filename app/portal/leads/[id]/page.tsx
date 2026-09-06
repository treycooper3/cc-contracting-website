import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabase, getMember } from "../../../lib/supabase-server";
import { LEAD_STAGES, type DocumentRow, type EventRow, type LeadRow, type NoteRow } from "../../../lib/supabase";
import { formatDateTime } from "../../dates";
import { addEvent, addNote, completeNextAction, updateLead } from "../../actions";
import NotAMember from "../../NotAMember";
import DocumentUpload from "./DocumentUpload";

export const dynamic = "force-dynamic";

const field = "rounded border border-line bg-card px-3 py-2 text-foreground";
const label = "text-xs uppercase tracking-wider text-muted";

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const member = await getMember();
  if (!member) return <NotAMember />;

  const { id } = await params;
  const supabase = await createServerSupabase();

  const [leadResult, notesResult, eventsResult, docsResult] = await Promise.all([
    supabase.from("cc_leads").select("*").eq("id", id).maybeSingle(),
    supabase.from("cc_notes").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
    supabase.from("cc_events").select("*").eq("lead_id", id).order("starts_at", { ascending: true }),
    supabase.from("cc_documents").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
  ]);

  const lead = leadResult.data as LeadRow | null;
  if (!lead) notFound();

  const notes = (notesResult.data ?? []) as NoteRow[];
  const events = (eventsResult.data ?? []) as EventRow[];
  const documents = (docsResult.data ?? []) as DocumentRow[];

  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <Link href="/portal" className="text-sm text-muted hover:text-foreground">
          Back to pipeline
        </Link>
        <h1 className="font-heading text-2xl">{lead.company || lead.contact_name}</h1>
        <p className="text-sm text-muted">
          {lead.contact_name}
          {lead.email && ` · ${lead.email}`}
          {lead.phone && ` · ${lead.phone}`}
          {lead.lead_ref && ` · ${lead.lead_ref}`}
        </p>
      </header>

      <form action={updateLead} className="grid gap-4 sm:grid-cols-2">
        <input type="hidden" name="id" value={lead.id} />
        <input type="hidden" name="lead_id" value={lead.id} />

        <div className="flex flex-col gap-1">
          <span className={label}>Stage</span>
          <select name="stage" defaultValue={lead.stage} className={field}>
            {LEAD_STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <span className={label}>Value</span>
          <input
            name="value_estimate"
            defaultValue={lead.value_estimate ?? ""}
            placeholder="625,364.77"
            inputMode="decimal"
            className={field}
          />
          <span className="text-xs text-muted">
            What we quoted. Leave blank until there is a real number — a lead priced at zero
            understates the pipeline.
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className={label}>Next action</span>
          <div className="flex gap-2">
            <input
              name="next_action"
              defaultValue={lead.next_action ?? ""}
              className={`${field} flex-1`}
            />
            {lead.next_action?.trim() && (
              <button
                formAction={completeNextAction}
                title="Mark complete — the action moves into the activity trail below"
                className="whitespace-nowrap rounded border border-line px-3 text-sm text-muted transition-colors hover:border-primary hover:text-primary"
              >
                ✓ complete
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className={label}>Quote due</span>
          <input type="date" name="quote_due_at" defaultValue={lead.quote_due_at ?? ""} className={field} />
        </div>

        <div className="flex flex-col gap-1">
          <span className={label}>Bid due</span>
          <input type="date" name="bid_due_at" defaultValue={lead.bid_due_at ?? ""} className={field} />
        </div>

        <div className="flex flex-col gap-1">
          <span className={label}>Scope</span>
          <input name="scope" defaultValue={lead.scope ?? ""} className={field} />
        </div>

        <div className="flex flex-col gap-1">
          <span className={label}>Site location</span>
          <input name="site_location" defaultValue={lead.site_location ?? ""} className={field} />
        </div>

        <button type="submit" className="w-fit rounded bg-primary px-4 py-2 font-heading text-white">
          Save
        </button>
      </form>

      {lead.details && (
        <div className="flex flex-col gap-1">
          <span className={label}>What they sent</span>
          <p className="whitespace-pre-wrap rounded border border-line bg-card p-3 text-sm text-muted">
            {lead.details}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h2 className="font-heading text-sm uppercase tracking-wider text-primary">Schedule</h2>
        {events.length === 0 && <p className="text-sm text-muted">Nothing scheduled.</p>}
        <ul className="flex flex-col gap-1 text-sm">
          {events.map((event) => (
            <li key={event.id} className="text-muted">
              <span className="text-foreground">{formatDateTime(event.starts_at)}</span> · {event.title} (
              {event.kind})
            </li>
          ))}
        </ul>
        <form action={addEvent} className="flex flex-wrap gap-2">
          <input type="hidden" name="lead_id" value={lead.id} />
          <input name="title" placeholder="Site visit" required className={field} />
          <input type="datetime-local" name="starts_at" required className={field} />
          <select name="kind" className={field} defaultValue="site_visit">
            <option value="site_visit">site visit</option>
            <option value="walkthrough">walkthrough</option>
            <option value="quote_due">quote due</option>
            <option value="bid_due">bid due</option>
            <option value="call">call</option>
            <option value="other">other</option>
          </select>
          <button type="submit" className="rounded border border-primary px-4 py-2 text-primary">
            Add
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-heading text-sm uppercase tracking-wider text-primary">Documents</h2>
        {documents.length === 0 && <p className="text-sm text-muted">Nothing attached.</p>}
        <ul className="flex flex-col gap-1 text-sm">
          {documents.map((doc) => (
            <li key={doc.id} className="text-muted">
              {doc.label} <span className="text-xs">({doc.kind})</span>
            </li>
          ))}
        </ul>
        <DocumentUpload leadId={lead.id} />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-heading text-sm uppercase tracking-wider text-primary">Activity</h2>
        <form action={addNote} className="flex flex-col gap-2">
          <input type="hidden" name="lead_id" value={lead.id} />
          <textarea name="body" rows={3} placeholder="What happened" className={field} />
          <button type="submit" className="w-fit rounded border border-primary px-4 py-2 text-primary">
            Add note
          </button>
        </form>
        <ul className="flex flex-col gap-3 text-sm">
          {notes.map((note) => (
            <li key={note.id} className="border-l-2 border-line pl-3">
              <div className="text-xs text-muted">{formatDateTime(note.created_at)}</div>
              <p className="whitespace-pre-wrap">{note.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
