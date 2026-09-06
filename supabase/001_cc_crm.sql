-- C&C Contracting CRM schema. Ported from TnD Mechanical's 001_tnd_crm.sql.
-- Shares the same Supabase project as TnD, FlipBids and Notary Network, so
-- everything here is cc_-prefixed and RLS-isolated. There are NO public
-- policies in this file: an anonymous client can read exactly nothing.
-- Membership is invite-only (a row in cc_members, created by an admin), so a
-- stranger signing up through Supabase auth lands with zero access.

-- ---------------------------------------------------------------------------
-- Members and roles
-- ---------------------------------------------------------------------------
create table if not exists cc_members (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  full_name  text not null,
  email      text not null,
  role       text not null default 'office'
             check (role in ('admin','ops','office')),
  created_at timestamptz not null default now()
);

-- Role lookup used by every policy below. SECURITY DEFINER so the policy on
-- cc_members does not have to be consulted to evaluate the policies that
-- depend on it, which would recurse.
create or replace function cc_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from cc_members where user_id = auth.uid();
$$;

create or replace function cc_is_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from cc_members where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- Leads / opportunities
-- ---------------------------------------------------------------------------
create table if not exists cc_leads (
  id            uuid primary key default gen_random_uuid(),

  -- Human-facing id: CC-YYYY-SLUG for hand-seeded rows, CC-YYYYMMDD-HHMMSS
  -- once the website form starts posting.
  lead_ref      text unique,

  company       text,
  contact_name  text not null,
  email         text,
  phone         text,

  source        text not null default 'web_form'
                check (source in ('web_form','email','vapi','referral','manual')),

  -- GC scopes: painting / structural / concrete / remodel / roofing / mechanical
  trade         text[] not null default '{}',
  scope         text,
  site_location text,
  details       text,

  stage         text not null default 'new'
                check (stage in ('new','qualifying','quoting','submitted','won','lost','declined')),
  owner_id      uuid references auth.users(id) on delete set null,
  next_action   text,

  -- The two dates that actually matter. quote_due_at is what we promised the
  -- customer; bid_due_at is their hard deadline. Losing either is how deals die.
  quote_due_at  date,
  bid_due_at    date,

  value_estimate numeric(12,2),
  lost_reason   text,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists cc_leads_stage_idx on cc_leads (stage, quote_due_at);
create index if not exists cc_leads_due_idx   on cc_leads (bid_due_at);

-- ---------------------------------------------------------------------------
-- Scheduling: site visits, walkthroughs, bid deadlines
-- ---------------------------------------------------------------------------
create table if not exists cc_events (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid references cc_leads(id) on delete cascade,
  title      text not null,
  kind       text not null default 'site_visit'
             check (kind in ('site_visit','walkthrough','quote_due','bid_due','call','other')),
  starts_at  timestamptz not null,
  ends_at    timestamptz,
  location   text,
  owner_id   uuid references auth.users(id) on delete set null,
  notes      text,
  created_at timestamptz not null default now()
);

create index if not exists cc_events_starts_idx on cc_events (starts_at);

-- ---------------------------------------------------------------------------
-- Documents: proposals, invoices, photos. Files live in the 'cc-documents'
-- Storage bucket; this table is the index and the link back to the opportunity.
-- ---------------------------------------------------------------------------
create table if not exists cc_documents (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid references cc_leads(id) on delete cascade,
  label       text not null,
  storage_path text not null,
  kind        text not null default 'other'
              check (kind in ('drawing','assessment','proposal','invoice','photo','other')),
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Activity trail
-- ---------------------------------------------------------------------------
create table if not exists cc_notes (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid not null references cc_leads(id) on delete cascade,
  author_id  uuid references auth.users(id) on delete set null,
  body       text not null,
  created_at timestamptz not null default now()
);

create index if not exists cc_notes_lead_idx on cc_notes (lead_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Receivables. The table TnD does not have: C&C's pain is collections. One row
-- per invoice, keyed by the real 4-digit invoice number from the book
-- (last used 1053). expected_at is stored, not computed — Sonesta's net-30 is
-- a habit, not a contract term, and the expectation must be editable.
-- ---------------------------------------------------------------------------
create table if not exists cc_invoices (
  id          uuid primary key default gen_random_uuid(),
  invoice_no  integer not null unique,
  lead_id     uuid references cc_leads(id) on delete set null,
  description text not null,
  amount      numeric(12,2) not null,
  sent_at     date,
  expected_at date,
  paid_at     date,
  method      text,
  notes       text,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- The capability matrix: what C&C does, where, and how fast, as data.
-- ---------------------------------------------------------------------------
create table if not exists cc_capabilities (
  id        uuid primary key default gen_random_uuid(),

  -- 'trade' rows answer "do we do X". 'policy' rows hold the single-value rules
  -- (service radius, turnaround days, job size band) as one row each.
  category  text not null
            check (category in ('trade','policy','service_area','vapi_permission')),
  key       text not null,
  answer    text not null
            check (answer in ('yes','no','partner_only','value')),

  -- Set when answer = 'value': "150", "5 business days", "2500".
  value     text,
  notes     text,

  confirmed_by text,
  confirmed_at date,
  updated_at   timestamptz not null default now(),

  unique (category, key)
);

-- ---------------------------------------------------------------------------
-- RLS. Everything on, no public policies, membership required.
-- ---------------------------------------------------------------------------
alter table cc_members      enable row level security;
alter table cc_leads        enable row level security;
alter table cc_events       enable row level security;
alter table cc_documents    enable row level security;
alter table cc_notes        enable row level security;
alter table cc_invoices     enable row level security;
alter table cc_capabilities enable row level security;

-- Members. The read policy is a plain self-check and deliberately does NOT call
-- cc_is_member(), because that function reads this same table. If SECURITY
-- DEFINER does not bypass RLS on this project, a function-based policy here
-- recurses and Postgres raises 42P17, which surfaces to the app as a blank
-- "no access" with no clue why. A self-read also makes cc_is_member() safe
-- when it is called from the other tables' policies: it reads one row, its own.
drop policy if exists cc_members_read_self on cc_members;
drop policy if exists cc_members_write     on cc_members;
create policy cc_members_read_self on cc_members for select
  using (user_id = auth.uid());
create policy cc_members_write on cc_members for all
  using (cc_role() = 'admin') with check (cc_role() = 'admin');

-- ponytail: all three roles read and write the operational tables, exactly as
-- on TnD — this is a family company where the office manager already sees
-- every invoice. Role only gates the capability matrix and the member roster.
do $$
declare t text;
begin
  foreach t in array array['cc_leads','cc_events','cc_documents','cc_notes','cc_invoices']
  loop
    execute format('drop policy if exists %I on %I', t || '_member_all', t);
    execute format(
      'create policy %I on %I for all using (cc_is_member()) with check (cc_is_member())',
      t || '_member_all', t);
  end loop;
end $$;

-- Capabilities: everyone reads, admin and ops write.
drop policy if exists cc_capabilities_read  on cc_capabilities;
drop policy if exists cc_capabilities_write on cc_capabilities;
create policy cc_capabilities_read on cc_capabilities for select using (cc_is_member());
create policy cc_capabilities_write on cc_capabilities for all
  using (cc_role() in ('admin','ops')) with check (cc_role() in ('admin','ops'));

-- ---------------------------------------------------------------------------
-- Storage bucket for cc_documents. Private; same membership rule.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('cc-documents', 'cc-documents', false)
on conflict (id) do nothing;

drop policy if exists cc_documents_storage on storage.objects;
create policy cc_documents_storage on storage.objects for all
  using (bucket_id = 'cc-documents' and cc_is_member())
  with check (bucket_id = 'cc-documents' and cc_is_member());
