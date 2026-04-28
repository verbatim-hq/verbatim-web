### SYSTEM ROLE & DIRECTIVE
You are an elite, world-class full-stack engineer. You write hyper-optimized, strictly typed Next.js 15 App Router code. You do not write placeholders. You output complete, production-ready code. Apply a "Zero-Any" policy.

### CONTEXT: VERBATIM.AI — FEATURE 2: PROJECT NAVIGATOR & UPLOAD ENGINE
We are building the entry point for research management. A user creates a "Project" and then "Uploads" recordings (Sources) into that project.

### TECHNICAL CONSTRAINTS
1.  **Next.js 15 Server Actions**: Use Zod for input validation.
2.  **Supabase RLS**: Apply policies to `projects` and `sources` using `current_org_id()` (retrieved from the JWT via Clerk `userId`).
3.  **Storage Engine**: Private bucket 'interviews'. Access ONLY via signed URLs generated server-side.
4.  **UI Architecture**: Tailwind v4 + shadcn/ui + Framer Motion.
5.  **Fonts**: Functional UI in 'Geist', quotes/headers in 'Instrument Serif'.
6.  **Models**: Pipeline must prepare for Claude Sonnet 4.6 and AssemblyAI Universal-3 Pro.

### IMPLEMENTATION REQUIREMENTS

#### 1. Database & Security (SQL Migration: 0003_projects_and_sources.sql)
Initialize the tables with a "Default Deny" RLS posture:
- `projects`: id (uuid), org_id (text/FK), name (text), description (text), created_at.
- `sources`: id (uuid), project_id (uuid/FK), org_id (text/FK), kind (audio|video), status (text: 'uploading', 'uploaded', 'processing'), storage_path (text), original_filename (text), created_at.
- **Policies**: 
    - `FOR ALL` operations: `WHERE org_id = current_org_id()`.
    - Ensure `source_id` is generated before upload to determine the final storage path.

#### 2. Project Navigator (/projects/page.tsx)
- **State A (Empty)**: A minimal, centered card using Instrument Serif for the prompt: "Start your first customer research project."
- **State B (List)**: A 3-column grid of project cards. Show the project name and the count of uploaded sources. No analytics charts or metrics.
- **Action**: A shadcn/ui Dialog to "Create New Project" (Name + optional Description).

#### 3. Upload Engine (/projects/[id]/page.tsx)
- **The Dropzone Component**: A high-fidelity Framer Motion area. 
    - Hover state: Animate a subtle border glow using `--color-blue`.
    - File constraints: `.mp3, .m4a, .wav, .mp4, .mov`. Max size 500MB.
- **The Upload Logic (Server-Side Signed URLs)**:
    1. `Server Action`: Validate the projectId exists for the user's `org_id`.
    2. `Server Action`: Create a `sources` record with status `uploading`.
    3. `Server Action`: Generate a `createSignedUploadUrl` for the path: `interviews/{org_id}/{source_id}.{extension}` with a 60-second expiry.
    4. `Client`: Perform the direct PUT request to Supabase Storage with a progress bar.
    5. `Server Action`: Update `sources.status` to `uploaded` on completion.

#### 4. The Inngest Pipeline Skeleton
- File: `app/api/inngest/functions.ts`.
- Create a skeleton function `verbatim/source.uploaded` that listens for the `source.uploaded` event.
- After a successful file upload, emit this event using the `inngest.send()` helper.

#### 5. User Experience (Fitts's Law & Polish)
- Every project card and the dropzone must have a minimum 44px hit area.
- Use a "Verbatim Pulse": A subtle Framer Motion indeterminate progress bar at the top of the project detail page during active uploads.

### EXPECTED OUTPUT
1.  Dependencies: `npm install framer-motion zod inngest lucide-react`.
2.  The complete SQL migration script.
3.  Database client helpers (`lib/supabase/client.ts` and `server.ts`).
4.  Server Actions for Project CRUD and Signed URL generation.
5.  The Project Navigator and Project Detail page files with all UI logic.