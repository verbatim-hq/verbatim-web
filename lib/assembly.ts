import "server-only";

import { AssemblyAI, type Transcript } from "assemblyai";
import { z } from "zod";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

export const assemblyWebhookSchema = z.object({
  transcript_id: z.string().min(1),
  status: z.enum(["completed", "error"]),
});

export type AssemblyWebhookPayload = z.infer<typeof assemblyWebhookSchema>;

export const transcriptWordSchema = z.object({
  start: z.number().int().nonnegative(),
  end: z.number().int().nonnegative(),
  text: z.string(),
  speaker: z.union([z.string(), z.null()]),
  confidence: z.number().optional(),
});

export const assemblyTranscriptSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["queued", "processing", "completed", "error"]),
  audio_duration: z.union([z.number(), z.null()]).optional(),
  words: z.union([z.array(transcriptWordSchema), z.null()]).optional(),
  text: z.union([z.string(), z.null()]).optional(),
});

export type AssemblyTranscript = z.infer<typeof assemblyTranscriptSchema>;

export function getAssemblyClient(): AssemblyAI {
  return new AssemblyAI({ apiKey: requiredEnv("ASSEMBLYAI_API_KEY") });
}

export async function submitTranscriptionJob(params: {
  audioUrl: string;
  webhookUrl: string;
  webhookAuthHeaderName: string;
  webhookAuthHeaderValue: string;
}): Promise<{ assemblyAiId: string }> {
  const client = getAssemblyClient();

  const transcript = await client.transcripts.submit({
    audio_url: params.audioUrl,
    // Universal-3 Pro required (Feature 3).
    speech_models: ["universal-3-pro"],
    speaker_labels: true,
    webhook_url: params.webhookUrl,
    webhook_auth_header_name: params.webhookAuthHeaderName,
    webhook_auth_header_value: params.webhookAuthHeaderValue,
  });

  const id = (transcript as Transcript).id;
  if (!id) throw new Error("AssemblyAI did not return transcript id");
  return { assemblyAiId: id };
}

export async function fetchTranscript(assemblyAiId: string): Promise<AssemblyTranscript> {
  const client = getAssemblyClient();
  const transcript = await client.transcripts.get(assemblyAiId);
  const parsed = assemblyTranscriptSchema.safeParse(transcript);
  if (!parsed.success) throw new Error("Invalid transcript payload from AssemblyAI");
  return parsed.data;
}

