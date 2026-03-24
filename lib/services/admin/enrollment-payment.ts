import { api, ApiResponse } from "@/lib/api";
import {
  AdminEnrollmentPayment,
  AdminEnrollmentPaymentFilterInput,
  AdminEnrollmentPaymentOutput,
  AdminCommonResponseData,
  PaymentMethod,
  PaymentStatus,
} from "./types";

export interface CreateEnrollmentPaymentInput {
  enrollmentId: string;
  amount?: number;
  paidAt?: string;
  transactionId?: string;
  remarks?: string;
  status?: PaymentStatus | string;
  paymentMethod: PaymentMethod | string;
  receipts?: File[];
}

export interface UpdateEnrollmentPaymentInput
  extends Partial<CreateEnrollmentPaymentInput> {
  id: string;
}

const appendToFormData = (
  formData: FormData,
  input: Partial<CreateEnrollmentPaymentInput>
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
      formData.append(key, value.toString());
    } else {
      formData.append(key, value as string);
    }
  });
};

export const list = async (
  query?: AdminEnrollmentPaymentFilterInput
): Promise<ApiResponse<AdminEnrollmentPaymentOutput>> => {
  const params = new URLSearchParams();
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }
  const queryString = params.toString();
  const endpoint = `/admin/enrollment-payment/list${
    queryString ? `?${queryString}` : ""
  }`;
  return api.get<AdminEnrollmentPaymentOutput>(endpoint);
};

export const get = async (
  id: string
): Promise<ApiResponse<AdminEnrollmentPayment>> => {
  const endpoint = `/admin/enrollment-payment/${id}`;
  return api.get<AdminEnrollmentPayment>(endpoint);
};

export const create = async (
  input: CreateEnrollmentPaymentInput
): Promise<ApiResponse<AdminEnrollmentPayment>> => {
  const formData = new FormData();
  appendToFormData(formData, input);
  return api.post<AdminEnrollmentPayment>(
    "/admin/enrollment-payment",
    formData
  );
};

export const update = async (
  input: UpdateEnrollmentPaymentInput
): Promise<ApiResponse<AdminCommonResponseData>> => {
  const { id, ...updateData } = input;
  const formData = new FormData();
  appendToFormData(formData, updateData);
  return api.patch<AdminCommonResponseData>(
    `/admin/enrollment-payment/${id}`,
    formData
  );
};

export const deleteEnrollmentPayment = async (
  id: string
): Promise<ApiResponse<AdminCommonResponseData>> => {
  return api.delete<AdminCommonResponseData>(`/admin/enrollment-payment/${id}`);
};

export const adminEnrollmentPaymentService = {
  list,
  get,
  create,
  update,
  delete: deleteEnrollmentPayment,
};
