-- ════════════════════════════════════════════════════════════════
-- Dr. Pratibha Y.C. — CMS Database Schema
-- Run this entire file once in the Supabase SQL Editor (or via the
-- Supabase CLI: `supabase db push`) on a fresh project.
-- ════════════════════════════════════════════════════════════════

-- ── Extensions ─────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ══════════════════════════════════════════════════════════════
-- ADMIN USERS
-- Maps a Supabase Auth user to "is allowed to use /admin".
-- Add the doctor's account here after creating it in
-- Authentication → Users in the Supabase dashboard.
-- ══════════════════════════════════════════════════════════════
create table if not exists admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'Admin',
  created_at timestamptz not null default now()
);

alter table admin_users enable row level security;

-- is_admin() is SECURITY DEFINER so every other table's RLS policy
-- can call it without needing its own SELECT permission on admin_users.
create or replace function is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from admin_users where id = uid);
$$;

create policy "admins can read their own row"
  on admin_users for select
  to authenticated
  using (id = auth.uid());


-- ══════════════════════════════════════════════════════════════
-- Shared helper: every "editable content" table below follows the
-- same Save Draft / Preview / Publish pattern —
--   * normal columns  = the currently PUBLISHED content
--   * draft_payload    = pending edits (jsonb, nullable)
--   * has_draft        = true when draft_payload holds unpublished changes
--   * published_at     = when the current published version went live
-- Save Draft  → write draft_payload, has_draft = true
-- Publish     → copy draft_payload fields into the real columns,
--               clear draft_payload, has_draft = false, published_at = now()
-- Discard     → draft_payload = null, has_draft = false
-- ══════════════════════════════════════════════════════════════

-- ══════════════════════════════════════════════════════════════
-- DOCTOR PROFILE (singleton — always exactly one row)
-- ══════════════════════════════════════════════════════════════
create table if not exists doctor_profile (
  id int primary key default 1 check (id = 1),
  name text not null default 'Dr. Pratibha Y.C.',
  qualification text not null default 'BAMS, MD (Kayachikitsa – Ayurvedic General Medicine)',
  short_intro text not null default '',
  about_biography text not null default '',
  experience_years text not null default '10+',
  areas_of_expertise jsonb not null default '[]'::jsonb, -- ["Psoriasis", "Piles", ...]
  languages jsonb not null default '["English", "Kannada", "Hindi"]'::jsonb,
  photo_path text, -- storage object path in the "profile" bucket, e.g. "doctor/profile-<timestamp>.webp"
  photo_url text,  -- cached public URL for convenience
  draft_payload jsonb,
  has_draft boolean not null default false,
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
insert into doctor_profile (id) values (1) on conflict (id) do nothing;
alter table doctor_profile enable row level security;

-- ══════════════════════════════════════════════════════════════
-- ABOUT PAGE (singleton)
-- ══════════════════════════════════════════════════════════════
create table if not exists about_page (
  id int primary key default 1 check (id = 1),
  heading text not null default 'About the Doctor',
  introduction text not null default '',
  biography text not null default '',
  qualifications jsonb not null default '[]'::jsonb,
  experience text not null default '',
  areas_of_expertise jsonb not null default '[]'::jsonb,
  treatment_philosophy text not null default '',
  patient_care_philosophy text not null default '',
  sections jsonb not null default '[]'::jsonb, -- [{ key, title, text, enabled, order }]
  cta_text text not null default 'Ready to begin your consultation?',
  draft_payload jsonb,
  has_draft boolean not null default false,
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
insert into about_page (id) values (1) on conflict (id) do nothing;
alter table about_page enable row level security;

-- ══════════════════════════════════════════════════════════════
-- HOMEPAGE CONTENT (singleton)
-- ══════════════════════════════════════════════════════════════
create table if not exists homepage_content (
  id int primary key default 1 check (id = 1),
  hero_heading text not null default 'Ayurveda that listens first, then treats.',
  hero_description text not null default '',
  hero_cta_primary_label text not null default 'Book Consultation',
  hero_cta_secondary_label text not null default 'Call Now',
  statistics jsonb not null default '[]'::jsonb, -- [{ label, value, enabled, order }]
  why_choose_title text not null default 'Care built around you, not a template',
  why_choose_description text not null default '',
  why_choose_cards jsonb not null default '[]'::jsonb, -- [{ icon, title, text, enabled, order }]
  featured_speciality_slugs jsonb not null default '[]'::jsonb, -- ordered array of speciality slugs
  featured_review_ids jsonb not null default '[]'::jsonb,
  featured_faq_ids jsonb not null default '[]'::jsonb,
  get_in_touch_heading text not null default 'Get in touch',
  get_in_touch_description text not null default '',
  draft_payload jsonb,
  has_draft boolean not null default false,
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
insert into homepage_content (id) values (1) on conflict (id) do nothing;
alter table homepage_content enable row level security;

-- ══════════════════════════════════════════════════════════════
-- SPECIALITIES (collection — full CRUD)
-- ══════════════════════════════════════════════════════════════
create table if not exists specialities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text not null default '',
  icon text not null default 'Leaf',              -- lucide-react icon name
  group_name text not null default 'General Wellness',
  is_featured boolean not null default false,       -- shows as a hero speciality
  hub_path text,                                    -- e.g. "/psoriasis-treatment" for hero specialities
  homepage_featured boolean not null default false,
  is_published boolean not null default false,
  display_order int not null default 0,
  overview text not null default '',
  symptoms jsonb not null default '[]'::jsonb,
  causes jsonb not null default '[]'::jsonb,
  approach text not null default '',
  lifestyle jsonb not null default '[]'::jsonb,
  diet jsonb not null default '[]'::jsonb,
  faqs jsonb not null default '[]'::jsonb,          -- [{ q, a }]
  seo_title text,
  meta_description text,
  draft_payload jsonb,
  has_draft boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
create index if not exists idx_specialities_slug on specialities(slug);
create index if not exists idx_specialities_published on specialities(is_published);
create index if not exists idx_specialities_order on specialities(display_order);
alter table specialities enable row level security;

-- ══════════════════════════════════════════════════════════════
-- REVIEWS (manually entered website reviews)
-- ══════════════════════════════════════════════════════════════
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  rating int not null check (rating between 1 and 5),
  review_text text not null,
  concern text,
  review_date date not null default current_date,
  is_published boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_reviews_published on reviews(is_published);
alter table reviews enable row level security;

-- ══════════════════════════════════════════════════════════════
-- GOOGLE REVIEWS CONFIG (singleton — display config only,
-- actual reviews are never stored here, they belong to Google)
-- ══════════════════════════════════════════════════════════════
create table if not exists google_reviews_config (
  id int primary key default 1 check (id = 1),
  enabled boolean not null default true,
  place_id text,
  business_profile_url text,
  display_rating numeric(2,1) default 4.9,
  display_review_count int default 0,
  read_reviews_url text,
  updated_at timestamptz not null default now()
);
insert into google_reviews_config (id) values (1) on conflict (id) do nothing;
alter table google_reviews_config enable row level security;

-- ══════════════════════════════════════════════════════════════
-- FAQS
-- ══════════════════════════════════════════════════════════════
create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text not null default 'General',
  is_published boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_faqs_published on faqs(is_published);
alter table faqs enable row level security;

-- ══════════════════════════════════════════════════════════════
-- CONSULTATION SETTINGS (singleton)
-- ══════════════════════════════════════════════════════════════
create table if not exists consultation_settings (
  id int primary key default 1 check (id = 1),
  clinic_enabled boolean not null default false,
  clinic_title text not null default 'Clinic Consultation',
  clinic_description text not null default '',
  clinic_address text not null default '',
  clinic_maps_url text,
  clinic_maps_embed_url text,
  clinic_timings jsonb not null default '[]'::jsonb, -- [{ day, hours }]
  clinic_fee text,
  clinic_availability text,
  online_enabled boolean not null default true,
  online_title text not null default 'Online Consultation',
  online_description text not null default '',
  online_timings jsonb not null default '[]'::jsonb,
  online_fee text,
  online_availability text,
  online_platforms jsonb not null default '[]'::jsonb, -- [{ name, description, icon, url }]
  whatsapp_message_template text not null default
    'Hello, this is Dr. Pratibha''s clinic. We received your consultation request regarding {concern}. Please let us know a convenient time to discuss your consultation.',
  draft_payload jsonb,
  has_draft boolean not null default false,
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
insert into consultation_settings (id) values (1) on conflict (id) do nothing;
alter table consultation_settings enable row level security;

-- ══════════════════════════════════════════════════════════════
-- CONTACT / GET IN TOUCH SETTINGS (singleton)
-- ══════════════════════════════════════════════════════════════
create table if not exists contact_settings (
  id int primary key default 1 check (id = 1),
  clinic_name text not null default 'Pratibha Ayurveda Clinic',
  phone text not null default '',
  phone_display text not null default '',
  whatsapp text not null default '',
  email text not null default '',
  has_offline_location boolean not null default false,
  address_line1 text default '',
  address_line2 text default '',
  address_city text default '',
  address_state text default '',
  address_pincode text default '',
  address_country text default 'IN',
  geo_lat text,
  geo_lng text,
  maps_url text,
  maps_embed_url text,
  timings jsonb not null default '[]'::jsonb,
  social jsonb not null default '{}'::jsonb, -- { instagram, facebook, youtube, linkedin }
  draft_payload jsonb,
  has_draft boolean not null default false,
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
insert into contact_settings (id) values (1) on conflict (id) do nothing;
alter table contact_settings enable row level security;

-- ══════════════════════════════════════════════════════════════
-- CONSULTATION REQUESTS — the core feature. NEVER publicly readable.
-- ══════════════════════════════════════════════════════════════
create table if not exists consultation_requests (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  phone text not null,
  email text,
  age int,
  consultation_type text not null check (consultation_type in ('clinic', 'online')),
  preferred_date date,
  preferred_time text,
  health_concern text,
  status text not null default 'new' check (status in ('new', 'contacted', 'follow_up', 'solved')),
  follow_up_note text,
  follow_up_date date,
  possible_duplicate boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_consultation_requests_phone on consultation_requests(phone);
create index if not exists idx_consultation_requests_name on consultation_requests(patient_name);
create index if not exists idx_consultation_requests_status on consultation_requests(status);
create index if not exists idx_consultation_requests_type on consultation_requests(consultation_type);
create index if not exists idx_consultation_requests_created on consultation_requests(created_at);
alter table consultation_requests enable row level security;
-- No anon policies at all: public form submissions are inserted
-- server-side using the service-role key (see app/api/consultation/route.js).
-- Only admins (via policies below) may ever read or write this table.

-- ══════════════════════════════════════════════════════════════
-- BLOG POSTS
-- ══════════════════════════════════════════════════════════════
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text not null default '',
  content text not null default '',   -- simple markdown-lite (plain text + blank-line paragraphs)
  category text not null default 'General',
  tags jsonb not null default '[]'::jsonb,
  author text not null default 'Dr. Pratibha Y.C.',
  is_published boolean not null default false,
  is_featured boolean not null default false,
  display_order int not null default 0,
  faqs jsonb not null default '[]'::jsonb,
  seo_title text,
  meta_description text,
  draft_payload jsonb,
  has_draft boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
create index if not exists idx_blog_posts_slug on blog_posts(slug);
create index if not exists idx_blog_posts_published on blog_posts(is_published);
alter table blog_posts enable row level security;

-- ══════════════════════════════════════════════════════════════
-- WEBSITE NOTICE / POPUP (singleton)
-- ══════════════════════════════════════════════════════════════
create table if not exists website_notice (
  id int primary key default 1 check (id = 1),
  enabled boolean not null default false,
  title text not null default '',
  description text not null default '',
  button_text text,
  button_url text,
  start_date date,
  end_date date,
  frequency text not null default 'once' check (frequency in ('once', 'every')),
  draft_payload jsonb,
  has_draft boolean not null default false,
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
insert into website_notice (id) values (1) on conflict (id) do nothing;
alter table website_notice enable row level security;

-- ══════════════════════════════════════════════════════════════
-- SEO SETTINGS — one row per page key ("home", "about", "services",
-- "consultation", "blog", "contact") plus site-wide defaults in "site"
-- ══════════════════════════════════════════════════════════════
create table if not exists seo_settings (
  page_key text primary key,
  title text,
  meta_description text,
  og_title text,
  og_description text,
  og_image text,
  canonical_url text,
  updated_at timestamptz not null default now()
);
insert into seo_settings (page_key) values
  ('site'), ('home'), ('about'), ('services'), ('consultation'), ('blog'), ('contact')
  on conflict (page_key) do nothing;
alter table seo_settings enable row level security;


-- ══════════════════════════════════════════════════════════════
-- RLS POLICIES
-- Content tables: anyone can read (public site rendering),
-- only admins can write. Consultation requests: admin-only, no
-- public policy at all (writes happen server-side via service role).
-- ══════════════════════════════════════════════════════════════

do $$
declare
  t text;
  content_tables text[] := array[
    'doctor_profile', 'about_page', 'homepage_content', 'specialities',
    'reviews', 'google_reviews_config', 'faqs', 'consultation_settings',
    'contact_settings', 'blog_posts', 'website_notice', 'seo_settings'
  ];
begin
  foreach t in array content_tables loop
    execute format('drop policy if exists "public can read" on %I;', t);
    execute format('create policy "public can read" on %I for select to anon, authenticated using (true);', t);

    execute format('drop policy if exists "admins can insert" on %I;', t);
    execute format('create policy "admins can insert" on %I for insert to authenticated with check (is_admin(auth.uid()));', t);

    execute format('drop policy if exists "admins can update" on %I;', t);
    execute format('create policy "admins can update" on %I for update to authenticated using (is_admin(auth.uid())) with check (is_admin(auth.uid()));', t);

    execute format('drop policy if exists "admins can delete" on %I;', t);
    execute format('create policy "admins can delete" on %I for delete to authenticated using (is_admin(auth.uid()));', t);
  end loop;
end $$;

-- Consultation requests: admin-only, full control. No public policy.
drop policy if exists "admins can read requests" on consultation_requests;
create policy "admins can read requests"
  on consultation_requests for select to authenticated
  using (is_admin(auth.uid()));

drop policy if exists "admins can update requests" on consultation_requests;
create policy "admins can update requests"
  on consultation_requests for update to authenticated
  using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

drop policy if exists "admins can delete requests" on consultation_requests;
create policy "admins can delete requests"
  on consultation_requests for delete to authenticated
  using (is_admin(auth.uid()));

-- (Intentionally no INSERT policy for consultation_requests — public
--  submissions always go through the server-side API route using the
--  service-role key, which bypasses RLS. See app/api/consultation/route.js.)


-- ══════════════════════════════════════════════════════════════
-- STORAGE — one bucket, one file: the doctor's profile photo.
-- ══════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public)
values ('profile', 'profile', true)
on conflict (id) do nothing;

drop policy if exists "public can view profile photo" on storage.objects;
create policy "public can view profile photo"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'profile');

drop policy if exists "admins can manage profile photo" on storage.objects;
create policy "admins can manage profile photo"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'profile' and is_admin(auth.uid()))
  with check (bucket_id = 'profile' and is_admin(auth.uid()));

-- ════════════════════════════════════════════════════════════════
-- Done. Next steps (see README.md → "Supabase setup"):
--  1. Create the doctor's login in Authentication → Users.
--  2. Insert her user id into admin_users:
--       insert into admin_users (id, full_name)
--       values ('<uuid-from-auth-users>', 'Dr. Pratibha Y.C.');
--  3. Copy the Project URL + anon key + service_role key into .env.local
-- ════════════════════════════════════════════════════════════════
