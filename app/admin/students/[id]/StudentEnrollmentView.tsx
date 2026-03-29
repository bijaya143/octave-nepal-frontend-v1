"use client";

import React, { useEffect, useState } from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import { adminEnrollmentService } from "@/lib/services/admin/enrollment";
import { EnrollmentStatus } from "@/lib/services/admin/types";
import { CheckCircle2, BookOpen, XCircle } from "lucide-react";

type EnrollmentRow = {
  id: string;
  courseTitle: string;
  courseCategory: string;
  progress: number;
  enrolledAt: string;
  status: EnrollmentStatus;
};

function enrollmentStatusBadgeClass(status?: EnrollmentStatus): string {
  if (status === EnrollmentStatus.ACTIVE)
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === EnrollmentStatus.COMPLETED)
    return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-gray-50 text-gray-700 border-gray-200";
}

interface StudentEnrollmentViewProps {
  studentId: string;
}

export default function StudentEnrollmentView({
  studentId,
}: StudentEnrollmentViewProps) {
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([]);
  const [enrollmentMeta, setEnrollmentMeta] = useState<{
    page: number;
    limit: number;
    total: number;
  } | null>(null);
  const [enrollmentPage, setEnrollmentPage] = useState(1);
  const enrollmentPageSize = 10;
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);
  const [enrollmentsError, setEnrollmentsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!studentId) return;
      try {
        setEnrollmentsLoading(true);
        setEnrollmentsError(null);
        const response = await adminEnrollmentService.list({
          page: enrollmentPage,
          limit: enrollmentPageSize,
          studentId: studentId,
        });
        if (response.success) {
          const mapped: EnrollmentRow[] = response.data.data.map((e: any) => ({
            id: e.id,
            courseTitle: e.course?.title || "N/A",
            courseCategory: e.course?.category?.name || "N/A",
            progress: e.progressPercentage || 0,
            enrolledAt: e.createdAt
              ? new Date(e.createdAt).toISOString().split("T")[0]
              : "N/A",
            status: e.status,
          }));
          setEnrollments(mapped);
          setEnrollmentMeta(response.data.meta);
        } else {
          setEnrollments([]);
          setEnrollmentMeta(null);
          setEnrollmentsError(
            response.error.message || "Failed to fetch enrollments",
          );
        }
      } catch (err: any) {
        setEnrollments([]);
        setEnrollmentMeta(null);
        setEnrollmentsError(err.message || "Failed to fetch enrollments");
      } finally {
        setEnrollmentsLoading(false);
      }
    };

    fetchEnrollments();
  }, [studentId, enrollmentPage]);

  const enrollmentColumns: Array<DataTableColumn<EnrollmentRow>> = [
    {
      id: "courseTitle",
      header: "Course",
      accessor: (row) => row.courseTitle,
      cellClassName: "font-medium",
    },
    {
      id: "courseCategory",
      header: "Category",
      accessor: (row) => row.courseCategory,
    },
    {
      id: "progress",
      header: "Progress",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">{row.progress}%</span>
        </div>
      ),
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "enrolledAt",
      header: "Enrolled At",
      accessor: (row) => row.enrolledAt,
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Badge
          variant="outline"
          className={enrollmentStatusBadgeClass(row.status)}
        >
          <span className="inline-flex items-center gap-1">
            {row.status === EnrollmentStatus.ACTIVE ? (
              <CheckCircle2 size={14} />
            ) : row.status === EnrollmentStatus.COMPLETED ? (
              <BookOpen size={14} />
            ) : (
              <XCircle size={14} />
            )}
            {row.status
              ? row.status.charAt(0) + row.status.slice(1).toLowerCase()
              : "N/A"}
          </span>
        </Badge>
      ),
      cellClassName: "whitespace-nowrap",
    },
  ];

  const enrollmentTotal = enrollmentMeta?.total || 0;
  const enrollmentPageCount = enrollmentMeta
    ? Math.ceil(enrollmentMeta.total / enrollmentMeta.limit)
    : 1;
  const enrollmentCurrentPage = enrollmentMeta?.page || enrollmentPage;
  const enrollmentStart =
    enrollmentTotal === 0
      ? 0
      : (enrollmentCurrentPage - 1) *
          (enrollmentMeta?.limit || enrollmentPageSize) +
        1;
  const enrollmentEnd = Math.min(
    enrollmentStart +
      (enrollmentMeta?.limit || enrollmentPageSize) -
      (enrollmentTotal === 0 ? 0 : 1),
    enrollmentTotal,
  );

  return (
    <Card>
      <CardContent className="p-0">
        {enrollmentsError ? (
          <div className="px-6 py-8 text-sm text-red-600">
            {enrollmentsError}
          </div>
        ) : (
          <>
            <DataTable<EnrollmentRow>
              data={enrollments}
              columns={enrollmentColumns}
              getRowKey={(row) => row.id}
              emptyMessage={
                enrollmentsLoading
                  ? "Loading enrollments..."
                  : "No enrollments found for this student."
              }
            />
            {enrollmentTotal > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4">
                <p className="text-sm text-[color:var(--color-neutral-600)]">
                  Showing{" "}
                  {enrollmentTotal === 0
                    ? 0
                    : `${enrollmentStart}-${enrollmentEnd}`}{" "}
                  of {enrollmentTotal}
                </p>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full sm:w-auto"
                    disabled={enrollmentsLoading || enrollmentCurrentPage === 1}
                    onClick={() => setEnrollmentPage((p) => Math.max(p - 1, 1))}
                  >
                    Previous
                  </Button>
                  <div className="text-sm text-[color:var(--color-neutral-700)] hidden sm:block">
                    Page {enrollmentCurrentPage} of {enrollmentPageCount}
                  </div>
                  <div className="text-sm text-[color:var(--color-foreground)] sm:hidden text-center flex-1">
                    {enrollmentCurrentPage}/{enrollmentPageCount}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full sm:w-auto"
                    disabled={
                      enrollmentsLoading ||
                      enrollmentCurrentPage === enrollmentPageCount
                    }
                    onClick={() =>
                      setEnrollmentPage((p) =>
                        Math.min(p + 1, enrollmentPageCount),
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
