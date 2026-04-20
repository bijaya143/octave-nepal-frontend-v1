import { api, ApiResponse } from "@/lib/api";
import { PaymentMethod } from "../admin";
import { GuestCommonResponseData } from "./types";

/**
 * Create Guest Enrollment input type
 */
export interface CreateGuestEnrollmentInput {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  phoneCountryCode: string;
  courseId: string;
  paymentMethod: PaymentMethod | string;
  transactionId?: string;
  receipts?: File[];
}

/**
 * Append data to FormData
 *
 * @param formData - FormData to append data to
 * @param input - Data to append
 */
const appendToFormData = (
  formData: FormData,
  input: Partial<CreateGuestEnrollmentInput>,
) => {
  Object.entries(input).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (key === "receipts" && Array.isArray(value)) {
      value.forEach((file) => {
        if (file instanceof File) {
          formData.append("receipts", file);
        }
      });
    } else if (typeof value === "number" || typeof value === "boolean") {
      //   formData.append(key, value.toString());
      formData.append(key, value as string);
    } else {
      formData.append(key, value as string);
    }
  });
};

/**
 * Create a new guest enrollment
 *
 * @param input - Guest enrollment data
 * @returns Promise resolving to guest enrollment response
 */
export const create = async (
  input: CreateGuestEnrollmentInput,
): Promise<ApiResponse<GuestCommonResponseData>> => {
  const formData = new FormData();
  appendToFormData(formData, input);
  return api.post<GuestCommonResponseData>("/guest/enrollment", formData);
};

/**
 * Guest enrollment service object
 */
export const guestEnrollmentService = {
  create,
};
