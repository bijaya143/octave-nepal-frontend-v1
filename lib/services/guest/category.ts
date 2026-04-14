/**
 * Guest Category Service
 *
 * Handles category-related API calls for guest operations
 */

import { api, ApiResponse } from "@/lib/api";
import { AdminCategoryFilterInput, Category } from "../admin";
import { GuestCategoryOutput } from "./types";

/**
 * Get list of categories with filtering and pagination
 */
export const list = async (
  query?: AdminCategoryFilterInput,
): Promise<ApiResponse<GuestCategoryOutput>> => {
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/category${queryString ? `?${queryString}` : ""}`;

  return api.get<GuestCategoryOutput>(endpoint);
};

/**
 * Get a specific category by ID
 */
export const get = async (id: string): Promise<ApiResponse<Category>> => {
  const endpoint = `/category/${id}`;
  return api.get<Category>(endpoint);
};

/**
 * Guest category service object
 */
export const guestCategoryService = {
  list,
  get,
};
