import type { CookieCategoryMeta, CookiePreferences } from "./types";

export const CONSENT_VERSION = 1;
export const CONSENT_STORAGE_KEY = "octave-cookie-consent";

export const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: false,
  functional: false,
  marketing: false,
};

export const ALL_ACCEPTED_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: true,
  functional: true,
  marketing: true,
};

export const COOKIE_CATEGORIES: CookieCategoryMeta[] = [
  {
    id: "essential",
    label: "Strictly Essential",
    description:
      "Required for secure login, checkout, and core platform features. These cannot be disabled.",
    required: true,
  },
  {
    id: "analytics",
    label: "Performance & Analytics",
    description:
      "Help us understand how visitors use our site so we can improve course discovery and page performance.",
    required: false,
  },
  {
    id: "functional",
    label: "Functional",
    description:
      "Remember your preferences such as filters, playback settings, and interface customizations.",
    required: false,
  },
  {
    id: "marketing",
    label: "Targeting & Advertising",
    description:
      "Allow us and our partners to show relevant course highlights and measure ad campaign effectiveness.",
    required: false,
  },
];
