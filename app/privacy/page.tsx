import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { CONTACT } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Navya Computech collects, uses and protects your personal information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="17 July 2026">
      <LegalSection heading="1. Information We Collect">
        <p>
          This website does not have user accounts, forms or online payments —
          it is an informational site. We collect personal information only
          when you contact us directly by phone, WhatsApp or email: typically
          your name, phone number, email address and the course you are
          interested in.
        </p>
      </LegalSection>

      <LegalSection heading="2. How We Use Your Information">
        <p>We use the information you share with us to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Respond to your questions and schedule counseling or demo classes</li>
          <li>Manage your admission and course enrollment at the institute</li>
          <li>Improve our courses and services</li>
        </ul>
        <p>
          We do <strong>not</strong> sell, rent or trade your personal
          information to third parties.
        </p>
      </LegalSection>

      <LegalSection heading="3. Data Storage & Security">
        <p>
          Records you share during admission are maintained at the institute
          with access restricted to authorized staff. This website itself is
          served over encrypted connections (HTTPS) and does not store visitor
          data.
        </p>
      </LegalSection>

      <LegalSection heading="4. Cookies">
        <p>
          This website only stores your light/dark theme preference in your
          browser. We do not use tracking or third-party advertising cookies.
        </p>
      </LegalSection>

      <LegalSection heading="5. Your Rights">
        <p>
          You may request access to, correction of, or deletion of your
          personal data at any time. To make a data request, contact us at{" "}
          <a href={`mailto:${CONTACT.email}`} className="text-primary hover:underline">
            {CONTACT.email}
          </a>{" "}
          or call {CONTACT.phone}.
        </p>
      </LegalSection>

      <LegalSection heading="6. Changes to This Policy">
        <p>
          We may update this policy from time to time. Changes will be posted
          on this page with a revised &ldquo;last updated&rdquo; date.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
