/**
 * API Configuration and Fetch Wrapper
 *
 * Provides a centralized, secure way to make API requests to external APIs.
 * Uses native fetch with proper error handling, authentication, and type safety.
 */

import type { ApiRequestConfig, ApiResponse } from "./types";
import { ApiError } from "./types";
import { getUserType, clearAuthData } from "@/lib/utils/auth";
import { adminAuthService } from "@/lib/services/admin/auth";
import { studentAuthService } from "@/lib/services/student/auth";
import { instructorAuthService } from "@/lib/services/instructor/auth";

// Promise to track an in-progress token refresh
let refreshPromise: Promise<boolean> | null = null;

/**
 * Get the base API URL from environment variables
 */
const getApiBaseUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    if (typeof window !== "undefined") {
      // Client-side: fallback to relative URLs or current origin
      return process.env.NEXT_PUBLIC_API_BASE_URL || "";
    }
    // Server-side: throw error if not configured
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }

  // Remove trailing slash
  return baseUrl.replace(/\/$/, "");
};

/**
 * Get authentication token from storage
 * This can be extended to support different storage mechanisms
 */
export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  // Try to get token from localStorage
  // You can extend this to support cookies, sessionStorage, etc.
  try {
    return localStorage.getItem("accessToken");
  } catch {
    return null;
  }
};

/**
 * Get refresh token from storage
 * This can be extended to support different storage mechanisms
 */
export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  // Try to get refresh token from localStorage
  // You can extend this to support cookies, sessionStorage, etc.
  try {
    return localStorage.getItem("refreshToken");
  } catch {
    return null;
  }
};

/**
 * Set authentication token in storage
 */
export const setAccessToken = (token: string | null): void => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
  } catch (error) {
    console.error("Failed to set auth token:", error);
  }
};

/**
 * Set refresh token in storage
 */
export const setRefreshToken = (token: string | null): void => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (token) {
      localStorage.setItem("refreshToken", token);
    } else {
      localStorage.removeItem("refreshToken");
    }
  } catch (error) {
    console.error("Failed to set refresh token:", error);
  }
};

/**
 * Build request headers with authentication and defaults
 */
const buildHeaders = (config: ApiRequestConfig = {}): HeadersInit => {
  const headers: HeadersInit = {
    ...config.customHeaders,
  };

  // Set Content-Type to JSON only if headers are provided and don't already specify Content-Type
  // If headers is undefined, it means we want to skip Content-Type entirely (for FormData)
  if (config.headers !== undefined) {
    const hasContentType =
      (config.headers as any)["Content-Type"] ||
      (config.headers as any)["content-type"];
    if (!hasContentType) {
      headers["Content-Type"] = "application/json";
    }
  }

  // Add authentication header if token exists and not skipped
  if (!config.skipAuth) {
    let token: string | null = null;

    // Use refresh token if specified, otherwise use access token
    if (config.useRefreshToken) {
      token = getRefreshToken();
    } else {
      token = getAccessToken();
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  // Merge with any headers provided in config (this will override defaults)
  if (config.headers) {
    Object.assign(headers, config.headers);
  }

  return headers;
};

/**
 * Create a timeout promise that rejects after specified milliseconds
 */
const createTimeoutPromise = (timeout: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timeout after ${timeout}ms`));
    }, timeout);
  });
};

/**
 * Refresh authentication token based on user type
 */
const refreshToken = async (): Promise<boolean> => {
  // If a refresh is already in progress, return the existing promise
  if (refreshPromise) {
    return refreshPromise;
  }

  const userType = getUserType();
  if (!userType) return false;

  // Create a new refresh promise
  refreshPromise = (async () => {
    try {
      const authService = {
        ADMIN: adminAuthService,
        STUDENT: studentAuthService,
        INSTRUCTOR: instructorAuthService,
      }[userType];

      const response = await authService.refreshToken();

      if (
        response.success &&
        response.data?.accessToken &&
        response.data?.refreshToken
      ) {
        setAccessToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
        return true;
      }

      return false;
    } catch (error) {
      // Any error from refresh API means we should redirect
      try {
        redirectToLogin();
      } catch (redirectError) {
        // Re-throw the redirect error to be handled by the caller
        throw redirectError;
      }
      return false;
    } finally {
      // Reset the promise when the refresh is complete
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

/**
 * Redirect to login page based on user type
 */
const redirectToLogin = (): never => {
  const userType = getUserType();
  clearAuthData();

  const loginPaths = {
    ADMIN: "/admin/login",
    STUDENT: "/login",
    INSTRUCTOR: "/instructor/login",
  };

  const path = loginPaths[userType as keyof typeof loginPaths] || "/login";

  // Use location.replace for immediate navigation
  window.location.replace(path);

  // Throw to stop execution
  throw new Error("AUTH_REDIRECT_INITIATED");
};

/**
 * Parse response and handle errors
 */
const parseResponse = async <T>(
  response: Response,
  afterRefresh = false,
  isRefreshCall = false
): Promise<ApiResponse<T>> => {
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  let data: unknown;

  try {
    if (isJson) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { message: text } : null;
    }
  } catch (error) {
    throw new ApiError(
      "Failed to parse response",
      response.status,
      "PARSE_ERROR",
      error
    );
  }

  // Handle successful responses
  if (response.ok) {
    // If response already follows our ApiResponse format, return it
    if (data && typeof data === "object" && "success" in data) {
      return data as ApiResponse<T>;
    }

    // Otherwise, wrap it in our standard format
    return {
      success: true,
      data: data as T,
    };
  }

  // Handle error responses
  const errorData = data as {
    message?: string;
    error?: string;
    code?: string;
    details?: unknown;
  };
  const errorMessage =
    errorData?.message ||
    errorData?.error ||
    `Request failed with status ${response.status}`;

  // Handle 401 Unauthorized - attempt token refresh (skip for refresh calls)
  if (response.status === 401 && !isRefreshCall) {
    // If this is after refresh and we still get 401, redirect to login
    if (afterRefresh) {
      redirectToLogin();
      // redirectToLogin() throws, so this never executes
    }

    try {
      const refreshSuccess = await refreshToken();
      if (refreshSuccess) {
        // Token refresh successful, signal to retry the request
        throw new ApiError("TOKEN_REFRESHED", 401, "TOKEN_REFRESHED");
      }
      // If refresh failed, redirectToLogin was already called in refreshToken()
      throw new ApiError("Authentication expired", 401, "AUTH_EXPIRED");
    } catch (refreshError) {
      // If redirect was initiated, let it propagate
      if (
        refreshError instanceof Error &&
        refreshError.message === "AUTH_REDIRECT_INITIATED"
      ) {
        throw refreshError;
      }
      throw refreshError;
    }
  }

  throw new ApiError(
    errorMessage,
    response.status,
    errorData?.code || "API_ERROR",
    errorData?.details
  );
};

/**
 * Main API request function
 *
 * @param endpoint - API endpoint (relative to base URL, e.g., '/users' or '/api/v1/users')
 * @param config - Request configuration options
 * @returns Promise resolving to API response
 *
 * @example
 * ```ts
 * // GET request
 * const users = await apiRequest<User[]>('/users');
 *
 * // POST request
 * const newUser = await apiRequest<User>('/users', {
 *   method: 'POST',
 *   body: JSON.stringify({ name: 'John' })
 * });
 *
 * // With custom headers
 * const data = await apiRequest('/endpoint', {
 *   headers: { 'X-Custom-Header': 'value' }
 * });
 * ```
 */
export const apiRequest = async <T = unknown>(
  endpoint: string,
  config: ApiRequestConfig = {},
  retryCount = 0,
  afterRefresh = false,
  isRefreshCall = false
): Promise<ApiResponse<T>> => {
  const baseUrl = getApiBaseUrl();
  const timeout = config.timeout ?? 30000; // Default 30 seconds

  // Build full URL
  const url = endpoint.startsWith("http")
    ? endpoint // Absolute URL
    : `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  // Build headers
  const headers = buildHeaders(config);

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // Make the request with timeout
    const response = await Promise.race([
      fetch(url, {
        ...config,
        headers,
        signal: controller.signal,
      }),
      createTimeoutPromise(timeout),
    ]);

    clearTimeout(timeoutId);

    // Parse and return response
    const isRefreshCall = config.useRefreshToken || false;
    return await parseResponse<T>(response, afterRefresh, isRefreshCall);
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle abort (timeout)
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError(
        `Request timeout after ${timeout}ms`,
        408,
        "TIMEOUT_ERROR"
      );
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new ApiError(
        "Network error: Unable to reach the server",
        0,
        "NETWORK_ERROR",
        error
      );
    }

    // Handle token refresh - retry once after successful refresh
    if (
      error instanceof ApiError &&
      error.code === "TOKEN_REFRESHED" &&
      retryCount === 0
    ) {
      return apiRequest<T>(endpoint, config, 1, true, false);
    }

    // Handle redirect initiated - stop all processing
    if (error instanceof Error && error.message === "AUTH_REDIRECT_INITIATED") {
      // Return unresolved promise to prevent further processing
      return new Promise(() => {});
    }

    // Re-throw ApiError instances
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle unknown errors
    throw new ApiError(
      error instanceof Error ? error.message : "Unknown error occurred",
      500,
      "UNKNOWN_ERROR",
      error
    );
  }
};

/**
 * Convenience methods for common HTTP methods
 */
export const api = {
  /**
   * GET request
   */
  get: <T = unknown>(endpoint: string, config?: ApiRequestConfig) =>
    apiRequest<T>(endpoint, { ...config, method: "GET" }),

  /**
   * POST request
   */
  post: <T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: ApiRequestConfig
  ) => {
    const isFormData = data instanceof FormData;
    const requestConfig: ApiRequestConfig = {
      ...config,
      method: "POST",
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    };

    // For FormData, don't set headers to avoid Content-Type conflicts
    // For JSON requests, ensure headers is defined so Content-Type gets set
    if (!isFormData) {
      requestConfig.headers = config?.headers || {};
    }

    return apiRequest<T>(endpoint, requestConfig);
  },

  /**
   * PUT request
   */
  put: <T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: ApiRequestConfig
  ) => {
    const isFormData = data instanceof FormData;
    const requestConfig: ApiRequestConfig = {
      ...config,
      method: "PUT",
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    };

    // For FormData, don't set headers to avoid Content-Type conflicts
    // For JSON requests, ensure headers is defined so Content-Type gets set
    if (!isFormData) {
      requestConfig.headers = config?.headers || {};
    }

    return apiRequest<T>(endpoint, requestConfig);
  },

  /**
   * PATCH request
   */
  patch: <T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: ApiRequestConfig
  ) => {
    const isFormData = data instanceof FormData;
    const requestConfig: ApiRequestConfig = {
      ...config,
      method: "PATCH",
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    };

    // For FormData, don't set headers to avoid Content-Type conflicts
    // For JSON requests, ensure headers is defined so Content-Type gets set
    if (!isFormData) {
      requestConfig.headers = config?.headers || {};
    }

    return apiRequest<T>(endpoint, requestConfig);
  },

  /**
   * DELETE request
   */
  delete: <T = unknown>(endpoint: string, config?: ApiRequestConfig) =>
    apiRequest<T>(endpoint, { ...config, method: "DELETE" }),
};

/**
 * Export ApiError for use in error handling
 */
export { ApiError } from "./types";
