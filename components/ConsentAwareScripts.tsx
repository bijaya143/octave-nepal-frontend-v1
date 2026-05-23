"use client";

import Script from "next/script";
import { useCookieConsent } from "@/providers/CookieConsentProvider";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function ConsentAwareScripts() {
  const { hasConsented, preferences } = useCookieConsent();

  if (!hasConsented || !preferences.analytics || !GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            anonymize_ip: true,
            allow_google_signals: ${preferences.marketing},
            allow_ad_personalization_signals: ${preferences.marketing}
          });
        `}
      </Script>
    </>
  );
}
