import { notFound } from "next/navigation";

import { ReportClient } from "@/components/reports/report-client";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import { ProjectReportSchema } from "@/lib/synthesis";

type ProjectReportRow = Readonly<{
  id: string;
  content_json: unknown | null;
}>;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function PublicSharePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = getSupabaseServiceRoleClient();

  const { data: pr, error } = await supabase
    .from("project_reports")
    .select("id,content_json")
    .eq("public_slug", slug)
    .maybeSingle();

  if (error || !pr) return notFound();

  const projectReport = pr as unknown as ProjectReportRow;
  if (!projectReport.content_json) return notFound();

  const parsed = ProjectReportSchema.safeParse(projectReport.content_json);
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
      id: `${projectReport.id}:${ti}:${qi}`,
      text: q.text,
      speaker: q.speaker,
      start_ms: q.start_ms,
      end_ms: q.end_ms,
      source_id: q.source_id,
    })),
  }));

  return (
    <main className="relative z-[1]">
      <ReportClient audioBySourceId={audioBySourceId} themes={themes} />
      <footer className="mx-auto max-w-3xl px-6 pb-12">
        <p className="text-sm text-[var(--text-faint)]">Built with Verbatim</p>
      </footer>
    </main>
  );
}

