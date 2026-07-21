# Connecting Supabase (required for the deployed site)

The app's data layer ([lib/db.ts](lib/db.ts)) speaks **Supabase** — a hosted
Postgres database with a free tier and a browser dashboard (Table Editor).

**Why you need it:** without Supabase the app stores data in JSON files on the
server's disk. That works on your PC, but deployed hosts (Vercel etc.) have
**read-only filesystems** — admin changes like toggling a course **Live**
appear to work and then silently revert. With the three env vars below set,
every admin edit, student query and file upload is stored permanently in
Supabase instead.

- **All database access stays server-side** (`import "server-only"`).
- **Demo mode is preserved** — leave the env vars blank and the site falls
  back to the local JSON files / sample data, so `npm run dev` works with no
  setup.
- **Uploads** (course images / brochures) go to a public Supabase Storage
  bucket, so they survive deploys too.

Setup is three steps: create a project, run one SQL file, paste three values
into `.env`.

---

## Step 1 — Create a Supabase project

1. Go to <https://supabase.com/dashboard> and sign up (GitHub login works).
2. Click **New project**:
   - **Name:** `navya-computech`
   - **Database password:** pick a strong one and save it somewhere — you only
     need it for direct SQL connections, not for this integration.
   - **Region:** pick the one closest to your users (e.g. Mumbai for India).
3. Wait ~2 minutes while the project provisions.

## Step 2 — Run the schema file

Dashboard → **SQL Editor** → **New query** → paste the entire contents of
[supabase/schema.sql](supabase/schema.sql) → **Run**.

One run creates everything the app needs:

- the `courses`, `inquiries` and `activity` tables
- Row Level Security policies (public may read active courses and submit the
  query form; everything else needs the server's secret key)
- the public `uploads` storage bucket for course images/brochures
- your current course catalogue as seed data, so the site isn't empty

It is safe to re-run — it never duplicates rows or overwrites later edits.
Verify: **Table Editor** should now list the three tables with the courses
seeded.

## Step 3 — Copy your API credentials into `.env`

In the dashboard go to **Project Settings → API Keys**. You need three values:

| Dashboard label | Goes into env var | Safe in browser? |
| --- | --- | --- |
| Project URL (e.g. `https://abcd1234.supabase.co`) | `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes |
| **Publishable key** (`sb_publishable_...`) — older projects call it **anon public** (`eyJ...`) | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes — protected by Row Level Security |
| **Secret key** (`sb_secret_...`) — older projects call it **service_role** (`eyJ...`) | `SUPABASE_SERVICE_ROLE_KEY` | ❌ **Never.** Bypasses Row Level Security |

Both the new-style (`sb_...`) and legacy (JWT `eyJ...`) keys work identically —
paste whichever your dashboard shows. The variables are already scaffolded in
[.env](.env) (and [.env.example](.env.example) for teammates):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcd1234.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxxxxxxxxxxx
```

Then **restart the dev server** — Next.js only reads `.env` at startup. The
admin panel now reads and writes Supabase; open the Table Editor to watch rows
change as you use it.

Why the naming matters: anything prefixed `NEXT_PUBLIC_` is inlined into the
browser bundle by Next.js. The URL and publishable key are designed to be
public; the secret key has no prefix on purpose so it can never leak into
client code.

## Step 4 — Deploying to Vercel

Add the same three variables in **Vercel → your project → Settings →
Environment Variables** (tick Production, Preview and Development), then
**Redeploy** — env changes only apply to new builds. Unlike MongoDB Atlas
there is no IP allowlist to configure — Supabase's API is reachable from any
serverless region out of the box.

Don't forget `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `AUTH_SECRET` there too —
without them **`/admin` is open to anyone** on the deployed site.

---

## How the code fits together

| File | Role |
| --- | --- |
| [lib/supabase.ts](lib/supabase.ts) | Cached server-side client; `null` when env vars are blank |
| [lib/db.ts](lib/db.ts) | Every data function: Supabase when configured, JSON files otherwise |
| [lib/uploads.ts](lib/uploads.ts) | Uploads to the `uploads` bucket, or `public/uploads/` locally |
| [supabase/schema.sql](supabase/schema.sql) | One-shot setup: tables, RLS, bucket, seed |

Postgres columns are snake_case (`batch_size`, `is_active`, `sort_order`);
`lib/db.ts` maps them to the camelCase fields the app uses, so no page or
component ever changed.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Invalid API key` | Key pasted with a typo/truncated, or you edited `.env` without restarting the dev server. |
| `TypeError: fetch failed` | `NEXT_PUBLIC_SUPABASE_URL` is wrong (it must look like `https://<ref>.supabase.co`) or no internet. |
| `relation "courses" does not exist` | Step 2 hasn't been run in this project — check you're in the right Supabase project. |
| `new row violates row-level security policy` | You're writing with the anon/publishable key and no policy allows it. Set `SUPABASE_SERVICE_ROLE_KEY` — the server prefers it automatically. |
| Empty results but the Table Editor shows rows | RLS is on and no `select` policy matches — again, the secret key bypasses this. |
| Upload fails mentioning the bucket | The `uploads` bucket is missing — run [supabase/schema.sql](supabase/schema.sql) (or create a public bucket named `uploads`). |
| Changes to `.env` seem ignored | Always restart `npm run dev`; Next.js reads env files only at startup. |
| Admin edits on the live site still disappear | The env vars aren't set on Vercel (or you didn't redeploy after adding them). |
