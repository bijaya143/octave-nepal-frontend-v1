/**
 * Instructor service types
 */

import { Admin } from "../admin";

/**
 * Instructor information returned from authentication
 */
export interface Instructor {
  id: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  phoneCountryCode?: string;
  readableTemporaryPassword?: string;
  profilePictureKey?: string;
  bio?: string;
  dateOfBirth?: string;
  role?: string;
  experienceInYears?: number;
  skills?: string[];
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
    billingPaymentMethod?: string;
    billingTaxId?: string;
  };
  socialLinks?: {
    name: string;
    url: string;
  }[];
  isActive: boolean;
  isVerified: boolean;
  isSuspended: boolean;
  isFeatured: boolean;
  userType: string | "INSTRUCTOR";
  creationMethod?: string | "MANUAL" | "AUTOMATIC";
  createdBy?: Admin | null;
  courseCount?: number;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: unknown;
}

/**
 * Login credentials
 */
export interface InstructorLoginCredentials {
  email: string;
  password: string;
}

/**
 * Login response data
 */
export interface InstructorLoginResponseData {
  accessToken: string;
  refreshToken: string;
}

/**
 * Common response data
 */
export interface InstructorCommonResponseData {
  message: string;
}

/**
 * Forgot Password input
 */
export interface InstructorForgotPasswordInput {
  email: string;
}

/**
 * Reset Password input
 */
export interface InstructorResetPasswordInput {
  email: string;
  token: string;
  password: string;
}

/**
 * Update password input
 */
export interface InstructorUpdatePasswordInput {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
