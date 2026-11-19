-- 2026-11-19: Apopka home renovation for Donald's friend. Essentials proposal
-- $26,000 (LVP supplied by us), accepted; 50% deposit $13,000 received by wire.
-- Owner and Donald do much of the labor. Contact details redacted (public repo).
-- No invoice row: the deposit was paid against the proposal, and the invoice
-- number must come from the book, not max+1. Re-runnable.

insert into cc_leads (lead_ref, contact_name, email, phone, source, trade, scope,
                      site_location, details, stage, next_action, value_estimate)
values (
  'CC-2026-RENO-GULFLAND',
  'Redacted',
  null,
  null,
  'referral',
  '{renovation}',
  'Home renovation: tile + bamboo out, slab prep, LVP throughout (supplied), base molding, '
  'kitchen arch removal, interior paint, small bath tub-to-shower conversion',
  'Apopka, FL',
  'Referral from Donald. Essentials proposal $26,000 (12 Nov), LVP supplied by C&C. '
  'Owner and Donald doing much of the labor. Shower conversion needs a licensed plumber + permit '
  '(confirm City of Apopka vs unincorporated Orange County).',
  'won',
  'Deposit 13,000 RECEIVED by wire (11/19). Order the LVP; book the plumber and pull the plumbing permit; '
  'confirm which work the owner is doing. Next draw 6,500 when floors are installed; final 6,500 net 30.',
  26000
)
on conflict (lead_ref) do nothing;

insert into cc_events (lead_id, title, kind, starts_at)
select l.id, v.title, 'other', v.starts_at::timestamptz
from (values
  ('Essentials proposal 26,000 sent (via Donald)', '2026-11-13 12:00:00-05'),
  ('WON. Deposit 13,000 received by wire',         '2026-11-19 12:00:00-05')
) as v(title, starts_at)
cross join cc_leads l
where l.lead_ref = 'CC-2026-RENO-GULFLAND'
  and not exists (select 1 from cc_events e where e.lead_id = l.id and e.title = v.title);

-- Deposit logged so the job ledger shows it collected. Friend job: NO formal
-- invoice was issued. 90001 is a placeholder outside the 4-digit invoice book
-- (book numbers are 10xx), so it cannot collide with a real invoice.
insert into cc_invoices (invoice_no, lead_id, description, amount, sent_at, expected_at, paid_at, method, notes)
  select 90001, l.id, 'Apopka renovation, 50% deposit (no formal invoice)', 13000.00,
         null, null, '2026-11-19', 'wire',
         'Friend job via Donald: paid against the $26,000 Essentials proposal, no invoice issued. '
         '90001 is a portal placeholder, not an invoice-book number.'
  from cc_leads l where l.lead_ref = 'CC-2026-RENO-GULFLAND'
on conflict (invoice_no) do nothing;
