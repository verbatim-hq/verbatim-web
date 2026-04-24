import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";

/**
 * app.joinverbatim.com root page — Day 1.
 *
 * Intentionally minimal: this URL is where `joinverbatim.com/signup` will
 * redirect once Clerk is wired (Saturday). Until then, it's a branded
 * "under construction" shell that:
 *   1. Confirms the deploy is live (one browser check on the phone)
 *   2. Looks like the landing page so design partners don't think they
 *      hit the wrong URL
 *   3. Points back to the marketing site so no one gets stranded
 *
 * Replace this page on Day 3 with the Clerk `<SignIn />` component
 * and the redirect to /projects for authenticated users.
 */
export default function HomePage() {
  return (
    <>
      <header
        style={{
          maxWidth: "var(--max)",
          margin: "0 auto",
          padding: "24px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Wordmark />
        <span className="meta">v1 · private preview</span>
      </header>

      <main
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "140px 32px 80px",
          textAlign: "center",
        }}
      >
        <span
          className="meta"
          style={{
            display: "inline-block",
            padding: "6px 12px",
            border: "1px solid var(--border)",
            borderRadius: "999px",
            background: "var(--bg-elevated)",
            marginBottom: "32px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--orange)",
              marginRight: "8px",
              verticalAlign: "middle",
              boxShadow: "0 0 12px var(--orange)",
            }}
          />
          Building · Summer 2026
        </span>

        <h1
          style={{
            fontFamily: "var(--display)",
            fontSize: "clamp(48px, 7vw, 88px)",
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: "24px",
          }}
        >
          Customer interviews,
          <br />
          <em style={{ color: "var(--orange)", fontStyle: "italic" }}>
            synthesized.
          </em>
        </h1>

        <p
          style={{
            fontSize: "19px",
            lineHeight: 1.55,
            color: "var(--text-soft)",
            maxWidth: "560px",
            margin: "0 auto 48px",
          }}
        >
          Upload your interview recordings. Get a citation-perfect synthesis
          report — every theme backed by playable audio from the exact customer
          who said it — in under five minutes.
        </p>

        <div
          style={{
            display: "inline-flex",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link
            href="https://joinverbatim.com"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 24px",
              background: "var(--text)",
              color: "var(--bg)",
              borderRadius: "10px",
              fontWeight: 500,
              fontSize: "15px",
              textDecoration: "none",
              transition: "transform 0.15s ease",
            }}
          >
            Request early access
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/sign-in"
            className="meta"
            style={{
              padding: "14px 20px",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              color: "var(--text-soft)",
              textDecoration: "none",
              transition: "border-color 0.15s ease, color 0.15s ease",
            }}
          >
            SIGN IN
          </Link>
        </div>

        <p
          className="meta"
          style={{
            marginTop: "80px",
            color: "var(--text-faint)",
          }}
        >
          You're on <code style={{ fontFamily: "var(--mono)" }}>app.joinverbatim.com</code>.
          Public site → <Link href="https://joinverbatim.com" style={{ color: "var(--blue)" }}>joinverbatim.com</Link>
        </p>
      </main>

      <footer
        style={{
          maxWidth: "var(--max)",
          margin: "0 auto",
          padding: "32px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <span className="meta">© 2026 Verbatim · Waterloo, Ontario</span>
        <span className="meta">
          Built with{" "}
          <Link href="https://anthropic.com" style={{ color: "var(--text-soft)" }}>
            Claude
          </Link>
        </span>
      </footer>
    </>
  );
}
