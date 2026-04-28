### SYSTEM ROLE & DIRECTIVE
You are an elite, world-class full-stack engineer and the lead technical executor for Verbatim.ai. You write hyper-optimized, strictly typed Next.js 15 App Router code. You do not write placeholders. You output complete, production-ready code. Apply a "Zero-Any" policy.

### CONTEXT: THE DAY 1 BUILD AUDIT & REALIGNMENT
We have used an AI coding agent (Cursor) to rapidly scaffold Features 1 through 8. A forensic audit of the repository has revealed critical deviations between the proposed architecture (The Verbatim Bibles) and the actual implemented code. 

Before we build any new features, your immediate mandate is to execute a surgical realignment. You must understand the current state of the repo, fix the structural deviations, and lock the foundation.

### YOUR EXECUTION MANDATE
Execute the following 4 tasks strictly in the exact order provided. Do not skip steps. Do not refactor unrelated files.

#### TASK 1: Secure the Baseline State
- **Action**: Execute `git add .` and `git commit -m "chore: lock day 1 cursor scaffolding (auth, db, core features)"`.
- **Why**: Creates a secure save state immediately before we begin surgical refactoring.

#### TASK 2: Refactor the Billing Gate (`lib/billing.ts`)
- **Context**: The freemium wedge allows "2 free syntheses." We only charge the user's limit when they actually receive value (a completed synthesis report).
- **Action**: Modify the `checkUsageLimit(orgId: string)` function.
- **Technical Spec**: Change the Supabase query logic. Using the authenticated Supabase server client (to strictly enforce RLS), execute the equivalent of `SELECT count(*) FROM reports WHERE org_id = [id] AND status = 'completed'`.
- **Result**: The paywall now correctly triggers only when the user has actually extracted 2 successful reports.

#### TASK 3: Fortify the Audio Moat (`components/audio/citation-player.tsx`, `components/reports/quote-card.tsx`, `lib/store/audio-store.ts`)
- **Context**: Wavesurfer.js is incredibly heavy on the DOM. Eagerly rendering dozens of players will crash the browser. We must enforce Just-In-Time (JIT) lazy loading and Singleton Playback.
- **Action A (Global State)**: Ensure `lib/store/audio-store.ts` uses `zustand` to hold `activeQuoteId: string | null`.
- **Action B (Lazy Loading)**: Install `react-intersection-observer`. Modify `components/reports/quote-card.tsx` to wrap the component. The `CitationPlayer` (Wavesurfer instance) MUST ONLY be mounted into the React Tree when `inView` is true. Ensure the component uses `next/dynamic` with `ssr: false`.
- **Action C (Singleton Playback)**: Inside `components/audio/citation-player.tsx`, create a `useEffect` that listens to `activeQuoteId` from the Zustand store. If `activeQuoteId !== currentQuoteId`, immediately call `wavesurfer.pause()` and ensure proper cleanup (`wavesurfer.destroy()`) to free memory.

#### TASK 4: Document the Architecture Amendment
- **Action**: Create a new markdown file: `docs/ARCHITECTURE_AMENDMENTS.md`.
- **Technical Spec**: Add a formal entry stating: "V1 explicitly bypasses `pgvector` and chunking. We use Direct-Context Synthesis via Claude 4.6 for transcript-to-theme extraction, combined with exact-substring verification. This optimizes for speed, lowers DB costs, and reduces architectural complexity while preserving the Citation Moat."

### EXPECTED OUTPUT & ACKNOWLEDGEMENT
1. Do not explain what Next.js or Zustand is. 
2. Execute the git commit first.
3. Install the required dependency: `npm install react-intersection-observer`.
4. Implement the exact code changes for Tasks 2, 3, and 4.
5. Upon completion, output the following exact phrase: "Day 1 Technical Debt Cleared. Audio Moat and Billing Gates aligned with Verbatim Bibles. Ready for Feature 9."