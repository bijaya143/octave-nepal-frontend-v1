"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { validateUserType, getUserType } from "@/lib/utils/auth";
import AuthConflictWarning from "./AuthConflictWarning";

interface StudentAuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function StudentAuthGuard({
  children,
  redirectTo = "/login",
}: StudentAuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasConflict, setHasConflict] = useState(false);
  const [currentUserType, setCurrentUserType] = useState<
    "ADMIN" | "STUDENT" | "INSTRUCTOR" | null
  >(null);

  // Check if we're on an auth page
  const isAuthPage =
    pathname?.includes("/login") ||
    pathname?.includes("/register") ||
    pathname?.includes("/forgot-password") ||
    pathname?.includes("/reset-password") ||
    pathname?.includes("/verify-otp");

  useEffect(() => {
    // Cross-tab authentication detection
    const handleCrossTabAuth = () => {
      if (isAuthPage) {
        // For auth pages: check if student logged in from another tab
        const userData = localStorage.getItem("user");
        const storedUserType = getUserType();
        if (userData && validateUserType(userData, "STUDENT")) {
          try {
            JSON.parse(userData); // Validate the user data
            // Student is logged in, redirect to dashboard (skip for verify-otp)
            if (!pathname?.includes("/verify-otp")) {
              router.push("/dashboard");
            }
          } catch (error) {
            // Invalid user data, remove it
            localStorage.removeItem("user");
          }
        } else if (userData && storedUserType && storedUserType !== "STUDENT") {
          // Different user type logged in, stay on auth page (don't redirect)
        }
      } else {
        // For protected pages: check if student logged out from another tab
        const userData = localStorage.getItem("user");
        const storedUserType = getUserType();

        if (!userData) {
          // User is logged out, redirect to login
          router.push("/login");
        } else if (storedUserType && storedUserType !== "STUDENT") {
          // Different user type is logged in, this will be handled by the conflict detection
        }
        // If student is still logged in, do nothing
      }
    };

    // Listen for storage changes (cross-tab authentication changes)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        if (isAuthPage) {
          // Student logged in from another tab
          if (
            e.newValue &&
            validateUserType(e.newValue, "STUDENT") &&
            !pathname?.includes("/verify-otp")
          ) {
            try {
              JSON.parse(e.newValue); // Validate the user data
              router.push("/dashboard");
            } catch (error) {
              localStorage.removeItem("user");
            }
          }
        } else {
          // Check for authentication changes
          const storedUserType = getUserType();
          if (!e.newValue) {
            // User logged out
            router.push("/login");
          } else if (storedUserType && storedUserType !== "STUDENT") {
            // Different user type - will be handled by conflict detection
            setHasConflict(true);
            setCurrentUserType(storedUserType);
            setIsAuthenticated(false);
          } else if (validateUserType(e.newValue, "STUDENT")) {
            // Student logged in
            setHasConflict(false);
            setIsAuthenticated(true);
          }
        }
      }
    };

    // Listen for visibility changes
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleCrossTabAuth();
      }
    };

    // Initial cross-tab check
    handleCrossTabAuth();

    window.addEventListener("storage", handleStorageChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname, isAuthPage, router]);

  useEffect(() => {
    if (!isAuthPage) {
      // Check if student is authenticated (has student user data in localStorage)
      const userData = localStorage.getItem("user");
      const accessToken = localStorage.getItem("accessToken");

      if (userData && accessToken) {
        const storedUserType = getUserType();

        if (validateUserType(userData, "STUDENT")) {
          try {
            const user = JSON.parse(userData);
            // Basic validation - check if user has required fields
            if (user && user.id && user.email) {
              setIsAuthenticated(true);
              setHasConflict(false);
            } else {
              // Invalid user data, redirect to login
              router.push(redirectTo);
            }
          } catch (error) {
            // Invalid JSON, redirect to login
            router.push(redirectTo);
          }
        } else if (storedUserType) {
          // User is authenticated but with different user type - show conflict warning
          setHasConflict(true);
          setCurrentUserType(storedUserType);
          setIsAuthenticated(false);
        } else {
          // No valid authentication data, redirect to login
          router.push(redirectTo);
        }
      } else {
        // No authentication data, redirect to login
        router.push(redirectTo);
      }
    }
  }, [pathname, isAuthPage, router, redirectTo]);

  // For auth pages, render children without protection
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Show conflict warning if user is authenticated with different user type
  if (hasConflict && currentUserType) {
    return (
      <AuthConflictWarning
        requiredUserType="STUDENT"
        currentUserType={currentUserType}
      />
    );
  }

  // For protected pages, only render if authenticated
  return isAuthenticated ? <>{children}</> : null;
}
