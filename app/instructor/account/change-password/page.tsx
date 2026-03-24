"use client";

import React from "react";
import Card, {
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";

export default function InstructorChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [errors, setErrors] = React.useState<{
    currentPassword?: string | null;
    newPassword?: string | null;
    confirmPassword?: string | null;
    form?: string | null;
  }>({});

  const resetErrors = () => setErrors({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();

    const nextErrors: typeof errors = {};
    if (!currentPassword)
      nextErrors.currentPassword = "Current password is required";
    if (!newPassword) nextErrors.newPassword = "New password is required";
    else if (newPassword.length < 6)
      nextErrors.newPassword = "Password must be at least 6 characters";
    if (!confirmPassword)
      nextErrors.confirmPassword = "Please confirm your new password";
    else if (confirmPassword !== newPassword)
      nextErrors.confirmPassword = "Passwords do not match";
    if (currentPassword && newPassword && currentPassword === newPassword) {
      nextErrors.newPassword = "New password must be different from current";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    // TODO: Replace with API call / server action to update password
    alert("Password updated successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <>
      <div className="mb-5 w-full max-w-xl md:max-w-2xl mx-auto">
        <div>
          <h1
            className="text-xl md:text-2xl font-semibold"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            Change password
          </h1>
          <p className="text-sm text-[color:var(--color-neutral-600)]">
            Update your account password.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-5 md:gap-6 w-full max-w-xl sm:max-w-xl md:max-w-2xl lg:max-w-2xl mx-auto"
      >
        <Card>
          <CardHeader>
            <h2
              className="text-base font-semibold"
              style={{ fontFamily: "var(--font-heading-sans)" }}
            >
              Password details
            </h2>
            <p className="mt-1 text-sm text-[color:var(--color-neutral-600)]">
              Ensure your new password is strong and unique.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <PasswordInput
              label="Current password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCurrentPassword(e.target.value)
              }
              required
              error={errors.currentPassword || null}
              autoComplete="current-password"
            />
            <PasswordInput
              label="New password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewPassword(e.target.value)
              }
              required
              error={errors.newPassword || null}
              hint="At least 6 characters"
              autoComplete="new-password"
            />
            <PasswordInput
              label="Confirm new password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
              required
              error={errors.confirmPassword || null}
              autoComplete="new-password"
            />
            {errors.form && (
              <p className="text-sm text-red-600">{errors.form}</p>
            )}
          </CardContent>
          <CardFooter className="flex items-center justify-end gap-3">
            <Button type="submit" variant="primary">
              Update password
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
