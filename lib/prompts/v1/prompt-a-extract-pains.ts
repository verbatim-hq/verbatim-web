/**
 * PROMPT A · Per-interview pain extraction
 * Model: claude-haiku-4-5
 * Version: v1.0.0 · April 23, 2026
 *
 * Purpose: Analyze ONE customer interview transcript and extract every
 * distinct pain point, frustration, or unmet need the PARTICIPANT expresses
 * (not the interviewer).
 *
 * RULES FOR EDITING THIS FILE:
 *   1. NEVER mutate in place. To change the prompt, copy this whole file to
 *      `prompt-a-extract-pains.v1.0.1.ts` and bump `PROMPT_A_VERSION`.
 *   2. The old version MUST stay in the repo so historical analyses remain
 *      reproducible. Delete old versions only after a full year of no usage.
 *   3. Before merging a new version, run it against at least 3 of the
 *      validation-phase recordings. Document eval results in the PR body.
 *
 * This prompt is product IP. Treat it with more care than any TS file.
 */

export const PROMPT_A_VERSION = "v1.0.0" as const;

export const PROMPT_A_SYSTEM = `\
You are a senior product research analyst. Your task: analyze one customer interview \
transcript and extract every distinct pain point, frustration, or unmet need the \
PARTICIPANT expresses. Return strictly valid JSON matching the provided schema.

Rules:
1. Only extract pains stated by the PARTICIPANT. Use speaker labels to distinguish \
from the interviewer.
2. For each pain, provide the verbatim supporting quote EXACTLY as it appears in the \
transcript. Do not paraphrase, combine, or clean up quotes.
3. For each quote, provide the chunk_id from the input. You will be given chunks with \
ids — use those exact ids.
4. If the same pain is mentioned multiple times, extract it once and cite the single \
strongest quote (the one with the clearest stated impact).
5. Severity scale:
   1 = mild irritation, workaround exists
   2 = consistent friction, slows work
   3 = notable pain, actively seeking workarounds
   4 = blocking, abandons task or complains frequently
   5 = deal-breaker, would switch tools / has churned over this
6. Return ONLY valid JSON matching the schema. No prose, no markdown, no code fences.`;

/**
 * Build the user message for Prompt A. Keeps the system prompt stable (so
 * Anthropic can cache it) and varies only the chunks per call.
 */
export function buildPromptAUserMessage(chunks: ReadonlyArray<{
  id: string;
  speaker: string;
  text: string;
  timestamp_start_ms: number;
  timestamp_end_ms: number;
}>): string {
  const formatted = chunks
    .map(
      (c) =>
        `<chunk id="${c.id}" speaker="${c.speaker}" start_ms="${c.timestamp_start_ms}" end_ms="${c.timestamp_end_ms}">\n${c.text}\n</chunk>`,
    )
    .join("\n\n");

  return `Interview transcript (chunked by speaker turn):\n\n${formatted}\n\nReturn a JSON object with key "pains" — an array of pain objects per the schema.`;
}
