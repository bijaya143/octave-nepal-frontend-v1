/**
 * Guest Review Service
 *
 * Handles review-related API calls for guest operations
 */

import { api, ApiResponse } from "@/lib/api";
import { AdminReviewFilterInput } from "../admin";
import { GuestReviewOutput } from "./types";

/**
 * Get list of reviews
 */
export const list = async (
  query?: AdminReviewFilterInput,
): Promise<ApiResponse<GuestReviewOutput>> => {
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/guest/review${queryString ? `?${queryString}` : ""}`;

  return api.get<GuestReviewOutput>(endpoint);
};

export const guestReviewService = {
  list,
};
