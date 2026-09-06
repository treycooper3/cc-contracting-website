-- C&C Contracting operating history, backdated. Reconciled 2026-09-05 against
-- the actual invoice PDFs in "C&C Contracting/Invoices/", the AHU proposal
-- generator in "C&C Proposals/", docs/finance/revenue-log.md, and Charles's
-- payment confirmation (Sonesta paid 06/26 $8,500 · 07/24 $5,000 · 08/21
-- $9,640 — AR is $0).
--
-- Seeded by hand rather than scripted out of the PDFs: there are four jobs,
-- they are already written up, and a hand-checked insert is more trustworthy
-- than a one-off extraction tool nobody runs twice.
-- Re-runnable: lead_ref and invoice_no are unique and every insert is
-- on conflict do nothing.

insert into cc_leads
  (lead_ref, company, contact_name, email, phone, source, trade, scope,
   site_location, stage, next_action, value_estimate, details, created_at, updated_at)
values
  ('CC-2026-STAIRS',
   'Sonesta Fort Lauderdale Beach Resort',
   'Leroy Chisholm',
   'LCHISHOLM@sonesta.com',
   null,
   'referral',
   '{structural,fabrication}',
   'Stair extensions, handrails & stairwell',
   '999 N. Ft. Lauderdale Beach Blvd, Fort Lauderdale, FL 33304',
   'won',
   null,
   17000.00,
   'The first C&C contract. Two stair extensions on the existing staircase with '
   'handrails for the stairwell to the elevator mechanical room; 1/4" aluminum '
   'plate, 1-1/4" aluminum pipe handrail both sides; stairwell system connecting '
   'the housekeeping office to the second-floor roof; roof railing brought up to '
   'code. Invoice #1021 (06/02) for the job, 50/50 terms. Deposit $8,500 paid '
   '06/26 (ACH via Yardi, cdr@yardi.com) — C&C''s first revenue dollar. Final '
   '$8,500 invoiced as #1051 on 07/22, paid 08/21.',
   '2026-06-02T12:00:00Z', '2026-08-21T12:00:00Z'),

  ('CC-2026-PAINTING',
   'Sonesta Fort Lauderdale Beach Resort',
   'Leroy Chisholm',
   'LCHISHOLM@sonesta.com',
   null,
   'referral',
   '{painting}',
   'Roof safety painting',
   '999 N. Ft. Lauderdale Beach Blvd, Fort Lauderdale, FL 33304',
   'won',
   null,
   5000.00,
   'Solvent clean, 6-foot-from-roof-edge safety line taping, non-slip traction '
   'paint, two coats of yellow safety paint around the full roof perimeter. '
   'Estimate #995 came through Beverley''s email 06/27. Invoiced as #1043 '
   '(06/27, 50/50 terms); deposit was never collected, so reinvoiced as #1047 '
   '(07/17) for the full $5,000. Paid 07/24.',
   '2026-06-27T12:00:00Z', '2026-07-24T12:00:00Z'),

  ('CC-2026-BELTS',
   'Sonesta Fort Lauderdale Beach Resort',
   'Leroy Chisholm',
   'LCHISHOLM@sonesta.com',
   null,
   'referral',
   '{mechanical}',
   'Cooling tower drive belt replacement',
   '999 N. Ft. Lauderdale Beach Blvd, Fort Lauderdale, FL 33304',
   'won',
   null,
   1140.00,
   'Supply and install four drive belts on top of the cooling tower. Labor 4hr '
   '@ $185 = $740 + belts 4 @ $100 = $400. Invoice #1053 (07/22, Attn: Leroy '
   'Chisholm — note #1052 was skipped in the numbering). Paid 08/21 together '
   'with #1051.',
   '2026-07-22T12:00:00Z', '2026-08-21T12:00:00Z'),

  ('CC-2026-AHU',
   'Sonesta Fort Lauderdale Beach Resort',
   'Leroy Chisholm',
   'LCHISHOLM@sonesta.com',
   null,
   'referral',
   '{mechanical}',
   'Executive Office chilled-water AHU replacement + Trane controls',
   '999 N. Ft. Lauderdale Beach Blvd, Fort Lauderdale, FL 33304',
   'submitted',
   'Follow up with Leroy on the $27,900 AHU proposal — sent Aug 27, no answer yet.',
   27900.00,
   'Leroy forwarded RCAC Mechanical''s competing Estimate #1255 ($29,300) from '
   'his personal address on 08/27; our proposal went out the same day at '
   '$27,900 — $1,400 under. Work spans multiple consecutive days; the Executive '
   'Office will be out of service. Generator: '
   '"C&C Proposals/generate_ahu_replacement_proposal.py".',
   '2026-08-27T12:00:00Z', '2026-08-27T12:00:00Z')
on conflict (lead_ref) do nothing;

-- ---------------------------------------------------------------------------
-- The invoice book. Every row verified against the PDF of the same number.
-- #1043 is superseded by #1047 (deposit never collected), so it carries no
-- amount of its own here — the $5,000 lives on #1047 to keep the collected
-- total honest.
-- ---------------------------------------------------------------------------
insert into cc_invoices
  (invoice_no, lead_id, description, amount, sent_at, expected_at, paid_at, method, notes)
select v.invoice_no, l.id, v.description, v.amount, v.sent_at::date,
       v.expected_at::date, v.paid_at::date, v.method, v.notes
from (values
  (1021, 'CC-2026-STAIRS',
   'Stair extensions — 50% deposit', 8500.00,
   '2026-06-02', '2026-07-02', '2026-06-26', 'ACH (Yardi)',
   'First C&C revenue. $17,000 job, 50/50 terms.'),
  (1047, 'CC-2026-PAINTING',
   'Roof safety painting — full balance', 5000.00,
   '2026-07-17', '2026-08-16', '2026-07-24', 'ACH (Yardi)',
   'Replaces #1043 (06/27), whose 50% deposit was never collected.'),
  (1051, 'CC-2026-STAIRS',
   'Stair extensions — final payment', 8500.00,
   '2026-07-22', '2026-08-21', '2026-08-21', 'ACH (Yardi)',
   'Paid together with #1053 in the 08/21 $9,640 payment.'),
  (1053, 'CC-2026-BELTS',
   'Cooling tower drive belt replacement', 1140.00,
   '2026-07-22', '2026-08-21', '2026-08-21', 'ACH (Yardi)',
   '#1052 was skipped in the numbering. Paid with #1051 on 08/21.')
) as v(invoice_no, lead_ref, description, amount, sent_at, expected_at, paid_at, method, notes)
join cc_leads l on l.lead_ref = v.lead_ref
on conflict (invoice_no) do nothing;

-- ---------------------------------------------------------------------------
-- Backdated milestones, so the calendar and activity trail tell the real
-- story. Guarded by `where not exists` — cc_events has no natural unique key.
-- ---------------------------------------------------------------------------
insert into cc_events (lead_id, title, kind, starts_at, notes)
select l.id, v.title, v.kind, v.starts_at::timestamptz, v.notes
from (values
  ('CC-2026-STAIRS',   'Invoice #1021 sent — stair extensions',      'other', '2026-06-02T12:00:00Z', null),
  ('CC-2026-STAIRS',   'Deposit $8,500 received — first C&C revenue','other', '2026-06-26T12:00:00Z', 'ACH via Yardi AP.'),
  ('CC-2026-PAINTING', 'Invoice #1047 sent — painting full balance', 'other', '2026-07-17T12:00:00Z', null),
  ('CC-2026-PAINTING', 'Payment $5,000 received',                    'other', '2026-07-24T12:00:00Z', null),
  ('CC-2026-STAIRS',   'Invoice #1051 sent — final payment',         'other', '2026-07-22T12:00:00Z', null),
  ('CC-2026-BELTS',    'Invoice #1053 sent — drive belts',           'other', '2026-07-22T12:00:00Z', null),
  ('CC-2026-STAIRS',   'Payment $9,640 received — closes #1051 + #1053', 'other', '2026-08-21T12:00:00Z', null),
  ('CC-2026-AHU',      'AHU proposal $27,900 sent to Leroy',         'other', '2026-08-27T12:00:00Z',
   'Against RCAC Mechanical''s $29,300 Estimate #1255.')
) as v(lead_ref, title, kind, starts_at, notes)
join cc_leads l on l.lead_ref = v.lead_ref
where not exists (
  select 1 from cc_events e where e.lead_id = l.id and e.title = v.title
);

-- ---------------------------------------------------------------------------
-- Standing context worth keeping in the record, not in someone's head.
-- Guarded like the events. author_id stays null — these are system notes.
-- ---------------------------------------------------------------------------
insert into cc_notes (lead_id, body)
select l.id, v.body
from (values
  ('CC-2026-STAIRS',
   'C&C REVENUE IS NOT C&C CASH. The $8,500 (6/26) and $5,000 (7/24) went '
   'straight back out as materials and labor; the 8/21 $9,640 is likewise mostly '
   'committed to job costs. These are near-breakeven jobs. Do not count receipts '
   'toward escape velocity without netting job costs first.'),
  ('CC-2026-AHU',
   'Process reminders: billing comms run through Beverley''s approval loop '
   '(bchisholm.bc@gmail.com — WITH the h). Leroy''s job emails can land in the '
   'personal Gmail, not the C&C inbox. Competitor estimates arrive from his '
   'personal chizz10.lc@gmail.com.')
) as v(lead_ref, body)
join cc_leads l on l.lead_ref = v.lead_ref
where not exists (
  select 1 from cc_notes n where n.lead_id = l.id and n.body = v.body
);

-- ---------------------------------------------------------------------------
-- Capabilities: what the site already asserts, plus the honest licensing gap.
-- ---------------------------------------------------------------------------
insert into cc_capabilities (category, key, answer, value, notes, confirmed_by, confirmed_at)
values
  ('service_area', 'based_in',            'value', 'Melbourne, FL',        'Statewide positioning — we travel.', 'Trey', '2026-09-05'),
  ('service_area', 'service_radius',      'value', 'All of Florida',       'Sonesta work is in Fort Lauderdale.', 'Trey', '2026-09-05'),
  ('trade',        'painting',            'yes',   null, 'Roof safety painting delivered (Sonesta, Jul 2026).', 'Trey', '2026-09-05'),
  ('trade',        'metal_fabrication',   'yes',   null, 'Aluminum stair extensions + handrails delivered (Sonesta, Jun 2026).', 'Trey', '2026-09-05'),
  ('trade',        'mechanical_support',  'yes',   null, 'Drive belts, AHU bid. Heavy mechanical partners with TnD.', 'Trey', '2026-09-05'),
  ('trade',        'residential_remodel', 'yes',   null, 'Kitchen/bath remodels per the website.', 'Trey', '2026-09-05'),
  ('trade',        'commercial_buildout', 'yes',   null, null, 'Trey', '2026-09-05'),
  ('policy',       'payment_terms',       'value', '50% deposit / 50% on completion', 'Sonesta pays net-30 by habit.', 'Trey', '2026-09-05'),
  ('policy',       'gc_license',          'value', 'CGC pending',          'Three exams passed; application checklist in gc_license_progress. Site renders license # once issued.', 'Trey', '2026-09-05'),
  ('policy',       'insurance',           'value', '$1M liability / $2M umbrella', 'As stated on every proposal.', 'Trey', '2026-09-05')
on conflict (category, key) do nothing;
