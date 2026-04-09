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
  InstructorUpdatePasswordInput,
} from "./types";
import {
  InstructorSocialLinkInput,
  UpdateInstructorInput,
} from "../admin/instructor";

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
  credentials: InstructorLoginCredentials,
): Promise<ApiResponse<InstructorLoginResponseData>> => {
  return api.post<InstructorLoginResponseData>(
    "instructor/auth/login",
    credentials,
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
  input: InstructorForgotPasswordInput,
): Promise<ApiResponse<InstructorCommonResponseData>> => {
  return api.post<InstructorCommonResponseData>(
    "/instructor/auth/forgot-password",
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
  input: InstructorResetPasswordInput,
): Promise<ApiResponse<InstructorCommonResponseData>> => {
  return api.post<InstructorCommonResponseData>(
    "/instructor/auth/reset-password",
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
 * const response = await instructorAuthService.refreshToken();
 * if (response.success) {
 *   setAccessToken(response.data.accessToken);
 *   setRefreshToken(response.data.refreshToken);
 * }
 * ```
 */
export const refreshToken = async (
  refreshToken?: string,
): Promise<ApiResponse<InstructorLoginResponseData>> => {
  return api.post<InstructorLoginResponseData>(
    "instructor/auth/generate-access-token",
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
  input: InstructorUpdatePasswordInput,
): Promise<ApiResponse<InstructorCommonResponseData>> => {
  return api.patch<InstructorCommonResponseData>(
    "/instructor/auth/update-password",
    input,
  );
};

/**
 * Helper to append common fields to FormData
 */
const appendToFormData = (
  formData: FormData,
  input: Partial<UpdateInstructorInput>,
) => {
  Object.entries(input).forEach(([key, value]) => {
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
      } else if (key === "socialLinks" && Array.isArray(value)) {
        // Handle social links array
        (value as InstructorSocialLinkInput[]).forEach((link, index) => {
          if (link.name) {
            formData.append(
              `socialLinks[${index}][name]`,
              link.name.toString(),
            );
          }
          if (link.url) {
            formData.append(`socialLinks[${index}][url]`, link.url.toString());
          }
        });
      } else if (key === "skills" && Array.isArray(value)) {
        // Handle skills array
        value.forEach((skill) => {
          formData.append("skills[]", skill.toString());
        });
      } else if (key === "profilePicture" && value instanceof File) {
        // Handle file upload
        formData.append(key, value);
      } else if (typeof value === "boolean") {
        // Handle boolean values
        formData.append(key, value.toString());
      } else {
        // Handle string/number values
        formData.append(key, value.toString());
      }
    }
  });
};

/**
 * Update profile
 *
 * @param input - Instructor update data
 * @returns Promise resolving to updated instructor response
 *
 * @example
 * ```ts
 * try {
 *   const formData = new FormData();
 *   formData.append('firstName', 'John Updated');
 *   // ... append other fields to update
 *
 *   const response = await instructorAuthService.update({
 *     firstName: 'John Updated',
 *     // ... other fields
 *   });
 *
 *   if (response.success) {
 *     console.log('Instructor updated:', response.data);
 *   }
 * } catch (error) {
 *   console.error('Failed to update instructor:', error);
 * }
 * ```
 */
export const updateProfile = async (
  input: UpdateInstructorInput,
): Promise<ApiResponse<InstructorCommonResponseData>> => {
  const { id, ...updateData } = input;
  const formData = new FormData();

  // Append all fields to FormData
  appendToFormData(formData, updateData);

  return api.patch<InstructorCommonResponseData>(
    `/instructor/auth/update-profile`,
    formData,
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
  updatePassword,
  updateProfile,
};
