-- Portal membership. Run AFTER creating the auth users in the Supabase
-- dashboard (Authentication → Users → Add user, Auto Confirm ticked) — the
-- join below only picks up emails that already exist in auth.users, so a row
-- missing from the confirmation select means the auth user was not created.
--
-- ⚠️ Beverley's address is bchisholm.bc@gmail.com — WITH the h. The no-h
-- variant went to a stranger once and is blocklisted.

insert into cc_members (user_id, full_name, email, role)
select u.id, v.full_name, u.email, v.role
from (values
  ('treycooper@candcontracting.com', 'Trey Cooper',      'admin'),
  ('treycooper333@gmail.com',        'Trey Cooper',      'admin'),
  ('bchisholm.bc@gmail.com',         'Beverley Chisholm','office'),
  ('biggerdon.dc@gmail.com',         'Donald Chisholm',  'ops')
) as v(email, full_name, role)
join auth.users u on lower(u.email) = lower(v.email)
on conflict (user_id) do update
  set role = excluded.role, full_name = excluded.full_name;

-- Confirm. Anyone missing here means the auth user was not created.
select full_name, email, role from cc_members order by role, email;
