/**
 * Admin Testimonial Service
 *
 * Handles admin-related API calls for testimonial operations
 */

import { api, ApiResponse } from "@/lib/api";
import {
  AdminCommonResponseData,
  Testimonial,
  AdminTestimonialFilterInput,
  AdminTestimonialOutput,
} from "./types";

/**
 * Create testimonial input type
 */
export interface CreateTestimonialInput {
  fullName: string;
  rating: number;
  message: string | null;
  profilePicture: File;
  isPublished?: boolean;
}

/**
 * Update testimonial input type
 */
export interface UpdateTestimonialInput extends Partial<
  Omit<CreateTestimonialInput, "profilePicture">
> {
  id: string;
  profilePicture?: File;
}

/**
 * Helper to append common fields to FormData
 */
const appendToFormData = (
  formData: FormData,
  input: Partial<CreateTestimonialInput>,
) => {
  Object.entries(input).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (key === "profilePicture" && value instanceof File) {
        // Handle file upload
        formData.append(key, value);
      } else if (typeof value === "boolean") {
        // Handle boolean values
        formData.append(key, value.toString());
      } else {
        // Handle string/number values
        formData.append(key, value.toString());
      }
    }
  });
};

/**
 * Get testimonials
 */
export const list = async (
  query?: AdminTestimonialFilterInput,
): Promise<ApiResponse<AdminTestimonialOutput>> => {
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/admin/testimonial/list${queryString ? `?${queryString}` : ""}`;

  return api.get<AdminTestimonialOutput>(endpoint);
};

/**
 * Get a specific testimonial by ID
 */
export const get = async (id: string): Promise<ApiResponse<Testimonial>> => {
  return api.get<Testimonial>(`/admin/testimonial/${id}`);
};

/**
 * Create a new testimonial
 */
export const create = async (
  input: CreateTestimonialInput,
): Promise<ApiResponse<Testimonial>> => {
  const formData = new FormData();
  appendToFormData(formData, input);
  return api.post<Testimonial>("/admin/testimonial", formData);
};

/**
 * Update an existing testimonial
 */
export const update = async (
  input: UpdateTestimonialInput,
): Promise<ApiResponse<AdminCommonResponseData>> => {
  const { id, ...updateData } = input;
  const formData = new FormData();
  appendToFormData(formData, updateData);
  return api.patch<AdminCommonResponseData>(
    `/admin/testimonial/${id}`,
    formData,
  );
};

/**
 * Delete a testimonial
 */
export const deleteTestimonial = async (
  id: string,
): Promise<ApiResponse<AdminCommonResponseData>> => {
  return api.delete<AdminCommonResponseData>(`/admin/testimonial/${id}`);
};

/**
 * Admin testimonial service object
 */
export const adminTestimonialService = {
  list,
  create,
  update,
  get,
  delete: deleteTestimonial,
};
