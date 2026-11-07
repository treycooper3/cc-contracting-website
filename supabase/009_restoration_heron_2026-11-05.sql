-- 2026-11-05: first restoration lead (Nov 2026 Palm Bay / West Melbourne flood).
-- Homeowner contact details are redacted because this repo is public; the real values
-- live only in the database. Whole house flooded. Site visit
-- Fri 11/6 12:00 PM ET with Donald + Frankie to assess and write a proposal.
-- Re-runnable.

insert into cc_leads (lead_ref, contact_name, email, phone, source, trade, scope,
                      site_location, details, stage, next_action, quote_due_at, value_estimate)
values (
  'CC-2026-RESTO-HERON',
  'Redacted',
  null,
  null,
  'manual',
  '{restoration}',
  'Whole-house flood restoration: dry-out, wet drywall/baseboard tear-out, rebuild',
  'Melbourne, FL',
  'Details redacted (public repo). See the lead record in the database.',
  'qualifying',
  'Site visit Fri 11/6 12:00 PM (Donald + Frankie). Measure, then a two-part proposal: '
  '(1) drying + tear-out now, (2) rebuild separately with a draw schedule once the permit path is settled.',
  '2026-11-06',
  60000
)
on conflict (lead_ref) do nothing;

insert into cc_events (lead_id, title, kind, starts_at, ends_at, location, notes)
select l.id, 'Site visit: CC-2026-RESTO-HERON', 'site_visit',
       '2026-11-06T17:00:00Z', '2026-11-06T19:00:00Z',
       'Melbourne, FL',
       'Measure wet rooms and wet-line height, photograph everything, price drying and rebuild separately.'
from cc_leads l
where l.lead_ref = 'CC-2026-RESTO-HERON'
  and not exists (select 1 from cc_events e
                  where e.lead_id = l.id and e.kind = 'site_visit' and e.starts_at = '2026-11-06T17:00:00Z');
