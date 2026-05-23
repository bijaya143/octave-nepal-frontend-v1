export type CookieCategory = "essential" | "analytics" | "functional" | "marketing";

export type CookiePreferences = Record<CookieCategory, boolean>;

export type CookieConsentRecord = {
  version: number;
  timestamp: string;
  preferences: CookiePreferences;
};

export type CookieCategoryMeta = {
  id: CookieCategory;
  label: string;
  description: string;
  required: boolean;
};
