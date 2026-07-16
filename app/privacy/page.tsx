import type { Metadata } from "next";

import { LegalSection, LegalShell } from "@/components/legal/legal-shell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Verbatim AI Agency — how we collect, use, and protect business contact information for B2B marketing and client services.",
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy">
      <LegalSection title="Who we are">
        <p>
          This Privacy Policy applies to Verbatim AI Agency, a sole
          proprietorship operated by Dhanush, based in Kitchener, Ontario,
          Canada. It describes how we collect, use, retain, and protect
          information in connection with our business-to-business marketing and
          contracted client services.
        </p>
      </LegalSection>

      <LegalSection title="Information we collect">
        <p>
          We collect publicly available business contact information for
          business-to-business marketing outreach. This may include business
          names, phone numbers, and public business profile data such as Google
          Business listings and similar directories.
        </p>
        <p>
          We do not collect or use consumer personal data for our marketing
          outreach, and we do not knowingly send messages to consumer phone
          numbers.
        </p>
        <p>
          When you engage us as a client, we may also use information you
          provide directly — such as your name, business details, and calendar
          availability — to deliver contracted services, including AI
          receptionist and review-generation services.
        </p>
      </LegalSection>

      <LegalSection title="How we use information">
        <p>
          Public business contact information is used to contact Canadian
          businesses about our services. Client-provided information is used
          only to perform the services described in your agreement with us.
        </p>
      </LegalSection>

      <LegalSection title="SMS opt-out and support">
        <p>
          If you receive an SMS message from us, you can reply{" "}
          <strong style={{ color: "var(--text)", fontWeight: 500 }}>STOP</strong>{" "}
          at any time to stop messages immediately and permanently. Reply{" "}
          <strong style={{ color: "var(--text)", fontWeight: 500 }}>HELP</strong>{" "}
          for support.
        </p>
      </LegalSection>

      <LegalSection title="Retention, security, and sale of data">
        <p>
          We retain contact records only as long as necessary for the purposes
          described in this policy, or as required by law. We take reasonable
          security measures to protect the information we hold.
        </p>
        <p>We do not sell data to third parties.</p>
      </LegalSection>

      <LegalSection title="Your rights (Canada)">
        <p>
          Canadian residents have rights under PIPEDA and Canada&apos;s
          Anti-Spam Legislation (CASL). You may contact us to request access
          to, correction of, or deletion of your information, subject to
          applicable law.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Verbatim AI Agency
          <br />
          Kitchener, Ontario, Canada
          <br />
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
