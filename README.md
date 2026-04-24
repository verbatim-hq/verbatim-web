# Verbatim.ai — Web App

> Customer interviews, synthesized. Upload your interview recordings → get a citation-perfect report with playable audio quotes in under 5 minutes.

**Status:** Day 1 scaffold — Week 1 of the 4-week v1 build plan.
**Companion docs:** `VERBATIM_V1_BLUEPRINT.md`, `Loom__North_Star_Document.pdf` (in the project root, not this repo).

---

## The product in one sentence

> Upload customer interview recordings. In under 5 minutes, get a synthesis report where every theme is backed by playable audio quotes from the exact customers who said them. Share the report with one link.

---

## Stack (locked, do not debate)

| Layer | Choice |
|---|---|
| Framework | Next.js 15 App Router + TypeScript strict |
| UI | Tailwind v4 + shadcn/ui + Framer Motion |
| Audio | Wavesurfer.js |
| Auth | Clerk |
| DB / Storage / pgvector | Supabase Pro |
| Transcription | AssemblyAI Universal-2 + diarization |
| LLM (synthesis) | Claude Sonnet 4.5 (`claude-sonnet-4-5`) |
| LLM (extraction) | Claude Haiku 4.5 (`claude-haiku-4-5`) |
| Embeddings | OpenAI `text-embedding-3-small` |
| Jobs | Inngest |
| Payments | Stripe |
| Email | Resend |
| Deploy | Vercel |
| Analytics / Errors / Logs | PostHog / Sentry / Axiom |

---

## Day-1 setup (what to do right after `git clone`)

```bash
# 1. Install deps
npm install

# 2. Copy env template
cp .env.example .env.local
# Fill in: NEXT_PUBLIC_APP_URL, nothing else required for Day 1

# 3. Run locally
npm run dev
# → http://localhost:3000 should render the signed-out landing shell

# 4. Deploy to Vercel
# - Push to your GitHub org (Verbatim)
# - Import project at vercel.com/new
# - Add custom domain: app.joinverbatim.com (CNAME from Porkbun → cname.vercel-dns.com)
# - No env vars needed yet for Day 1 — that starts Friday
```

At end of Day 1 you should be able to load `https://app.joinverbatim.com` and see the app shell with your brand.

---

## Directory structure (matches the blueprint exactly)

```
verbatim/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # public routes (landing, legal)
│   ├── (app)/                    # auth-gated product routes (Day 3+)
│   │   ├── projects/             # project list + project view
│   │   ├── settings/             # billing, workspace, account
│   │   └── layout.tsx            # app shell
│   ├── r/[slug]/                 # public shareable report route
│   ├── api/                      # API routes (server-only secrets)
│   │   ├── inngest/              # Inngest webhook handler
│   │   ├── webhooks/             # Clerk, Stripe, AssemblyAI webhooks
│   │   └── sources/              # signed URL issuance for uploads
│   ├── layout.tsx                # root layout + fonts
│   └── page.tsx                  # landing (app.joinverbatim.com root)
├── components/
│   ├── ui/                       # shadcn primitives (added via CLI)
│   ├── app/                      # product components (upload, report, player)
│   └── brand/                    # Wordmark, Logo — reused from landing
├── lib/
│   ├── ai/                       # Anthropic + OpenAI + AssemblyAI clients
│   ├── db/                       # Supabase clients (server, browser, service)
│   ├── prompts/
│   │   └── v1/                   # versioned prompts (Prompts A, B, C)
│   ├── schemas/                  # Zod schemas for every LLM output
│   ├── inngest/                  # durable background functions
│   ├── stripe/                   # billing helpers
│   └── utils/                    # cn, formatters, etc.
├── supabase/
│   └── migrations/               # 0001_init.sql (Day 2)
├── types/                        # generated + hand-rolled types
├── public/                       # static assets
├── .env.example                  # ALL env vars documented, no secrets
├── CONTRIBUTING.md               # 10 non-negotiable engineering principles
├── next.config.ts
├── tailwind.config.ts            # brand tokens ported from landing page
├── tsconfig.json                 # strict mode, no `any`
└── package.json
```

---

## The week ahead

- **Thu (today):** This scaffold. Deploy to Vercel on `app.joinverbatim.com`. ✅
- **Fri:** Supabase project + `0001_init.sql` + RLS + audio bucket + Anthropic Startup credits apply.
- **Sat:** Clerk integration. Google OAuth. Post-signup webhook creates org + user + default project.
- **Sun:** Upload UI: drag-drop, progress bar, signed-URL PUT to Supabase Storage.
- **Mon:** Inngest integration. `source.uploaded` → AssemblyAI call → webhook writes transcripts + chunks.
- **Tue:** Project view: list sources with live status.
- **Wed:** First end-to-end smoke test on one of your own recordings. Ship to design partner #1.

Out of scope this week: synthesis, sharing, billing, polish. That's Weeks 2–3.

---

## The 10 non-negotiables

See `CONTRIBUTING.md`. Print it. Pin it above your desk.

---

Built by Dhanush Nangunoori · Waterloo, Ontario · 2026
