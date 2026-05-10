/**
 * Guest Blog Post Service
 *
 * Handles blog-post-related API calls for guest operations
 */

import { api, ApiResponse } from "@/lib/api";
import { AdminBlogPostFilterInput, BlogPost } from "../admin";
import { GuestBlogPostOutput } from "./types";

/**
 * Get list of blog posts with filtering and pagination
 */
export const list = async (
  query?: AdminBlogPostFilterInput,
): Promise<ApiResponse<GuestBlogPostOutput>> => {
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/guest/blog-post${queryString ? `?${queryString}` : ""}`;

  return api.get<GuestBlogPostOutput>(endpoint);
};

/**
 * Get a specific blog post by ID
 */
export const get = async (id: string): Promise<ApiResponse<BlogPost>> => {
  const endpoint = `/guest/blog-post/${id}`;
  return api.get<BlogPost>(endpoint);
};

/**
 * Get a specific blog post by slug
 */
export const getBySlug = async (
  slug: string,
): Promise<ApiResponse<BlogPost>> => {
  const endpoint = `/guest/blog-post/slug/${slug}`;
  return api.get<BlogPost>(endpoint);
};

/**
 * Guest blog post service object
 */
export const guestBlogPostService = {
  list,
  get,
  getBySlug,
};
