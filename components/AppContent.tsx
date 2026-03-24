"use client";

import React from "react";
import TopNavSwitcher from "@/components/TopNavSwitcher";
import Footer from "@/components/Footer";
import MaintenanceWrapper from "@/components/MaintenanceWrapper";
import { useSettings } from "@/lib/useSettings";

interface AppContentProps {
  children: React.ReactNode;
}

export default function AppContent({ children }: AppContentProps) {
  const { settings } = useSettings();

  return (
    <MaintenanceWrapper maintenanceMode={settings.maintenanceMode}>
      <TopNavSwitcher />
      {children}
      <Footer />
    </MaintenanceWrapper>
  );
}
