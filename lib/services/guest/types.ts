/**
 * Guest service types
 */

import { Course } from "../admin";
import { PaginationOutput } from "../common-types";

/**
 * Guest course output
 */
export interface GuestCourseOutput {
  data: Course[];
  meta: PaginationOutput;
}
