### SYSTEM ROLE & DIRECTIVE
You are an elite, world-class full-stack engineer. You write hyper-optimized, strictly typed Next.js 15 App Router code. You do not write placeholders. You output complete, production-ready code. Apply a "Zero-Any" policy.

### CONTEXT: VERBATIM.AI — FEATURE 5: SYNTHESIS REPORT UI & AUDIO ENGINE
We are building the "Magic Moment" of the product. This feature displays the structured synthesis report generated in Feature 4. Every quote in the report is clickable, instantly launching an audio player that plays the exact slice of the customer's voice. 

### TECHNICAL CONSTRAINTS
1.  **Frontend Stack**: Next.js 15 App Router, Tailwind v4, shadcn/ui, Framer Motion.
2.  **Typography**: 'Instrument Serif' for Theme Names, 'Geist' for Descriptions/Quotes.
3.  **Audio Engine**: Wavesurfer.js. **CRITICAL**: Wavesurfer must only be instantiated on the client-side (using `next/dynamic` or dynamic `await import()`) to prevent Next.js SSR crashes.
4.  **Security**: Audio is stored in a private Supabase bucket. The server must generate a Signed Read URL and pass it to the client.

### IMPLEMENTATION REQUIREMENTS

#### 1. Data Fetching & Security (`app/reports/[id]/page.tsx`)
- **Server Component**: Query the `reports` table by ID. Because RLS is active, this inherently scopes to `current_org_id()`. Join with the `sources` table to retrieve `storage_path`.
- **Validation**: Parse `reports.content_json` strictly through `SynthesisReportSchema` (defined in Feature 4) to guarantee type safety on the frontend.
- **The Storage Bridge**: Use the authenticated Supabase server client to generate a `createSignedUrl` for the `sources.storage_path`, valid for 7200 seconds (2 hours). Pass this single URL down to the client wrapper.

#### 2. Global Audio State (`lib/store/audio-store.ts`)
- Implement a lightweight global state manager (Zustand preferred).
- **State Shape**: `{ activeQuoteId: string | null, setActiveQuote: (id: string | null) => void }`.
- **Rule**: Only ONE audio instance can exist or play at a time. When a new quote is played, the global state updates, forcing any currently active citation player to pause and unmount.

#### 3. UI/UX Architecture (`components/reports/report-client.tsx`)
- **Layout**: A centered, distraction-free reading column (`max-w-3xl`) matching Medium's readability.
- **Motion**: Wrap the theme list in a Framer Motion container using `staggerChildren` to elegantly cascade the themes onto the screen on initial load.

#### 4. The Interactive Quote Card (`components/reports/quote-card.tsx`)
- Render the text of the quote and the speaker name.
- Include a clear "Play" button with a minimum 44x44px hit target (Fitts's Law).
- **Active State**: When this quote's ID matches the `activeQuoteId` in the global store, apply a subtle background highlight or border using `--color-blue` to indicate playback.
- **JIT Instantiation**: The `CitationPlayer` component is NOT mounted until the user clicks the Play button.

#### 5. The Citation Player (`components/audio/citation-player.tsx`)
This is the core moat. Implement the precision playback logic:
1.  Upon mounting, show a Framer Motion loading spinner.
2.  Instantiate `WaveSurfer.create()`, load the `signedUrl`, and listen for the `ready` event. Hide spinner when ready.
3.  **Precision Seek**: Calculate the seek position: `quote.start_ms / 1000`. Seek to this timestamp and trigger `play()`.
4.  **Precision Pause**: Attach an `audioprocess` event listener. When the current time hits `quote.end_ms / 1000`, immediately pause the player and clear the `activeQuoteId` global state.
5.  **Cleanup**: Ensure proper cleanup (`wavesurfer.destroy()`) on component unmount to prevent memory leaks and overlapping audio.

### EXPECTED OUTPUT
1.  Dependencies: `npm install wavesurfer.js zustand`.
2.  The Server Page: `app/reports/[id]/page.tsx` with secure data fetching and signed URL generation.
3.  The Global Audio Store: `lib/store/audio-store.ts`.
4.  The UI Components: `report-client.tsx` and `quote-card.tsx`.
5.  The Audio Engine: `citation-player.tsx` with exact millisecond precision logic.