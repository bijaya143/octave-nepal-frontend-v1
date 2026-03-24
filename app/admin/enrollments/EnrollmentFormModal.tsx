"use client";
import React from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { X } from "lucide-react";
import { adminStudentService } from "@/lib/services/admin/student";
import { adminCourseService } from "@/lib/services/admin/course";
import { Student, Course, EnrollmentStatus } from "@/lib/services/admin/types";

export type EnrollmentFormValues = {
  studentId: string;
  courseId: string;
  status: EnrollmentStatus | string;
};

type EnrollmentFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: EnrollmentFormValues) => void;
  title?: string;
  mode?: "create" | "edit";
  initialValues?: Partial<EnrollmentFormValues>;
  availableStudents?: Array<{
    id: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    email?: string;
    profilePictureKey?: string;
  }>;
  availableCourses?: Array<{
    id: string;
    title: string;
    category?: { name?: string };
  }>;
  isLoading?: boolean;
};

const DEFAULTS: EnrollmentFormValues = {
  studentId: "",
  courseId: "",
  status: EnrollmentStatus.ACTIVE,
};

const STUDENT_PAGE_SIZE = 10;
const COURSE_PAGE_SIZE = 10;

export default function EnrollmentFormModal({
  open,
  onClose,
  onSubmit,
  title,
  mode = "create",
  initialValues,
  availableStudents = [],
  availableCourses = [],
  isLoading,
}: EnrollmentFormModalProps) {
  const [values, setValues] = React.useState<EnrollmentFormValues>(DEFAULTS);

  // Student searchable dropdown state
  const [isStudentMenuOpen, setIsStudentMenuOpen] = React.useState(false);
  const studentMenuRef = React.useRef<HTMLDivElement>(null);
  const [studentList, setStudentList] = React.useState<Student[]>([]);
  const [studentQuery, setStudentQuery] = React.useState("");
  const [studentPage, setStudentPage] = React.useState(1);
  const [hasMoreStudents, setHasMoreStudents] = React.useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = React.useState(false);

  const selectedStudent = React.useMemo(() => {
    const fromAvailable =
      availableStudents.find((s) => s.id === values.studentId) || null;
    if (fromAvailable) return fromAvailable as Student;
    return (
      (studentList.find((s) => s.id === values.studentId) as Student) || null
    );
  }, [availableStudents, studentList, values.studentId]);

  const fetchStudents = React.useCallback(
    async (page: number, search: string, reset = false) => {
      try {
        setIsLoadingStudents(true);
        const resp = await adminStudentService.list({
          page,
          limit: STUDENT_PAGE_SIZE,
          keyword: search || undefined,
        });
        if (resp.success) {
          setStudentList((prev) =>
            reset ? resp.data.data : [...prev, ...resp.data.data],
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
    [],
  );

  React.useEffect(() => {
    if (isStudentMenuOpen) {
      setStudentPage(1);
      fetchStudents(1, studentQuery, true);
    }
  }, [isStudentMenuOpen, studentQuery, fetchStudents]);

  const handleStudentScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMoreStudents &&
      !isLoadingStudents
    ) {
      const next = studentPage + 1;
      setStudentPage(next);
      fetchStudents(next, studentQuery);
    }
  };

  // Course searchable dropdown state
  const [isCourseMenuOpen, setIsCourseMenuOpen] = React.useState(false);
  const courseMenuRef = React.useRef<HTMLDivElement>(null);
  const [courseList, setCourseList] = React.useState<Course[]>([]);
  const [courseQuery, setCourseQuery] = React.useState("");
  const [coursePage, setCoursePage] = React.useState(1);
  const [hasMoreCourses, setHasMoreCourses] = React.useState(true);
  const [isLoadingCourses, setIsLoadingCourses] = React.useState(false);

  const selectedCourse = React.useMemo(() => {
    const fromAvailable =
      availableCourses.find((c) => c.id === values.courseId) || null;
    if (fromAvailable) return fromAvailable as any as Course;
    return (courseList.find((c) => c.id === values.courseId) as Course) || null;
  }, [availableCourses, courseList, values.courseId]);

  const fetchCourses = React.useCallback(
    async (page: number, search: string, reset = false) => {
      try {
        setIsLoadingCourses(true);
        const resp = await adminCourseService.list({
          page,
          limit: COURSE_PAGE_SIZE,
          keyword: search || undefined,
        });
        if (resp.success) {
          setCourseList((prev) =>
            reset ? resp.data.data : [...prev, ...resp.data.data],
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
    [],
  );

  React.useEffect(() => {
    if (isCourseMenuOpen) {
      setCoursePage(1);
      fetchCourses(1, courseQuery, true);
    }
  }, [isCourseMenuOpen, courseQuery, fetchCourses]);

  const handleCourseScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMoreCourses &&
      !isLoadingCourses
    ) {
      const next = coursePage + 1;
      setCoursePage(next);
      fetchCourses(next, courseQuery);
    }
  };

  React.useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        isStudentMenuOpen &&
        studentMenuRef.current &&
        !studentMenuRef.current.contains(target)
      )
        setIsStudentMenuOpen(false);
      if (
        isCourseMenuOpen &&
        courseMenuRef.current &&
        !courseMenuRef.current.contains(target)
      )
        setIsCourseMenuOpen(false);
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

  React.useEffect(() => {
    if (open) {
      setValues({ ...DEFAULTS, ...initialValues });
    }
  }, [initialValues, open]);

  function handleChange<K extends keyof EnrollmentFormValues>(
    key: K,
    value: EnrollmentFormValues[K],
  ) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  const disabled = !values.studentId || !values.courseId || isLoading;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        title ?? (mode === "edit" ? "Edit Enrollment" : "Create Enrollment")
      }
    >
      <form
        onSubmit={handleFormSubmit}
        noValidate
        className="space-y-5 text-sm"
      >
        {/* Student Selection */}
        <div>
          <label className="block text-sm font-medium text-[color:var(--color-neutral-700)] mb-2">
            Student
          </label>
          <div className="relative" ref={studentMenuRef}>
            <button
              type="button"
              className="h-11 w-full rounded-lg bg-white border pr-9 px-3 text-left text-[color:var(--foreground)] border-[color:var(--color-neutral-200)] focus:border-[color:var(--color-primary-400)] shadow-xs focus:shadow-sm transition-all"
              onClick={() => setIsStudentMenuOpen((v) => !v)}
            >
              <span className="block truncate text-[color:var(--color-neutral-700)]">
                {selectedStudent
                  ? `${selectedStudent.firstName ?? ""} ${
                      selectedStudent.middleName
                        ? selectedStudent.middleName + " "
                        : ""
                    }${selectedStudent.lastName ?? ""}${
                      selectedStudent.email ? ` (${selectedStudent.email})` : ""
                    }`.trim() ||
                    selectedStudent.email ||
                    "Select a student"
                  : "Select a student"}
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
                  {studentList.length === 0 && !isLoadingStudents ? (
                    <li className="px-3 py-2 text-[12px] text-[color:var(--color-neutral-500)] text-center">
                      No students found
                    </li>
                  ) : (
                    studentList.map((student) => {
                      const selected = student.id === values.studentId;
                      return (
                        <li
                          key={student.id}
                          className="px-3 py-2 hover:bg-[color:var(--color-neutral-50)]"
                        >
                          <button
                            type="button"
                            className={`w-full flex items-center gap-2 text-left text-sm ${
                              selected
                                ? "text-[color:var(--color-primary-800)] font-medium"
                                : ""
                            }`}
                            onClick={() => {
                              handleChange("studentId", student.id);
                              setIsStudentMenuOpen(false);
                            }}
                          >
                            <Avatar
                              src={
                                student.profilePictureKey
                                  ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${student.profilePictureKey}`
                                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                      `${student.firstName} ${student.lastName}`,
                                    )}&background=random`
                              }
                              alt={student.firstName || ""}
                              width={24}
                              height={24}
                              className="h-6 w-6 rounded-full"
                            />
                            <span>
                              {(student.firstName ?? "") +
                                (student.middleName
                                  ? " " + student.middleName
                                  : "") +
                                (student.lastName
                                  ? " " + student.lastName
                                  : "")}
                            </span>
                            {student.email && (
                              <span className="text-[color:var(--color-neutral-500)]">
                                ({student.email})
                              </span>
                            )}
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

        {/* Course Selection */}
        <div>
          <label className="block text-sm font-medium text-[color:var(--color-neutral-700)] mb-2">
            Course
          </label>
          <div className="relative" ref={courseMenuRef}>
            <button
              type="button"
              className="h-11 w-full rounded-lg bg-white border pr-9 px-3 text-left text-[color:var(--foreground)] border-[color:var(--color-neutral-200)] focus:border-[color:var(--color-primary-400)] shadow-xs focus:shadow-sm transition-all"
              onClick={() => setIsCourseMenuOpen((v) => !v)}
            >
              <span className="block truncate text-[color:var(--color-neutral-700)]">
                {selectedCourse
                  ? `${selectedCourse.title}${
                      selectedCourse.category?.name
                        ? ` (${selectedCourse.category.name})`
                        : ""
                    }`
                  : "Select a course"}
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
                  {courseList.length === 0 && !isLoadingCourses ? (
                    <li className="px-3 py-2 text-[12px] text-[color:var(--color-neutral-500)] text-center">
                      No courses found
                    </li>
                  ) : (
                    courseList.map((course) => {
                      const selected = course.id === values.courseId;
                      return (
                        <li
                          key={course.id}
                          className="px-3 py-2 hover:bg-[color:var(--color-neutral-50)]"
                        >
                          <button
                            type="button"
                            className={`w-full flex items-center gap-2 text-left text-sm ${
                              selected
                                ? "text-[color:var(--color-primary-800)] font-medium"
                                : ""
                            }`}
                            onClick={() => {
                              handleChange("courseId", course.id);
                              setIsCourseMenuOpen(false);
                            }}
                          >
                            <span>{course.title}</span>
                            <span className="text-[color:var(--color-neutral-500)]">
                              ({course.category.name})
                            </span>
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

        {/* Status */}
        <div>
          <Select
            label="Status"
            value={values.status}
            onChange={(e) =>
              handleChange(
                "status",
                e.target.value as EnrollmentFormValues["status"],
              )
            }
          >
            <option value={EnrollmentStatus.ACTIVE}>Active</option>
            <option value={EnrollmentStatus.COMPLETED}>Completed</option>
            <option value={EnrollmentStatus.CANCELLED}>Cancelled</option>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={disabled}>
            {mode === "edit" ? "Update" : "Create"} Enrollment
          </Button>
        </div>
      </form>
    </Modal>
  );
}
