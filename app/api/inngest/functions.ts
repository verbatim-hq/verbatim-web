import { inngest } from "@/lib/inngest/client";
import {
  fetchTranscript,
  submitTranscriptionJob,
  transcriptWordSchema,
} from "@/lib/assembly";
import { anthropic, costCents, MODELS, type PricedModel } from "@/lib/ai/anthropic";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import {
  SynthesisReportSchema,
  TranscriptJsonSchema,
  mapQuoteToTimestamps,
  transcriptTextFromWords,
  verifyAllQuotesAreSubstrings,
  ProjectReportSchema,
  normalizeForMatch,
} from "@/lib/synthesis";
import { z } from "zod";

const sourceUploadedEventSchema = z.object({
  data: z.object({
    sourceId: z.string().uuid(),
    projectId: z.string().uuid(),
  }),
});

const assemblyCompletedEventSchema = z.object({
  data: z.object({
    assembly_ai_id: z.string().min(1),
    status: z.enum(["completed", "error"]),
  }),
});

const sourceTranscribedEventSchema = z.object({
  data: z.object({
    sourceId: z.string().uuid(),
  }),
});

export const sourceUploaded = inngest.createFunction(
  { id: "verbatim-source-uploaded" },
  { event: "source.uploaded" },
  async ({ event, step }) => {
    const parsedEvent = sourceUploadedEventSchema.safeParse(event);
    if (!parsedEvent.success) throw new Error("Invalid event payload");

    const sourceId = parsedEvent.data.data.sourceId;

    console.info("[inngest] source.uploaded start", { sourceId });

    const { assemblyAiId } = await step.run("sign-and-send", async () => {
      const supabase = getSupabaseServiceRoleClient();

      const { data: source, error: sourceError } = await supabase
        .from("sources")
        .select("id, org_id, storage_path, status")
        .eq("id", sourceId)
        .maybeSingle();

      if (sourceError || !source) throw new Error("Source not found");

      const { data: signed, error: signedError } = await supabase.storage
        .from("interviews")
        .createSignedUrl(source.storage_path, 60 * 60);

      if (signedError || !signed?.signedUrl) {
        throw new Error("Failed to create signed read URL");
      }

      const appUrl = process.env.NEXT_PUBLIC_APP_URL;
      if (!appUrl) throw new Error("Missing NEXT_PUBLIC_APP_URL");

      const webhookAuth = process.env.ASSEMBLYAI_WEBHOOK_AUTH;
      if (!webhookAuth) throw new Error("Missing ASSEMBLYAI_WEBHOOK_AUTH");

      const webhookUrl = new URL("/api/webhooks/assembly", appUrl).toString();

      const submitted = await submitTranscriptionJob({
        audioUrl: signed.signedUrl,
        webhookUrl,
        webhookAuthHeaderName: "authorization",
        webhookAuthHeaderValue: `Bearer ${webhookAuth}`,
      });

      const { error: updateError } = await supabase
        .from("sources")
        .update({ assembly_ai_id: submitted.assemblyAiId, status: "transcribing" })
        .eq("id", sourceId);

      if (updateError) throw new Error("Failed to update source with AssemblyAI id");

      return { assemblyAiId: submitted.assemblyAiId };
    });

    console.info("[inngest] assembly submitted", { sourceId, assemblyAiId });

    const waited = await step.waitForEvent("wait-for-assembly", {
      event: "assembly.completed",
      timeout: "1h",
      match: "data.assembly_ai_id",
    });

    const parsedWait = assemblyCompletedEventSchema.safeParse(waited);
    if (!parsedWait.success) throw new Error("Invalid assembly.completed payload");

    if (parsedWait.data.data.assembly_ai_id !== assemblyAiId) {
      throw new Error("Mismatched AssemblyAI id");
    }

    console.info("[inngest] assembly completed event received", {
      sourceId,
      assemblyAiId,
      status: parsedWait.data.data.status,
    });

    if (parsedWait.data.data.status !== "completed") {
      await step.run("mark-failed", async () => {
        const supabase = getSupabaseServiceRoleClient();
        await supabase.from("sources").update({ status: "failed" }).eq("id", sourceId);
      });
      console.error("[inngest] transcription failed", { sourceId, assemblyAiId });
      return { ok: false, sourceId, assemblyAiId, status: "failed" as const };
    }

    const persisted = await step.run("persist-transcript", async () => {
      const transcript = await fetchTranscript(parsedWait.data.data.assembly_ai_id);

      const words = transcript.words ?? null;
      if (!words || words.length === 0) throw new Error("AssemblyAI transcript missing words array");

      // Validate each word before persisting to Postgres.
      const wordsParsed = z.array(transcriptWordSchema).safeParse(words);
      if (!wordsParsed.success) throw new Error("Invalid words payload");

      const durationSeconds =
        typeof transcript.audio_duration === "number"
          ? Math.max(0, Math.round(transcript.audio_duration))
          : null;

      const supabase = getSupabaseServiceRoleClient();
      const { error } = await supabase
        .from("sources")
        .update({
          transcript_json: { words: wordsParsed.data },
          duration: durationSeconds,
          status: "transcribed",
        })
        .eq("id", sourceId);

      if (error) throw new Error("Failed to persist transcript");
      return { durationSeconds };
    });

    console.info("[inngest] transcript persisted", {
      sourceId,
      assemblyAiId,
      durationSeconds: persisted.durationSeconds,
    });

    await step.run("emit-source-transcribed", async () => {
      await inngest.send({
        name: "source.transcribed",
        data: { sourceId },
      });
    });

    return {
      ok: true,
      sourceId,
      assemblyAiId,
      durationSeconds: persisted.durationSeconds,
    };
  },
);

const synthesisToolInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    themes: {
      type: "array",
      minItems: 1,
      maxItems: 10,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string", minLength: 1, maxLength: 120 },
          description: { type: "string", minLength: 1, maxLength: 800 },
          quotes: {
            type: "array",
            minItems: 1,
            maxItems: 6,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                text: { type: "string", minLength: 1, maxLength: 800 },
                speaker: { type: "string", minLength: 1, maxLength: 24 },
              },
              required: ["text", "speaker"],
            },
          },
        },
        required: ["name", "description", "quotes"],
      },
    },
  },
  required: ["themes"],
} as const;

export const synthesisGenerate = inngest.createFunction(
  { id: "verbatim-synthesis-generate" },
  { event: "source.transcribed" },
  async ({ event, step }) => {
    const parsed = sourceTranscribedEventSchema.safeParse(event);
    if (!parsed.success) throw new Error("Invalid source.transcribed payload");

    const sourceId = parsed.data.data.sourceId;

    const initialized = await step.run("initialize-report", async () => {
      const supabase = getSupabaseServiceRoleClient();

      const { data: source, error } = await supabase
        .from("sources")
        .select("id, org_id, project_id, transcript_json, status")
        .eq("id", sourceId)
        .maybeSingle();

      if (error || !source) throw new Error("Source not found");
      if (!source.transcript_json) throw new Error("Missing transcript_json");

      const { data: report, error: reportError } = await supabase
        .from("reports")
        .upsert(
          {
            org_id: source.org_id,
            source_id: sourceId,
            project_id: source.project_id,
            status: "synthesizing",
            content_json: null,
          },
          { onConflict: "source_id" },
        )
        .select("id, org_id")
        .maybeSingle();

      if (reportError || !report) throw new Error("Failed to initialize report");

      return {
        reportId: report.id as string,
        orgId: report.org_id as string,
        transcriptJson: source.transcript_json as unknown,
      };
    });

    const generated = await step.run("generate-and-verify-synthesis", async () => {
      const transcriptParsed = TranscriptJsonSchema.safeParse(initialized.transcriptJson);
      if (!transcriptParsed.success) throw new Error("Invalid transcript_json");

      const transcriptText = transcriptTextFromWords(transcriptParsed.data.words);

      const system =
        "You are an exact-extraction engine.\n" +
        "Only output quotes that are EXACT substrings of the provided transcript text.\n" +
        "Never paraphrase. Never summarize quotes. Never merge non-contiguous spans.\n" +
        "Return JSON via the provided tool only.";

      const start = Date.now();
      const msg = await anthropic.messages.create({
        model: MODELS.SYNTHESIS,
        max_tokens: 1400,
        system,
        messages: [
          {
            role: "user",
            content:
              "Extract 3-7 themes from this transcript. Each theme must include 2-4 direct quotes.\n\n" +
              "Transcript:\n" +
              transcriptText,
          },
        ],
        tools: [
          {
            name: "submit_synthesis_report",
            description:
              "Submit the synthesis report strictly matching the schema.",
            input_schema: synthesisToolInputSchema,
          },
        ],
        tool_choice: { type: "tool", name: "submit_synthesis_report" },
      });
      const latencyMs = Date.now() - start;

      const usage = msg.usage;
      const promptTokens = usage?.input_tokens ?? null;
      const completionTokens = usage?.output_tokens ?? null;

      // Extract tool payload (Anthropic tool_use block includes an `id` field).
      const toolUse = msg.content.find(
        (
          c,
        ): c is { type: "tool_use"; id: string; name: string; input: unknown } =>
          typeof c === "object" &&
          c !== null &&
          "type" in c &&
          (c as { type?: unknown }).type === "tool_use" &&
          "name" in c &&
          (c as { name?: unknown }).name === "submit_synthesis_report" &&
          "id" in c &&
          "input" in c,
      );

      if (!toolUse) throw new Error("Missing tool output");

      const reportParsed = SynthesisReportSchema.safeParse(toolUse.input);
      if (!reportParsed.success) throw new Error("Invalid synthesis schema");

      // Log the LLM call immediately (cost + tokens).
      await (async () => {
        const supabase = getSupabaseServiceRoleClient();
        const pricedModel = MODELS.SYNTHESIS as unknown as PricedModel;

        const input = typeof promptTokens === "number" ? promptTokens : null;
        const output = typeof completionTokens === "number" ? completionTokens : null;

        const cost =
          typeof input === "number" && typeof output === "number"
            ? costCents(pricedModel, input, output)
            : null;

        await supabase.from("llm_calls").insert({
          org_id: initialized.orgId,
          user_id: null,
          source_id: sourceId,
          model: MODELS.SYNTHESIS,
          purpose: "synthesis_report",
          prompt_version: "feature_4_v1",
          input_tokens: input,
          output_tokens: output,
          prompt_tokens: input,
          completion_tokens: output,
          cost_cents: cost,
          latency_ms: latencyMs,
          success: true,
          error_message: null,
        });
      })();

      // Citation verification loop (CRITICAL).
      verifyAllQuotesAreSubstrings({
        transcriptText,
        report: reportParsed.data,
      });

      return {
        transcript: transcriptParsed.data,
        transcriptText,
        report: reportParsed.data,
      };
    });

    const timestamped = await step.run("map-timestamps", async () => {
      const words = generated.transcript.words;

      const mapped = generated.report.themes.map((t) => ({
        name: t.name,
        description: t.description,
        quotes: t.quotes.map((q) => {
          const ts = mapQuoteToTimestamps({ words, quoteText: q.text });
          return {
            text: q.text,
            speaker: q.speaker,
            start_ms: ts.start_ms,
            end_ms: ts.end_ms,
          };
        }),
      }));

      return { themes: mapped };
    });

    await step.run("finalize-report", async () => {
      const supabase = getSupabaseServiceRoleClient();
      const { error } = await supabase
        .from("reports")
        .update({
          status: "completed",
          content_json: timestamped,
        })
        .eq("id", initialized.reportId);

      if (error) throw new Error("Failed to finalize report");
    });

    return { ok: true, sourceId, reportId: initialized.reportId };
  },
);

const projectSynthesizeEventSchema = z.object({
  data: z.object({
    projectId: z.string().uuid(),
    orgId: z.string().uuid(),
  }),
});

const projectSynthesisToolSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    themes: {
      type: "array",
      minItems: 1,
      maxItems: 12,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string", minLength: 1, maxLength: 120 },
          description: { type: "string", minLength: 1, maxLength: 800 },
          quotes: {
            type: "array",
            minItems: 1,
            maxItems: 12,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                text: { type: "string", minLength: 1, maxLength: 800 },
                speaker: { type: "string", minLength: 1, maxLength: 24 },
                start_ms: { type: "integer", minimum: 0 },
                end_ms: { type: "integer", minimum: 0 },
                source_id: { type: "string" },
              },
              required: ["text", "speaker", "start_ms", "end_ms", "source_id"],
            },
          },
        },
        required: ["name", "description", "quotes"],
      },
    },
  },
  required: ["themes"],
} as const;

export const projectSynthesize = inngest.createFunction(
  { id: "verbatim-project-synthesize" },
  { event: "project.synthesize" },
  async ({ event, step }) => {
    const parsed = projectSynthesizeEventSchema.safeParse(event);
    if (!parsed.success) throw new Error("Invalid project.synthesize payload");

    const projectId = parsed.data.data.projectId;
    const orgId = parsed.data.data.orgId;

    const prepared = await step.run("prepare-aggregation", async () => {
      const supabase = getSupabaseServiceRoleClient();

      const { data: rows, error } = await supabase
        .from("reports")
        .select("id, source_id, project_id, org_id, status, content_json")
        .eq("project_id", projectId)
        .eq("status", "completed");

      if (error) throw new Error("Failed to fetch completed reports");
      if (!rows || rows.length < 1) throw new Error("No completed reports to aggregate");

      // Build a strict quote map keyed by source_id.
      const quoteKeySet = new Set<string>();

      const lean = rows.map((r) => {
        const parsedReport = SynthesisReportSchema.safeParse(r.content_json);
        if (!parsedReport.success) {
          throw new Error("Invalid individual report content_json");
        }

        const themes = parsedReport.data.themes.map((t) => ({
          name: t.name,
          description: t.description,
          quotes: t.quotes
            .filter(
              (q) => typeof q.start_ms === "number" && typeof q.end_ms === "number",
            )
            .map((q) => {
              const key =
                `${r.source_id}|${normalizeForMatch(q.text)}|${q.start_ms}|${q.end_ms}`;
              quoteKeySet.add(key);
              return {
                text: q.text,
                speaker: q.speaker,
                start_ms: q.start_ms as number,
                end_ms: q.end_ms as number,
                source_id: r.source_id as string,
              };
            }),
        }));

        return { source_id: r.source_id as string, themes };
      });

      const { data: pr, error: upsertError } = await supabase
        .from("project_reports")
        .upsert(
          {
            org_id: orgId,
            project_id: projectId,
            status: "synthesizing",
            content_json: null,
          },
          { onConflict: "project_id" },
        )
        .select("id")
        .maybeSingle();

      if (upsertError || !pr) throw new Error("Failed to initialize project report");

      return {
        projectReportId: pr.id as string,
        leanReports: lean,
        quoteKeySet: Array.from(quoteKeySet),
      };
    });

    const generated = await step.run("generate-macro-synthesis", async () => {
      const system =
        "You are an aggregation engine.\n" +
        "Group insights into macro-themes.\n" +
        "Use ONLY the exact quotes provided.\n" +
        "Retain exact source_id, start_ms, and end_ms for each quote.\n" +
        "Return JSON via the provided tool only.";

      const start = Date.now();
      const msg = await anthropic.messages.create({
        model: MODELS.SYNTHESIS,
        max_tokens: 1800,
        system,
        messages: [
          {
            role: "user",
            content:
              "Here are individual interview reports with verified quotes.\n" +
              "Generate a project-level synthesis.\n\n" +
              JSON.stringify(prepared.leanReports),
          },
        ],
        tools: [
          {
            name: "submit_project_report",
            description: "Submit a project-level synthesis report.",
            input_schema: projectSynthesisToolSchema,
          },
        ],
        tool_choice: { type: "tool", name: "submit_project_report" },
      });
      const latencyMs = Date.now() - start;

      const toolUse = msg.content.find(
        (
          c,
        ): c is { type: "tool_use"; id: string; name: string; input: unknown } =>
          typeof c === "object" &&
          c !== null &&
          "type" in c &&
          (c as { type?: unknown }).type === "tool_use" &&
          "name" in c &&
          (c as { name?: unknown }).name === "submit_project_report" &&
          "id" in c &&
          "input" in c,
      );
      if (!toolUse) throw new Error("Missing tool output");

      const parsedOutput = ProjectReportSchema.safeParse(toolUse.input);
      if (!parsedOutput.success) throw new Error("Invalid project report schema");

      // Observability: log LLM call mapped to project_id.
      const usage = msg.usage;
      const promptTokens = usage?.input_tokens ?? null;
      const completionTokens = usage?.output_tokens ?? null;

      const supabase = getSupabaseServiceRoleClient();
      const pricedModel = MODELS.SYNTHESIS as unknown as PricedModel;

      const input = typeof promptTokens === "number" ? promptTokens : null;
      const output = typeof completionTokens === "number" ? completionTokens : null;
      const cost =
        typeof input === "number" && typeof output === "number"
          ? costCents(pricedModel, input, output)
          : null;

      await supabase.from("llm_calls").insert({
        org_id: orgId,
        user_id: null,
        project_id: projectId,
        source_id: null,
        model: MODELS.SYNTHESIS,
        purpose: "project_synthesis",
        prompt_version: "feature_6_v1",
        input_tokens: input,
        output_tokens: output,
        prompt_tokens: input,
        completion_tokens: output,
        cost_cents: cost,
        latency_ms: latencyMs,
        success: true,
        error_message: null,
      });

      return parsedOutput.data;
    });

    await step.run("cross-source-verification", async () => {
      const valid = new Set(prepared.quoteKeySet);

      for (const theme of generated.themes) {
        for (const q of theme.quotes) {
          const key = `${q.source_id}|${normalizeForMatch(q.text)}|${q.start_ms}|${q.end_ms}`;
          if (!valid.has(key)) {
            throw new Error(
              "Aggregation Verification Failed: Hallucinated quote detected.",
            );
          }
        }
      }
    });

    await step.run("finalize-project-report", async () => {
      const supabase = getSupabaseServiceRoleClient();
      const { error } = await supabase
        .from("project_reports")
        .update({ status: "completed", content_json: generated })
        .eq("id", prepared.projectReportId);

      if (error) throw new Error("Failed to finalize project report");
    });

    return { ok: true, projectId, projectReportId: prepared.projectReportId };
  },
);

export const functions = [sourceUploaded, synthesisGenerate, projectSynthesize];

