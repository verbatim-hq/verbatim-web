-- =============================================================================
-- Verbatim.ai · 0003_projects_and_sources.sql
-- -----------------------------------------------------------------------------
-- Feature 2: Project navigator + upload engine support.
--
-- Note: `projects` + `sources` already exist (Blueprint 0001_init.sql).
-- This migration only adjusts `sources.status` to support the upload lifecycle
-- and keeps the existing default-deny RLS posture intact.
-- =============================================================================

begin;

-- ---------------------------------------------------------------------------
-- Upload lifecycle status values
-- ---------------------------------------------------------------------------

do $$
begin
  -- Drop the old CHECK constraint (name differs across environments).
  alter table sources drop constraint if exists sources_status_check;
exception when undefined_object then
  -- no-op
end $$;

alter table sources
  add constraint sources_status_check
  check (
    status in (
      'uploading',
      'uploaded',
      'processing',
      'transcribing',
      'transcribed',
      'extracting',
      'done',
      'failed'
    )
  );

-- Helpful index for project detail pages (list sources newest-first).
create index if not exists sources_project_created_at_idx
  on sources (project_id, created_at desc);

commit;

