/**
 * Admin Category Service
 *
 * Handles admin-related API calls for category operations
 */

import { api, ApiResponse } from "@/lib/api";
import { AdminCategoryFilterInput, AdminCategoryOutput, AdminCommonResponseData, Category } from "./types";

/**
 * Create category input type
 */
export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  image: File;
  icon?: File;
  isPublished?: boolean;
  tagIds?: string[];
}

/**
 * Update category input type
 */
export interface UpdateCategoryInput extends Partial<Omit<CreateCategoryInput, "image" | "icon" | "tagIds">> {
  id: string;
  image?: File;
  icon?: File;
  tagIds?: string[];
}

/**
 * Helper to append common fields to FormData
 */
const appendToFormData = (
  formData: FormData,
  input: Partial<CreateCategoryInput>
) => {
  Object.entries(input).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if ((key === "image" || key === "icon") && value instanceof File) {
        // Handle file uploads
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
 * Get categories
 */
export const list = async (
  query?: AdminCategoryFilterInput
): Promise<ApiResponse<AdminCategoryOutput>> => {
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/admin/category/list${queryString ? `?${queryString}` : ""}`;

  return api.get<AdminCategoryOutput>(endpoint);
};

/**
 * Get a specific category by ID
 */
export const get = async (id: string): Promise<ApiResponse<Category>> => {
  return api.get<Category>(`/admin/category/${id}`);
};

/**
 * Create a new category
 */
export const create = async (
  input: CreateCategoryInput
): Promise<ApiResponse<Category>> => {
  const formData = new FormData();
  appendToFormData(formData, input);
  return api.post<Category>("/admin/category", formData);
};

/**
 * Update an existing category
 */
export const update = async (
  input: UpdateCategoryInput
): Promise<ApiResponse<AdminCommonResponseData>> => {
  const { id, ...updateData } = input;
  const formData = new FormData();
  appendToFormData(formData, updateData);
  return api.patch<AdminCommonResponseData>(`/admin/category/${id}`, formData);
};

/**
 * Delete a category
 */
export const deleteCategory = async (
  id: string
): Promise<ApiResponse<AdminCommonResponseData>> => {
  return api.delete<AdminCommonResponseData>(`/admin/category/${id}`);
};

/**
 * Admin category service object
 */
export const adminCategoryService = {
  list,
  create,
  update,
  get,
  delete: deleteCategory,
};
