/**
 * Admin Authentication Service
 *
 * Handles authentication-related API calls for admins including login, logout, token refresh, etc.
 */

import { api, ApiError } from "@/lib/api";
import type { ApiResponse } from "@/lib/api";
import type {
  Admin,
  AdminCommonResponseData,
  AdminForgotPasswordInput,
  AdminLoginCredentials,
  AdminLoginResponseData,
  AdminResetPasswordInput,
  AdminUpdatePasswordInput,
} from "./types";

/**
 * Login with email and password
 *
 * @param credentials - Login credentials (email and password)
 * @returns Promise resolving to login response token
 *
 * @example
 * ```ts
 * try {
 *   const response = await adminAuthService.login({
 *     email: 'admin@example.com',
 *     password: 'password123'
 *   });
 *
 *   if (response.success) {
 *     // Store token and user data
 *     setAuthToken(response.data.token.accessToken);
 *     console.log('Logged in as:', response.data.user);
 *   }
 * } catch (error) {
 *   if (error instanceof ApiError) {
 *     console.error('Login failed:', error.message);
 *   }
 * }
 * ```
 */
export const login = async (
  credentials: AdminLoginCredentials,
): Promise<ApiResponse<AdminLoginResponseData>> => {
  return api.post<AdminLoginResponseData>("admin/auth/login", credentials);
};

/**
 * Get current admin data
 *
 * @returns Promise resolving to me response
 */
export const me = async (): Promise<ApiResponse<Admin>> => {
  return api.get<Admin>("/admin/auth/me");
};

/**
 * Forgot password
 *
 * @param input - Forgot password input (email)
 * @returns Promise resolving to forgot password response
 */
export const forgotPassword = async (
  input: AdminForgotPasswordInput,
): Promise<ApiResponse<AdminCommonResponseData>> => {
  return api.post<AdminCommonResponseData>(
    "/admin/auth/forgot-password",
    input,
  );
};

/**
 * Reset password
 *
 * @param input - Reset password input (email, token, password)
 * @returns Promise resolving to reset password response
 */
export const resetPassword = async (
  input: AdminResetPasswordInput,
): Promise<ApiResponse<AdminCommonResponseData>> => {
  return api.post<AdminCommonResponseData>("/admin/auth/reset-password", input);
};

/**
 * Refresh authentication token
 *
 * The refresh token is automatically passed as Bearer token in the Authorization header.
 * If refreshToken is provided in the body, it will be included in the request body as well.
 *
 * @param refreshToken - Refresh token (optional, may be included in request body if API requires it)
 * @returns Promise resolving to new token data
 *
 * @example
 * ```ts
 * const response = await adminAuthService.refreshToken();
 * if (response.success) {
 *   setAccessToken(response.data.accessToken);
 *   setRefreshToken(response.data.refreshToken);
 * }
 * ```
 */
export const refreshToken = async (
  refreshToken?: string,
): Promise<ApiResponse<AdminLoginResponseData>> => {
  return api.post<AdminLoginResponseData>(
    "admin/auth/generate-access-token",
    refreshToken ? { refreshToken } : undefined,
    {
      useRefreshToken: true, // Use refresh token as Bearer token instead of access token
    },
  );
};

// Profile and Password Update

/**
 * Update password
 *
 * @param input - Password update input (oldPassword, newPassword, confirmNewPassword)
 * @returns Promise resolving to password update response
 */
export const updatePassword = async (
  input: AdminUpdatePasswordInput,
): Promise<ApiResponse<AdminCommonResponseData>> => {
  return api.patch<AdminCommonResponseData>(
    "/admin/auth/update-password",
    input,
  );
};

/**
 * Admin authentication service object
 */
export const adminAuthService = {
  login,
  me,
  forgotPassword,
  resetPassword,
  refreshToken,
  updatePassword,
};
