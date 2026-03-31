"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import DateRangePicker from "@/components/ui/DateRangePicker";
import Select from "@/components/ui/Select";
import {
  CheckCircle2,
  XCircle,
  Pencil,
  Trash2,
  RotateCcw,
  BookOpen,
  Shield,
  GraduationCap,
  X,
} from "lucide-react";
import { toast } from "sonner";
import EnrollmentFormModal, {
  EnrollmentFormValues,
} from "./EnrollmentFormModal";
import { useRouter } from "next/navigation";
import { adminEnrollmentService } from "@/lib/services/admin/enrollment";
import { adminCourseService } from "@/lib/services/admin/course";
import { adminStudentService } from "@/lib/services/admin/student";
import {
  Enrollment as APIEnrollment,
  AdminEnrollmentFilterInput,
  EnrollmentStatus,
  CreationMethod,
} from "@/lib/services/admin/types";

type Enrollment = {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatarUrl: string;
  courseId: string;
  courseTitle: string;
  courseCategory: string;
  courseThumbnailUrl: string;
  enrolledAt: string; // YYYY-MM-DD (UTC)
  enrolledBy: "Self" | "Admin"; // Who enrolled the student
  status: "Active" | "Completed" | "Cancelled";
  progress: number; // 0-100
  amount: number;
};

function statusBadgeClass(status: Enrollment["status"]): string {
  const s = String(status).toLowerCase();
  if (s === "active")
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "completed") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-gray-50 text-gray-700 border-gray-200";
}

function enrolledByBadgeClass(enrolledBy: Enrollment["enrolledBy"]): string {
  const eb = String(enrolledBy).toLowerCase();
  if (eb === "self") return "bg-blue-50 text-blue-700 border-blue-200";
  if (eb === "admin") return "bg-purple-50 text-purple-700 border-purple-200";
  return "bg-gray-50 text-gray-700 border-gray-200";
}

export default function AdminEnrollmentsPage() {
  const router = useRouter();

  // API state
  const [enrollments, setEnrollments] = React.useState<Enrollment[]>([]);
  const [pagination, setPagination] = React.useState<{
    page: number;
    limit: number;
    total: number;
  } | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  // Filter options from API with scroll pagination
  const FILTER_PAGE_SIZE = 10;

  // Course filter state
  const [isCourseMenuOpen, setIsCourseMenuOpen] = React.useState(false);
  const courseMenuRef = React.useRef<HTMLDivElement>(null);
  const [courses, setCourses] = React.useState<
    Array<{ id: string; title: string; category: { name: string } }>
  >([]);
  const [courseQuery, setCourseQuery] = React.useState("");
  const [coursePage, setCoursePage] = React.useState(1);
  const [hasMoreCourses, setHasMoreCourses] = React.useState(true);
  const [isLoadingCourses, setIsLoadingCourses] = React.useState(false);

  // Student filter state
  const [isStudentMenuOpen, setIsStudentMenuOpen] = React.useState(false);
  const studentMenuRef = React.useRef<HTMLDivElement>(null);
  const [students, setStudents] = React.useState<
    Array<{ id: string; name: string; email: string }>
  >([]);
  const [studentQuery, setStudentQuery] = React.useState("");
  const [studentPage, setStudentPage] = React.useState(1);
  const [hasMoreStudents, setHasMoreStudents] = React.useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = React.useState(false);

  const [page, setPage] = React.useState(1);
  const pageSize = 10;
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "All" | Enrollment["status"]
  >("All");
  const [courseFilter, setCourseFilter] = React.useState<string>("all");
  const [studentFilter, setStudentFilter] = React.useState<string>("all");
  const [enrolledByFilter, setEnrolledByFilter] = React.useState<
    "All" | Enrollment["enrolledBy"]
  >("All");
  const [enrolledFrom, setEnrolledFrom] = React.useState<string>("");
  const [enrolledTo, setEnrolledTo] = React.useState<string>("");
  const [minProgress, setMinProgress] = React.useState<string>("");
  const [maxProgress, setMaxProgress] = React.useState<string>("");

  // Fetch enrollments from API
  const fetchEnrollments = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const filters: AdminEnrollmentFilterInput = {
        page,
        limit: pageSize,
        keyword: query || undefined,
        status:
          statusFilter === "All"
            ? undefined
            : statusFilter === "Active"
              ? EnrollmentStatus.ACTIVE
              : statusFilter === "Completed"
                ? EnrollmentStatus.COMPLETED
                : EnrollmentStatus.CANCELLED,
        creationMethod:
          enrolledByFilter === "All"
            ? undefined
            : enrolledByFilter === "Self"
              ? CreationMethod.AUTOMATIC
              : CreationMethod.MANUAL,
        startDate: enrolledFrom || undefined,
        endDate: enrolledTo || undefined,
        courseId: courseFilter !== "all" ? courseFilter : undefined,
        studentId: studentFilter !== "all" ? studentFilter : undefined,
        minProgressPercentage: minProgress ? parseInt(minProgress) : undefined,
        maxProgressPercentage: maxProgress ? parseInt(maxProgress) : undefined,
      };

      const response = await adminEnrollmentService.list(filters);
      if (response.success) {
        // Map API data to UI format
        const mappedData: Enrollment[] = response.data.data.map(
          (e: APIEnrollment) => ({
            id: e.id,
            studentId: e.student?.id || "",
            studentName: e.student
              ? `${e.student.firstName || ""} ${e.student.lastName || ""}`.trim() ||
                e.student?.email ||
                "N/A"
              : "N/A",
            studentEmail: e.student?.email || "N/A",
            studentAvatarUrl: e.student?.profilePictureKey
              ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${e.student.profilePictureKey}`
              : "",
            courseId: e.course?.id || "",
            courseTitle: e.course?.title || "N/A",
            courseCategory: e.course?.category?.name || "N/A",
            courseThumbnailUrl: e.course?.thumbnailKey
              ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${e.course.thumbnailKey}`
              : "",
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
          }),
        );
        setEnrollments(mappedData);
        setPagination(response.data.meta);
      }
    } catch (error) {
      console.error("Failed to fetch enrollments", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch enrollments",
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    pageSize,
    query,
    statusFilter,
    enrolledByFilter,
    enrolledFrom,
    enrolledTo,
    courseFilter,
    studentFilter,
    minProgress,
    maxProgress,
  ]);

  React.useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments, refreshKey]);

  // Fetch courses for filter with pagination
  const fetchCoursesForFilter = React.useCallback(
    async (page: number, search: string, reset = false) => {
      try {
        setIsLoadingCourses(true);
        const resp = await adminCourseService.list({
          page,
          limit: FILTER_PAGE_SIZE,
          keyword: search || undefined,
        });
        if (resp.success) {
          setCourses((prev) =>
            reset
              ? resp.data.data.map((c) => ({
                  id: c.id,
                  title: c.title,
                  category: { name: c.category.name },
                }))
              : [
                  ...prev,
                  ...resp.data.data.map((c) => ({
                    id: c.id,
                    title: c.title,
                    category: { name: c.category.name },
                  })),
                ],
          );
          const totalPages = Math.ceil(
            resp.data.meta.total / resp.data.meta.limit,
          );
          setHasMoreCourses(resp.data.meta.page < totalPages);
        }
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setIsLoadingCourses(false);
      }
    },
    [FILTER_PAGE_SIZE],
  );

  // Fetch students for filter with pagination
  const fetchStudentsForFilter = React.useCallback(
    async (page: number, search: string, reset = false) => {
      try {
        setIsLoadingStudents(true);
        const resp = await adminStudentService.list({
          page,
          limit: FILTER_PAGE_SIZE,
          keyword: search || undefined,
        });
        if (resp.success) {
          setStudents((prev) =>
            reset
              ? resp.data.data.map((s) => ({
                  id: s.id,
                  name:
                    `${s.firstName || ""} ${s.lastName || ""}`.trim() ||
                    s.email ||
                    "N/A",
                  email: s.email,
                }))
              : [
                  ...prev,
                  ...resp.data.data.map((s) => ({
                    id: s.id,
                    name:
                      `${s.firstName || ""} ${s.lastName || ""}`.trim() ||
                      s.email ||
                      "N/A",
                    email: s.email,
                  })),
                ],
          );
          const totalPages = Math.ceil(
            resp.data.meta.total / resp.data.meta.limit,
          );
          setHasMoreStudents(resp.data.meta.page < totalPages);
        }
      } catch (err) {
        console.error("Failed to fetch students", err);
      } finally {
        setIsLoadingStudents(false);
      }
    },
    [FILTER_PAGE_SIZE],
  );

  // Trigger course fetch when menu opens or search changes
  React.useEffect(() => {
    if (isCourseMenuOpen) {
      setCoursePage(1);
      fetchCoursesForFilter(1, courseQuery, true);
    }
  }, [isCourseMenuOpen, courseQuery, fetchCoursesForFilter]);

  // Trigger student fetch when menu opens or search changes
  React.useEffect(() => {
    if (isStudentMenuOpen) {
      setStudentPage(1);
      fetchStudentsForFilter(1, studentQuery, true);
    }
  }, [isStudentMenuOpen, studentQuery, fetchStudentsForFilter]);

  const total = pagination?.total || 0;
  const pageCount = pagination
    ? Math.ceil(pagination.total / pagination.limit)
    : 1;
  const currentPage = pagination?.page || 1;
  const start = (currentPage - 1) * (pagination?.limit || pageSize);
  const end = Math.min(start + (pagination?.limit || pageSize), total);
  const pagedEnrollments = enrollments;

  const nextPage = () => setPage((p) => Math.min(p + 1, pageCount));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));

  // Scroll handlers for infinite scroll
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

  // Click outside and keyboard handlers
  React.useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        isCourseMenuOpen &&
        courseMenuRef.current &&
        !courseMenuRef.current.contains(target)
      ) {
        setIsCourseMenuOpen(false);
      }
      if (
        isStudentMenuOpen &&
        studentMenuRef.current &&
        !studentMenuRef.current.contains(target)
      ) {
        setIsStudentMenuOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsCourseMenuOpen(false);
        setIsStudentMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isCourseMenuOpen, isStudentMenuOpen]);

  const [openCreate, setOpenCreate] = React.useState(false);
  const [editing, setEditing] = React.useState<Enrollment | null>(null);
  const [pendingDelete, setPendingDelete] = React.useState<Enrollment | null>(
    null,
  );

  const handleCreate = React.useCallback(
    async (values: EnrollmentFormValues) => {
      try {
        setIsSubmitting(true);
        const response = await adminEnrollmentService.create({
          studentId: values.studentId,
          courseId: values.courseId,
          status: values.status,
        });
        if (response.success) {
          toast.success("Enrollment created successfully");
          setOpenCreate(false);
          setRefreshKey((k) => k + 1);
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to create enrollment",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const handleEdit = React.useCallback(
    async (values: EnrollmentFormValues) => {
      if (!editing) return;
      try {
        setIsSubmitting(true);
        const response = await adminEnrollmentService.update({
          id: editing.id,
          studentId: values.studentId,
          courseId: values.courseId,
          status: values.status,
        });
        if (response.success) {
          toast.success("Enrollment updated successfully");
          setEditing(null);
          setRefreshKey((k) => k + 1);
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update enrollment",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [editing],
  );

  const handleDelete = React.useCallback((enrollment: Enrollment) => {
    setPendingDelete(enrollment);
  }, []);

  const confirmDelete = React.useCallback(async () => {
    if (!pendingDelete) return;
    try {
      const response = await adminEnrollmentService.delete(pendingDelete.id);
      if (response.success) {
        toast.error("Enrollment deleted successfully");
        setPendingDelete(null);
        setRefreshKey((k) => k + 1);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete enrollment",
      );
    }
  }, [pendingDelete]);

  const cancelDelete = React.useCallback(() => {
    setPendingDelete(null);
  }, []);

  const progressRangeValue = React.useMemo(() => {
    const minP = minProgress.trim();
    const maxP = maxProgress.trim();
    if (minP === "" && maxP === "") return "any";
    if (minP === "0" && maxP === "25") return "0-25";
    if (minP === "26" && maxP === "50") return "26-50";
    if (minP === "51" && maxP === "75") return "51-75";
    if (minP === "76" && maxP === "100") return "76-100";
    return "custom";
  }, [minProgress, maxProgress]);

  const columns: Array<DataTableColumn<Enrollment>> = [
    {
      id: "student",
      header: "Student",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div>
            <div className="font-medium">{row.studentName}</div>
            <div className="text-xs text-[color:var(--color-neutral-500)]">
              {row.studentEmail}
            </div>
          </div>
        </div>
      ),
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "course",
      header: "Course",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div>
            <div
              className="font-medium truncate max-w-[200px]"
              title={row.courseTitle}
            >
              {row.courseTitle}
            </div>
            <div className="text-xs text-[color:var(--color-neutral-500)]">
              {row.courseCategory}
            </div>
          </div>
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
      id: "enrolledBy",
      header: "Enrolled By",
      cell: (row) => (
        <Badge
          variant="outline"
          className={enrolledByBadgeClass(row.enrolledBy)}
        >
          <span className="inline-flex items-center gap-1">
            {row.enrolledBy === "Self" ? (
              <GraduationCap size={14} />
            ) : (
              <Shield size={14} />
            )}
            {row.enrolledBy}
          </span>
        </Badge>
      ),
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "progress",
      header: "Progress",
      accessor: (row) => `${row.progress}%`,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">{row.progress}%</span>
        </div>
      ),
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Badge variant="outline" className={statusBadgeClass(row.status)}>
          <span className="inline-flex items-center gap-1">
            {row.status === "Active" ? (
              <CheckCircle2 size={14} />
            ) : row.status === "Completed" ? (
              <BookOpen size={14} />
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
      id: "actions",
      header: "Actions",
      align: "center",
      cell: (row) => (
        <div className="flex items-center justify-center gap-2">
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
          <h1 className="text-xl sm:text-2xl font-semibold">Enrollments</h1>
        </div>
        <Button size="sm" onClick={() => setOpenCreate(true)}>
          Add Enrollment
        </Button>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* Row 1: Search, Date Range, Reset */}
          <div className="md:col-span-5">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Search
            </label>
            <Input
              placeholder="Search enrollments..."
              value={query}
              onChange={(e) => {
                setPage(1);
                setQuery(e.target.value);
              }}
            />
          </div>
          <div className="md:col-span-5">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Enrolled Date
            </label>
            <DateRangePicker
              value={{ from: enrolledFrom || null, to: enrolledTo || null }}
              onChange={(r) => {
                setPage(1);
                setEnrolledFrom(r.from || "");
                setEnrolledTo(r.to || "");
              }}
              placeholder="Enrolled date range"
            />
          </div>
          <div className="md:col-span-2 flex md:justify-end">
            <Button
              variant="secondary"
              size="md"
              className="w-full md:w-auto inline-flex items-center gap-2 text-primary-600 border-primary-200 hover:bg-primary-50"
              onClick={() => {
                setQuery("");
                setStatusFilter("All");
                setCourseFilter("all");
                setStudentFilter("all");
                setEnrolledByFilter("All");
                setEnrolledFrom("");
                setEnrolledTo("");
                setMinProgress("");
                setMaxProgress("");
                setPage(1);
              }}
            >
              <RotateCcw size={16} /> Reset
            </Button>
          </div>

          {/* Row 2: Status, Enrolled By, Course, Student, Progress */}
          <div className="md:col-span-2">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Status
            </label>
            <Select
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value as any);
              }}
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </Select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Enrolled By
            </label>
            <Select
              value={enrolledByFilter}
              onChange={(e) => {
                setPage(1);
                setEnrolledByFilter(e.target.value as any);
              }}
            >
              <option value="All">All types</option>
              <option value="Self">Self</option>
              <option value="Admin">Admin</option>
            </Select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Progress
            </label>
            <Select
              value={progressRangeValue}
              onChange={(e) => {
                const v = e.target.value;
                setPage(1);
                if (v === "any") {
                  setMinProgress("");
                  setMaxProgress("");
                } else if (v === "0-25") {
                  setMinProgress("0");
                  setMaxProgress("25");
                } else if (v === "26-50") {
                  setMinProgress("26");
                  setMaxProgress("50");
                } else if (v === "51-75") {
                  setMinProgress("51");
                  setMaxProgress("75");
                } else if (v === "76-100") {
                  setMinProgress("76");
                  setMaxProgress("100");
                }
              }}
            >
              <option value="any">All Progress</option>
              <option value="0-25">0-25%</option>
              <option value="26-50">26-50%</option>
              <option value="51-75">51-75%</option>
              <option value="76-100">76-100%</option>
            </Select>
          </div>
          <div className="md:col-span-3">
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
                  {studentFilter !== "all"
                    ? students.find((s) => s.id === studentFilter)?.name ||
                      "Select student"
                    : "All students"}
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
                          <X className="h-4 w-4" />
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
          <div className="md:col-span-3">
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
                  {courseFilter !== "all"
                    ? courses.find((c) => c.id === courseFilter)?.title ||
                      "Select course"
                    : "All courses"}
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
                          <X className="h-4 w-4" />
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
                              <div
                                className="truncate max-w-[200px]"
                                title={course.title}
                              >
                                {course.title}
                              </div>
                              <div className="text-xs text-[color:var(--color-neutral-500)]">
                                {course.category.name}
                              </div>
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
        </div>
      </div>

      <Card>
        <CardContent className="py-0">
          <DataTable<Enrollment>
            data={pagedEnrollments}
            columns={columns}
            getRowKey={(row) => row.id}
            emptyMessage={
              isLoading ? "Loading enrollments..." : "No enrollments found."
            }
            onRowClick={(row) => {
              router.push(`/admin/enrollments/${row.id}`);
            }}
          />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4">
            <p className="text-sm text-[color:var(--color-neutral-600)]">
              Showing {total === 0 ? 0 : start + 1}-{end} of {total}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <Button
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
                disabled={currentPage === 1}
                onClick={prevPage}
              >
                Previous
              </Button>
              <div className="text-sm sm:hidden">
                {currentPage}/{pageCount}
              </div>
              <div className="text-sm hidden sm:block">
                Page {currentPage} of {pageCount}
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
                disabled={currentPage === pageCount}
                onClick={nextPage}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal
        open={!!pendingDelete}
        onClose={cancelDelete}
        title={pendingDelete ? "Delete Enrollment" : undefined}
      >
        {pendingDelete && (
          <div className="space-y-4 text-sm">
            <div className="text-[color:var(--color-neutral-800)]">
              Are you sure you want to delete the enrollment for
              <span className="font-medium"> {pendingDelete.studentName} </span>
              in{" "}
              <span className="font-medium">{pendingDelete.courseTitle}</span>?
              This action cannot be undone.
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button
                variant="secondary"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <EnrollmentFormModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreate}
        title="Create Enrollment"
        mode="create"
        isLoading={isSubmitting}
      />
      <EnrollmentFormModal
        open={!!editing}
        onClose={() => setEditing(null)}
        onSubmit={handleEdit}
        title="Edit Enrollment"
        mode="edit"
        initialValues={
          editing
            ? {
                studentId: editing.studentId,
                courseId: editing.courseId,
                status:
                  editing.status === "Active"
                    ? "ACTIVE"
                    : editing.status === "Completed"
                      ? "COMPLETED"
                      : "CANCELLED",
              }
            : undefined
        }
        availableStudents={
          editing
            ? [
                {
                  id: editing.studentId,
                  firstName: editing.studentName,
                  email: editing.studentEmail,
                },
              ]
            : []
        }
        availableCourses={
          editing
            ? [
                {
                  id: editing.courseId,
                  title: editing.courseTitle,
                  category: { name: editing.courseCategory },
                },
              ]
            : []
        }
        isLoading={isSubmitting}
      />
    </div>
  );
}
