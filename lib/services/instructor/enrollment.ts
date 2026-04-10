/**
 * Instructor Enrollment Service
 *
 * Handles enrollment-related API calls for instructor operations
 */

import { api, ApiResponse } from "@/lib/api";
import { Enrollment } from "../admin";
import {
  InstructorEnrollmentFilterInput,
  InstructorEnrollmentOutput,
} from "./types";

/**
 * Get list of enrollments with filtering and pagination
 */
export const list = async (
  query?: InstructorEnrollmentFilterInput,
): Promise<ApiResponse<InstructorEnrollmentOutput>> => {
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/instructor/enrollment${queryString ? `?${queryString}` : ""}`;

  return api.get<InstructorEnrollmentOutput>(endpoint);
};

/**
 * Get a specific enrollment by ID
 */
export const get = async (id: string): Promise<ApiResponse<Enrollment>> => {
  const endpoint = `/instructor/enrollment/${id}`;
  return api.get<Enrollment>(endpoint);
};

/**
 * Instructor enrollment service object
 */
export const instructorEnrollmentService = {
  list,
  get,
};
