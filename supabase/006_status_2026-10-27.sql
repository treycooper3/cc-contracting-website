-- 2026-10-27: the invoice book was already right (1054 paid 10/15, AR 0). The
-- leads were not: the only open bid had no owner, so the dashboard flagged it
-- "Unassigned" and "no owner" at once, and the AHU next action still said
-- "BLOCKED on insurance" a month after that was settled and the deposit cleared.
-- Applied through the Management API SQL endpoint. Re-runnable: every write is guarded.

-- Trey owns everything here. There is nobody else it could be.
update cc_leads
  set owner_id = 'fe1204f5-c148-41fe-b1f1-ccb740cf59b2'
  where owner_id is null
    and lead_ref in ('CC-2026-FANCOIL', 'CC-2026-STAIRS', 'CC-2026-PAINTING', 'CC-2026-BELTS');

-- Fan coils: 48 days of silence since the 9/9 send. The dashboard should say
-- what the decision is, not just that it is late.
update cc_leads set
  next_action = 'Decide: chase Leroy, or let it ride until the AHU is in and he is thinking about '
                'us anyway. Sent 9/9, no answer in 48 days, and he awarded the AHU in between, so '
                'this is not a dead relationship. If chasing, ask once for the Size 300 / Size 400 '
                'room split (Trane order H4C213AB is the shortcut). Settle contractor-of-record '
                'BEFORE he says yes: the CGC application has been on hold since 7/14.',
  details = details || E'\n\n[10/27] STATUS. Still with Leroy, unanswered since 9/9 (Gmail '
    '1a0864081918c515). Two questions remain open on our side and both block a clean yes: '
    '(1) which of the 24 rooms carry Size 300 vs Size 400 units; (2) who the contractor of '
    'record is for 135K of mechanical and electrical in an occupied hotel while the CGC is on '
    'hold. Acknowledgement #2 was worded "performed by licensed trades" on purpose. The RFQ '
    'package (RFQ/2026-09-08-sonesta-fan-coil-rfq.md) means a silent Trane rep can no longer '
    'stall this if it moves.'
  where lead_ref = 'CC-2026-FANCOIL'
    and details not like '%[10/27] STATUS%';

-- AHU: deposit is in, insurance is placed, the job is live.
update cc_leads set
  next_action = 'Release the Trane order and track the ~16-week lead against the 12/31 term end. '
                'Get Sonesta''s written consent for Trane factory techs on controls and startup '
                '(Sec.10 treats subcontracting as assignment). Invoice #1055, the 13,950 balance, '
                'goes out on completion. Sec.2(B) still lets Sonesta terminate on 30 days'' notice.',
  details = details || E'\n\n[10/27] DEPOSIT PAID, JOB LIVE. 13,950 received 10/15 by ACH (EFT '
    '451484, Yardi), seven days ahead of the 10/22 expectation and before the 10/19 '
    'commencement. Largest single C&C payment to date; collected across all invoices 37,090, '
    'AR 0. Insurance settled 9/23-24 (Hadron GL+Excess, WC via Cornerstone PEO; COIs to Leroy '
    '9/24), still 2M against the 3M asked and no E&O, cleared verbally with Leroy. Contract '
    'term 10/19 to 12/31. Balance of 13,950 due on completion; invoice #1055 not yet issued.'
  where lead_ref = 'CC-2026-AHU'
    and details not like '%[10/27] DEPOSIT PAID%';

insert into cc_events (lead_id, title, kind, starts_at, owner_id)
  select l.id, v.title, v.kind, v.starts_at::timestamptz, l.owner_id
  from (values
    ('CC-2026-AHU', 'Deposit received — 13,950 ACH, EFT 451484', 'other', '2026-10-15 09:00:00-04'),
    ('CC-2026-AHU', 'Contract term ends — balance 13,950 due on completion', 'other', '2026-12-31 09:00:00-05')
  ) as v(lead_ref, title, kind, starts_at)
  join cc_leads l on l.lead_ref = v.lead_ref
  where not exists (
    select 1 from cc_events e where e.lead_id = l.id and e.title = v.title);
