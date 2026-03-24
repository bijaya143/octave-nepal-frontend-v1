"use client";
import React from "react";
import Input from "../../../../components/ui/Input";
import PasswordInput from "../../../../components/ui/PasswordInput";
import Button from "../../../../components/ui/Button";

type ResetState = {
  ok: boolean;
  message?: string;
  fieldErrors?: {
    token?: string;
    password?: string;
    confirmPassword?: string;
  };
};

type ResetPasswordFormProps = {
  onSubmit: (token: string, password: string, confirmPassword: string) => void;
  state: ResetState;
  isLoading: boolean;
};

export default function ResetPasswordForm({
  onSubmit,
  state,
  isLoading,
}: ResetPasswordFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const token = String(formData.get("token") || "").trim();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    onSubmit(token, password, confirmPassword);
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
        label="Verification Code"
        type="text"
        name="token"
        required
        placeholder="Enter 6-digit code"
        error={state?.fieldErrors?.token || null}
        disabled={isLoading}
        autoComplete="one-time-code"
      />
      <PasswordInput
        label="New Password"
        name="password"
        required
        placeholder="••••••••"
        error={state?.fieldErrors?.password || null}
        disabled={isLoading}
      />
      <PasswordInput
        label="Confirm New Password"
        name="confirmPassword"
        required
        placeholder="••••••••"
        error={state?.fieldErrors?.confirmPassword || null}
        disabled={isLoading}
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Resetting password..." : "Reset password"}
      </Button>
    </form>
  );
}
