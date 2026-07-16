import type { Metadata } from "next";

import { LegalSection, LegalShell } from "@/components/legal/legal-shell";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms & Conditions for Verbatim AI Agency — SMS messaging program, marketing communications, and general service terms.",
};

export default function TermsPage() {
  return (
    <LegalShell title="Terms & Conditions">
      <LegalSection title="Who we are">
        <p>
          These Terms &amp; Conditions apply to Verbatim AI Agency, a sole
          proprietorship operated by Dhanush, based in Kitchener, Ontario,
          Canada. They govern our marketing communications and SMS messaging
          program. Individual client engagements are governed by separate
          service agreements.
        </p>
      </LegalSection>

      <LegalSection title="SMS messaging program">
        <p>
          By providing a phone number or replying to our messages, you agree to
          receive SMS messages related to our services. Message frequency
          varies. Message and data rates may apply.
        </p>
        <p>
          Consent to receive messages is not a condition of purchasing any
          service.
        </p>
        <p>
          Reply{" "}
          <strong style={{ color: "var(--text)", fontWeight: 500 }}>STOP</strong>{" "}
          at any time to opt out. Reply{" "}
          <strong style={{ color: "var(--text)", fontWeight: 500 }}>HELP</strong>{" "}
          for support. Wireless carriers are not liable for delayed or
          undelivered messages.
        </p>
      </LegalSection>

      <LegalSection title="CASL business-contact exemption">
        <p>
          Messages are sent to publicly listed Canadian business phone numbers
          under Canada&apos;s Anti-Spam Legislation (CASL) Section 6
          business-contact exemption, where applicable.
        </p>
      </LegalSection>

      <LegalSection title="Our services">
        <p>
          We provide AI-powered business tools, including review-generation
          outreach and AI voice receptionist services. Those services are
          delivered under separate individual client service agreements. These
          Terms apply to marketing communications generally; they are not a
          substitute for a signed client agreement.
        </p>
      </LegalSection>

      <LegalSection title="No warranty on marketing results">
        <p>
          Unless expressly stated in a signed client agreement, we make no
          warranty regarding the results of marketing outreach, including
          response rates, conversions, or business outcomes.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          To the extent permitted by law, Verbatim AI Agency is not liable for
          any indirect, incidental, or consequential damages arising from
          marketing messages or related communications.
        </p>
      </LegalSection>

      <LegalSection title="Updates">
        <p>
          We may update these Terms from time to time. Continued interaction
          with our communications after changes are posted constitutes
          acceptance of the updated Terms.
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
