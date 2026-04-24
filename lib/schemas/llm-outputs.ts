import { z } from "zod";

/* ---------------------------------------------------------------------------
 * Zod schemas for every LLM output.
 * Rule #2: every LLM output is validated. On failure, retry once with a
 * correction prompt. If the second attempt also fails, fail the job loudly.
 * ------------------------------------------------------------------------- */

/* --- Prompt A: per-interview pain extraction --- */

export const painSchema = z.object({
  description: z.string().min(4).max(400),
  severity: z.number().int().min(1).max(5),
  supporting_chunk_id: z.string().uuid(),
  verbatim_quote: z.string().min(4).max(800),
  context: z.string().max(400).optional().nullable(),
});

export const promptAOutputSchema = z.object({
  pains: z.array(painSchema),
});

export type PainExtraction = z.infer<typeof painSchema>;
export type PromptAOutput = z.infer<typeof promptAOutputSchema>;

/* --- Prompt B: theme synthesis per cluster --- */

export const themeCitationSchema = z.object({
  pain_id: z.string().uuid(),
  chunk_id: z.string().uuid(),
  display_order: z.union([z.literal(1), z.literal(2), z.literal(3)]),
});

export const promptBOutputSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(800),
  severity: z.number().int().min(1).max(5),
  frequency: z.number().int().min(1),
  contradiction_flag: z.boolean(),
  recommendation: z.enum(["build_now", "investigate", "monitor", "ignore"]),
  recommendation_reasoning: z.string().min(4).max(400),
  citations: z.array(themeCitationSchema).min(1).max(3),
});

export type ThemeSynthesis = z.infer<typeof promptBOutputSchema>;
export type ThemeCitation = z.infer<typeof themeCitationSchema>;

/* --- Prompt C: executive summary --- */
// Prompt C returns free-form markdown, so the "schema" is a minimal length check.
// The citation-verification loop (§3.4 in North Star, §6.1 in blueprint) runs
// independently on the themes, not on this markdown.
export const promptCOutputSchema = z
  .string()
  .min(100)
  .max(20_000)
  .refine((md) => md.trimStart().startsWith("# Customer Synthesis Report"), {
    message: "Report must start with the required H1 header.",
  });

export type ExecutiveSummary = z.infer<typeof promptCOutputSchema>;
