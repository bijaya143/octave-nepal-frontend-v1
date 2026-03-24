"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card, { CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import { CheckCircle2, XCircle, Star, Clock, RotateCcw } from "lucide-react";
import { adminEnrollmentService } from "@/lib/services/admin/enrollment";

type CourseEnrollmentStatus = "Active" | "Completed" | "Cancelled";
type CourseEnrollmentPaymentStatus = "Pending" | "Paid" | "Failed" | "Refunded";

type CourseEnrollmentRow = {
  id: string;
  studentName: string;
  studentEmail: string;
  enrolledAt: string;
  enrolledBy: "Self" | "Admin";
  status: CourseEnrollmentStatus;
  paymentStatus?: CourseEnrollmentPaymentStatus;
  progress: number;
  amount: number;
};

function enrollmentStatusBadgeClass(status: CourseEnrollmentStatus): string {
  const s = String(status).toLowerCase();
  if (s === "active") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (s === "completed") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  return "bg-gray-50 text-gray-700 border-gray-200";
}

function enrollmentPaymentStatusBadgeClass(
  status: CourseEnrollmentPaymentStatus,
): string {
  const s = String(status).toLowerCase();
  if (s === "paid") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (s === "pending") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  if (s === "failed") {
    return "bg-red-50 text-red-700 border-red-200";
  }
  if (s === "refunded") {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }
  return "bg-gray-50 text-gray-700 border-gray-200";
}

interface CourseEnrollmentViewProps {
  courseId: string;
}

export default function CourseEnrollmentView({
  courseId,
}: CourseEnrollmentViewProps) {
  const router = useRouter();

  const [enrollments, setEnrollments] = useState<CourseEnrollmentRow[]>([]);
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
      if (!courseId) return;
      try {
        setEnrollmentsLoading(true);
        setEnrollmentsError(null);
        const response = await adminEnrollmentService.list({
          page: enrollmentPage,
          limit: enrollmentPageSize,
          courseId: courseId,
        });
        if (response.success) {
          const mapped: CourseEnrollmentRow[] = response.data.data.map((e) => ({
            id: e.id,
            studentName: e.student
              ? `${e.student.firstName} ${e.student.lastName}`.trim() ||
                e.student.email ||
                "N/A"
              : "N/A",
            studentEmail: e.student?.email || "N/A",
            enrolledAt: e.createdAt
              ? new Date(e.createdAt).toISOString().split("T")[0]
              : "",
            enrolledBy: e.creationMethod === "AUTOMATIC" ? "Self" : "Admin",
            status:
              e.status === "ACTIVE"
                ? "Active"
                : e.status === "COMPLETED"
                  ? "Completed"
                  : "Cancelled",
            progress: e.progressPercentage || 0,
            amount: e.amount || 0,
            paymentStatus:
              e.paymentStatus === "PAID"
                ? "Paid"
                : e.paymentStatus === "FAILED"
                  ? "Failed"
                  : e.paymentStatus === "REFUNDED"
                    ? "Refunded"
                    : "Pending",
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
  }, [courseId, enrollmentPage]);

  const enrollmentColumns: Array<DataTableColumn<CourseEnrollmentRow>> = [
    {
      id: "student",
      header: "Student",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.studentName}</span>
          <span className="text-xs text-[color:var(--color-neutral-500)]">
            {row.studentEmail}
          </span>
        </div>
      ),
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "enrolledAt",
      header: "Enrolled",
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
            {row.status === "Active" ? (
              <CheckCircle2 size={14} />
            ) : row.status === "Completed" ? (
              <Star size={14} />
            ) : (
              <XCircle size={14} />
            )}
            {row.status}
          </span>
        </Badge>
      ),
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "paymentStatus",
      header: "Payment Status",
      cell: (row) => (
        <Badge
          variant="outline"
          className={enrollmentPaymentStatusBadgeClass(
            row.paymentStatus || "Pending",
          )}
        >
          <span className="inline-flex items-center gap-1">
            {row.paymentStatus === "Paid" ? (
              <CheckCircle2 size={14} />
            ) : row.paymentStatus === "Failed" ? (
              <XCircle size={14} />
            ) : row.paymentStatus === "Refunded" ? (
              <RotateCcw size={14} />
            ) : (
              <Clock size={14} />
            )}
            {row.paymentStatus}
          </span>
        </Badge>
      ),
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "progress",
      header: "Progress",
      accessor: (row) => `${row.progress}%`,
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "amount",
      header: "Amount",
      accessor: (row) => `Rs ${row.amount.toLocaleString()}`,
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
            <DataTable<CourseEnrollmentRow>
              data={enrollments}
              columns={enrollmentColumns}
              getRowKey={(row) => row.id}
              emptyMessage={
                enrollmentsLoading
                  ? "Loading enrollments..."
                  : "No enrollments found for this course."
              }
              onRowClick={(row) => {
                router.push(`/admin/enrollments/${row.id}`);
              }}
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
