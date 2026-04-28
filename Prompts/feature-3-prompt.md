### SYSTEM ROLE & DIRECTIVE
You are an elite, world-class full-stack engineer. You write hyper-optimized, strictly typed Next.js 15 App Router code. You do not write placeholders. You output complete, production-ready code. Apply a "Zero-Any" policy.

### CONTEXT: VERBATIM.AI — FEATURE 3: AUDIO TRANSCRIPTION PIPELINE
We are building the "Brain" of the data ingestion. This pipeline takes a securely uploaded audio/video file and converts it into a high-fidelity, speaker-diarized transcript using AssemblyAI Universal-3 Pro. This transcript is the foundation of our "Citation Moat."

### TECHNICAL CONSTRAINTS
1.  **Transcription Engine**: AssemblyAI (Universal-3 Pro). 
2.  **Job Orchestration**: Inngest (Durable background jobs).
3.  **Diarization**: Mandatory `speaker_labels: true` must be enabled.
4.  **Security**: Access Supabase Storage via signed READ URLs (60-minute expiry) for AssemblyAI ingestion. Background DB writes MUST use `service_role` key to bypass RLS, as Inngest jobs do not have the user's JWT.
5.  **Observability**: Log API start/stop and job IDs for cost and performance tracking.

### IMPLEMENTATION REQUIREMENTS

#### 1. SQL Migration (0004_add_transcript_data.sql)
Update the `sources` table to handle transcription results:
- `transcript_json`: jsonb (to store the full word-level timestamp object from AssemblyAI).
- `assembly_ai_id`: text (index this for webhook lookups).
- `duration`: integer (total length in seconds).
- **RLS**: Keep default-deny. (Remember: Inngest will use the `service_role` key to update this table securely).

#### 2. The AssemblyAI Webhook Route (`app/api/webhooks/assembly/route.ts`)
- Create a strict, Zod-validated POST endpoint to receive completion events from AssemblyAI.
- Upon receiving a `completed` or `error` status, use `inngest.send()` to fire an `assembly.completed` event containing the `assembly_ai_id` and the status.

#### 3. The Inngest Function (`app/api/inngest/functions.ts`)
Implement `verbatim/source.uploaded` using the durable webhook pattern:
- **Step 1: Sign & Send**: 
    - Fetch the `sources` record using `service_role`.
    - Generate a signed read URL for the `storage_path`.
    - Post to AssemblyAI using their official SDK: `model: "universal-3"`, `speaker_labels: true`, and pass the absolute URL to your webhook route in the `webhook_url` parameter.
    - Save the returned `assembly_ai_id` to the `sources` table and update status to 'transcribing'.
- **Step 2: Durable Wait**: 
    - Use `step.waitForEvent('wait-for-assembly', { event: 'assembly.completed', timeout: '1h', match: 'data.assembly_ai_id' })`. This prevents Vercel timeouts.
- **Step 3: Persistence (The Citation Moat)**:
    - Upon resuming, if successful, fetch the full transcript JSON from AssemblyAI.
    - **CRITICAL**: You must extract the `words` array (which contains `start`, `end`, `text`, and `speaker` for every single word) and save this entire structured payload into `sources.transcript_json`. 
    - Update `sources.duration` and set `status` to 'transcribed'.

#### 4. Engineering Standards
- **Zod Validation**: Define a `Zod` schema for the AssemblyAI webhook payload and the final transcript object to guarantee type safety before writing to Postgres.
- **Error Handling**: If AssemblyAI fails or the job times out, update `sources.status` to 'failed'.
- **Strict TS**: Zero `any` types. 

### EXPECTED OUTPUT
1.  `npm install assemblyai`
2.  The `0004_add_transcript_data.sql` migration script.
3.  The Webhook Route (`app/api/webhooks/assembly/route.ts`).
4.  The complete Inngest function code (`app/api/inngest/functions.ts`) utilizing `step.waitForEvent`.
5.  A utility helper `lib/assembly.ts` for strictly-typed API interactions.