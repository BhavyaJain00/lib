# Adding Supabase to Navya Computech

Supabase gives you a hosted **Postgres database** plus auth, file storage and
realtime subscriptions — with a free tier and a browser dashboard (Table
Editor) similar to how you use MongoDB Compass today.

This guide walks you from zero to a working Supabase connection that fits the
way this codebase already works:

- **All database access stays server-side** (`import "server-only"`), exactly
  like [lib/mongodb.ts](lib/mongodb.ts) and [lib/db.ts](lib/db.ts).
- **Demo mode is preserved** — if the Supabase env vars are blank, helpers
  return `null` and callers fall back to the sample data in
  [lib/data.ts](lib/data.ts), the same graceful degradation the Mongo layer
  uses.
- **The client is cached globally** so dev hot-reloads and serverless
  invocations don't open a new connection every time.

> **Note:** adding Supabase does **not** automatically switch the site off
> MongoDB. The data layer in `lib/db.ts` still speaks Mongo. Steps 1–5 get you
> a connected, queryable Supabase project; Step 6 shows how to port the data
> functions over when you're ready. Both can coexist during a migration.

---

## Step 1 — Create a Supabase project

1. Go to <https://supabase.com/dashboard> and sign up (GitHub login works).
2. Click **New project**:
   - **Name:** `navya-computech`
   - **Database password:** pick a strong one and save it somewhere — you only
     need it for direct SQL connections, not for this integration.
   - **Region:** pick the one closest to your users (e.g. Mumbai for India).
3. Wait ~2 minutes while the project provisions.

## Step 2 — Copy your API credentials

In the dashboard go to **Project Settings → API Keys** (gear icon in the left
sidebar). You need three values:

| Dashboard label | Goes into env var | Safe in browser? |
| --- | --- | --- |
| Project URL (e.g. `https://abcd1234.supabase.co`) | `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes |
| **Publishable key** (`sb_publishable_...`) — older projects call it **anon public** (`eyJ...`) | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes — protected by Row Level Security |
| **Secret key** (`sb_secret_...`) — older projects call it **service_role** (`eyJ...`) | `SUPABASE_SERVICE_ROLE_KEY` | ❌ **Never.** Bypasses Row Level Security |

Both the new-style (`sb_...`) and legacy (JWT `eyJ...`) keys work identically
with the client library — paste whichever your dashboard shows.

## Step 3 — Fill in `.env`

The variables are already scaffolded in section **(4) SUPABASE** of your
[.env](.env) file (and in [.env.example](.env.example) for teammates). Paste
the three values from Step 2:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcd1234.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxxxxxxxxxxx
```

Then **restart the dev server** — Next.js only reads `.env` at startup.

Why the naming matters: anything prefixed `NEXT_PUBLIC_` is inlined into the
browser bundle by Next.js. The URL and publishable key are designed to be
public; the secret key has no prefix on purpose so it can never leak into
client code.

## Step 4 — Install the client library

```bash
npm install @supabase/supabase-js
```

## Step 5 — Create the client helper

Create **`lib/supabase.ts`** (mirrors the structure of `lib/mongodb.ts`):

```ts
import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Prefer the secret key on the server (full access); fall back to the
// publishable key so read-only demo setups still work.
const KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Whether Supabase is configured. The site must keep running without it
 * (falling back to sample data / MongoDB), so callers check this — or just
 * handle the `null` from getSupabase() — and degrade gracefully.
 */
export const isSupabaseConfigured = Boolean(URL && KEY);

// Cache across hot reloads in dev and lambda invocations in production,
// same trick as lib/mongodb.ts.
const globalForSupabase = globalThis as unknown as {
  _supabase?: SupabaseClient;
};

/** Returns the Supabase client, or null when env vars are not set. */
export function getSupabase(): SupabaseClient | null {
  if (!URL || !KEY) return null;
  if (!globalForSupabase._supabase) {
    globalForSupabase._supabase = createClient(URL, KEY, {
      auth: {
        // This is a server-side data client — no user sessions to persist.
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return globalForSupabase._supabase;
}
```

## Step 6 — Create the tables

Dashboard → **SQL Editor** → **New query** → paste and **Run**. This mirrors
the three Mongo collections (`courses`, `inquiries`, `activity`) from
[lib/mongodb.ts](lib/mongodb.ts):

```sql
-- Courses shown on the site (Postgres uses snake_case column names;
-- the app's camelCase fields map to them, e.g. batchSize -> batch_size).
create table if not exists courses (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  icon          text not null default 'BookOpen',
  -- Non-null to match the app's Course type — a row edited in the Table
  -- Editor with one of these blank must not feed `null` into the UI.
  tagline       text not null default '',
  duration      text not null default '',
  batch_size    text not null default '',
  level         text not null default '',
  certification text not null default '',
  syllabus      jsonb not null default '[]',
  careers       jsonb not null default '[]',
  featured      boolean not null default false,
  is_active     boolean not null default true,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Inquiries from the website form.
create table if not exists inquiries (
  id               uuid primary key default gen_random_uuid(),
  full_name        text not null,
  phone            text not null,
  email            text,
  preferred_course text,
  message          text,
  status           text not null default 'new'
                   check (status in ('new', 'contacted', 'enrolled', 'closed')),
  created_at       timestamptz not null default now()
);

-- Admin/site activity log.
create table if not exists activity (
  id         uuid primary key default gen_random_uuid(),
  type       text not null,
  summary    text not null,
  detail     text,
  actor      text not null default 'visitor',
  created_at timestamptz not null default now()
);
```

### Row Level Security (RLS)

Because the **publishable/anon key** could be used from a browser, lock the
tables down. The **secret key bypasses RLS entirely**, so your server-side
code keeps full access regardless. Run this in the SQL Editor too:

```sql
alter table courses   enable row level security;
alter table inquiries enable row level security;
alter table activity  enable row level security;

-- Anyone may read the active courses (safe for the public site).
create policy "public read active courses"
  on courses for select
  using (is_active = true);

-- Anyone may submit an inquiry (the website form).
create policy "public insert inquiries"
  on inquiries for insert
  with check (true);

-- No policies on activity — only the secret key (server) can touch it.
```

Verify: dashboard → **Table Editor** should now list `courses`, `inquiries`
and `activity`.

### Optional — seed a sample course

```sql
insert into courses
  (slug, title, icon, tagline, duration, batch_size, level,
   certification, syllabus, careers, featured, sort_order)
values
  ('full-stack-web-development', 'Full-Stack Web Development', 'Code2',
   'Live Projects · Portfolio', '6 Months', 'Small', 'Beginner to Advanced',
   'ISO-certified completion certificate',
   '["HTML, CSS & JavaScript", "React & Next.js", "Node.js & databases"]',
   '["Web Developer", "Frontend Developer", "Full-Stack Developer"]',
   true, 1);
```

## Step 7 — Query it from the app

Supabase reads/writes look like this (compare with the Mongo versions in
[lib/db.ts](lib/db.ts)). A read with the demo-mode fallback:

```ts
import { getSupabase } from "@/lib/supabase";
import { COURSES, type Course } from "@/lib/data";

export async function getPublicCourses(): Promise<Course[]> {
  const supabase = getSupabase();
  if (!supabase) return COURSES; // demo mode — same fallback as Mongo

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error || !data || data.length === 0) return COURSES;

  // Map snake_case rows to the app's camelCase Course type.
  return data.map((row) => ({
    _id: row.id,
    slug: row.slug,
    title: row.title,
    icon: row.icon,
    tagline: row.tagline,
    duration: row.duration,
    batchSize: row.batch_size,
    level: row.level,
    certification: row.certification,
    syllabus: row.syllabus,
    careers: row.careers,
    featured: row.featured,
    isActive: row.is_active,
    sortOrder: row.sort_order,
  })) as Course[];
}
```

And a write (the inquiry form):

```ts
export async function createInquiry(input: {
  fullName: string;
  phone: string;
  email?: string | null;
  preferredCourse?: string | null;
  message?: string | null;
}) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Database not connected.");

  const { error } = await supabase.from("inquiries").insert({
    full_name: input.fullName,
    phone: input.phone,
    email: input.email ?? null,
    preferred_course: input.preferredCourse ?? null,
    message: input.message ?? null,
    status: "new",
  });
  if (error) throw new Error(error.message);
}
```

To migrate fully, port the remaining functions in `lib/db.ts` the same way
(`.update(...).eq("id", id)`, `.delete().eq("id", id)`, and
`.select("*", { count: "exact", head: true })` for the dashboard counts) —
the function signatures can stay identical, so no page or component changes.

## Step 8 — Deploying to Vercel

Add the same three variables in **Vercel → your project → Settings →
Environment Variables**, then redeploy. Unlike MongoDB Atlas there is no IP
allowlist to configure — Supabase's API is reachable from any serverless
region out of the box.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Invalid API key` | Key pasted with a typo/truncated, or you edited `.env` without restarting the dev server. |
| `TypeError: fetch failed` | `NEXT_PUBLIC_SUPABASE_URL` is wrong (it must look like `https://<ref>.supabase.co`) or no internet. |
| `relation "courses" does not exist` | The SQL in Step 6 hasn't been run in this project — check you're in the right Supabase project. |
| `new row violates row-level security policy` | You're writing with the anon/publishable key and no policy allows it. Use the secret key server-side (Step 5 already prefers it) or add a policy. |
| Empty results but the Table Editor shows rows | RLS is on and no `select` policy matches — again, the secret key bypasses this. |
| Changes to `.env` seem ignored | Always restart `npm run dev`; Next.js reads env files only at startup. |

## MongoDB and Supabase side by side

Nothing conflicts: `lib/mongodb.ts` and `lib/supabase.ts` are independent, and
each is inert when its env vars are blank. A sensible migration order:

1. Keep MongoDB as the live source of truth.
2. Create the Supabase tables (Step 6) and port `lib/db.ts` function-by-function
   on a branch, testing against your seeded Supabase data.
3. When everything works, remove `MONGODB_URI` from `.env` — demo-mode
   fallbacks make this switch safe — and later drop `mongodb` from
   `package.json` and delete `lib/mongodb.ts`.
