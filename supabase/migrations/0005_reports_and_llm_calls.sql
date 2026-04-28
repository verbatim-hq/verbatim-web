-- =============================================================================
-- Verbatim.ai · 0005_reports_and_llm_calls.sql
-- -----------------------------------------------------------------------------
-- Feature 4: LLM synthesis persistence + cost observability.
--
-- Notes:
-- - `llm_calls` already exists from 0001_init.sql. We extend it to attach calls
--   to a `source_id` and to store prompt/completion token counts explicitly.
-- - `org_id` remains UUID everywhere (Blueprint tenancy model).
-- =============================================================================

begin;

-- ---------------------------------------------------------------------------
-- Reports: one per source synthesis output
-- ---------------------------------------------------------------------------

create table if not exists reports (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references orgs(id) on delete cascade,
  source_id uuid not null references sources(id) on delete cascade,
  status text not null check (status in ('synthesizing','completed','failed')),
  content_json jsonb,
  created_at timestamptz not null default now(),
  unique (source_id)
);
create index if not exists reports_org_created_at_idx on reports (org_id, created_at desc);

alter table reports enable row level security;

do $$
begin
  create policy report_org on reports
    for all using (org_id = current_org_id()) with check (org_id = current_org_id());
exception when duplicate_object then
  -- no-op
end $$;

-- ---------------------------------------------------------------------------
-- Extend llm_calls to link to sources + explicit token fields (without
-- breaking existing columns used elsewhere).
-- ---------------------------------------------------------------------------

alter table llm_calls
  add column if not exists source_id uuid references sources(id) on delete set null,
  add column if not exists prompt_tokens int,
  add column if not exists completion_tokens int;

create index if not exists llm_calls_source_created_at_idx
  on llm_calls (source_id, created_at desc)
  where source_id is not null;

commit;

