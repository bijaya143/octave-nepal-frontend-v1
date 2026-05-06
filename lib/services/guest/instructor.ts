/**
 * Guest Instructor Service
 *
 * Handles instructor-related API calls for guest operations
 */

import { api, ApiResponse } from "@/lib/api";
import { AdminInstructorFilterInput, Instructor } from "../admin";
import { GuestInstructorOutput } from "./types";

/**
 * Get list of instructors with filtering and pagination
 */
export const list = async (
  query?: AdminInstructorFilterInput,
): Promise<ApiResponse<GuestInstructorOutput>> => {
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/guest/instructor${queryString ? `?${queryString}` : ""}`;

  return api.get<GuestInstructorOutput>(endpoint);
};

/**
 * Get a specific instructor by ID
 */
export const get = async (id: string): Promise<ApiResponse<Instructor>> => {
  const endpoint = `/guest/instructor/${id}`;
  return api.get<Instructor>(endpoint);
};

/**
 * Guest instructor service object
 */
export const guestInstructorService = {
  list,
  get,
};
