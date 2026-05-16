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
import { adminAuthService } from "@/lib/services/admin/auth";
import { toast } from "sonner";

export default function AdminChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<{
    currentPassword?: string | null;
    newPassword?: string | null;
    confirmPassword?: string | null;
  }>({});

  const resetErrors = () => setErrors({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();

    const nextErrors: typeof errors = {};
    if (!currentPassword)
      nextErrors.currentPassword = "Current password is required";

    if (!newPassword) {
      nextErrors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      nextErrors.newPassword = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(newPassword)) {
      nextErrors.newPassword =
        "Password must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(newPassword)) {
      nextErrors.newPassword = "Password must contain at least one number";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      nextErrors.newPassword =
        "Password must contain at least one special character";
    }

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
      const response = await adminAuthService.updatePassword({
        oldPassword: currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      });

      if (response.success) {
        toast.success("Password updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        // Background sync to update user data
        try {
          const meResponse = await adminAuthService.me();
          if (meResponse.success && meResponse.data) {
            localStorage.setItem("user", JSON.stringify(meResponse.data));
            window.dispatchEvent(new Event("storage"));
          }
        } catch (err) {
          console.error("Failed to sync updated user:", err);
        }
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
    <main className="py-10">
      <Container>
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
            <CardHeader className="mb-4">
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
            <CardFooter className="flex items-center justify-end gap-3">
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update password"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Container>
    </main>
  );
}
