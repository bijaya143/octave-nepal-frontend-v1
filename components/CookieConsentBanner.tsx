"use client";

import Link from "next/link";
import { Cookie } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Switch from "@/components/ui/Switch";
import { COOKIE_CATEGORIES } from "@/lib/cookie-consent";
import { useCookieConsent } from "@/providers/CookieConsentProvider";

export function CookiePreferencesModal() {
  const {
    showPreferences,
    closePreferences,
    draftPreferences,
    setDraftPreferences,
    savePreferences,
    acceptAll,
    rejectAll,
  } = useCookieConsent();

  return (
    <Modal
      open={showPreferences}
      onClose={closePreferences}
      title="Cookie Preferences"
      panelClassName="max-w-lg sm:max-w-xl"
      contentClassName="pb-6"
    >
      <p className="text-sm text-[color:var(--color-neutral-600)] leading-relaxed">
        We use cookies to provide essential features, improve performance, and
        personalize your experience. You can change your choices at any time.
        Learn more in our{" "}
        <Link
          href="/cookies"
          className="text-[color:var(--color-primary-700)] hover:underline underline-offset-2"
        >
          Cookie Policy
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="text-[color:var(--color-primary-700)] hover:underline underline-offset-2"
        >
          Privacy Policy
        </Link>
        .
      </p>

      <div className="mt-5 space-y-4">
        {COOKIE_CATEGORIES.map((category) => (
          <div
            key={category.id}
            className="rounded-lg border border-[color:var(--color-neutral-200)] p-4 bg-[color:var(--color-neutral-50)]/50"
          >
            <Switch
              label={category.label}
              hint={category.description}
              checked={draftPreferences[category.id]}
              disabled={category.required}
              onChange={(event) => {
                if (category.required) return;
                setDraftPreferences((current) => ({
                  ...current,
                  [category.id]: event.target.checked,
                }));
              }}
            />
            {category.required && (
              <p className="mt-2 text-xs font-medium text-[color:var(--color-neutral-500)]">
                Always active
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
        <Button variant="secondary" size="sm" onClick={rejectAll}>
          Reject non-essential
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => savePreferences(draftPreferences)}
        >
          Save preferences
        </Button>
        <Button variant="primary" size="sm" onClick={acceptAll}>
          Accept all
        </Button>
      </div>
    </Modal>
  );
}

export default function CookieConsentBanner() {
  const { showBanner, acceptAll, rejectAll, openPreferences } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-40 p-4 sm:p-5 pointer-events-none"
    >
          <div className="pointer-events-auto mx-auto max-w-5xl rounded-xl border border-[color:var(--color-neutral-200)] bg-white/95 backdrop-blur-md shadow-lg">
            <div className="flex flex-col gap-4 p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-3 md:max-w-2xl">
                <div
                  className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[color:var(--color-primary-50)] text-[color:var(--color-primary-700)]"
                  aria-hidden
                >
                  <Cookie className="h-5 w-5" />
                </div>
                <div>
                  <p
                    className="text-sm font-semibold text-[color:var(--color-neutral-900)]"
                    style={{ fontFamily: "var(--font-heading-sans)" }}
                  >
                    We value your privacy
                  </p>
                  <p className="mt-1 text-sm text-[color:var(--color-neutral-600)] leading-relaxed">
                    We use cookies for essential site functions and, with your
                    consent, for analytics, personalization, and marketing. You
                    may accept all, reject non-essential cookies, or customize
                    your choices. See our{" "}
                    <Link
                      href="/cookies"
                      className="text-[color:var(--color-primary-700)] hover:underline underline-offset-2"
                    >
                      Cookie Policy
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-[color:var(--color-primary-700)] hover:underline underline-offset-2"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <Button variant="secondary" size="sm" onClick={rejectAll}>
                  Reject all
                </Button>
                <Button variant="secondary" size="sm" onClick={openPreferences}>
                  Customize
                </Button>
                <Button variant="primary" size="sm" onClick={acceptAll}>
                  Accept all
                </Button>
              </div>
            </div>
          </div>
    </div>
  );
}
