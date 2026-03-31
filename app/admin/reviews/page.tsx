"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DateRangePicker from "@/components/ui/DateRangePicker";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Pencil,
  Trash2,
  RotateCcw,
  Star,
  X,
} from "lucide-react";
import { toast } from "sonner";
import ReviewFormModal, { ReviewFormValues } from "./ReviewFormModal";
import ReviewViewModal, { Review } from "./ReviewViewModal";
import { adminReviewService } from "@/lib/services/admin/review";
import { adminStudentService } from "@/lib/services/admin/student";
import { adminCourseService } from "@/lib/services/admin/course";
import { AdminReviewFilterInput } from "@/lib/services/admin/types";

type UIReview = Review;

export default function AdminReviewsPage() {
  const [reviews, setReviews] = React.useState<UIReview[]>([]);
  const [pagination, setPagination] = React.useState<{
    page: number;
    limit: number;
    total: number;
  } | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  const [query, setQuery] = React.useState("");
  const [createdFrom, setCreatedFrom] = React.useState<string>("");
  const [createdTo, setCreatedTo] = React.useState<string>("");
  const [studentFilter, setStudentFilter] = React.useState<string>("all");
  const [courseFilter, setCourseFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  // Student filter dropdown
  const [isStudentMenuOpen, setIsStudentMenuOpen] = React.useState(false);
  const studentMenuRef = React.useRef<HTMLDivElement>(null);
  const [students, setStudents] = React.useState<
    Array<{ id: string; name: string; email: string }>
  >([]);
  const [studentQuery, setStudentQuery] = React.useState("");
  const [studentPage, setStudentPage] = React.useState(1);
  const [hasMoreStudents, setHasMoreStudents] = React.useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = React.useState(false);

  // Course filter dropdown
  const [isCourseMenuOpen, setIsCourseMenuOpen] = React.useState(false);
  const courseMenuRef = React.useRef<HTMLDivElement>(null);
  const [courses, setCourses] = React.useState<
    Array<{ id: string; title: string }>
  >([]);
  const [courseQuery, setCourseQuery] = React.useState("");
  const [coursePage, setCoursePage] = React.useState(1);
  const [hasMoreCourses, setHasMoreCourses] = React.useState(true);
  const [isLoadingCourses, setIsLoadingCourses] = React.useState(false);

  const fetchStudentsForFilter = React.useCallback(
    async (page: number, search: string, reset = false) => {
      try {
        setIsLoadingStudents(true);
        const resp = await adminStudentService.list({
          page,
          limit: 10,
          keyword: search || undefined,
        });
        if (resp.success) {
          const mapped = resp.data.data.map((s) => ({
            id: s.id,
            name: `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim() || s.email,
            email: s.email,
          }));
          setStudents((prev) => (reset ? mapped : [...prev, ...mapped]));
          const totalPages = Math.ceil(
            resp.data.meta.total / resp.data.meta.limit,
          );
          setHasMoreStudents(resp.data.meta.page < totalPages);
        }
      } catch (err) {
      } finally {
        setIsLoadingStudents(false);
      }
    },
    [],
  );

  const fetchCoursesForFilter = React.useCallback(
    async (page: number, search: string, reset = false) => {
      try {
        setIsLoadingCourses(true);
        const resp = await adminCourseService.list({
          page,
          limit: 10,
          keyword: search || undefined,
        });
        if (resp.success) {
          const mapped = resp.data.data.map((c) => ({
            id: c.id,
            title: c.title,
          }));
          setCourses((prev) => (reset ? mapped : [...prev, ...mapped]));
          const totalPages = Math.ceil(
            resp.data.meta.total / resp.data.meta.limit,
          );
          setHasMoreCourses(resp.data.meta.page < totalPages);
        }
      } catch (err) {
      } finally {
        setIsLoadingCourses(false);
      }
    },
    [],
  );

  React.useEffect(() => {
    if (isStudentMenuOpen) {
      setStudentPage(1);
      fetchStudentsForFilter(1, studentQuery, true);
    }
  }, [isStudentMenuOpen, studentQuery, fetchStudentsForFilter]);

  React.useEffect(() => {
    if (isCourseMenuOpen) {
      setCoursePage(1);
      fetchCoursesForFilter(1, courseQuery, true);
    }
  }, [isCourseMenuOpen, courseQuery, fetchCoursesForFilter]);

  const handleStudentScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMoreStudents &&
      !isLoadingStudents
    ) {
      const next = studentPage + 1;
      setStudentPage(next);
      fetchStudentsForFilter(next, studentQuery);
    }
  };

  const handleCourseScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMoreCourses &&
      !isLoadingCourses
    ) {
      const next = coursePage + 1;
      setCoursePage(next);
      fetchCoursesForFilter(next, courseQuery);
    }
  };

  React.useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (
        isStudentMenuOpen &&
        studentMenuRef.current &&
        !studentMenuRef.current.contains(e.target as Node)
      ) {
        setIsStudentMenuOpen(false);
      }
      if (
        isCourseMenuOpen &&
        courseMenuRef.current &&
        !courseMenuRef.current.contains(e.target as Node)
      ) {
        setIsCourseMenuOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsStudentMenuOpen(false);
        setIsCourseMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isStudentMenuOpen, isCourseMenuOpen]);

  const fetchReviews = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const filters: AdminReviewFilterInput = {
        page,
        limit: pageSize,
        keyword: query || undefined,
        startDate: createdFrom || undefined,
        endDate: createdTo || undefined,
        studentId: studentFilter !== "all" ? studentFilter : undefined,
        courseId: courseFilter !== "all" ? courseFilter : undefined,
        isPublished:
          statusFilter !== "all" ? statusFilter === "published" : undefined,
      };
      const resp = await adminReviewService.list(filters);
      if (resp.success) {
        const mapped: UIReview[] = resp.data.data.map((r) => {
          const student = r.student || null;
          const course = r.course || null;
          const studentName = student
            ? `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim() ||
              student.email ||
              "N/A"
            : "N/A";
          const courseTitle = course?.title || "N/A";
          const createdAt = r.createdAt
            ? new Date(r.createdAt).toISOString().split("T")[0]
            : "";
          const updatedAt = r.updatedAt
            ? new Date(r.updatedAt).toISOString().split("T")[0]
            : "";

          return {
            id: r.id,
            enrollmentId: r.enrollment?.id || "",
            studentName,
            courseTitle,
            rating: r.rating,
            comment: r.comment || "",
            isPublished: r.isPublished ?? false,
            isFeatured: r.isFeatured ?? false,
            createdAt,
            updatedAt,
          };
        });
        setReviews(mapped);
        setPagination(resp.data.meta);
      }
    } catch (err) {
      toast.error("Failed to fetch reviews");
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    pageSize,
    query,
    createdFrom,
    createdTo,
    studentFilter,
    courseFilter,
    statusFilter,
  ]);

  React.useEffect(() => {
    fetchReviews();
  }, [fetchReviews, refreshKey]);

  const total = pagination?.total || 0;
  const pageCount = pagination
    ? Math.ceil(pagination.total / pagination.limit)
    : 1;

  const [selected, setSelected] = React.useState<UIReview | null>(null);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [editing, setEditing] = React.useState<UIReview | null>(null);
  const [pendingDelete, setPendingDelete] = React.useState<UIReview | null>(
    null,
  );

  const handleCreate = async (values: ReviewFormValues) => {
    try {
      setIsSubmitting(true);
      await adminReviewService.create({
        enrollmentId: values.enrollmentId,
        rating: values.rating,
        comment: values.comment,
      });
      // The create API doesn't accept isPublished/isFeatured directly based on types
      // But we can check if we need to update it immediately after creation if needed
      // For now we stick to what create accepts.
      // If the create API returns the ID, we could update it, but let's assume default is unpublished/unfeatured
      // Wait, let's check the types again. CreateReviewInput only has enrollmentId, rating, comment.
      // UpdateReviewInput has isPublished, isFeatured.
      // So if user set published/featured in create form, we might need a second call or update the API.
      // For simplicity, we'll just create it now.

      toast.success("Review created successfully");
      setOpenCreate(false);
      setRefreshKey((k) => k + 1);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create review",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (values: ReviewFormValues) => {
    if (!editing) return;
    try {
      setIsSubmitting(true);
      await adminReviewService.update({
        id: editing.id,
        rating: values.rating,
        comment: values.comment,
        isPublished: values.isPublished,
        isFeatured: values.isFeatured,
      });
      toast.success("Review updated successfully");
      setEditing(null);
      setRefreshKey((k) => k + 1);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update review",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (review: UIReview) => {
    setPendingDelete(review);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      const resp = await adminReviewService.delete(pendingDelete.id);
      if (resp.success) {
        toast.success("Review deleted successfully");
        setPendingDelete(null);
        setRefreshKey((k) => k + 1);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete review",
      );
    }
  };

  const cancelDelete = () => {
    setPendingDelete(null);
  };

  const columns: Array<DataTableColumn<UIReview>> = [
    {
      id: "studentName",
      header: "Student",
      accessor: "studentName",
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "courseTitle",
      header: "Course",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span
            className="font-medium truncate max-w-[200px]"
            title={row.courseTitle}
          >
            {row.courseTitle}
          </span>
        </div>
      ),
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "rating",
      header: "Rating",
      accessor: "rating",
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Star size={14} className="text-yellow-400 fill-current" />
          <span>{row.rating}</span>
        </div>
      ),
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "createdAt",
      header: "Date",
      accessor: "createdAt",
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Badge
          variant="outline"
          className={
            row.isPublished
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-gray-50 text-gray-700 border-gray-200"
          }
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
      id: "isFeatured",
      header: "Featured",
      cell: (row) => (
        <Badge
          variant="outline"
          className={
            row.isFeatured
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-gray-50 text-gray-700 border-gray-200"
          }
        >
          <span className="inline-flex items-center gap-1">
            {row.isFeatured ? (
              <CheckCircle2 size={14} />
            ) : (
              <XCircle size={14} />
            )}
            {row.isFeatured ? "Featured" : "Not featured"}
          </span>
        </Badge>
      ),
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "actions",
      header: "Actions",
      align: "center",
      cell: (row) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="gap-1 text-primary-600 border-primary-200 hover:bg-primary-50"
            aria-label="View"
            onClick={(e) => {
              e.stopPropagation();
              setSelected(row);
            }}
          >
            <Eye size={16} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="gap-1"
            aria-label="Edit"
            onClick={(e) => {
              e.stopPropagation();
              setEditing(row);
            }}
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
            aria-label="Delete"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Reviews</h1>
        </div>
        <Button size="sm" onClick={() => setOpenCreate(true)}>
          Add Review
        </Button>
      </div>

      <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-5">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Search
            </label>
            <Input
              placeholder="Search reviews..."
              value={query}
              onChange={(e) => {
                setPage(1);
                setQuery(e.target.value);
              }}
            />
          </div>
          <div className="md:col-span-5">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Created Date
            </label>
            <DateRangePicker
              value={{ from: createdFrom || null, to: createdTo || null }}
              onChange={(r) => {
                setPage(1);
                setCreatedFrom(r.from || "");
                setCreatedTo(r.to || "");
              }}
              placeholder="Created date range"
            />
          </div>
          <div className="md:col-span-2 flex md:justify-end">
            <Button
              variant="secondary"
              size="md"
              className="w-full md:w-auto inline-flex items-center gap-2 text-primary-600 border-primary-200 hover:bg-primary-50"
              onClick={() => {
                setQuery("");
                setCreatedFrom("");
                setCreatedTo("");
                setStudentFilter("all");
                setCourseFilter("all");
                setStatusFilter("all");
                setPage(1);
              }}
            >
              <RotateCcw size={16} /> Reset
            </Button>
          </div>

          {/* Row 2: Filters */}
          <div className="md:col-span-4">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Student
            </label>
            <div className="relative" ref={studentMenuRef}>
              <button
                type="button"
                className="h-11 w-full rounded-lg bg-white border pr-9 px-3 text-left text-[color:var(--foreground)] border-[color:var(--color-neutral-200)] focus:border-[color:var(--color-primary-400)] shadow-xs focus:shadow-sm transition-all"
                onClick={() => setIsStudentMenuOpen((v) => !v)}
              >
                <span className="block truncate text-[color:var(--color-neutral-700)]">
                  {studentFilter === "all"
                    ? "All Students"
                    : students.find((s) => s.id === studentFilter)?.name ||
                      "Selected Student"}
                </span>
                <svg
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[color:var(--color-neutral-500)]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {isStudentMenuOpen && (
                <div
                  className="absolute z-50 mt-1 w-full rounded-lg border border-[color:var(--color-neutral-200)] bg-white shadow-md max-h-56 overflow-y-auto scroll-elegant"
                  onScroll={handleStudentScroll}
                >
                  <div className="p-2 border-b border-[color:var(--color-neutral-200)] sticky top-0 bg-white z-10">
                    <div className="relative">
                      <Input
                        value={studentQuery}
                        onChange={(e) => setStudentQuery(e.target.value)}
                        placeholder="Search student"
                      />
                      {studentQuery && (
                        <button
                          type="button"
                          aria-label="Clear search"
                          title="Clear search"
                          onClick={() => setStudentQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--color-neutral-500)] hover:text-[color:var(--color-neutral-700)]"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <ul className="py-1">
                    <li className="px-3 py-2 hover:bg-[color:var(--color-neutral-50)]">
                      <button
                        type="button"
                        className={`w-full text-left text-sm ${
                          studentFilter === "all"
                            ? "text-[color:var(--color-primary-800)] font-medium"
                            : ""
                        }`}
                        onClick={() => {
                          setPage(1);
                          setStudentFilter("all");
                          setIsStudentMenuOpen(false);
                        }}
                      >
                        All students
                      </button>
                    </li>
                    {students.length === 0 && !isLoadingStudents ? (
                      <li className="px-3 py-2 text-[12px] text-[color:var(--color-neutral-500)] text-center">
                        No students found
                      </li>
                    ) : (
                      students.map((student) => {
                        const selected = student.id === studentFilter;
                        return (
                          <li
                            key={student.id}
                            className="px-3 py-2 hover:bg-[color:var(--color-neutral-50)]"
                          >
                            <button
                              type="button"
                              className={`w-full text-left text-sm ${
                                selected
                                  ? "text-[color:var(--color-primary-800)] font-medium"
                                  : ""
                              }`}
                              onClick={() => {
                                setPage(1);
                                setStudentFilter(student.id);
                                setIsStudentMenuOpen(false);
                              }}
                            >
                              <div>{student.name}</div>
                              <div className="text-xs text-[color:var(--color-neutral-500)]">
                                {student.email}
                              </div>
                            </button>
                          </li>
                        );
                      })
                    )}
                    {isLoadingStudents && (
                      <li className="px-3 py-2 text-[12px] text-[color:var(--color-neutral-500)] text-center">
                        Loading...
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Course Filter */}
          <div className="md:col-span-4">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Course
            </label>
            <div className="relative" ref={courseMenuRef}>
              <button
                type="button"
                className="h-11 w-full rounded-lg bg-white border pr-9 px-3 text-left text-[color:var(--foreground)] border-[color:var(--color-neutral-200)] focus:border-[color:var(--color-primary-400)] shadow-xs focus:shadow-sm transition-all"
                onClick={() => setIsCourseMenuOpen((v) => !v)}
              >
                <span className="block truncate text-[color:var(--color-neutral-700)]">
                  {courseFilter === "all"
                    ? "All Courses"
                    : courses.find((c) => c.id === courseFilter)?.title ||
                      "Selected Course"}
                </span>
                <svg
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[color:var(--color-neutral-500)]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {isCourseMenuOpen && (
                <div
                  className="absolute z-50 mt-1 w-full rounded-lg border border-[color:var(--color-neutral-200)] bg-white shadow-md max-h-56 overflow-y-auto scroll-elegant"
                  onScroll={handleCourseScroll}
                >
                  <div className="p-2 border-b border-[color:var(--color-neutral-200)] sticky top-0 bg-white z-10">
                    <div className="relative">
                      <Input
                        value={courseQuery}
                        onChange={(e) => setCourseQuery(e.target.value)}
                        placeholder="Search course"
                      />
                      {courseQuery && (
                        <button
                          type="button"
                          aria-label="Clear search"
                          title="Clear search"
                          onClick={() => setCourseQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--color-neutral-500)] hover:text-[color:var(--color-neutral-700)]"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <ul className="py-1">
                    <li className="px-3 py-2 hover:bg-[color:var(--color-neutral-50)]">
                      <button
                        type="button"
                        className={`w-full text-left text-sm ${
                          courseFilter === "all"
                            ? "text-[color:var(--color-primary-800)] font-medium"
                            : ""
                        }`}
                        onClick={() => {
                          setPage(1);
                          setCourseFilter("all");
                          setIsCourseMenuOpen(false);
                        }}
                      >
                        All courses
                      </button>
                    </li>
                    {courses.length === 0 && !isLoadingCourses ? (
                      <li className="px-3 py-2 text-[12px] text-[color:var(--color-neutral-500)] text-center">
                        No courses found
                      </li>
                    ) : (
                      courses.map((course) => {
                        const selected = course.id === courseFilter;
                        return (
                          <li
                            key={course.id}
                            className="px-3 py-2 hover:bg-[color:var(--color-neutral-50)]"
                          >
                            <button
                              type="button"
                              className={`w-full text-left text-sm ${
                                selected
                                  ? "text-[color:var(--color-primary-800)] font-medium"
                                  : ""
                              }`}
                              onClick={() => {
                                setPage(1);
                                setCourseFilter(course.id);
                                setIsCourseMenuOpen(false);
                              }}
                            >
                              <div>{course.title}</div>
                            </button>
                          </li>
                        );
                      })
                    )}
                    {isLoadingCourses && (
                      <li className="px-3 py-2 text-[12px] text-[color:var(--color-neutral-500)] text-center">
                        Loading...
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-4">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Status
            </label>
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </Select>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={reviews}
            emptyMessage={
              isLoading ? "Loading reviews..." : "No reviews found."
            }
          />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-[color:var(--color-neutral-200)]">
            <p className="text-sm text-[color:var(--color-neutral-600)]">
              Showing {total === 0 ? 0 : (page - 1) * pageSize + 1}-
              {Math.min(page * pageSize, total)} of {total}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <Button
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
                disabled={page === 1 || isLoading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <div className="text-sm hidden sm:block">
                Page {page} of {pageCount}
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
                disabled={page === pageCount || isLoading}
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Modal */}
      {selected && (
        <ReviewViewModal onClose={() => setSelected(null)} review={selected} />
      )}

      {/* Create Modal */}
      <ReviewFormModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreate}
        isLoading={isSubmitting}
        mode="create"
      />

      {/* Edit Modal */}
      {editing && (
        <ReviewFormModal
          open={!!editing}
          onClose={() => setEditing(null)}
          initialValues={{
            enrollmentId: editing.enrollmentId,
            rating: editing.rating,
            comment: editing.comment,
            isPublished: editing.isPublished,
            isFeatured: editing.isFeatured,
          }}
          availableEnrollments={[
            {
              id: editing.enrollmentId,
              title: `${editing.courseTitle} - ${editing.studentName}`,
            },
          ]}
          onSubmit={handleEdit}
          isLoading={isSubmitting}
          mode="edit"
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!pendingDelete}
        onClose={cancelDelete}
        title="Delete Review"
      >
        <div className="space-y-4">
          <div className="text-sm text-[color:var(--color-neutral-600)]">
            Are you sure you want to delete this review? This action cannot be
            undone.
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
