"use client";

import { useCookieConsent } from "@/providers/CookieConsentProvider";

export default function CookieSettingsLink() {
  const { openPreferences } = useCookieConsent();

  return (
    <button
      type="button"
      onClick={openPreferences}
      className="hover:text-[color:var(--color-primary-700)] transition-colors"
    >
      Cookie settings
    </button>
  );
}
