"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card, { CardContent } from "../../../../components/ui/Card";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import { adminAuthService } from "@/lib/services";
import { ApiError } from "@/lib/api";

type ForgotState = {
  ok: boolean;
  message?: string;
  email?: string;
  fieldErrors?: {
    email?: string;
  };
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { isAuthenticated } = useAdminAuth();
  const [state, setState] = useState<ForgotState>({ ok: false });
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleForgotPassword = async (email: string) => {
    setIsLoading(true);

    // Client-side validation
    const fieldErrors: ForgotState["fieldErrors"] = {};
    if (!email) {
      fieldErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      fieldErrors.email = "Enter a valid email";
    }

    if (fieldErrors.email) {
      setState({
        ok: false,
        message: "Please fix the errors below.",
        fieldErrors,
      });
      setIsLoading(false);
      return;
    }

    try {
      // Call the admin forgot password API
      const response = await adminAuthService.forgotPassword({ email });

      if (response.success) {
        // Redirect to reset password page with email
        router.push(`/admin/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        setState({
          ok: false,
          message:
            response.error?.message ||
            "Failed to send reset email. Please try again.",
        });
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setState({
          ok: false,
          message:
            error.message || "Failed to send reset email. Please try again.",
        });
      } else {
        setState({
          ok: false,
          message: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if already authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <main className="mx-auto max-w-md px-4 sm:px-6">
      <h1
        className="text-xl md:text-2xl font-semibold mb-6"
        style={{ fontFamily: "var(--font-heading-sans)" }}
      >
        Forgot password
      </h1>
      <p className="text-sm text-muted-foreground -mt-4 mb-6">
        Enter your email to receive a password reset OTP.
      </p>
      <Card>
        <CardContent className="py-5">
          <ForgotPasswordForm
            onSubmit={handleForgotPassword}
            state={state}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </main>
  );
}
