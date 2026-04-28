-- =============================================================================
-- Verbatim.ai · 0006_project_reports.sql
-- -----------------------------------------------------------------------------
-- Feature 6: Multi-source project synthesis aggregation.
--
-- Notes:
-- - `org_id` remains UUID (Blueprint tenancy model).
-- - Adds `project_id` to `reports` to enable project-level aggregation.
-- - Adds `project_id` to `llm_calls` for aggregation cost observability.
-- =============================================================================

begin;

-- ---------------------------------------------------------------------------
-- 1) reports.project_id (for aggregation queries)
-- ---------------------------------------------------------------------------

alter table reports
  add column if not exists project_id uuid references projects(id) on delete cascade;

-- Best-effort backfill from sources.
update reports r
set project_id = s.project_id
from sources s
where r.source_id = s.id
  and r.project_id is null;

create index if not exists reports_project_status_idx
  on reports (project_id, status)
  where project_id is not null;

-- ---------------------------------------------------------------------------
-- 2) project_reports table
-- ---------------------------------------------------------------------------

create table if not exists project_reports (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references orgs(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  status text not null check (status in ('synthesizing','completed','failed')),
  content_json jsonb,
  created_at timestamptz not null default now(),
  unique (project_id)
);

create index if not exists project_reports_org_created_at_idx
  on project_reports (org_id, created_at desc);

alter table project_reports enable row level security;

do $$
begin
  create policy project_report_org on project_reports
    for all using (org_id = current_org_id()) with check (org_id = current_org_id());
exception when duplicate_object then
  -- no-op
end $$;

-- ---------------------------------------------------------------------------
-- 3) llm_calls.project_id for aggregation cost tracking
-- ---------------------------------------------------------------------------

alter table llm_calls
  add column if not exists project_id uuid references projects(id) on delete set null;

create index if not exists llm_calls_project_created_at_idx
  on llm_calls (project_id, created_at desc)
  where project_id is not null;

commit;

