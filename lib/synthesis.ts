import { z } from "zod";

export const QuoteSchema = z.object({
  text: z.string().min(1).max(800),
  speaker: z.string().min(1).max(24),
  // Added in Feature 4 Step 3.
  start_ms: z.number().int().nonnegative().optional(),
  end_ms: z.number().int().nonnegative().optional(),
});

export const ThemeSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().min(1).max(800),
  quotes: z.array(QuoteSchema).min(1).max(6),
});

export const SynthesisReportSchema = z.object({
  themes: z.array(ThemeSchema).min(1).max(10),
});

export type Quote = z.infer<typeof QuoteSchema>;
export type Theme = z.infer<typeof ThemeSchema>;
export type SynthesisReport = z.infer<typeof SynthesisReportSchema>;

export const TranscriptWordSchema = z.object({
  start: z.number().int().nonnegative(),
  end: z.number().int().nonnegative(),
  text: z.string(),
  speaker: z.union([z.string(), z.null()]),
});

export const TranscriptJsonSchema = z.object({
  words: z.array(TranscriptWordSchema).min(1),
});

export type TranscriptWord = z.infer<typeof TranscriptWordSchema>;
export type TranscriptJson = z.infer<typeof TranscriptJsonSchema>;

// ---------------------------------------------------------------------------
// Feature 6: Multi-source aggregation schemas
// ---------------------------------------------------------------------------

export const AggregatedQuoteSchema = z.object({
  text: z.string().min(1).max(800),
  speaker: z.string().min(1).max(24),
  start_ms: z.number().int().nonnegative(),
  end_ms: z.number().int().nonnegative(),
  source_id: z.string().uuid(),
});

export const ProjectThemeSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().min(1).max(800),
  quotes: z.array(AggregatedQuoteSchema).min(1).max(12),
});

export const ProjectReportSchema = z.object({
  themes: z.array(ProjectThemeSchema).min(1).max(12),
});

export type AggregatedQuote = z.infer<typeof AggregatedQuoteSchema>;
export type ProjectTheme = z.infer<typeof ProjectThemeSchema>;
export type ProjectReport = z.infer<typeof ProjectReportSchema>;

export function normalizeForMatch(input: string): string {
  return input.toLowerCase().replace(/\s+/g, " ").trim();
}

function normalizeToken(token: string): string {
  return token
    .toLowerCase()
    .replace(/^[^\p{L}\p{N}]+/gu, "")
    .replace(/[^\p{L}\p{N}]+$/gu, "");
}

export function transcriptTextFromWords(words: ReadonlyArray<TranscriptWord>): string {
  return words.map((w) => w.text).join(" ").replace(/\s+/g, " ").trim();
}

export function verifyAllQuotesAreSubstrings(params: {
  transcriptText: string;
  report: SynthesisReport;
}): void {
  const normalizedTranscript = normalizeForMatch(params.transcriptText);

  for (const theme of params.report.themes) {
    for (const quote of theme.quotes) {
      const normalizedQuote = normalizeForMatch(quote.text);
      if (!normalizedTranscript.includes(normalizedQuote)) {
        throw new Error(
          "Citation Verification Failed: Hallucinated quote detected.",
        );
      }
    }
  }
}

export function mapQuoteToTimestamps(params: {
  words: ReadonlyArray<TranscriptWord>;
  quoteText: string;
}): { start_ms: number; end_ms: number } {
  const quoteTokensRaw = params.quoteText.split(/\s+/).filter(Boolean);
  const quoteTokens = quoteTokensRaw
    .map(normalizeToken)
    .filter((t) => t.length > 0);

  if (quoteTokens.length === 0) {
    throw new Error("Empty quote tokenization");
  }

  const words = params.words;
  const wordTokens = words.map((w) => normalizeToken(w.text));

  // Sliding window match. We match by token sequence to find exact ms range.
  for (let i = 0; i <= wordTokens.length - quoteTokens.length; i += 1) {
    let ok = true;
    for (let j = 0; j < quoteTokens.length; j += 1) {
      if (wordTokens[i + j] !== quoteTokens[j]) {
        ok = false;
        break;
      }
    }
    if (ok) {
      const start = words[i]?.start;
      const end = words[i + quoteTokens.length - 1]?.end;
      if (typeof start !== "number" || typeof end !== "number") {
        throw new Error("Timestamp mapping failed");
      }
      return { start_ms: start, end_ms: end };
    }
  }

  throw new Error("Timestamp mapping failed: quote not found in words array");
}

