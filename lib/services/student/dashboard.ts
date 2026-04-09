/**
 * Student Dashboard Service
 *
 * Handles dashboard-related API calls for student operations
 */

import { api, ApiResponse } from "@/lib/api";
import { StudentDashboardCountOutput } from "./types";

/**
 * Get dashboard count
 */
export const get = async (): Promise<
  ApiResponse<StudentDashboardCountOutput>
> => {
  const endpoint = `/student/dashboard/count`;
  return api.get<StudentDashboardCountOutput>(endpoint);
};

export const studentDashboardService = {
  get,
};
