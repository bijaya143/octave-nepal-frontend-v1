import { SITE_NAME } from "@/lib/constant";
import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "Cookie Policy - " + SITE_NAME,
  description:
    "Understand how " +
    SITE_NAME +
    " uses cookies and how you can manage your settings under prevailing privacy guidelines in Nepal.",
};

export default function CookiesPage() {
  return (
    <main>
      <section className="py-5 md:py-10 bg-linear-to-b from-white to-[color:var(--color-neutral-50)]/30">
        <Container className="max-w-3xl">
          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[color:var(--color-neutral-900)]"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            Cookie Policy
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
              This Cookie Policy describes how <strong>{SITE_NAME}</strong> uses cookies, web beacons, and similar tracking technologies on our online learning platform. By continuing to browse our site, register an account, or enroll in our digital courses, you agree to our use of tracking technologies as detailed in this policy, aligned with the <strong>Individual Privacy Act, 2075 (2018 A.D.)</strong> of Nepal.
            </p>

            <div className="p-5 rounded-xl border border-[color:var(--color-neutral-200)]/80 bg-white/70 backdrop-blur-xs">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--color-primary-700)]">
                Cookie Consent & Transparency Notice
              </h2>
              <p className="mt-2 text-sm md:text-base text-[color:var(--color-neutral-600)] leading-relaxed">
                In compliance with Nepalese digital privacy principles, we maintain full transparency regarding our tracking mechanisms. We only store essential technical identifiers automatically. You can toggle non-essential cookie permissions directly through your browser or device controls.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-bold text-[color:var(--color-neutral-900)]"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                1. What Are Cookies?
              </h2>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                Cookies are small text files composed of letters and numbers that are placed on your desktop computer, tablet, or smartphone when you visit a website. They serve as reliable memory markers, helping platforms recognize returning browsers, retain selected configurations, and coordinate seamless interactive systems.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-bold text-[color:var(--color-neutral-900)]"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                2. How We Use Cookies
              </h2>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                Our platform utilizes cookies to make your online learning experience smooth, efficient, and personalized. These tracking tools allow us to:
              </p>
              <ul className="mt-3 pl-6 list-disc text-base md:text-[17px] text-[color:var(--color-neutral-700)] space-y-2 leading-relaxed">
                <li>Maintain secure authentication states so you do not have to log in repeatedly during a single session.</li>
                <li>Process payment handshakes and direct callback sessions with local digital wallets (such as eSewa or Khalti).</li>
                <li>Remember your filters on the course list, playback positions in cohort video lessons, and interactive chat configurations.</li>
                <li>Analyze overall site traffic speed and diagnose technical bugs to improve overall performance.</li>
              </ul>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-bold text-[color:var(--color-neutral-900)]"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                3. Categories of Cookies We Deploy
              </h2>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                We categorize the cookies operating on our platform as follows:
              </p>
              <ul className="mt-3 pl-6 list-disc text-base md:text-[17px] text-[color:var(--color-neutral-700)] space-y-3 leading-relaxed">
                <li>
                  <strong>Strictly Essential Cookies:</strong> These are technically required for our website core to function. They support account registrations, secure login dashboards, and payment checkouts. They cannot be disabled, as the site will fail to load or authenticate without them.
                </li>
                <li>
                  <strong>Performance & Analytics Cookies:</strong> These help us track anonymous user visits, measure which courses attract the highest engagement, and identify pages with high loading latency. We rely on trusted tools like Google Analytics to compile these metrics without gathering identifying personal data.
                </li>
                <li>
                  <strong>Functional Optimization Cookies:</strong> These remember your interface selections, such as theme preferences, video playback quality scales, course search queries, and grid sorting styles, preventing you from resetting them on each page visit.
                </li>
                <li>
                  <strong>Targeting & Advertising Cookies:</strong> These may be deployed by our third-party marketing networks to monitor user interactions with our ads and serve relevant platform highlights on external social networks.
                </li>
              </ul>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-bold text-[color:var(--color-neutral-900)]"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                4. Third-Party Cookies & Widgets
              </h2>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                Certain modules on our platform integrate cookies managed by licensed external providers:
              </p>
              <ul className="mt-3 pl-6 list-disc text-base md:text-[17px] text-[color:var(--color-neutral-700)] space-y-2 leading-relaxed">
                <li><strong>Analytics Engines:</strong> Trusted tracking frameworks to map and enhance global page performance.</li>
                <li><strong>Digital Payment Gateways:</strong> Temporary checkout validation tracking managed by licensed Nepalese institutions (eSewa, Khalti, ConnectIPS).</li>
                <li><strong>Student Groups & Media:</strong> Embedded widgets supporting cohort video playback and direct forum communication links (Discord, Slack, YouTube).</li>
              </ul>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-bold text-[color:var(--color-neutral-900)]"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                5. How You Can Control Cookies
              </h2>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                You hold the absolute right to refuse or delete cookies. Most web browsers accept cookies automatically, but you can alter your browser configuration preferences to disable cookies or receive a warning alert before a cookie is placed.
              </p>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                Please be aware that disabling essential cookies will immediately interrupt secure session authentication, cohort playback configurations, and online payment checkouts on {SITE_NAME}.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-bold text-[color:var(--color-neutral-900)]"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                6. Amendments to this Policy
              </h2>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                We reserve the right to revise this Cookie Policy at any time to align with updated browser rules, secure token methodologies, or changing digital privacy laws in Nepal. The latest copy will be uploaded directly to this page with an updated &ldquo;Last updated&rdquo; indicator.
              </p>
            </div>

            <div>
              <h2
                className="text-xl md:text-2xl font-bold text-[color:var(--color-neutral-900)]"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                7. Contact Us
              </h2>
              <p className="mt-2.5 text-base md:text-[17px] text-[color:var(--color-neutral-700)] leading-relaxed">
                If you have any questions, feedback, or concerns regarding our Cookie Policy, please reach out to our support team through our{" "}
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
