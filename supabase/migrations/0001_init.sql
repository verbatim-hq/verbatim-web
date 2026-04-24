-- =============================================================================
-- Verbatim.ai · 0001_init.sql
-- -----------------------------------------------------------------------------
-- Day 2 (Friday, April 24, 2026) migration.
-- Source: VERBATIM_V1_BLUEPRINT.md §5 — DO NOT EDIT WITHOUT UPDATING THE DOC.
--
-- What this does:
--   1. Enables pgcrypto + pgvector extensions
--   2. Creates the 11 core tables
--   3. Creates the storage bucket for audio
--   4. Enables RLS on every table
--   5. Installs the `current_org_id()` helper
--   6. Installs org-isolation policies on every table
--   7. Installs the public-read policy for shareable analysis reports
--
-- How to run:
--   Option A — Supabase dashboard → SQL Editor → paste → Run
--   Option B — supabase CLI:
--       supabase db push (after `supabase link`)
-- =============================================================================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "vector";

-- ============================================================================
-- TENANCY
-- ============================================================================

create table orgs (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  plan text not null default 'free' check (plan in ('free','pro','team')),
  stripe_customer_id text,
  stripe_subscription_id text,
  free_syntheses_used int not null default 0,
  interviews_this_month int not null default 0,
  month_anchor date not null default current_date,
  ai_custom_instructions text,
  created_at timestamptz not null default now()
);

create table users (
  id uuid primary key,  -- matches Clerk user id
  org_id uuid not null references orgs(id) on delete cascade,
  email text unique not null,
  name text,
  role text not null default 'owner' check (role in ('owner','member')),
  created_at timestamptz not null default now()
);
create index on users(org_id);

-- ============================================================================
-- CORE DOMAIN
-- ============================================================================

create table projects (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references orgs(id) on delete cascade,
  name text not null,
  description text,
  share_slug text unique,  -- for public /r/[slug]
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index on projects(org_id);

create table sources (  -- an uploaded interview
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  org_id uuid not null references orgs(id) on delete cascade,  -- denormalized for fast RLS
  kind text not null check (kind in ('audio','video','transcript_text','transcript_vtt','transcript_srt')),
  original_filename text not null,
  storage_path text not null,  -- bucket/path
  duration_seconds int,
  language text default 'en',
  participant_label text,  -- user-provided; "Founder, fintech"
  status text not null default 'uploaded' check (status in
    ('uploaded','transcribing','transcribed','extracting','done','failed')),
  error_message text,
  transcription_provider text,
  transcription_cost_cents int,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index on sources(project_id);
create index on sources(org_id, status);

create table transcripts (
  id uuid primary key default uuid_generate_v4(),
  source_id uuid not null references sources(id) on delete cascade,
  org_id uuid not null references orgs(id) on delete cascade,
  full_text text not null,
  word_count int,
  provider text,
  created_at timestamptz not null default now()
);
create index on transcripts(source_id);

create table chunks (  -- one per speaker turn
  id uuid primary key default uuid_generate_v4(),
  source_id uuid not null references sources(id) on delete cascade,
  org_id uuid not null references orgs(id) on delete cascade,
  speaker text not null,
  text text not null,
  timestamp_start_ms int not null,
  timestamp_end_ms int not null,
  embedding vector(1536),
  created_at timestamptz not null default now()
);
create index on chunks(source_id, timestamp_start_ms);
create index on chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- ============================================================================
-- PER-INTERVIEW EXTRACTION
-- ============================================================================

create table pains (
  id uuid primary key default uuid_generate_v4(),
  source_id uuid not null references sources(id) on delete cascade,
  org_id uuid not null references orgs(id) on delete cascade,
  description text not null,
  severity int not null check (severity between 1 and 5),
  supporting_chunk_id uuid not null references chunks(id),
  verbatim_quote text not null,
  context text,
  embedding vector(1536),
  created_at timestamptz not null default now()
);
create index on pains(source_id);
create index on pains using ivfflat (embedding vector_cosine_ops) with (lists = 50);

-- ============================================================================
-- ANALYSIS OUTPUTS
-- ============================================================================

create table analyses (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  org_id uuid not null references orgs(id) on delete cascade,
  prompt_version text not null,
  status text not null default 'pending' check (status in ('pending','running','ready','failed')),
  summary_markdown text,
  share_slug text unique,
  interviews_count int not null default 0,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  error_message text
);
create index on analyses(project_id);
create index on analyses(share_slug) where share_slug is not null;

create table themes (
  id uuid primary key default uuid_generate_v4(),
  analysis_id uuid not null references analyses(id) on delete cascade,
  org_id uuid not null references orgs(id) on delete cascade,
  rank int not null,
  title text not null,
  description text not null,
  severity int not null check (severity between 1 and 5),
  frequency int not null,
  contradiction_flag boolean not null default false,
  recommendation text not null check (recommendation in ('build_now','investigate','monitor','ignore')),
  recommendation_reasoning text,
  created_at timestamptz not null default now()
);
create index on themes(analysis_id, rank);

create table theme_citations (
  id uuid primary key default uuid_generate_v4(),
  theme_id uuid not null references themes(id) on delete cascade,
  org_id uuid not null references orgs(id) on delete cascade,
  pain_id uuid not null references pains(id),
  chunk_id uuid not null references chunks(id),
  display_order int not null check (display_order between 1 and 3),
  created_at timestamptz not null default now()
);
create index on theme_citations(theme_id, display_order);

-- ============================================================================
-- OBSERVABILITY & COST
-- ============================================================================

create table llm_calls (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references orgs(id) on delete set null,
  user_id uuid references users(id) on delete set null,
  model text not null,
  prompt_version text,
  purpose text not null,  -- "extract_pains" | "synthesize_theme" | "executive_summary" | ...
  input_tokens int,
  output_tokens int,
  cost_cents int,
  latency_ms int,
  success boolean not null,
  error_message text,
  created_at timestamptz not null default now()
);
create index on llm_calls(org_id, created_at desc);
create index on llm_calls(purpose, created_at desc);

-- ============================================================================
-- FEATURE FLAGS
-- ============================================================================

create table feature_flags (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  enabled_globally boolean default false,
  enabled_for_orgs uuid[] default '{}'::uuid[],
  description text,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- ROW-LEVEL SECURITY
-- ============================================================================

alter table orgs enable row level security;
alter table users enable row level security;
alter table projects enable row level security;
alter table sources enable row level security;
alter table transcripts enable row level security;
alter table chunks enable row level security;
alter table pains enable row level security;
alter table analyses enable row level security;
alter table themes enable row level security;
alter table theme_citations enable row level security;
alter table llm_calls enable row level security;
alter table feature_flags enable row level security;

-- Helper: current user's org_id
create or replace function current_org_id() returns uuid
  language sql stable as $$
    select org_id from users where id = auth.uid()
  $$;

-- Org-isolation policy (member can see/mutate their org's rows)
create policy org_isolation on orgs
  for all using (id = current_org_id()) with check (id = current_org_id());

create policy user_self on users
  for all using (org_id = current_org_id()) with check (org_id = current_org_id());

create policy project_org on projects
  for all using (org_id = current_org_id()) with check (org_id = current_org_id());

create policy source_org on sources
  for all using (org_id = current_org_id()) with check (org_id = current_org_id());

create policy transcript_org on transcripts
  for all using (org_id = current_org_id()) with check (org_id = current_org_id());

create policy chunk_org on chunks
  for all using (org_id = current_org_id()) with check (org_id = current_org_id());

create policy pain_org on pains
  for all using (org_id = current_org_id()) with check (org_id = current_org_id());

create policy analysis_org on analyses
  for all using (org_id = current_org_id()) with check (org_id = current_org_id());

create policy theme_org on themes
  for all using (org_id = current_org_id()) with check (org_id = current_org_id());

create policy theme_citation_org on theme_citations
  for all using (org_id = current_org_id()) with check (org_id = current_org_id());

create policy llm_call_org on llm_calls
  for all using (org_id = current_org_id()) with check (org_id = current_org_id());

-- Public read of shared analyses (anonymous)
create policy public_analysis_read on analyses
  for select using (share_slug is not null);

create policy public_themes_read on themes
  for select using (
    exists (
      select 1 from analyses a
      where a.id = themes.analysis_id and a.share_slug is not null
    )
  );

create policy public_theme_citations_read on theme_citations
  for select using (
    exists (
      select 1 from themes t
      join analyses a on a.id = t.analysis_id
      where t.id = theme_citations.theme_id and a.share_slug is not null
    )
  );

create policy public_chunks_read on chunks
  for select using (
    exists (
      select 1 from theme_citations tc
      join themes t on t.id = tc.theme_id
      join analyses a on a.id = t.analysis_id
      where tc.chunk_id = chunks.id and a.share_slug is not null
    )
  );

-- Feature flags: readable by any authenticated user so UI can branch on them
create policy feature_flags_read on feature_flags
  for select using (auth.role() = 'authenticated');

-- ============================================================================
-- STORAGE — interviews bucket
-- ============================================================================

insert into storage.buckets (id, name, public)
  values ('interviews', 'interviews', false)
  on conflict (id) do nothing;

-- Files live at:  interviews/{org_id}/{source_id}.{ext}
-- This makes RLS trivial: first path segment must equal the user's org_id.
create policy authenticated_uploads on storage.objects
  for insert with check (
    bucket_id = 'interviews'
    and (storage.foldername(name))[1] = current_org_id()::text
  );

create policy org_members_download on storage.objects
  for select using (
    bucket_id = 'interviews'
    and (storage.foldername(name))[1] = current_org_id()::text
  );

create policy org_members_delete on storage.objects
  for delete using (
    bucket_id = 'interviews'
    and (storage.foldername(name))[1] = current_org_id()::text
  );
