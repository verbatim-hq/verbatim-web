import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";

/**
 * Saturday (Day 3) task: replace this page with Clerk's `<SignIn />`
 * component, wired to Google OAuth only. No password auth in v1.
 */
export default function SignInPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
        gap: "32px",
      }}
    >
      <Wordmark />
      <div
        style={{
          padding: "40px",
          border: "1px solid var(--border)",
          background: "var(--bg-elevated)",
          borderRadius: "14px",
          maxWidth: "420px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--display)",
            fontSize: "28px",
            marginBottom: "12px",
          }}
        >
          Sign-in opens Saturday.
        </h1>
        <p style={{ color: "var(--text-soft)", marginBottom: "24px" }}>
          Private preview access is rolling out to design partners. Request
          yours on the main site.
        </p>
        <Link
          href="https://joinverbatim.com"
          style={{ color: "var(--blue)", textDecoration: "none" }}
        >
          → joinverbatim.com
        </Link>
      </div>
    </main>
  );
}
