/**
 * Admin Enrollment Service
 *
 * Handles enrollment-related API calls for admin operations
 */

import { api, ApiResponse } from "@/lib/api";
import {
  AdminEnrollmentOutput,
  AdminEnrollmentFilterInput,
  AdminCommonResponseData,
  Enrollment,
  EnrollmentStatus,
} from "./types";

export interface UpdateEnrollmentInput extends Partial<CreateEnrollmentInput> {
  id: string;
}

/**
 * Create enrollment input type
 */
export interface CreateEnrollmentInput {
  studentId: string;
  courseId: string;
  status?: EnrollmentStatus | string;
}

/**
 * Get list of enrollments with filtering and pagination
 */
export const list = async (
  query?: AdminEnrollmentFilterInput
): Promise<ApiResponse<AdminEnrollmentOutput>> => {
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/admin/enrollment/list${
    queryString ? `?${queryString}` : ""
  }`;

  return api.get<AdminEnrollmentOutput>(endpoint);
};

/**
 * Get a specific enrollment by ID
 */
export const get = async (id: string): Promise<ApiResponse<Enrollment>> => {
  const endpoint = `/admin/enrollment/${id}`;
  return api.get<Enrollment>(endpoint);
};

/**
 * Create a new enrollment
 */
export const create = async (
  input: CreateEnrollmentInput
): Promise<ApiResponse<Enrollment>> => {
  return api.post<Enrollment>("/admin/enrollment", input);
};

/**
 * Update an existing enrollment
 */
export const update = async (
  input: UpdateEnrollmentInput
): Promise<ApiResponse<AdminCommonResponseData>> => {
  const { id, ...updateData } = input;
  return api.patch<AdminCommonResponseData>(
    `/admin/enrollment/${id}`,
    updateData
  );
};

/**
 * Delete an enrollment
 */
export const deleteEnrollment = async (
  id: string
): Promise<ApiResponse<AdminCommonResponseData>> => {
  return api.delete<AdminCommonResponseData>(`/admin/enrollment/${id}`);
};

/**
 * Admin enrollment service object
 */
export const adminEnrollmentService = {
  list,
  get,
  create,
  update,
  delete: deleteEnrollment,
};
