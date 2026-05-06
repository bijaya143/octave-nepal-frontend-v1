/**
 * Guest service types
 */

import {
  AdminReview,
  Category,
  Course,
  ManagementTeam,
  Testimonial,
} from "../admin";
import { PaginationOutput } from "../common-types";
import { Instructor } from "../instructor";

/**
 * Guest course output
 */
export interface GuestCourseOutput {
  data: Course[];
  meta: PaginationOutput;
}

/**
 * Guest category output
 */
export interface GuestCategoryOutput {
  data: Category[];
  meta: PaginationOutput;
}

/**
 * Guest testimonial output
 */
export interface GuestTestimonialOutput {
  data: Testimonial[];
  meta: PaginationOutput;
}

/**
 * Guest review output
 */
export interface GuestReviewOutput {
  data: AdminReview[];
  meta: PaginationOutput;
}

/**
 * Common response data
 */
export interface GuestCommonResponseData {
  message: string;
}

/**
 * Guest management team output
 */
export interface GuestManagementTeamOutput {
  data: ManagementTeam[];
  meta: PaginationOutput;
}

/**
 * Guest instructor output
 */
export interface GuestInstructorOutput {
  data: Instructor[];
  meta: PaginationOutput;
}
