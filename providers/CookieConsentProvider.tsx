"use client";

import React from "react";
import {
  ALL_ACCEPTED_PREFERENCES,
  DEFAULT_PREFERENCES,
  type CookiePreferences,
} from "@/lib/cookie-consent";
import { readStoredConsent, writeStoredConsent } from "@/lib/cookie-consent/storage";

type CookieConsentContextValue = {
  hasConsented: boolean;
  preferences: CookiePreferences;
  showBanner: boolean;
  showPreferences: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (preferences: CookiePreferences) => void;
  openPreferences: () => void;
  closePreferences: () => void;
  setDraftPreferences: React.Dispatch<React.SetStateAction<CookiePreferences>>;
  draftPreferences: CookiePreferences;
};

const CookieConsentContext = React.createContext<CookieConsentContextValue | null>(
  null
);

export function useCookieConsent(): CookieConsentContextValue {
  const context = React.useContext(CookieConsentContext);
  if (!context) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return context;
}

type CookieConsentProviderProps = {
  children: React.ReactNode;
};

export default function CookieConsentProvider({
  children,
}: CookieConsentProviderProps) {
  const [hasConsented, setHasConsented] = React.useState(false);
  const [preferences, setPreferences] =
    React.useState<CookiePreferences>(DEFAULT_PREFERENCES);
  const [showBanner, setShowBanner] = React.useState(false);
  const [showPreferences, setShowPreferences] = React.useState(false);
  const [draftPreferences, setDraftPreferences] =
    React.useState<CookiePreferences>(DEFAULT_PREFERENCES);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    const stored = readStoredConsent();
    if (stored) {
      setPreferences(stored.preferences);
      setDraftPreferences(stored.preferences);
      setHasConsented(true);
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
    setHydrated(true);
  }, []);

  const persistPreferences = React.useCallback((next: CookiePreferences) => {
    const record = writeStoredConsent(next);
    setPreferences(record.preferences);
    setDraftPreferences(record.preferences);
    setHasConsented(true);
    setShowBanner(false);
    setShowPreferences(false);
  }, []);

  const acceptAll = React.useCallback(() => {
    persistPreferences(ALL_ACCEPTED_PREFERENCES);
  }, [persistPreferences]);

  const rejectAll = React.useCallback(() => {
    persistPreferences(DEFAULT_PREFERENCES);
  }, [persistPreferences]);

  const savePreferences = React.useCallback(
    (next: CookiePreferences) => {
      persistPreferences({
        ...next,
        essential: true,
      });
    },
    [persistPreferences]
  );

  const openPreferences = React.useCallback(() => {
    setDraftPreferences(preferences);
    setShowPreferences(true);
  }, [preferences]);

  const closePreferences = React.useCallback(() => {
    setShowPreferences(false);
    if (!hasConsented) {
      setDraftPreferences(DEFAULT_PREFERENCES);
    }
  }, [hasConsented]);

  const value = React.useMemo(
    () => ({
      hasConsented,
      preferences,
      showBanner: hydrated && showBanner,
      showPreferences,
      acceptAll,
      rejectAll,
      savePreferences,
      openPreferences,
      closePreferences,
      setDraftPreferences,
      draftPreferences,
    }),
    [
      hasConsented,
      preferences,
      hydrated,
      showBanner,
      showPreferences,
      acceptAll,
      rejectAll,
      savePreferences,
      openPreferences,
      closePreferences,
      draftPreferences,
    ]
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}
