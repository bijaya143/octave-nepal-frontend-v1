"use client";
import React from "react";
import Input from "../../../../components/ui/Input";
import PasswordInput from "../../../../components/ui/PasswordInput";
import Button from "../../../../components/ui/Button";
import Link from "next/link";

import { useSearchParams } from "next/navigation";

type LoginState = {
  ok: boolean;
  message?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
  };
};

type LoginFormProps = {
  onSubmit: (email: string, password: string) => void;
  onClearError: (field: "email" | "password") => void;
  state: LoginState;
  isLoading: boolean;
};

export default function LoginForm({
  onSubmit,
  onClearError,
  state,
  isLoading,
}: LoginFormProps) {
  const searchParams = useSearchParams();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  React.useEffect(() => {
    const emailParam = searchParams.get("email");
    const passwordParam = searchParams.get("password");

    if (emailParam) setEmail(emailParam);
    if (passwordParam) setPassword(passwordParam);
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit(email.trim(), password);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {state?.message && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.message}
        </div>
      )}
      <Input
        label="Email"
        type="email"
        name="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          onClearError("email");
        }}
        error={state?.fieldErrors?.email || null}
        disabled={isLoading}
      />
      <PasswordInput
        label="Password"
        name="password"
        required
        placeholder="••••••••"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          onClearError("password");
        }}
        error={state?.fieldErrors?.password || null}
        disabled={isLoading}
      />
      <div className="text-xs text-right">
        <Link
          href="/forgot-password"
          className="text-[color:var(--color-primary-700)] hover:underline"
        >
          Forgot password?
        </Link>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </Button>
      <div className="text-sm text-[color:var(--color-neutral-600)]">
        <span>Don't have an account?</span>{" "}
        <Link
          href="/register"
          className="text-[color:var(--color-primary-700)] hover:underline"
        >
          Register
        </Link>
      </div>
    </form>
  );
}
