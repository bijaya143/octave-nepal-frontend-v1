"use client";
import React from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { Upload, X } from "lucide-react";
import { adminEnrollmentService } from "@/lib/services/admin/enrollment";
import { PaymentMethod, PaymentStatus } from "@/lib/services/admin/types";

async function fetchFileFromUrl(url: string): Promise<File> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.status}`);
  }
  const blob = await response.blob();
  const contentType =
    response.headers.get("Content-Type") ||
    blob.type ||
    "application/octet-stream";
  let filename = "receipt";
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;
    const parts = pathname.split("/");
    const last = parts[parts.length - 1];
    if (last) {
      filename = decodeURIComponent(last);
    }
  } catch {
    const parts = url.split("/");
    const last = parts[parts.length - 1];
    if (last) {
      filename = last.split("?")[0];
    }
  }
  return new File([blob], filename, { type: contentType });
}

export type PaymentFormValues = {
  enrollmentId: string;
  enrollmentTitle: string;
  amount: number | "";
  paidAt: string;
  status: PaymentStatus;
  method: PaymentMethod;
  paymentCreatedType: "automatic" | "manual";
  transactionId: string;
  files: File[];
  remarks: string;
};

type PaymentFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: PaymentFormValues) => void;
  title?: string;
  mode?: "create" | "edit";
  initialValues?: Partial<PaymentFormValues>;
  availableEnrollments?: Array<{ id: string; title: string; amount?: number }>;
  initialReceiptUrls?: string[];
  isLoading?: boolean;
};

const DEFAULTS: PaymentFormValues = {
  enrollmentId: "",
  enrollmentTitle: "",
  amount: "",
  paidAt: "",
  status: PaymentStatus.PAID,
  method: PaymentMethod.WALLET,
  paymentCreatedType: "manual",
  transactionId: "",
  files: [],
  remarks: "",
};

function labelForStatus(s: PaymentStatus) {
  if (s === PaymentStatus.PAID) return "Paid";
  if (s === PaymentStatus.PENDING) return "Pending";
  if (s === PaymentStatus.FAILED) return "Failed";
  if (s === PaymentStatus.REFUNDED) return "Refunded";
  return String(s);
}

function labelForMethod(m: PaymentMethod) {
  if (m === PaymentMethod.WALLET) return "Wallet";
  if (m === PaymentMethod.QR) return "QR";
  if (m === PaymentMethod.BANK_TRANSFER) return "Bank Transfer";
  if (m === PaymentMethod.ONLINE_BANKING) return "Online Banking";
  if (m === PaymentMethod.CARD) return "Card";
  if (m === PaymentMethod.OTHER) return "Other";
  return String(m);
}

export default function PaymentFormModal({
  open,
  onClose,
  onSubmit,
  title,
  mode = "create",
  initialValues,
  availableEnrollments = [],
  initialReceiptUrls = [],
  isLoading,
}: PaymentFormModalProps) {
  const [values, setValues] = React.useState<PaymentFormValues>({
    ...DEFAULTS,
    ...initialValues,
  });
  const [filePreviews, setFilePreviews] = React.useState<{
    [key: number]: string;
  }>({});
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [existingReceiptUrls, setExistingReceiptUrls] =
    React.useState<string[]>(initialReceiptUrls);
  const [existingFilesBinary, setExistingFilesBinary] = React.useState<File[]>(
    [],
  );
  const [isLoadingExistingFiles, setIsLoadingExistingFiles] =
    React.useState(false);
  const [existingFilesError, setExistingFilesError] = React.useState<
    string | null
  >(null);
  const [activeTab, setActiveTab] = React.useState<
    "details" | "files" | "status"
  >("details");
  const originalPaidAtRef = React.useRef<string>("");
  const [paidAtTouched, setPaidAtTouched] = React.useState(false);
  const tabs = React.useMemo(
    () =>
      [
        { key: "details", label: "Details" },
        { key: "files", label: "Files" },
        { key: "status", label: "Status" },
      ] as const,
    [],
  );

  // Enrollment searchable dropdown
  const [isEnrollmentMenuOpen, setIsEnrollmentMenuOpen] = React.useState(false);
  const enrollmentMenuRef = React.useRef<HTMLDivElement>(null);
  const [enrollmentQuery, setEnrollmentQuery] = React.useState("");
  const [enrollmentList, setEnrollmentList] = React.useState<
    Array<{ id: string; title: string; amount?: number }>
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
          const mapped = resp.data.data.map((enr) => ({
            id: enr.id,
            title:
              (enr.course?.title || "N/A") +
              " - " +
              (enr.student
                ? `${enr.student.firstName ?? ""} ${
                    enr.student.lastName ?? ""
                  }`.trim() ||
                  enr.student.email ||
                  "N/A"
                : "N/A"),
            amount: enr.amount,
          }));
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

  const initialValuesJson = JSON.stringify(initialValues);
  const initialReceiptUrlsJson = JSON.stringify(initialReceiptUrls);

  React.useEffect(() => {
    const defaults = { ...DEFAULTS };
    // Set default paidAt to current date/time for new payments
    if (mode === "create" && !initialValues?.paidAt) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      defaults.paidAt = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    const normalizedInitial = { ...initialValues };
    if (initialValues?.paidAt) {
      originalPaidAtRef.current = initialValues.paidAt;
    }
    setValues({ ...defaults, ...normalizedInitial });

    // Update existing receipts
    if (initialReceiptUrls) {
      setExistingReceiptUrls(initialReceiptUrls);
    }

    setActiveTab("details");

    // Create previews for existing image files (for edit mode)
    if (initialValues?.files) {
      initialValues.files.forEach((file, index) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            setFilePreviews((prev) => ({ ...prev, [index]: result }));
          };
          reader.readAsDataURL(file);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValuesJson, open, initialReceiptUrlsJson, mode]);

  React.useEffect(() => {
    let cancelled = false;
    async function loadExistingFiles() {
      if (mode !== "edit") {
        setExistingFilesBinary([]);
        setExistingFilesError(null);
        setIsLoadingExistingFiles(false);
        return;
      }
      if (!initialReceiptUrls || initialReceiptUrls.length === 0) {
        setExistingFilesBinary([]);
        setExistingFilesError(null);
        setIsLoadingExistingFiles(false);
        return;
      }
      setIsLoadingExistingFiles(true);
      setExistingFilesError(null);
      try {
        const results = await Promise.allSettled(
          initialReceiptUrls.map((url) => fetchFileFromUrl(url)),
        );
        if (cancelled) return;
        const binaries: File[] = [];
        const errors: string[] = [];
        results.forEach((result, index) => {
          if (result.status === "fulfilled") {
            binaries.push(result.value);
          } else {
            errors.push(`Failed to load receipt ${index + 1}`);
          }
        });
        setExistingFilesBinary(binaries);
        if (errors.length > 0) {
          setExistingFilesError(errors.join(" "));
        }
      } catch {
        if (!cancelled) {
          setExistingFilesBinary([]);
          setExistingFilesError("Failed to load existing receipts");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingExistingFiles(false);
        }
      }
    }
    if (open) {
      loadExistingFiles();
    }
    return () => {
      cancelled = true;
    };
  }, [initialReceiptUrlsJson, open, mode]);

  function handleChange<K extends keyof PaymentFormValues>(
    key: K,
    value: PaymentFormValues[K],
  ) {
    if (key === "paidAt") setPaidAtTouched(true);
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleEnrollmentChange(enrollmentId: string) {
    const enrollment =
      availableEnrollments.find((e) => e.id === enrollmentId) ||
      enrollmentList.find((e) => e.id === enrollmentId);
    if (enrollment) {
      setValues((prev) => ({
        ...prev,
        enrollmentId,
        enrollmentTitle: enrollment.title,
        amount:
          prev.amount === "" && typeof enrollment.amount === "number"
            ? enrollment.amount
            : prev.amount,
      }));
      setIsEnrollmentMenuOpen(false);
      setEnrollmentQuery("");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setValues((v) => ({ ...v, files: [...v.files, ...files] }));

    // Create previews for image files
    files.forEach((file, index) => {
      const fileIndex = values.files.length + index;
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setFilePreviews((prev) => ({ ...prev, [fileIndex]: result }));
        };
        reader.readAsDataURL(file);
      }
    });
  }

  function removeFile(index: number) {
    setValues((v) => ({
      ...v,
      files: v.files.filter((_, i) => i !== index),
    }));
    // Remove the preview for this file
    setFilePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[index];
      // Shift down all higher indices
      const updatedPreviews: { [key: number]: string } = {};
      Object.keys(newPreviews).forEach((key) => {
        const keyNum = parseInt(key);
        if (keyNum > index) {
          updatedPreviews[keyNum - 1] = newPreviews[keyNum];
        } else {
          updatedPreviews[keyNum] = newPreviews[keyNum];
        }
      });
      return updatedPreviews;
    });
  }

  const currentTabIndexRaw = tabs.findIndex((t) => t.key === activeTab);
  const currentTabIndex = currentTabIndexRaw < 0 ? 0 : currentTabIndexRaw;
  const isFirstTab = currentTabIndex <= 0;
  const isLastTab = currentTabIndex >= tabs.length - 1;

  // Form validation - disable submit until required fields are filled
  const disabled =
    !values.enrollmentId ||
    !values.amount ||
    !values.paidAt ||
    !values.transactionId ||
    !!isLoading;

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
  }
  function goNextTab() {
    if (!isLastTab) {
      const next = tabs[currentTabIndex + 1]?.key || tabs[tabs.length - 1].key;
      setActiveTab(next as typeof activeTab);
    }
  }
  function goPrevTab() {
    if (!isFirstTab) {
      const prev = tabs[currentTabIndex - 1]?.key || tabs[0].key;
      setActiveTab(prev as typeof activeTab);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <form
        onSubmit={handleFormSubmit}
        noValidate
        className="space-y-5 text-sm"
      >
        <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-1">
          <div className="grid grid-cols-3 gap-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={
                  t.key === activeTab
                    ? "w-full text-center px-3 py-1.5 rounded-md border border-[color:var(--color-primary-200)] text-[color:var(--color-primary-700)] bg-[color:var(--color-primary-50)]"
                    : "w-full text-center px-3 py-1.5 rounded-md border border-[color:var(--color-neutral-200)] text-[color:var(--color-neutral-700)] hover:bg-[color:var(--color-neutral-50)]"
                }
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "details" && (
          <div className="space-y-3">
            {/* Enrollment Selection */}
            <div>
              <label className="block text-sm font-medium text-[color:var(--color-neutral-700)] mb-2">
                Enrollment
              </label>
              <div className="relative" ref={enrollmentMenuRef}>
                <div
                  className="w-full px-3 py-2 border border-[color:var(--color-neutral-300)] rounded-md bg-white cursor-pointer hover:border-[color:var(--color-neutral-400)] focus-within:border-[color:var(--color-primary-500)] focus-within:ring-1 focus-within:ring-[color:var(--color-primary-500)]"
                  onClick={() => setIsEnrollmentMenuOpen(!isEnrollmentMenuOpen)}
                >
                  {selectedEnrollment ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          {selectedEnrollment.title}
                        </div>
                        {typeof selectedEnrollment.amount === "number" && (
                          <div className="text-xs text-[color:var(--color-neutral-500)]">
                            Rs {selectedEnrollment.amount.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-[color:var(--color-neutral-500)]">
                      Select an enrollment...
                    </span>
                  )}
                </div>
                {isEnrollmentMenuOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[color:var(--color-neutral-300)] rounded-md shadow-lg">
                    <div className="p-2 border-b border-[color:var(--color-neutral-200)]">
                      <input
                        type="text"
                        placeholder="Search enrollments..."
                        value={enrollmentQuery}
                        onChange={(e) => setEnrollmentQuery(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-[color:var(--color-neutral-300)] rounded-md focus:border-[color:var(--color-primary-500)] focus:ring-1 focus:ring-[color:var(--color-primary-500)]"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div
                      className="max-h-48 overflow-y-auto"
                      onScroll={handleEnrollmentScroll}
                    >
                      {enrollmentList.map((enrollment) => (
                        <div
                          key={enrollment.id}
                          className="px-3 py-2 hover:bg-[color:var(--color-neutral-50)] cursor-pointer border-b border-[color:var(--color-neutral-100)] last:border-b-0"
                          onClick={() => handleEnrollmentChange(enrollment.id)}
                        >
                          <div className="font-medium">{enrollment.title}</div>
                          {typeof enrollment.amount === "number" && (
                            <div className="text-xs text-[color:var(--color-neutral-500)]">
                              Rs {enrollment.amount.toLocaleString()}
                            </div>
                          )}
                        </div>
                      ))}
                      {enrollmentList.length === 0 && !isLoadingEnrollments && (
                        <div className="px-3 py-4 text-center text-sm text-[color:var(--color-neutral-500)]">
                          No enrollments found
                        </div>
                      )}
                      {isLoadingEnrollments && (
                        <div className="px-3 py-2 text-center text-xs text-[color:var(--color-neutral-500)]">
                          Loading...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Amount (Rs)"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={values.amount}
                  onChange={(e) =>
                    handleChange(
                      "amount",
                      e.target.value === ""
                        ? ""
                        : parseFloat(e.target.value) || "",
                    )
                  }
                  required
                />
              </div>
              <div>
                <Input
                  label="Payment Date"
                  type="datetime-local"
                  value={values.paidAt.slice(0, 16)}
                  onChange={(e) => handleChange("paidAt", e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Input
                label="Transaction ID"
                placeholder="TXN000000000"
                value={values.transactionId}
                onChange={(e) => handleChange("transactionId", e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {activeTab === "files" && (
          <div className="space-y-3">
            {/* File Upload */}
            <div>
              <div className="rounded-lg border border-dashed border-[color:var(--color-neutral-300)] bg-[color:var(--color-neutral-50)] p-3">
                <label className="block text-xs font-medium text-[color:var(--color-neutral-700)] mb-1">
                  Receipt Files
                </label>
                <div className="mb-2 flex flex-wrap items-center gap-2 text-[10px] text-[color:var(--color-neutral-500)]">
                  <span>
                    {existingReceiptUrls.length} existing
                    {existingReceiptUrls.length === 1 ? "" : " files"}
                  </span>
                  <span>•</span>
                  <span>
                    {values.files.length} new
                    {values.files.length === 1 ? "" : " files"}
                  </span>
                </div>
                {isLoadingExistingFiles && (
                  <div className="mb-2 text-xs text-[color:var(--color-neutral-600)]">
                    Loading existing receipts...
                  </div>
                )}
                {existingFilesError && (
                  <div className="mb-2 text-xs text-red-600">
                    {existingFilesError}
                  </div>
                )}
                {mode === "edit" && existingReceiptUrls.length > 0 && (
                  <div className="space-y-2 mb-2">
                    <div className="text-xs text-[color:var(--color-neutral-600)]">
                      Existing receipts
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {existingReceiptUrls.map((url, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 rounded-lg bg-white p-2 ring-1 ring-[color:var(--color-neutral-200)]"
                        >
                          {url.match(/\.(png|jpg|jpeg|gif|webp)(\?.*)?$/i) ? (
                            <img
                              src={url}
                              alt={`Receipt ${idx + 1}`}
                              className="h-16 w-16 rounded-lg object-cover ring-1 ring-[color:var(--color-neutral-200)]"
                            />
                          ) : (
                            <div className="h-16 w-16 flex items-center justify-center rounded-lg bg-white text-[color:var(--color-neutral-400)] ring-1 ring-[color:var(--color-neutral-200)]">
                              <Upload size={16} />
                            </div>
                          )}
                          <div className="flex-1">
                            {existingFilesBinary[idx] && (
                              <div className="text-xs text-gray-500">
                                {(existingFilesBinary[idx].size / 1024).toFixed(
                                  1,
                                )}{" "}
                                KB
                              </div>
                            )}
                            <div className="mt-1 flex items-center gap-2">
                              <span className="inline-flex items-center rounded-full bg-[color:var(--color-neutral-100)] px-2 py-0.5 text-[10px] text-[color:var(--color-neutral-700)]">
                                Existing
                              </span>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary-700 hover:underline"
                              >
                                Open
                              </a>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setExistingReceiptUrls((prev) =>
                                prev.filter((_, i) => i !== idx),
                              );
                              setExistingFilesBinary((prev) =>
                                prev.filter((_, i) => i !== idx),
                              );
                            }}
                            className="text-red-600 hover:bg-red-50 rounded-md px-2 py-1"
                            aria-label="Remove existing receipt"
                            title="Remove existing receipt"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="receipt-files-input"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Browse
                  </Button>
                  {values.files.length > 0 && (
                    <Button
                      type="button"
                      variant="secondary"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => setValues((v) => ({ ...v, files: [] }))}
                    >
                      Remove All
                    </Button>
                  )}
                </div>
                {values.files.length > 0 && (
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {values.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-lg bg-white p-2 ring-1 ring-[color:var(--color-neutral-200)]"
                      >
                        {file.type.startsWith("image/") &&
                        filePreviews[index] ? (
                          <img
                            src={filePreviews[index]}
                            alt={file.name}
                            className="h-16 w-16 rounded-lg object-cover ring-1 ring-[color:var(--color-neutral-200)]"
                          />
                        ) : (
                          <div className="h-16 w-16 flex items-center justify-center rounded-lg bg-white text-[color:var(--color-neutral-400)] ring-1 ring-[color:var(--color-neutral-200)]">
                            <Upload size={16} />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-[color:var(--color-primary-50)] px-2 py-0.5 text-[10px] text-[color:var(--color-primary-700)]">
                              New
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:bg-red-50 rounded-md px-2 py-1"
                          aria-label="Remove"
                          title="Remove"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="mt-1 text-[10px] text-[color:var(--color-neutral-500)]">
                  Images or PDFs. Max ~5MB each.
                </p>
              </div>
            </div>

            {/* Remarks */}
            <div>
              <Textarea
                label="Remarks"
                value={values.remarks}
                onChange={(e) => handleChange("remarks", e.target.value)}
                placeholder="Add any additional notes or remarks..."
                rows={3}
              />
            </div>
          </div>
        )}

        {activeTab === "status" && (
          <div className="space-y-3">
            {/* Status, Method, and Type */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Select
                  label="Status"
                  value={values.status}
                  onChange={(e) =>
                    handleChange("status", e.target.value as PaymentStatus)
                  }
                >
                  {Object.values(PaymentStatus).map((s) => (
                    <option key={s} value={s}>
                      {labelForStatus(s)}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Select
                  label="Payment Method"
                  value={values.method}
                  onChange={(e) =>
                    handleChange("method", e.target.value as PaymentMethod)
                  }
                >
                  {Object.values(PaymentMethod).map((m) => (
                    <option key={m} value={m}>
                      {labelForMethod(m)}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Select
                  label="Payment Type"
                  value={values.paymentCreatedType}
                  onChange={(e) =>
                    handleChange(
                      "paymentCreatedType",
                      e.target.value as PaymentFormValues["paymentCreatedType"],
                    )
                  }
                >
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[color:var(--color-neutral-200)]">
          {!isFirstTab && (
            <Button type="button" variant="secondary" onClick={goPrevTab}>
              Previous
            </Button>
          )}
          {!isLastTab ? (
            <Button type="button" onClick={goNextTab}>
              Next
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => {
                if (disabled) return;
                let processedValues = { ...values };
                if (typeof processedValues.amount === "string") {
                  const numAmount = parseFloat(processedValues.amount);
                  if (!isNaN(numAmount) && numAmount > 0) {
                    processedValues.amount = numAmount;
                  }
                }
                if (!paidAtTouched && originalPaidAtRef.current) {
                  processedValues.paidAt = originalPaidAtRef.current;
                }
                if (existingFilesBinary.length > 0) {
                  processedValues = {
                    ...processedValues,
                    files: [...existingFilesBinary, ...processedValues.files],
                  };
                }
                onSubmit(processedValues);
              }}
              disabled={disabled}
            >
              {isLoading
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : mode === "create"
                  ? "Create Payment"
                  : "Update Payment"}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}
