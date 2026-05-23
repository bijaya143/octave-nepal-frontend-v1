"use client";

import { usePathname } from "next/navigation";
import CookieConsentProvider from "@/providers/CookieConsentProvider";
import CookieConsentBanner, {
  CookiePreferencesModal,
} from "@/components/CookieConsentBanner";
import ConsentAwareScripts from "@/components/ConsentAwareScripts";

type CookieConsentShellProps = {
  children: React.ReactNode;
};

export default function CookieConsentShell({ children }: CookieConsentShellProps) {
  const pathname = usePathname();
  const showPublicConsentUi = !pathname?.startsWith("/admin");

  return (
    <CookieConsentProvider>
      {children}
      <CookiePreferencesModal />
      {showPublicConsentUi && (
        <>
          <CookieConsentBanner />
          <ConsentAwareScripts />
        </>
      )}
    </CookieConsentProvider>
  );
}
