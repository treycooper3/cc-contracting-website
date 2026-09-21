-- Guestroom fan-coil replacement, 24 rooms — Sonesta Fort Lauderdale.
-- Proposal sent to Leroy 2026-09-09 from treycooper@candcontracting.com
-- (Gmail msg 1a0864081918c515). Same re-runnable style as 002: unique
-- lead_ref, `where not exists` guards on events and notes.

insert into cc_leads
  (lead_ref, company, contact_name, email, phone, source, trade, scope,
   site_location, stage, next_action, value_estimate, details, created_at, updated_at)
values
  ('CC-2026-FANCOIL',
   'Sonesta Fort Lauderdale Beach Resort',
   'Leroy Chisholm',
   'LCHISHOLM@sonesta.com',
   null,
   'referral',
   '{mechanical,electrical}',
   'Guestroom fan-coil replacement — 24 rooms',
   '999 N. Ft. Lauderdale Beach Blvd, Fort Lauderdale, FL 33304',
   'submitted',
   'Follow up with Leroy on the $135,326 fan-coil proposal — sent Sep 9, no answer yet. '
   'Ask again for the Size 300 / Size 400 split per room.',
   135326.00,
   'Remove and replace 24 Trane horizontal recessed, left-hand-piped chilled-water '
   'fan coils, each with two (2) 5.0 kW electric heaters (10 kW per room). Existing '
   'units are two sizes, not one: Size 300 (FCEB0301KABF0A10BM4A…) and Size 400 '
   '(FCEB0401KABF0A10BZ4A…). Two units carry Trane order # H4C213AB — that order '
   'number is the fastest path to the exact original schedule and the split has been '
   'asked of both Donald and Leroy. Priced from Donald''s equipment number of $2,500/unit '
   '(equipment only, Charles: high end of the range, deliberately conservative), '
   '24 modulating + 24 isolation valves 3/4", labor at 14 man-hours/room × $121/hr '
   '(raised from $95 at Charles''s direction). 50% deposit / 50% on completion. '
   '16-week equipment lead time; phased by floor so the house stays sellable. '
   'Generator: "C&C Proposals/generate_guestroom_fancoil_proposal.py" (COST_MODEL '
   'is the single source of truth — the PDF and the internal breakdown are computed, '
   'not typed). Internal RFQ package: "C&C Contracting/RFQ/2026-09-08-sonesta-fan-coil-rfq.md".',
   '2026-09-08T12:00:00Z', '2026-09-09T13:00:00Z')
on conflict (lead_ref) do nothing;

insert into cc_events (lead_id, title, kind, starts_at, notes)
select l.id, v.title, v.kind, v.starts_at::timestamptz, v.notes
from (values
  ('CC-2026-FANCOIL', 'RFQ package sent to Donald', 'other', '2026-09-08T12:00:00Z',
   'Trane has no public pricing — quote-only through the rep channel, and the local rep '
   'had gone quiet. Package built for parallel sourcing (Trane Miami commercial office, '
   'Trane Supply, and a competing manufacturer) so one unresponsive rep cannot hold a bid.'),
  ('CC-2026-FANCOIL', 'Proposal $135,326 sent to Leroy', 'other', '2026-09-09T13:00:00Z',
   'Sent from treycooper@candcontracting.com (Gmail msg 1a0864081918c515). Material & '
   'Equipment $87,630 / Labor & Installation, 336 man-hours $40,656 / Permits, Disposal & '
   'Mobilization $7,040.')
) as v(lead_ref, title, kind, starts_at, notes)
join cc_leads l on l.lead_ref = v.lead_ref
where not exists (
  select 1 from cc_events e where e.lead_id = l.id and e.title = v.title
);

insert into cc_notes (lead_id, body)
select l.id, v.body
from (values
  ('CC-2026-FANCOIL',
   'OPEN — CONTRACTOR OF RECORD. This proposal carries a signature block and becomes a '
   'contract on acceptance; the header says "Licensed & Insured"; it is $135K of mechanical '
   'and electrical work in an occupied hotel. The CGC application has been on hold since '
   '2026-07-14 (Ron Hamilton declined to sign the experience verification). Settle who pulls '
   'the permits — TnD or another licensed mechanical contractor — BEFORE Leroy signs. '
   'Acknowledgement #2 was deliberately worded "all mechanical and electrical work is '
   'performed by licensed trades" rather than claiming C&C holds the license.'),
  ('CC-2026-FANCOIL',
   'OPEN — SIZE 300 / SIZE 400 SPLIT. 24 rooms is not 24 of one part number. Both Donald '
   'and Leroy have been asked. Fallback if nobody knows: walk the floors and read the tag on '
   'each access panel face. Pricing assumes a uniform unit cost, so a heavy skew toward the '
   'Size 400 moves the material number.')
) as v(lead_ref, body)
join cc_leads l on l.lead_ref = v.lead_ref
where not exists (
  select 1 from cc_notes n where n.lead_id = l.id and n.body = v.body
);
