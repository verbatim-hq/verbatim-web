"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { inngest } from "@/lib/inngest/client";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import crypto from "node:crypto";
import { checkUsageLimit } from "@/lib/billing";

const createProjectSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(600).optional(),
});

async function requireOrgId() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.rpc("current_org_id");
  if (error) throw new Error("Unable to resolve org");
  if (typeof data !== "string" || data.length === 0) throw new Error("Missing org");
  return { supabase, orgId: data };
}

export async function createProjectAction(input: unknown): Promise<void> {
  const parsed = createProjectSchema.safeParse(input);
  if (!parsed.success) throw new Error("Invalid input");

  const { supabase, orgId } = await requireOrgId();

  const { error } = await supabase.from("projects").insert({
    org_id: orgId,
    name: parsed.data.name.trim(),
    description: parsed.data.description?.trim() || null,
  });

  if (error) throw new Error("Failed to create project");
  revalidatePath("/projects");
}

const startUploadSchema = z.object({
  projectId: z.string().uuid(),
  originalFilename: z.string().min(1).max(300),
  kind: z.enum(["audio", "video"]),
  extension: z.enum(["mp3", "m4a", "wav", "mp4", "mov"]),
  contentType: z.string().min(1).max(120).optional(),
});

export type StartUploadResult = Readonly<{
  sourceId: string;
  storagePath: string;
  signedUrl: string;
}>;

export async function startUploadAction(input: unknown): Promise<StartUploadResult> {
  const parsed = startUploadSchema.safeParse(input);
  if (!parsed.success) throw new Error("Invalid input");

  const { supabase, orgId } = await requireOrgId();

  const usage = await checkUsageLimit(orgId);
  if (!usage.allowed) throw new Error("PAYWALL_LIMIT_REACHED");

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id")
    .eq("id", parsed.data.projectId)
    .maybeSingle();

  if (projectError) throw new Error("Failed to validate project");
  if (!project) throw new Error("Project not found");

  const sourceId = crypto.randomUUID();
  // Storage object names live inside the `interviews` bucket at:
  //   {org_id}/{source_id}.{ext}
  const storagePath = `${orgId}/${sourceId}.${parsed.data.extension}`;

  const { error: insertError } = await supabase.from("sources").insert({
    id: sourceId,
    project_id: parsed.data.projectId,
    org_id: orgId,
    kind: parsed.data.kind,
    status: "uploading",
    storage_path: storagePath,
    original_filename: parsed.data.originalFilename,
  });

  if (insertError) throw new Error("Failed to create source");

  const { data: signed, error: signedError } = await supabase.storage
    .from("interviews")
    .createSignedUploadUrl(storagePath, { upsert: false });

  if (signedError || !signed?.signedUrl) {
    throw new Error("Failed to create signed upload URL");
  }

  return { sourceId, storagePath, signedUrl: signed.signedUrl };
}

const completeUploadSchema = z.object({
  sourceId: z.string().uuid(),
});

export async function completeUploadAction(input: unknown): Promise<void> {
  const parsed = completeUploadSchema.safeParse(input);
  if (!parsed.success) throw new Error("Invalid input");

  const { supabase } = await requireOrgId();

  const { data: updated, error } = await supabase
    .from("sources")
    .update({ status: "uploaded" })
    .eq("id", parsed.data.sourceId)
    .select("id, project_id")
    .maybeSingle();

  if (error || !updated) throw new Error("Failed to finalize upload");

  await inngest.send({
    name: "source.uploaded",
    data: { sourceId: updated.id, projectId: updated.project_id },
  });

  revalidatePath(`/projects/${updated.project_id}`);
  revalidatePath("/projects");
}

const synthesizeProjectSchema = z.object({
  projectId: z.string().uuid(),
});

export async function synthesizeProjectAction(input: unknown): Promise<void> {
  const parsed = synthesizeProjectSchema.safeParse(input);
  if (!parsed.success) throw new Error("Invalid input");

  const { supabase, orgId } = await requireOrgId();

  const usage = await checkUsageLimit(orgId);
  if (!usage.allowed) throw new Error("PAYWALL_LIMIT_REACHED");

  // Ensure the project exists for this org (RLS enforced).
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id")
    .eq("id", parsed.data.projectId)
    .maybeSingle();

  if (projectError) throw new Error("Failed to validate project");
  if (!project) throw new Error("Project not found");

  // Require at least one completed source report for this project.
  const { count, error: reportsError } = await supabase
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("project_id", parsed.data.projectId)
    .eq("status", "completed");

  if (reportsError) throw new Error("Failed to validate reports");
  if (!count || count < 1) throw new Error("No completed reports yet");

  await inngest.send({
    name: "project.synthesize",
    data: { projectId: parsed.data.projectId, orgId },
  });

  revalidatePath(`/projects/${parsed.data.projectId}`);
}

const generateShareLinkSchema = z.object({
  projectId: z.string().uuid(),
});

export async function generateShareLinkAction(input: unknown): Promise<string> {
  const parsed = generateShareLinkSchema.safeParse(input);
  if (!parsed.success) throw new Error("Invalid input");

  const { supabase } = await requireOrgId();

  // Confirm the project exists for this org (RLS enforced).
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id")
    .eq("id", parsed.data.projectId)
    .maybeSingle();

  if (projectError) throw new Error("Failed to validate project");
  if (!project) throw new Error("Project not found");

  const { data: projectReport, error: prError } = await supabase
    .from("project_reports")
    .select("id, public_slug")
    .eq("project_id", parsed.data.projectId)
    .maybeSingle();

  if (prError) throw new Error("Failed to fetch project report");
  if (!projectReport) throw new Error("Project synthesis not found");

  let slug: string | null = projectReport.public_slug ?? null;
  if (!slug) {
    slug = crypto.randomBytes(8).toString("hex");
    const { error: updateError } = await supabase
      .from("project_reports")
      .update({ public_slug: slug })
      .eq("id", projectReport.id);

    if (updateError) throw new Error("Failed to create share slug");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) throw new Error("Missing NEXT_PUBLIC_APP_URL");
  return new URL(`/r/${slug}`, appUrl).toString();
}

