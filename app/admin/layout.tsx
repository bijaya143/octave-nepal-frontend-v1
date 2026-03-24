"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Container from "@/components/Container";
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  // Check if we're on an admin auth page
  const isAuthPage =
    pathname?.includes("/admin/login") ||
    pathname?.includes("/admin/forgot-password") ||
    pathname?.includes("/admin/reset-password");

  return (
    <AdminAuthGuard>
      <div className="py-6">
        <Container>
          <div className="flex items-start gap-6">
            {!isAuthPage && <AdminSidebar />}
            <main className={`flex-1 min-h-[60vh] ${isAuthPage ? "" : ""}`}>
              {children}
            </main>
          </div>
        </Container>
      </div>
    </AdminAuthGuard>
  );
}
