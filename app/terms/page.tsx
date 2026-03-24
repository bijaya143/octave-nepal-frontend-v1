import { SITE_NAME } from "@/lib/constant";
import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "Terms & Conditions - " + SITE_NAME,
  description:
    "Read the Terms & Conditions for using " + SITE_NAME + "'s website and services.",
};

export default function TermsPage() {
  return (
    <main>
      <section className="py-12 sm:py-16 md:py-20">
        <Container className="max-w-3xl">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading-sans)" }}>Terms & Conditions</h1>
          <p className="mt-2 text-sm text-[color:var(--color-neutral-600)]">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="mt-8 space-y-6 leading-relaxed">
            <p>
              Welcome to {SITE_NAME}. By accessing or using our website and services,
              you agree to be bound by these Terms & Conditions. Please read them
              carefully.
            </p>

            <div>
              <h2 className="text-xl md:text-2xl font-semibold" style={{ fontFamily: "var(--font-heading-sans)" }}>1. Use of Services</h2>
              <p className="mt-2 text-sm text-[color:var(--color-neutral-700)]">
                You agree to use our services in compliance with applicable laws and
                not for any unlawful purpose. We may modify, suspend, or discontinue
                any part of the services at any time.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-semibold" style={{ fontFamily: "var(--font-heading-sans)" }}>2. Accounts and Security</h2>
              <p className="mt-2 text-sm text-[color:var(--color-neutral-700)]">
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activities that occur under your
                account.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-semibold" style={{ fontFamily: "var(--font-heading-sans)" }}>3. Payments</h2>
              <p className="mt-2 text-sm text-[color:var(--color-neutral-700)]">
                If you purchase courses or services, you agree to provide accurate
                billing information. All fees are non-refundable unless stated
                otherwise.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-semibold" style={{ fontFamily: "var(--font-heading-sans)" }}>4. Intellectual Property</h2>
              <p className="mt-2 text-sm text-[color:var(--color-neutral-700)]">
                All content on this site, including text, graphics, logos, and
                course materials, is the property of {SITE_NAME} or its licensors
                and is protected by applicable intellectual property laws.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-semibold" style={{ fontFamily: "var(--font-heading-sans)" }}>5. Limitation of Liability</h2>
              <p className="mt-2 text-sm text-[color:var(--color-neutral-700)]">
                To the maximum extent permitted by law, {SITE_NAME} shall not be
                liable for any indirect, incidental, special, consequential, or
                punitive damages arising out of or relating to your use of the
                services.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-semibold" style={{ fontFamily: "var(--font-heading-sans)" }}>6. Changes to Terms</h2>
              <p className="mt-2 text-sm text-[color:var(--color-neutral-700)]">
                We may update these Terms & Conditions from time to time. Continued
                use of the services after changes constitutes acceptance of the
                updated terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-semibold" style={{ fontFamily: "var(--font-heading-sans)" }}>7. Contact Us</h2>
              <p className="mt-2 text-sm text-[color:var(--color-neutral-700)]">
                If you have questions about these Terms & Conditions, please contact
                us via the <Link href="/contact" className="text-[color:var(--color-primary-700)] hover:underline underline-offset-2">contact page</Link>.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}


