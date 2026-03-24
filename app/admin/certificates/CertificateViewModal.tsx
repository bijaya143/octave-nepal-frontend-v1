"use client";
import React from "react";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Book,
  User,
  Download,
  Clock,
  FileText,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

export type Certificate = {
  id: string;
  title: string;
  enrollmentId: string;
  studentName: string;
  courseTitle: string;
  issuedDate: string;
  certifiedAt?: string;
  isPublished?: boolean;
  certificateKey?: string;
  enrollmentCertificateId?: string;
  isDownloaded?: boolean;
  creationMethod?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

type Props = {
  certificate: Certificate | null;
  onClose: () => void;
};

export default function CertificateViewModal({ certificate, onClose }: Props) {
  const fileUrl =
    certificate && certificate.certificateKey
      ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${certificate.certificateKey}`
      : "";

  const isPdf =
    certificate?.certificateKey?.toLowerCase().endsWith(".pdf") || false;

  return (
    <Modal
      open={!!certificate}
      onClose={onClose}
      title={certificate ? "Certificate Details" : undefined}
      panelClassName="max-w-2xl"
    >
      {certificate && (
        <div className="space-y-6 text-sm">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[color:var(--color-neutral-900)]">
                {certificate.title}
              </h3>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-[color:var(--color-neutral-100)] px-2 py-1 font-mono text-xs text-[color:var(--color-neutral-700)]">
                  {certificate.enrollmentCertificateId || certificate.id}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={
                  certificate.isPublished
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-gray-50 text-gray-700 border-gray-200"
                }
              >
                <span className="inline-flex items-center gap-1.5">
                  {certificate.isPublished ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <XCircle size={14} />
                  )}
                  {certificate.isPublished ? "Published" : "Unpublished"}
                </span>
              </Badge>
              {certificate.isDownloaded && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Download size={14} />
                    Downloaded
                  </span>
                </Badge>
              )}
            </div>
          </div>

          <div className="h-px bg-[color:var(--color-neutral-200)]" />

          {/* Main Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 rounded-lg border border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-50)]/50 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[color:var(--color-neutral-500)] shadow-sm ring-1 ring-[color:var(--color-neutral-200)]">
                <User size={16} />
              </div>
              <div>
                <div className="text-xs font-medium text-[color:var(--color-neutral-500)]">
                  Student
                </div>
                <div className="mt-0.5 font-medium text-[color:var(--color-neutral-900)]">
                  {certificate.studentName}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-50)]/50 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[color:var(--color-neutral-500)] shadow-sm ring-1 ring-[color:var(--color-neutral-200)]">
                <Book size={16} />
              </div>
              <div>
                <div className="text-xs font-medium text-[color:var(--color-neutral-500)]">
                  Course
                </div>
                <div className="mt-0.5 font-medium text-[color:var(--color-neutral-900)]">
                  {certificate.courseTitle}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-50)]/50 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[color:var(--color-neutral-500)] shadow-sm ring-1 ring-[color:var(--color-neutral-200)]">
                <Calendar size={16} />
              </div>
              <div>
                <div className="text-xs font-medium text-[color:var(--color-neutral-500)]">
                  Certified At
                </div>
                <div className="mt-0.5 font-medium text-[color:var(--color-neutral-900)]">
                  {certificate.certifiedAt || certificate.issuedDate}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-50)]/50 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[color:var(--color-neutral-500)] shadow-sm ring-1 ring-[color:var(--color-neutral-200)]">
                <Clock size={16} />
              </div>
              <div>
                <div className="text-xs font-medium text-[color:var(--color-neutral-500)]">
                  Created Method
                </div>
                <div className="mt-0.5 font-medium text-[color:var(--color-neutral-900)]">
                  {certificate.creationMethod || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Certificate File Preview */}
          {fileUrl && (
            <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-medium text-[color:var(--color-neutral-900)]">
                  Certificate File
                </h4>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[color:var(--color-primary-600)] hover:text-[color:var(--color-primary-700)] hover:underline"
                >
                  Open in new tab
                  <ExternalLink size={12} />
                </a>
              </div>

              <div className="relative overflow-hidden rounded-lg border border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-50)]">
                {isPdf ? (
                  <div className="flex h-48 flex-col items-center justify-center gap-3 p-6 text-center">
                    <div className="rounded-full bg-white p-3 shadow-sm ring-1 ring-[color:var(--color-neutral-200)]">
                      <FileText className="h-8 w-8 text-[color:var(--color-neutral-400)]" />
                    </div>
                    <div>
                      <p className="font-medium text-[color:var(--color-neutral-900)]">
                        PDF Document
                      </p>
                      <p className="mt-1 font-mono text-xs text-[color:var(--color-neutral-500)]">
                        {certificate.certificateKey}
                      </p>
                    </div>
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-[color:var(--color-neutral-700)] shadow-sm ring-1 ring-[color:var(--color-neutral-300)] hover:bg-[color:var(--color-neutral-50)]"
                    >
                      <Download size={14} />
                      Download PDF
                    </a>
                  </div>
                ) : (
                  <div className="relative aspect-video w-full bg-[color:var(--color-neutral-100)]">
                    <Image
                      src={fileUrl}
                      alt="Certificate Preview"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata Footer */}
          <div className="rounded-lg bg-[color:var(--color-neutral-50)] p-3 text-xs text-[color:var(--color-neutral-500)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex justify-between sm:justify-start sm:gap-2">
                <span>Created By:</span>
                <span className="font-medium text-[color:var(--color-neutral-700)]">
                  {certificate.createdBy || "N/A"}
                </span>
              </div>
              <div className="flex justify-between sm:justify-start sm:gap-2">
                <span>Created At:</span>
                <span className="font-medium text-[color:var(--color-neutral-700)]">
                  {certificate.createdAt || "N/A"}
                </span>
              </div>
              <div className="flex justify-between sm:justify-start sm:gap-2">
                <span>Updated At:</span>
                <span className="font-medium text-[color:var(--color-neutral-700)]">
                  {certificate.updatedAt || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
