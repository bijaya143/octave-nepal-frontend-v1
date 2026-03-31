"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import DateRangePicker from "@/components/ui/DateRangePicker";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Pencil,
  Trash2,
  RotateCcw,
  X,
} from "lucide-react";
import { toast } from "sonner";
import CertificateFormModal, {
  CertificateFormValues,
} from "./CertificateFormModal";
import CertificateViewModal, { Certificate } from "./CertificateViewModal";
import { adminEnrollmentCertificateService } from "@/lib/services/admin/enrollment-certificate";
import { adminStudentService } from "@/lib/services/admin/student";
import { adminCourseService } from "@/lib/services/admin/course";
import { adminEnrollmentService } from "@/lib/services/admin/enrollment";
import {
  AdminEnrollmentCertificate,
  AdminEnrollmentCertificateFilterInput,
} from "@/lib/services/admin/types";

type UICertificate = Certificate & {
  updatedAt: string;
};

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = React.useState<UICertificate[]>([]);
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
  const [enrollmentFilter, setEnrollmentFilter] = React.useState<string>("all");

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

  // Enrollment filter dropdown
  const [isEnrollmentMenuOpen, setIsEnrollmentMenuOpen] = React.useState(false);
  const enrollmentMenuRef = React.useRef<HTMLDivElement>(null);
  const [enrollments, setEnrollments] = React.useState<
    Array<{ id: string; title: string }>
  >([]);
  const [enrollmentQuery, setEnrollmentQuery] = React.useState("");
  const [enrollmentPage, setEnrollmentPage] = React.useState(1);
  const [hasMoreEnrollments, setHasMoreEnrollments] = React.useState(true);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = React.useState(false);

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

  const fetchEnrollmentsForFilter = React.useCallback(
    async (page: number, search: string, reset = false) => {
      try {
        setIsLoadingEnrollments(true);
        const resp = await adminEnrollmentService.list({
          page,
          limit: 10,
          keyword: search || undefined,
        });
        if (resp.success) {
          const mapped = resp.data.data.map((e) => {
            const courseTitle = e.course?.title || "N/A";
            const student = e.student;
            const studentName = student
              ? `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim() ||
                student.email ||
                "N/A"
              : "N/A";
            return {
              id: e.id,
              title: `${courseTitle} - ${studentName}`,
            };
          });
          setEnrollments((prev) => (reset ? mapped : [...prev, ...mapped]));
          const totalPages = Math.ceil(
            resp.data.meta.total / resp.data.meta.limit,
          );
          setHasMoreEnrollments(resp.data.meta.page < totalPages);
        }
      } catch (err) {
      } finally {
        setIsLoadingEnrollments(false);
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

  React.useEffect(() => {
    if (isEnrollmentMenuOpen) {
      setEnrollmentPage(1);
      fetchEnrollmentsForFilter(1, enrollmentQuery, true);
    }
  }, [isEnrollmentMenuOpen, enrollmentQuery, fetchEnrollmentsForFilter]);

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

  const handleEnrollmentScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMoreEnrollments &&
      !isLoadingEnrollments
    ) {
      const next = enrollmentPage + 1;
      setEnrollmentPage(next);
      fetchEnrollmentsForFilter(next, enrollmentQuery);
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
      if (
        isEnrollmentMenuOpen &&
        enrollmentMenuRef.current &&
        !enrollmentMenuRef.current.contains(e.target as Node)
      ) {
        setIsEnrollmentMenuOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsStudentMenuOpen(false);
        setIsCourseMenuOpen(false);
        setIsEnrollmentMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isStudentMenuOpen, isCourseMenuOpen, isEnrollmentMenuOpen]);

  const fetchCertificates = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const filters: AdminEnrollmentCertificateFilterInput = {
        page,
        limit: pageSize,
        keyword: query || undefined,
        startDate: createdFrom || undefined,
        endDate: createdTo || undefined,
        studentId: studentFilter !== "all" ? studentFilter : undefined,
        courseId: courseFilter !== "all" ? courseFilter : undefined,
        enrollmentId: enrollmentFilter !== "all" ? enrollmentFilter : undefined,
      };
      const resp = await adminEnrollmentCertificateService.list(filters);
      if (resp.success) {
        const mapped: UICertificate[] = resp.data.data.map(
          (c: AdminEnrollmentCertificate) => {
            const enrollment = c.enrollment || null;
            const student = enrollment?.student || null;
            const course = enrollment?.course || null;
            const studentName = student
              ? `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim() ||
                student.email ||
                "N/A"
              : "N/A";
            const courseTitle = course?.title || "N/A";
            const issuedDate = c.certifiedAt
              ? new Date(c.certifiedAt).toISOString().split("T")[0]
              : c.createdAt
                ? new Date(c.createdAt).toISOString().split("T")[0]
                : "";
            const createdAt = c.createdAt
              ? new Date(c.createdAt).toISOString().split("T")[0]
              : "";
            const updatedAt = c.updatedAt
              ? new Date(c.updatedAt).toISOString().split("T")[0]
              : "";
            const createdBy = c.createdBy
              ? `${c.createdBy.firstName ?? ""} ${c.createdBy.lastName ?? ""}`.trim() ||
                c.createdBy.email ||
                "N/A"
              : "N/A";
            const creationMethod =
              c.creationMethod === "AUTOMATIC"
                ? "Automatic"
                : c.creationMethod === "MANUAL"
                  ? "Manual"
                  : c.creationMethod
                    ? String(c.creationMethod)
                    : undefined;
            return {
              id: c.id,
              title: c.title,
              enrollmentId: enrollment?.id || "",
              studentName,
              courseTitle,
              issuedDate,
              certifiedAt: c.certifiedAt
                ? new Date(c.certifiedAt).toISOString().split("T")[0]
                : undefined,
              createdAt,
              updatedAt,
              isPublished: c.isPublished ?? false,
              certificateKey: c.certificateKey,
              enrollmentCertificateId: c.enrollmentCertificateId,
              isDownloaded: c.isDownloaded ?? false,
              createdBy,
              creationMethod,
            };
          },
        );
        setCertificates(mapped);
        setPagination(resp.data.meta);
      }
    } catch (err) {
      toast.error("Failed to fetch certificates");
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
    enrollmentFilter,
  ]);

  React.useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates, refreshKey]);

  const total = pagination?.total || 0;
  const pageCount = pagination
    ? Math.ceil(pagination.total / pagination.limit)
    : 1;
  const currentPage = pagination?.page || 1;
  const start = (currentPage - 1) * (pagination?.limit || pageSize);
  const end = Math.min(start + (pagination?.limit || pageSize), total);
  const pagedCertificates = certificates;

  const nextPage = () => setPage((p) => Math.min(p + 1, pageCount));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));

  const [selected, setSelected] = React.useState<UICertificate | null>(null);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [editing, setEditing] = React.useState<UICertificate | null>(null);
  const [pendingDelete, setPendingDelete] =
    React.useState<UICertificate | null>(null);

  const handleCreate = async (values: CertificateFormValues) => {
    try {
      setIsSubmitting(true);
      await adminEnrollmentCertificateService.create({
        title: values.title,
        enrollmentId: values.enrollmentId,
        certifiedAt: values.certifiedAt || undefined,
        isPublished: values.isPublished,
        certificate: values.certificate || undefined,
      });
      toast.success("Certificate created successfully");
      setOpenCreate(false);
      setRefreshKey((k) => k + 1);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create certificate",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (values: CertificateFormValues) => {
    if (!editing) return;
    try {
      setIsSubmitting(true);
      await adminEnrollmentCertificateService.update({
        id: editing.id,
        title: values.title,
        enrollmentId: values.enrollmentId,
        certifiedAt: values.certifiedAt || undefined,
        isPublished: values.isPublished,
        certificate: values.certificate || undefined,
      });
      toast.success("Certificate updated successfully");
      setEditing(null);
      setRefreshKey((k) => k + 1);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update certificate",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (certificate: UICertificate) => {
    setPendingDelete(certificate);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      const resp = await adminEnrollmentCertificateService.delete(
        pendingDelete.id,
      );
      if (resp.success) {
        toast.success("Certificate deleted successfully");
        setPendingDelete(null);
        setRefreshKey((k) => k + 1);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete certificate",
      );
    }
  };

  const cancelDelete = () => {
    setPendingDelete(null);
  };

  const columns: Array<DataTableColumn<UICertificate>> = [
    {
      id: "title",
      header: "Title",
      accessor: "title",
      cellClassName: "whitespace-nowrap",
    },
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
      id: "issuedDate",
      header: "Issued",
      accessor: "issuedDate",
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
          <h1 className="text-xl sm:text-2xl font-semibold">Certificates</h1>
        </div>
        <Button size="sm" onClick={() => setOpenCreate(true)}>
          Add Certificate
        </Button>
      </div>

      <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-5">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Search
            </label>
            <Input
              placeholder="Search certificates..."
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
                setEnrollmentFilter("all");
                setPage(1);
              }}
            >
              <RotateCcw size={16} /> Reset
            </Button>
          </div>

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

          <div className="md:col-span-4">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Enrollment
            </label>
            <div className="relative" ref={enrollmentMenuRef}>
              <button
                type="button"
                className="h-11 w-full rounded-lg bg-white border pr-9 px-3 text-left text-[color:var(--foreground)] border-[color:var(--color-neutral-200)] focus:border-[color:var(--color-primary-400)] shadow-xs focus:shadow-sm transition-all"
                onClick={() => setIsEnrollmentMenuOpen((v) => !v)}
              >
                <span className="block truncate text-[color:var(--color-neutral-700)]">
                  {enrollmentFilter !== "all"
                    ? enrollments.find((e) => e.id === enrollmentFilter)
                        ?.title || "Select enrollment"
                    : "All enrollments"}
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
              {isEnrollmentMenuOpen && (
                <div
                  className="absolute z-50 mt-1 w-full rounded-lg border border-[color:var(--color-neutral-200)] bg-white shadow-md max-h-56 overflow-y-auto scroll-elegant"
                  onScroll={handleEnrollmentScroll}
                >
                  <div className="p-2 border-b border-[color:var(--color-neutral-200)] sticky top-0 bg-white z-10">
                    <div className="relative">
                      <Input
                        value={enrollmentQuery}
                        onChange={(e) => setEnrollmentQuery(e.target.value)}
                        placeholder="Search enrollment"
                      />
                      {enrollmentQuery && (
                        <button
                          type="button"
                          aria-label="Clear search"
                          title="Clear search"
                          onClick={() => setEnrollmentQuery("")}
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
                          enrollmentFilter === "all"
                            ? "text-[color:var(--color-primary-800)] font-medium"
                            : ""
                        }`}
                        onClick={() => {
                          setPage(1);
                          setEnrollmentFilter("all");
                          setIsEnrollmentMenuOpen(false);
                        }}
                      >
                        All enrollments
                      </button>
                    </li>
                    {enrollments.length === 0 && !isLoadingEnrollments ? (
                      <li className="px-3 py-2 text-[12px] text-[color:var(--color-neutral-500)] text-center">
                        No enrollments found
                      </li>
                    ) : (
                      enrollments.map((enrollment) => {
                        const selected = enrollment.id === enrollmentFilter;
                        return (
                          <li
                            key={enrollment.id}
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
                                setEnrollmentFilter(enrollment.id);
                                setIsEnrollmentMenuOpen(false);
                              }}
                            >
                              <div>{enrollment.title}</div>
                            </button>
                          </li>
                        );
                      })
                    )}
                    {isLoadingEnrollments && (
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
          <DataTable<UICertificate>
            data={pagedCertificates}
            columns={columns}
            getRowKey={(row) => row.id}
            emptyMessage={
              isLoading ? "Loading certificates..." : "No certificates found."
            }
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
                disabled={currentPage === 1 || isLoading}
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
                disabled={currentPage === pageCount || isLoading}
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
        title={pendingDelete ? "Delete Certificate" : undefined}
      >
        {pendingDelete && (
          <div className="space-y-4 text-sm">
            <div className="text-[color:var(--color-neutral-800)]">
              Are you sure you want to delete
              <span className="font-medium"> {pendingDelete.title} </span>? This
              action cannot be undone.
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

      <CertificateViewModal
        certificate={selected}
        onClose={() => setSelected(null)}
      />

      <CertificateFormModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreate}
        title="Create Certificate"
        mode="create"
        isLoading={isSubmitting}
      />

      <CertificateFormModal
        open={!!editing}
        onClose={() => setEditing(null)}
        onSubmit={handleEdit}
        title="Edit Certificate"
        mode="edit"
        initialValues={
          editing
            ? {
                title: editing.title,
                enrollmentId: editing.enrollmentId,
                certifiedAt: editing.certifiedAt,
                isPublished: editing.isPublished,
              }
            : undefined
        }
        initialCertificateUrl={
          editing && editing.certificateKey
            ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${editing.certificateKey}`
            : undefined
        }
        availableEnrollments={
          editing
            ? [
                {
                  id: editing.enrollmentId,
                  title: `${editing.courseTitle} - ${editing.studentName}`,
                },
              ]
            : []
        }
        isLoading={isSubmitting}
      />
    </div>
  );
}
