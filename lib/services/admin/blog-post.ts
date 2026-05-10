/**
 * Admin Blog Post Service
 *
 * Handles admin-related API calls for blog post operations
 */

import { api, ApiResponse } from "@/lib/api";
import {
  AdminBlogPostFilterInput,
  AdminBlogPostOutput,
  AdminCommonResponseData,
  BlogPost,
} from "./types";

/**
 * Create blog post input type
 */
export interface CreateBlogPostInput {
  title: string;
  author?: string;
  authorImage?: File;
  blogCategoryId: string;
  content: string;
  estimatedReadTime?: number;
  image: File;
  isPublished?: boolean;
  isFeatured?: boolean;
  excerpt?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

/**
 * Update blog post input type
 */
export interface UpdateBlogPostInput extends Partial<
  Omit<CreateBlogPostInput, "image" | "authorImage">
> {
  id: string;
  image?: File;
  authorImage?: File;
}

/**
 * Helper to append common fields to FormData
 */
const appendToFormData = (
  formData: FormData,
  input: Partial<CreateBlogPostInput>,
) => {
  Object.entries(input).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if ((key === "image" || key === "authorImage") && value instanceof File) {
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
 * Get blog posts
 */
export const list = async (
  query?: AdminBlogPostFilterInput,
): Promise<ApiResponse<AdminBlogPostOutput>> => {
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/admin/blog-post/list${queryString ? `?${queryString}` : ""}`;

  return api.get<AdminBlogPostOutput>(endpoint);
};

/**
 * Get a specific blog post by ID
 */
export const get = async (id: string): Promise<ApiResponse<BlogPost>> => {
  return api.get<BlogPost>(`/admin/blog-post/${id}`);
};

/**
 * Create a new blog post
 */
export const create = async (
  input: CreateBlogPostInput,
): Promise<ApiResponse<BlogPost>> => {
  const formData = new FormData();
  appendToFormData(formData, input);
  return api.post<BlogPost>("/admin/blog-post", formData);
};

/**
 * Update an existing blog post
 */
export const update = async (
  input: UpdateBlogPostInput,
): Promise<ApiResponse<AdminCommonResponseData>> => {
  const { id, ...updateData } = input;
  const formData = new FormData();
  appendToFormData(formData, updateData);
  return api.patch<AdminCommonResponseData>(`/admin/blog-post/${id}`, formData);
};

/**
 * Delete a blog post
 */
export const deleteBlogPost = async (
  id: string,
): Promise<ApiResponse<AdminCommonResponseData>> => {
  return api.delete<AdminCommonResponseData>(`/admin/blog-post/${id}`);
};

/**
 * Admin blog post service object
 */
export const adminBlogPostService = {
  list,
  create,
  update,
  get,
  delete: deleteBlogPost,
};
