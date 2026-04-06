/**
 * Student Enrollment Service
 *
 * Handles enrollment-related API calls for student operations
 */

import { api, ApiResponse } from "@/lib/api";
import { StudentEnrollmentOutput, StudentEnrollmentFilterInput } from "./types";
import { Enrollment } from "../admin";

/**
 * Get list of enrollments with filtering and pagination
 */
export const list = async (
  query?: StudentEnrollmentFilterInput,
): Promise<ApiResponse<StudentEnrollmentOutput>> => {
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/student/enrollment${queryString ? `?${queryString}` : ""}`;

  return api.get<StudentEnrollmentOutput>(endpoint);
};

/**
 * Get a specific enrollment by ID
 */
export const get = async (id: string): Promise<ApiResponse<Enrollment>> => {
  const endpoint = `/student/enrollment/${id}`;
  return api.get<Enrollment>(endpoint);
};

/**
 * Student enrollment service object
 */
export const studentEnrollmentService = {
  list,
  get,
};
