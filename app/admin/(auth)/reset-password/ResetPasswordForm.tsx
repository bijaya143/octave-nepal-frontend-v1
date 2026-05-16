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
  onClearError: (field: "token" | "password" | "confirmPassword") => void;
  state: ResetState;
  isLoading: boolean;
};

export default function ResetPasswordForm({
  onSubmit,
  onClearError,
  state,
  isLoading,
}: ResetPasswordFormProps) {
  const [token, setToken] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(token.trim(), password, confirmPassword);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
        value={token}
        onChange={(e) => {
          setToken(e.target.value);
          onClearError("token");
        }}
        error={state?.fieldErrors?.token || null}
        disabled={isLoading}
        maxLength={6}
        autoComplete="one-time-code"
      />
      <PasswordInput
        label="New Password"
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
        hint="Minimum 8 characters, with at least one uppercase letter, one number, and one special character."
      />
      <PasswordInput
        label="Confirm New Password"
        name="confirmPassword"
        required
        placeholder="••••••••"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          onClearError("confirmPassword");
        }}
        error={state?.fieldErrors?.confirmPassword || null}
        disabled={isLoading}
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Resetting password..." : "Reset password"}
      </Button>
    </form>
  );
}
