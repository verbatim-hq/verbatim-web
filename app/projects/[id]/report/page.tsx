import { notFound } from "next/navigation";

import { ReportClient } from "@/components/reports/report-client";
import { ShareLinkButton } from "@/components/reports/share-link-button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ProjectReportSchema } from "@/lib/synthesis";

type ProjectReportRow = Readonly<{
  id: string;
  status: "synthesizing" | "completed" | "failed";
  content_json: unknown | null;
  sources: ReadonlyArray<Readonly<{ id: string; storage_path: string }>> | null;
}>;

export const dynamic = "force-dynamic";

export default async function ProjectReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = await params;

  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("project_reports")
    .select(
      "id,status,content_json,sources:sources!sources_project_id_fkey(id,storage_path)",
    )
    .eq("project_id", projectId)
    .maybeSingle();

  if (error || !data) return notFound();

  const row = data as unknown as ProjectReportRow;

  if (row.status !== "completed" || !row.content_json) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Card>
          <CardHeader className="text-center">
            <p className="font-quote text-[var(--text)]">
              {row.status === "failed"
                ? "This project synthesis failed to generate."
                : "Synthesizing the project…"}
            </p>
            <p className="mt-3 text-sm text-[var(--text-soft)]">
              {row.status === "failed"
                ? "Re-run synthesis from the Inngest dashboard after checking logs."
                : "This can take a few minutes depending on interview volume."}
            </p>
          </CardHeader>
          <CardContent className="pb-10" />
        </Card>
      </main>
    );
  }

  const parsed = ProjectReportSchema.safeParse(row.content_json);
  if (!parsed.success) return notFound();

  const uniqueSourceIds = Array.from(
    new Set(parsed.data.themes.flatMap((t) => t.quotes.map((q) => q.source_id))),
  );

  const { data: sources, error: sourcesError } = await supabase
    .from("sources")
    .select("id,storage_path")
    .in("id", uniqueSourceIds);

  if (sourcesError || !sources) return notFound();

  const audioBySourceId: Record<string, string> = {};

  for (const s of sources as Array<{ id: string; storage_path: string }>) {
    const signed = await supabase.storage
      .from("interviews")
      .createSignedUrl(s.storage_path, 7200);
    if (signed.error || !signed.data?.signedUrl) return notFound();
    audioBySourceId[s.id] = signed.data.signedUrl;
  }

  const themes = parsed.data.themes.map((t, ti) => ({
    name: t.name,
    description: t.description,
    quotes: t.quotes.map((q, qi) => ({
      id: `${row.id}:${ti}:${qi}`,
      text: q.text,
      speaker: q.speaker,
      start_ms: q.start_ms,
      end_ms: q.end_ms,
      source_id: q.source_id,
    })),
  }));

  return (
    <main className="relative z-[1]">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 pt-10">
        <div>
          <p className="meta text-[var(--color-blue)]">PROJECT SYNTHESIS</p>
          <p className="mt-2 text-sm text-[var(--text-soft)]">
            Share a read-only link that plays citations.
          </p>
        </div>
        <ShareLinkButton projectId={projectId} />
      </div>
      <ReportClient audioBySourceId={audioBySourceId} themes={themes} />
    </main>
  );
}

