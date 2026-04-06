/**
 * Student Enrollment Certificate Service
 *
 * Handles enrollment certificate-related API calls for student operations
 */

import { api, ApiResponse } from "@/lib/api";
import { StudentEnrollmentCertificateOutput } from "./types";
import { AdminEnrollmentCertificate } from "../admin";

/**
 * Get list of enrollment certificates with filtering and pagination
 */
export const list = async (
  query?: any,
): Promise<ApiResponse<StudentEnrollmentCertificateOutput>> => {
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/student/enrollment-certificate${queryString ? `?${queryString}` : ""}`;

  return api.get<StudentEnrollmentCertificateOutput>(endpoint);
};

/**
 * Get a specific enrollment certificate by ID
 */
export const get = async (
  id: string,
): Promise<ApiResponse<AdminEnrollmentCertificate>> => {
  const endpoint = `/student/enrollment-certificate/${id}`;
  return api.get<AdminEnrollmentCertificate>(endpoint);
};

export const getByEnrollmentId = async (
  enrollmentId: string,
): Promise<ApiResponse<StudentEnrollmentCertificateOutput>> => {
  const endpoint = `/student/enrollment-certificate/enrollment/${enrollmentId}`;
  return api.get<StudentEnrollmentCertificateOutput>(endpoint);
};

/**
 * Student enrollment certificate service object
 */
export const studentEnrollmentCertificateService = {
  list,
  get,
  getByEnrollmentId,
};
