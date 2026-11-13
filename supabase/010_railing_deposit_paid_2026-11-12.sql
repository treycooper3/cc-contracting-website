-- 2026-11-12: Sonesta paid railing deposit invoice 1067 ($4,250) by ACH,
-- EFT 455427 (Yardi remittance, 11/12 22:35). Ten days ahead of the ~11/22
-- expectation. Balance 4,250 is invoiced on completion. Re-runnable.

update cc_invoices set
  paid_at = '2026-11-12',
  method  = 'ACH',
  notes   = coalesce(notes, '') || ' PAID 11/12 by ACH, EFT 455427 (Sonesta AP remittance via Yardi).'
  where invoice_no = 1067
    and paid_at is null;

update cc_leads set
  next_action = 'Deposit PAID 11/12 (invoice 1067, ACH EFT 455427). Order the railings now. '
                'Commencement 11/26, term ends 12/31. Invoice the 4,250 balance on completion.'
  where lead_ref = 'CC-2026-RAILING'
    and next_action not like 'Deposit PAID 11/12%';

insert into cc_events (lead_id, title, kind, starts_at, owner_id)
  select l.id, 'Deposit 4,250 received (invoice 1067, ACH EFT 455427)', 'other',
         '2026-11-12 22:35:00-05'::timestamptz, l.owner_id
  from cc_leads l
  where l.lead_ref = 'CC-2026-RAILING'
    and not exists (select 1 from cc_events e where e.lead_id = l.id
                    and e.title = 'Deposit 4,250 received (invoice 1067, ACH EFT 455427)');
