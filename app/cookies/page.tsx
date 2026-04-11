import { SITE_NAME } from "@/lib/constant";
import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "Cookie Policy - " + SITE_NAME,
  description:
    "Understand how " +
    SITE_NAME +
    " uses cookies and how you can control them.",
};

export default function CookiesPage() {
  return (
    <main>
      <section className="py-5 md:py-10">
        <Container className="max-w-3xl">
          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            Cookie Policy
          </h1>
          <p className="mt-2 text-sm text-[color:var(--color-neutral-600)]">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="mt-8 space-y-6 leading-relaxed">
            <p className="text-sm text-[color:var(--color-neutral-700)]">
              This Cookie Policy explains what cookies are, how {SITE_NAME} uses
              them, and your choices regarding cookies when you use our website
              and services.
            </p>

            <div>
              <h2
                className="text-xl md:text-2xl font-semibold"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                1. What Are Cookies?
              </h2>
              <p className="mt-2 text-sm text-[color:var(--color-neutral-700)]">
                Cookies are small text files stored on your device when you
                visit a website. They are widely used to make websites work or
                operate more efficiently, as well as to provide reporting
                information.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-semibold"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                2. How We Use Cookies
              </h2>
              <p className="mt-2 text-sm text-[color:var(--color-neutral-700)]">
                We use cookies to enable essential site functionality, remember
                your preferences, analyze site traffic, and improve user
                experience.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-semibold"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                3. Types of Cookies We Use
              </h2>
              <ul className="mt-2 list-disc space-y-2 pl-6 text-sm text-[color:var(--color-neutral-700)]">
                <li>
                  <span className="font-medium">Essential Cookies:</span>{" "}
                  Required for the website to function and cannot be switched
                  off.
                </li>
                <li>
                  <span className="font-medium">Performance Cookies:</span> Help
                  us understand how visitors interact with the site by
                  collecting anonymous analytics data.
                </li>
                <li>
                  <span className="font-medium">Functional Cookies:</span>{" "}
                  Enable enhanced functionality and personalization.
                </li>
                <li>
                  <span className="font-medium">Advertising Cookies:</span> May
                  be set by us or third parties to deliver relevant content and
                  measure campaign performance.
                </li>
              </ul>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-semibold"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                4. Third-Party Cookies
              </h2>
              <p className="mt-2 text-sm text-[color:var(--color-neutral-700)]">
                We may allow trusted third parties to set cookies to provide
                analytics, advertising, or other services. These third parties
                have their own privacy and cookie policies.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-semibold"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                5. Managing Cookies
              </h2>
              <p className="mt-2 text-sm text-[color:var(--color-neutral-700)]">
                You can control and manage cookies through your browser
                settings. Please note that disabling certain cookies may affect
                the functionality and features of the site.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-semibold"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                6. Changes to This Policy
              </h2>
              <p className="mt-2 text-sm text-[color:var(--color-neutral-700)]">
                We may update this Cookie Policy periodically. Continued use of
                our services after changes indicates your acceptance of the
                updated policy.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-semibold"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                7. Contact Us
              </h2>
              <p className="mt-2 text-sm text-[color:var(--color-neutral-700)]">
                If you have questions about this Cookie Policy, please contact
                us via the{" "}
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
