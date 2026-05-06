/**
 * Guest Management Team Service
 *
 * Handles management team-related API calls for guest operations
 */

import { api, ApiResponse } from "@/lib/api";
import { AdminManagementTeamFilterInput, ManagementTeam } from "../admin";
import { GuestManagementTeamOutput } from "./types";

/**
 * Get list of management teams with filtering and pagination
 */
export const list = async (
  query?: AdminManagementTeamFilterInput,
): Promise<ApiResponse<GuestManagementTeamOutput>> => {
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/guest/management-team${queryString ? `?${queryString}` : ""}`;

  return api.get<GuestManagementTeamOutput>(endpoint);
};

/**
 * Get a specific management team by ID
 */
export const get = async (id: string): Promise<ApiResponse<ManagementTeam>> => {
  const endpoint = `/guest/management-team/${id}`;
  return api.get<ManagementTeam>(endpoint);
};

/**
 * Guest management team service object
 */
export const guestManagementTeamService = {
  list,
  get,
};
