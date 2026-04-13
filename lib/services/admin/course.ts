/**
 * Admin Course Service
 *
 * Handles course-related API calls for admin operations
 */

import { api, ApiResponse } from "@/lib/api";
import {
  AdminCourseOutput,
  AdminCourseFilterInput,
  AdminCommonResponseData,
  Course,
  CourseLevel,
  CourseLanguage,
  DurationUnit,
  CourseType,
  CourseDiscountType,
  DayType,
  TimeDesignator,
  TimezoneType,
  PublishStatusType,
  CourseSyllabusSectionItemType,
} from "./types";

/**
 * Course syllabus section item input type
 */
export interface CourseSyllabusItemInput {
  type: CourseSyllabusSectionItemType;
  title: string;
  description?: string;
  isPublished?: boolean;
  duration: number;
  durationUnit: DurationUnit;
}

/**
 * Course syllabus section input type
 */
export interface CourseSyllabusSectionInput {
  title: string;
  items: CourseSyllabusItemInput[];
}

/**
 * Course syllabus input type
 */
export interface CourseSyllabusInput {
  sections: CourseSyllabusSectionInput[];
}

/**
 * Course sale date range input type
 */
export interface CourseSaleDateRangeInput {
  startDate: string;
  endDate: string;
}

/**
 * Course additional resource link input type
 */
export interface CourseAdditionalResourceLinkInput {
  link: string;
  label?: string;
}

/**
 * Course meeting link input type
 */
export interface CourseMeetingLinkInput {
  platform: string;
  link: string;
  isPrimary: boolean;
}

/**
 * Create course input type
 */
export interface CreateCourseInput {
  // Detail
  title: string;
  subtitle?: string;
  instructorId: string;
  categoryId: string;
  level?: CourseLevel | string;
  language: CourseLanguage | string;

  // Content
  shortDescription?: string;
  longDescription?: string;
  prerequisite?: string;
  learningOutcome?: string;
  duration: number;
  durationUnit: DurationUnit | string;
  lessonCount?: number;

  // Syllabus
  syllabus?: CourseSyllabusInput;

  // Price
  courseType?: CourseType | string;
  markedPrice: number;
  isDiscountApplied?: boolean;
  discountType?: CourseDiscountType | string;
  discountValue?: number;
  sellingPrice: number;
  isSalePeriodApplied?: boolean;
  salePeriodDateRange?: CourseSaleDateRangeInput;
  isTaxIncluded?: boolean;

  // Schedule
  startDate: string;
  endDate: string;
  fromDay: DayType | string;
  toDay: DayType | string;
  startTime: string;
  startTimeDesignator: TimeDesignator | string;
  endTime: string;
  endTimeDesignator: TimeDesignator | string;
  timezone?: TimezoneType | string;

  // Seats
  seatCapacityCount: number;
  availableSeatCount: number;
  occupiedSeatCount: number;
  lastEnrollmentDate: string;
  isWaitlistApplied?: boolean;
  waitlistCapacityCount?: number;

  // Status
  status?: PublishStatusType | string;
  isFeatured?: boolean;
  isReviewAllowed?: boolean;

  // Media
  thumbnail?: File;
  additionalResourceLinks?: CourseAdditionalResourceLinkInput[];

  // Meeting
  meetingLinks: CourseMeetingLinkInput[];

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

/**
 * Update course input type
 */
export interface UpdateCourseInput extends Partial<CreateCourseInput> {
  id: string;
}

/**
 * Helper to append complex objects and arrays to FormData using bracket notation
 */
const appendToFormData = (
  formData: FormData,
  input: Partial<CreateCourseInput>,
) => {
  (Object.entries(input) as [keyof CreateCourseInput, any][]).forEach(
    ([key, value]) => {
      if (value === undefined || value === null) return;

      if (key === "syllabus") {
        const syllabus = value as CourseSyllabusInput;
        if (syllabus && Array.isArray(syllabus.sections)) {
          syllabus.sections.forEach((section, sIndex) => {
            formData.append(
              `syllabus[sections][${sIndex}][title]`,
              section.title,
            );
            if (Array.isArray(section.items)) {
              section.items.forEach((item, iIndex) => {
                formData.append(
                  `syllabus[sections][${sIndex}][items][${iIndex}][type]`,
                  item.type,
                );
                formData.append(
                  `syllabus[sections][${sIndex}][items][${iIndex}][title]`,
                  item.title,
                );
                if (item.description)
                  formData.append(
                    `syllabus[sections][${sIndex}][items][${iIndex}][description]`,
                    item.description,
                  );
                if (item.isPublished !== undefined)
                  formData.append(
                    `syllabus[sections][${sIndex}][items][${iIndex}][isPublished]`,
                    item.isPublished.toString(),
                  );
                formData.append(
                  `syllabus[sections][${sIndex}][items][${iIndex}][duration]`,
                  item.duration.toString(),
                );
                formData.append(
                  `syllabus[sections][${sIndex}][items][${iIndex}][durationUnit]`,
                  item.durationUnit,
                );
              });
            }
          });
        }
      } else if (key === "salePeriodDateRange") {
        const range = value as CourseSaleDateRangeInput;
        formData.append("salePeriodDateRange[startDate]", range.startDate);
        formData.append("salePeriodDateRange[endDate]", range.endDate);
      } else if (key === "additionalResourceLinks" && Array.isArray(value)) {
        (value as CourseAdditionalResourceLinkInput[]).forEach(
          (link, index) => {
            formData.append(
              `additionalResourceLinks[${index}][link]`,
              link.link,
            );
            if (link.label)
              formData.append(
                `additionalResourceLinks[${index}][label]`,
                link.label,
              );
          },
        );
      } else if (key === "meetingLinks" && Array.isArray(value)) {
        (value as CourseMeetingLinkInput[]).forEach((link, index) => {
          formData.append(`meetingLinks[${index}][platform]`, link.platform);
          formData.append(`meetingLinks[${index}][link]`, link.link);
          formData.append(
            `meetingLinks[${index}][isPrimary]`,
            link.isPrimary.toString(),
          );
        });
      } else if (key === "metaKeywords" && Array.isArray(value)) {
        (value as string[]).forEach((keyword) => {
          formData.append("metaKeywords[]", keyword);
        });
      } else if (key === "thumbnail" && value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === "boolean") {
        formData.append(key, value.toString());
      } else if (Array.isArray(value)) {
        // General array handling if any others exist
        value.forEach((v: any) => formData.append(`${key}[]`, v.toString()));
      } else if (typeof value === "object" && !(value instanceof File)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    },
  );
};

/**
 * Get list of courses with filtering and pagination
 */
export const list = async (
  query?: AdminCourseFilterInput,
): Promise<ApiResponse<AdminCourseOutput>> => {
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/admin/course/list${queryString ? `?${queryString}` : ""}`;

  return api.get<AdminCourseOutput>(endpoint);
};

/**
 * Get a specific course by ID
 */
export const get = async (id: string): Promise<ApiResponse<Course>> => {
  const endpoint = `/admin/course/${id}`;
  return api.get<Course>(endpoint);
};

/**
 * Create a new course
 */
export const create = async (
  input: CreateCourseInput,
): Promise<ApiResponse<Course>> => {
  const formData = new FormData();
  appendToFormData(formData, input);
  return api.post<Course>("/admin/course", formData);
};

/**
 * Update an existing course
 */
export const update = async (
  input: UpdateCourseInput,
): Promise<ApiResponse<AdminCommonResponseData>> => {
  const { id, ...updateData } = input;
  const formData = new FormData();
  appendToFormData(formData, updateData);
  return api.patch<AdminCommonResponseData>(`/admin/course/${id}`, formData);
};

/**
 * Delete a course
 */
export const deleteCourse = async (
  id: string,
): Promise<ApiResponse<AdminCommonResponseData>> => {
  return api.delete<AdminCommonResponseData>(`/admin/course/${id}`);
};

/**
 * Admin course service object
 */
export const adminCourseService = {
  list,
  get,
  create,
  update,
  delete: deleteCourse,
};
