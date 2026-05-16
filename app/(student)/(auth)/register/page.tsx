"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card, { CardContent } from "../../../../components/ui/Card";
import RegisterForm from "./RegisterForm";
import { useStudentAuth } from "@/lib/hooks/useStudentAuth";
import { toast } from "sonner";

type RegisterState = {
  ok: boolean;
  message?: string;
  fieldErrors?: {
    fullName?: string;
    email?: string;
    password?: string;
  };
};

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError, isAuthenticated } =
    useStudentAuth();
  const [state, setState] = useState<RegisterState>({ ok: false });

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

  const handleRegister = async (email: string, password: string) => {
    // Client-side validation
    const fieldErrors: RegisterState["fieldErrors"] = {};
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
      fieldErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(password)) {
      fieldErrors.password = "Password must contain at least one number";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      fieldErrors.password = "Password must contain at least one special character";
    }

    if (fieldErrors.email || fieldErrors.password) {
      setState({
        ok: false,
        fieldErrors,
      });
      // Show the first error as a toast
      // const firstError = Object.values(fieldErrors)[0];
      // if (firstError) toast.error(firstError);
      return;
    }

    // Clear any previous errors
    setState({ ok: false });
    clearError();

    // Call register - errors are handled by the auth hook
    await register(email, password);
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
        Create an account
      </h1>
      <p className="text-sm text-muted-foreground -mt-4 mb-6">
        Join us! Enter your details to sign up.
      </p>
      <Card>
        <CardContent className="py-5">
          <RegisterForm
            onSubmit={handleRegister}
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
