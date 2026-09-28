# Dr. Pratibha Y.C. — Website + Admin CMS

Next.js (App Router) + Supabase + Vercel. The public site design is unchanged; all content is now
editable from `/admin`, and consultation requests are stored in Supabase (not email).

## One-time setup (≈15 minutes)

1. **Supabase project** → create one project (free tier is fine).
2. **SQL Editor** → run, in order:
   1. `supabase/migrations/0001_init.sql` (tables, RLS, storage bucket)
   2. `supabase/seed.sql` (migrates ALL existing site content: 40+ specialities, 10 blog posts, reviews, FAQs, settings)
3. **Authentication → Users → Add user** → create the doctor's email + password.
4. Copy her user id and run in the SQL editor:
   ```sql
   insert into admin_users (id, full_name) values ('<user-uuid>', 'Dr. Pratibha Y.C.');
   ```
5. Copy `.env.local.example` → `.env.local` and fill in the URL, anon key, service-role key, site URL.
6. `npm install && npm run dev` → open `http://localhost:3000/admin/login`.

## Deploy to Vercel
Import the repo, add the same 4 environment variables, deploy. No other server is needed.
(The service-role key is only read in two server-side API routes and never reaches the browser.)

## Admin overview
- **Dashboard**: New / Follow-ups / Today counts + quick actions.
- **Consultation → Requests**: search (name/phone, partial), filter (status, type, date), request detail with
  WhatsApp (pre-filled, template editable under Website & Settings → Consultation), Call, one-tap status
  changes, follow-up note/date, "Previous requests from this number", duplicate warning, delete solved (single/bulk).
- **Consultation → Follow-ups**: cards with WhatsApp / Call / Mark Solved.
- **Website & Settings**: Doctor Profile (photo upload auto-resized to WebP, old photo deleted), Home Page,
  Specialities (full CRUD, reorder, publish/unpublish, SEO), Reviews (website reviews + Google config), FAQs,
  Consultation (clinic/online toggles, platforms), Contact, Blog, Website Notice popup, SEO.
- Most sections use **Save Draft → Preview → Publish / Discard**; the public site only shows published content.

## Design decisions worth knowing
- Consultation requests are **never** publicly readable: no anon RLS policy exists; the public form posts to
  `/api/consultation`, which validates server-side (honeypot + 2-minute duplicate guard + validation) and inserts with the service-role key.
- Same-phone requests within 30 minutes are kept but flagged "Possible duplicate".
- Public pages use a cookie-free client so they are statically cached (revalidate 60s); a database outage cannot break a deploy.
- Blog editor is a plain-text editor (blank line = new paragraph) — intentionally no heavy WYSIWYG library. Output is rendered as text, so nothing can inject HTML.
- Top navigation no longer hard-codes "Psoriasis" / "Piles" links because specialities are CMS-managed; they appear under Services and in the footer instead. Their URLs (`/psoriasis-treatment`, `/piles-treatment`) are unchanged.
- Google Reviews: the admin configures display rating/count and the "Read reviews on Google" link; Google's own reviews are not editable.

## Placeholders still to fill (from the admin, no code)
Phone, WhatsApp, email, timings, Practo/Apollo links (Consultation), social links, Google review link, real photo.
