import type { Metadata } from "next";
import Link from "next/link";

import { LegalSection, LegalShell } from "@/components/legal/legal-shell";

export const metadata: Metadata = {
  title: "SMS Communications | Verbatim AI Agency",
  description:
    "How to opt in and opt out of SMS communications from Verbatim AI Agency.",
};

export default function SmsPage() {
  return (
    <LegalShell title="SMS Communications">
      {/* Opt-in CTA — must be visible above the fold for carrier review */}
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "24px 28px",
          marginBottom: "40px",
          background: "var(--surface-2, rgba(255,255,255,0.03))",
        }}
      >
        <p
          style={{
            fontSize: "16px",
            lineHeight: 1.65,
            color: "var(--text-soft)",
            marginBottom: "12px",
          }}
        >
          Text{" "}
          <strong style={{ color: "var(--text)", fontWeight: 600 }}>
            START
          </strong>{" "}
          to{" "}
          <strong style={{ color: "var(--text)", fontWeight: 600 }}>
            (519) 937-6793
          </strong>{" "}
          to receive SMS updates from Verbatim AI Agency.
        </p>
        <p
          style={{
            fontSize: "14px",
            lineHeight: 1.65,
            color: "var(--text-faint)",
          }}
        >
          By texting{" "}
          <strong style={{ color: "var(--text-soft)", fontWeight: 500 }}>
            START
          </strong>
          , you consent to receive SMS messages from Verbatim AI Agency about
          our Google review generation service for local trades businesses.
          Message and data rates may apply. Message frequency varies. Reply{" "}
          <strong style={{ color: "var(--text-soft)", fontWeight: 500 }}>
            STOP
          </strong>{" "}
          at any time to unsubscribe. Reply{" "}
          <strong style={{ color: "var(--text-soft)", fontWeight: 500 }}>
            HELP
          </strong>{" "}
          for help.
        </p>
      </div>

      <LegalSection title="What you'll receive">
        <p>
          Once opted in, you may receive occasional messages from Dhanush at
          Verbatim AI Agency regarding our Google review generation service for
          local trades businesses, service updates, and responses to your
          inquiries. Message frequency varies based on your engagement.
        </p>
      </LegalSection>

      <LegalSection title="How to opt out">
        <p>
          You can opt out at any time by replying{" "}
          <strong style={{ color: "var(--text)", fontWeight: 500 }}>STOP</strong>{" "}
          to any message you receive from{" "}
          <strong style={{ color: "var(--text)", fontWeight: 500 }}>
            (519) 937-6793
          </strong>
          . Your number will be permanently added to our suppression list and
          you will receive no further messages from us. You will receive a
          one-time confirmation that you have been unsubscribed.
        </p>
      </LegalSection>

      <LegalSection title="Get help">
        <p>
          Reply{" "}
          <strong style={{ color: "var(--text)", fontWeight: 500 }}>HELP</strong>{" "}
          to any message for assistance, or contact Dhanush directly at{" "}
          <a
            href="mailto:dhanush57678@gmail.com"
            style={{ color: "var(--blue)" }}
          >
            dhanush57678@gmail.com
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Privacy">
        <p>
          For details on how your mobile information is handled, see our{" "}
          <Link href="/privacy" style={{ color: "var(--blue)" }}>
            Privacy Policy
          </Link>
          . Your mobile information will not be sold or shared with third
          parties for promotional or marketing purposes.
        </p>
      </LegalSection>

      <LegalSection title="About Verbatim AI Agency">
        <p>
          Verbatim AI Agency is a sole-proprietor technology consultancy based
          in Kitchener, Ontario, operated by Dhanush.
          <br />
          Contact:{" "}
          <a
            href="mailto:dhanush57678@gmail.com"
            style={{ color: "var(--blue)" }}
          >
            dhanush57678@gmail.com
          </a>
        </p>
      </LegalSection>
    </LegalShell>
  );
}
