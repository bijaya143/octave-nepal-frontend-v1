/**
 * Student service types
 */

import { Admin, Enrollment, EnrollmentStatus } from "../admin";
import { PaginationInput, PaginationOutput } from "../common-types";

/**
 * Student information returned from authentication
 */
/**
 * Student for admin student listing
 */
export interface Student {
  id: string;
  email: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phoneNumber?: string;
  phoneCountryCode?: string;
  readableTemporaryPassword?: string;
  profilePictureKey?: string;
  bio?: string;
  dateOfBirth?: string;
  address?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  billing?: {
    billingEmail?: string;
    billingAddress?: string;
    billingTaxId?: string;
  };
  isActive: boolean;
  isVerified: boolean;
  isSuspended: boolean;
  userType: string | "STUDENT";
  creationMethod?: string | "MANUAL" | "AUTOMATIC";
  createdBy?: Admin;
  enrolledCourseCount?: number;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: unknown;
}

/**
 * Login credentials
 */
export interface StudentLoginCredentials {
  email: string;
  password: string;
}

/**
 * Login response data
 */
export interface StudentLoginResponseData {
  accessToken: string;
  refreshToken: string;
}

/**
 * Register credentials
 */
export interface StudentRegisterCredentials {
  email: string;
  password: string;
}

/**
 * Register response data
 */
export interface StudentRegisterResponseData {
  accessToken: string;
  refreshToken: string;
}

/**
 * Verify OTP input
 */
export interface StudentVerifyOtpInput {
  email: string;
  token: string;
}

/**
 * Common response data
 */
export interface StudentCommonResponseData {
  message: string;
}

/**
 * Forgot Password input
 */
export interface StudentForgotPasswordInput {
  email: string;
}

/**
 * Reset Password input
 */
export interface StudentResetPasswordInput {
  email: string;
  token: string;
  password: string;
}

/**
 * Student enrollment output
 */
export interface StudentEnrollmentOutput {
  data: Enrollment[];
  meta: PaginationOutput;
}

/**
 * Student enrollment filter input
 */
export interface StudentEnrollmentFilterInput extends PaginationInput {
  status?: EnrollmentStatus;
}
