"use client";

import React, { useEffect, useState } from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import { adminEnrollmentCertificateService } from "@/lib/services/admin/enrollment-certificate";

type CertificateRow = {
  id: string;
  courseTitle: string;
  certificateTitle: string;
  certificateId: string;
  issuedAt: string;
  downloadUrl?: string;
};

interface StudentCertificateViewProps {
  studentId: string;
}

export default function StudentCertificateView({
  studentId,
}: StudentCertificateViewProps) {
  const [certificates, setCertificates] = useState<CertificateRow[]>([]);
  const [certificateMeta, setCertificateMeta] = useState<{
    page: number;
    limit: number;
    total: number;
  } | null>(null);
  const [certificatePage, setCertificatePage] = useState(1);
  const certificatePageSize = 10;
  const [certificatesLoading, setCertificatesLoading] = useState(false);
  const [certificatesError, setCertificatesError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!studentId) return;
      try {
        setCertificatesLoading(true);
        setCertificatesError(null);
        const response = await adminEnrollmentCertificateService.list({
          page: certificatePage,
          limit: certificatePageSize,
          studentId: studentId,
        });
        if (response.success) {
          const mapped: CertificateRow[] = response.data.data.map((c: any) => ({
            id: c.id,
            courseTitle: c.enrollment?.course?.title || "N/A",
            certificateTitle: c.title || "N/A",
            certificateId: c.enrollmentCertificateId || "N/A",
            issuedAt: c.certifiedAt
              ? new Date(c.certifiedAt).toISOString().split("T")[0]
              : "N/A",
            downloadUrl: c.certificateKey
              ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${c.certificateKey}`
              : undefined,
          }));
          setCertificates(mapped);
          setCertificateMeta(response.data.meta);
        } else {
          setCertificates([]);
          setCertificateMeta(null);
          setCertificatesError(
            response.error.message || "Failed to fetch certificates",
          );
        }
      } catch (err: any) {
        setCertificates([]);
        setCertificateMeta(null);
        setCertificatesError(err.message || "Failed to fetch certificates");
      } finally {
        setCertificatesLoading(false);
      }
    };

    fetchCertificates();
  }, [studentId, certificatePage]);

  const certificateColumns: Array<DataTableColumn<CertificateRow>> = [
    {
      id: "courseTitle",
      header: "Course",
      accessor: (row) => row.courseTitle,
      cellClassName: "font-medium truncate max-w-[200px]",
      title: (row) => row.courseTitle,
    },
    {
      id: "certificateTitle",
      header: "Certificate Title",
      accessor: (row) => row.certificateTitle,
    },
    {
      id: "certificateId",
      header: "Certificate ID",
      accessor: (row) => row.certificateId,
      cellClassName: "font-mono text-xs",
    },
    {
      id: "issuedAt",
      header: "Issued Date",
      accessor: (row) => row.issuedAt,
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex">
          {row.downloadUrl ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.open(row.downloadUrl, "_blank")}
            >
              Download
            </Button>
          ) : (
            <span className="text-sm text-[color:var(--color-neutral-400)]">
              N/A
            </span>
          )}
        </div>
      ),
      cellClassName: "text-center",
    },
  ];

  const certificateTotal = certificateMeta?.total || 0;
  const certificatePageCount = certificateMeta
    ? Math.ceil(certificateMeta.total / certificateMeta.limit)
    : 1;
  const certificateCurrentPage = certificateMeta?.page || certificatePage;
  const certificateStart =
    certificateTotal === 0
      ? 0
      : (certificateCurrentPage - 1) *
          (certificateMeta?.limit || certificatePageSize) +
        1;
  const certificateEnd = Math.min(
    certificateStart +
      (certificateMeta?.limit || certificatePageSize) -
      (certificateTotal === 0 ? 0 : 1),
    certificateTotal,
  );

  return (
    <Card>
      <CardContent className="p-0">
        {certificatesError ? (
          <div className="px-6 py-8 text-sm text-red-600">
            {certificatesError}
          </div>
        ) : (
          <>
            <DataTable<CertificateRow>
              data={certificates}
              columns={certificateColumns}
              getRowKey={(row) => row.id}
              emptyMessage={
                certificatesLoading
                  ? "Loading certificates..."
                  : "No certificates found for this student."
              }
            />
            {certificateTotal > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4">
                <p className="text-sm text-[color:var(--color-neutral-600)]">
                  Showing{" "}
                  {certificateTotal === 0
                    ? 0
                    : `${certificateStart}-${certificateEnd}`}{" "}
                  of {certificateTotal}
                </p>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full sm:w-auto"
                    disabled={
                      certificatesLoading || certificateCurrentPage === 1
                    }
                    onClick={() =>
                      setCertificatePage((p) => Math.max(p - 1, 1))
                    }
                  >
                    Previous
                  </Button>
                  <div className="text-sm text-[color:var(--color-neutral-700)] hidden sm:block">
                    Page {certificateCurrentPage} of {certificatePageCount}
                  </div>
                  <div className="text-sm text-[color:var(--color-foreground)] sm:hidden text-center flex-1">
                    {certificateCurrentPage}/{certificatePageCount}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full sm:w-auto"
                    disabled={
                      certificatesLoading ||
                      certificateCurrentPage === certificatePageCount
                    }
                    onClick={() =>
                      setCertificatePage((p) =>
                        Math.min(p + 1, certificatePageCount),
                      )
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
