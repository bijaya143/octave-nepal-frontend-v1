import {
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  DEFAULT_PREFERENCES,
} from "./constants";
import type { CookieConsentRecord, CookiePreferences } from "./types";

export function readStoredConsent(): CookieConsentRecord | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CookieConsentRecord;
    if (parsed.version !== CONSENT_VERSION || !parsed.preferences) {
      return null;
    }

    return {
      ...parsed,
      preferences: {
        ...DEFAULT_PREFERENCES,
        ...parsed.preferences,
        essential: true,
      },
    };
  } catch {
    return null;
  }
}

export function writeStoredConsent(preferences: CookiePreferences): CookieConsentRecord {
  const record: CookieConsentRecord = {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    preferences: {
      ...preferences,
      essential: true,
    },
  };

  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  window.dispatchEvent(
    new CustomEvent("cookie-consent-change", { detail: record })
  );

  return record;
}

export function clearStoredConsent(): void {
  localStorage.removeItem(CONSENT_STORAGE_KEY);
}
