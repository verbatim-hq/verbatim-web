"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import { ProjectDropzone } from "@/components/uploads/project-dropzone";
import { VerbatimPulse } from "@/components/uploads/verbatim-pulse";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { synthesizeProjectAction } from "@/app/projects/actions";
import { PaywallModal } from "@/components/billing/paywall-modal";

type SourceRow = Readonly<{
  id: string;
  original_filename: string;
  status: string;
  created_at: string;
}>;

function SourceStatusPill({ status }: { status: string }) {
  const color =
    status === "uploaded" || status === "done"
      ? "text-[var(--color-blue)] border-[rgba(74,158,255,0.25)] bg-[rgba(74,158,255,0.08)]"
      : status === "failed"
        ? "text-[var(--color-orange)] border-[rgba(255,120,73,0.25)] bg-[rgba(255,120,73,0.08)]"
        : "text-[var(--text-faint)] border-[var(--border)] bg-[var(--bg)]";

  return (
    <span className={`meta inline-flex items-center rounded-[10px] border px-3 py-2 ${color}`}>
      {status}
    </span>
  );
}

export function ProjectDetailClient({
  projectId,
  sources,
  projectReport,
}: {
  projectId: string;
  sources: ReadonlyArray<SourceRow>;
  projectReport:
    | Readonly<{ status: "synthesizing" | "completed" | "failed"; id: string }>
    | null;
}) {
  const [uploading, setUploading] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const isSynthesizing = projectReport?.status === "synthesizing";
  const [paywallOpen, setPaywallOpen] = React.useState(false);

  return (
    <>
      <VerbatimPulse active={uploading} />

      <section className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-[22px] font-normal tracking-tight">
            Project synthesis
          </h2>
          <p className="mt-2 text-sm text-[var(--text-soft)]">
            Generate a master cross-interview synthesis using only verified quotes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {projectReport?.status === "completed" ? (
            <Link
              href={`/projects/${projectId}/report`}
              className="meta inline-flex min-h-11 items-center rounded-[10px] border border-[var(--border)] px-4 text-[var(--text-soft)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text)]"
            >
              View synthesis →
            </Link>
          ) : null}

          <Button
            type="button"
            className="min-h-11 px-5"
            disabled={pending || isSynthesizing}
            onClick={() => {
              startTransition(async () => {
                try {
                  await synthesizeProjectAction({ projectId });
                } catch (e) {
                  if (e instanceof Error && e.message === "PAYWALL_LIMIT_REACHED") {
                    setPaywallOpen(true);
                    return;
                  }
                }
              });
            }}
          >
            {isSynthesizing ? "Synthesizing…" : "Synthesize Project"}
          </Button>
        </div>
      </section>

      {isSynthesizing ? (
        <motion.div
          className="mt-4 h-[3px] w-full overflow-hidden rounded-full bg-[var(--border)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <motion.div
            className="h-full w-1/3 bg-[var(--color-blue)]"
            initial={{ x: "-100%" }}
            animate={{ x: ["-100%", "300%"] }}
            transition={{
              duration: 1.2,
              ease: [0.2, 0.8, 0.2, 1],
              repeat: Infinity,
              repeatType: "loop",
            }}
          />
        </motion.div>
      ) : null}

      <section className="mt-10">
        <ProjectDropzone
          projectId={projectId}
          onUploadingChange={setUploading}
          onPaywallLimitReached={() => setPaywallOpen(true)}
        />
      </section>

      <PaywallModal open={paywallOpen} onOpenChange={setPaywallOpen} />

      <section className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-[22px] font-normal tracking-tight">
            Uploads
          </h2>
          <span className="meta text-[var(--text-faint)]">{sources.length} total</span>
        </div>

        {sources.length === 0 ? (
          <Card className="mt-5">
            <CardContent className="p-8">
              <p className="font-quote text-[var(--text)]">
                Upload your first recording to start synthesis.
              </p>
              <p className="mt-3 text-sm text-[var(--text-soft)]">
                Verbatim will transcribe, extract pains, and generate themes—each backed by
                a clickable audio citation.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4">
            {sources.map((s) => (
              <Card key={s.id} className="min-h-11">
                <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
                  <div>
                    <p className="text-[15px] text-[var(--text)]">{s.original_filename}</p>
                    <p className="meta mt-2 text-[var(--text-faint)]">
                      {new Date(s.created_at).toLocaleString()}
                    </p>
                  </div>
                  <SourceStatusPill status={s.status} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

