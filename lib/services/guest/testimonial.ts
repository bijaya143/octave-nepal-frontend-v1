/**
 * Guest Testimonial Service
 *
 * Handles testimonial-related API calls for guest operations
 */

import { api, ApiResponse } from "@/lib/api";
import { AdminTestimonialFilterInput, Testimonial } from "../admin";
import { GuestTestimonialOutput } from "./types";

/**
 * Get list of testimonials with filtering and pagination
 */
export const list = async (
  query?: AdminTestimonialFilterInput,
): Promise<ApiResponse<GuestTestimonialOutput>> => {
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/testimonial${queryString ? `?${queryString}` : ""}`;

  return api.get<GuestTestimonialOutput>(endpoint);
};

/**
 * Get a specific testimonial by ID
 */
export const get = async (id: string): Promise<ApiResponse<Testimonial>> => {
  const endpoint = `/testimonial/${id}`;
  return api.get<Testimonial>(endpoint);
};

/**
 * Guest testimonial service object
 */
export const guestTestimonialService = {
  list,
  get,
};
