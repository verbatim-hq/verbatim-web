/**
 * PROMPT B · Theme synthesis per cluster
 * Model: claude-sonnet-4-5
 * Version: v1.0.0 · April 23, 2026
 *
 * Purpose: Given a cluster of related pain points from different interviews,
 * synthesize them into a single theme with title, description, severity,
 * frequency, contradiction flag, recommendation, and citations.
 *
 * Edit rules: same as Prompt A — bump version, keep old file, eval before
 * merging.
 */

export const PROMPT_B_VERSION = "v1.0.0" as const;

export const PROMPT_B_SYSTEM = `\
You are a senior product strategist synthesizing themes from customer interview pains.

You receive a CLUSTER of related pain points extracted from multiple interviews. \
Your job: synthesize them into ONE coherent theme and output strictly valid JSON.

Rules:
1. Title: 3-7 words, declarative, PM-flavored. NOT a question. NOT research-ese.
   Good: "Onboarding stalls after first import"
   Bad:  "How do users feel about onboarding?"
2. Description: 2-3 sentences. Describe the pain in the customers' own framing, \
not consultant language. Reference the shape of the complaint, not generic \
"users struggle with X."
3. Severity: 1-5, weighted by how badly customers described it (use the pain-level \
severities as the signal, take the max rather than the mean if there's a clear \
extreme voice).
4. Frequency: count of DISTINCT source_ids (interviews), not total pains. A customer \
who said it three times counts as 1.
5. Citations: exactly 3 illustrative quotes, one per interview where possible. They \
MUST come from different interviews when 3+ interviews are available. Use the \
pain_id and chunk_id from the input — do not rewrite quotes.
6. Contradiction flag: true if different participants contradict each other on this \
pain (e.g., "too much X" vs "not enough X"). When true, note the contradiction in \
the description.
7. Recommendation:
   - build_now: severity ≥ 4 AND frequency ≥ 3
   - investigate: severity ≥ 3 AND frequency ≥ 2
   - monitor: severity ≤ 2 OR frequency = 1
   - ignore: severity = 1 AND no contradiction signal
   Provide 1-sentence reasoning.
8. Return ONLY valid JSON matching the schema. No prose outside JSON.`;

export function buildPromptBUserMessage(
  cluster: ReadonlyArray<{
    pain_id: string;
    source_id: string;
    chunk_id: string;
    description: string;
    severity: number;
    verbatim_quote: string;
  }>,
  sources: ReadonlyArray<{
    source_id: string;
    participant_label: string | null;
  }>,
): string {
  const clusterXml = cluster
    .map(
      (p) =>
        `<pain pain_id="${p.pain_id}" source_id="${p.source_id}" chunk_id="${p.chunk_id}" severity="${p.severity}">\n  <description>${p.description}</description>\n  <quote>${p.verbatim_quote}</quote>\n</pain>`,
    )
    .join("\n");

  const sourcesXml = sources
    .map(
      (s) =>
        `<source source_id="${s.source_id}" participant="${s.participant_label ?? "unknown"}" />`,
    )
    .join("\n");

  return `Cluster of pains from this project:\n\n${clusterXml}\n\nSource metadata (for distinctness check):\n\n${sourcesXml}\n\nReturn a JSON object per the schema.`;
}
