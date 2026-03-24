"use client";
import React from "react";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import Link from "next/link";

type ForgotState = {
  ok: boolean;
  message?: string;
  email?: string;
  fieldErrors?: {
    email?: string;
  };
};

type ForgotPasswordFormProps = {
  onSubmit: (email: string) => void;
  state: ForgotState;
  isLoading: boolean;
};

export default function ForgotPasswordForm({
  onSubmit,
  state,
  isLoading,
}: ForgotPasswordFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();

    onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {state?.message && (
        <div
          className={`rounded-md border px-3 py-2 text-sm ${
            state.ok
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
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
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Sending OTP..." : "Send OTP"}
      </Button>
      <div className="text-sm text-center text-[color:var(--color-neutral-600)]">
        <Link
          href="/login"
          className="text-[color:var(--color-primary-700)] hover:underline"
        >
          Back to login
        </Link>
      </div>
    </form>
  );
}
