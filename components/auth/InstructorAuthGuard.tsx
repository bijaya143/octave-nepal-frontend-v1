"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { validateUserType, getUserType } from "@/lib/utils/auth";
import AuthConflictWarning from "./AuthConflictWarning";

interface InstructorAuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function InstructorAuthGuard({
  children,
  redirectTo = "/instructor/login",
}: InstructorAuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasConflict, setHasConflict] = useState(false);
  const [currentUserType, setCurrentUserType] = useState<
    "ADMIN" | "STUDENT" | "INSTRUCTOR" | null
  >(null);

  // Check if we're on an instructor auth page
  const isAuthPage =
    pathname?.includes("/instructor/login") ||
    pathname?.includes("/instructor/forgot-password") ||
    pathname?.includes("/instructor/reset-password");

  useEffect(() => {
    // Cross-tab authentication detection
    const handleCrossTabAuth = () => {
      if (isAuthPage) {
        // For auth pages: check if instructor logged in from another tab
        const userData = localStorage.getItem("user");
        const storedUserType = getUserType();
        if (userData && validateUserType(userData, "INSTRUCTOR")) {
          try {
            JSON.parse(userData); // Validate the user data
            // Instructor is logged in, redirect to instructor dashboard
            router.push("/instructor/dashboard");
          } catch (error) {
            // Invalid user data, remove it
            localStorage.removeItem("user");
          }
        } else if (
          userData &&
          storedUserType &&
          storedUserType !== "INSTRUCTOR"
        ) {
          // Different user type logged in, stay on auth page (don't redirect)
        }
      } else {
        // For protected pages: check if instructor logged out from another tab
        const userData = localStorage.getItem("user");
        const storedUserType = getUserType();

        if (!userData) {
          // User is logged out, redirect to login
          router.push("/instructor/login");
        } else if (storedUserType && storedUserType !== "INSTRUCTOR") {
          // Different user type is logged in, this will be handled by the conflict detection
        }
        // If instructor is still logged in, do nothing
      }
    };

    // Listen for storage changes (cross-tab authentication changes)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        if (isAuthPage) {
          // Instructor logged in from another tab
          if (e.newValue && validateUserType(e.newValue, "INSTRUCTOR")) {
            try {
              JSON.parse(e.newValue); // Validate the user data
              router.push("/instructor/dashboard");
            } catch (error) {
              localStorage.removeItem("user");
            }
          }
        } else {
          // Check for authentication changes
          const storedUserType = getUserType();
          if (!e.newValue) {
            // User logged out
            router.push("/instructor/login");
          } else if (storedUserType && storedUserType !== "INSTRUCTOR") {
            // Different user type - will be handled by conflict detection
            setHasConflict(true);
            setCurrentUserType(storedUserType);
            setIsAuthenticated(false);
          } else if (validateUserType(e.newValue, "INSTRUCTOR")) {
            // Instructor logged in
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
      // Check if instructor is authenticated (has instructor user data in localStorage)
      const userData = localStorage.getItem("user");
      const accessToken = localStorage.getItem("accessToken");

      if (userData && accessToken) {
        const storedUserType = getUserType();

        if (validateUserType(userData, "INSTRUCTOR")) {
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
        requiredUserType="INSTRUCTOR"
        currentUserType={currentUserType}
      />
    );
  }

  // For protected pages, only render if authenticated
  return isAuthenticated ? <>{children}</> : null;
}
