import { SITE_NAME } from "@/lib/constant";
import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "Privacy Policy - " + SITE_NAME,
  description:
    "Learn how " +
    SITE_NAME +
    " collects, uses, and protects your personal data under the Individual Privacy Act, 2075 of Nepal.",
};

export default function PrivacyPage() {
  return (
    <main>
      <section className="py-5 md:py-10 bg-linear-to-b from-white to-[color:var(--color-neutral-50)]/30">
        <Container className="max-w-3xl">
          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[color:var(--color-neutral-900)]"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            Privacy Policy
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
              At <strong>{SITE_NAME}</strong>, we are committed to protecting
              the privacy and security of our students, partners, and platform
              users. This Privacy Policy details how we collect, store, process,
              and protect your personal information when you register an
              account, enroll in our courses, or interact with our platform. Our
              data practices are strictly aligned with the{" "}
              <strong>Individual Privacy Act, 2075 (2018 A.D.)</strong> and the{" "}
              <strong>Electronic Transactions Act, 2063</strong> of Nepal.
            </p>

            <div className="p-5 rounded-xl border border-[color:var(--color-neutral-200)]/80 bg-white/70 backdrop-blur-xs">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--color-primary-700)]">
                Privacy Compliance Notice
              </h2>
              <p className="mt-2 text-sm md:text-base text-[color:var(--color-neutral-600)] leading-relaxed">
                In compliance with the{" "}
                <strong>Individual Privacy Act, 2075</strong> of Nepal, we
                obtain your explicit consent before collecting or processing any
                personal information. You retain full rights to access, amend,
                retrieve, or request the erasure of your personal data at any
                time.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-bold text-[color:var(--color-neutral-900)]"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                1. Information We Collect
              </h2>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                To provide you with our learning services, we may collect the
                following categories of information:
              </p>
              <ul className="mt-3 pl-6 list-disc text-base md:text-[17px] text-[color:var(--color-neutral-700)] space-y-2 leading-relaxed">
                <li>
                  <strong>Personal Identity Information:</strong> Your full
                  name, email address, mobile number, physical billing address,
                  and account login details.
                </li>
                <li>
                  <strong>Course & Cohort Records:</strong> Course selections,
                  class progress, video consumption statistics, quiz scores,
                  project uploads, community discussion contributions (on Slack
                  or Discord), and digital certificate records.
                </li>
                <li>
                  <strong>Payment Reference Information:</strong> When you
                  purchase courses through eSewa, Khalti, ConnectIPS, Fonepay,
                  or bank cards, we collect transaction confirmation IDs. We{" "}
                  <strong>do not</strong> store your passwords, credit/debit
                  card numbers, or mobile wallet PINs on our servers; these are
                  handled directly by secure, licensed payment service providers
                  in compliance with Nepal Rastra Bank regulations.
                </li>
                <li>
                  <strong>Technical Device Data:</strong> IP address, device
                  type, web browser characteristics, operating system version,
                  and general usage analytics captured via cookies.
                </li>
              </ul>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-bold text-[color:var(--color-neutral-900)]"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                2. How We Use Your Information
              </h2>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                We utilize your personal information strictly for legitimate
                educational, operational, and customer support purposes:
              </p>
              <ul className="mt-3 pl-6 list-disc text-base md:text-[17px] text-[color:var(--color-neutral-700)] space-y-2 leading-relaxed">
                <li>
                  To manage your registration, course enrollments, and
                  coordinate classroom access.
                </li>
                <li>
                  To deliver cohort-based hybrid lectures, assignments, and
                  facilitate group discussions.
                </li>
                <li>
                  To issue verified, shareable digital certificates of
                  completion.
                </li>
                <li>
                  To safely process payment transactions and prevent payment
                  fraud.
                </li>
                <li>
                  To respond to your support queries, resolve grievances, and
                  communicate platform announcements.
                </li>
                <li>
                  To analyze aggregate platform metrics to improve site loading
                  speeds, design interfaces, and overall content layout.
                </li>
              </ul>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-bold text-[color:var(--color-neutral-900)]"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                3. Consent, Data Confidentiality & Sharing Restrictions
              </h2>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                Your data is strictly confidential. In alignment with Nepalese
                laws, {SITE_NAME} will <strong>never</strong> sell, rent, trade,
                or lease your personal information to third-party advertising or
                marketing companies for promotional purposes.
              </p>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                We may share your data only in the following limited
                circumstances:
              </p>
              <ul className="mt-3 pl-6 list-disc text-base md:text-[17px] text-[color:var(--color-neutral-700)] space-y-2 leading-relaxed">
                <li>
                  With trusted service providers who help us operate our site
                  (e.g. database hosting, secure payment processors, and
                  analytics providers) who are legally bound to keep your data
                  confidential.
                </li>
                <li>
                  When required by the Government of Nepal or legal mandates
                  under prevailing criminal or cybersecurity acts.
                </li>
              </ul>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-bold text-[color:var(--color-neutral-900)]"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                4. Cookies & Persistent Tracking
              </h2>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                We use cookies and similar session tracking mechanisms to
                remember your language preferences, keep you logged into your
                portal during a session, and gather anonymized website usage
                statistics. You can configure your browser to block or refuse
                cookies; however, doing so will degrade or disable essential
                interactive functionalities of the platform.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-bold text-[color:var(--color-neutral-900)]"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                5. Data Security Measures
              </h2>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                We enforce appropriate administrative, electronic, and physical
                security measures to safeguard personal data belonging to
                Nepalese citizens. All digital data traffic is encrypted in
                transit via Secure Socket Layers (SSL/HTTPS). Access to student
                data is limited solely to authorized employees, facilitators, or
                instructors who require it to support your learning. While we
                use industry-standard measures to protect your information, no
                digital network can be guaranteed 100% secure, and you share
                information at your own discretion.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-bold text-[color:var(--color-neutral-900)]"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                6. Your Legal Rights (Individual Privacy Act, 2075)
              </h2>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                Under Section 10 and 11 of the{" "}
                <strong>Individual Privacy Act, 2075</strong>, you possess the
                following explicit legal rights concerning your personal
                information:
              </p>
              <ul className="mt-3 pl-6 list-disc text-base md:text-[17px] text-[color:var(--color-neutral-700)] space-y-2 leading-relaxed">
                <li>
                  <strong>Right to Access & Review:</strong> You can request a
                  summary of the personal information we hold about you at any
                  time.
                </li>
                <li>
                  <strong>Right to Rectification & Correction:</strong> You have
                  the right to demand the correction or update of any
                  inaccurate, incomplete, or obsolete personal data.
                </li>
                <li>
                  <strong>
                    Right to Data Erasure (Right to be Forgotten):
                  </strong>{" "}
                  You may request the permanent deletion of your platform
                  account and the complete removal of your personal history from
                  our servers, subject to regulatory tax audit laws.
                </li>
              </ul>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-bold text-[color:var(--color-neutral-900)]"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                7. Policy Amendments
              </h2>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                We may amend or update this Privacy Policy periodically to adapt
                to changing legal requirements in Nepal, new course categories,
                or platform updates. Any changes will be posted directly on this
                page, and the &ldquo;Last updated&rdquo; timestamp will be
                revised accordingly.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-bold text-[color:var(--color-neutral-900)]"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                8. Contact Us & Privacy Officers
              </h2>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                If you have any questions, concerns, or requests regarding this
                Privacy Policy, your personal data, or to exercise your rights
                under the <strong>Individual Privacy Act, 2075</strong>, please
                reach out to us through our{" "}
                <Link
                  href="/contact-us"
                  className="text-[color:var(--color-primary-700)] hover:underline underline-offset-2"
                >
                  contact page
                </Link>{" "}
                or submit a direct support ticket.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
