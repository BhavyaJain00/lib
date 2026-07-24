-- Create posters table if not exists
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

-- Enable Row Level Security
alter table posters enable row level security;

-- Public read active posters policy
drop policy if exists "public read active posters" on posters;
create policy "public read active posters"
  on posters for select
  using (is_active = true);
