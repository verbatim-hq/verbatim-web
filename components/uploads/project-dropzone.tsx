"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import {
  completeUploadAction,
  startUploadAction,
  type StartUploadResult,
} from "@/app/projects/actions";

const ACCEPTED = {
  "audio/mpeg": [".mp3"],
  "audio/mp4": [".m4a"],
  "audio/wav": [".wav"],
  "video/mp4": [".mp4"],
  "video/quicktime": [".mov"],
} as const;

function extFromName(name: string): "mp3" | "m4a" | "wav" | "mp4" | "mov" | null {
  const lower = name.toLowerCase();
  if (lower.endsWith(".mp3")) return "mp3";
  if (lower.endsWith(".m4a")) return "m4a";
  if (lower.endsWith(".wav")) return "wav";
  if (lower.endsWith(".mp4")) return "mp4";
  if (lower.endsWith(".mov")) return "mov";
  return null;
}

function kindFromExt(ext: NonNullable<ReturnType<typeof extFromName>>): "audio" | "video" {
  return ext === "mp4" || ext === "mov" ? "video" : "audio";
}

type UploadState =
  | { type: "idle" }
  | { type: "preparing" }
  | { type: "uploading"; progress: number }
  | { type: "finalizing" }
  | { type: "error"; message: string };

export function ProjectDropzone({
  projectId,
  onUploadingChange,
  onPaywallLimitReached,
}: {
  projectId: string;
  onUploadingChange?: (uploading: boolean) => void;
  onPaywallLimitReached?: () => void;
}) {
  const [state, setState] = React.useState<UploadState>({ type: "idle" });

  const uploading =
    state.type === "preparing" || state.type === "uploading" || state.type === "finalizing";

  React.useEffect(() => {
    onUploadingChange?.(uploading);
  }, [onUploadingChange, uploading]);

  const onDrop = React.useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;

      const ext = extFromName(file.name);
      if (!ext) {
        setState({ type: "error", message: "Unsupported file type." });
        return;
      }

      setState({ type: "preparing" });

      let started: StartUploadResult;
      try {
        started = await startUploadAction({
          projectId,
          originalFilename: file.name,
          extension: ext,
          kind: kindFromExt(ext),
          contentType: file.type || undefined,
        });
      } catch (e) {
        if (e instanceof Error && e.message === "PAYWALL_LIMIT_REACHED") {
          onPaywallLimitReached?.();
          setState({ type: "idle" });
          return;
        }
        setState({ type: "error", message: "Could not prepare the upload." });
        return;
      }

      setState({ type: "uploading", progress: 0 });

      const ok = await new Promise<boolean>((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", started.signedUrl);
        xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

        xhr.upload.onprogress = (event) => {
          if (!event.lengthComputable) return;
          const progress = Math.max(0, Math.min(100, (event.loaded / event.total) * 100));
          setState({ type: "uploading", progress });
        };

        xhr.onload = () => resolve(xhr.status >= 200 && xhr.status < 300);
        xhr.onerror = () => resolve(false);
        xhr.send(file);
      });

      if (!ok) {
        setState({
          type: "error",
          message: "Upload failed. Try again (the link expires after 60 seconds).",
        });
        return;
      }

      setState({ type: "finalizing" });

      try {
        await completeUploadAction({ sourceId: started.sourceId });
        setState({ type: "idle" });
      } catch {
        setState({
          type: "error",
          message: "Upload completed, but Verbatim couldn’t finalize the record.",
        });
      }
    },
    [projectId, onPaywallLimitReached],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    multiple: false,
    accept: ACCEPTED,
    maxSize: 500 * 1024 * 1024,
  });

  const rootProps = getRootProps();
  const safeRootProps = rootProps as React.HTMLAttributes<HTMLDivElement>;
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      {...safeRootProps}
      role="button"
      tabIndex={0}
      onMouseEnter={(e) => {
        safeRootProps.onMouseEnter?.(e);
        setHovered(true);
      }}
      onMouseLeave={(e) => {
        safeRootProps.onMouseLeave?.(e);
        setHovered(false);
      }}
      className={cn(
        "group relative w-full cursor-pointer select-none rounded-[18px] border border-[var(--border)] bg-[var(--bg-elevated)] p-8 outline-none transition-colors hover:border-[var(--border-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-blue)]",
        "min-h-[176px]", // ≥44px hit area (and comfortable target)
        isDragReject ? "border-[var(--color-orange)]" : "",
      )}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[18px]"
        animate={{
          boxShadow:
            hovered || isDragActive
              ? "0 0 0 1px rgba(74, 158, 255, 0.35), 0 0 64px -32px rgba(74, 158, 255, 0.45)"
              : "0 0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
      />

      <input {...getInputProps()} />

      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="flex size-11 items-center justify-center rounded-[12px] border border-[var(--border)] bg-[var(--bg)] text-[var(--text-soft)] transition-colors group-hover:text-[var(--text)]">
          <UploadCloud className="size-5" />
        </div>

        <div>
          <p className="font-display text-[22px] font-normal tracking-tight text-[var(--text)]">
            {isDragActive ? "Drop to upload" : "Drop recordings here"}
          </p>
          <p className="mt-2 text-sm text-[var(--text-soft)]">
            .mp3 · .m4a · .wav · .mp4 · .mov (max 500MB)
          </p>
        </div>

        {state.type === "uploading" && (
          <div className="mt-4 w-full max-w-md">
            <div className="flex items-center justify-between">
              <span className="meta">Uploading</span>
              <span className="meta">{Math.round(state.progress)}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
              <motion.div
                className="h-full bg-[var(--color-blue)]"
                initial={{ width: 0 }}
                animate={{ width: `${state.progress}%` }}
                transition={{ duration: 0.12, ease: [0.2, 0.8, 0.2, 1] }}
              />
            </div>
          </div>
        )}

        {state.type === "preparing" && (
          <p className="meta mt-4 text-[var(--text-faint)]">Preparing a secure upload…</p>
        )}

        {state.type === "finalizing" && (
          <p className="meta mt-4 text-[var(--text-faint)]">Finalizing…</p>
        )}

        {state.type === "error" && (
          <p className="mt-4 max-w-md text-sm text-[var(--color-orange)]">{state.message}</p>
        )}
      </div>
    </div>
  );
}

