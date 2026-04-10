/**
 * Instructor Course Service
 *
 * Handles course-related API calls for instructor operations
 */

import { api, ApiResponse } from "@/lib/api";
import { PaginationInput } from "../common-types";
import { InstructorCourseOutput } from "./types";
import { Course } from "../admin";

/**
 * Get list of courses with filtering and pagination
 */
export const list = async (
  query?: PaginationInput,
): Promise<ApiResponse<InstructorCourseOutput>> => {
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/instructor/course${queryString ? `?${queryString}` : ""}`;

  return api.get<InstructorCourseOutput>(endpoint);
};

/**
 * Get a specific course by ID
 */
export const get = async (id: string): Promise<ApiResponse<Course>> => {
  const endpoint = `/instructor/course/${id}`;
  return api.get<Course>(endpoint);
};

/**
 * Instructor course service object
 */
export const instructorCourseService = {
  list,
  get,
};
