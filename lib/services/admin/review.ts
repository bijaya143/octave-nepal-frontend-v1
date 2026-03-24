/**
 * Admin Review Service
 *
 * Handles review-related API calls for admin operations
 */

import { api, ApiResponse } from "@/lib/api";
import {
  AdminReviewOutput,
  AdminReviewFilterInput,
  AdminCommonResponseData,
  AdminReview,
} from "./types";

/**
 * Create review input type
 */
export interface CreateReviewInput {
  enrollmentId: string;
  rating: number;
  comment?: string;
}

/**
 * Update review input type
 */
export interface UpdateReviewInput {
  id: string;
  rating?: number;
  comment?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
}

/**
 * Get list of reviews
 */
export const list = async (
  query?: AdminReviewFilterInput,
): Promise<ApiResponse<AdminReviewOutput>> => {
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/admin/review/list${queryString ? `?${queryString}` : ""}`;

  return api.get<AdminReviewOutput>(endpoint);
};

/**
 * Get review details by ID
 */
export const get = async (id: string): Promise<ApiResponse<AdminReview>> => {
  return api.get<AdminReview>(`/admin/review/${id}`);
};

/**
 * Create a new review
 */
export const create = async (
  data: CreateReviewInput,
): Promise<ApiResponse<AdminReview>> => {
  return api.post<AdminReview>("/admin/review", data);
};

/**
 * Update an existing review
 */
export const update = async (
  data: UpdateReviewInput,
): Promise<ApiResponse<AdminReview>> => {
  const { id, ...updateData } = data;
  return api.patch<AdminReview>(`/admin/review/${id}`, updateData);
};

/**
 * Delete a review
 */
export const deleteReview = async (
  id: string,
): Promise<ApiResponse<AdminCommonResponseData>> => {
  return api.delete<AdminCommonResponseData>(`/admin/review/${id}`);
};

export const adminReviewService = {
  list,
  get,
  create,
  update,
  delete: deleteReview,
};
