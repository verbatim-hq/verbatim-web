-- =============================================================================
-- Verbatim.ai · 0007_public_shares.sql
-- -----------------------------------------------------------------------------
-- Feature 7: Public sharing for project synthesis.
--
-- Adds `public_slug` to `project_reports`. RLS policies remain unchanged.
-- Public route reads via service_role and only fetches by slug.
-- =============================================================================

begin;

alter table project_reports
  add column if not exists public_slug text;

create unique index if not exists project_reports_public_slug_key
  on project_reports (public_slug)
  where public_slug is not null;

create index if not exists project_reports_public_slug_idx
  on project_reports (public_slug)
  where public_slug is not null;

commit;

