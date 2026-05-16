import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { adminAuthService } from "@/lib/services/admin/auth";
import { validateUserType, clearAuthData } from "@/lib/utils/auth";
import type { Admin } from "@/lib/services/admin/types";

export interface AdminUser extends Admin {}

export interface AuthState {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export function useAdminAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,
  });

  // Initialize auth state on mount and listen for changes
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const userData = localStorage.getItem("user");
        const accessToken = localStorage.getItem("accessToken");

        if (userData && accessToken && validateUserType(userData, "ADMIN")) {
          const user = JSON.parse(userData) as Admin;
          setAuthState({
            user: { ...user },
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
        } else {
          setAuthState((prev) => ({
            ...prev,
            user: null, // Added later for listening to storage events
            isAuthenticated: false, // Added later for listening to storage events
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error("Admin auth initialization error:", error);
        clearAuthData();
        setAuthState((prev) => ({
          ...prev,
          user: null, // Added later for listening to storage events
          isAuthenticated: false, // Added later for listening to storage events
          isLoading: false,
        }));
      }
    };

    // Listen for changes from other tabs or manual updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user" || e.key === "accessToken") {
        initializeAuth();
      }
    }; // Added later for listening to storage events

    initializeAuth();
    window.addEventListener("storage", handleStorageChange); // Added later for listening to storage events

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    }; // Added later for listening to storage events
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Safety timeout to prevent stuck loading state
      const timeoutId = setTimeout(() => {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Request timed out. Please try again.",
        }));
      }, 30000); // 30 seconds timeout

      try {
        const response = await adminAuthService.login({ email, password });

        if (!response.success) {
          const errorMessage = response.error?.message || "Login failed";
          setAuthState((prev) => ({
            ...prev,
            isLoading: false,
            error: errorMessage,
          }));
          return; // Don't throw, just set error state
        }

        // Store tokens
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        // Fetch user data
        const meResponse = await adminAuthService.me();
        if (!meResponse.success) {
          const errorMessage = "Failed to fetch user data";
          setAuthState((prev) => ({
            ...prev,
            isLoading: false,
            error: errorMessage,
          }));
          return; // Don't throw, just set error state
        }

        const user: AdminUser = { ...meResponse.data };

        // Store user data
        localStorage.setItem("user", JSON.stringify(user));

        clearTimeout(timeoutId);
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });

        // Redirect to admin dashboard
        router.push("/admin/dashboard");
      } catch (error) {
        clearTimeout(timeoutId);
        const errorMessage =
          error instanceof Error ? error.message : "Login failed";
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        // Don't re-throw the error, just set the state
      }
    },
    [router],
  );

  const logout = useCallback(async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      // Clear localStorage
      clearAuthData();

      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });

      router.push("/admin/login");
    } catch (error) {
      console.error("Admin logout error:", error);
    }
  }, [router]);

  const clearError = useCallback(() => {
    setAuthState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...authState,
    login,
    logout,
    clearError,
  };
}
