/**
 * Admin Instructor Service
 *
 * Handles instructor-related API calls for admin operations
 */

import { api, ApiResponse } from "@/lib/api";
import {
  AdminInstructorOutput,
  AdminInstructorFilterInput,
  AdminCommonResponseData,
} from ".";
import { Instructor } from "../instructor";

/**
 * Get list of instructors with optional filtering and pagination
 */
export const list = async (
  query?: AdminInstructorFilterInput,
): Promise<ApiResponse<AdminInstructorOutput>> => {
  // Build query string from parameters
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/admin/instructor/list${
    queryString ? `?${queryString}` : ""
  }`;

  return api.get<AdminInstructorOutput>(endpoint);
};

/**
 * Get a specific instructor by ID
 */
export const get = async (id: string): Promise<ApiResponse<Instructor>> => {
  const endpoint = `/admin/instructor/${id}`;
  return api.get<Instructor>(endpoint);
};

/**
 * Instructor address input type
 */
export interface InstructorAddressInput {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export enum InstructorBillingPaymentMethod {
  QR = "QR",
  BANK_TRANSFER = "BANK_TRANSFER",
  ONLINE_BANKING = "ONLINE_BANKING",
  CARD = "CARD",
  WALLET = "WALLET",
  OTHER = "OTHER",
}

/**
 * Instructor billing input type
 */
export interface InstructorBillingInput {
  billingEmail?: string;
  billingAddress?: string;
  billingPaymentMethod?: InstructorBillingPaymentMethod;
  billingTaxId?: string;
}

/**
 * Instructor social link input type
 */
export interface InstructorSocialLinkInput {
  name: string;
  url: string;
}

/**
 * Create instructor input type
 */
export interface CreateInstructorInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  phoneCountryCode?: string;
  bio?: string;
  dateOfBirth?: string;
  role?: string;
  experienceInYears?: number;
  skills?: string[];
  address?: InstructorAddressInput;
  billing?: InstructorBillingInput;
  socialLinks?: InstructorSocialLinkInput[];
  isActive?: boolean;
  isVerified?: boolean;
  isSuspended?: boolean;
  isFeatured?: boolean;
  profilePicture?: File;
}

/**
 * Update instructor input type (all fields optional for partial updates)
 */
export interface UpdateInstructorInput extends Partial<CreateInstructorInput> {
  id: string;
}

/**
 * Helper to append common fields to FormData
 */
const appendToFormData = (
  formData: FormData,
  input: Partial<CreateInstructorInput>,
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
 * Create a new instructor
 */
export const create = async (
  input: CreateInstructorInput,
): Promise<ApiResponse<Instructor>> => {
  const formData = new FormData();
  appendToFormData(formData, input);
  return api.post<Instructor>("/admin/instructor", formData);
};

/**
 * Update an existing instructor
 */
export const update = async (
  input: UpdateInstructorInput,
): Promise<ApiResponse<AdminCommonResponseData>> => {
  const { id, ...updateData } = input;
  const formData = new FormData();
  appendToFormData(formData, updateData);
  return api.patch<AdminCommonResponseData>(
    `/admin/instructor/${id}`,
    formData,
  );
};

/**
 * Delete an instructor
 */
export const deleteInstructor = async (
  id: string,
): Promise<ApiResponse<AdminCommonResponseData>> => {
  return api.delete<AdminCommonResponseData>(`/admin/instructor/${id}`);
};

/**
 * Admin instructor service object
 */
export const adminInstructorService = {
  list,
  get,
  create,
  update,
  delete: deleteInstructor,
};
