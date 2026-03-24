"use client";
import React from "react";
import Container from "@/components/Container";
import InstructorAuthGuard from "@/components/auth/InstructorAuthGuard";

export default function InstructorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <InstructorAuthGuard>
      <div className="py-6">
        <Container>
          <div className="flex items-start gap-6">
            <main className="flex-1 min-h-[60vh]">{children}</main>
          </div>
        </Container>
      </div>
    </InstructorAuthGuard>
  );
}
