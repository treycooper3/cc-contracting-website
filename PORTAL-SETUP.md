# C&C portal — setup status

Run `python3 check_setup.py` to verify. Manual setup has no build to fail, so
that script is the build.

**Where you already are** (set up 2026-09-06, all applied via the Supabase
Management API — nothing left to paste into the SQL editor):

- Migration `001_cc_crm.sql` applied: all seven tables (`cc_members`, `cc_leads`,
  `cc_events`, `cc_documents`, `cc_notes`, `cc_invoices`, `cc_capabilities`),
  RLS live, `cc-documents` bucket created.
- `002_seed_history.sql` applied: the four Sonesta jobs, the invoice book
  (1021 / 1047 / 1051 / 1053, all paid — AR $0), backdated events, capability
  matrix. AHU bid ($27,900) sits in `submitted`.
- `003_members.sql` applied. Auth users exist and are confirmed:

  | Person | Email | Role |
  |---|---|---|
  | Trey | `treycooper@candcontracting.com` | admin |
  | Trey | `treycooper333@gmail.com` | admin |
  | Beverley | `bchisholm.bc@gmail.com` (WITH the h) | office |
  | Donald | `biggerdon.dc@gmail.com` | ops |

- Auth redirect allowlist includes `https://www.candcontracting.com/auth/callback`
  and `http://localhost:3001/auth/**` (TnD owns `:3000`).
- `.env.local` filled in: shared Supabase project + fresh `CC_LEADS_WEBHOOK_SECRET`
  and `CC_CALENDAR_TOKEN`.

Supabase project: `rrhpsjxbpsvmritkjgdj` (shared with TnD, FlipBids, Notary
Network). Sign-in is magic-link, invite-only (`shouldCreateUser: false`) — an
email not in the member list simply never receives a link.

## Test locally

```bash
cd "C&C Contracting/C&C Website"
npm run dev -- -p 3001        # 3001: localhost cookies ignore ports, and TnD uses 3000
```

Open `http://localhost:3001/portal`, sign in with one of the member emails, and
walk the five screens:

- **Dashboard** — 4 leads, 1 open ($27,900 AHU, submitted, not overdue), win
  rate 100% (3 won, 0 lost).
- **Pipeline** — AHU under `submitted`; the three won jobs below.
- **Deadlines** — the backdated milestones on the month calendar (June–Aug).
- **Invoices** — Outstanding $0, Collected $23,140, next invoice # 1054.
- **Capabilities** — 10 seeded rows.

## Going live (NOT done yet — deliberately)

1. **Vercel env vars** (Production/Preview/Development): the five from
   `.env.local`. `NEXT_PUBLIC_` values bake in at build time — redeploy after
   adding.
2. **n8n**: the website form currently posts the browser straight to the n8n
   webhook (`FORM_WEBHOOK_URL` in `app/lib/site.ts`). Point the n8n workflow's
   output at `POST https://www.candcontracting.com/api/leads` with header
   `x-cc-secret: <CC_LEADS_WEBHOOK_SECRET>` so form leads land in `cc_leads`.
3. **Calendar feed**: subscribe Google Calendar to
   `https://www.candcontracting.com/api/calendar?token=<CC_CALENDAR_TOKEN>`.
   Anyone holding the URL can read the schedule; rotate the token to revoke.

**Then stop writing SQL.** Stage, value, dates, notes, events, documents,
invoices, capabilities — all editable in the browser. Only schema changes and
bulk backfills belong in a migration file.

## If something breaks

Same failure table as TnD's PORTAL-SETUP.md — magic link never arrives = no
auth user; "not a member" = no `cc_members` row; link bounces = redirect
allowlist; empty dashboard = seeds or membership.
