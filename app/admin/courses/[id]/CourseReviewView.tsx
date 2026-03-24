"use client";

import React, { useEffect, useState } from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import { CheckCircle2, XCircle, Star } from "lucide-react";
import { adminReviewService } from "@/lib/services/admin/review";

type CourseReviewStatus = "Published" | "Unpublished";

type CourseReviewRow = {
  id: string;
  studentName: string;
  courseTitle: string;
  rating: number;
  comment: string;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
};

function reviewStatusBadgeClass(status: CourseReviewStatus): string {
  const s = String(status).toLowerCase();
  if (s === "published") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  return "bg-gray-50 text-gray-700 border-gray-200";
}

interface CourseReviewViewProps {
  courseId: string;
}

export default function CourseReviewView({ courseId }: CourseReviewViewProps) {
  const [reviews, setReviews] = useState<CourseReviewRow[]>([]);
  const [reviewMeta, setReviewMeta] = useState<{
    page: number;
    limit: number;
    total: number;
  } | null>(null);
  const [reviewPage, setReviewPage] = useState(1);
  const reviewPageSize = 10;
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!courseId) return;
      try {
        setReviewsLoading(true);
        setReviewsError(null);
        const response = await adminReviewService.list({
          page: reviewPage,
          limit: reviewPageSize,
          courseId: courseId,
        });
        if (response.success) {
          const mapped: CourseReviewRow[] = response.data.data.map((r) => ({
            id: r.id,
            studentName: r.student
              ? `${r.student.firstName} ${r.student.lastName}`.trim() ||
                r.student.email ||
                "N/A"
              : "N/A",
            courseTitle: r.course?.title || "N/A",
            rating: r.rating,
            comment: r.comment || "",
            isPublished: r.isPublished ?? false,
            isFeatured: r.isFeatured ?? false,
            createdAt: r.createdAt
              ? new Date(r.createdAt).toISOString().split("T")[0]
              : "",
          }));
          setReviews(mapped);
          setReviewMeta(response.data.meta);
        } else {
          setReviews([]);
          setReviewMeta(null);
          setReviewsError(response.error.message || "Failed to fetch reviews");
        }
      } catch (err: any) {
        setReviews([]);
        setReviewMeta(null);
        setReviewsError(err.message || "Failed to fetch reviews");
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [courseId, reviewPage]);

  const reviewColumns: Array<DataTableColumn<CourseReviewRow>> = [
    {
      id: "student",
      header: "Student",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.studentName}</span>
        </div>
      ),
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "rating",
      header: "Rating",
      accessor: (row) => (
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={14}
              className={`${
                star <= row.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-100 text-gray-200"
              }`}
            />
          ))}
        </div>
      ),
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "comment",
      header: "Comment",
      accessor: (row) => row.comment,
      cellClassName: "max-w-xs truncate",
    },
    {
      id: "isPublished",
      header: "Status",
      cell: (row) => (
        <Badge
          variant="outline"
          className={reviewStatusBadgeClass(
            row.isPublished ? "Published" : "Unpublished",
          )}
        >
          <span className="inline-flex items-center gap-1">
            {row.isPublished ? (
              <CheckCircle2 size={14} />
            ) : (
              <XCircle size={14} />
            )}
            {row.isPublished ? "Published" : "Unpublished"}
          </span>
        </Badge>
      ),
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "createdAt",
      header: "Created At",
      accessor: (row) => row.createdAt,
      cellClassName: "whitespace-nowrap",
    },
  ];

  const reviewTotal = reviewMeta?.total || 0;
  const reviewPageCount = reviewMeta
    ? Math.ceil(reviewMeta.total / reviewMeta.limit)
    : 1;
  const reviewCurrentPage = reviewMeta?.page || reviewPage;
  const reviewStart =
    reviewTotal === 0
      ? 0
      : (reviewCurrentPage - 1) * (reviewMeta?.limit || reviewPageSize) + 1;
  const reviewEnd = Math.min(
    reviewStart +
      (reviewMeta?.limit || reviewPageSize) -
      (reviewTotal === 0 ? 0 : 1),
    reviewTotal,
  );

  return (
    <Card>
      <CardContent className="p-0">
        {reviewsError ? (
          <div className="px-6 py-8 text-sm text-red-600">{reviewsError}</div>
        ) : (
          <>
            <DataTable<CourseReviewRow>
              data={reviews}
              columns={reviewColumns}
              getRowKey={(row) => row.id}
              emptyMessage={
                reviewsLoading
                  ? "Loading reviews..."
                  : "No reviews found for this course."
              }
            />
            {reviewTotal > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4">
                <p className="text-sm text-[color:var(--color-neutral-600)]">
                  Showing{" "}
                  {reviewTotal === 0 ? 0 : `${reviewStart}-${reviewEnd}`} of{" "}
                  {reviewTotal}
                </p>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full sm:w-auto"
                    disabled={reviewsLoading || reviewCurrentPage === 1}
                    onClick={() => setReviewPage((p) => Math.max(p - 1, 1))}
                  >
                    Previous
                  </Button>
                  <div className="text-sm text-[color:var(--color-neutral-700)] hidden sm:block">
                    Page {reviewCurrentPage} of {reviewPageCount}
                  </div>
                  <div className="text-sm text-[color:var(--color-foreground)] sm:hidden text-center flex-1">
                    {reviewCurrentPage}/{reviewPageCount}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full sm:w-auto"
                    disabled={
                      reviewsLoading || reviewCurrentPage === reviewPageCount
                    }
                    onClick={() =>
                      setReviewPage((p) => Math.min(p + 1, reviewPageCount))
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
