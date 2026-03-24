/**
 * Instructor Authentication Service
 *
 * Handles authentication-related API calls for instructors including login, logout, token refresh, etc.
 */

import { api, ApiError } from "@/lib/api";
import type { ApiResponse } from "@/lib/api";
import type {
  Instructor,
  InstructorCommonResponseData,
  InstructorForgotPasswordInput,
  InstructorLoginCredentials,
  InstructorLoginResponseData,
  InstructorResetPasswordInput,
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
 *   const response = await instructorAuthService.login({
 *     email: 'instructor@example.com',
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
  credentials: InstructorLoginCredentials
): Promise<ApiResponse<InstructorLoginResponseData>> => {
  return api.post<InstructorLoginResponseData>(
    "instructor/auth/login",
    credentials
  );
};

/**
 * Get current instructor data
 *
 * @returns Promise resolving to me response
 */
export const me = async (): Promise<ApiResponse<Instructor>> => {
  return api.get<Instructor>("/instructor/auth/me");
};

/**
 * Forgot password
 *
 * @param input - Forgot password input (email)
 * @returns Promise resolving to forgot password response
 */
export const forgotPassword = async (
  input: InstructorForgotPasswordInput
): Promise<ApiResponse<InstructorCommonResponseData>> => {
  return api.post<InstructorCommonResponseData>(
    "/instructor/auth/forgot-password",
    input
  );
};

/**
 * Reset password
 *
 * @param input - Reset password input (email, token, password)
 * @returns Promise resolving to reset password response
 */
export const resetPassword = async (
  input: InstructorResetPasswordInput
): Promise<ApiResponse<InstructorCommonResponseData>> => {
  return api.post<InstructorCommonResponseData>(
    "/instructor/auth/reset-password",
    input
  );
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
 * const response = await instructorAuthService.refreshToken();
 * if (response.success) {
 *   setAccessToken(response.data.accessToken);
 *   setRefreshToken(response.data.refreshToken);
 * }
 * ```
 */
export const refreshToken = async (
  refreshToken?: string
): Promise<ApiResponse<InstructorLoginResponseData>> => {
  return api.post<InstructorLoginResponseData>(
    "instructor/auth/generate-access-token",
    refreshToken ? { refreshToken } : undefined,
    {
      useRefreshToken: true, // Use refresh token as Bearer token instead of access token
    }
  );
};

/**
 * Instructor authentication service object
 */
export const instructorAuthService = {
  login,
  me,
  forgotPassword,
  resetPassword,
  refreshToken,
};
