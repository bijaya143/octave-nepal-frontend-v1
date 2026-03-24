"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card, { CardContent } from "../../../../components/ui/Card";
import LoginForm from "./LoginForm";
import { useStudentAuth } from "@/lib/hooks/useStudentAuth";

type LoginState = {
  ok: boolean;
  message?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
  };
};

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError, isAuthenticated } =
    useStudentAuth();
  const [state, setState] = useState<LoginState>({ ok: false });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
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
    }

    if (fieldErrors.email || fieldErrors.password) {
      setState({
        ok: false,
        message: "Please fix the errors below.",
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
        Log in
      </h1>
      <p className="text-sm text-muted-foreground -mt-4 mb-6">
        Welcome back! Enter your details to continue.
      </p>
      <Card>
        <CardContent className="py-5">
          <LoginForm
            onSubmit={handleLogin}
            state={state}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </main>
  );
}
