"use client";
import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card, { CardContent } from "../../../../components/ui/Card";
import ResetPasswordForm from "./ResetPasswordForm";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import { adminAuthService } from "@/lib/services";
import { ApiError } from "@/lib/api";

type ResetState = {
  ok: boolean;
  message?: string;
  fieldErrors?: {
    token?: string;
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
  const { isAuthenticated } = useAdminAuth();
  const [state, setState] = useState<ResetState>({ ok: false });
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0); 
  const [isResending, setIsResending] = useState(false);
  const email = searchParams.get("email");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, router]);

  // Initialize timer from localStorage on mount
  useEffect(() => {
    const savedTimer = localStorage.getItem("adminResetPasswordCountdownEnd");
    if (savedTimer) {
      const endTime = parseInt(savedTimer, 10);
      const now = Date.now();
      if (endTime > now) {
        setResendTimer(Math.ceil((endTime - now) / 1000));
      } else {
        localStorage.removeItem("adminResetPasswordCountdownEnd");
      }
    } else {
      setResendTimer(0);
    }
  }, []);

  // Timer for resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            localStorage.removeItem("adminResetPasswordCountdownEnd");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendTimer]);

  const handleResetPassword = async (
    token: string,
    password: string,
    confirmPassword: string
  ) => {
    setIsLoading(true);

    // Client-side validation
    const fieldErrors: ResetState["fieldErrors"] = {};
    if (!token) {
      fieldErrors.token = "Verification code is required";
    } else if (token.length !== 6) {
      fieldErrors.token = "Verification code must be 6 digits";
    } else if (!/^\d+$/.test(token)) {
      fieldErrors.token = "Verification code must contain only numbers";
    }

    if (!password) {
      fieldErrors.password = "Password is required";
    } else if (password.length < 8) {
      fieldErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      fieldErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(password)) {
      fieldErrors.password = "Password must contain at least one number";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      fieldErrors.password =
        "Password must contain at least one special character";
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
      fieldErrors.token ||
      fieldErrors.password ||
      fieldErrors.confirmPassword
    ) {
      setState({
        ok: false,
        fieldErrors,
      });
      setIsLoading(false);
      return;
    }

    try {
      // Call the admin reset password API
      const response = await adminAuthService.resetPassword({
        email,
        token,
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
          router.push("/admin/login");
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
      const response = await adminAuthService.forgotPassword({ email });

      if (response.success) {
        setState({
          ok: true,
          message: "OTP sent successfully! Please check your email.",
        });
        const countdownSeconds = 120;
        setResendTimer(countdownSeconds);
        localStorage.setItem(
          "adminResetPasswordCountdownEnd",
          (Date.now() + countdownSeconds * 1000).toString()
        );
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
