/**
 * API Response types
 */

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Request configuration options
 */
export interface ApiRequestConfig extends RequestInit {
  /**
   * Skip authentication headers (useful for public endpoints)
   */
  skipAuth?: boolean;

  /**
   * Use refresh token instead of access token for authentication
   * Useful for refresh token endpoint where refresh token is passed as Bearer token
   */
  useRefreshToken?: boolean;

  /**
   * Custom headers to merge with default headers
   */
  customHeaders?: Record<string, string>;

  /**
   * Timeout in milliseconds (default: 30000)
   */
  timeout?: number;
}

/**
 * API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}
