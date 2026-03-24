"use client";
import React from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { adminEnrollmentService } from "@/lib/services/admin/enrollment";
import { Star } from "lucide-react";

export type ReviewFormValues = {
  enrollmentId: string;
  rating: number;
  comment: string;
  isPublished: boolean;
  isFeatured: boolean;
};

type ReviewFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ReviewFormValues) => void;
  title?: string;
  mode?: "create" | "edit";
  initialValues?: Partial<ReviewFormValues>;
  availableEnrollments?: Array<{ id: string; title: string }>;
  isLoading?: boolean;
};

const DEFAULTS: ReviewFormValues = {
  enrollmentId: "",
  rating: 5,
  comment: "",
  isPublished: true,
  isFeatured: false,
};

export default function ReviewFormModal({
  open,
  onClose,
  onSubmit,
  title,
  mode = "create",
  initialValues,
  availableEnrollments = [],
  isLoading = false,
}: ReviewFormModalProps) {
  const [values, setValues] = React.useState<ReviewFormValues>({
    ...DEFAULTS,
    ...initialValues,
  });

  const [isEnrollmentMenuOpen, setIsEnrollmentMenuOpen] = React.useState(false);
  const enrollmentMenuRef = React.useRef<HTMLDivElement>(null);
  const [enrollmentQuery, setEnrollmentQuery] = React.useState("");
  const [enrollmentList, setEnrollmentList] = React.useState<
    Array<{ id: string; title: string }>
  >([]);
  const [enrollmentPage, setEnrollmentPage] = React.useState(1);
  const [hasMoreEnrollments, setHasMoreEnrollments] = React.useState(true);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = React.useState(false);

  const selectedEnrollment = React.useMemo(() => {
    const fromAvailable =
      availableEnrollments.find((e) => e.id === values.enrollmentId) || null;
    if (fromAvailable) return fromAvailable;
    return enrollmentList.find((e) => e.id === values.enrollmentId) || null;
  }, [availableEnrollments, enrollmentList, values.enrollmentId]);

  const fetchEnrollments = React.useCallback(
    async (page: number, search: string, reset = false) => {
      try {
        setIsLoadingEnrollments(true);
        const resp = await adminEnrollmentService.list({
          page,
          limit: 10,
          keyword: search || undefined,
        });
        if (resp.success) {
          const mapped = resp.data.data.map((enr) => {
            const courseTitle = enr.course?.title || "N/A";
            const student = enr.student;
            const studentName = student
              ? `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim() ||
                student.email ||
                "N/A"
              : "N/A";
            return {
              id: enr.id,
              title: `${courseTitle} - ${studentName}`,
            };
          });
          setEnrollmentList((prev) => (reset ? mapped : [...prev, ...mapped]));
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
    if (isEnrollmentMenuOpen) {
      setEnrollmentPage(1);
      fetchEnrollments(1, enrollmentQuery, true);
    }
  }, [isEnrollmentMenuOpen, enrollmentQuery, fetchEnrollments]);

  const handleEnrollmentScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMoreEnrollments &&
      !isLoadingEnrollments
    ) {
      const next = enrollmentPage + 1;
      setEnrollmentPage(next);
      fetchEnrollments(next, enrollmentQuery);
    }
  };

  React.useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (!isEnrollmentMenuOpen) return;
      if (
        enrollmentMenuRef.current &&
        !enrollmentMenuRef.current.contains(e.target as Node)
      ) {
        setIsEnrollmentMenuOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsEnrollmentMenuOpen(false);
    }
    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isEnrollmentMenuOpen]);

  React.useEffect(() => {
    if (open) {
      setValues({ ...DEFAULTS, ...initialValues });
    }
  }, [initialValues, open]);

  function handleChange<K extends keyof ReviewFormValues>(
    key: K,
    value: ReviewFormValues[K],
  ) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  function handleEnrollmentChange(enrollmentId: string) {
    const enrollment =
      availableEnrollments.find((e) => e.id === enrollmentId) ||
      enrollmentList.find((e) => e.id === enrollmentId);
    if (enrollment) {
      setValues((prev) => ({
        ...prev,
        enrollmentId,
      }));
      setIsEnrollmentMenuOpen(false);
      setEnrollmentQuery("");
    }
  }

  const disabled = !values.enrollmentId || isLoading;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title ?? (mode === "edit" ? "Edit Review" : "Create Review")}
    >
      <form
        onSubmit={handleFormSubmit}
        noValidate
        className="space-y-5 text-sm"
      >
        <div>
          <label className="block text-sm font-medium text-[color:var(--color-neutral-700)] mb-2">
            Enrollment
          </label>
          {mode === "edit" ? (
            <div className="h-11 w-full rounded-lg bg-[color:var(--color-neutral-50)] border border-[color:var(--color-neutral-200)] px-3 flex items-center text-[color:var(--color-neutral-500)]">
              <span className="truncate">
                {selectedEnrollment
                  ? selectedEnrollment.title
                  : "Unknown Enrollment"}
              </span>
            </div>
          ) : (
            <div className="relative" ref={enrollmentMenuRef}>
              <button
                type="button"
                className="h-11 w-full rounded-lg bg-white border pr-9 px-3 text-left text-[color:var(--foreground)] border-[color:var(--color-neutral-200)] focus:border-[color:var(--color-primary-400)] shadow-xs focus:shadow-sm transition-all"
                onClick={() => setIsEnrollmentMenuOpen((v) => !v)}
              >
                <span className="block truncate text-[color:var(--color-neutral-700)]">
                  {selectedEnrollment
                    ? selectedEnrollment.title
                    : "Select an enrollment"}
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
                    </div>
                  </div>
                  <ul className="py-1">
                    {enrollmentList.length === 0 && !isLoadingEnrollments ? (
                      <li className="px-3 py-2 text-[12px] text-[color:var(--color-neutral-500)] text-center">
                        No enrollments found
                      </li>
                    ) : (
                      enrollmentList.map((enrollment) => {
                        const selected = enrollment.id === values.enrollmentId;
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
                              onClick={() =>
                                handleEnrollmentChange(enrollment.id)
                              }
                            >
                              {enrollment.title}
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
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[color:var(--color-neutral-700)] mb-2">
            Rating
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`p-1 rounded-full transition-colors ${
                  values.rating >= star
                    ? "text-yellow-400"
                    : "text-[color:var(--color-neutral-300)]"
                }`}
                onClick={() => handleChange("rating", star)}
              >
                <Star size={24} fill="currentColor" />
              </button>
            ))}
            <span className="ml-2 text-sm text-[color:var(--color-neutral-500)]">
              {values.rating} / 5
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[color:var(--color-neutral-700)] mb-2">
            Comment
          </label>
          <textarea
            value={values.comment}
            onChange={(e) => handleChange("comment", e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-[color:var(--color-neutral-200)] p-3 text-sm focus:border-[color:var(--color-primary-400)] focus:outline-none focus:ring-1 focus:ring-[color:var(--color-primary-400)]"
            placeholder="Write your review comment here..."
          />
        </div>

        {mode === "edit" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Select
                label="Status"
                value={values.isPublished ? "Published" : "Unpublished"}
                onChange={(e) =>
                  handleChange("isPublished", e.target.value === "Published")
                }
              >
                <option value="Published">Published</option>
                <option value="Unpublished">Unpublished</option>
              </Select>
            </div>
            <div>
              <Select
                label="Featured"
                value={values.isFeatured ? "Yes" : "No"}
                onChange={(e) =>
                  handleChange("isFeatured", e.target.value === "Yes")
                }
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Select>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={disabled}>
            {mode === "edit" ? "Update" : "Create"} Review
          </Button>
        </div>
      </form>
    </Modal>
  );
}
