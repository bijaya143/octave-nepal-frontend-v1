import { api, ApiResponse } from "@/lib/api";
import {
  AdminEnrollmentCertificate,
  AdminEnrollmentCertificateFilterInput,
  AdminEnrollmentCertificateOutput,
  AdminCommonResponseData,
} from "./types";

export interface CreateEnrollmentCertificateInput {
  title: string;
  enrollmentId: string;
  certifiedAt?: string;
  certificate?: File;
  isPublished?: boolean;
}

export interface UpdateEnrollmentCertificateInput extends Partial<CreateEnrollmentCertificateInput> {
  id: string;
}

const appendToFormData = (
  formData: FormData,
  input: Partial<CreateEnrollmentCertificateInput>,
) => {
  Object.entries(input).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (value instanceof File) {
      formData.append(key, value);
    } else if (typeof value === "boolean" || typeof value === "number") {
      formData.append(key, value.toString());
    } else {
      formData.append(key, value as string);
    }
  });
};

export const list = async (
  query?: AdminEnrollmentCertificateFilterInput,
): Promise<ApiResponse<AdminEnrollmentCertificateOutput>> => {
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const endpoint = `/admin/enrollment-certificate/list${
    queryString ? `?${queryString}` : ""
  }`;

  return api.get<AdminEnrollmentCertificateOutput>(endpoint);
};

export const get = async (
  id: string,
): Promise<ApiResponse<AdminEnrollmentCertificate>> => {
  const endpoint = `/admin/enrollment-certificate/${id}`;
  return api.get<AdminEnrollmentCertificate>(endpoint);
};

export const create = async (
  input: CreateEnrollmentCertificateInput,
): Promise<ApiResponse<AdminEnrollmentCertificate>> => {
  const formData = new FormData();
  appendToFormData(formData, input);
  return api.post<AdminEnrollmentCertificate>(
    "/admin/enrollment-certificate",
    formData,
  );
};

export const update = async (
  input: UpdateEnrollmentCertificateInput,
): Promise<ApiResponse<AdminCommonResponseData>> => {
  const { id, ...updateData } = input;
  const formData = new FormData();
  appendToFormData(formData, updateData);
  return api.patch<AdminCommonResponseData>(
    `/admin/enrollment-certificate/${id}`,
    formData,
  );
};

export const deleteEnrollmentCertificate = async (
  id: string,
): Promise<ApiResponse<AdminCommonResponseData>> => {
  return api.delete<AdminCommonResponseData>(
    `/admin/enrollment-certificate/${id}`,
  );
};

export const adminEnrollmentCertificateService = {
  list,
  get,
  create,
  update,
  delete: deleteEnrollmentCertificate,
};
