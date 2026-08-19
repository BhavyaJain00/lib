-- Repair chat_talks: the live table was created without its `id` primary key.
--
-- Symptom: every recordChatTalk() insert fails with
--   "Could not find the 'id' column of 'chat_talks' in the schema cache"
-- so chat history never reaches /admin/chats, and the thumbs-up/down and
-- delete actions -- which match rows on `id` -- can never find a row.
--
-- Re-running schema.sql does NOT repair this. Its `create table if not exists
-- chat_talks (...)` is a no-op once the table is present, so the missing
-- column stays missing. This migration is the fix.

-- The default backfills any rows already in the table.
alter table chat_talks
  add column if not exists id uuid not null default gen_random_uuid();

-- Only claim the primary key if the table doesn't already have one, so this
-- stays safe to re-run.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'chat_talks'::regclass
      and contype = 'p'
  ) then
    alter table chat_talks add primary key (id);
  end if;
end $$;
