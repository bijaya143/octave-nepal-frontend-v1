"use client";

import React from "react";
import Card, {
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import { instructorAuthService } from "@/lib/services/instructor/auth";
import { toast } from "sonner";

export default function InstructorChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [errors, setErrors] = React.useState<{
    currentPassword?: string | null;
    newPassword?: string | null;
    confirmPassword?: string | null;
    form?: string | null;
  }>({});

  const resetErrors = () => setErrors({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();

    const nextErrors: typeof errors = {};
    if (!currentPassword)
      nextErrors.currentPassword = "Current password is required";
    if (!newPassword) nextErrors.newPassword = "New password is required";
    else if (newPassword.length < 8)
      nextErrors.newPassword = "Password must be at least 8 characters";
    else if (!/[A-Z]/.test(newPassword))
      nextErrors.newPassword =
        "Password must contain at least one uppercase letter";
    else if (!/[0-9]/.test(newPassword))
      nextErrors.newPassword = "Password must contain at least one number";
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword))
      nextErrors.newPassword =
        "Password must contain at least one special character";
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
      const response = await instructorAuthService.updatePassword({
        oldPassword: currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      });

      if (response.success) {
        toast.success("Password updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(
          response?.error?.message ||
            "Failed to update password. Please try again.",
        );
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-12">
      <div className="mb-6">
        <h1
          className="text-xl md:text-2xl font-semibold text-[color:var(--color-neutral-900)]"
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
            <PasswordInput
              label="Current password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setCurrentPassword(e.target.value);
                if (errors.currentPassword)
                  setErrors((prev) => ({ ...prev, currentPassword: null }));
              }}
              required
              error={errors.currentPassword || null}
              autoComplete="current-password"
              disabled={isSubmitting}
            />
            <PasswordInput
              label="New password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewPassword(e.target.value);
                if (errors.newPassword)
                  setErrors((prev) => ({ ...prev, newPassword: null }));
              }}
              required
              error={errors.newPassword || null}
              hint="Minimum 8 characters, with at least one uppercase letter, one number, and one special character."
              autoComplete="new-password"
              disabled={isSubmitting}
            />
            <PasswordInput
              label="Confirm new password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword)
                  setErrors((prev) => ({ ...prev, confirmPassword: null }));
              }}
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
  );
}
