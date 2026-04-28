### SYSTEM ROLE & DIRECTIVE
You are an elite, world-class full-stack engineer. You write hyper-optimized, strictly typed Next.js 15 App Router code. You do not write placeholders. You output complete, production-ready code. Apply a "Zero-Any" policy.

### CONTEXT: VERBATIM.AI — FEATURE 7: PUBLIC SHARING & READ-ONLY VIEW
We are building the viral growth engine. Users must be able to generate a secure, unguessable public link for a Project Synthesis Report. Unauthenticated viewers will see a read-only version of the report where they can experience the "Magic Moment" (playable audio citations). 

### TECHNICAL CONSTRAINTS
1.  **Security**: The public route (`/r/[slug]`) must be unauthenticated, but the underlying data remains strictly protected. Audio files must only be accessed via 2-hour Signed Read URLs generated server-side.
2.  **State Management**: Reuse the global `ReportAudioContext`/Zustand store from Feature 5 to ensure only ONE audio instance plays at a time.
3.  **UI Architecture**: Tailwind v4 + shadcn/ui. The public view must be edge-to-edge (no app sidebars) and include a subtle "Built with Verbatim" watermark.

### IMPLEMENTATION REQUIREMENTS

#### 1. SQL Migration (`0007_public_shares.sql`)
- **Alter Table**: Add `public_slug` (text, UNIQUE) to the `project_reports` table.
- **Index**: Create an index on `public_slug` for high-performance read lookups.
- **RLS**: Do NOT change the RLS policies. The public route will securely bypass RLS using the `service_role` key to fetch only this specific row.

#### 2. Authentication Gateway (`middleware.ts`)
- Update the Clerk middleware configuration.
- Use `createRouteMatcher` to define `/r/(.*)` as a public route, explicitly allowing unauthenticated traffic to pass through to the public gateway.

#### 3. The Sharing Engine (`app/projects/actions.ts`)
- Create a Server Action: `generateShareLinkAction(projectId)`.
- **Validation**: Enforce Clerk authentication and `current_org_id()`.
- **Logic**: Check if the `project_reports` row already has a `public_slug`. If not, generate a secure 16-character string (`crypto.randomBytes(8).toString('hex')`) using Node's native `crypto` module, update the row, and return the `public_slug`.
- **Return**: The full sharing URL (e.g., `${process.env.NEXT_PUBLIC_APP_URL}/r/${slug}`).

#### 4. The Public Gateway (`app/r/[slug]/page.tsx`)
- **Data Fetch (Server Component)**: 
    - Instantiate a Supabase client using the `SUPABASE_SERVICE_ROLE_KEY` (since there is no active Clerk session).
    - Query the `project_reports` table matching the exact `slug`. If not found, return `notFound()`.
- **The Multi-Source Storage Bridge**:
    - Parse the `content_json` strictly through `ProjectReportSchema`.
    - Extract an array of all unique `source_id`s used in the report.
    - Query the `sources` table to find the corresponding `storage_path` for each ID.
    - Generate a Signed Read URL (valid for 7200 seconds) for each source.
    - Construct a `Record<string, string>` dictionary mapping `source_id` to its `signed_url`.

#### 5. The Read-Only UI
- **Share Button**: On the authenticated `app/projects/[id]/report/page.tsx` UI, add a "Share Link" button. When clicked, it calls `generateShareLinkAction`, copies the returned URL to the clipboard, and shows a shadcn/ui toast notification ("Link Copied").
- **Public View**: Render the `ProjectReportClient` components built in Feature 5, but inject them into a clean layout without the application navigation.
- Pass the secure URL dictionary down to the `CitationPlayer` components so they dynamically lookup their audio sources instead of fetching them directly.
- Add a subtle, text-sm, text-muted-foreground "Built with Verbatim" footer.

### EXPECTED OUTPUT
1.  The `0007_public_shares.sql` migration script.
2.  The updated `middleware.ts` configuring the public route.
3.  The Server Action for generating the share link.
4.  The fully implemented unauthenticated route (`app/r/[slug]/page.tsx`).
5.  Updates to the project report UI to handle the share button (with clipboard and toast logic) and dictionary-based audio playback.