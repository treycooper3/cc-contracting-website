-- 2026-10-27 (later): Charles confirmed the job is the handicap railings at the
-- STEELPAN RESTAURANT, as the signed contract says. Our proposal, invoice 1067
-- and 007 all said porte-cochère; that was our error, not Sonesta's. He also
-- decided to leave the contract as signed (the AHU contract carries the same
-- language and paid 7 days early). Re-runnable.

update cc_leads set
  scope = 'Steelpan restaurant handicap railing replacement — remove rusted railings, prep, patch and core-drill anchors, new powder-coated aluminum railings',
  next_action = 'Chase the 4,250 deposit (invoice 1067, sent 10/23, expect ~11/22; Sonesta has paid '
                'mid-to-late month every time). Order the railings once it lands. Commencement 11/26, '
                'term ends 12/31. Invoice the 4,250 balance on completion. Decide whether to reissue '
                '1067 with the Steelpan description so Sonesta AP has an invoice that matches the SOW.',
  details = details || E'\n\n[10/27 pm] SCOPE CORRECTED: STEELPAN, NOT PORTE-COCHERE. Charles confirmed '
    'the contract is right and our documents were wrong. The proposal (10/19), invoice 1067 (10/23, '
    'already with Leroy) and the 10/23 award email all say porte-cochere. Price and scope of work '
    'are otherwise identical. Invoice 1067 has NOT been reissued.\n\n'
    'CONTRACT LEFT AS SIGNED, by decision. The three defects (entity "Inc.", no payment terms in '
    'the SOW, unflattened signature) are known and accepted on the strength of the AHU precedent. '
    'Next Sonesta form: run the redline BEFORE signing.'
  where lead_ref = 'CC-2026-RAILING'
    and details not like '%[10/27 pm] SCOPE CORRECTED%';

update cc_invoices set
  description = 'Steelpan handicap railing — 50% deposit',
  notes = coalesce(notes, '') || ' NOTE: the PDF Leroy received is titled "Porte-Cochere Railing"; '
          'the signed SOW says Steelpan restaurant. Not reissued as of 10/27.'
  where invoice_no = 1067
    and description = 'Porte-cochère railing — 50% deposit';
