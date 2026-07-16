import Link from "next/link";
import type { ReactNode } from "react";

import { Wordmark } from "@/components/brand/wordmark";

interface LegalShellProps {
  title: string;
  children: ReactNode;
}

/**
 * Shared chrome for public legal pages — mirrors the marketing homepage
 * header / footer, not the authenticated app Header.
 */
export function LegalShell({ title, children }: LegalShellProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100svh",
        position: "relative",
        zIndex: 1,
      }}
    >
      <header
        style={{
          maxWidth: "var(--max)",
          width: "100%",
          margin: "0 auto",
          padding: "28px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <Wordmark href="/" />
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "var(--mono)",
            fontSize: "12px",
          }}
        >
          <Link
            href="/privacy"
            style={{ color: "var(--text-soft)", textDecoration: "none" }}
          >
            Privacy
          </Link>
          <span style={{ color: "var(--text-faint)" }}>·</span>
          <Link
            href="/terms"
            style={{ color: "var(--text-soft)", textDecoration: "none" }}
          >
            Terms
          </Link>
        </nav>
      </header>

      <main
        style={{
          flex: 1,
          maxWidth: "720px",
          width: "100%",
          margin: "0 auto",
          padding: "48px 32px 96px",
        }}
      >
        <p
          className="meta"
          style={{
            color: "var(--text-faint)",
            marginBottom: "16px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Last updated · July 2026
        </p>
        <h1
          style={{
            fontSize: "clamp(36px, 5vw, 52px)",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: "40px",
          }}
        >
          {title}
        </h1>
        <div className="legal-body">{children}</div>
      </main>

      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "28px 32px",
        }}
      >
        <div
          style={{
            maxWidth: "var(--max)",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            fontFamily: "var(--mono)",
            fontSize: "12px",
            color: "var(--text-faint)",
          }}
        >
          <div>© 2026 Verbatim AI Agency · Kitchener, Ontario</div>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link href="/privacy" style={{ color: "var(--text-soft)" }}>
              Privacy
            </Link>
            <Link href="/terms" style={{ color: "var(--text-soft)" }}>
              Terms
            </Link>
            <a
              href="mailto:dhanush57678@gmail.com"
              style={{ color: "var(--text-soft)" }}
            >
              dhanush57678@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section style={{ marginBottom: "36px" }}>
      <h2
        style={{
          fontSize: "22px",
          fontWeight: 400,
          letterSpacing: "-0.01em",
          marginBottom: "12px",
          color: "var(--text)",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          fontSize: "16px",
          lineHeight: 1.65,
          color: "var(--text-soft)",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {children}
      </div>
    </section>
  );
}
