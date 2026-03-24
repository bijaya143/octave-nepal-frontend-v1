"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { clearAuthData } from "@/lib/utils/auth";
import { TriangleAlert } from "lucide-react";

interface AuthConflictWarningProps {
  requiredUserType: "ADMIN" | "STUDENT" | "INSTRUCTOR";
  currentUserType: "ADMIN" | "STUDENT" | "INSTRUCTOR" | null;
  onLogout?: () => void;
}

export default function AuthConflictWarning({
  requiredUserType,
  currentUserType,
  onLogout,
}: AuthConflictWarningProps) {
  const router = useRouter();

  const getUserTypeDisplayName = (userType: string | null) => {
    switch (userType) {
      case "ADMIN":
        return "Admin";
      case "STUDENT":
        return "Student";
      case "INSTRUCTOR":
        return "Instructor";
      default:
        return "User";
    }
  };

  const getRequiredTypeDisplayName = (userType: string) => {
    switch (userType) {
      case "ADMIN":
        return "admin";
      case "STUDENT":
        return "student";
      case "INSTRUCTOR":
        return "instructor";
      default:
        return "user";
    }
  };

  const handleLogout = () => {
    clearAuthData();
    if (onLogout) {
      onLogout();
    } else {
      // Redirect to the appropriate login page based on required user type
      switch (requiredUserType) {
        case "ADMIN":
          router.push("/admin/login");
          break;
        case "STUDENT":
          router.push("/login");
          break;
        case "INSTRUCTOR":
          router.push("/instructor/login");
          break;
      }
    }
  };

  const handleGoBack = () => {
    // Go back to the appropriate dashboard based on current user type
    switch (currentUserType) {
      case "ADMIN":
        router.push("/admin/dashboard");
        break;
      case "STUDENT":
        router.push("/dashboard");
        break;
      case "INSTRUCTOR":
        router.push("/instructor/dashboard");
        break;
      default:
        router.push("/");
    }
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-yellow-100">
              <TriangleAlert className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
            </div>
            <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
              Access Restricted
            </h2>
            <p className="mt-2 text-center text-sm sm:text-base text-gray-600">
              You are currently logged in as a{" "}
              <span className="font-semibold text-gray-900">
                {getUserTypeDisplayName(currentUserType)}
              </span>
              . To access{" "}
              <span className="font-semibold text-gray-900">
                {getRequiredTypeDisplayName(requiredUserType)} pages
              </span>
              , you need to log out first.
            </p>
          </div>

          <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
            <button
              onClick={handleLogout}
              className="group relative w-full flex justify-center py-2.5 sm:py-2 px-4 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Log Out & Continue
            </button>

            <button
              onClick={handleGoBack}
              className="group relative w-full flex justify-center py-2.5 sm:py-2 px-4 border border-gray-300 text-sm sm:text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go Back to {getUserTypeDisplayName(currentUserType)} Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
