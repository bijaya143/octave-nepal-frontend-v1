import { SITE_NAME } from "@/lib/constant";
import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "Privacy Policy - " + SITE_NAME,
  description:
    "Learn how " +
    SITE_NAME +
    " collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <main>
      <section className="py-5 md:py-10">
        <Container className="max-w-3xl">
          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-[color:var(--color-neutral-600)]">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="mt-8 space-y-6 leading-relaxed">
            <p className="text-sm text-[color:var(--color-neutral-700)]">
              Your privacy is important to us. This Privacy Policy explains what
              information we collect, how we use it, and your rights regarding
              your information when you use {SITE_NAME}'s website and services.
            </p>

            <div>
              <h2
                className="text-xl md:text-2xl font-semibold"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                1. Information We Collect
              </h2>
              <p className="mt-2 text-sm text-[color:var(--color-neutral-700)]">
                We may collect information that you provide directly to us, such
                as your name, email address, phone number, and account details.
                We may also collect usage data, device information, and
                analytics data to improve our services. Payment information is
                processed securely by our payment partners and is not stored on
                our servers.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-semibold"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                2. How We Use Your Information
              </h2>
              <p className="mt-2 text-sm text-[color:var(--color-neutral-700)]">
                We use your information to provide and maintain our services,
                manage your account, process transactions, communicate with you,
                personalize your experience, and improve functionality and
                security. We may also use information to comply with legal
                obligations.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-semibold"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                3. Cookies and Tracking
              </h2>
              <p className="mt-2 text-sm text-[color:var(--color-neutral-700)]">
                We use cookies and similar technologies to remember your
                preferences and analyze site usage. You can control cookies
                through your browser settings, but disabling them may affect
                certain features.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-semibold"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                4. Third-Party Services
              </h2>
              <p className="mt-2 text-sm text-[color:var(--color-neutral-700)]">
                We may use trusted third-party providers (e.g., analytics and
                payment processors) to help deliver our services. These parties
                are authorized to process your information only as necessary to
                provide services to us and must protect it appropriately.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-semibold"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                5. Data Security
              </h2>
              <p className="mt-2 text-sm text-[color:var(--color-neutral-700)]">
                We implement reasonable safeguards to protect your information.
                However, no method of transmission or storage is completely
                secure, and we cannot guarantee absolute security.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-semibold"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                6. Your Rights
              </h2>
              <p className="mt-2 text-sm text-[color:var(--color-neutral-700)]">
                You may have rights to access, update, or delete your personal
                information, and to opt out of certain communications. To
                exercise these rights, please contact us.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-semibold"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                7. Changes to This Policy
              </h2>
              <p className="mt-2 text-sm text-[color:var(--color-neutral-700)]">
                We may update this Privacy Policy from time to time. Continued
                use of our services after any changes indicates your acceptance
                of the updated policy.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-semibold"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                8. Contact Us
              </h2>
              <p className="mt-2 text-sm text-[color:var(--color-neutral-700)]">
                If you have questions about this Privacy Policy, please reach
                out to us via the{" "}
                <Link
                  href="/contact"
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
