/**
 * Instructor Dashboard Service
 *
 * Handles dashboard-related API calls for instructor operations
 */

import { api, ApiResponse } from "@/lib/api";
import { InstructorDashboardCountOutput } from "./types";

/**
 * Get dashboard count
 */
export const get = async (): Promise<
  ApiResponse<InstructorDashboardCountOutput>
> => {
  const endpoint = `/instructor/dashboard/count`;
  return api.get<InstructorDashboardCountOutput>(endpoint);
};

export const instructorDashboardService = {
  get,
};
