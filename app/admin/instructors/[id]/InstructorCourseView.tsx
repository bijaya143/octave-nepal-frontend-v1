"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card, { CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import { adminCourseService } from "@/lib/services/admin/course";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Course, PublishStatusType } from "@/lib/services";

type CourseRow = {
  id: string;
  title: string;
  price: number;
  status: PublishStatusType;
  students: number;
  reviews: number;
  availableSeatCount: number;
  createdAt: string;
};

function courseStatusBadgeClass(status: PublishStatusType): string {
  if (status === PublishStatusType.PUBLISHED)
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === PublishStatusType.UNDER_REVIEW)
    return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-gray-50 text-gray-700 border-gray-200";
}

interface InstructorCourseViewProps {
  instructorId: string;
}

export default function InstructorCourseView({
  instructorId,
}: InstructorCourseViewProps) {
  const router = useRouter();

  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [courseMeta, setCourseMeta] = useState<{
    page: number;
    limit: number;
    total: number;
  } | null>(null);
  const [coursePage, setCoursePage] = useState(1);
  const coursePageSize = 10;
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!instructorId) return;
      try {
        setCoursesLoading(true);
        setCoursesError(null);
        const response = await adminCourseService.list({
          page: coursePage,
          limit: coursePageSize,
          instructorId: instructorId,
        });
        if (response.success) {
          const mapped: CourseRow[] = response.data.data.map((c: Course) => ({
            id: c.id,
            title: c.title,
            price: c.sellingPrice || 0,
            status: c.status as PublishStatusType,
            students: c.studentCount || 0,
            reviews: c.reviewCount || 0,
            availableSeatCount: c.availableSeatCount || 0,
            createdAt: c.createdAt
              ? new Date(c.createdAt).toISOString().split("T")[0]
              : "",
          }));
          setCourses(mapped);
          setCourseMeta(response.data.meta);
        } else {
          setCourses([]);
          setCourseMeta(null);
          setCoursesError(response.error.message || "Failed to fetch courses");
        }
      } catch (err: any) {
        setCourses([]);
        setCourseMeta(null);
        setCoursesError(err.message || "Failed to fetch courses");
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, [instructorId, coursePage]);

  const courseColumns: Array<DataTableColumn<CourseRow>> = [
    {
      id: "title",
      header: "Title",
      accessor: (row) => row.title,
      cellClassName: "font-medium",
    },
    {
      id: "students",
      header: "Students",
      accessor: (row) => row.students,
      cellClassName: "whitespace-nowrap text-center",
    },
    {
      id: "reviews",
      header: "Reviews",
      accessor: (row) => row.reviews,
      cellClassName: "whitespace-nowrap text-center",
    },
    {
      id: "price",
      header: "Price",
      accessor: (row) => `Rs ${row.price.toLocaleString()}`,
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "availableSeatCount",
      header: "Available Seats",
      accessor: (row) => row.availableSeatCount,
      cellClassName: "whitespace-nowrap text-center",
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Badge variant="outline" className={courseStatusBadgeClass(row.status)}>
          <span className="inline-flex items-center gap-1">
            {row.status === PublishStatusType.PUBLISHED ? (
              <CheckCircle2 size={14} />
            ) : row.status === PublishStatusType.UNDER_REVIEW ? (
              <Clock size={14} />
            ) : (
              <XCircle size={14} />
            )}
            {row.status.replace(/_/g, " ")}
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

  const courseTotal = courseMeta?.total || 0;
  const coursePageCount = courseMeta
    ? Math.ceil(courseMeta.total / courseMeta.limit)
    : 1;
  const courseCurrentPage = courseMeta?.page || coursePage;
  const courseStart =
    courseTotal === 0
      ? 0
      : (courseCurrentPage - 1) * (courseMeta?.limit || coursePageSize) + 1;
  const courseEnd = Math.min(
    courseStart +
      (courseMeta?.limit || coursePageSize) -
      (courseTotal === 0 ? 0 : 1),
    courseTotal,
  );

  return (
    <Card>
      <CardContent className="p-0">
        {coursesError ? (
          <div className="px-6 py-8 text-sm text-red-600">{coursesError}</div>
        ) : (
          <>
            <DataTable<CourseRow>
              data={courses}
              columns={courseColumns}
              getRowKey={(row) => row.id}
              emptyMessage={
                coursesLoading
                  ? "Loading courses..."
                  : "No courses found for this instructor."
              }
              onRowClick={(row) => {
                router.push(`/admin/courses/${row.id}`);
              }}
            />
            {courseTotal > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4">
                <p className="text-sm text-[color:var(--color-neutral-600)]">
                  Showing{" "}
                  {courseTotal === 0 ? 0 : `${courseStart}-${courseEnd}`} of{" "}
                  {courseTotal}
                </p>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full sm:w-auto"
                    disabled={coursesLoading || courseCurrentPage === 1}
                    onClick={() => setCoursePage((p) => Math.max(p - 1, 1))}
                  >
                    Previous
                  </Button>
                  <div className="text-sm text-[color:var(--color-neutral-700)] hidden sm:block">
                    Page {courseCurrentPage} of {coursePageCount}
                  </div>
                  <div className="text-sm text-[color:var(--color-foreground)] sm:hidden text-center flex-1">
                    {courseCurrentPage}/{coursePageCount}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full sm:w-auto"
                    disabled={
                      coursesLoading || courseCurrentPage === coursePageCount
                    }
                    onClick={() =>
                      setCoursePage((p) => Math.min(p + 1, coursePageCount))
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
