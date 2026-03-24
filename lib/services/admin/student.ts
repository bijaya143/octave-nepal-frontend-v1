/**
 * Admin Student Service
 *
 * Handles student-related API calls for admin operations
 */

import { api, ApiResponse } from "@/lib/api";
import {
  AdminStudentOutput,
  AdminStudentFilterInput,
  AdminCommonResponseData,
} from ".";
import { Student } from "../student";

/**
 * Get list of students with optional filtering and pagination
 *
 * @param query - Query parameters for filtering and pagination
 * @returns Promise resolving to student list response
 *
 * @example
 * ```ts
 * try {
 *   const response = await adminStudentService.list({
 *     keyword: 'john',
 *     isActive: true,
 *     page: 1,
 *     limit: 10
 *   });
 *
 *   if (response.success) {
 *     console.log('Students:', response.data.data);
 *     console.log('Pagination:', response.data.meta);
 *   }
 * } catch (error) {
 *   console.error('Failed to fetch students:', error);
 * }
 * ```
 */
export const list = async (
  query?: AdminStudentFilterInput,
): Promise<ApiResponse<AdminStudentOutput>> => {
  // Build query string from parameters
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/admin/student/list${queryString ? `?${queryString}` : ""}`;

  return api.get<AdminStudentOutput>(endpoint);
};

/**
 * Get student by ID
 *
 * @param id - Student ID to fetch
 * @returns Promise resolving to student details response
 *
 * @example
 * ```ts
 * try {
 *   const response = await adminStudentService.get('student-123');
 *
 *   if (response.success) {
 *     console.log('Student details:', response.data);
 *   }
 * } catch (error) {
 *   console.error('Failed to fetch student:', error);
 * }
 * ```
 */
export const get = async (id: string): Promise<ApiResponse<Student>> => {
  return api.get<Student>(`/admin/student/${id}`);
};

/**
 * Create student input type
 */
export interface CreateStudentInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  phoneCountryCode?: string;
  bio?: string;
  dateOfBirth?: string;
  address?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  billing?: {
    billingEmail?: string;
    billingAddress?: string;
    billingTaxId?: string;
  };
  isActive?: boolean;
  isVerified?: boolean;
  isSuspended?: boolean;
  profilePicture?: File;
}

/**
 * Update student input type (all fields optional for partial updates)
 */
export interface UpdateStudentInput extends Partial<CreateStudentInput> {
  id: string;
}

/**
 * Create a new student
 *
 * @param input - Student creation data
 * @returns Promise resolving to created student response
 *
 * @example
 * ```ts
 * try {
 *   const formData = new FormData();
 *   formData.append('firstName', 'John');
 *   formData.append('lastName', 'Doe');
 *   formData.append('email', 'john.doe@example.com');
 *   // ... append other fields
 *   if (profilePicture) {
 *     formData.append('profilePicture', profilePicture);
 *   }
 *
 *   const response = await adminStudentService.create(formData);
 *
 *   if (response.success) {
 *     console.log('Student created:', response.data);
 *   }
 * } catch (error) {
 *   console.error('Failed to create student:', error);
 * }
 * ```
 */
export const create = async (
  input: CreateStudentInput,
): Promise<ApiResponse<Student>> => {
  const formData = new FormData();

  // Append all fields to FormData
  Object.entries(input).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (key === "address" && typeof value === "object") {
        // Handle nested address object
        Object.entries(value).forEach(([addrKey, addrValue]) => {
          if (
            addrValue !== undefined &&
            addrValue !== null &&
            addrValue !== ""
          ) {
            formData.append(`address[${addrKey}]`, addrValue.toString());
          }
        });
      } else if (key === "billing" && typeof value === "object") {
        // Handle nested billing object
        Object.entries(value).forEach(([billKey, billValue]) => {
          if (
            billValue !== undefined &&
            billValue !== null &&
            billValue !== ""
          ) {
            formData.append(`billing[${billKey}]`, billValue.toString());
          }
        });
      } else if (key === "profilePicture" && value instanceof File) {
        // Handle file upload
        formData.append(key, value);
      } else if (typeof value === "boolean") {
        // Handle boolean values
        formData.append(key, value.toString());
      } else {
        // Handle string values
        formData.append(key, value.toString());
      }
    }
  });

  return api.post<Student>("/admin/student", formData);
};

/**
 * Update an existing student
 *
 * @param input - Student update data (including id)
 * @returns Promise resolving to updated student response
 *
 * @example
 * ```ts
 * try {
 *   const formData = new FormData();
 *   formData.append('firstName', 'John Updated');
 *   // ... append other fields to update
 *
 *   const response = await adminStudentService.update({
 *     id: 'student-id',
 *     firstName: 'John Updated',
 *     // ... other fields
 *   });
 *
 *   if (response.success) {
 *     console.log('Student updated:', response.data);
 *   }
 * } catch (error) {
 *   console.error('Failed to update student:', error);
 * }
 * ```
 */
export const update = async (
  input: UpdateStudentInput,
): Promise<ApiResponse<AdminCommonResponseData>> => {
  const { id, ...updateData } = input;
  const formData = new FormData();

  // Append all fields to FormData
  Object.entries(updateData).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (key === "address" && typeof value === "object") {
        // Handle nested address object
        Object.entries(value).forEach(([addrKey, addrValue]) => {
          if (
            addrValue !== undefined &&
            addrValue !== null &&
            addrValue !== ""
          ) {
            formData.append(`address[${addrKey}]`, addrValue.toString());
          }
        });
      } else if (key === "billing" && typeof value === "object") {
        // Handle nested billing object
        Object.entries(value).forEach(([billKey, billValue]) => {
          if (
            billValue !== undefined &&
            billValue !== null &&
            billValue !== ""
          ) {
            formData.append(`billing[${billKey}]`, billValue.toString());
          }
        });
      } else if (key === "profilePicture" && value instanceof File) {
        // Handle file upload
        formData.append(key, value);
      } else if (typeof value === "boolean") {
        // Handle boolean values
        formData.append(key, value.toString());
      } else {
        // Handle string values
        formData.append(key, value.toString());
      }
    }
  });

  return api.patch<AdminCommonResponseData>(`/admin/student/${id}`, formData);
};

/**
 * Delete a student
 *
 * @param id - Student ID to delete
 * @returns Promise resolving to delete response
 *
 * @example
 * ```ts
 * try {
 *   const response = await adminStudentService.delete('student-id');
 *
 *   if (response.success) {
 *     console.log('Student deleted successfully');
 *   }
 * } catch (error) {
 *   console.error('Failed to delete student:', error);
 * }
 * ```
 */
export const deleteStudent = async (
  id: string,
): Promise<ApiResponse<AdminCommonResponseData>> => {
  return api.delete<AdminCommonResponseData>(`/admin/student/${id}`);
};

/**
 * Admin student service object
 */
export const adminStudentService = {
  list,
  get,
  create,
  update,
  delete: deleteStudent,
};
