import { notFound } from "next/navigation";

import { Header } from "@/components/layout/header";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ProjectDetailClient } from "./project-detail-client";

type SourceRow = Readonly<{
  id: string;
  original_filename: string;
  status: string;
  created_at: string;
}>;

async function getProject(projectId: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id,name,description,created_at")
    .eq("id", projectId)
    .maybeSingle();

  if (error || !data) return null;
  return data as Readonly<{
    id: string;
    name: string;
    description: string | null;
    created_at: string;
  }>;
}

async function getSources(projectId: string): Promise<ReadonlyArray<SourceRow>> {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase
    .from("sources")
    .select("id,original_filename,status,created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(50);

  return (data as SourceRow[] | null) ?? [];
}

async function getProjectReportStatus(projectId: string): Promise<
  | Readonly<{ status: "synthesizing" | "completed" | "failed"; id: string }>
  | null
> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("project_reports")
    .select("id,status")
    .eq("project_id", projectId)
    .maybeSingle();

  if (error || !data) return null;
  return data as Readonly<{ status: "synthesizing" | "completed" | "failed"; id: string }>;
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [project, sources, projectReport] = await Promise.all([
    getProject(id),
    getSources(id),
    getProjectReportStatus(id),
  ]);
  if (!project) notFound();

  return (
    <ProjectDetailShell
      projectId={project.id}
      projectName={project.name}
      projectDescription={project.description}
      sources={sources}
      projectReport={projectReport}
    />
  );
}

function ProjectDetailShell({
  projectId,
  projectName,
  projectDescription,
  sources,
  projectReport,
}: {
  projectId: string;
  projectName: string;
  projectDescription: string | null;
  sources: ReadonlyArray<SourceRow>;
  projectReport:
    | Readonly<{ status: "synthesizing" | "completed" | "failed"; id: string }>
    | null;
}) {
  // Client-only upload state lives in children; this shell stays server-friendly.
  return (
    <main className="relative z-[1] mx-auto min-h-screen max-w-[1140px] px-8 py-12">
      <Header />

      <div className="mt-10">
        <p className="meta text-[var(--color-blue)]">PROJECT</p>
        <h1 className="mt-3 font-display text-[clamp(34px,4.2vw,54px)] font-normal leading-[1.08] tracking-tight">
          {projectName}
        </h1>
        {projectDescription ? (
          <p className="mt-4 max-w-[720px] text-[17px] leading-relaxed text-[var(--text-soft)]">
            {projectDescription}
          </p>
        ) : (
          <p className="mt-4 max-w-[720px] text-[17px] leading-relaxed text-[var(--text-faint)]">
            Add a description later. For now, upload interviews to begin.
          </p>
        )}
      </div>

      <ProjectDetailClient
        projectId={projectId}
        sources={sources}
        projectReport={projectReport}
      />
    </main>
  );
}

