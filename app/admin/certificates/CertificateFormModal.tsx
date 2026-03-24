"use client";
import React from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { adminEnrollmentService } from "@/lib/services/admin/enrollment";

export type CertificateFormValues = {
  title: string;
  enrollmentId: string;
  certifiedAt?: string;
  isPublished?: boolean;
  certificate?: File | null;
};

type CertificateFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CertificateFormValues) => void;
  title?: string;
  mode?: "create" | "edit";
  initialValues?: Partial<CertificateFormValues>;
  initialCertificateUrl?: string;
  availableEnrollments?: Array<{ id: string; title: string }>;
  isLoading?: boolean;
};

const DEFAULTS: CertificateFormValues = {
  title: "",
  enrollmentId: "",
  certifiedAt: "",
  isPublished: true,
  certificate: null,
};

export default function CertificateFormModal({
  open,
  onClose,
  onSubmit,
  title,
  mode = "create",
  initialValues,
  initialCertificateUrl,
  availableEnrollments = [],
  isLoading = false,
}: CertificateFormModalProps) {
  const [values, setValues] = React.useState<CertificateFormValues>({
    ...DEFAULTS,
    ...initialValues,
  });

  const [isEnrollmentMenuOpen, setIsEnrollmentMenuOpen] = React.useState(false);
  const enrollmentMenuRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string>("");
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
      setPreviewUrl(initialCertificateUrl || "");
    }
  }, [initialValues, initialCertificateUrl, open]);

  function handleChange<K extends keyof CertificateFormValues>(
    key: K,
    value: CertificateFormValues[K],
  ) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setValues((prev) => ({ ...prev, certificate: file }));
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(
      file && file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
    );
  }

  function clearFile() {
    setValues((prev) => ({ ...prev, certificate: null }));
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
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

  const disabled = !values.title || !values.enrollmentId || isLoading;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        title ?? (mode === "edit" ? "Edit Certificate" : "Create Certificate")
      }
    >
      <form
        onSubmit={handleFormSubmit}
        noValidate
        className="space-y-5 text-sm"
      >
        <div>
          <Input
            label="Title"
            value={values.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Certificate title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[color:var(--color-neutral-700)] mb-2">
            Enrollment
          </label>
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Input
              label="Certified At"
              type="date"
              value={values.certifiedAt || ""}
              onChange={(e) => handleChange("certifiedAt", e.target.value)}
              placeholder="YYYY-MM-DD"
            />
          </div>
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
        </div>

        <div className="rounded-lg border border-dashed border-[color:var(--color-neutral-300)] bg-[color:var(--color-neutral-50)] p-3">
          <label
            htmlFor="certificate-file-input"
            className="block text-xs text-[color:var(--color-neutral-600)] mb-2"
          >
            Certificate File
          </label>
          <div className="flex items-center gap-3">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="h-20 w-20 rounded-lg object-cover ring-1 ring-[color:var(--color-neutral-200)]"
              />
            ) : values.certificate && !previewUrl ? (
              <div className="h-20 w-20 flex items-center justify-center rounded-lg bg-white text-[color:var(--color-neutral-600)] ring-1 ring-[color:var(--color-neutral-200)] font-mono text-xs">
                PDF
              </div>
            ) : (
              <div className="h-20 w-20 flex items-center justify-center rounded-lg bg-white text-[color:var(--color-neutral-400)] ring-1 ring-[color:var(--color-neutral-200)]">
                No file
              </div>
            )}
            <div className="flex-1">
              <p className="text-xs text-[color:var(--color-neutral-600)]">
                Upload a certificate file.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="certificate-file-input"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse
                </Button>
                {values.certificate && (
                  <Button
                    type="button"
                    variant="secondary"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={clearFile}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <p className="mt-1 text-[10px] text-[color:var(--color-neutral-500)]">
                PNG/JPG image or PDF. Max ~2MB.
              </p>
              {values.certificate && (
                <p className="mt-1 text-[10px] text-[color:var(--color-neutral-600)] truncate">
                  {values.certificate.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={disabled}>
            {mode === "edit" ? "Update" : "Create"} Certificate
          </Button>
        </div>
      </form>
    </Modal>
  );
}
