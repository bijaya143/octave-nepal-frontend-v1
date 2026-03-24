/**
 * Pagination output metadata
 */
export interface PaginationOutput {
  page: number;
  limit: number;
  total: number;
}

/**
 * Pagination input metadata
 */
export interface PaginationInput {
  page: number;
  limit: number;
}
