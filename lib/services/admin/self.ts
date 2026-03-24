/**
 * Admin Self Service
 *
 * Handles admin-related API calls for admin operations (Manage Admins)
 */

import { api, ApiResponse } from "@/lib/api";
import { Admin, AdminCommonResponseData, AdminListFilterInput, AdminListOutput } from "./types";

/**
 * Admin role types
 */
export enum AdminRoleType {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
}

/**
 * Admin address input type
 */
export interface AdminAddressInput {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

/**
 * Create admin input type
 */
export interface CreateAdminInput {
  firstName: string;
  middleName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  phoneCountryCode?: string;
  bio?: string;
  address?: AdminAddressInput;
  roleType: AdminRoleType;
  isActive?: boolean;
  isVerified?: boolean;
  isSuspended?: boolean;
  profilePicture?: File;
}

/**
 * Update admin input type
 */
export interface UpdateAdminInput extends Partial<CreateAdminInput> {
  id: string;
}

/**
 * Helper to append common fields to FormData
 */
const appendToFormData = (
  formData: FormData,
  input: Partial<CreateAdminInput>
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
 * Get admins
 */
export const list = async (
  query?: AdminListFilterInput
): Promise<ApiResponse<AdminListOutput>> => {   
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/admin/list${queryString ? `?${queryString}` : ""}`;
  
  return api.get<AdminListOutput>(endpoint);
};

/**
 * Get a specific admin by ID
 */
export const get = async (id: string): Promise<ApiResponse<Admin>> => {
  return api.get<Admin>(`/admin/${id}`);
};

/**
 * Create a new admin
 */
export const create = async (
  input: CreateAdminInput
): Promise<ApiResponse<Admin>> => {
  const formData = new FormData();
  appendToFormData(formData, input);
  return api.post<Admin>("/admin", formData);
};

/**
 * Update an existing admin
 */
export const update = async (
  input: UpdateAdminInput
): Promise<ApiResponse<AdminCommonResponseData>> => {
  const { id, ...updateData } = input;
  const formData = new FormData();
  appendToFormData(formData, updateData);
  return api.patch<AdminCommonResponseData>(`/admin/${id}`, formData);
};

/**
 * Delete an admin
 */
export const deleteAdmin = async (
  id: string
): Promise<ApiResponse<AdminCommonResponseData>> => {
  return api.delete<AdminCommonResponseData>(`/admin/${id}`);
};

/**
 * Admin self service object
 */
export const adminSelfService = {
  list,
  create,
  update,
  get,
  delete: deleteAdmin,
};
