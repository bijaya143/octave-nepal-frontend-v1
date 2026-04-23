/**
 * Guest Newsletter Subscriber Service
 *
 * Handles guest-related API calls for newsletter subscriber operations
 */

import { api, ApiResponse } from "@/lib/api";
import { GuestCommonResponseData } from "./types";

/**
 * Create Newsletter subscriber input type
 */
export interface CreateNewsletterSubscriberInput {
  email: string;
}

/**
 * Create a new newsletter subscriber
 */
export const subscribe = async (
  input: CreateNewsletterSubscriberInput,
): Promise<ApiResponse<GuestCommonResponseData>> => {
  return api.post<GuestCommonResponseData>(
    "/guest/newsletter-subscriber/subscribe",
    input,
  );
};

/**
 * Unsubscribe from newsletter
 */
export const unsubscribe = async (
  input: CreateNewsletterSubscriberInput,
): Promise<ApiResponse<GuestCommonResponseData>> => {
  return api.post<GuestCommonResponseData>(
    "/guest/newsletter-subscriber/unsubscribe",
    input,
  );
};

/**
 * Guest newsletter subscriber service object
 */
export const guestNewsletterSubscriberService = {
  subscribe,
  unsubscribe,
};
