/**
 * Admin Contact Message Service
 *
 * Handles admin-related API calls for contact message operations
 */

import { api, ApiResponse } from "@/lib/api";
import {
  AdminCommonResponseData,
  AdminContactMessageFilterInput,
  AdminContactMessageOutput,
  ContactMessage,
} from "./types";

/**
 * Get contact messages
 */
export const list = async (
  query?: AdminContactMessageFilterInput,
): Promise<ApiResponse<AdminContactMessageOutput>> => {
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/admin/contact-message/list${queryString ? `?${queryString}` : ""}`;

  return api.get<AdminContactMessageOutput>(endpoint);
};

/**
 * Get a specific contact message by ID
 */
export const get = async (id: string): Promise<ApiResponse<ContactMessage>> => {
  return api.get<ContactMessage>(`/admin/contact-message/${id}`);
};

/**
 * Delete a contact message
 */
export const deleteContactMessage = async (
  id: string,
): Promise<ApiResponse<AdminCommonResponseData>> => {
  return api.delete<AdminCommonResponseData>(`/admin/contact-message/${id}`);
};

/**
 * Admin testimonial service object
 */
export const adminContactMessageService = {
  list,
  get,
  delete: deleteContactMessage,
};
