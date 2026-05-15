"use client";
import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card, { CardContent } from "../../../../components/ui/Card";
import ResetPasswordForm from "./ResetPasswordForm";
import { useStudentAuth } from "@/lib/hooks/useStudentAuth";
import { studentAuthService } from "@/lib/services";
import { ApiError } from "@/lib/api";
import { toast } from "sonner";

type ResetState = {
  ok: boolean;
  message?: string;
  fieldErrors?: {
    otp?: string;
    password?: string;
    confirmPassword?: string;
  };
};

function ResetPasswordLoadingFallback() {
  return (
    <main className="mx-auto max-w-md px-4 sm:px-6 py-10">
      <h1
        className="text-xl md:text-2xl font-semibold mb-6"
        style={{ fontFamily: "var(--font-heading-sans)" }}
      >
        Reset your password
      </h1>
      <Card>
        <CardContent className="py-5">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[color:var(--color-primary-700)]"></div>
            <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function ResetPasswordFormComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useStudentAuth();
  const [state, setState] = useState<ResetState>({ ok: false });
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(20); // 2 minutes in seconds
  const [isResending, setIsResending] = useState(false);
  const email = searchParams.get("email");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleResetPassword = async (
    otp: string,
    password: string,
    confirmPassword: string,
  ) => {
    setIsLoading(true);

    // Client-side validation
    const fieldErrors: ResetState["fieldErrors"] = {};
    if (!otp) {
      fieldErrors.otp = "Verification code is required";
    } else if (otp.length !== 6) {
      fieldErrors.otp = "Verification code must be 6 digits";
    } else if (!/^\d+$/.test(otp)) {
      fieldErrors.otp = "Verification code must contain only numbers";
    }

    if (!password) {
      fieldErrors.password = "Password is required";
    } else if (password.length < 6) {
      fieldErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      fieldErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      fieldErrors.confirmPassword = "Passwords do not match";
    }

    if (!email) {
      setState({
        ok: false,
        message: "Email is required for password reset.",
      });
      setIsLoading(false);
      return;
    }

    if (
      fieldErrors.otp ||
      fieldErrors.password ||
      fieldErrors.confirmPassword
    ) {
      setState({
        ok: false,
        fieldErrors,
      });
      // Show the first error as a toast
      // const firstError = Object.values(fieldErrors)[0];
      // if (firstError) toast.error(firstError);
      setIsLoading(false);
      return;
    }

    try {
      // Call the student reset password API
      const response = await studentAuthService.resetPassword({
        email,
        token: otp,
        password,
      });

      if (response.success) {
        setState({
          ok: true,
          message:
            response.data?.message ||
            "Password reset successfully! You can now log in with your new password.",
        });

        // Redirect to login page after a delay
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setState({
          ok: false,
          message:
            response.error?.message ||
            "Failed to reset password. Please try again.",
        });
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setState({
          ok: false,
          message:
            error.message || "Failed to reset password. Please try again.",
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

  const handleResendOTP = async () => {
    if (!email || isResending) return;

    setIsResending(true);
    try {
      const response = await studentAuthService.forgotPassword({ email });

      if (response.success) {
        setState({
          ok: true,
          message: "OTP sent successfully! Please check your email.",
        });
        setResendTimer(20); // Reset timer to 2 minutes
      } else {
        setState({
          ok: false,
          message:
            response.error?.message ||
            "Failed to resend OTP. Please try again.",
        });
      }
    } catch (error) {
      setState({
        ok: false,
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsResending(false);
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
        Reset your password
      </h1>
      <p className="text-sm text-muted-foreground -mt-4 mb-6">
        Enter the OTP code from your email and your new password.
      </p>
      <Card>
        <CardContent className="py-5">
          <ResetPasswordForm
            onSubmit={handleResetPassword}
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
          <div className="mt-8 pt-6 border-t border-[color:var(--color-neutral-200)]">
            <div className="text-sm text-muted-foreground text-center">
              <span>Didn't receive the code?</span>{" "}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[color:var(--color-neutral-50)] rounded-md">
                {resendTimer > 0 ? (
                  <span className="text-sm font-medium text-[color:var(--color-primary-700)]">
                    Resend in {Math.floor(resendTimer / 60)}:
                    {(resendTimer % 60).toString().padStart(2, "0")}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isResending}
                    className="text-sm font-medium text-[color:var(--color-primary-700)] hover:underline disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-transparent border-none p-0"
                  >
                    {isResending ? "Resending..." : "Resend Code"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoadingFallback />}>
      <ResetPasswordFormComponent />
    </Suspense>
  );
}
