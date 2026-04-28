# Verbatim.ai — The Frontend Bible

**Document owner:** Dhanush Nangunoori
**Status:** LOCKED — single source of truth for frontend development
**Date locked:** April 27, 2026
**Version:** 1.0.0
**Companion docs:** `Loom__North_Star_Document.pdf` (philosophy), `VERBATIM_V1_BLUEPRINT.md` (backend + data model + 4-week build plan)

> **What this document is:** the complete, non-negotiable specification for every pixel, font, color, animation, component, and interaction in Verbatim's frontend. From this point forward, design decisions are not made — they are looked up.
>
> **What this document is not:** a brainstorm, a moodboard, or a wishlist. If something isn't in here, it doesn't ship in v1.
>
> **The contract:** when you prompt Claude Code to build a screen, you reference this document by section number. Claude Code does not invent — it executes against this spec.

---

## Table of contents

0. [Reading guide & how to use this Bible](#0-reading-guide)
1. [The frontend mandate](#1-the-frontend-mandate)
2. [The Three Bibles & their boundaries](#2-the-three-bibles--their-boundaries)
3. [Competitive UX teardown — what we steal, what we burn](#3-competitive-ux-teardown)
4. [Locked technical stack (frontend layer)](#4-locked-technical-stack-frontend-layer)
5. [Design tokens — colors, type, spacing, motion](#5-design-tokens)
6. [Typography system — landing vs. application](#6-typography-system)
7. [Color architecture — single-accent strategy](#7-color-architecture)
8. [Spatial architecture — grid, layout, hierarchy](#8-spatial-architecture)
9. [Motion language — Framer Motion principles](#9-motion-language)
10. [The 11 v1 features — frontend specs, screen by screen](#10-the-11-v1-features)
11. [The Golden Path — the 10-minute UX choreography](#11-the-golden-path)
12. [Component library — what we use, what we forbid](#12-component-library)
13. [The Wavesurfer.js implementation contract](#13-the-wavesurferjs-contract)
14. [Data integrity — Zod, RLS, error boundaries](#14-data-integrity)
15. [Accessibility & responsive baseline](#15-accessibility--responsive)
16. [Performance budgets](#16-performance-budgets)
17. [The forbidden list — anti-patterns we never ship](#17-the-forbidden-list)
18. [Naming, file structure, code conventions](#18-code-conventions)
19. [Definition of Done — every screen passes this checklist](#19-definition-of-done)
20. [Appendix A — competitor screen-by-screen comparison](#appendix-a)
21. [Appendix B — prompt templates for Claude Code](#appendix-b)

---

## 0. Reading guide

**How to use this Bible during development:**

1. Before prompting Claude Code, find the screen you're building in **Section 10** or **Section 11**.
2. Find the components it uses in **Section 12**.
3. Find the tokens those components use in **Section 5**.
4. Paste the relevant section numbers into your Claude Code prompt as context.
5. Run the **Definition of Done** (Section 19) before merging.

**The hierarchy of authority** (when two sources conflict, follow this order):

1. This Bible (frontend truth)
2. `VERBATIM_V1_BLUEPRINT.md` (backend + data + scope truth)
3. `Loom__North_Star_Document.pdf` (philosophy truth)
4. `index.html` landing page (live brand DNA — already shipped)
5. shadcn/ui defaults (only when none of the above specify)

---

## 1. The frontend mandate

### 1.1 The product, in one sentence

> *"Upload your customer interview recordings. In under 5 minutes, get a synthesis report where every theme is backed by playable audio quotes from the exact customers who said them. Share the report with one link."*

The frontend's only job is to make that sentence feel inevitable.

### 1.2 The Magic Moment (the soul of the product)

A user clicks a quoted sentence in a synthesized report. Within 1 second, the original customer's voice plays at the exact millisecond they said it. The waveform animates beneath the quote.

**This is the moment we engineer everything around.** Every design decision is judged against: *does this make the Magic Moment feel inevitable, or does it get in the way?*

### 1.3 The frontend's role in the moat

Dovetail's AI hallucinates and reviewers say so publicly. Our wedge is **citation-perfect trust**. The backend enforces this via Zod validation and substring-checking the LLM output. **The frontend's job is to render that trust visibly.** Every quote must look anchored, traceable, and undeniable. The UI is the proof.

### 1.4 The 30:1 Gain-to-Pain ratio

The user invests ~5 minutes (drag interviews + click Synthesize) and receives ~150 minutes of equivalent manual work (transcription + tagging + clustering + writeup). The frontend's job is to make the 5-minute side feel calm and the 150-minute side feel impossible to deliver any other way.

### 1.5 The aesthetic mandate (verbatim from founder)

> *"Simple, elegant, dark, minimalistic. Architecturally researched. Not AI-generic. Not flashy. The structured mindset of a Dovetail user should not feel alienated. Each button placed where it exactly has to be placed. Users should not wander around — they should know exactly what they should be doing."*

Translated to engineering principles:

- **Calm > clever.** No animations that show off.
- **Authority > friendliness.** No emoji, no exclamation points, no AI-chatbot tone in microcopy.
- **Density > whitespace, when data deserves it.** No hero-sized empty states in the app.
- **Transparency > magic.** Show the user what the AI did, with citations. Never hide the structure.
- **Restraint > expressiveness.** One accent color. One serif. One sans. One mono. That's it.

---

## 2. The Three Bibles & their boundaries

To eliminate ambiguity about what gets decided where, the entire Verbatim development effort is governed by three locked documents. Every prompt to Claude Code references one or more of them.

| Bible | Document | Owns | Does not own |
|---|---|---|---|
| **Frontend Bible** | This document | UI components, design tokens, motion, screens, copy, routing, client state, Wavesurfer integration, error UI | Database schema, RLS policies, LLM prompts, Inngest workflows |
| **Backend Bible** | `VERBATIM_V1_BLUEPRINT.md` (Parts 4–8) | Data model, RLS, Inngest jobs, AssemblyAI integration, prompt library, citation verification loop, cost model | Visual design, copy, animations |
| **North Star** | `Loom__North_Star_Document.pdf` | Vision, ICP, positioning, pricing philosophy, why-we-win, hiring philosophy | Specific implementation details |

**The rule:** if a Claude Code prompt forces you to make a design decision that isn't in the Frontend Bible, **stop, decide, write it into this Bible, then resume coding.** Never decide twice.

---

## 3. Competitive UX teardown

We are competing against Dovetail (incumbent), Condens (clean alternative), and Looppanel (high-velocity). The Frontend Bible PDF (the document this Bible operationalizes) curated the master list. Here is the locked verdict on what we steal and what we explicitly burn.

### 3.1 What we steal (and from whom)

| Pattern | Origin | How we implement it in Verbatim |
|---|---|---|
| **Frictionless Google OAuth** | Modern B2B standard | Clerk + single "Continue with Google" button. No password fields exist anywhere in v1. |
| **Flat project architecture** | Anti-Dovetail | One-tier projects. Name + optional description. No folders. No nesting. No taxonomies. |
| **Split-screen contextual review** | Condens | Per-interview view: transcript on the left, sticky right pane with TL;DR + extracted pains. |
| **Non-blocking background processing** | Looppanel + enterprise SaaS | Inngest jobs surface as horizontal status cards: `Queued → Transcribing → Extracting → Ready`. Never a full-screen blocker. |
| **Citation-perfect audio players** | Verbatim's core moat | Wavesurfer.js inline under each quote. Click play → audio plays from exact ms. Lazy-instantiated. |
| **Recommendation badges** | Modern AI workflows | `Build / Investigate / Monitor / Ignore` pills attached to every theme. Color-coded. |
| **Contradiction flagging** | Advanced qual research | Theme cards that contain conflicting interview signals get a red `Contradiction` chip. |
| **Single-click public sharing** | Dovetail (one of the few things they got right) | `joinverbatim.com/r/[slug]` — strips chrome, keeps Wavesurfer functional, watermark in corner. |
| **Native Markdown export** | Cursor / Linear culture | One-click "Copy as Markdown" — formatted for Notion + Linear paste-without-degradation. |
| **Progressive paywall** | Stripe Checkout standard | Calm full-screen overlay after 2nd free synthesis. Returns user to exact UI state on success. |

### 3.2 What we burn (and why)

| Pattern | Source | Why we burn it |
|---|---|---|
| Nested folders / taxonomies | Dovetail | Manual labor. Anxiety-inducing. We replace it with AI clustering. |
| Manual tag boards | Dovetail | The exact pain we're eliminating. Ship the AI, don't ship the labor. |
| Sentiment / tag-count charts | Dovetail | v2. Not the wedge. |
| Real-time collaboration cursors | Notion / Figma envy | Single-user org in v1. No reason to build multiplayer. |
| Tour modals / onboarding checklists | Most B2B SaaS | If users need a tour, the UI failed. Empty state IS the onboarding. |
| Glassmorphism, neon gradients, glow effects | Generic AI wrappers | Reads as cheap. We are not Replit Bounties. |
| Confetti / celebration animations | Consumer SaaS | Patronizing. The Magic Moment is the celebration. |
| Generic spinners | Everywhere | Replaced with skeleton loaders that mimic final layout. |
| Hover tooltips on every icon | Notion / Linear | Buttons must be self-evident. If a tooltip is needed, the icon is wrong. |
| AI-chatbot tone in microcopy ("Let's get started!") | OpenAI playgrounds | We use authoritative product-manager voice. "Drop interviews here." Not "Hey there, ready to upload?" |

### 3.3 The "structured mindset" tension (and how we resolve it)

Dovetail users who migrate to Verbatim are accustomed to controlling their data via taxonomies. Removing manual tagging risks making them feel they've lost agency. **The frontend resolves this by over-communicating structure on the AI's output side.**

Three mechanisms enforce this:

1. **Source attribution on every theme.** Every theme card shows `Drawn from: [interview-1.mp3, interview-3.mp3]` as a visible chip row.
2. **Audio receipts.** Every quote is clickable and plays from the exact timestamp. Trust through verifiability.
3. **Authoritative formatting.** Reports render as strict Markdown with H1/H2 hierarchy, ranked themes, recommendation badges — never as freeform prose.

The user trades the labor of tagging for the assurance of traceability. We make that trade visible.

---

## 4. Locked technical stack (frontend layer)

This is final. Do not debate further. Do not introduce a new library without amending this Bible.

| Layer | Choice | Version | Rationale |
|---|---|---|---|
| **Framework** | Next.js | 15 (App Router) | Server components, Vercel-native, Claude Code fluency |
| **Language** | TypeScript | 5.x strict | No `any`. No exceptions. |
| **Styling** | Tailwind CSS | v4 | CSS-first config via `@theme`. Aligned with our token system. |
| **Component primitives** | shadcn/ui | latest | Copy-in, fully customized to our tokens. Not used as-is. |
| **Animation** | Framer Motion | latest | Used with severe restraint. See Section 9. |
| **Audio waveform** | Wavesurfer.js | v7 | Citation-perfect playback. See Section 13. |
| **Icons** | Lucide React | latest | Stroke-based, consistent with Geist's geometry. No emoji. |
| **Forms** | React Hook Form + Zod | latest | Mirrors backend validation. |
| **Server state** | TanStack Query | v5 | Replaces ad-hoc fetch hooks. |
| **Markdown rendering** | `react-markdown` + `remark-gfm` | latest | For report rendering. Custom renderers for blockquotes (see Section 13). |
| **Toast / notification** | `sonner` | latest | Already shadcn-blessed. Bottom-right, monospace timestamps. |
| **Auth UI** | Clerk's prebuilt components | latest | But re-themed to match our tokens (see Section 7.5). |
| **Billing UI** | Stripe Checkout (hosted) | — | We do not build a payment form. |

### 4.1 What we explicitly do not use

- **No Material UI, Chakra, Mantine, Ant Design** — opinionated to a degree that fights our tokens.
- **No styled-components, Emotion** — Tailwind v4 only.
- **No Redux, Zustand, Jotai** — server state via TanStack Query, local state via React. That's it.
- **No GSAP, Lottie, Three.js** — Framer Motion is the only motion library.
- **No custom audio playback** — Wavesurfer.js is the only audio player.
- **No charting library in v1** — no charts ship in v1.
- **No drag-and-drop reordering library** — no reorderable lists ship in v1.

---

## 5. Design tokens

These are the source of truth for every color, font, space, and timing in the app. They live in `app/globals.css` as Tailwind v4 `@theme` declarations and are mirrored in TypeScript constants for Wavesurfer + Framer Motion configs.

### 5.1 Color tokens

These tokens come directly from the live `index.html` landing page and are now locked for the entire app.

```css
@theme {
  /* Surface / background */
  --color-bg:            #0E0F11;  /* App canvas */
  --color-bg-elevated:   #17181B;  /* Cards, modals, panels */
  --color-bg-hover:      #1E1F23;  /* Interactive hover surface */
  --color-bg-active:     #242529;  /* Active/pressed surface */

  /* Borders */
  --color-border:        #26272B;  /* Default border */
  --color-border-strong: #35373C;  /* Hover/focus border */

  /* Text */
  --color-text:          #F4F4F5;  /* Primary text */
  --color-text-soft:     #A8A9AD;  /* Secondary text */
  --color-text-faint:    #6A6B70;  /* Tertiary / metadata */

  /* Brand: Blue (action, citation, primary) */
  --color-blue:          #4A9EFF;
  --color-blue-soft:     rgba(74, 158, 255, 0.12);
  --color-blue-strong:   #2E84F0;

  /* Brand: Orange (recommendation, accent, brand mark) */
  --color-orange:        #FF7849;
  --color-orange-soft:   rgba(255, 120, 73, 0.12);

  /* Semantic */
  --color-success:       #22C55E;     /* "Ready" status */
  --color-success-soft:  rgba(34, 197, 94, 0.12);
  --color-warning:       #F5B547;     /* "Investigate" recommendation */
  --color-warning-soft:  rgba(245, 181, 71, 0.12);
  --color-danger:        #FF2D1F;     /* Contradiction flag, errors */
  --color-danger-soft:   rgba(255, 45, 31, 0.12);
  --color-monitor:       #A8A9AD;     /* "Monitor" recommendation (uses text-soft) */
  --color-ignore:        #6A6B70;     /* "Ignore" recommendation (uses text-faint) */
}
```

> **Critical note on Bible reconciliation:** The reference Frontend Bible PDF proposed muted teal or gold as the accent. **We override that.** Verbatim's brand DNA is already shipped on the live landing page as **blue + orange**. Blue is action/citation/primary. Orange is brand-mark and recommendation accent. Teal and gold do not exist in our system.

### 5.2 Color usage rules (single-accent strategy)

| Token | Reserved for | Forbidden uses |
|---|---|---|
| `--color-blue` | Primary buttons, citation playhead, link hover, active nav, focus rings | Decorative backgrounds, body text, large fills |
| `--color-orange` | Brand wordmark dot, "Build" recommendation badge, hero accents on landing only | Buttons inside the app, body text |
| `--color-success` | "Ready" status pill, completion ticks | CTAs, large fills |
| `--color-warning` | "Investigate" recommendation badge | Errors, primary actions |
| `--color-danger` | Contradiction flag, destructive confirmation only | Generic errors, hover states |
| `--color-text` | Primary text only | Backgrounds (forbidden — pure-white-on-pure-black halation) |

**The discipline:** any new color introduced into the app requires updating this Bible and getting founder sign-off. We have ~12 colors total. We will not have 13 without a meeting.

### 5.3 Typography tokens

```css
@theme {
  --font-display: "Instrument Serif", Georgia, serif;
  --font-sans:    "Geist", -apple-system, system-ui, sans-serif;
  --font-mono:    "Geist Mono", "SF Mono", "Menlo", monospace;

  /* Type scale (rem-based, 1rem = 16px) */
  --text-xs:    0.75rem;    /* 12px — tiny metadata */
  --text-sm:    0.8125rem;  /* 13px — timestamps, captions */
  --text-base:  1rem;       /* 16px — body, transcript */
  --text-md:    1.125rem;   /* 18px — quote body */
  --text-lg:    1.25rem;    /* 20px — quote display */
  --text-xl:    1.5rem;     /* 24px — H2 / theme header */
  --text-2xl:   2rem;       /* 32px — H1 / report title */
  --text-3xl:   2.5rem;     /* 40px — landing section heads */
  --text-display: 4rem;     /* 64px — landing hero */
}
```

### 5.4 Spacing & radius tokens

```css
@theme {
  /* 4pt soft grid */
  --space-1: 0.25rem;  /*  4px */
  --space-2: 0.5rem;   /*  8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
  --space-20: 5rem;    /* 80px */
  --space-24: 6rem;    /* 96px */

  /* Radius */
  --radius-sm:  4px;   /* badges, pills */
  --radius-md:  8px;   /* inputs, small buttons */
  --radius-lg:  10px;  /* primary buttons, large inputs */
  --radius-xl:  12px;  /* cards (default) */
  --radius-2xl: 14px;  /* elevated cards (waveform panel) */
  --radius-3xl: 18px;  /* hero CTA blocks */
  --radius-full: 9999px;
}
```

### 5.5 Layout tokens

```css
@theme {
  --container-max: 1140px;     /* Landing page max width */
  --container-app: 1280px;     /* App workspace max width */
  --container-report: 768px;   /* Report reading width — long-form readability */
  --sidebar-w: 240px;          /* Project list rail */
  --rightpane-w: 360px;        /* Per-interview right pane (TL;DR + pains) */
}
```

### 5.6 Motion tokens

```css
@theme {
  --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);   /* The Verbatim curve — used for everything */
  --duration-instant: 100ms;   /* Hover states, focus rings */
  --duration-fast:    150ms;   /* Route crossfade */
  --duration-base:    250ms;   /* Card transitions, modals */
  --duration-slow:    600ms;   /* Hero entrance, skeleton dissolve */
}
```

---

## 6. Typography system

### 6.1 The bifurcation rule

The marketing surface and the application surface use the same fonts but with **different roles** for the serif. This is the single most important typographic discipline in the product.

| Surface | Display (Instrument Serif) | Sans (Geist) | Mono (Geist Mono) |
|---|---|---|---|
| **Landing page** (`joinverbatim.com`) | All H1, H2, big headlines, eyebrow italic emphasis | Body, sub-heads, microcopy, button labels | Status pills, footer |
| **Application** (`/app/*`) | **Quotes only** — italic blockquotes inside reports | Everything else (UI chrome, body, headers) | Timestamps, file metadata, IDs, status text |

**The rule:** in the app, Instrument Serif appears on screen **exclusively when rendering a customer's spoken quote**. Nowhere else. Not in headers, not in empty states, not in modals. This makes the serif a signal: *this is a human voice*.

### 6.2 The type scale (locked)

| Element | Surface | Font | Size | Weight | Line height | Letter-spacing |
|---|---|---|---|---|---|---|
| Landing hero H1 | Landing | Instrument Serif | 64px → clamp(44, 5.6vw, 76) | 400 | 1.02 | -0.025em |
| Landing section H2 | Landing | Instrument Serif | clamp(32, 4vw, 52) | 400 | 1.10 | -0.020em |
| Landing body | Landing | Geist | 19px (hero sub) / 16px (body) | 400 | 1.50 / 1.55 | normal |
| App report H1 (title) | App | Geist | 32px | 600 | 1.20 | -0.015em |
| App report H2 (theme) | App | Geist | 24px | 600 | 1.30 | -0.010em |
| App quote body | App | Instrument Serif | 18px | 400 italic | 1.55 | normal |
| App body | App | Geist | 16px | 400 | 1.60 | normal |
| App caption / label | App | Geist | 13px | 500 | 1.40 | 0.02em |
| Timestamp / metadata | App | Geist Mono | 11–13px | 400 | 1.50 | 0.05em |
| Eyebrow / section label | Both | Geist Mono | 11px | 500 | 1.40 | 0.12em uppercase |

### 6.3 Reading-density rules

- Body text in the app is **always 16px** (1rem). No exceptions. Smaller text fails accessibility.
- **Transcript line-height is 1.65** (denser than 1.6) because PMs scan transcripts vertically. Tighter rhythm = faster scanning.
- **Quote line-height is 1.55** because italic serif at 18px reads better with a touch more breathing room.
- **Headings always use tighter line-height** (1.20–1.30) to maintain Gestalt proximity with their following paragraph.

### 6.4 Italic discipline

Instrument Serif italic is used in exactly three places:

1. The landing hero's emphasized word (e.g., *"synthesized"*) — colored `--color-blue`.
2. App quote bodies — colored `--color-text`.
3. The "V" in the favicon mark.

Italic is never used inside Geist. Italic is never used for de-emphasis or "soft" text — that's `--color-text-soft`'s job.

---

## 7. Color architecture

### 7.1 Surface elevation system

Dark mode requires depth via lightness, not via shadow. We step up the surface for every layer of elevation.

```
Layer 0:  --color-bg          #0E0F11   App canvas
Layer 1:  --color-bg-elevated #17181B   Cards, panels, modals
Layer 2:  --color-bg-hover    #1E1F23   Hovered card / button
Layer 3:  --color-bg-active   #242529   Active card, selected row
```

Drop shadows are used **only on Layer 1+ floating elements** (modals, popovers, the waveform panel on the landing) — and only with this exact spec: `0 24px 60px -24px rgba(0, 0, 0, 0.6)`.

### 7.2 Recommendation badge palette

Each theme in a synthesis report carries one recommendation badge. These are the only context where we use four colors at once — and the discipline is that they're tiny.

| Badge | Bg | Border | Text | Use |
|---|---|---|---|---|
| `Build` | `--color-orange-soft` | `rgba(255, 120, 73, 0.25)` | `--color-orange` | Strong signal across multiple interviews + clear path to ship |
| `Investigate` | `--color-warning-soft` | `rgba(245, 181, 71, 0.25)` | `--color-warning` | Signal exists but evidence is mixed |
| `Monitor` | `rgba(168, 169, 173, 0.10)` | `rgba(168, 169, 173, 0.20)` | `--color-text-soft` | Worth tracking, not worth building yet |
| `Ignore` | `rgba(106, 107, 112, 0.08)` | `rgba(106, 107, 112, 0.18)` | `--color-text-faint` | Outlier signal, low frequency, not actionable |

Badge spec: 10px Geist Mono, uppercase, `letter-spacing: 0.05em`, `padding: 3px 8px`, `radius: var(--radius-sm)`.

### 7.3 Status pill palette (interview processing state)

| Status | Color | Pill bg | Animation |
|---|---|---|---|
| `Queued` | `--color-text-soft` | `--color-bg-elevated` | none |
| `Transcribing` | `--color-blue` | `--color-blue-soft` | indeterminate progress pulse |
| `Extracting` | `--color-blue` | `--color-blue-soft` | indeterminate progress pulse |
| `Ready` | `--color-success` | `--color-success-soft` | none |
| `Failed` | `--color-danger` | `--color-danger-soft` | none |

### 7.4 Citation accent (the most important color rule)

The `--color-blue` is reserved for **the audio citation moment** above all else. The Wavesurfer playhead, the play-icon prefix on quotes, the focus ring on the audio player — all blue. This is the visual signature of trust in the product. We do not dilute it by overusing blue for decorative buttons or generic links.

### 7.5 Clerk component re-theming

Clerk ships its own UI. We override it via `appearance.elements` and `appearance.variables`:

```ts
// app/(auth)/layout.tsx
<ClerkProvider appearance={{
  variables: {
    colorBackground: '#0E0F11',
    colorPrimary: '#4A9EFF',
    colorText: '#F4F4F5',
    colorTextSecondary: '#A8A9AD',
    colorInputBackground: '#17181B',
    colorInputText: '#F4F4F5',
    fontFamily: '"Geist", system-ui, sans-serif',
    borderRadius: '10px',
  },
  elements: {
    card: 'bg-[#17181B] border border-[#26272B] shadow-2xl',
    headerTitle: 'font-["Instrument_Serif"] text-2xl font-normal',
    socialButtonsBlockButton: 'bg-white text-[#0E0F11] hover:bg-[#4A9EFF] hover:text-white',
    formButtonPrimary: 'bg-[#4A9EFF] hover:bg-[#2E84F0]',
    footerActionLink: 'text-[#4A9EFF] hover:text-[#2E84F0]',
  }
}}>
```

The signin card lives centered on the `--color-bg` canvas. Single CTA: "Continue with Google." No email/password fields.

---

## 8. Spatial architecture

### 8.1 The 12-column grid + 4pt soft grid

- **App workspace:** 12-column CSS grid, max-width `--container-app` (1280px), gutter 24px.
- **Report reading:** centered `--container-report` (768px) for long-form readability.
- **All spacing in the app is a multiple of 4px.** Use Tailwind's spacing scale (`p-2`, `gap-6`) which already maps to 4pt steps.

### 8.2 The standard app shell

```
┌──────────────────────────────────────────────────────────────────┐
│  Topbar (56px tall, --color-bg-elevated, border-bottom)          │
│  [Wordmark]   [Project switcher]              [User] [Settings]  │
├──────────┬───────────────────────────────────────────────────────┤
│          │                                                       │
│ Sidebar  │  Workspace (flex-1, p-8, max-w-[--container-app])    │
│ (240px)  │                                                       │
│          │  - Project list view                                  │
│ - Proj A │  - Per-interview view (split pane)                    │
│ - Proj B │  - Report view (centered --container-report)          │
│ - + New  │                                                       │
│          │                                                       │
└──────────┴───────────────────────────────────────────────────────┘
```

The sidebar is collapsible to 56px (icon-only) on viewports ≤ 1080px. The topbar persists on every authenticated route. The workspace is the only scrolling region.

### 8.3 Button placement law

When two actions are adjacent (e.g., a modal footer):

- **Right side:** primary action, solid `--color-blue` button, weight 500.
- **Left side:** secondary/cancel action, ghost button (transparent bg, `--color-text-soft` text), weight 500.

This applies everywhere: modals, confirm dialogs, the bottom of forms. Never invert this.

### 8.4 Fitts's Law: minimum touch targets

Every interactive target is **at least 40×40px** (44×44 on mobile). The Wavesurfer play button, the Markdown export icon, the share button, the close-modal button — all 40×40 minimum. Pad them with negative space if the visible icon is smaller.

### 8.5 Z-index scale (locked)

```
z-base:        0     (default app content)
z-sticky:      10    (sticky right pane on /interview)
z-topbar:      30    (the persistent topbar)
z-dropdown:    40    (project switcher menu, user menu)
z-modal:       50    (confirm dialogs, project creation)
z-popover:     60    (share popover, badge tooltips)
z-toast:       70    (sonner toasts)
z-paywall:     80    (the full-screen paywall overlay — wins everything)
```

### 8.6 The "Synthesize" button placement

On the project view, the **"Synthesize all N"** button is always:

- **Top-right** of the interview list area.
- **Disabled** (Layer 1 surface, `--color-text-soft` text) until ≥ 2 interviews show `Ready` status.
- **Enabled** (solid `--color-blue` background, `--color-text` white text) once 2+ are Ready.
- **Scale-up animation** on transition from disabled → enabled (`scale: 0.98 → 1.0`, 250ms, `--ease-out`). This is the *only* attention-grab animation in the app.

This is the second-most-important button in the product (after Wavesurfer's play). Its placement is sacred.

---

## 9. Motion language

### 9.1 The motion philosophy

> *"Motion is for comprehension, not for decoration. If a user notices the animation, the animation has failed."*

Every animation in Verbatim must answer one of three questions:

1. **Where did this come from?** (e.g., a card sliding into view from where the user clicked)
2. **What's happening right now?** (e.g., a progress pulse during transcription)
3. **What changed?** (e.g., status color shifting from blue to green when Ready)

If an animation doesn't answer one of those three, it doesn't ship.

### 9.2 The Verbatim curve (the only easing we use)

```ts
export const ease = [0.2, 0.8, 0.2, 1] as const;
```

Used for every transform, opacity, and color transition. Linear is reserved for indeterminate progress pulses only. There is no `easeIn`, `easeInOut`, `bounce`, `spring`, etc. in user-facing UI.

### 9.3 Approved Framer Motion patterns

| Pattern | Use | Spec |
|---|---|---|
| **Rise** | First mount of major content (hero, report, modal) | `opacity: 0 → 1, y: 16px → 0`, 600ms, `ease` |
| **Crossfade** | Route transitions between project list ↔ report | `opacity: 0 → 1`, 150ms, `ease` |
| **Surface hover** | Cards, buttons, list rows | `bg-color`, 100ms, `ease` |
| **Scale-up** | Disabled → enabled state of Synthesize button | `scale: 0.98 → 1.0`, 250ms, `ease` |
| **Indeterminate pulse** | "Transcribing..." status | `opacity: 0.4 → 1.0 → 0.4`, 1600ms linear, infinite |
| **Skeleton dissolve** | Skeleton loader → real content | `opacity: 1 → 0` on skeleton, `opacity: 0 → 1` on content, 250ms, `ease`, with 50ms overlap |
| **Modal entrance** | Project creation, share, paywall | `opacity: 0 → 1, scale: 0.96 → 1.0`, 200ms, `ease` |
| **Audio playhead** | Wavesurfer playhead movement | Native (Wavesurfer-managed). No Framer Motion override. |

### 9.4 Forbidden motion

- ❌ Page-load entrance animations longer than 600ms
- ❌ Spring physics on UI elements
- ❌ Bounce, rubber-band, elastic easing
- ❌ Continuous decorative animation in the background (gradient drift, particle fields)
- ❌ Hover scale on cards (`scale: 1.02` etc.) — we shift the surface color instead
- ❌ Stagger animations on more than 5 children at once
- ❌ Confetti, parallax, scroll-jacking, hover-triggered video

### 9.5 Reduced-motion baseline

Wrap every Framer Motion variant in `useReducedMotion()`. When the user prefers reduced motion:

- All transforms collapse to pure opacity transitions.
- The indeterminate progress pulse becomes a static blue pill with the text "Transcribing..." (no opacity animation).
- The Synthesize button scale-up becomes an instant color flip.

---

## 10. The 11 v1 features

This section maps each v1 feature to its frontend specification. Reference these by feature number when prompting Claude Code.

### Feature 1 — Sign up with Google

**Route:** `/sign-in`
**Component:** Clerk's `<SignIn />` re-themed per Section 7.5.
**Layout:** Centered card on `--color-bg`, max-width 400px, 480px from top.
**Copy above card:** Wordmark "Verbatim.ai" in Instrument Serif 32px. Subhead: *"Customer interviews, synthesized."* (Geist 16px, `--color-text-soft`).
**No password fields. No email/password fallback in v1.** Single button: "Continue with Google".
**On success:** Clerk webhook creates `org` + `user` + default project. Frontend redirects to `/app/projects/[default-project-id]`.

### Feature 2 — Create a project

**Trigger:** "New project" button in sidebar (sticky bottom, ghost style, `+` Lucide icon).
**Modal:** centered, max-width 480px, `--color-bg-elevated`, `radius-2xl`.
**Fields:** Name (required, 80 char max), Description (optional, 240 char max, textarea, 3 rows).
**Footer:** Cancel (left, ghost) | Create project (right, blue primary).
**On submit:** create row in `projects` table, navigate to `/app/projects/[new-id]`, sidebar updates optimistically via TanStack Query.
**Empty state copy:** *"Name your project after the question you're trying to answer. e.g., 'Why are users churning at week 2?'"*

### Feature 3 — Upload interviews

**Component:** `<Dropzone />` — large dashed-border zone on `--color-bg-elevated`, 320px tall, centered in workspace when project is empty.
**Microcopy (top):** *"Drop interview recordings here"* (Geist 24px, weight 500).
**Microcopy (mono, below):** *"mp3, m4a, wav, mp4, mov, txt, vtt, srt · up to 10 files · max 500MB each"* (Geist Mono 12px, `--color-text-faint`).
**Drag hover state:** border becomes solid `--color-blue`, bg becomes `--color-blue-soft`.
**On drop:** files validate client-side (extension + size). Invalid → toast in `--color-danger`. Valid → enter upload state.
**Upload mechanism:** Supabase signed URL PUT. Each file shows a horizontal card with filename (mono), size, and a determinate progress bar in `--color-blue`.
**On complete:** card transitions to status `Queued`, calls `/api/sources/[id]/start-processing` to enqueue Inngest.

### Feature 4 — Live status per interview

**Component:** `<InterviewCard />` — horizontal card, full workspace width, `--color-bg-elevated`, `radius-xl`, padding 20px 24px.
**Layout (left to right):**
- File icon (Lucide, 20px) by extension
- Filename (Geist 15px, weight 500) + duration mono pill below
- Status pill (per Section 7.3) — center
- Progress bar (linear, 4px tall, full card width minus icon) — bottom edge, only visible during processing
- Right edge: "Open" link (appears only when status = Ready)

**State transitions:**
1. `Queued` (instant) → `Transcribing` (~30–90s) → `Extracting` (~10–30s) → `Ready`
2. Each transition: status pill cross-fades to new color, 250ms.
3. Progress bar pulses (indeterminate, --color-blue) during `Transcribing` and `Extracting`.
4. On `Ready`: progress bar fills to 100% in success-green for 800ms then fades out, leaving a subtle border-bottom of `--color-border`.

**On `Failed`:** status pill shows danger red. Below the card, an inline error message in `--color-text-soft` with a "Retry" link. No modal.

### Feature 5 — Auto-generated per-interview summary

**Route:** `/app/projects/[projectId]/interviews/[sourceId]`
**Layout:** Split pane.
- **Left (flex-1, scrollable):** Full transcript with diarization. Each speaker turn: speaker label in mono (`Speaker A`, `Speaker B`), timestamp `[04:12]` in mono `--color-text-faint`, then transcript text in Geist 16px line-height 1.65. Speaker turns separated by 12px vertical space.
- **Right (sticky, 360px wide):** Sidebar with three sections:
  1. **TL;DR** — H3 in Geist 14px uppercase mono label `// SUMMARY`. Below: 3-sentence prose in Geist 15px line-height 1.55.
  2. **Pain points** — H3 mono label `// PAINS EXTRACTED`. Below: bulleted list of 5–10 items. Each item: dash icon (Lucide `Minus`), pain text in Geist 14px, timestamp pill `[04:12]` mono in blue, clickable.
  3. **File metadata** — Mono, faint text. Filename, duration, upload date.

**Timestamp click behavior:** scrolls left transcript to that moment AND highlights the speaker turn for 1.5s with a `--color-blue-soft` background.

### Feature 6 — Cross-interview synthesis

**Trigger:** "Synthesize all N" button at top-right of project view.
**On click:**
1. Button shows inline spinner (left of label), label changes to "Synthesizing…" (mono, 13px).
2. The interview list area replaces with a **skeleton report** that mimics the final layout: 1 H1-shaped skeleton bar, 5–7 H2-shaped bars each followed by 3 quote-shaped bars. All skeleton bars use `--color-bg-elevated` with a slow shimmer (linear gradient sweep, 2400ms).
3. On completion (30–60s): skeleton dissolves → real report renders. Section 9.3 specifies the dissolve.
4. Failure (rare, after 2 retries): toast in danger red, button re-enables, skeleton dissolves to the previous interview list. Optional: small inline error card with "Re-synthesize" link.

### Feature 7 — Citation-perfect audio quotes

See Section 13 (Wavesurfer contract) for the full spec.

### Feature 8 — Build / Investigate / Monitor / Ignore badges

**Component:** `<RecommendationBadge type="build" />` — see Section 7.2 palette.
**Position:** inline at the right of every theme H2, separated by 12px.
**Tooltip on hover:** Geist 13px, `--color-bg-active`, `radius-md`, padding 8px 12px, max-width 320px. Content per type:
- `Build`: *"Strong signal across ≥3 interviews. Frequent, high-severity, clear path to ship."*
- `Investigate`: *"Signal exists but evidence is mixed. Run more interviews before committing."*
- `Monitor`: *"Worth tracking. Re-evaluate next quarter."*
- `Ignore`: *"Low frequency. Outlier. Don't prioritize."*

### Feature 9 — Shareable public report link

**Route:** `/r/[slug]` — view-only, no auth, served from `(public)` route group.
**Layout:** Centered `--container-report` (768px), no sidebar, no topbar. Wordmark in top-left corner (32px Instrument Serif, links to `/`). "Made with Verbatim" watermark bottom-right corner (Geist Mono 11px `--color-text-faint`).
**Behavior:** Wavesurfer remains fully functional — quotes are playable. Markdown copy button is hidden.
**Trigger:** "Share" button in report view top-right → popover with read-only URL + "Copy link" button (`copyToClipboard` + sonner toast).

### Feature 10 — Markdown export

**Trigger:** "Copy as Markdown" button in report view top-right (next to Share).
**Behavior:**
- On click: assembles strict Markdown from the `analyses.summary_markdown` DB field.
- Copies to clipboard via `navigator.clipboard.writeText()`.
- Toast: *"Copied. Paste into Notion or Linear."*
- Audio quotes become `> "Quote text" — [04:12](https://verbatim.ai/r/[slug]#t=252)` so the timestamp deeplinks back to the public share URL.

### Feature 11 — Billing

**Components:**
- `<PaywallOverlay />` — full-screen, `z-paywall`, semi-opaque scrim `rgba(14, 15, 17, 0.85)` with backdrop blur 16px. Centered card, max-width 480px.
- Card contents: H1 *"You've used your 2 free syntheses."* (Instrument Serif 32px). Subhead in Geist 16px `--color-text-soft`: *"Upgrade to Pro for unlimited syntheses and 30 interviews per month — $29/mo."* Primary button "Upgrade to Pro" (blue) → Stripe Checkout.
- On Stripe success webhook → `orgs.plan = 'pro'`, redirect back to `/app/projects/[id]?ref=upgraded` → toast: *"You're on Pro. Welcome."*

**Billing portal:** linked from user menu → "Billing" → opens Stripe-hosted Customer Portal in new tab.

---

## 11. The Golden Path

The full UX choreography from landing to Magic Moment. Time budget: **under 10 minutes from cold visit to first audio playback.**

| Step | Time | Surface | Frontend behavior |
|---|---|---|---|
| 1 | 0:00–0:30 | `joinverbatim.com` | User sees Instrument Serif hero. Clicks "Request access" → email captured. |
| 2 | 0:30–0:40 | `/sign-in` | Clerk's themed card. Single "Continue with Google" button. Auth completes, redirects. |
| 3 | 0:40–2:10 | Empty project view | Drag-drop zone. User drops 3 files. Cards appear in `Queued` state. |
| 4 | 2:10–2:15 | Project view | Cards transition to `Transcribing`, indeterminate pulse begins. UI never blocks. |
| 5 | 2:15–6:15 | Project view | Cards progress through `Extracting` → `Ready`. Synthesize button arms (scale-up animation). |
| 6 | 6:15–7:15 | Project view → Report skeleton | User clicks Synthesize. Skeleton renders. 30–60s wait with shimmer. |
| 7 | 7:15–7:20 | Report view | Skeleton dissolves. Markdown report renders with 5–7 themes, badges, quote cards. |
| 8 | **7:20–7:25** | Report view | **THE MAGIC MOMENT.** User clicks ▶ on first quote. Wavesurfer renders waveform. Audio plays from exact ms. Playhead tracks in `--color-blue`. |
| 9 | 7:25–7:30 | Report view | User clicks "Share" → popover → copies link OR clicks "Copy as Markdown". |
| 10 | 7:30–8:15 | Paywall (if 3rd synthesis) | Calm overlay → Stripe Checkout → return to exact UI state. |

**The success metric for v1's first 90 days:** % of new sign-ups who reach Step 8 within 10 minutes of `created_at`. Target: 60%+.

---

## 12. Component library

### 12.1 The shadcn baseline

We use shadcn/ui as the **starting point**, not the destination. Every shadcn component we install goes through a re-theme pass to our tokens before it's used in production.

**Components we use (all re-themed):**
`button`, `dialog`, `popover`, `dropdown-menu`, `tooltip`, `input`, `textarea`, `label`, `toast` (via sonner), `tabs`, `skeleton`, `separator`, `scroll-area`.

**Components we explicitly do not use in v1:**
`accordion`, `alert-dialog` (we build our own confirm), `avatar` (no team feature), `calendar`, `checkbox`, `collapsible`, `command`, `context-menu`, `data-table` (we render custom), `hover-card`, `radio-group`, `select` (we use dropdown-menu), `slider`, `switch`, `table`.

### 12.2 Custom components (Verbatim-authored)

The following are built from primitives — they don't exist in shadcn.

| Component | Purpose | Spec section |
|---|---|---|
| `<Dropzone />` | Multi-file drag-drop upload | Feature 3 |
| `<InterviewCard />` | Per-interview status row | Feature 4 |
| `<StatusPill />` | Status indicator | 7.3 |
| `<RecommendationBadge />` | Build/Investigate/Monitor/Ignore | 7.2 |
| `<ContradictionFlag />` | Red flag inline in theme cards | 7.2 |
| `<QuoteBlock />` | Italic serif quote + Wavesurfer + speaker label | Section 13 |
| `<WaveSurferPlayer />` | The audio citation player | Section 13 |
| `<ReportRenderer />` | Markdown → styled React (with quote interception) | Feature 6 |
| `<SkeletonReport />` | Pre-render layout during synthesis | Feature 6 |
| `<PaywallOverlay />` | Full-screen Stripe gateway | Feature 11 |
| `<SharePopover />` | Public link generator | Feature 9 |
| `<SourceAttributionRow />` | "Drawn from: X.mp3, Y.mp3" chips | 3.3 |

### 12.3 The component file structure

```
components/
├── ui/              # shadcn primitives (re-themed)
│   ├── button.tsx
│   ├── dialog.tsx
│   └── ...
├── verbatim/        # Verbatim-authored components
│   ├── dropzone.tsx
│   ├── interview-card.tsx
│   ├── quote-block.tsx
│   ├── wavesurfer-player.tsx
│   ├── recommendation-badge.tsx
│   └── ...
└── layout/          # Shells, navigation, frames
    ├── app-shell.tsx
    ├── sidebar.tsx
    ├── topbar.tsx
    └── public-report-frame.tsx
```

---

## 13. The Wavesurfer.js contract

This is the most critical component in the product. Its specification is the most rigorous in this Bible.

### 13.1 The performance constraint

A typical report contains 5–7 themes × 3 quotes = up to **21 audio players on a single page**. Naively instantiating 21 Wavesurfer instances on mount will:
- Block the main thread for 1–2 seconds.
- Consume 100MB+ of memory.
- Hit the browser's audio decoding budget.

**The solution is mandatory lazy instantiation via Intersection Observer.**

### 13.2 The lazy-load contract

```ts
// pseudocode for components/verbatim/wavesurfer-player.tsx
function WaveSurferPlayer({ audioSrc, peaks, startMs, endMs }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Stage 1: observe viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsInView(true),
      { rootMargin: '200px' } // pre-load slightly off-screen
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Stage 2: instantiate only when in view
  useEffect(() => {
    if (!isInView || wavesurferRef.current) return;
    const ws = WaveSurfer.create({
      container: containerRef.current!,
      waveColor: '#6A6B70',          // --color-text-faint
      progressColor: '#4A9EFF',      // --color-blue
      cursorColor: '#4A9EFF',
      barWidth: 2,
      barGap: 2,
      barRadius: 2,
      height: 48,
      normalize: true,
      peaks: peaks ? [peaks] : undefined, // pre-computed peaks from server
      url: audioSrc,
    });
    ws.on('ready', () => setIsReady(true));
    wavesurferRef.current = ws;
    return () => ws.destroy();
  }, [isInView, audioSrc, peaks]);

  const handlePlay = () => {
    if (!wavesurferRef.current) return;
    wavesurferRef.current.setTime(startMs / 1000);
    wavesurferRef.current.play();
    // Optional: stop at endMs to constrain playback to the quote
    setTimeout(() => wavesurferRef.current?.pause(), endMs - startMs);
  };

  return (
    <div ref={containerRef} className="...">
      <button onClick={handlePlay} disabled={!isReady}>▶</button>
      {/* waveform renders into container via ref */}
    </div>
  );
}
```

### 13.3 Pre-computed peaks (server-side optimization)

To avoid every client decoding raw audio, the backend pre-computes the waveform peaks during the transcription Inngest job and stores them as a JSON array on the `chunks` table. The frontend passes these peaks to Wavesurfer, which skips audio decoding entirely for waveform rendering.

This makes every quote render its waveform in **<100ms**, only loading the actual audio bytes when the user clicks play.

### 13.4 The QuoteBlock layout

```
┌─────────────────────────────────────────────────────────┐
│  Speaker label (mono)                  [Source filename]│
│                                                         │
│  "The customer quote, rendered in Instrument Serif      │
│   italic 18px, with a 2px solid blue left border."      │
│                                                         │
│  [▶]  ▁▂▃▅▇▆▅▃▂▁▂▄▇▅▃▂▁     [04:12 → 04:31]            │
└─────────────────────────────────────────────────────────┘
```

Background: `--color-bg-elevated`. Padding: 20px 24px. Radius: `--radius-xl`. Margin between QuoteBlocks: 16px.

### 13.5 The audio source contract (with backend)

The Wavesurfer player receives:

- `audioSrc`: a **signed URL** from Supabase Storage with `Range` header support. The URL has 1-hour expiry. The frontend refreshes it via `/api/sources/[id]/audio-url` if the user keeps the page open past expiry.
- `peaks`: a 1D `number[]` array of pre-computed waveform peaks (~500–1000 samples per minute of audio).
- `startMs`, `endMs`: integer millisecond bounds for this quote.

The backend guarantees that `startMs` and `endMs` came from a verified citation (i.e., the substring check passed). The frontend never has to validate them.

### 13.6 Single-player playback rule

Only one Wavesurfer instance plays at a time. When the user clicks play on quote B while quote A is playing, quote A pauses immediately. This is implemented via a `currentPlayer` ref in a top-level `<ReportRenderer />` context.

---

## 14. Data integrity

### 14.1 The Zod boundary

Every API response that crosses into the frontend is validated by a Zod schema **at the route handler / server action layer**, not in the component. Components receive already-validated data via TanStack Query.

```ts
// Example — schemas/theme.ts
export const ThemeSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  recommendation: z.enum(['build', 'investigate', 'monitor', 'ignore']),
  quotes: z.array(z.object({
    text: z.string().min(1),
    speaker: z.string(),
    sourceId: z.string().uuid(),
    sourceFilename: z.string(),
    startMs: z.number().int().nonnegative(),
    endMs: z.number().int().positive(),
    peaks: z.array(z.number()).max(2000),
  })).length(3), // every theme has exactly 3 quotes — backend contract
  hasContradiction: z.boolean(),
  drawnFromSourceIds: z.array(z.string().uuid()).min(1),
});
```

If the backend returns malformed JSON, the route handler retries (per Inngest contract), and the frontend simply remains in a calm loading state. **The frontend never renders partial or invalid data.**

### 14.2 The error boundary contract

Every route in `app/(authenticated)` wraps its content in a top-level error boundary:

```tsx
// app/(authenticated)/error.tsx
'use client';
export default function Error({ error, reset }) {
  return (
    <div className="centered card --color-bg-elevated">
      <p className="font-mono text-sm text-[--color-danger]">// SOMETHING BROKE</p>
      <h2 className="font-display text-2xl">Hmm, that didn't work.</h2>
      <p className="text-soft">We've logged the error and will look into it.</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

The error UI **does not show stack traces, user IDs, or technical detail.** It logs to Sentry and shows the user a calm card. Same aesthetic as the rest of the app.

### 14.3 Empty states

Every list view has a designed empty state. No exceptions. The empty states use the same surface elevation (no special "empty" color). They contain:

- A mono section label `// NO PROJECTS YET` (or equivalent)
- A serif H2 of one sentence in Instrument Serif
- One sentence of body in `--color-text-soft`
- A primary CTA button (the action that fixes the empty state)

---

## 15. Accessibility & responsive

### 15.1 The accessibility floor

- **WCAG 2.2 AA contrast** on all text. Verified: `--color-text` on `--color-bg` = 17.4:1. `--color-text-soft` on `--color-bg` = 7.8:1. `--color-blue` on `--color-bg-elevated` = 5.6:1.
- **Keyboard navigation:** every interactive element reachable by Tab. Visible focus ring is `outline: 2px solid --color-blue, outline-offset: 2px`.
- **Screen reader labels** on every icon-only button (`aria-label`).
- **Wavesurfer player** announces play state changes via `aria-live="polite"`.
- **Reduced motion** baseline per Section 9.5.

### 15.2 The responsive baseline

v1 ships **desktop-first** because the ICP is PMs working on laptops with recordings. We commit to:

- ≥ 1280px: full layout, sidebar visible.
- 1080–1279px: sidebar collapses to icon rail (56px).
- 768–1079px: sidebar becomes a drawer triggered from the topbar. Split panes stack vertically (transcript above, sticky pane becomes a collapsed drawer below).
- < 768px (mobile): the **report view** (`/r/[slug]`) is fully responsive — quotes stack, Wavesurfer renders at 100% width. The **app surfaces** display a "Verbatim works best on desktop" banner with a CTA to email a link to themselves.

We do not ship a mobile app in v1. We do not invest in tablet-specific layouts.

---

## 16. Performance budgets

These are the only frontend performance metrics that matter. They are enforced via Lighthouse CI on every PR.

| Metric | Target | Hard ceiling |
|---|---|---|
| **First Contentful Paint** (landing) | ≤ 1.0s | 1.8s |
| **Largest Contentful Paint** (landing) | ≤ 1.5s | 2.5s |
| **First Contentful Paint** (app, authenticated) | ≤ 1.2s | 2.0s |
| **Time to Interactive** (app) | ≤ 2.0s | 3.5s |
| **JS bundle (per route, gzipped)** | ≤ 180kb | 250kb |
| **Wavesurfer first-render** (peaks pre-loaded) | ≤ 100ms | 250ms |
| **Wavesurfer time-to-play** (after click) | ≤ 600ms | 1.2s |
| **Cumulative Layout Shift** | ≤ 0.05 | 0.10 |

If a PR breaches a hard ceiling, it does not merge.

---

## 17. The forbidden list

A non-exhaustive list of what we do not ship. When in doubt, ask: "is this on the forbidden list?"

- ❌ Glassmorphism (backdrop-filter: blur on translucent panels — except for the paywall scrim, the only exception)
- ❌ Neon gradients, glow effects, "AI-generic" purple/cyan/magenta
- ❌ Pure white text (`#FFFFFF`) on pure black (`#000000`)
- ❌ Emoji in product UI (status indicators, button labels, microcopy)
- ❌ Exclamation points in microcopy (we are calm and authoritative)
- ❌ AI-chatbot tone ("Let's get you set up!", "Got it!")
- ❌ Tooltips on every icon (icons must be self-evident)
- ❌ Tour modals, onboarding checklists, "Welcome to Verbatim" splashes
- ❌ Marketing animations on the app side (no marketing copy after auth)
- ❌ Multiple primary buttons on one screen (one CTA per surface)
- ❌ Charts in v1
- ❌ Manual tag editing in v1
- ❌ Folders / nesting in v1
- ❌ Light mode in v1 (we are dark-only — light mode is a v3 decision)
- ❌ Inline image uploads (only audio/video/transcript files)
- ❌ Voice-to-action / "talk to your data" features
- ❌ Tooltips on Wavesurfer waveforms (the timestamp pill is enough)
- ❌ "Pro" / "Premium" badges sprinkled on locked features (we use the paywall overlay only)
- ❌ Footer on app routes (the topbar is the chrome; nothing below the workspace)
- ❌ Modals that contain modals
- ❌ More than 3 levels of visual hierarchy on any screen
- ❌ Redundant animations (e.g., button has both hover scale AND color change)
- ❌ Mid-conversation toast notifications during synthesis (the skeleton IS the notification)

---

## 18. Code conventions

### 18.1 File & folder naming

- Routes: `app/(public)/page.tsx`, `app/(authenticated)/projects/[id]/page.tsx`
- Components: `kebab-case.tsx` files, `PascalCase` exports
- Server actions: colocate with route under `actions.ts`
- Hooks: `use-thing-name.ts`
- Schemas: `schemas/[entity].ts`, all Zod
- Lib utilities: `lib/[domain].ts`

### 18.2 TypeScript baseline

```jsonc
// tsconfig.json (delta from Next.js default)
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "exactOptionalPropertyTypes": true
  }
}
```

Zero `any`. Zero `@ts-ignore`. If a type is unknowable, use `unknown` and validate before use.

### 18.3 Tailwind class ordering

Use `prettier-plugin-tailwindcss` to enforce. Order: layout → spacing → sizing → typography → color → border → effect → interaction.

### 18.4 Component prop naming

- Booleans start with `is`, `has`, `can`: `isReady`, `hasContradiction`, `canSynthesize`.
- Event handlers start with `on`: `onPlay`, `onSynthesize`.
- Render-callbacks start with `render`: `renderQuote`.

### 18.5 No prop drilling beyond 2 levels

If a prop must travel more than 2 components deep, use a colocated React Context (one per feature, never a global "AppContext").

---

## 19. Definition of Done

Every screen, before it merges to `main`, passes this 12-point checklist. No exceptions.

1. ☐ Uses only design tokens from Section 5 (no hex codes hardcoded in components)
2. ☐ Typography matches Section 6 (no font sizes outside the type scale)
3. ☐ Color usage respects Section 7.2 single-accent rules
4. ☐ Spacing is a multiple of 4px
5. ☐ Buttons follow Section 8.3 placement law
6. ☐ All interactive elements ≥ 40×40px (Section 8.4)
7. ☐ Animations follow Section 9 (Verbatim curve, approved patterns only)
8. ☐ Reduced-motion variant exists (Section 9.5)
9. ☐ Zod schema validates all incoming data (Section 14.1)
10. ☐ Error boundary present (Section 14.2)
11. ☐ Empty state designed (Section 14.3)
12. ☐ Lighthouse CI passes performance budgets (Section 16)

If a screen fails any of the above, it is not Done. It is "in progress."

---

## Appendix A — Competitor screen comparison

A reference table for prompt-time decisions. When Claude Code asks "how does X handle this?", we look up the verdict.

| Screen | Dovetail | Condens | Looppanel | **Verbatim verdict** |
|---|---|---|---|---|
| Sign-in | Email + password + SSO | Email + Google | Email + Google | Google only. No email field. |
| Empty project | Tour modal | Drag-drop zone with sample | Empty state with sample interview | Drag-drop zone, no sample, no tour |
| Upload progress | Inline mini-cards | Modal with global progress | Inline cards with status | Inline cards (Condens-style) |
| Transcript view | Tabs (transcript / notes / analysis) | Split: transcript + notes pane | Single column transcript | Split: transcript + sticky pain sidebar |
| Tag editor | Full taxonomy tree | Lightweight tag pill | Auto-tag with manual override | NO tag editor in v1 |
| Theme synthesis | "Cluster" button → modal config | "Synthesize" button → inline | "Generate insights" → modal | One button. No config. |
| Report layout | Custom blocks + drag-drop | Markdown-like + sidebar TOC | Cards with expandable themes | Pure Markdown, blockquotes with audio |
| Audio playback | In-line per highlight | Modal popup | In-line per quote | In-line, lazy-loaded, scoped to quote ms |
| Sharing | Public link with auth gate | Public link, requires email | Public link, no auth | Public link, no auth, no email gate |
| Export | PDF + CSV + Notion + Markdown | Markdown + PDF | Markdown + Notion | Markdown only in v1 |
| Pricing UI | Per-seat tiered table | Per-seat tiered | Per-seat + usage | Single button: "$29/mo Pro" |

---

## Appendix B — Prompt templates for Claude Code

These are the canonical openers for prompting Claude Code on Verbatim work. Copy, paste, fill in the brackets.

### B.1 Building a new screen

```
You are building screen [SCREEN NAME] for Verbatim, per the Frontend Bible.

Reference sections:
- Feature spec: Section [N] of FRONTEND_BIBLE.md
- Components: Section 12 of FRONTEND_BIBLE.md
- Tokens: Section 5 of FRONTEND_BIBLE.md
- Motion: Section 9 of FRONTEND_BIBLE.md

Backend contract: see VERBATIM_V1_BLUEPRINT.md Part [N].

Your task:
1. Build [PRECISE TASK].
2. Use only the components listed in Section 12. If a primitive is missing,
   build it in components/verbatim/ and document it inline.
3. Validate all incoming data with Zod (Section 14.1).
4. Run the Definition of Done checklist (Section 19) before declaring complete.

Do not introduce new colors, fonts, animations, or libraries without
explicitly flagging it in your output.
```

### B.2 Building a new component

```
You are building component [<ComponentName />] for Verbatim, per the Frontend Bible.

Spec source: Section [N] of FRONTEND_BIBLE.md

The component must:
1. Live at components/verbatim/[kebab-name].tsx.
2. Accept fully-typed props (TypeScript strict, no any).
3. Use only design tokens from Section 5 (no hex codes).
4. Match the motion patterns in Section 9.
5. Include a Storybook-style example in a sibling .examples.tsx file
   showing every state (default, hover, active, disabled, error).
6. Pass the Definition of Done checklist (Section 19).

Forbidden:
- New libraries
- New tokens
- New colors
- Inline styles
```

### B.3 Re-theming a shadcn primitive

```
You are re-theming the shadcn [primitive name] component for Verbatim, per
the Frontend Bible.

The default shadcn output uses Tailwind's stock colors. Replace every color
with our design tokens (Section 5):
- bg-background → bg-[--color-bg]
- bg-card → bg-[--color-bg-elevated]
- text-foreground → text-[--color-text]
- text-muted-foreground → text-[--color-text-soft]
- border → border-[--color-border]
- ring → ring-[--color-blue]

Replace every default font with our font stack (Section 6).

Do not modify the component's API. Re-theming is purely the className layer.
```

---

## Closing: the architectural longevity argument

This Bible exists because **every decision deferred to runtime is a decision made in panic.** The 11 v1 features, the 12-token color system, the single-accent strategy, the lazy-loaded Wavesurfer contract — none of these were obvious. They emerged from looking at the competitive landscape, the founder's stated aesthetic, the live landing page, and the cost model, and asking: *what is the leanest possible interface that delivers the Magic Moment?*

The answer is in this document.

From this point forward:

- **Founder time** is spent on prompts, customer interviews, and the synthesis prompt library — not on visual design decisions.
- **Claude Code time** is spent translating this Bible into shipped code — not on choosing fonts or colors.
- **Design partner feedback** updates this Bible with versioned amendments — not ad-hoc Slack changes.

When you're 6 weeks in and a design partner says *"can we make the Synthesize button green?"* — the answer is in Section 7.4: *blue is the citation accent, the citation is the moat, the button is the trigger of the citation moment, blue stays.*

The Bible holds the line so the founder can hold the wedge.

---

**End of Frontend Bible v1.0.0.**

*Print this. Pin it. Reference it by section number every time you prompt Claude Code. Amend it explicitly via PR with a versioned changelog. Never decide twice.*