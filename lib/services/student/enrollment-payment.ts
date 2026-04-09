/**
 * Student Enrollment Payment Service
 *
 * Handles enrollment payment-related API calls for student operations
 */

import { api, ApiResponse } from "@/lib/api";
import { AdminEnrollmentPayment } from "../admin";
import { StudentEnrollmentPaymentOutput } from "./types";
import { PaginationInput } from "../common-types";

/**
 * List enrollment payments with filtering and pagination
 */
export const list = async (
  query?: PaginationInput,
): Promise<ApiResponse<StudentEnrollmentPaymentOutput>> => {
  const params = new URLSearchParams();
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }
  const queryString = params.toString();
  const endpoint = `/student/enrollment-payment${
    queryString ? `?${queryString}` : ""
  }`;
  return api.get<StudentEnrollmentPaymentOutput>(endpoint);
};

/**
 * Get a specific enrollment payment by ID
 */
export const get = async (
  id: string,
): Promise<ApiResponse<AdminEnrollmentPayment>> => {
  const endpoint = `/student/enrollment-payment/${id}`;
  return api.get<AdminEnrollmentPayment>(endpoint);
};

export const studentEnrollmentPaymentService = {
  list,
  get,
};
