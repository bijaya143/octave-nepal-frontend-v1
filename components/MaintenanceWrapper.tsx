"use client";

import React from "react";
import { usePathname } from "next/navigation";
import MaintenanceMode from "./MaintenanceMode";

interface MaintenanceWrapperProps {
  children: React.ReactNode;
  maintenanceMode?: boolean;
}

export default function MaintenanceWrapper({
  children,
  maintenanceMode = false
}: MaintenanceWrapperProps) {
  const pathname = usePathname();

  // Don't show maintenance mode for admin routes
  const isAdminRoute = pathname?.startsWith('/admin');

  if (maintenanceMode && !isAdminRoute) {
    return <MaintenanceMode />;
  }

  return <>{children}</>;
}
