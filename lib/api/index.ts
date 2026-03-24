/**
 * API Module - Main Export
 *
 * Centralized API configuration and utilities for making secure external API calls.
 *
 * @example
 * ```ts
 * import { api, ApiError } from '@/lib/api';
 *
 * try {
 *   const response = await api.get<User[]>('/users');
 *   if (response.success) {
 *     console.log(response.data);
 *   }
 * } catch (error) {
 *   if (error instanceof ApiError) {
 *     console.error('API Error:', error.message, error.status);
 *   }
 * }
 * ```
 */

export {
  api,
  apiRequest,
  setAccessToken,
  setRefreshToken,
  getAccessToken,
  getRefreshToken,
  ApiError,
} from "./config";
export type {
  ApiResponse,
  ApiRequestConfig,
  ApiSuccessResponse,
  ApiErrorResponse,
} from "./types";
