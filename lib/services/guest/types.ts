/**
 * Guest service types
 */

import { AdminReview, Category, Course, Testimonial } from "../admin";
import { PaginationOutput } from "../common-types";

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
