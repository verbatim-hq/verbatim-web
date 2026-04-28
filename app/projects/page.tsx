import Link from "next/link";

import { Header } from "@/components/layout/header";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type ProjectRow = Readonly<{
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}>;

async function getProjectsWithCounts(): Promise<
  ReadonlyArray<ProjectRow & { uploadedSourcesCount: number }>
> {
  const supabase = await getSupabaseServerClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("id,name,description,created_at")
    .order("created_at", { ascending: false });

  if (error || !projects) return [];

  const withCounts = await Promise.all(
    projects.map(async (p) => {
      const { count } = await supabase
        .from("sources")
        .select("id", { count: "exact", head: true })
        .eq("project_id", p.id)
        .in("status", [
          "uploading",
          "uploaded",
          "processing",
          "transcribing",
          "transcribed",
          "extracting",
          "done",
        ]);

      return {
        ...(p as ProjectRow),
        uploadedSourcesCount: count ?? 0,
      };
    }),
  );

  return withCounts;
}

export default async function ProjectsPage() {
  const projects = await getProjectsWithCounts();

  return (
    <main className="relative z-[1] mx-auto min-h-screen max-w-[1140px] px-8 py-16">
      <Header />
      <div className="mt-10 flex items-center justify-end">
        <CreateProjectDialog />
      </div>

      <div className="mt-10 flex items-end justify-between gap-6">
        <div>
          <p className="meta text-[var(--color-blue)]">PROJECTS</p>
          <h1 className="mt-3 font-display text-[clamp(34px,4.2vw,54px)] font-normal leading-[1.08] tracking-tight">
            Your research workspace.
          </h1>
          <p className="mt-4 max-w-[560px] text-[17px] leading-relaxed text-[var(--text-soft)]">
            Create a project, upload recordings, and let Verbatim synthesize citation-perfect
            themes.
          </p>
        </div>
        <Link
          href="/"
          className="meta inline-flex min-h-11 items-center rounded-[10px] border border-[var(--border)] px-4 text-[var(--text-soft)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text)]"
        >
          App home
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="mt-16 flex min-h-[56vh] items-center justify-center">
          <Card className="w-full max-w-xl">
            <CardHeader className="text-center">
              <p className="font-quote text-[var(--text)]">
                Start your first customer research project.
              </p>
              <p className="mt-3 text-sm text-[var(--text-soft)]">
                Upload real interviews. Every claim will be backed by playable audio.
              </p>
            </CardHeader>
            <CardContent className="flex justify-center pb-10">
              <CreateProjectDialog />
            </CardContent>
          </Card>
        </div>
      ) : (
        <section className="mt-12">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((p) => (
              <Link key={p.id} href={`/projects/${p.id}`} className="block min-h-11">
                <Card className="h-full transition-colors hover:border-[var(--border-strong)]">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-display text-[22px] font-normal leading-[1.15] tracking-tight">
                          {p.name}
                        </h2>
                        {p.description ? (
                          <p className="mt-2 line-clamp-3 text-sm text-[var(--text-soft)]">
                            {p.description}
                          </p>
                        ) : (
                          <p className="mt-2 text-sm text-[var(--text-faint)]">
                            No description yet.
                          </p>
                        )}
                      </div>
                      <div className="meta rounded-[10px] border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text-faint)]">
                        {p.uploadedSourcesCount} uploads
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="meta text-[var(--text-faint)]">
                        {new Date(p.created_at).toLocaleDateString()}
                      </span>
                      <span className="meta text-[var(--color-blue)]">Open →</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
