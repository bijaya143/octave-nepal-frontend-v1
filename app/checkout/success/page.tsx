import React from "react";
import Container from "@/components/Container";

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ courseId?: string }> }) {
  const { courseId } = await searchParams;
  return (
    <main>
      <Container className="py-16">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-[color:var(--color-primary-100)] flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[color:var(--color-primary-700)]">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-heading-sans)" }}>Enrollment confirmed</h1>
          <p className="text-sm md:text-base text-[color:var(--color-neutral-700)]">
            You are enrolled in {courseId ? `Course #${courseId}` : "your selected course"}. We’ll email you the session links and materials shortly.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="/dashboard" className="inline-flex h-11 px-5 items-center justify-center rounded-lg bg-[color:var(--color-primary-600)] hover:bg-[color:var(--color-primary-700)] text-white shadow-sm w-full sm:w-auto">Go to dashboard</a>
            <a href="/courses" className="inline-flex h-11 px-5 items-center justify-center rounded-lg border border-[color:var(--color-neutral-200)] bg-white hover:bg-[color:var(--color-neutral-50)] w-full sm:w-auto">Browse more courses</a>
          </div>
        </div>
      </Container>
    </main>
  );
}


