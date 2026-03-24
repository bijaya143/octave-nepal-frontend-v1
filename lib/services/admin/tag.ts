/**
 * Admin Tag Service
 *
 * Handles admin-related API calls for tag operations
 */

import { api, ApiResponse } from "@/lib/api";
import { AdminCommonResponseData, AdminTagFilterInput, AdminTagOutput, Tag } from "./types";

/**
 * Create tag input type
 */
export interface CreateTagInput {
  name: string;
  slug: string;
  description?: string;
  image: File;
  isPublished?: boolean;
}

/**
 * Update tag input type
 */
export interface UpdateTagInput extends Partial<Omit<CreateTagInput, "image">> {
  id: string;
  image?: File;
}

/**
 * Helper to append common fields to FormData
 */
const appendToFormData = (
  formData: FormData,
  input: Partial<CreateTagInput>
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
 * Get tags
 */
export const list = async (
  query?: AdminTagFilterInput
): Promise<ApiResponse<AdminTagOutput>> => {
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/admin/tag/list${queryString ? `?${queryString}` : ""}`;

  return api.get<AdminTagOutput>(endpoint);
};

/**
 * Get a specific tag by ID
 */
export const get = async (id: string): Promise<ApiResponse<Tag>> => {
  return api.get<Tag>(`/admin/tag/${id}`);
};

/**
 * Create a new tag
 */
export const create = async (
  input: CreateTagInput
): Promise<ApiResponse<Tag>> => {
  const formData = new FormData();
  appendToFormData(formData, input);
  return api.post<Tag>("/admin/tag", formData);
};

/**
 * Update an existing tag
 */
export const update = async (
  input: UpdateTagInput
): Promise<ApiResponse<AdminCommonResponseData>> => {
  const { id, ...updateData } = input;
  const formData = new FormData();
  appendToFormData(formData, updateData);
  return api.patch<AdminCommonResponseData>(`/admin/tag/${id}`, formData);
};

/**
 * Delete a tag
 */
export const deleteTag = async (
  id: string
): Promise<ApiResponse<AdminCommonResponseData>> => {
  return api.delete<AdminCommonResponseData>(`/admin/tag/${id}`);
};

/**
 * Admin tag service object
 */
export const adminTagService = {
  list,
  create,
  update,
  get,
  delete: deleteTag,
};
