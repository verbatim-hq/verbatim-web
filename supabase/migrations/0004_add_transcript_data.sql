-- =============================================================================
-- Verbatim.ai · 0004_add_transcript_data.sql
-- -----------------------------------------------------------------------------
-- Feature 3: Audio transcription pipeline storage.
--
-- Adds transcript payload storage + AssemblyAI job id to `sources`.
-- RLS remains default-deny; background jobs use service_role to write.
-- =============================================================================

begin;

alter table sources
  add column if not exists transcript_json jsonb,
  add column if not exists assembly_ai_id text,
  add column if not exists duration int;

create index if not exists sources_assembly_ai_id_idx
  on sources (assembly_ai_id)
  where assembly_ai_id is not null;

commit;

