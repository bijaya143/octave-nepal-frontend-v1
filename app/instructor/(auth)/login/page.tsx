"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Card, { CardContent } from "../../../../components/ui/Card";
import LoginForm from "./LoginForm";
import { useInstructorAuth } from "@/lib/hooks/useInstructorAuth";

type LoginState = {
  ok: boolean;
  message?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
  };
};

function LoginContent() {
  const router = useRouter();
  const { login, isLoading, error, clearError, isAuthenticated } =
    useInstructorAuth();
  const [state, setState] = useState<LoginState>({ ok: false });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/instructor/dashboard");
    }
  }, [isAuthenticated, router]);

  // Update state when auth error occurs
  useEffect(() => {
    if (error) {
      setState({
        ok: false,
        message: error,
      });
    }
  }, [error]);

  const handleLogin = async (email: string, password: string) => {
    // Client-side validation
    const fieldErrors: LoginState["fieldErrors"] = {};
    if (!email) {
      fieldErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      fieldErrors.email = "Enter a valid email";
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

    if (fieldErrors.email || fieldErrors.password) {
      setState({
        ok: false,
        fieldErrors,
      });
      return;
    }

    // Clear any previous errors
    setState({ ok: false });
    clearError();

    // Call login - errors are handled by the auth hook
    await login(email, password);
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
        Instructor Login
      </h1>
      <p className="text-sm text-muted-foreground -mt-4 mb-6">
        Welcome back! Enter your instructor credentials to continue.
      </p>
      <Card>
        <CardContent className="py-5">
          <LoginForm
            onSubmit={handleLogin}
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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
