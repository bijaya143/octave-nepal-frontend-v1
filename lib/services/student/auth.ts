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
  StudentUpdatePasswordInput,
} from "./types";
import { UpdateStudentInput } from "../admin/student";

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
  credentials: StudentLoginCredentials,
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
  credentials: StudentRegisterCredentials,
): Promise<ApiResponse<StudentRegisterResponseData>> => {
  return api.post<StudentRegisterResponseData>(
    "student/auth/register",
    credentials,
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
  input: StudentVerifyOtpInput,
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
    "/student/auth/resent-verification-otp",
  );
};

/**
 *
 * @param input
 * @returns Promise resolving to forgot password response
 */
export const forgotPassword = async (
  input: StudentForgotPasswordInput,
): Promise<ApiResponse<StudentCommonResponseData>> => {
  return api.post<StudentCommonResponseData>(
    "/student/auth/forgot-password",
    input,
  );
};

/**
 *
 * @param input
 * @returns Promise resolving to reset password response
 */
export const resetPassword = async (
  input: StudentResetPasswordInput,
): Promise<ApiResponse<StudentCommonResponseData>> => {
  return api.post<StudentCommonResponseData>(
    "/student/auth/reset-password",
    input,
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
  refreshToken?: string,
): Promise<ApiResponse<StudentLoginResponseData>> => {
  return api.post<StudentLoginResponseData>(
    "student/auth/generate-access-token",
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
  input: StudentUpdatePasswordInput,
): Promise<ApiResponse<StudentCommonResponseData>> => {
  return api.patch<StudentCommonResponseData>(
    "/student/auth/update-password",
    input,
  );
};

/**
 * Update profile
 *
 * @param input - Student update data
 * @returns Promise resolving to updated student response
 *
 * @example
 * ```ts
 * try {
 *   const formData = new FormData();
 *   formData.append('firstName', 'John Updated');
 *   // ... append other fields to update
 *
 *   const response = await adminStudentService.update({
 *     firstName: 'John Updated',
 *     // ... other fields
 *   });
 *
 *   if (response.success) {
 *     console.log('Student updated:', response.data);
 *   }
 * } catch (error) {
 *   console.error('Failed to update student:', error);
 * }
 * ```
 */
export const updateProfile = async (
  input: UpdateStudentInput,
): Promise<ApiResponse<StudentCommonResponseData>> => {
  const { id, ...updateData } = input;
  const formData = new FormData();

  // Append all fields to FormData
  Object.entries(updateData).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (key === "address" && typeof value === "object") {
        // Handle nested address object
        Object.entries(value).forEach(([addrKey, addrValue]) => {
          if (
            addrValue !== undefined &&
            addrValue !== null &&
            addrValue !== ""
          ) {
            formData.append(`address[${addrKey}]`, addrValue.toString());
          }
        });
      } else if (key === "billing" && typeof value === "object") {
        // Handle nested billing object
        Object.entries(value).forEach(([billKey, billValue]) => {
          if (
            billValue !== undefined &&
            billValue !== null &&
            billValue !== ""
          ) {
            formData.append(`billing[${billKey}]`, billValue.toString());
          }
        });
      } else if (key === "profilePicture" && value instanceof File) {
        // Handle file upload
        formData.append(key, value);
      } else if (typeof value === "boolean") {
        // Handle boolean values
        formData.append(key, value.toString());
      } else {
        // Handle string values
        formData.append(key, value.toString());
      }
    }
  });

  return api.patch<StudentCommonResponseData>(
    `/student/auth/update-profile`,
    formData,
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
  updatePassword,
  updateProfile,
};
