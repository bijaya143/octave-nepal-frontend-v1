"use client";
import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { XCircle, Download, FileText, Loader2 } from "lucide-react";
import Image from "next/image";
import { studentEnrollmentCertificateService } from "@/lib/services/student";
import { AdminEnrollmentCertificate } from "@/lib/services/admin/types";

type Props = {
  enrollmentId: string | null;
  onClose: () => void;
};

export default function StudentCourseCertificateViewModal({
  enrollmentId,
  onClose,
}: Props) {
  const [certificates, setCertificates] = useState<
    AdminEnrollmentCertificate[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enrollmentId) {
      setCertificates([]);
      setError(null);
      return;
    }

    const fetchCertificates = async () => {
      setLoading(true);
      setError(null);
      try {
        const res =
          await studentEnrollmentCertificateService.getByEnrollmentId(
            enrollmentId,
          );
        if (
          res.success &&
          res.data &&
          res.data.data &&
          res.data.data.length > 0
        ) {
          setCertificates(res.data.data);
        } else if (res.success) {
          setError("No certificates found for this course.");
        } else {
          setError(
            (res as any).message ||
              (res as any).error?.message ||
              "Failed to load certificates",
          );
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching the certificates",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [enrollmentId]);

  return (
    <Modal
      open={!!enrollmentId}
      onClose={onClose}
      title="Course Certificate(s)"
      panelClassName="max-w-2xl"
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center p-10 h-64 text-[color:var(--color-neutral-500)]">
          <Loader2 className="h-8 w-8 animate-spin mb-4 text-[color:var(--color-primary-600)]" />
          <p>Loading your certificate...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-10 h-64 text-center">
          <XCircle className="h-10 w-10 text-[color:var(--color-error-500)] mb-3 mx-auto" />
          <p className="text-[color:var(--color-neutral-900)] font-medium mb-1">
            Failed to load
          </p>
          <p className="text-sm text-[color:var(--color-neutral-500)]">
            {error}
          </p>
        </div>
      ) : certificates.length > 0 ? (
        <div className="space-y-10 text-sm pb-4">
          {certificates.map((cert, index) => {
            const certUrl = cert.certificateKey
              ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${cert.certificateKey}`
              : "";
            const certIsPdf =
              cert.certificateKey?.toLowerCase().endsWith(".pdf") || false;

            return (
              <div key={cert.id} className="space-y-6">
                {/* Certificate File Preview */}
                {certUrl && (
                  <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-4">
                    <div className="mb-3">
                      <h4 className="text-sm sm:text-base font-medium text-[color:var(--color-neutral-900)] leading-tight">
                        {cert.title}
                      </h4>
                    </div>

                    <div className="relative overflow-hidden rounded-lg border border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-50)]">
                      {certIsPdf ? (
                        <div className="flex h-48 flex-col items-center justify-center gap-3 p-6 text-center">
                          <div className="rounded-full bg-white p-3 shadow-sm ring-1 ring-[color:var(--color-neutral-200)]">
                            <FileText className="h-8 w-8 text-[color:var(--color-neutral-400)]" />
                          </div>
                          <div>
                            <p className="font-medium text-[color:var(--color-neutral-900)]">
                              PDF Document
                            </p>
                            <p className="mt-1 font-mono text-xs text-[color:var(--color-neutral-500)] truncate max-w-xs mx-auto">
                              {cert.certificateKey?.split("/").pop()}
                            </p>
                          </div>
                          <a
                            href={certUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-[color:var(--color-neutral-700)] shadow-sm ring-1 ring-[color:var(--color-neutral-300)] hover:bg-[color:var(--color-neutral-50)]"
                          >
                            <Download size={14} />
                            Download PDF
                          </a>
                        </div>
                      ) : (
                        <div className="relative aspect-[1.414/1] w-full bg-[color:var(--color-neutral-100)] flex flex-col group overflow-hidden">
                          <Image
                            src={certUrl}
                            alt="Certificate Preview"
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                      )}
                    </div>
                    {/* Native Download Action Below the Asset */}
                    {!certIsPdf && (
                      <div className="mt-4">
                        <a
                          href={certUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[color:var(--color-primary-50)] border border-[color:var(--color-primary-100)] px-4 py-2.5 text-sm font-medium text-[color:var(--color-primary-700)] transition-all hover:bg-[color:var(--color-primary-100)] active:bg-[color:var(--color-primary-200)]"
                        >
                          <Download size={16} />
                          Download Certificate Image
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : null}
    </Modal>
  );
}
