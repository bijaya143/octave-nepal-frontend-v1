/**
 * Student Review Service
 *
 * Handles review-related API calls for student operations
 */

import { api, ApiResponse } from "@/lib/api";
import { AdminReview } from "../admin";

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
  rating?: number;
  comment?: string;
}

/**
 * Get review details by ID
 */
export const getByEnrollmentId = async (
  enrollmentId: string,
): Promise<ApiResponse<AdminReview>> => {
  return api.get<AdminReview>(`/student/review/enrollment/${enrollmentId}`);
};

/**
 * Create a new review
 */
export const create = async (
  data: CreateReviewInput,
): Promise<ApiResponse<AdminReview>> => {
  return api.post<AdminReview>("/student/review", data);
};

/**
 * Update an existing review
 */
export const updateByEnrollmentId = async (
  enrollmentId: string,
  data: UpdateReviewInput,
): Promise<ApiResponse<AdminReview>> => {
  return api.patch<AdminReview>(
    `/student/review/enrollment/${enrollmentId}`,
    data,
  );
};

export const studentReviewService = {
  getByEnrollmentId,
  create,
  updateByEnrollmentId,
};
