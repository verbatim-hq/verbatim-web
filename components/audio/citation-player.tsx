"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { useAudioStore } from "@/lib/store/audio-store";

type CitationQuote = Readonly<{
  id: string;
  start_ms: number;
  end_ms: number;
}>;

export function CitationPlayer({
  signedUrl,
  quote,
}: {
  signedUrl: string;
  quote: CitationQuote;
}) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const waveRef = React.useRef<HTMLDivElement | null>(null);
  const wsRef = React.useRef<unknown | null>(null);
  const [ready, setReady] = React.useState(false);
  const setActiveQuote = useAudioStore((s) => s.setActiveQuote);

  React.useEffect(() => {
    let cancelled = false;

    const start = async () => {
      if (!waveRef.current) return;

      const WaveSurferMod = await import("wavesurfer.js");
      const WaveSurfer = WaveSurferMod.default;

      const ws = WaveSurfer.create({
        container: waveRef.current,
        waveColor: "rgba(244,244,245,0.25)",
        progressColor: "rgba(74,158,255,0.95)",
        cursorColor: "rgba(74,158,255,0.95)",
        height: 56,
        barWidth: 2,
        barGap: 2,
        barRadius: 2,
        normalize: true,
      });
      wsRef.current = ws as unknown;

      const startSec = quote.start_ms / 1000;
      const endSec = quote.end_ms / 1000;

      const onReady = async () => {
        if (cancelled) return;
        setReady(true);
        try {
          ws.setTime(startSec);
          await ws.play();
        } catch {
          // If playback fails, stop the active state.
          setActiveQuote(null);
        }
      };

      const onAudioProcess = () => {
        const t = ws.getCurrentTime();
        if (t >= endSec) {
          ws.pause();
          setActiveQuote(null);
        }
      };

      ws.on("ready", onReady);
      ws.on("audioprocess", onAudioProcess);

      try {
        await ws.load(signedUrl);
      } catch {
        setActiveQuote(null);
      }
    };

    void start();

    return () => {
      cancelled = true;
      const ws = wsRef.current as { destroy?: () => void } | null;
      try {
        ws?.destroy?.();
      } catch {
        // ignore
      }
      wsRef.current = null;
    };
  }, [quote.end_ms, quote.start_ms, quote.id, signedUrl, setActiveQuote]);

  return (
    <div
      ref={containerRef}
      className="mt-4 overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--bg)] p-3"
    >
      {!ready ? (
        <div className="flex items-center gap-3">
          <motion.div
            className="h-4 w-4 rounded-full border-2 border-[var(--border-strong)] border-t-[var(--color-blue)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, ease: "linear", repeat: Infinity }}
          />
          <p className="meta text-[var(--text-faint)]">Loading audio…</p>
        </div>
      ) : null}

      <div ref={waveRef} className={ready ? "" : "opacity-40"} />
    </div>
  );
}

