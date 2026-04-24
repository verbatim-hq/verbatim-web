# Contributing to Verbatim.ai

> These rules are not guidelines. They are the foundation. Every PR gets reviewed against this list. Violations block merge.

---

## The 10 non-negotiable engineering principles

*(Source: `VERBATIM_V1_BLUEPRINT.md` §4.3. Same as `Loom__North_Star_Document.pdf` §3.1, with Axiom middleware added.)*

### 1. TypeScript strict. No `any`.
Zero exceptions. `tsconfig.json` is locked to `"strict": true, "noUncheckedIndexedAccess": true, "noImplicitAny": true`. If you need an escape hatch, use `unknown` and narrow with Zod.

### 2. Every LLM output validated by Zod.
On schema fail, auto-retry **once** with a correction prompt that includes the validation error. If retry also fails, log loud to Axiom/Sentry and fail the job — never ship unvalidated LLM JSON to the database or the UI.

### 3. Supabase RLS on every table.
Default deny. `org_id` scope on every query. The service role key is **server-only** — never imported into a client bundle, never exposed to a React component. Use `createServerClient()` in API routes, `createBrowserClient()` in client components.

### 4. All LLM calls server-side.
API keys live in Vercel environment variables only. Never `NEXT_PUBLIC_*` an AI key. Every call to Anthropic, OpenAI, or AssemblyAI happens inside an API route or an Inngest function.

### 5. Log every LLM call.
Write to `llm_calls` table on every call: `model`, `prompt_version`, `purpose`, `input_tokens`, `output_tokens`, `cost_cents`, `latency_ms`, `success`, `org_id`, `user_id`. If you can't attribute cost to a user, you've lost control of the business.

### 6. Idempotency by job UUID.
Every Inngest function keyed by a deterministic UUID. Retries must not duplicate work. Database writes must be upserts, not inserts, when invoked from a retryable job.

### 7. Signed URLs for all storage access.
5-minute expiry for uploads. 1-hour expiry for playback. Never serve files via public buckets. Never proxy bytes through your API — always issue a signed URL and let the browser fetch directly from Supabase Storage.

### 8. Feature flags in DB from day 1.
`feature_flags` table exists from the first migration. Every new feature ships behind a flag. Enable per-org before enabling globally.

### 9. No PII in logs.
Axiom middleware strips emails, names, and raw transcript text before writing structured logs. If you need to debug with real content, use a dev-only trace ID and look up the row manually — never log the content.

### 10. Cost tracking in admin dashboard from commit #1.
`/app/admin` (your email only, env-gated) must show daily active orgs, synthesis jobs run, LLM cost per model per day, and errors by endpoint. **If you can't see per-user cost, stop building until you can.**

---

## Code conventions

- **Imports:** Use `@/` alias for all internal paths. No relative `../../` beyond one level.
- **Server Components by default.** Only add `"use client"` when you need state, effects, or browser APIs.
- **Colocation:** A feature's server action, Zod schema, and UI component live in the same folder when the surface is small. Split only when reuse justifies it.
- **No barrel files** (`index.ts` re-exports). They break tree-shaking and hide the source.
- **Naming:**
  - React components: `PascalCase.tsx`
  - Non-component modules: `kebab-case.ts`
  - Prompts: `prompt-a-extract-pains.v1.0.0.ts` (version in filename)
- **Commits:** Conventional Commits. `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`. One logical change per commit.
- **Branching:** `main` is always deployable. Feature branches named `feat/<short-description>`. PRs are small — if diff > 500 lines of product code, split it.

---

## Prompt engineering rules

Prompts are product, not code. Treat them with more care than any TypeScript file.

1. **Every prompt has a version string** in the filename and inside the prompt text. Log the version on every call.
2. **Never inline a prompt in a function.** Prompts live in `/lib/prompts/v{major}/` as exported constants.
3. **Do not let Claude Code design your prompts.** You write them. Claude may help iterate, but the final wording is a product decision — your product decision.
4. **Every prompt change is a migration.** New prompt = new version number. Old version stays in the repo so historical analyses remain reproducible.
5. **Evaluate before shipping.** Run every prompt change against at least 3 of your validation-phase recordings before merging.

---

## What "done" means

A feature is done when:

- [ ] TypeScript passes with zero errors in strict mode
- [ ] No `any` types (use `unknown` + Zod)
- [ ] Every LLM output validated by Zod
- [ ] RLS policy exists for any new table
- [ ] LLM calls (if any) log to `llm_calls`
- [ ] PostHog event fired on the meaningful user action
- [ ] Sentry sees zero new error classes on the preview deploy
- [ ] Loom recorded for the design-partner feedback loop (if user-facing)
- [ ] README / docs updated if the setup surface changed

If any of these is missing, the feature isn't done. Don't ship it.

---

*Last updated: April 23, 2026 — Day 1 of the v1 build.*
