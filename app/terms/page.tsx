import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { CONTACT } from "@/lib/data";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions for enrolling in courses at Navya Computech.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" updated="17 July 2026">
      <LegalSection heading="1. About Us">
        <p>
          Navya Computech is an ISO 9001:2015 certified computer training
          institute. By enrolling in a course or using this website, you agree
          to these terms.
        </p>
      </LegalSection>

      <LegalSection heading="2. Admissions & Enrollment">
        <ul className="list-disc space-y-1 pl-5">
          <li>Admission is confirmed only after payment of the applicable course fee.</li>
          <li>Batch timings are allotted subject to availability and may be adjusted with prior notice.</li>
          <li>Students must maintain regular attendance to remain eligible for certification and placement support.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. Fees & Refunds">
        <ul className="list-disc space-y-1 pl-5">
          <li>Course fees are as communicated at the time of admission and may be revised for future batches.</li>
          <li>Fees once paid are non-refundable, except where a batch is cancelled by the institute.</li>
          <li>Installment plans, where offered, must be paid by the agreed dates to continue classes.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="4. Certification">
        <p>
          Certificates are issued on successful completion of the course,
          including required assessments and projects. Certificates remain the
          property of the institute until all dues are cleared.
        </p>
      </LegalSection>

      <LegalSection heading="5. Placement Support">
        <p>
          We provide placement assistance — including resume workshops, mock
          interviews and referrals to hiring partners — but do not guarantee
          employment. Final selection always rests with the hiring company.
        </p>
      </LegalSection>

      <LegalSection heading="6. Student Conduct">
        <p>
          Students are expected to treat staff, fellow students and lab
          equipment with respect. Misuse of lab systems or disruptive behaviour
          may result in suspension without refund.
        </p>
      </LegalSection>

      <LegalSection heading="7. Intellectual Property">
        <p>
          Study materials, recordings and content provided during the course
          are for personal learning only and may not be redistributed or
          resold.
        </p>
      </LegalSection>

      <LegalSection heading="8. Contact">
        <p>
          Questions about these terms? Write to{" "}
          <a href={`mailto:${CONTACT.email}`} className="text-primary hover:underline">
            {CONTACT.email}
          </a>{" "}
          or call {CONTACT.phone}.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
