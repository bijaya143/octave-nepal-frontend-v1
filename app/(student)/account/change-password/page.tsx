"use client";

import React, { useState } from "react";
import Container from "@/components/Container";
import Card, {
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import { studentAuthService } from "@/lib/services/student/auth";

export default function StudentChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [errors, setErrors] = useState<{
    currentPassword?: string | null;
    newPassword?: string | null;
    confirmPassword?: string | null;
    form?: string | null;
  }>({});

  const resetErrors = () => setErrors({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();
    setSuccessMessage(null);

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

    try {
      setIsSubmitting(true);
      const response = await studentAuthService.updatePassword({
        oldPassword: currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      });

      if (response.success) {
        setSuccessMessage("Password updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setErrors({
          form:
            response?.error?.message ||
            "Failed to update password. Please try again.",
        });
      }
    } catch (err: any) {
      setErrors({ form: err.message || "An unexpected error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <div className="w-full max-w-xl md:max-w-2xl mx-auto">
        <div className="mb-6 px-2 sm:px-0">
          <h1
            className="text-2xl md:text-3xl font-semibold text-[color:var(--color-neutral-900)]"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            Change Password
          </h1>
          <p className="mt-2 text-sm text-[color:var(--color-neutral-600)]">
            Ensure your account uses a long, random password to stay secure.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full relative space-y-6">
          <Card className="overflow-hidden shadow-sm sm:rounded-xl">
            <CardHeader className="mb-4">
              <h2
                className="text-base font-semibold"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                Security Settings
              </h2>
              <p className="mt-1 text-sm text-[color:var(--color-neutral-500)]">
                Please enter your current password to proceed.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {successMessage && (
                <div className="p-3 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200 shadow-sm">
                  {successMessage}
                </div>
              )}
              {errors.form && (
                <div className="p-3 bg-red-50 text-red-700 text-sm font-medium rounded-lg border border-red-200 shadow-sm">
                  {errors.form}
                </div>
              )}
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
                disabled={isSubmitting}
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
                hint="Must be at least 6 characters."
                autoComplete="new-password"
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6">
              <Button
                type="submit"
                variant="primary"
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving changes..." : "Update Password"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </Container>
  );
}
