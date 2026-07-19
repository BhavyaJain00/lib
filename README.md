# Navya Computech

A professional, fully responsive website for **Navya Computech** — an ISO
9001:2015 certified computer training institute. Clean **shadcn/ui**-style
design system: **Inter** font, **blue-600** primary, **slate** neutrals,
`0.5rem` radius, full light + dark theme.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**,
**Tailwind CSS v4** and **MongoDB** (local via Compass, or Atlas in the cloud),
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

The site runs immediately in **demo mode** (sample courses, form simulates
success, `/admin` opens unlocked). To store real data, connect Atlas below.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run seed` | Load the starter course catalogue into Atlas |
| `npm run typecheck` | `tsc --noEmit` |

---

## 🗄️ Database setup

> **MongoDB Compass** is the free desktop app for *viewing* your data — it
> isn't a database itself. It connects to a MongoDB server, either on your own
> PC (local) or in the cloud (Atlas). The app works with both: only the
> `MONGODB_URI` changes.

### Option A — Local MongoDB + Compass (easiest, no signup)

1. Download **MongoDB Community Server** and tick **“Install MongoDB Compass”**
   in the installer: <https://www.mongodb.com/try/download/community>
2. Finish the installer. MongoDB runs as a Windows service on port `27017`
   (check it under `services.msc` if needed).
3. In `.env`:

   ```env
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB=navya_computech
   ```

4. Seed the starter courses and indexes:

   ```bash
   npm run seed
   ```

5. Open **Compass** → paste `mongodb://localhost:27017` → **Connect** → open the
   **`navya_computech`** database. You'll see the `courses`, `inquiries` and
   `activity` collections and can browse/edit documents directly.

### Option B — MongoDB Atlas (cloud — required for Vercel)

1. Free **M0** cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. **Database Access** → add a database user (username + password).
3. **Network Access** → Add IP → *Allow access from anywhere* (`0.0.0.0/0`).
4. **Connect → Drivers** → copy the string, replace `<password>`, put it in `.env`:

   ```env
   MONGODB_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

5. Run `npm run seed`. Compass opens that **same** connection string, so you can
   browse your cloud data with the identical GUI.

Restart the server after changing `.env`. The site then reads courses from the
database, and queries are saved and visible in the admin panel.

**Collections created:** `courses`, `inquiries`, `activity`.

> Local is great for development; switch `MONGODB_URI` to Atlas when you deploy
> (Vercel can't reach a database on your PC).

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

**Courses** are managed from the **admin panel** once Atlas is connected — no
code changes needed, and edits appear on the site within ~5 minutes (ISR) or
immediately on the next request after saving.

Everything else lives in [`lib/data.ts`](lib/data.ts):

| Constant | Controls |
|----------|----------|
| `CONTACT` | Phone, WhatsApp, email, address (used site-wide) |
| `HERO_SLIDES` | The auto-rotating hero cards |
| `STATS` | The blue stats band |
| `WHY_US` / `BENEFITS` | "Why Choose Us" content |
| `FAQS` | The FAQ accordion |
| `COURSES` | Fallback sample catalogue used before Atlas is connected |

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
  mongodb.ts                Atlas connection (cached)
  db.ts                     Data access + fallbacks
  auth.ts                   Admin session (HMAC cookie)
  icons.ts                  Icon registry (DB stores a string key)
  data.ts                   Site content + sample fallbacks
scripts/seed.mjs            Seeds Atlas
```

---

## ☁️ Deploy to Vercel

`.env` is git-ignored, so it is **never** uploaded. Add each variable manually
under **Project → Settings → Environment Variables** (tick Production, Preview
and Development), then **Redeploy** — env changes only apply to new builds.

| Variable | Value to use on Vercel |
|----------|------------------------|
| `MONGODB_URI` | Your **Atlas** string. The short `mongodb+srv://...` form is fine here (Vercel's DNS resolves SRV correctly). |
| `MONGODB_DB` | `navya_computech` |
| `ADMIN_EMAIL` | The email you'll sign in to `/admin` with |
| `ADMIN_PASSWORD` | A **strong** password — not the one used locally |
| `AUTH_SECRET` | A **fresh** random value (see below) — never the placeholder |
| `NEXT_PUBLIC_SITE_URL` | Your live domain, e.g. `https://navyacomputech.vercel.app` |

Generate a production `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Two things that will break the deploy if missed

1. **Atlas Network Access** — Vercel's IPs are dynamic, so you must allow
   `0.0.0.0/0` (Atlas → Network Access → Add IP → *Allow access from anywhere*).
   Without it every request times out.
2. **A local `MONGODB_URI` won't work.** `mongodb://localhost:27017` points at
   *your PC* — a deployed site can't reach it. Use the Atlas string.

> **Note on the SRV vs non-SRV string:** this project's local `.env` uses the
> long non-SRV form (`mongodb://host-00,host-01,host-02/?replicaSet=...`)
> because Node's SRV DNS lookup is blocked on the dev machine. On Vercel either
> form works — prefer the short `mongodb+srv://` one there, as it keeps working
> if Atlas ever changes the cluster's shard hostnames.

---

© Navya Computech. Content and branding belong to Navya Computech.
