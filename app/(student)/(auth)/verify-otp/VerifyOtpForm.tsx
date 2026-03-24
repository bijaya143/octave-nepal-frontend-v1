"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card, { CardContent } from "../../../../components/ui/Card";
import { Student, studentAuthService } from "@/lib/services";
import { ApiError, getAccessToken } from "@/lib/api";

export default function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const verifyOtp = async () => {
      const email = searchParams.get("email");
      const otp = searchParams.get("otp");

      if (!email || !otp) {
        setMessage(
          "Invalid verification link. Email and verification code are required."
        );
        setIsLoading(false);
        return;
      }

      try {
        const response = await studentAuthService.verifyOtp({
          email,
          token: otp,
        });

        if (response.success) {
          setIsSuccess(true);
          setMessage(response.data?.message || "Email verified successfully!");

          // After verification, if verified user is logged in user
          const student = localStorage.getItem("user");
          let user: Student | null = null;
          try {
            user = student ? JSON.parse(student) : null;
            if (user && user.email && user.email === email) {
              // if access token exists, fetch user details
              const accessToken = getAccessToken();
              if (accessToken) {
                try {
                  const meResponse = await studentAuthService.me();
                  if (meResponse.success) {
                    // Store student details in localStorage
                    localStorage.setItem(
                      "user",
                      JSON.stringify(meResponse.data)
                    );
                  }
                } catch (meError) {
                  // Silently fail - user details are not critical for verification
                  console.warn(
                    "Failed to fetch user details after verification:",
                    meError
                  );
                }
              }
            }
          } catch (error) {
            // Silently fail
            console.warn(
              "Failed to fetch user details from local storage after verification:",
              error
            );
          }
        } else {
          setMessage(
            response.error?.message || "Verification failed. Please try again."
          );
        }
      } catch (error) {
        if (error instanceof ApiError) {
          setMessage(error.message || "Verification failed. Please try again.");
        } else {
          setMessage("An unexpected error occurred. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyOtp();
  }, [searchParams, router]);

  return (
    <main className="mx-auto max-w-md px-4 sm:px-6">
      <h1
        className="text-xl md:text-2xl font-semibold mb-6"
        style={{ fontFamily: "var(--font-heading-sans)" }}
      >
        Verify your email
      </h1>
      <Card>
        <CardContent className="py-5">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block rounded-full h-8 w-8 border-b-2 border-[color:var(--color-primary-700)]"></div>
              <p className="mt-4 text-sm text-muted-foreground">
                Verifying your email...
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <div
                className={`rounded-md border px-4 py-3 text-sm ${
                  isSuccess
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
              {!isSuccess && (
                <p className="mt-4 text-xs text-muted-foreground">
                  If you continue to experience issues, please contact support.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
