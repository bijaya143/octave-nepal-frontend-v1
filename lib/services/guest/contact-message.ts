/**
 * Guest Contact Message Service
 *
 * Handles guest-related API calls for contact message operations
 */

import { api, ApiResponse } from "@/lib/api";
import { AdminCommonResponseData } from "../admin/types";

/**
 * Create Contact Message input type
 */
export interface CreateContactMessageInput {
  fullName: string;
  email: string;
  subject?: string;
  message: string;
}

/**
 * Create a new contact message
 */
export const create = async (
  input: CreateContactMessageInput,
): Promise<ApiResponse<AdminCommonResponseData>> => {
  return api.post<AdminCommonResponseData>("/contact-message", input);
};

/**
 * Guest contact message service object
 */
export const guestContactMessageService = {
  create,
};
