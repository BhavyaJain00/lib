-- ============================================================================
--  Navya Computech — Supabase setup
--
--  Run this ONCE in your Supabase project: Dashboard → SQL Editor → New query
--  → paste this whole file → Run. It is safe to re-run (everything is
--  "if not exists" / "on conflict do nothing").
--
--  It creates the three tables the app uses (courses, inquiries, activity),
--  locks them down with Row Level Security, creates the public "uploads"
--  storage bucket for course images/brochures, and seeds your current course
--  catalogue so the live site isn't empty.
-- ============================================================================

-- ------------------------------- Tables -------------------------------------

-- Courses shown on the site. Postgres uses snake_case column names; the app's
-- camelCase fields map to them in lib/db.ts (e.g. batchSize -> batch_size).
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
  -- Uploaded banner photo / brochure URLs (Supabase Storage), or null.
  image         text,
  document      text,
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

-- Promotional poster/announcement banners shown on home page sliding section.
create table if not exists posters (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  subtitle    text,
  image_url   text not null,
  link_url    text,
  badge       text,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ------------------------- Row Level Security --------------------------------
-- The server uses the SECRET key, which bypasses RLS entirely — these policies
-- only limit what the public publishable/anon key could do from a browser.

alter table courses   enable row level security;
alter table inquiries enable row level security;
alter table activity  enable row level security;
alter table posters   enable row level security;

-- Anyone may read active posters.
drop policy if exists "public read active posters" on posters;
create policy "public read active posters"
  on posters for select
  using (is_active = true);

-- Anyone may read the active courses (safe for the public site).
drop policy if exists "public read active courses" on courses;
create policy "public read active courses"
  on courses for select
  using (is_active = true);

-- Anyone may submit an inquiry (the website form).
drop policy if exists "public insert inquiries" on inquiries;
create policy "public insert inquiries"
  on inquiries for insert
  with check (true);

-- No policies on activity — only the secret key (server) can touch it.

-- --------------------------- Storage bucket ----------------------------------
-- Public bucket for course images and brochures. "Public" means files can be
-- READ by URL; writing still requires the server's secret key.

insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

-- ------------------------------- Seed ----------------------------------------
-- Your current catalogue (from data/courses.json), keeping the same ids and
-- Live/Popular flags. Re-running never duplicates or overwrites edits.

insert into courses
  (id, slug, title, icon, tagline, duration, batch_size, level, certification,
   syllabus, careers, featured, is_active, sort_order, created_at, updated_at)
values
  ('f927265c-eec6-44ae-a383-afb258fe32eb', 'rscit', 'RSCIT', 'Award',
   'The official RKCL computer literacy certificate — essential for government jobs.',
   '3 Months', 'Max 20 Students', 'Beginner', 'RKCL / VMOU Certificate',
   '["Computer Fundamentals & Windows", "Internet, Email & Digital Payments", "MS Office — Word, Excel, PowerPoint", "Government e-Services & Digital India", "RSCIT Exam Practice & Mock Tests"]',
   '["Government Job Eligibility", "Data Entry Operator", "Office Assistant"]',
   true, true, 0, '2026-07-18T16:15:09.522Z', '2026-07-19T06:50:14.280Z'),

  ('570dfc9a-a994-4fa7-b0ba-927cca503ed2', 'basic-computer', 'Basic Computer', 'Monitor',
   'Build strong digital foundations — from operating systems to office productivity.',
   '2 Months', 'Max 15 Students', 'Beginner', 'ISO 9001:2015 Certificate',
   '["Computer Fundamentals & OS Basics", "MS Word, Excel & PowerPoint", "Internet, Email & Cloud Basics", "Typing Mastery & Shortcuts", "File Management & Printing"]',
   '["Data Entry Operator", "Office Assistant", "Front Office Executive"]',
   false, true, 1, '2026-07-18T16:15:09.522Z', '2026-07-19T06:50:15.256Z'),

  ('89d39f1d-4e94-4ac5-a0e0-26659cab5178', 'advance-computer', 'Advance Computer', 'Cpu',
   'Level up with advanced Excel, automation and professional office workflows.',
   '3 Months', 'Max 15 Students', 'Intermediate', 'ISO 9001:2015 Certificate',
   '["Advanced Excel — Formulas & Pivot Tables", "Data Analysis & Dashboards", "MS Access & Database Basics", "Office Automation & Macros", "Business Documentation"]',
   '["Office Executive", "MIS Executive", "Back Office Analyst"]',
   false, true, 2, '2026-07-18T16:15:09.522Z', '2026-07-19T06:59:25.423Z'),

  ('596e7f10-e5ca-4e8a-a0af-d79a8686eab4', 'tally-gst', 'Tally Prime & GST', 'Calculator',
   'Become job-ready in accounting with Tally Prime, GST and taxation.',
   '3 Months', 'Max 15 Students', 'Beginner', 'ISO 9001:2015 Certificate',
   '["Accounting Fundamentals", "Tally Prime Complete", "GST Concepts & Filing", "Inventory & Payroll", "Income Tax & TDS Basics"]',
   '["Accountant", "Accounts Executive", "GST Practitioner"]',
   true, true, 3, '2026-07-18T16:15:09.522Z', '2026-07-19T06:59:24.378Z'),

  ('5642dc03-2bb3-4d8e-98a6-1ebc8b228bd2', 'web-development', 'Web Development', 'Code2',
   'Go from HTML to full-stack apps with live projects and a real portfolio.',
   '6 Months', 'Max 12 Students', 'Beginner to Advanced', 'Industry-Recognized Certificate',
   '["HTML5, CSS3 & Responsive Design", "JavaScript & Modern ES6+", "React & Next.js Fundamentals", "Backend with Node & Databases", "Deployment & Live Projects"]',
   '["Frontend Developer", "Full-Stack Developer", "Web Designer"]',
   true, true, 4, '2026-07-18T16:15:09.522Z', '2026-07-19T06:59:26.840Z'),

  ('7fea0360-a39f-4bda-bf28-6c686c6a1187', 'govt-exam-preparation', 'Govt Exam Preparation', 'Landmark',
   'Focused computer-section coaching for government and banking exams.',
   '4 Months', 'Max 20 Students', 'All Levels', 'Institute Certificate',
   '["Computer Awareness for Competitive Exams", "Typing Speed & Accuracy Practice", "Previous Year Papers & Analysis", "Weekly Mock Tests & Ranking", "Interview & Document Guidance"]',
   '["Bank Clerk / PO", "SSC & Railway Posts", "State Govt Departments"]',
   true, false, 5, '2026-07-18T16:15:09.522Z', '2026-07-19T06:49:54.002Z'),

  ('bc218b86-e17b-4a0b-bf66-afec2aa00f50', 'digital-marketing', 'Digital Marketing', 'Megaphone',
   'Master SEO, social media, ads and analytics to grow real brands online.',
   '4 Months', 'Max 15 Students', 'Intermediate', 'Industry-Recognized Certificate',
   '["SEO & Keyword Research", "Google Ads & Meta Ads", "Social Media Marketing", "Content & Email Marketing", "Google Analytics & Reporting"]',
   '["Digital Marketing Executive", "SEO Specialist", "Social Media Manager"]',
   false, false, 6, '2026-07-18T16:15:09.522Z', '2026-07-19T06:49:55.235Z'),

  ('4230a6d6-57e6-4f79-b638-0a25da596220', 'ai-prompt-engineering', 'AI & Prompt Engineering', 'Sparkles',
   'Work hands-on with modern AI tools and learn to craft high-impact prompts.',
   '2 Months', 'Max 12 Students', 'All Levels', 'Industry-Recognized Certificate',
   '["Foundations of AI & LLMs", "Prompt Engineering Techniques", "AI Tools for Productivity", "Content, Image & Code Generation", "Building AI-Powered Workflows"]',
   '["AI Content Specialist", "Prompt Engineer", "Automation Associate"]',
   false, false, 7, '2026-07-18T16:15:09.522Z', '2026-07-19T06:49:56.352Z')

on conflict (slug) do nothing;

-- Chatbot Talks Table
create table if not exists chat_talks (
  id uuid primary key default gen_random_uuid(),
  user_question text not null,
  bot_reply text not null,
  score int check (score in (-1, 1)),
  course_slug text,
  is_ai boolean default false,
  created_at timestamptz not null default now()
);

