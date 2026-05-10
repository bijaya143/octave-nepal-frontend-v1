/**
 * Guest Blog Category Service
 *
 * Handles blog-category-related API calls for guest operations
 */

import { api, ApiResponse } from "@/lib/api";
import { AdminBlogCategoryFilterInput, BlogCategory } from "../admin";
import { GuestBlogCategoryOutput } from "./types";

/**
 * Get list of blog categories with filtering and pagination
 */
export const list = async (
  query?: AdminBlogCategoryFilterInput,
): Promise<ApiResponse<GuestBlogCategoryOutput>> => {
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/guest/blog-category${queryString ? `?${queryString}` : ""}`;

  return api.get<GuestBlogCategoryOutput>(endpoint);
};

/**
 * Get a specific blog category by ID
 */
export const get = async (id: string): Promise<ApiResponse<BlogCategory>> => {
  const endpoint = `/guest/blog-category/${id}`;
  return api.get<BlogCategory>(endpoint);
};

/**
 * Get a specific blog category by slug
 */
export const getBySlug = async (
  slug: string,
): Promise<ApiResponse<BlogCategory>> => {
  const endpoint = `/guest/blog-category/slug/${slug}`;
  return api.get<BlogCategory>(endpoint);
};

/**
 * Guest blog category service object
 */
export const guestBlogCategoryService = {
  list,
  get,
  getBySlug,
};
