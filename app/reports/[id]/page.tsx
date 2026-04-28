import { notFound } from "next/navigation";

import { ReportClient } from "@/components/reports/report-client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { SynthesisReportSchema } from "@/lib/synthesis";

type ReportRow = Readonly<{
  id: string;
  status: "synthesizing" | "completed" | "failed";
  content_json: unknown | null;
  source: ReadonlyArray<Readonly<{ id: string; storage_path: string }>> | null;
}>;

export const dynamic = "force-dynamic";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("reports")
    .select(
      "id,status,content_json,source:sources!reports_source_id_fkey(id,storage_path)",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return notFound();

  const report = data as unknown as ReportRow;
  const sourceId = report.source?.[0]?.id ?? null;
  const storagePath = report.source?.[0]?.storage_path ?? null;
  if (!storagePath) return notFound();
  if (!sourceId) return notFound();

  if (report.status !== "completed" || !report.content_json) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Card>
          <CardHeader className="text-center">
            <p className="font-quote text-[var(--text)]">
              {report.status === "failed"
                ? "This report failed to generate."
                : "Generating your synthesis report…"}
            </p>
            <p className="mt-3 text-sm text-[var(--text-soft)]">
              {report.status === "failed"
                ? "Re-run synthesis from the Inngest dashboard after checking logs."
                : "This usually takes a minute. You can leave this tab open."}
            </p>
          </CardHeader>
          <CardContent className="pb-10" />
        </Card>
      </main>
    );
  }

  const parsed = SynthesisReportSchema.safeParse(report.content_json);
  if (!parsed.success) {
    console.error("Invalid report content_json", parsed.error.flatten());
    return notFound();
  }

  const signed = await supabase.storage
    .from("interviews")
    .createSignedUrl(storagePath, 7200);

  if (signed.error || !signed.data?.signedUrl) {
    console.error("Failed to sign audio url", signed.error);
    return notFound();
  }

  // Create stable quote ids for the global audio store.
  const audioBySourceId: Record<string, string> = { [sourceId]: signed.data.signedUrl };

  const themes = parsed.data.themes.map((t, ti) => ({
    name: t.name,
    description: t.description,
    quotes: t.quotes
      .filter((q) => typeof q.start_ms === "number" && typeof q.end_ms === "number")
      .map((q, qi) => ({
        id: `${id}:${ti}:${qi}`,
        text: q.text,
        speaker: q.speaker,
        source_id: sourceId,
        start_ms: q.start_ms as number,
        end_ms: q.end_ms as number,
      })),
  }));

  return <ReportClient audioBySourceId={audioBySourceId} themes={themes} />;
}

