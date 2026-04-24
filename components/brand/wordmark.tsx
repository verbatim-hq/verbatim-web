import Link from "next/link";

interface WordmarkProps {
  /** Where the wordmark links to. Defaults to the app root. */
  href?: string;
  /** Rendered size; display-font scales, mono TLD stays constant. */
  size?: "sm" | "md" | "lg";
}

/**
 * The Verbatim wordmark — ported from the joinverbatim.com landing page.
 * Use this everywhere the brand appears: top-nav, emails, admin dashboard.
 */
export function Wordmark({ href = "/", size = "md" }: WordmarkProps) {
  const fontSize = size === "sm" ? "18px" : size === "lg" ? "32px" : "24px";

  return (
    <Link
      href={href}
      className="inline-flex items-baseline gap-0 no-underline"
      aria-label="Verbatim — home"
      style={{
        fontFamily: "var(--display)",
        fontSize,
        fontWeight: 400,
        letterSpacing: "-0.01em",
        color: "var(--text)",
      }}
    >
      <span>verbatim</span>
      <span style={{ color: "var(--orange)" }}>.</span>
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: "13px",
          color: "var(--text-soft)",
          fontWeight: 500,
          marginLeft: "2px",
          transform: "translateY(-1px)",
        }}
      >
        ai
      </span>
    </Link>
  );
}
