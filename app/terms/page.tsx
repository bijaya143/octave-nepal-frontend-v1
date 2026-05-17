import { SITE_NAME } from "@/lib/constant";
import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "Terms & Conditions - " + SITE_NAME,
  description:
    "Read the Terms & Conditions for using " +
    SITE_NAME +
    "'s website and services.",
};

export default function TermsPage() {
  return (
    <main>
      <section className="py-5 md:py-10 bg-linear-to-b from-white to-[color:var(--color-neutral-50)]/30">
        <Container className="max-w-3xl">
          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[color:var(--color-neutral-900)]"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            Terms & Conditions
          </h1>
          <p className="mt-3 text-sm md:text-base text-[color:var(--color-neutral-500)] flex items-center gap-2">
            <span>
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span>•</span>
            <span>Kathmandu, Nepal</span>
          </p>

          <div className="mt-10 space-y-8 leading-relaxed text-base md:text-lg text-[color:var(--color-neutral-700)]">
            <p className="text-base md:text-[17px] leading-relaxed text-[color:var(--color-neutral-700)]">
              Welcome to <strong>{SITE_NAME}</strong>. These Terms and
              Conditions (&ldquo;Terms&rdquo;) govern your access to and use of
              our online learning platform and services. By enrolling in our
              courses, registering an account, or accessing our platform, you
              agree to be legally bound by these Terms, which constitute a
              binding contract under the{" "}
              <strong>Electronic Transactions Act, 2063 (2008 A.D.)</strong> of
              Nepal.
            </p>

            <div className="p-5 rounded-xl border border-[color:var(--color-neutral-200)]/80 bg-white/70 backdrop-blur-xs">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--color-primary-700)]">
                Regulatory Compliance Notice
              </h2>
              <p className="mt-2 text-sm md:text-base text-[color:var(--color-neutral-600)] leading-relaxed">
                {SITE_NAME} is fully registered and compliant under the
                prevailing laws of the Government of Nepal, including the Inland
                Revenue Department (PAN/VAT registration), the Department of
                Commerce, Supplies and Consumer Protection (DoCSCP), and the
                latest directives governing e-commerce operations in Nepal.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-bold text-[color:var(--color-neutral-900)]"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                1. Contract Formation & Electronic Record
              </h2>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                By clicking &ldquo;Enroll,&rdquo; &ldquo;Register,&rdquo; or
                purchasing a course, you consent to enter into a legally binding
                electronic agreement. Pursuant to the{" "}
                <strong>Electronic Transactions Act, 2063</strong>, electronic
                records, signatures, and click-to-accept agreements hold the
                same legal status and enforceability as written paper contracts
                in Nepal.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-bold text-[color:var(--color-neutral-900)]"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                2. User Account Registration & Security
              </h2>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                To access certain platform features, you must register a
                personal account. You agree to:
              </p>
              <ul className="mt-3 pl-6 list-disc text-base md:text-[17px] text-[color:var(--color-neutral-700)] space-y-2 leading-relaxed">
                <li>
                  Provide accurate, current, and complete registration
                  information.
                </li>
                <li>
                  Maintain the confidentiality of your account credentials
                  (username and password).
                </li>
                <li>
                  Take full responsibility for all activities, enrollments, and
                  transactions conducted under your account.
                </li>
                <li>
                  Immediately notify our team of any suspected unauthorized
                  account usage or security breach.
                </li>
              </ul>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-bold text-[color:var(--color-neutral-900)]"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                3. Course Formats, Lifetime Access & Support
              </h2>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                Our platform offers cohort-based and interactive courses. When
                you enroll, you are granted a personal, non-transferable license
                to access the course videos, projects, assignments, and
                associated peer/mentor communication channels. Unless specified
                otherwise at enrollment, courses feature lifetime access to the
                archived materials. We reserve the right to moderate, delete, or
                suspend any community channel or user access for violations of
                our community code of conduct.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-bold text-[color:var(--color-neutral-900)]"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                4. Payments, Pricing, and Nepal Rastra Bank Compliance
              </h2>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                All prices listed on our platform are displayed in Nepalese
                Rupees (NPR) and are inclusive of all applicable Nepalese
                government taxes (including VAT where applicable) unless stated
                otherwise.
              </p>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                In compliance with <strong>Nepal Rastra Bank (NRB)</strong>{" "}
                regulations, all digital payments must be made through licensed
                payment service providers and gateways, including but not
                limited to eSewa, Khalti, Fonepay, ConnectIPS, or approved
                commercial bank cards. International students may pay via
                approved global card processors.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-bold text-[color:var(--color-neutral-900)]"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                5. Refunds & Cancellation Policy (Consumer Protection Act, 2075)
              </h2>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                In alignment with consumer rights outlined in the{" "}
                <strong>Consumer Protection Act, 2075</strong>, we want to
                ensure you are fully satisfied with your purchase.
              </p>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                We offer a standard <strong>7-day refund window</strong> from
                the date of enrollment. To qualify for a full refund, you must
                submit a written request via our Contact page within 7 days,
                provided you have consumed less than 20% of the course modules
                or video lessons. Refunds are processed through the original
                payment channel within 7 to 10 working days of approval.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-bold text-[color:var(--color-neutral-900)]"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                6. Intellectual Property & Copyright Protection
              </h2>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                All course content, including but not limited to videos, slides,
                source code, projects, assessments, graphics, logos, and written
                guides, is the exclusive intellectual property of {SITE_NAME} or
                its designated instructors, protected under the{" "}
                <strong>Copyright Act, 2059 (2002 B.S.)</strong> of Nepal.
              </p>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                You are strictly prohibited from downloading, recording,
                copying, reproducing, distributing, selling, or sharing access
                to course materials with third parties without our prior written
                consent. Violators will face immediate account termination and
                legal action under the prevailing laws.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-bold text-[color:var(--color-neutral-900)]"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                7. Limitation of Liability
              </h2>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                To the maximum extent permitted under Nepalese law, {SITE_NAME}{" "}
                shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages (such as loss of data, career
                opportunities, or profits) arising out of your use or inability
                to use the platform. Course materials are educational
                references, and we make no guarantees regarding direct
                employment outcomes.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-bold text-[color:var(--color-neutral-900)]"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                8. Grievance Redressal Mechanism & Dispute Resolution
              </h2>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                In compliance with the e-commerce consumer guidelines of Nepal,
                we have established a dedicated grievance handling mechanism:
              </p>
              <ul className="mt-3 pl-6 list-disc text-base md:text-[17px] text-[color:var(--color-neutral-700)] space-y-2 leading-relaxed">
                <li>
                  If you have any complaints regarding course delivery,
                  payments, or access, you can submit a grievance report on our{" "}
                  <Link
                    href="/contact-us"
                    className="text-[color:var(--color-primary-700)] hover:underline underline-offset-2"
                  >
                    contact page
                  </Link>{" "}
                  or email us directly.
                </li>
                <li>
                  We commit to acknowledging your grievance within 24 hours and
                  working to resolve the issue within a maximum of{" "}
                  <strong>15 days</strong>.
                </li>
              </ul>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-bold text-[color:var(--color-neutral-900)]"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                9. Governing Law and Jurisdiction
              </h2>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                These Terms and Conditions shall be governed by, construed, and
                enforced in accordance with the prevailing laws of the{" "}
                <strong>Federal Democratic Republic of Nepal</strong> (including
                the Electronic Transactions Act, Consumer Protection Act, and
                Copyright Act). Any legal proceedings or disputes arising under
                these Terms shall be subject to the exclusive jurisdiction of
                the competent courts in Kathmandu, Nepal.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-bold text-[color:var(--color-neutral-900)]"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                10. Amendments & Contact Information
              </h2>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                We reserve the right to revise or update these Terms at any time
                to reflect changing regulations or features. All changes will be
                published directly on this page. If you have questions regarding
                these Terms, please reach out to us through our{" "}
                <Link
                  href="/contact-us"
                  className="text-[color:var(--color-primary-700)] hover:underline underline-offset-2"
                >
                  contact page
                </Link>
                .
              </p>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
