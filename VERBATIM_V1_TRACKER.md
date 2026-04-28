# VERBATIM.AI — V1 EXECUTION TRACKER

**Current Status:** [ ] IN PROGRESS
**Target Completion:** 4 Weeks

## THE 11 CORE FEATURES (V1 SCOPE)
- [ ] [cite_start]1. Sign up with Google using Clerk with no password required [cite: 55]
- [ ] [cite_start]2. Create a project with a name and optional description [cite: 55]
- [ ] [cite_start]3. Upload interviews via drag-drop (audio, video, transcript), up to 10 at once, max 500MB each [cite: 55, 56]
- [ ] [cite_start]4. Live status per interview with a progress bar showing queued, transcribing, extracting, done, or failed [cite: 56]
- [ ] [cite_start]5. Auto-generated per-interview summary featuring a 3-sentence TL;DR and a list of pain points with timestamps [cite: 56]
- [ ] [cite_start]6. Cross-interview synthesis running clustering across all completed interviews to produce a ranked theme report [cite: 57, 58]
- [ ] [cite_start]7. Citation-perfect audio quotes where every quote opens a Wavesurfer.js player pinned to the exact timestamp [cite: 58, 59]
- [ ] [cite_start]8. Recommendation per theme (Build, Investigate, Monitor, or Ignore) with provided reasoning [cite: 59]
- [ ] [cite_start]9. Shareable public report link (view-only) featuring playable audio quotes and the Verbatim brand watermark [cite: 59]
- [ ] [cite_start]10. Markdown export allowing one-click copy of the full report for external tools [cite: 59, 60]
- [ ] [cite_start]11. Stripe billing integration with 2 free syntheses before hitting a $29/mo Pro paywall [cite: 60]

## LOCKED TECH STACK
- [cite_start]**Framework:** Next.js 15 App Router + strict TypeScript [cite: 68]
- [cite_start]**UI:** Tailwind v4 + shadcn/ui + Framer Motion [cite: 69]
- [cite_start]**Audio Player:** Wavesurfer.js [cite: 69]
- [cite_start]**Auth:** Clerk [cite: 69]
- [cite_start]**Database & Storage:** Supabase Pro with pgvector and Row Level Security [cite: 70]
- [cite_start]**Transcription:** AssemblyAI Universal-2 with speaker diarization [cite: 70, 71]
- [cite_start]**LLM Synthesis:** Claude Sonnet 4.5 via Anthropic API [cite: 72]
- [cite_start]**LLM Extraction:** Claude Haiku 4.5 [cite: 73, 74]
- [cite_start]**Embeddings:** OpenAI text-embedding-3-small [cite: 74, 75]
- [cite_start]**Background Jobs:** Inngest [cite: 76]
- [cite_start]**Payments:** Stripe Checkout and Billing [cite: 76]
- [cite_start]**Deployment:** Vercel [cite: 76]

## STRICT ANTI-GOALS (DO NOT BUILD)
- [cite_start]No team members or multi-user orgs [cite: 64]
- [cite_start]No comments, mentions, or voting [cite: 64]
- [cite_start]No direct Zoom, Fathom, Gong, or Meet integrations [cite: 64]
- [cite_start]No direct push to Notion, Linear, or Jira [cite: 64]
- [cite_start]No PDF exports [cite: 65]
- [cite_start]No semantic search [cite: 65]
- [cite_start]No dashboards, charts, or sentiment graphs [cite: 65]
- [cite_start]No manual tag editing [cite: 65]
- [cite_start]No PRD generation [cite: 65]
- [cite_start]No desktop applications [cite: 65]

## ENGINEERING PRINCIPLES
- [cite_start]TypeScript strict mode is mandatory with zero exceptions [cite: 78, 79]
- [cite_start]Every LLM output must be validated by Zod [cite: 79]
- [cite_start]Supabase Row Level Security must be applied to every table with a default deny [cite: 80]
- [cite_start]All LLM calls must occur server-side [cite: 82]
- [cite_start]All LLM calls must be logged to the database [cite: 83]
- [cite_start]Idempotency by job UUID is required to prevent duplicate retries [cite: 84]
- [cite_start]Storage access requires signed URLs [cite: 84]

- **Transcription:** AssemblyAI Universal-3 Pro with native speaker diarization
- **LLM Synthesis:** Claude Sonnet 4.6 via Anthropic API