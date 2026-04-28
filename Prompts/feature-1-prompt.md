[CERTIFIED WORLD-CLASS IMPLEMENTATION PROMPT]

# SYSTEM ROLE & DIRECTIVE
You are an elite, world-class full-stack engineer. You write hyper-optimized, strictly typed Next.js 15 App Router code. You do not hallucinate features. You do not write placeholders. You output complete, production-ready code.

# CONTEXT: VERBATIM.AI FOUNDATION
We are building Verbatim.ai, a citation-perfect customer interview synthesis tool for single-user PM teams. 
We are implementing Feature 1: Foundation Scaffolding, Clerk Authentication, and the Supabase User-Creation Webhook.

# TECHNICAL CONSTRAINTS (NON-NEGOTIABLE)
1. Next.js 15 App Router with strict TypeScript. Zero `any` types permitted.
2. Tailwind v4 + shadcn/ui. The app is DARK MODE ONLY.
3. Supabase Pro for PostgreSQL.
4. Clerk for Auth. GOOGLE OAUTH ONLY (No passwords).

# IMPLEMENTATION REQUIREMENTS

## 1. Frontend Scaffolding & Design System
Initialize the Next.js layout and global CSS with our exact design constraints:
- **Typography:** Configure `next/font/google` for `Geist` (default UI), `Geist Mono` (timestamps/metadata). Configure `next/font/google` for `Instrument Serif` (strictly italic, 18px) to be available for quotes later.
- **Colors:** Initialize a dark-mode only CSS variable setup. Include `--color-blue` (for audio moat) and `--color-orange` (accent).
- **Fitts's Law:** Ensure global CSS enforces a minimum 40x40px touch target for all buttons/links.

## 2. Clerk Authentication (Google OAuth Only)
- Install and configure Clerk for Next.js 15.
- Create the `/sign-in` route. Design a minimalist, premium sign-in page using shadcn/ui that ONLY offers "Continue with Google".
- Configure `middleware.ts` to protect all routes except `/sign-in`, `/api/webhooks/clerk`, and the landing page.

## 3. Supabase Database Schema (Single-User Org Model)
Output the exact PostgreSQL SQL migration script to create the foundational tables. 
The schema MUST enforce Single-User Organizations:
- Table `orgs`: `id` (uuid, PK), `name` (text), `created_at`.
- Table `users`: `id` (uuid, PK, maps to Clerk user_id), `org_id` (uuid, FK to orgs), `email` (text), `created_at`.
- Table `projects`: `id` (uuid, PK), `org_id` (uuid, FK to orgs), `name` (text), `created_at`.
- **Security:** Enable Row Level Security (RLS) on all three tables with a DEFAULT DENY policy. Do not write complex access policies yet; just lock them down.

## 4. The Clerk Webhook (Server-Side Execution)
Create the API route: `/app/api/webhooks/clerk/route.ts`.
When Clerk fires a `user.created` event, this webhook must:
1. Rigidly verify the incoming webhook signature using the `svix` library and the `CLERK_WEBHOOK_SECRET` environment variable.
2. Use `zod` to strictly parse and validate the incoming webhook payload. Extract the user's `id`, `email_addresses[0].email_address`, and `first_name`.
3. Initialize the `@supabase/supabase-js` client using the `SUPABASE_SERVICE_ROLE_KEY`. *You must use the Service Role Key to bypass the default-deny RLS for this initial creation step.*
4. Execute an atomic transaction (via Supabase RPC or guaranteed atomic batching) to:
   - Create a new record in `orgs` (Name: "[First Name]'s Org").
   - Create a new record in `users` (Mapping Clerk `id` to the new `org_id`).
   - Create a default record in `projects` (Name: "First Project" linked to `org_id`).
5. Handle errors gracefully and return strict 200/400 HTTP responses.

# EXPECTED OUTPUT
Do not explain what Next.js or Clerk is. Output the exact:
1. Terminal commands to install required dependencies (`svix`, `zod`, `@supabase/supabase-js`, `@clerk/nextjs`, etc.).
2. The raw SQL migration script for Supabase.
3. The complete `middleware.ts` file.
4. The complete layout and sign-in page React components.
5. The complete, strictly-typed webhook route handler (`route.ts`).
6. A list of exactly which `.env.local` keys I need to provide.