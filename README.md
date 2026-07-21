# Navya Computech

A professional, fully responsive website for **Navya Computech** — an ISO
9001:2015 certified computer training institute. Clean **shadcn/ui**-style
design system: **Inter** font, **blue-600** primary, **slate** neutrals,
`0.5rem` radius, full light + dark theme.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**,
**Tailwind CSS v4** and **Supabase** (hosted Postgres, free tier),
with an **admin panel** to manage courses and student queries.

> **No online payments.** The site showcases courses; students enroll by
> contacting the institute. The query form simply records an enquiry.

---

## ✨ Features

- **Home** — hero with an **auto-rotating course carousel** (RSCIT, Tally,
  Web Development, Govt Exam Prep), stats band, course catalogue, "Why Choose
  Us", FAQ, Admissions steps, **query form**, and contact cards with a Google
  Map.
- **Course pages** — syllabus, career prospects and a sticky
  *"Interested in this course?"* Call / WhatsApp / Email card.
- **Admin panel** (`/admin`) — login-protected control centre:
  - **Overview** — live counts + recent queries + latest activity
  - **Queries** — every enquiry, status pipeline (new → contacted → enrolled →
    closed), delete, **CSV export**
  - **Courses** — full add / edit / delete with an icon picker; toggle **Live**
    and **Popular**. Anything marked Live appears on the website automatically.
  - **Activity** — a timeline of everything that happens: queries received,
    courses changed, admin logins
- **SEO** — generated favicon and OG image, sitemap, robots, JSON-LD.
- **Polish** — dark/light mode, custom 404, loading + error states, WhatsApp
  and back-to-top buttons, mobile-first responsive.

---

## 🚀 Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

The site runs immediately in **demo mode** (sample courses stored in local
JSON files, `/admin` opens unlocked). To store real data — **required before
deploying** — connect Supabase below.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |

---

## 🗄️ Database setup (Supabase)

Full walkthrough with screenshots-level detail: **[SUPABASE.md](SUPABASE.md)**.
The short version:

1. Create a free project at [supabase.com](https://supabase.com/dashboard).
2. **SQL Editor** → run [supabase/schema.sql](supabase/schema.sql) — creates
   the `courses`, `inquiries` and `activity` tables, security policies, the
   `uploads` storage bucket, and seeds the course catalogue.
3. **Project Settings → API Keys** → copy three values into `.env`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxx
   SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxxx
   ```

4. Restart `npm run dev`.

The admin panel now reads and writes Supabase, and you can browse/edit the
data any time in the dashboard's **Table Editor**. Leave the vars blank and
the site falls back to demo mode (local JSON files) — but note that **on a
deployed host the filesystem is read-only**, so without Supabase, admin edits
on the live site silently revert.

---

## 🔐 Admin login

Set all three in `.env` and the login gate switches on automatically:

```env
ADMIN_EMAIL=admin@navyacomputech.com
ADMIN_PASSWORD=a-long-unique-password
AUTH_SECRET=<random hex>
```

Generate the secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then sign in at **`/admin/login`**. Sessions are an HttpOnly, HMAC-signed
cookie valid for 7 days. Leave these blank and `/admin` stays open in dev mode
(handy for previewing, but set them before going live).

---

## ✏️ Editing content

**Courses** are managed from the **admin panel** once Supabase is connected —
no code changes needed, and edits appear on the site within ~5 minutes (ISR)
or immediately on the next request after saving.

Everything else lives in [`lib/data.ts`](lib/data.ts):

| Constant | Controls |
|----------|----------|
| `CONTACT` | Phone, WhatsApp, email, address (used site-wide) |
| `HERO_SLIDES` | The auto-rotating hero cards |
| `STATS` | The blue stats band |
| `WHY_US` / `BENEFITS` | "Why Choose Us" content |
| `FAQS` | The FAQ accordion |
| `COURSES` | Fallback sample catalogue used before Supabase is connected |

Social links are in [`components/site-footer.tsx`](components/site-footer.tsx) —
icons stay hidden until you add real URLs.

---

## 📁 Project structure

```
app/
  page.tsx                  Home
  about/, privacy/, terms/  Static pages
  courses/[slug]/           Course detail (ISR)
  actions.ts                Public query-form action
  admin/
    login/                  Ungated login page
    (panel)/                Gated: layout + overview, inquiries,
                            courses (CRUD), activity
    actions.ts              Admin server actions
    inquiries/export/       CSV download
components/
  sections/                 hero, stats, courses, why-us, faq,
                            admissions, inquiry, contact
  hero-course-slider.tsx    Auto-rotating hero cards
  admin/                    Shell, forms, controls, primitives
  ui/                       button, card, badge, input, textarea, label, select
lib/
  supabase.ts               Supabase connection (cached, server-only)
  db.ts                     Data access — Supabase, or JSON files in demo mode
  auth.ts                   Admin session (HMAC cookie)
  icons.ts                  Icon registry (DB stores a string key)
  data.ts                   Site content + sample fallbacks
supabase/schema.sql         One-shot Supabase setup: tables, RLS, bucket, seed
```

---

## ☁️ Deploy to Vercel

`.env` is git-ignored, so it is **never** uploaded. Add each variable manually
under **Project → Settings → Environment Variables** (tick Production, Preview
and Development), then **Redeploy** — env changes only apply to new builds.

| Variable | Value to use on Vercel |
|----------|------------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your project URL, e.g. `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The **publishable / anon** key |
| `SUPABASE_SERVICE_ROLE_KEY` | The **secret / service_role** key |
| `ADMIN_EMAIL` | The email you'll sign in to `/admin` with |
| `ADMIN_PASSWORD` | A **strong** password — not the one used locally |
| `AUTH_SECRET` | A **fresh** random value (see below) — never the placeholder |
| `NEXT_PUBLIC_SITE_URL` | Your live domain, e.g. `https://navyacomputech.vercel.app` |

Generate a production `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Two things that will break the live site if missed

1. **The Supabase variables are not optional in production.** Without them the
   app falls back to JSON files on a read-only filesystem — the admin panel's
   Live/Popular toggles, edits and uploads will silently revert.
2. **Set the three `ADMIN_*` / `AUTH_SECRET` variables.** If they're missing,
   `/admin` runs in open dev mode — anyone who finds the URL can edit your
   site.

---

© Navya Computech. Content and branding belong to Navya Computech.
