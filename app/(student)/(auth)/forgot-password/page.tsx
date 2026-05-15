"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card, { CardContent } from "../../../../components/ui/Card";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { useStudentAuth } from "@/lib/hooks/useStudentAuth";
import { studentAuthService } from "@/lib/services";
import { ApiError } from "@/lib/api";
import { toast } from "sonner";

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
  const { isAuthenticated } = useStudentAuth();
  const [state, setState] = useState<ForgotState>({ ok: false });
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
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
        fieldErrors,
      });
      // Show error as toast
      // if (fieldErrors.email) toast.error(fieldErrors.email);
      setIsLoading(false);
      return;
    }

    try {
      // Call the student forgot password API
      const response = await studentAuthService.forgotPassword({ email });

      if (response.success) {
        // Redirect to reset password page with email
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
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
            onClearError={(field) => {
              if (state.fieldErrors?.[field]) {
                setState((prev) => ({
                  ...prev,
                  fieldErrors: {
                    ...prev.fieldErrors,
                    [field]: undefined,
                  },
                }));
              }
            }}
          />
        </CardContent>
      </Card>
    </main>
  );
}
