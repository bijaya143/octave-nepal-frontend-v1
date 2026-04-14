/**
 * Guest service types
 */

import { Category, Course } from "../admin";
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
