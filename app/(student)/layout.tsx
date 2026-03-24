"use client";
import React from "react";
import Container from "@/components/Container";
import StudentAuthGuard from "@/components/auth/StudentAuthGuard";

export default function StudentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <StudentAuthGuard>
      <div className="py-6">
        <Container>
          <div className="flex items-start gap-6">
            <main className="flex-1 min-h-[60vh]">{children}</main>
          </div>
        </Container>
      </div>
    </StudentAuthGuard>
  );
}
