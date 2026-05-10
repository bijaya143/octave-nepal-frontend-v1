/**
 * Admin Blog Category Service
 *
 * Handles admin-related API calls for blog category operations
 */

import { api, ApiResponse } from "@/lib/api";
import {
  AdminBlogCategoryFilterInput,
  AdminBlogCategoryOutput,
  AdminCommonResponseData,
  BlogCategory,
} from "./types";

/**
 * Create blog category input type
 */
export interface CreateBlogCategoryInput {
  name: string;
  slug: string;
  description?: string;
  image: File;
  isPublished?: boolean;
}

/**
 * Update blog category input type
 */
export interface UpdateBlogCategoryInput extends Partial<
  Omit<CreateBlogCategoryInput, "image">
> {
  id: string;
  image?: File;
}

/**
 * Helper to append common fields to FormData
 */
const appendToFormData = (
  formData: FormData,
  input: Partial<CreateBlogCategoryInput>,
) => {
  Object.entries(input).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (key === "image" && value instanceof File) {
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
 * Get blog categories
 */
export const list = async (
  query?: AdminBlogCategoryFilterInput,
): Promise<ApiResponse<AdminBlogCategoryOutput>> => {
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/admin/blog-category/list${queryString ? `?${queryString}` : ""}`;

  return api.get<AdminBlogCategoryOutput>(endpoint);
};

/**
 * Get a specific blog category by ID
 */
export const get = async (id: string): Promise<ApiResponse<BlogCategory>> => {
  return api.get<BlogCategory>(`/admin/blog-category/${id}`);
};

/**
 * Create a new blog category
 */
export const create = async (
  input: CreateBlogCategoryInput,
): Promise<ApiResponse<BlogCategory>> => {
  const formData = new FormData();
  appendToFormData(formData, input);
  return api.post<BlogCategory>("/admin/blog-category", formData);
};

/**
 * Update an existing blog category
 */
export const update = async (
  input: UpdateBlogCategoryInput,
): Promise<ApiResponse<AdminCommonResponseData>> => {
  const { id, ...updateData } = input;
  const formData = new FormData();
  appendToFormData(formData, updateData);
  return api.patch<AdminCommonResponseData>(
    `/admin/blog-category/${id}`,
    formData,
  );
};

/**
 * Delete a blog category
 */
export const deleteBlogCategory = async (
  id: string,
): Promise<ApiResponse<AdminCommonResponseData>> => {
  return api.delete<AdminCommonResponseData>(`/admin/blog-category/${id}`);
};

/**
 * Admin blog category service object
 */
export const adminBlogCategoryService = {
  list,
  create,
  update,
  get,
  delete: deleteBlogCategory,
};
