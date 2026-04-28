"use client";

import { motion } from "framer-motion";

import { QuoteCard } from "@/components/reports/quote-card";

type Quote = Readonly<{
  id: string;
  text: string;
  speaker: string;
  start_ms: number;
  end_ms: number;
  source_id: string;
}>;

type Theme = Readonly<{
  name: string;
  description: string;
  quotes: ReadonlyArray<Quote>;
}>;

const container = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.06,
      ease: [0.2, 0.8, 0.2, 1],
      duration: 0.25,
    },
  },
} as const;

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.2, 0.8, 0.2, 1] } },
} as const;

export function ReportClient({
  audioBySourceId,
  themes,
}: {
  audioBySourceId: Readonly<Record<string, string>>;
  themes: ReadonlyArray<Theme>;
}) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-3xl px-6 py-16"
    >
      <div className="mb-10">
        <p className="meta text-[var(--color-blue)]">SYNTHESIS REPORT</p>
        <h1 className="mt-3 font-display text-[clamp(36px,4.4vw,52px)] font-normal leading-[1.08] tracking-tight">
          Themes & citations
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-[var(--text-soft)]">
          Every quote is playable. Click any citation to hear the exact moment.
        </p>
      </div>

      <div className="space-y-10">
        {themes.map((t) => (
          <motion.section key={t.name} variants={item} className="space-y-4">
            <div>
              <h2 className="font-display text-[26px] font-normal leading-[1.2] tracking-tight">
                {t.name}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-soft)]">
                {t.description}
              </p>
            </div>

            <div className="space-y-4">
              {t.quotes.map((q) => (
                <QuoteCard key={q.id} quote={q} audioBySourceId={audioBySourceId} />
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </motion.div>
  );
}

