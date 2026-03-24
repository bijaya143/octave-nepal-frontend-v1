/**
 * Student Authentication Service
 *
 * Handles authentication-related API calls for students including login, logout, token refresh, etc.
 */

import { api, ApiError } from "@/lib/api";
import type { ApiResponse } from "@/lib/api";
import type {
  StudentCommonResponseData,
  StudentForgotPasswordInput,
  StudentLoginCredentials,
  StudentLoginResponseData,
  StudentRegisterCredentials,
  StudentRegisterResponseData,
  StudentResetPasswordInput,
  Student,
  StudentVerifyOtpInput,
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
 *   const response = await studentAuthService.login({
 *     email: 'user@example.com',
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
  credentials: StudentLoginCredentials
): Promise<ApiResponse<StudentLoginResponseData>> => {
  return api.post<StudentLoginResponseData>("student/auth/login", credentials);
};

/**
 * Register with email and password
 *
 * @param credentials - Register credentials (email and password)
 * @returns Promise resolving to register response token
 */
export const register = async (
  credentials: StudentRegisterCredentials
): Promise<ApiResponse<StudentRegisterResponseData>> => {
  return api.post<StudentRegisterResponseData>(
    "student/auth/register",
    credentials
  );
};

/**
 * Get current student data
 *
 * @returns Promise resolving to me response
 *
 */
export const me = async (): Promise<ApiResponse<Student>> => {
  return api.get<Student>("/student/auth/me");
};

/**
 *
 * @param input
 * @returns Promise resolving to verify OTP response
 */
export const verifyOtp = async (
  input: StudentVerifyOtpInput
): Promise<ApiResponse<StudentCommonResponseData>> => {
  return api.post<StudentCommonResponseData>("/student/auth/verify", input);
};

/**
 *
 * @returns Promise resolving to resend verification OTP response
 */
export const resendVerificationOtp = async (): Promise<
  ApiResponse<StudentCommonResponseData>
> => {
  return api.post<StudentCommonResponseData>(
    "/student/auth/resent-verification-otp"
  );
};

/**
 *
 * @param input
 * @returns Promise resolving to forgot password response
 */
export const forgotPassword = async (
  input: StudentForgotPasswordInput
): Promise<ApiResponse<StudentCommonResponseData>> => {
  return api.post<StudentCommonResponseData>(
    "/student/auth/forgot-password",
    input
  );
};

/**
 *
 * @param input
 * @returns Promise resolving to reset password response
 */
export const resetPassword = async (
  input: StudentResetPasswordInput
): Promise<ApiResponse<StudentCommonResponseData>> => {
  return api.post<StudentCommonResponseData>(
    "/student/auth/reset-password",
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
 * const response = await studentAuthService.refreshToken();
 * if (response.success) {
 *   setAccessToken(response.data.accessToken);
 *   setRefreshToken(response.data.refreshToken);
 * }
 * ```
 */
export const refreshToken = async (
  refreshToken?: string
): Promise<ApiResponse<StudentLoginResponseData>> => {
  return api.post<StudentLoginResponseData>(
    "student/auth/generate-access-token",
    refreshToken ? { refreshToken } : undefined,
    {
      useRefreshToken: true, // Use refresh token as Bearer token instead of access token
    }
  );
};

/**
 * Student authentication service object
 */
export const studentAuthService = {
  login,
  register,
  me,
  verifyOtp,
  resendVerificationOtp,
  forgotPassword,
  resetPassword,
  refreshToken,
};
