"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Play } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { useAudioStore } from "@/lib/store/audio-store";
import { Button } from "@/components/ui/button";

const CitationPlayer = dynamic(
  async () => {
    const mod = await import("@/components/audio/citation-player");
    return mod.CitationPlayer;
  },
  { ssr: false },
);

type Quote = Readonly<{
  id: string;
  text: string;
  speaker: string;
  start_ms: number;
  end_ms: number;
  source_id: string;
}>;

export function QuoteCard({
  quote,
  audioBySourceId,
}: {
  quote: Quote;
  audioBySourceId: Readonly<Record<string, string>>;
}) {
  const activeQuoteId = useAudioStore((s) => s.activeQuoteId);
  const setActiveQuote = useAudioStore((s) => s.setActiveQuote);

  const isActive = activeQuoteId === quote.id;
  const signedUrl = audioBySourceId[quote.source_id] ?? null;

  return (
    <div
      className={cn(
        "rounded-[14px] border border-[var(--border)] bg-[var(--bg-elevated)] p-5 transition-colors",
        isActive ? "border-[rgba(74,158,255,0.55)] bg-[rgba(74,158,255,0.06)]" : "",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[15px] leading-relaxed text-[var(--text)]">{quote.text}</p>
          <p className="meta mt-3 text-[var(--text-faint)]">{quote.speaker}</p>
        </div>

        <Button
          type="button"
          onClick={() => setActiveQuote(isActive ? null : quote.id)}
          className="min-h-11 min-w-11 px-4"
          aria-pressed={isActive}
        >
          <Play className="size-4" />
          <span className="sr-only">Play quote</span>
        </Button>
      </div>

      {isActive ? (
        signedUrl ? (
          <CitationPlayer
            signedUrl={signedUrl}
            quote={{ id: quote.id, start_ms: quote.start_ms, end_ms: quote.end_ms }}
          />
        ) : (
          <p className="mt-4 text-sm text-[var(--color-orange)]">
            Missing audio for this citation.
          </p>
        )
      ) : null}
    </div>
  );
}

