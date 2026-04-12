/**
 * Guest Course Service
 *
 * Handles course-related API calls for guest operations
 */

import { api, ApiResponse } from "@/lib/api";
import { AdminCourseFilterInput, Course } from "../admin";
import { GuestCourseOutput } from "./types";

/**
 * Get list of courses with filtering and pagination
 */
export const list = async (
  query?: AdminCourseFilterInput,
): Promise<ApiResponse<GuestCourseOutput>> => {
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/course${queryString ? `?${queryString}` : ""}`;

  return api.get<GuestCourseOutput>(endpoint);
};

/**
 * Get a specific course by ID
 */
export const get = async (id: string): Promise<ApiResponse<Course>> => {
  const endpoint = `/course/${id}`;
  return api.get<Course>(endpoint);
};

/**
 * Guest course service object
 */
export const guestCourseService = {
  list,
  get,
};
