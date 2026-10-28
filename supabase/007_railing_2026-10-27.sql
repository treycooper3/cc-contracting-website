-- 2026-10-27: the porte-cochère railing job. Proposal 10/19 (emailed 10/20),
-- awarded by Leroy, deposit invoice 1067 sent 10/23, Sonesta's service
-- contract received 10/27 and signed + returned the same afternoon (Gmail
-- 1a17f13fd77d4cda; Leroy acked 1a17f572df243cb2). None of it was in the CRM.
-- Re-runnable: every write is guarded.

insert into cc_leads
  (lead_ref, company, contact_name, email, phone, source, trade, scope,
   site_location, stage, owner_id, next_action, value_estimate, details)
values
  ('CC-2026-RAILING',
   'Sonesta Fort Lauderdale Beach Resort',
   'Leroy Chisholm',
   'LCHISHOLM@sonesta.com',
   '954-801-3826',
   'referral',
   '{general}',
   'Porte-cochère railing replacement — remove rusted railing, prep, patch and core-drill anchors, new powder-coated aluminum railing',
   '999 N Fort Lauderdale Beach Blvd, Fort Lauderdale, FL 33304',
   'won',
   'fe1204f5-c148-41fe-b1f1-ccb740cf59b2',
   'Chase the 4,250 deposit (invoice 1067, sent 10/23, expect ~11/22; Sonesta has paid mid-to-late '
   'month every time). Order the railing once it lands. Commencement 11/26, term ends 12/31. '
   'Invoice the 4,250 balance on completion. THREE DEFECTS in the contract we signed 10/27 — '
   'decide whether to send Leroy a one-line correction: (1) it names "C&C Contracting Inc.", '
   'which does not exist; (2) the SOW carries the fee but no payment terms, so Sec.3(B)+Sec.13 '
   'make the deposit contractually net-30 monthly in arrears; (3) the SOW says "handicap railings '
   'at the Steelpan restaurant" while our proposal and invoice say porte-cochère. Signature is an '
   'unflattened FreeText annotation.',
   8500,
   E'Third Sonesta job of 2026 and the second under a formal service contract. Fourth piece of '
   'work off the Leroy relationship.\n\n'
   '[10/19] Proposal built at 8,500 (C&C Proposals/generate_portecochere_railing_proposal.py; '
   'TOTAL is asserted against the printed deposit/balance). Sent to Beverley for review 10/19, '
   'to Leroy 10/20 (Gmail 1a159bd48d1d1fc6). 50% deposit at signing, 50% on completion. '
   'Excludes concrete spalling repair, structural assessment, concrete replacement beyond '
   'patching, engineering / impact-rated certification, relocation of landscaping, lighting '
   'or signage.\n\n'
   '[10/23] AWARDED. Deposit invoice 1067 (4,250) emailed to Leroy with the thanks (Gmail '
   '1a16b113fe0a7630), flagging up front that a rusted oceanfront railing often means rust in '
   'the embedded anchors: if we pull posts and find spalling we stop and price it before any '
   'of that work proceeds. COIs from September are on file with Sonesta.\n\n'
   '[10/27] Sonesta service contract received 11:30 AM (Contracts/Sonesta-Railing-Service-'
   'Contract-AS-RECEIVED-2026-10-27.pdf): fee 8,500, term 11/26/2026 to 12/31/2026, same form '
   'as the AHU contract. redline_sonesta_railing_contract.py was written for it and NOT run. '
   'Charles signed the as-received form and returned it 4:36 PM; Leroy replied "Thanks" 9:49 PM. '
   'The signed copy therefore carries the same three defects the AHU redline fixed in September '
   '(entity "Inc.", bare notice address, no payment terms in the SOW) plus a scope mismatch '
   '(Steelpan handicap railings vs porte-cochère). Sec.9(F) still withholds all payment until '
   'insurance evidence is on file; Sec.2(B) still allows termination on 30 days notice.')
on conflict (lead_ref) do nothing;

insert into cc_invoices (invoice_no, lead_id, description, amount, sent_at, expected_at, paid_at, method, notes)
  select 1067, l.id, 'Porte-cochère railing — 50% deposit', 4250.00, '2026-10-23', '2026-11-22', null, null,
         'Sent with the award thanks, Gmail 1a16b113fe0a7630. Expected = net-30; Sonesta has run '
         '7 days early on the last one. Balance 4,250 due on completion, not yet invoiced.'
  from cc_leads l where l.lead_ref = 'CC-2026-RAILING'
on conflict (invoice_no) do nothing;

insert into cc_events (lead_id, title, kind, starts_at, owner_id)
  select l.id, v.title, v.kind, v.starts_at::timestamptz, l.owner_id
  from (values
    ('Railing proposal 8,500 sent to Leroy',                       'other', '2026-10-20 10:35:00-04'),
    ('Awarded — deposit invoice 1067 (4,250) sent',                'other', '2026-10-23 16:20:00-04'),
    ('Service contract received, signed and returned',             'other', '2026-10-27 16:36:00-04'),
    ('Railing contract commencement date',                         'other', '2026-11-26 09:00:00-05'),
    ('Railing contract term ends — balance 4,250 due on completion','other', '2026-12-31 09:00:00-05')
  ) as v(title, kind, starts_at)
  cross join cc_leads l
  where l.lead_ref = 'CC-2026-RAILING'
    and not exists (select 1 from cc_events e where e.lead_id = l.id and e.title = v.title);
