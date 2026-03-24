"use client";
import React from "react";
import Input from "../../../../components/ui/Input";
import PasswordInput from "../../../../components/ui/PasswordInput";
import Button from "../../../../components/ui/Button";
import Link from "next/link";

type RegisterState = {
  ok: boolean;
  message?: string;
  fieldErrors?: {
    fullName?: string;
    email?: string;
    password?: string;
  };
};

type RegisterFormProps = {
  onSubmit: (email: string, password: string) => void;
  state: RegisterState;
  isLoading: boolean;
};

export default function RegisterForm({
  onSubmit,
  state,
  isLoading,
}: RegisterFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        error={state?.fieldErrors?.email || null}
        disabled={isLoading}
      />
      <PasswordInput
        label="Password"
        name="password"
        required
        placeholder="••••••••"
        error={state?.fieldErrors?.password || null}
        disabled={isLoading}
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create account"}
      </Button>
      <div className="text-sm text-[color:var(--color-neutral-600)]">
        <span>Already have an account?</span>{" "}
        <Link
          href="/login"
          className="text-[color:var(--color-primary-700)] hover:underline"
        >
          Login
        </Link>
      </div>
    </form>
  );
}
