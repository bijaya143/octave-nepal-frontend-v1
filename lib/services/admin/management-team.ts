/**
 * Admin Management Team Service
 *
 * Handles admin-related API calls for management team operations
 */

import { api, ApiResponse } from "@/lib/api";
import {
  AdminCommonResponseData,
  AdminManagementTeamFilterInput,
  AdminManagementTeamOutput,
  AdminTagFilterInput,
  AdminTagOutput,
  ManagementTeam,
  Tag,
} from "./types";

/**
 * Create management team input type
 */
export interface CreateManagementTeamInput {
  name: string;
  email?: string;
  position: string;
  displayOrder: number;
  image: File;
  isPublished?: boolean;
}

/**
 * Update management team input type
 */
export interface UpdateManagementTeamInput extends Partial<
  Omit<CreateManagementTeamInput, "image">
> {
  id: string;
  image?: File;
}

/**
 * Helper to append common fields to FormData
 */
const appendToFormData = (
  formData: FormData,
  input: Partial<CreateManagementTeamInput>,
) => {
  Object.entries(input).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (key === "image" && value instanceof File) {
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
 * Get management teams
 */
export const list = async (
  query?: AdminManagementTeamFilterInput,
): Promise<ApiResponse<AdminManagementTeamOutput>> => {
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/admin/management-team/list${queryString ? `?${queryString}` : ""}`;

  return api.get<AdminManagementTeamOutput>(endpoint);
};

/**
 * Get a specific management team by ID
 */
export const get = async (id: string): Promise<ApiResponse<ManagementTeam>> => {
  return api.get<ManagementTeam>(`/admin/management-team/${id}`);
};

/**
 * Create a new management team
 */
export const create = async (
  input: CreateManagementTeamInput,
): Promise<ApiResponse<ManagementTeam>> => {
  const formData = new FormData();
  appendToFormData(formData, input);
  return api.post<ManagementTeam>("/admin/management-team", formData);
};

/**
 * Update an existing management team
 */
export const update = async (
  input: UpdateManagementTeamInput,
): Promise<ApiResponse<AdminCommonResponseData>> => {
  const { id, ...updateData } = input;
  const formData = new FormData();
  appendToFormData(formData, updateData);
  return api.patch<AdminCommonResponseData>(
    `/admin/management-team/${id}`,
    formData,
  );
};

/**
 * Delete a management team
 */
export const deleteManagementTeam = async (
  id: string,
): Promise<ApiResponse<AdminCommonResponseData>> => {
  return api.delete<AdminCommonResponseData>(`/admin/management-team/${id}`);
};

/**
 * Admin management team service object
 */
export const adminManagementTeamService = {
  list,
  create,
  update,
  get,
  delete: deleteManagementTeam,
};
