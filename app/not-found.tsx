"use client";

import React from "react";
import Link from "next/link";
import { Home, BookOpen } from "lucide-react";
import Container from "@/components/Container";

export default function NotFound() {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-12 md:py-24">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_60%)] pointer-events-none" />

      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          {/* Main Error Heading */}
          <div>
            <h1
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[color:var(--foreground)] mb-4 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Lost in the{" "}
              <span className="gradient-text">Right Direction?</span>
            </h1>

            <p className="text-base sm:text-lg text-[color:var(--color-neutral-600)] mb-8 max-w-lg mx-auto leading-relaxed">
              We couldn't find the page you're looking for. It might have been
              moved, deleted, or never existed. But don't worry, your learning
              journey doesn't stop here!
            </p>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-6 rounded-lg text-white bg-[color:var(--color-primary-600)] hover:bg-[color:var(--color-primary-700)] shadow-sm hover:shadow-md font-medium transition-all duration-150 cursor-pointer"
            >
              <Home className="h-4.5 w-4.5" />
              Go Back Home
            </Link>

            <Link
              href="/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-6 rounded-lg text-[color:var(--foreground)] border border-[color:var(--color-neutral-200)] bg-white hover:bg-[color:var(--color-neutral-50)] shadow-xs hover:border-[color:var(--color-neutral-300)] font-medium transition-all duration-150 cursor-pointer"
            >
              <BookOpen className="h-4.5 w-4.5" />
              Explore Courses
            </Link>
          </div>

          {/* Tertiary Contact Support */}
          <div className="mt-10 text-sm text-[color:var(--color-neutral-500)]">
            Need assistance?{" "}
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-1 text-[color:var(--color-primary-700)] hover:text-[color:var(--color-primary-800)] hover:underline font-semibold transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
