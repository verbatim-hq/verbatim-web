import Anthropic from "@anthropic-ai/sdk";

/**
 * Single Anthropic client for the entire server runtime.
 *
 * Rule #4: never imported into a client component. The SDK panics loudly if
 * the env var is missing — that's intentional, it's a deploy-time signal.
 *
 * Rule #5: every call through this client is expected to log to `llm_calls`.
 * The `withLogging` helper below is the preferred entry point. Don't call
 * `anthropic.messages.create` directly from a feature module.
 */

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey && process.env.NODE_ENV === "production") {
  throw new Error("ANTHROPIC_API_KEY is required in production.");
}

export const anthropic = new Anthropic({
  apiKey: apiKey ?? "placeholder-for-local-dev",
});

/* ---------------------------------------------------------------------------
 * Model identifiers — change here, nowhere else.
 * Per blueprint §4.1: Sonnet 4.5 for synthesis, Haiku 4.5 for extraction.
 * ------------------------------------------------------------------------- */

export const MODELS = {
  SYNTHESIS: "claude-sonnet-4-5",
  EXTRACTION: "claude-haiku-4-5",
} as const;

/* ---------------------------------------------------------------------------
 * Pricing (per million tokens, in cents). Used to compute cost_cents for
 * `llm_calls`. Keep in sync with Anthropic's pricing page.
 * ------------------------------------------------------------------------- */

export const MODEL_PRICING_CENTS_PER_MTOK = {
  "claude-sonnet-4-5": { input: 300, output: 1500 },
  "claude-haiku-4-5": { input: 100, output: 500 },
} as const;

export function costCents(
  model: keyof typeof MODEL_PRICING_CENTS_PER_MTOK,
  inputTokens: number,
  outputTokens: number,
): number {
  const pricing = MODEL_PRICING_CENTS_PER_MTOK[model];
  // price is cents per million tokens; divide accordingly, round to nearest cent
  return Math.round(
    (inputTokens * pricing.input) / 1_000_000 +
      (outputTokens * pricing.output) / 1_000_000,
  );
}
