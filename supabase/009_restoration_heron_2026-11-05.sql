-- 2026-11-05: first restoration lead (Nov 2026 Palm Bay / West Melbourne flood).
-- Homeowner contact details are redacted because this repo is public; the real values
-- live only in the database. Whole house flooded. Site visit
-- Fri 11/6 12:00 PM ET with Donald + Frankie to assess and write a proposal.
-- Re-runnable.

insert into cc_leads (lead_ref, contact_name, email, phone, source, trade, scope,
                      site_location, details, stage, next_action, quote_due_at, value_estimate)
values (
  'CC-2026-RESTO-HERON',
  'Cecilia (redacted)',
  null,
  null,
  'manual',
  '{restoration}',
  'Whole-house flood restoration: dry-out, wet drywall/baseboard tear-out, rebuild',
  'Melbourne, FL 32901',
  E'Flood of 11/2. ~1,950 sq ft (public records ~1,929, 3/2, built ~1991), ALL rooms soaked. '
  'Homeowner reports ~6 in. of water in the garage, 1-2 in. inside; Donald heard 21 in. on the walls '
  '(likely the drywall wicking line). She is pulling the carpet herself (half out 11/4, rest 11/5).\n\n'
  'Paying directly (cash or Zelle to treycooper@candcontracting.com). Donald''s call: no deposit to '
  'schedule the visit. His ballpark for drying + full rebuild is ~$60,000.\n\n'
  'Equipment: our kit is 6 air movers + 2 dehumidifiers; a whole house needs ~15-20 + 3-4, so rent '
  'the gap. Drying agreement: C&C Contracting/Contracts/Restoration/water-damage-drying-agreement.pdf.\n\n'
  'PERMIT RISK: Melbourne''s permit exemption stops at $7,500, so the rebuild very likely needs a '
  'permit and a licensed contractor to pull it. Drying and tear-out are fine now. Call the Melbourne '
  'Building Section before quoting the rebuild.',
  'qualifying',
  'Site visit Fri 11/6 12:00 PM (Donald + Frankie). Measure, then a two-part proposal: '
  '(1) drying + tear-out now, (2) rebuild separately with a draw schedule once the permit path is settled.',
  '2026-11-06',
  60000
)
on conflict (lead_ref) do nothing;

insert into cc_events (lead_id, title, kind, starts_at, ends_at, location, notes)
select l.id, 'Site visit: Cecilia, flood restoration', 'site_visit',
       '2026-11-06T17:00:00Z', '2026-11-06T19:00:00Z',
       'Melbourne, FL 32901',
       'Donald + Frankie. Whole house (~1,950 sq ft) flooded, carpet already pulled. Measure wet '
       'rooms and wall wet-line height, photograph everything, price drying + tear-out and the '
       'rebuild separately. Bring the printed drying agreement. Confirmed by email 11/4.'
from cc_leads l
where l.lead_ref = 'CC-2026-RESTO-HERON'
  and not exists (select 1 from cc_events e
                  where e.lead_id = l.id and e.kind = 'site_visit' and e.starts_at = '2026-11-06T17:00:00Z');
