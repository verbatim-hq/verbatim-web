Verbatim.ai — The v1 Build Blueprint
Working doc for: Dhanush Nangunoori Date: April 23, 2026 Status: Ready to start building (Day
1 of the 90-day plan) Scope: Complete Dovetail teardown (April 2026 product), feature-byfeature Verbatim mapping, MVP architecture, data model, synthesis prompt library, 2–4 week
build plan, cost model, and growth hooks.
This is the companion to Loom__North_Star_Document.pdf (your Founding Architecture Doc
v1.0). That doc covers philosophy. This doc covers what you build this week.
Table of contents
1. Part 1 — Dovetail April 2026, feature-by-feature
2. Part 2 — Feature mapping: what we build, defer, skip
3. Part 3 — Verbatim v1 MVP scope + end-to-end user flow
4. Part 4 — Technical architecture
5. Part 5 — Data model (Supabase schema + RLS)
6. Part 6 — The synthesis pipeline (your actual IP)
7. Part 7 — Cost model & unit economics
8. Part 8 — The 4-week concrete build plan
9. Part 9 — Phased roadmap (v2 → v4)
10. Part 10 — Validation + growth hooks
Part 1 — Dovetail April 2026,feature-by-feature
Dovetail is the market leader and the reference product you're cloning the useful 20% of. Based
on current public documentation, G2/Capterra reviews, their 3.0 launch materials, and their
pricing page, here is the full functional inventory.
| Plan | Published price | What you actually get |
| :--- | :--- | :--- |
| **Free** | $0 | 1 project, 1 channel, basic AI in beta, unlimited beta AI transcription/summarization/chat (as of Aug 2025 pricing update) |
| **Professional** | ~$15→ $49/editor/month (annual) | Unlimited projects, semantic search, core AI, project-level analysis, integrations |
| **Channels add-on** | ~$50/mo base, $500 for +1,000 data points | Feedback ingestion at scale |
| **Enterprise** | Custom, starts ~$600+/mo | SSO, RBAC, advanced security, admin, custom contracts |

1.2 Fullfeature inventory
# Feature Category What it does
1 Upload: audio, video, text, PDF Ingestion Drag-drop orAPI; stored in Dovetail cloud
2 Magic Transcribe Ingestion/AI Auto-transcription, 41 languages, speaker
detection, timestamps
3 Speaker identification/diarization Ingestion/AI "Speaker 1 / Speaker 2" or mapped to names
4 PII redaction (Magic Redact) Ingestion/AI Auto-detects names, emails, phone
numbers in transcripts
5 Highlight reels (Magic Reels) Ingestion/AI Auto-generated video clips of key moments
6 Manual tagging Analysis Click a passage, apply a tag from a custom
taxonomy
7 Tag boards / tag management Analysis Taxonomy editor, hierarchy, colors
8 Magic Summarize Analysis/AI Auto-summary of any source with topics
and key points
9 Magic Cluster Analysis/AI Groups similar highlights into themes
10 Magic Search (semantic) Search Natural-language Q&A over entire
repository with cited answers
11 Themes Analysis Named clusters of highlights with
descriptions
12 Insights Analysis Formal, written-up findings (the
publishable artifact)
# Feature Category What it does
13 Research repository Storage Everything in one place, searchable across
projects
14 Projects & folders Organization Hierarchical org of sources, highlights,
insights
15 Channels Ingestion/AI Real-time feedback classification from
support tickets, reviews, NPS — LLMdriven taxonomy
16 Ask Dovetail (Slack/Teams) Distribution Natural-language Q&A inside team chat
with evidence-backed answers
17 Podcast-style updates Distribution Auto-generated audio summaries of
research activity
18 Insights library / sharing Collaboration Public/private sharing of insights with
stakeholders
19 Recruit (participant panel) Research ops 3M+ participant database, scheduling,
incentives
20 Interactive reports Output Rich-media reports with video clips, quotes,
charts
21 Charts (sentiment, tag frequency) Output Visualizations of tag counts, sentiment over
time
22 Templates Output Pre-built research plan and analysis
templates
23 Export: PDF, CSV, Word, Markdown Output Per-insight or bulk
24 Integrations: Zendesk, Salesforce,
Intercom
Ingestion Pull support tickets, tickets, CRM notes
25 Integrations: Zoom, Google Meet,
Gong
Ingestion Auto-import call recordings
26 Integrations: G2, App Store, Google
Play
Ingestion Review feeds
27 Integrations: Slack, Microsoft
Teams
Distribution Notifications, Ask Dovetail
28 Integrations: Notion, Jira, Linear Output Export insights to PM tools
# Feature Category What it does
29 API (public) Platform Build on top of Dovetail
30 SSO (SAML, SCIM) Security Enterprise identity
31 RBAC
(Manager/Contributor/Viewer)
Security Per-project, per-folder permissions
32 Audit logs Security Enterprise compliance trail
33 SOC 2 Type II, GDPR, HIPAA-ready Compliance Standard enterprise checkboxes
34 Data retention policies Compliance Per-workspace configurable
35 Custom AIinstructions
(workspace-level)
AI Guide Magic features with org context
36 Dashboards Output Configurable real-time signal dashboards

1.3 User reviews reveal where Dovetail actually breaks
From G2/Capterra reviews verified 2025–2026:
AI hallucinations. Looppanel's review and multiple G2 comments: "Dovetail AI features
often create more work than they save with inaccuracies and hallucinations." This is your
opening — citation-perfect, audio-linked quotes are the trust moat.
Reporting UX is clunky. Multiple reviewers build reports in Miro because Dovetail's report
builder is awkward.
PDF processing is weak. Highlighting in PDFs is poor.
Pricing shocks. The jump from Team-era to Business plan was "near 4x" for existing
customers. Reviewers explicitly call out pricing as the main con.
Workspace tag boards locked behind higher tiers. Core research features behind paywalls
that don't make sense for small teams.
Channels data point caps are punishing. Professional gets 250 data points/mo; +1,000
costs $500/month. Any real feedback volume forces Enterprise.
| Feature # | Feature | Verdict | Verbatim angle / reasoning |
| :--- | :--- | :--- | :--- |
| 1 | Upload audio/video/text/PDF | v1 | Core input. Audio, video, text, transcript (SRT/VTT) in v1. PDF deferred to v2 - poor signal/effort |
| 2 | Transcription | v1 | Assembly AI Universal-2 base tier. Non-negotiable |
| 3 | Speaker diarization | v1 | Add-on to Assembly AI. $0.02/hr. Non-negotiable for quote attribution |
| 4 | PII redaction | v2 | Nice for B2B trust; not blocking. Opt-in post-launch |
| 5 | Highlight reels (video) | Skip | Pretty but not PM workflow. Consumer-y feature, expensive to build, low ROI |
| 6 | Manual tagging | Skip in v1, maybe v2 | This is the thing we're replacing. Tagging is the pain. Humans don't tag in Verbatim - Claude does. Keep it AI-first |
| 7 | Tag boards/taxonomy | Skip | Same reason. PMs don't want to maintain a taxonomy |
| 8 | Magic Summarize | v1 | Per-interview summary. Table stakes |
| 9 | Magic Cluster (themes) | v1 | THE product. Cross-interview clustering into themes is the core value |
| 10 | Semantic search | v2 | Ship when you have >1 project worth of data per user. Not essential for first-report magic |
| 11 | Themes | v1 | Output of clustering |
| 12 | Insights (formal writeups) | v1 | Every theme is a pre-written insight card. Shareable as the report |
| 13 | Research repository | v2 | v1 = per-project scope. Cross-project repository is the v2 wedge into retention |
| 14 | Projects & folders | v1 | Projects yes. Folders no (avoid nesting hell) |
| 15 | Channels (feedback firehose) | v3 | Requires integrations ecosystem. Don't fight Kraftful/Enterpret in v1 |
| 16 | Ask Dovetail in Slack | v2 | High-leverage after repository exists |
| 17 | Podcast-style updates | Skip | Gimmick. No PM we talk to will ask for this |
| 18 | Insights library/public sharing | v1 | Your #1 growth hook. Every shared report = branded distribution |
| 19 | Recruit (participant panel) | Skip | Different business. Let UserInterviews/Respondent own it |
| 20 | Interactive reports | v1 | Playable audio quotes inline = the magic moment. Must-have |
| 21 | Charts (sentiment, tag counts) | v2 | Severity frequency ranking is enough for v1 |
| 22 | Templates | v2 | Ship when you have multiple research-type primitives |
| 23 | Export (PDF, Markdown, Notion) | v1 | Markdown + shareable public link in v1. PDF nice-to-have. Notion in v2 |
| 24 | Integrations: Zendesk/Salesforce | v3 | Wrong customer for v1 (larger teams) |
| 25 | Integrations: Zoom/Meet/Gong | v2 | Fathom & Grain first (PM-friendly). Gong is enterprise |
| 26 | Integrations: G2/App reviews | v3 | Feedback firehose territory |
| 27 | Integrations: Slack/Teams | v2 | Notifications first, then Ask Verbatim |
| 28 | Integrations: Notion/Linear | v2 | Notion export v2; Linear ticket gen v3 |
| 29 | Public API | v3 | After PMF and with platform ambition |
| 30 | SSO/SAML/SCIM | v3 | Enterprise only |
| 31 | RBAC | v2 | v1 = org-owner + members. Granular later |
| 32 | Audit logs | v3 | Compliance customers only |
| 33 | SOC2 | v3 | Start Vanta when MRR > $10k |
| 34 | Data retention policy | v1 | Because it's cheap to do right on day 1. "Delete account = delete data in 30 days" |
| 35 | Custom workspace AI instructions | v2 | Retention feature - lets customers tune synthesis to their domain |
| 36 | Dashboards | v3 | Later - this is Enterpret's lane |

Part 3 — Verbatim v1 MVP scope + end-to-end user flow
3.1 The one-sentence v1 spec
"Upload your customer interview recordings.In under 5 minutes, get a synthesis report
where every theme is backed by playable audio quotes from the exact customers who said
them. Share the report with one link."
That's the entire v1. Every feature must serve that sentence or it doesn't ship.

3.2 The 11 v1 features
1. Sign up with Google (Clerk, no password)
2. Create a project (name + optional description)
3. Upload interviews — audio (mp3/m4a/wav), video (mp4/mov), or transcript (txt/vtt/srt).
Drag-drop, up to 10 at once, max 500MB each
4. Live status per interview — queued → transcribing → extracting → done/failed, with
progress bar
5. Auto-generated per-interview summary — 3-sentence TL;DR + list of pain points, each
with a timestamp
6. Cross-interview synthesis — click "Synthesize Project" → Verbatim runs clustering across
all completed interviews → produces a ranked theme report
7. Citation-perfect audio quotes — every quote in every theme is clickable; opens a
lightweight audio player pinned to the exact timestamp; plays the original customer voice
8. "Build vs Investigate vs Monitor vs Ignore" recommendation per theme, with reasoning
9. Shareable public report link — verbatim.ai/r/[slug] , view-only, audio quotes playable,
Verbatim brand watermark
10. Markdown export — one-click copy of the full report for Notion/Linear
11. Billing — Stripe, 2 free syntheses (not 10 — your arch doc was too generous), then $29/mo
Pro (unlimited syntheses, 30 interviews/mo soft cap)

3.3 The golden path (step-by-step screens)
| Step | Screen | User action | System response | Time budget |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Landing (joinverbatim.com) | Clicks "Request access" → redirected to signup | Email captured | 30 sec |
| 2 | /signup | Signs in with Google | Clerk creates user + org + default project | 10 sec |
| 3 | Empty project | Drags 3 interview recordings | Files upload to Supabase Storage via signed URLs | 30-90 sec |
| 4 | Project view | Sees 3 cards: each "transcribing..." with progress | Inngest job kicks off per file | |
| 5 | Project view (2-4 min later) | Sees each card move to "synthesizing..." → "ready" | Per-interview pain extraction complete | 2-4 min |
| 6 | Project view | Clicks "Synthesize all 3" | Cross-interview clustering + theme synthesis | 30-60 sec |
| 7 | Report view | Sees 5-7 themes ranked, each with 3 quotes | Renders markdown report with Wavesurfer.js players | |
| 8 | Report view | Clicks "▶" on a quote | Audio plays from exact timestamp | 1 sec |
| 9 | Report view | Clicks "Share" → copies public link | Link works in incognito, view-only | 5 sec |
| 10 | Paywall (after 2nd synthesis) | Clicks "Upgrade" | Stripe Checkout → $29/mo, back to app | 45 sec |

3.4 What v1 does NOT do (protect this list)
No team members (single-user org only)
No comments / mentions / voting
No Zoom/Fathom/Gong/Meet pull
No Notion/Linear/Jira push (markdown copy only)
No PDF export (markdown + HTML share link only)
No semantic search
No dashboards, no charts, no sentiment graphs
No manual tag editing (Claude's extraction is final; if wrong, re-synthesize)
No PRD generation
No feature requests panel
No mobile app
No desktop app
If a design partner asks for any of these: "it's on the roadmap, here's what's coming next." Don't
commit. Don't build.

Part 4 — Technical architecture
| Layer | Choice | Why (The Merged Bible Upgrades) |
| :--- | :--- | :--- |
| Framework | Next.js 15 App Router + TS strict | Claude Code fluent; Vercel-native |
| UI | Tailwind v4 + shadcn/ui + Framer Motion | Your landing already uses Instrument Serif + Geist extend that system |
| Audio player | Wavesurfer.js | Waveform rendering + click-to-seek at ms precision |
| Auth | Clerk | Worth the $25/mo early. Google OAuth in 5 minutes |
| DB + Storage | Supabase (Pro, $25/mo) | RLS is your security foundation |
| **Transcription (UPGRADED)** | **AssemblyAI Universal-3 Pro** | **CRITICAL UPGRADE: Drops Word Error Rate to 5.6% and includes native diarization to protect the citation loop.** |
| **LLM: Synthesis (UPGRADED)**| **Claude Sonnet 4.6 via Anthropic** | **CRITICAL UPGRADE: 97% JSON schema adherence at the same cost. Drastically reduces API retry loops.** |
| **LLM: Extraction** | **Claude Haiku 4.5** | Fast, high-volume pain point extraction. Best cost-to-performance ratio for JSON. |
| Embeddings | OpenAI text-embedding-3-small | $0.02/M tokens. 1536-dim, plays well with pgvector |
| Background jobs | Inngest | Durable functions, no infra, great DX |
| Payments | Stripe Checkout + Billing | Only sane choice |
| Deploy / Domain | Vercel / joinverbatim.com | Next.js native, preview deploys per PR |

4.2 Architecture diagram
Stripe
External AI services
Inngest (durable async)
Supabase (Postgres +
Storage + pgvector)
Identity Vercel Edge
Browser (Next.js 15 App Router)
signed URL upload
auth requests data fetch
enqueue
webhook
validated JSON
click Synthesize
themes + citations
signed URL + range
UI: shadcn + Tailwind + Framer Wavesurfer.js audio player
API routes (Next.js)
Rate-limit middleware
Clerk Auth
Postgres with RLS
Storage buckets audio/video/transcripts pgvector
transcribe.requested
chunks.ready
interview.extract project.synthesize
AssemblyAI
transcription + diarization
Claude Sonnet 4.5
clustering + theme
synthesis
Claude Haiku 4.5 pain extraction + JSON
coding
OpenAI embeddings
text-embedding-3-small
Checkout + Billing Portal

4.3 Engineering principles (non-negotiable, copy to CONTRIBUTING.md )
1. TypeScript strict. No any . Zero exceptions.
2. Every LLM output validated by Zod. On schema fail, auto-retry once with a correction
prompt. Log and fail loud after retry.
3. Supabase RLS on every table. Default deny. org_id scope on every query. Service role
key server-only, never in client bundle.
4. All LLM calls server-side. API keys in Vercel environment variables.
5. Log every LLM call to llm_calls table: model, prompt version, tokens in/out, cost in
cents, latency, success, org_id, user_id, purpose.
6. Idempotency by job UUID. Retries must not duplicate.
7. Signed URLs for all storage access, 5-min expiry for uploads, 1-hr for playback.
8. Feature flags in DB from day 1. Ship behind flags, enable per-org.
9. No PIIin logs. Redact emails, names. Axiom middleware strips before writing.
10. Cost tracking in admin dashboard from commit #1. If you can't see per-user cost, stop
building until you can.

Part 5 — Data model (Supabase schema + RLS)
This refines the schema in your North Star doc. Copy into
supabase/migrations/0001_init.sql .
sql
-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "vector";
-- Tenancy
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
id uuid primary key, -- matches Clerk user id
org_id uuid not null references orgs(id) on delete cascade,
email text unique not null,
name text,
role text not null default 'owner' check (role in ('owner','member')),
created_at timestamptz not null default now()
);
create index on users(org_id);
-- Core domain
create table projects (
id uuid primary key default uuid_generate_v4(),
org_id uuid not null references orgs(id) on delete cascade,
name text not null,
description text,
share_slug text unique, -- for public /r/[slug]
created_at timestamptz not null default now(),
deleted_at timestamptz
);
create index on projects(org_id);
create table sources ( -- an uploaded interview
id uuid primary key default uuid_generate_v4(),
project_id uuid not null references projects(id) on delete cascade,
org_id uuid not null references orgs(id) on delete cascade, -- denormalized for f
kind text not null check (kind in ('audio','video','transcript_text','transcript_v
original_filename text not null,
storage_path text not null, -- bucket/path
duration_seconds int,
language text default 'en',
participant_label text, -- user-provided; "Founder, fintech"
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
create table chunks ( -- one per speaker turn
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
create index on chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100
-- Per-interview extraction
create table pains ( -- each discrete pain point extracted from one interview
id uuid primary key default uuid_generate_v4(),
source_id uuid not null references sources(id) on delete cascade,
org_id uuid not null references orgs(id) on delete cascade,
description text not null, -- paraphrased pain in Claude's words
severity int not null check (severity between 1 and 5),
supporting_chunk_id uuid not null references chunks(id),
verbatim_quote text not null, -- exact substring of chunk.text
context text,
embedding vector(1536), -- for clustering
created_at timestamptz not null default now()
);
create index on pains(source_id);
create index on pains using ivfflat (embedding vector_cosine_ops) with (lists = 50);
-- Analysis outputs
create table analyses ( -- one per "Synthesize Project" run
id uuid primary key default uuid_generate_v4(),
project_id uuid not null references projects(id) on delete cascade,
org_id uuid not null references orgs(id) on delete cascade,
prompt_version text not null,
model text not null,
status text not null default 'running' check (status in ('running','done','failed'
source_ids uuid[] not null,
summary_markdown text,
total_cost_cents int default 0,
latency_ms int,
share_slug text unique, -- per-analysis share link
created_at timestamptz not null default now(),
completed_at timestamptz
);
create index on analyses(project_id);
create table themes (
id uuid primary key default uuid_generate_v4(),
analysis_id uuid not null references analyses(id) on delete cascade,
org_id uuid not null references orgs(id) on delete cascade,
rank int not null,
title text not null,
description text not null,
severity int not null check (severity between 1 and 5),
frequency int not null, -- number of distinct interviews
contradiction_flag boolean default false,
recommendation text not null check (recommendation in
('build_now','investigate','monitor','ignore')),
recommendation_reasoning text,
created_at timestamptz not null default now()
);
create index on themes(analysis_id, rank);
create table theme_citations ( -- links themes to the exact chunks that prove them
id uuid primary key default uuid_generate_v4(),
theme_id uuid not null references themes(id) on delete cascade,
pain_id uuid not null references pains(id),
chunk_id uuid not null references chunks(id),
org_id uuid not null references orgs(id) on delete cascade,
relevance_score real,
display_order int
);
create index on theme_citations(theme_id, display_order);
-- Cost + observability
create table llm_calls (
id uuid primary key default uuid_generate_v4(),
org_id uuid references orgs(id) on delete set null,
user_id uuid,
model text not null,
prompt_version text,
purpose text not null, -- 'extract_pains' | 'cluster_themes' | 'synthesize_theme'
input_tokens int,
output_tokens int,
cost_cents int,
latency_ms int,
success boolean not null,
error text,
created_at timestamptz not null default now()
);
create index on llm_calls(org_id, created_at desc);
create index on llm_calls(purpose, created_at desc);
-- Feature flags
create table feature_flags (
id uuid primary key default uuid_generate_v4(),
key text unique not null,
enabled_globally boolean default false,
enabled_for_orgs uuid[] default '{}'::uuid[]
);
-- RLS: apply to every org-scoped table
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
Store audio files as interviews/{org_id}/{source_id}.{ext} . Makes RLS trivial.
Part 6 — The synthesis pipeline (your actualIP)
This is where 80% of product value comes from. Do NOT let Claude Code design the prompts.
You write them, you iterate on them, you version them, and you evaluate them against your own
interview recordings from the validation phase.
alter table llm_calls enable row level security;
-- Helper: current user's org
create or replace function current_org_id() returns uuid
language sql stable as $$
select org_id from users where id = auth.uid()
$$;
-- Policy template (repeat for each table)
create policy org_isolation on projects
for all using (org_id = current_org_id())
with check (org_id = current_org_id());
-- ...repeat for sources, transcripts, chunks, pains, analyses, themes, theme_citati
-- Public share: anonymous read of analyses by share_slug
create policy public_analysis_read on analyses
for select using (share_slug is not null);
create policy public_themes_read on themes
for select using (
exists (select 1 from analyses a
where a.id = themes.analysis_id and a.share_slug is not null)
);
-- Similar for theme_citations and chunks referenced by a public analysis
-- Storage bucket for audio
insert into storage.buckets (id, name, public) values ('interviews', 'interviews', f
create policy authenticated_uploads on storage.objects for insert
with check (bucket_id = 'interviews' and (storage.foldername(name))[1] = current_o
create policy org_members_download on storage.objects for select
using (bucket_id = 'interviews' and (storage.foldername(name))[1] = current_org_id

6.1 Pipeline overview
User API route Inngest Storage AssemblyAI Haiku 4.5 Embeddings Sonnet 4.5 Postgres
User API route Inngest Storage AssemblyAI Haiku 4.5 Embeddings Sonnet 4.5 Postgres
source.status = 'done'
if citation invalid → reject, retry once
POST /sources (signed URL)
PUT audio file
emit source.uploaded
submit transcription (speaker_labels=true)
webhook: transcript ready
write transcripts + chunks
embed chunks (batch)
chunks.embedding
extract pains per chunk window (structured JSON)
pains
embed pain descriptions
pains.embedding
POST /projects/:id/synthesize
emit project.synthesize
fetch all pains for project
cluster via pgvector cosine similarity (greedy, threshold 0.78)
synthesize theme per cluster (structured JSON + citation refs)
theme JSON with chunk_id references
verify every cited chunk_id exists and quote is substring
write themes, theme_citations
assemble summary_markdown
analysis.ready

6.2 Version-controlled prompts (starter set — v1.0.0 )
Store these in /app/lib/prompts/v1/ . Every prompt gets a version string. Log the version on
every call.
Prompt A — Per-interview pain extraction (Haiku 4.5)
Validation: Zod. If verbatim_quote is not a substring of the chunk's text, reject and retry once
with error feedback.
Prompt B — Theme synthesis (Sonnet 4.5)
You are a product research analyst. Analyze one customer interview transcript and
extract every distinct pain point, frustration, or unmet need the participant
expresses.
Rules:
1. Only extract pains the PARTICIPANT states (not the interviewer). Use the
speaker labels to distinguish.
2. For each pain, provide the verbatim supporting quote exactly as it appears
in the transcript — do not paraphrase or combine quotes.
3. For each quote, provide the chunk_id from the input (you will be given
chunks with ids).
4. If the same pain is mentioned multiple times, extract it once and cite the
strongest single quote.
5. Severity scale:
1 = mild irritation, workaround exists
2 = consistent friction, slows work
3 = notable pain, actively seeking workarounds
4 = blocking, abandons or complains frequently
5 = deal-breaker, would switch tools / churned over this
6. Return ONLY valid JSON matching the schema. No prose, no markdown.
Output schema:
{
"pains": [
{
"description": string, // 1-sentence paraphrase of the pain in your
words
"severity": 1|2|3|4|5,
"supporting_chunk_id": string, // UUID from input
"verbatim_quote": string, // EXACT substring of the chunk's text
"context": string // 1 sentence: what was happening when they
said this
}
]
}
Interview chunks:
<<<CHUNKS>>>
You are a senior product strategist synthesizing findings across customer
interviews. You are given a CLUSTER of related pain points extracted from
different interviews.
Your job: produce ONE coherent theme that represents this cluster.
Rules:
1. The theme title must be a complete sentence describing the problem,
not a category label. Good: "Onboarding stalls because data import feels
risky." Bad: "Onboarding issues."
2. Description: 2-3 sentences. State the problem, its shape, and the context
in which it appears.
3. Severity = max of severities in cluster, weighted by how universally it's
expressed. If one participant rates 5 but others 2, severity = 3.
4. Frequency = count of DISTINCT source_ids represented in the cluster.
5. Select the 3 most illustrative verbatim quotes. They must come from
DIFFERENT interviews. Use the pain_id and chunk_id from the input —
do not rewrite quotes.
6. Flag contradictions: if different participants contradict each other on
this pain (e.g., "too much X" vs "not enough X"), set contradiction_flag
= true and note it in the description.
7. Recommendation:
- build_now: severity ≥ 4 AND frequency ≥ 3
- investigate: severity ≥ 3 AND frequency ≥ 2
- monitor: severity ≤ 2 OR frequency = 1
- ignore: severity = 1 AND no contradiction signal
Provide 1-sentence reasoning.
8. Return ONLY valid JSON.
Output schema:
{
"title": string,
"description": string,
"severity": 1|2|3|4|5,
"frequency": number,
"contradiction_flag": boolean,
"recommendation": "build_now"|"investigate"|"monitor"|"ignore",
"recommendation_reasoning": string,
"citations": [
{"pain_id": string, "chunk_id": string, "display_order": 1|2|3}
]
}
Cluster of pains:
<<<CLUSTER>>>
Prompt C — Executive summary assembly (Sonnet 4.5, cached system prompt)
After all themes are synthesized, a final pass generates the markdown report:

6.3 Clustering (v1 = simple, v2 = HDBSCAN)
For v1 use greedy cosine clustering on pains.embedding :
Source metadata (for distinctness check):
<<<SOURCES>>>
You are producing an executive synthesis report from {N} customer interviews.
You are given the ranked list of themes already synthesized.
Write a report in this exact markdown structure:
# Customer Synthesis Report
*{N} interviews · Generated by Verbatim*
## What you should build next
[2-3 sentences. The single most actionable recommendation based on severity ×
frequency.]
## Top themes
[Render each theme as an H3, preserving title, description, and all citations.]
## Contradictions to investigate
[Any themes with contradiction_flag=true, listed with one-line summary.]
## What we didn't hear
[Topics you would have expected in this segment but were absent. 2-3 bullets. Be
specific.]
Rules:
- Do not fabricate quotes. Every citation in the output must reference a real
chunk_id.
- Keep total length under 1500 words.
- Speak like a senior PM, not a researcher. Crisp. Decision-oriented.
Themes (ranked):
<<<THEMES>>>
typescript
Tune the threshold against real interviews. 0.78 is a starting guess.

6.4 The citation verification loop (your moat)
After Sonnet 4.5 returns theme JSON, before writing to DB:
If any check fails: retry the synthesis once with the specific error included in the prompt. If it fails
again, drop that citation (never silently substitute). Log as a synthesis failure for prompt tuning.
This is the one thing that separates you from Dovetail's Magic AI hallucinations. Don't
compromise on it.
Part 7 — Cost model & unit economics
Numbers below are for one 60-minute interview end-to-end.
 
// Pseudo-code
const CLUSTER_THRESHOLD = 0.78; // tune on your own data
const clusters: Pain[][] = [];
for (const pain of allPains) {
let placed = false;
for (const cluster of clusters) {
const centroid = mean(cluster.map(p => p.embedding));
if (cosineSim(pain.embedding, centroid) >= CLUSTER_THRESHOLD) {
cluster.push(pain);
placed = true;
break;
}
}
if (!placed) clusters.push([pain]);
}
// Drop singleton clusters unless severity >= 4 (high-severity outliers matter)
const themeCandidates = clusters.filter(c => c.length >= 2 || max(c, p => p.severity
typescript
for (const citation of theme.citations) {
const chunk = await db.chunks.findById(citation.chunk_id);
if (!chunk) throw new CitationError('chunk_id not found');
const pain = await db.pains.findById(citation.pain_id);
if (!pain) throw new CitationError('pain_id not found');
if (!chunk.text.includes(pain.verbatim_quote)) {
throw new CitationError('quote is not a substring of chunk');
}
}

7.1 Per-interview cost breakdown
| Provider Step | Calculation | Cost |
| :--- | :--- | :--- |
| **AssemblyAI Universal-3 Pro** | 1 hr base transcription + native diarization | ~$0.170 |
| Chunk embedding OpenAI | ~12k tokens × $0.02/M | $0.0002 |
| Pain extraction Haiku 4.5 | 13k input + 2k output → 13×$1/M + 2x$5/M | $0.023 |
| Pain embedding OpenAI | ~2k tokens x $0.02/M | ~$0.00 |
| **Per-interview subtotal** | | **~$0.193** |
| **Synthesis (Sonnet 4.6)** | 20k input + 5k output × 7 themes / 8 interviews | ~$0.040 |
| Executive summary (Sonnet 4.6)| 8k input + 2k output / 8 | ~$0.005 |
| **Total amortized per interview**| **With upgraded Sonnet 4.6 + Universal-3 Pro** | **~$0.24** |

7.2 Per-user per-month
User profile Interviews/mo Monthly COGS Price Gross margin
Light Pro user 10 $2.40 $29 91%
Typical Pro user 20 $4.80 $29 83%
Heavy Pro user 30 (soft cap) $7.20 $29 75%
Free trial (2 syntheses, ~8 interviews) 8 one-time $1.92 $0 -$1.92 CAC
This clears your $3/user/month ceiling even at the heavy-user tier. Your North Star doc's math
works with real 2026 prices.

7.3 Fixed monthly infrastructure (at 0–500 users)
Service Cost Notes
Vercel Pro $20/mo $0 on Hobby if you're the only user initially; move to Pro before
100k req/mo
Service Cost Notes
Supabase Pro $25/mo Includes 8GB DB, 100GB bandwidth, 8GB storage (extend as
needed)
Clerk Pro $25/mo Free up to 10k MAU on their free tier — defer to $0 for first 3
months
Inngest $0 Free tier: 50k runs/mo. Plenty for 500 users
Resend $0 Free tier: 3k emails/mo
Sentry $0 Free tier: 5k errors/mo
PostHog $0 Free tier: 1M events/mo
Axiom $0 Free tier: 500GB ingest
Domain / DNS $0 Already owned via Porkbun
Infrastructure
fixed
~$45–
70/mo
Scales linearly past 500 MAU

7.4 Break-even math
Fixed cost: ~$70/mo
Variable cost per Pro user (avg 20 interviews): $4.80
Revenue per Pro user: $29
Contribution margin: $24.20/user
Break-even: 3 Pro users
You're profitable at 3 paying users. The $435 MRR / 15-user goal in your North Star doc crosses
break-even on day 1 and generates $290/mo profit.

7.5 The two cost levers that matter most
1. Prompt caching on Sonnet 4.5 for the theme synthesis system prompt. The system
prompt is ~2k tokens and is identical across every theme synthesis call. Cache write is 1.25×
base, cache read is 0.1× base. After the first synthesis in a project, subsequent themes save
90% on the 2k cached tokens. Small per call, meaningful at scale.
2. Batch APIfor non-urgent re-synthesis. When a user uploads 1 new interview to a 15-
interview project and wants to refresh the report: if they're willing to wait 4 hours, use
Batch API at 50% off. Ship as "Premium synthesis (3 min) vs Eco synthesis (a few hours,
cheaper)" in v2.

Part 8 — The 4-week concrete build plan
#### Week 1: Foundation
| Day | Task | Deliverable |
| :--- | :--- | :--- |
| Thu | Scaffold Next.js 15 app, TS strict, Tailwind, shadcn, push to GitHub, deploy to Vercel with app.joinverbatim.com subdomain | App loads at staging URL |
| Fri | Supabase project. Run 0001_init.sql. RLS policies live. Audio bucket live. Apply for Anthropic Startup credits | Schema deployed, credits applied |
| Sat | Clerk integration. Google OAuth. Post-signup webhook creates org + user + default project. Protected routes | Can sign up / sign out |
| Sun | Upload UI: drag-drop, progress, signed-URL PUT to Supabase Storage | Files appear in bucket |
| Mon | Inngest integration. source.uploaded → Assembly AI call (async) → webhook handler writes transcripts + chunks | First interview end-to-end transcribed |
| Tue | Basic project view: list sources with status | Can see "transcribing → done" |
| Wed | First end-to-end smoke test with one of your own recordings. Deploy to staging. Ship to design partner #1 | Internal dogfood working |

#### Week 2: The Synthesis Pipeline
| Day | Task | Deliverable |
| :--- | :--- | :--- |
| Thu | Chunk embeddings pipeline. Inngest job: chunks → OpenAI → pgvector | Chunks embedded on ingest |
| Fri | Pain extraction (Haiku 4.5, Prompt A v1.0.0). Zod validation. Retry-on-fail | Pains written to DB |
| Sat | Embed pains. Clustering function (greedy cosine, threshold 0.78) | Pains clustered |
| Sun-Wed | Theme synthesis (Sonnet 4.5, Prompt B v1.0.0). Citation verification loop. Executive summary (Prompt C). Assemble analyses.summary_markdown. UI: markdown render + Wavesurfer.js per-quote player. Iterate prompts against your own recordings. | Themes with verified citations. Full report markdown in DB. Playable quotes! Synthesis passes on real data. |

#### Week 3: Share & Pay
| Day | Task | Deliverable |
| :--- | :--- | :--- |
| Thu | Public share route (/r/[slug]). RLS policy for anonymous read. Remove auth gate on shared view | Reports shareable |
| Fri | Report styling: match landing page aesthetic. Watermark "Made with Verbatim" | Shareable reports look beautiful |
| Sat | Markdown copy button. "Copy for Notion" formatting | One-click copy works |
| Sun | Stripe Checkout integration. orgs.plan | Test-mode payments |
| Mon | Paywall: after 2nd synthesis, block with upgrade CTA. Billing portal | Free → paid flow |
| Tue | Admin dashboard (internal, your email only): daily active orgs, synthesis count, LLM cost, errors | You can see what's happening |
| Wed | Rate limits, error boundaries, Sentry wired, PostHog events. Turn on production | Ready for real users |

#### Week 4: Design Partner Onboarding
| Day | Task | Deliverable |
| :--- | :--- | :--- |
| Thu | Onboard design partner #1 (one of your validated "yes I'd pay" PMs). 30-min onboarding call | 1 active user |
| Fri | Ship whatever #1 flagged most | Feedback loop running |
| Sat | Onboard design partners #2 and #3 | 3 active users |
| Sun | Ship the next weekly iteration | First improvement cycle complete |
| Mon | Cold email 50 new PMs with a 30-second Loom of a real synthesis report (yours, redacted) | Pipeline full |
| Tue | First 10 new signups from outreach | Validating the top of funnel |
| Wed | Retro with yourself. What slowed you down? What's worth it? What must change for Week 5? | Written retro in Notion |

Part 9 — Phased roadmap (v2 → v4)
Each feature must hit ≥2 of the Four Ongoing Values: (R)evenue, (T)ime saved, (D)efensibility,
(L)ock-in.
v2 (Months 4–9): The always-on brain
Feature R T D L Ship priority
Fathom / Grain native import ✓ ✓ — — 1st
Cross-project semantic search — ✓ ✓ ✓ 2nd
Notion export (native sync, not markdown copy) — ✓ — ✓ 3rd
Zoom Cloud recording import ✓ ✓ — — 4th
Feature R T D L Ship priority
Team plan ($99/mo, 3 seats) with comment/react ✓ ✓ — ✓ 5th
Custom AI workspace instructions — ✓ ✓ ✓ 6th
PII redaction (opt-in per org) ✓ — ✓ — 7th
PDF source type — ✓ — — 8th
Team needed: you + 1 full-stack engineer + 1 part-time designer (fractional). This is when you
raise.
v3 (Months 10–18): Close the loop
Feature Why
PRD generator from themes Core expansion into the "what to build" adjacency
Linear / Jira ticket generation Direct handoff to coding agents
Claude Code / Cursor extension "Export theme as repo task list" — directly feeds the YC
thesis
Slack "Ask Verbatim" bot Distribution inside the customer's workflow
Always-on channels (support tickets,
reviews)
Pushes you against Enterpret/Kraftful
SOC 2 Type II Unlocks enterprise deals
SSO (SAML) Enterprise gating feature
v4+: The product intelligence platform
Usage data ingestion, competitive intel, decision-memory search across all your customer
history. This is where Verbatim becomes a durable company.
Part 10 — Validation + growth hooks

10.1 Built into v1 from day 1
Hook Mechanism Why it compounds
Shareable
reports
Public link /r/[slug] with branded
watermark
Every report shared = free
distribution. Target: 40%+ of
synthesized reports get shared
Markdown copy "Copy for Notion" button PMs paste into team Notion → other
PMs on the team see "Made with
Verbatim"
Email signature
line
Reports include "Synthesized in 4 minutes
from 9 interviews at verbatim.ai"
Same viral property, passive
Referral credit "Invite a PM, both get a free month of Pro"
— defer to v1.1
Compounds once initial cohort is
active
Public
methodology
page
/methodology — explain the citation
verification loop, the prompt chain, the
trust model
Trust moat. Researchers respect
transparency

10.2 Distribution channels (ranked by your segment fit)
1. Twitter/X PM community — Lenny, Aakash, Shreyas audiences. Share synthesis examples
weekly
2. Indie Hackers + Hacker News — "Show HN: I built Dovetail in a weekend for 1/10th the
price"
3. r/ProductManagement — 300k subscribers. Post a candid teardown of your own product
research workflow
4. Lenny's Newsletter community Slack — where seed/A PMs actually live
5. Product Hunt Tuesday launch — aim for top 5
6. YC Startup School community — your ICP
7. Comparison SEO — "Verbatim vs Dovetail", "Verbatim vs Looppanel", "Dovetail
alternative for startups"
8. Waterloo / Toronto startup scene — Communitech, MaRS, Velocity. Local credibility
before global
9. Claude showcase / Anthropic community — you're a great case study forAnthropic's
startup program

10.3 Validation loop (do this every week,forever)
Every Monday 9am (block your calendar now):
1. Call 3 PMs in your ICP. Any 3.
2. Ask one question: "walk me through your last customer interview synthesis." Don't pitch.
3. At the end, if it's a fit, ask if they'd like to try Verbatim.
4. Write down 3 quotes in /notion/Customer Interviews/ .
5. At 9am Friday, read the week's quotes out loud. What pattern emerges?
If you skip this for more than 1 week, something is wrong. Fix that first.
Closing: The one thing that makes this win
Dovetail is beatable because they have three structural weaknesses:
1. Per-seat pricing punishes the ICP we're targeting (small teams).
2. TheirAI hallucinates and reviewers say so publicly.
3. They serve researchers, not PMs — wrong UX, wrong workflow shape.
You win by being the opposite of all three: flat affordable pricing, citation-perfect trust through
audio verification, PM-shaped workflow (upload → report → share).
Don't overbuild. Don't wait. The 11 features on your v1 list are enough to win the wedge.
Everything past that is earned by shipping the wedge first.
End of blueprint. Print it. Pin it. Ship it.