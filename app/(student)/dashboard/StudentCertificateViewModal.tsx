"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { XCircle, Download } from "lucide-react";
import { studentEnrollmentCertificateService } from "@/lib/services/student";
import { AdminEnrollmentCertificate } from "@/lib/services/admin/types";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function StudentCertificateViewModal({ open, onClose }: Props) {
  const [certificates, setCertificates] = useState<
    AdminEnrollmentCertificate[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    if (!open) {
      setPage(1);
      setCertificates([]);
      setPagination(null);
      return;
    }

    const fetchCertificates = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await studentEnrollmentCertificateService.list({
          page,
          limit: pageSize,
        });
        if (res.success && res.data && res.data.data) {
          setCertificates(res.data.data);
          setPagination(res.data.meta);
        } else {
          setError(
            (res as any).message ||
              (res as any).error?.message ||
              "Failed to load certificates",
          );
        }
      } catch (err) {
        setError("An unexpected error occurred while fetching certificates.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [open, page]);

  return (
    <Modal open={open} onClose={onClose} title="My Certificates">
      {loading ? (
        <div className="space-y-3 pb-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-50)]/30"
            >
              <div className="flex-1 space-y-2.5 w-full">
                <div className="h-4 bg-[color:var(--color-neutral-200)] rounded-md w-3/4 animate-pulse" />
                <div className="h-3 bg-[color:var(--color-neutral-200)]/60 rounded-md w-1/3 animate-pulse" />
              </div>
              <div className="h-8 w-full sm:w-28 bg-[color:var(--color-neutral-200)]/80 rounded-md animate-pulse shrink-0" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-10 h-48 text-center">
          <XCircle className="h-10 w-10 text-[color:var(--color-error-500)] mb-3 mx-auto" />
          <p className="text-[color:var(--color-neutral-900)] font-medium mb-1">
            Failed to load
          </p>
          <p className="text-sm text-[color:var(--color-neutral-500)]">
            {error}
          </p>
        </div>
      ) : certificates.length > 0 ? (
        <div className="space-y-3 text-sm pb-2">
          {certificates.map((cert) => {
            const certUrl = cert.certificateKey
              ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${cert.certificateKey}`
              : "";

            const courseTitle =
              cert.enrollment?.course?.title || "Course Certificate";

            return (
              <div
                key={cert.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-50)]/50"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="font-medium text-[color:var(--color-neutral-900)] leading-tight">
                    {courseTitle}
                  </div>
                  <div className="text-xs text-[color:var(--color-neutral-500)] mt-1">
                    Issued{" "}
                    {new Date(
                      cert.certifiedAt || cert.createdAt,
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}
                  </div>
                </div>
                {certUrl ? (
                  <a
                    href={certUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="flex items-center gap-1.5 shadow-sm"
                    >
                      <Download size={14} />
                      Download
                    </Button>
                  </a>
                ) : (
                  <span className="text-xs text-[color:var(--color-neutral-400)]">
                    Unavailable
                  </span>
                )}
              </div>
            );
          })}

          {/* Pagination Controls */}
          {pagination && pagination.total > pageSize && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[color:var(--color-neutral-200)] mt-4">
              <p className="text-sm text-[color:var(--color-neutral-600)]">
                Showing {(page - 1) * pageSize + 1}-
                {Math.min(page * pageSize, pagination.total)} of{" "}
                {pagination.total}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={page === 1 || loading}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <div className="text-sm text-[color:var(--color-neutral-600)] hidden sm:block">
                  Page {page} of {Math.ceil(pagination.total / pageSize)}
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={
                    page === Math.ceil(pagination.total / pageSize) || loading
                  }
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-[color:var(--color-neutral-100)] p-3 rounded-full mb-3">
            <Download className="h-6 w-6 text-[color:var(--color-neutral-400)]" />
          </div>
          <p className="text-sm text-[color:var(--color-neutral-600)] font-medium">
            No certificates found.
          </p>
          <p className="text-xs text-[color:var(--color-neutral-500)] mt-1">
            Complete courses to earn certificates.
          </p>
        </div>
      )}
    </Modal>
  );
}
