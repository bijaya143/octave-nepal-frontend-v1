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
  Clock,
  RotateCcw,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PaymentFormModal, { PaymentFormValues } from "./PaymentFormModal";
import { adminEnrollmentPaymentService } from "@/lib/services/admin/enrollment-payment";
import { adminStudentService } from "@/lib/services/admin/student";
import {
  AdminEnrollmentPaymentFilterInput,
  PaymentStatus,
  PaymentMethod,
  CreationMethod,
} from "@/lib/services/admin/types";

type Payment = {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatarUrl: string;
  enrollmentId: string;
  enrollmentPaymentId: string;
  enrollmentTitle: string;
  remarks: string;
  receiptUrls: string[];
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  paymentCreatedType: "automatic" | "manual";
  transactionId: string;
  paidAt: string; // YYYY-MM-DD (display)
  paidAtIso: string; // ISO for edit form
  createdAt: string; // YYYY-MM-DD (UTC)
};

function formatCurrency(amount: number) {
  return `Rs ${amount.toLocaleString()}`;
}

function statusBadgeClass(status: PaymentStatus): string {
  if (status === PaymentStatus.PAID)
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === PaymentStatus.PENDING)
    return "bg-amber-50 text-amber-700 border-amber-200";
  if (status === PaymentStatus.FAILED)
    return "bg-red-50 text-red-700 border-red-200";
  if (status === PaymentStatus.REFUNDED)
    return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-gray-50 text-gray-700 border-gray-200";
}

function methodLabel(m: PaymentMethod) {
  if (m === PaymentMethod.WALLET) return "Wallet";
  if (m === PaymentMethod.QR) return "QR";
  if (m === PaymentMethod.BANK_TRANSFER) return "Bank Transfer";
  if (m === PaymentMethod.ONLINE_BANKING) return "Online Banking";
  if (m === PaymentMethod.CARD) return "Card";
  if (m === PaymentMethod.OTHER) return "Other";
  return String(m);
}

function statusLabel(s: PaymentStatus) {
  if (s === PaymentStatus.PAID) return "Paid";
  if (s === PaymentStatus.PENDING) return "Pending";
  if (s === PaymentStatus.FAILED) return "Failed";
  if (s === PaymentStatus.REFUNDED) return "Refunded";
  return String(s);
}

export default function AdminPaymentsPage() {
  const router = useRouter();
  // API state
  const [payments, setPayments] = React.useState<Payment[]>([]);
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
  const [statusFilter, setStatusFilter] = React.useState<
    "All" | Payment["status"]
  >("All");
  const [methodFilter, setMethodFilter] = React.useState<
    "All" | Payment["method"]
  >("All");
  const [studentFilter, setStudentFilter] = React.useState<string>("all");
  const [createdTypeFilter, setCreatedTypeFilter] = React.useState<
    "All" | Payment["paymentCreatedType"]
  >("All");
  const [paidFrom, setPaidFrom] = React.useState<string>("");
  const [paidTo, setPaidTo] = React.useState<string>("");
  const [minAmount, setMinAmount] = React.useState<string>("");
  const [maxAmount, setMaxAmount] = React.useState<string>("");

  // Student filter dropdown (searchable)
  const [isStudentMenuOpen, setIsStudentMenuOpen] = React.useState(false);
  const studentMenuRef = React.useRef<HTMLDivElement>(null);
  const [students, setStudents] = React.useState<
    Array<{ id: string; name: string; email: string }>
  >([]);
  const [studentQuery, setStudentQuery] = React.useState("");
  const [studentPage, setStudentPage] = React.useState(1);
  const [hasMoreStudents, setHasMoreStudents] = React.useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = React.useState(false);

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

  React.useEffect(() => {
    if (isStudentMenuOpen) {
      setStudentPage(1);
      fetchStudentsForFilter(1, studentQuery, true);
    }
  }, [isStudentMenuOpen, studentQuery, fetchStudentsForFilter]);

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
        isStudentMenuOpen &&
        studentMenuRef.current &&
        !studentMenuRef.current.contains(target)
      ) {
        setIsStudentMenuOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsStudentMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isStudentMenuOpen]);

  // helpers provided above for labels/classes

  const fetchPayments = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const filters: AdminEnrollmentPaymentFilterInput = {
        page,
        limit: pageSize,
        keyword: query || undefined,
        status: statusFilter === "All" ? undefined : statusFilter,
        paymentMethod: methodFilter === "All" ? undefined : methodFilter,
        creationMethod:
          createdTypeFilter === "All"
            ? undefined
            : createdTypeFilter === "automatic"
              ? CreationMethod.AUTOMATIC
              : CreationMethod.MANUAL,
        startDate: paidFrom || undefined,
        endDate: paidTo || undefined,
        minAmountPaid: minAmount.trim() ? parseFloat(minAmount) : undefined,
        maxAmountPaid: maxAmount.trim() ? parseFloat(maxAmount) : undefined,
        studentId: studentFilter !== "all" ? studentFilter : undefined,
      };
      const resp = await adminEnrollmentPaymentService.list(filters);
      if (resp.success) {
        const mapped: Payment[] = resp.data.data.map((p) => {
          const student = p.enrollment?.student || null;
          const course = p.enrollment?.course || null;
          const studentName = student
            ? `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim() ||
              student.email ||
              "N/A"
            : "N/A";
          const studentAvatarUrl = student?.profilePictureKey
            ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${student.profilePictureKey}`
            : "";
          return {
            id: p.id,
            studentId: student?.id || "",
            studentName,
            studentEmail: student?.email || "N/A",
            studentAvatarUrl,
            enrollmentId: p.enrollment?.id || "",
            enrollmentPaymentId: p.enrollmentPaymentId || p.id,
            enrollmentTitle: `${course?.title || "N/A"} - ${studentName}`,
            remarks: p.remarks || "",
            receiptUrls: (p.receiptKeys || []).map(
              (key: string) =>
                `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${key}`,
            ),
            amount:
              typeof p.amount === "string"
                ? parseFloat(p.amount)
                : p.amount || 0,
            status: (p.status as PaymentStatus) || PaymentStatus.PENDING,
            method: (p.paymentMethod as PaymentMethod) || PaymentMethod.OTHER,
            paymentCreatedType: (p.creationMethod === CreationMethod.AUTOMATIC
              ? "automatic"
              : "manual") as Payment["paymentCreatedType"],
            transactionId: p.transactionId || "",
            paidAt: p.paidAt ? p.paidAt.split("T")[0] : "",
            paidAtIso: p.paidAt || "",
            createdAt: p.createdAt
              ? new Date(p.createdAt).toISOString().split("T")[0]
              : "",
          };
        });
        setPayments(mapped);
        setPagination(resp.data.meta);
      }
    } catch (err) {
      toast.error("Failed to fetch payments");
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    pageSize,
    query,
    statusFilter,
    methodFilter,
    createdTypeFilter,
    paidFrom,
    paidTo,
    minAmount,
    maxAmount,
    studentFilter,
  ]);

  React.useEffect(() => {
    fetchPayments();
  }, [fetchPayments, refreshKey]);

  const total = pagination?.total || 0;
  const pageCount = pagination
    ? Math.ceil(pagination.total / pagination.limit)
    : 1;
  const currentPage = pagination?.page || 1;
  const start = (currentPage - 1) * (pagination?.limit || pageSize);
  const end = Math.min(start + (pagination?.limit || pageSize), total);
  const pagedPayments = payments;

  const nextPage = () => setPage((p) => Math.min(p + 1, pageCount));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));
  const [openCreate, setOpenCreate] = React.useState(false);
  const [editing, setEditing] = React.useState<Payment | null>(null);
  const [pendingDelete, setPendingDelete] = React.useState<Payment | null>(
    null,
  );

  const handleCreate = React.useCallback(async (values: PaymentFormValues) => {
    try {
      setIsSubmitting(true);
      const payload = {
        enrollmentId: values.enrollmentId,
        amount: typeof values.amount === "number" ? values.amount : undefined,
        paidAt: values.paidAt,
        transactionId: values.transactionId,
        remarks: values.remarks || undefined,
        status: values.status,
        paymentMethod: values.method,
        receipts: values.files,
      };
      const resp = await adminEnrollmentPaymentService.create(payload);
      if (resp.success) {
        toast.success("Payment created successfully");
        setOpenCreate(false);
        setRefreshKey((k) => k + 1);
      }
    } catch (err) {
      toast.error("Failed to create payment");
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleEdit = React.useCallback(
    async (values: PaymentFormValues) => {
      if (!editing) return;
      try {
        setIsSubmitting(true);
        const payload = {
          id: editing.id,
          enrollmentId: values.enrollmentId,
          amount: typeof values.amount === "number" ? values.amount : undefined,
          paidAt: values.paidAt,
          transactionId: values.transactionId,
          remarks: values.remarks || undefined,
          status: values.status,
          paymentMethod: values.method,
          receipts: values.files,
        };
        const resp = await adminEnrollmentPaymentService.update(payload);
        if (resp.success) {
          toast.success("Payment updated successfully");
          setEditing(null);
          setRefreshKey((k) => k + 1);
        }
      } catch (err) {
        toast.error("Failed to update payment");
      } finally {
        setIsSubmitting(false);
      }
    },
    [editing],
  );

  const handleDelete = React.useCallback((payment: Payment) => {
    setPendingDelete(payment);
  }, []);

  const confirmDelete = React.useCallback(async () => {
    if (!pendingDelete) return;
    try {
      const resp = await adminEnrollmentPaymentService.delete(pendingDelete.id);
      if (resp.success) {
        toast.error("Payment deleted successfully");
        setPendingDelete(null);
        setRefreshKey((k) => k + 1);
      }
    } catch (err) {
      toast.error("Failed to delete payment");
    }
  }, [pendingDelete]);

  const cancelDelete = React.useCallback(() => {
    setPendingDelete(null);
  }, []);

  const amountRangeValue = React.useMemo(() => {
    const minA = minAmount.trim();
    const maxA = maxAmount.trim();
    if (minA === "" && maxA === "") return "any";
    if (minA === "0" && maxA === "2500") return "0-2500";
    if (minA === "2501" && maxA === "5000") return "2501-5000";
    if (minA === "5001" && maxA === "7500") return "5001-7500";
    if (minA === "7501" && maxA === "") return "7501+";
    return "custom";
  }, [minAmount, maxAmount]);

  const columns: Array<DataTableColumn<Payment>> = [
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
      id: "transactionId",
      header: "Transaction ID",
      accessor: "transactionId",
      cellClassName: "whitespace-nowrap font-mono text-sm",
    },
    // {
    //   id: "paymentId",
    //   header: "Payment ID",
    //   accessor: "enrollmentPaymentId",
    //   cellClassName: "whitespace-nowrap font-mono text-sm",
    // },
    {
      id: "amount",
      header: "Amount",
      accessor: (row) => formatCurrency(row.amount),
      cell: (row) => (
        <div className="flex items-center gap-1 font-semibold text-emerald-600">
          Rs {row.amount.toLocaleString()}
        </div>
      ),
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "paidAt",
      header: "Paid At",
      accessor: "paidAt",
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Badge variant="outline" className={statusBadgeClass(row.status)}>
          <span className="inline-flex items-center gap-1">
            {row.status === PaymentStatus.PAID ? (
              <CheckCircle2 size={14} />
            ) : row.status === PaymentStatus.PENDING ? (
              <Clock size={14} />
            ) : row.status === PaymentStatus.FAILED ? (
              <XCircle size={14} />
            ) : (
              <RotateCcw size={14} />
            )}
            {statusLabel(row.status)}
          </span>
        </Badge>
      ),
      cellClassName: "whitespace-nowrap",
    },
    // {
    // 	id: "paymentCreatedType",
    // 	header: "Type",
    // 	cell: (row) => (
    // 		<Badge variant="outline" className={row.paymentCreatedType === "automatic" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-700 border-gray-200"}>
    // 			<span className="inline-flex items-center gap-1">
    // 				{row.paymentCreatedType === "automatic" ? <CheckCircle2 size={14} /> : <Pencil size={14} />}
    // 				{row.paymentCreatedType === "automatic" ? "Auto" : "Manual"}
    // 			</span>
    // 		</Badge>
    // 	),
    // 	cellClassName: "whitespace-nowrap",
    // },
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
          <h1 className="text-xl sm:text-2xl font-semibold">Payments</h1>
        </div>
        <Button size="sm" onClick={() => setOpenCreate(true)}>
          Add Payment
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
              placeholder="Search payments..."
              value={query}
              onChange={(e) => {
                setPage(1);
                setQuery(e.target.value);
              }}
            />
          </div>
          <div className="md:col-span-5">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Paid Date
            </label>
            <DateRangePicker
              value={{ from: paidFrom || null, to: paidTo || null }}
              onChange={(r) => {
                setPage(1);
                setPaidFrom(r.from || "");
                setPaidTo(r.to || "");
              }}
              placeholder="Paid date range"
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
                setMethodFilter("All");
                setStudentFilter("all");
                setCreatedTypeFilter("All");
                setPaidFrom("");
                setPaidTo("");
                setMinAmount("");
                setMaxAmount("");
                setPage(1);
              }}
            >
              <RotateCcw size={16} /> Reset
            </Button>
          </div>

          {/* Row 2: Status, Method, Student, Type, Amount */}
          <div className="md:col-span-2">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Status
            </label>
            <Select
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value as PaymentStatus | "All");
              }}
            >
              <option value="All">All statuses</option>
              {Object.values(PaymentStatus).map((s) => (
                <option key={s} value={s}>
                  {statusLabel(s)}
                </option>
              ))}
            </Select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Method
            </label>
            <Select
              value={methodFilter}
              onChange={(e) => {
                setPage(1);
                setMethodFilter(e.target.value as PaymentMethod | "All");
              }}
            >
              <option value="All">All methods</option>
              {Object.values(PaymentMethod).map((m) => (
                <option key={m} value={m}>
                  {methodLabel(m)}
                </option>
              ))}
            </Select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Type
            </label>
            <Select
              value={createdTypeFilter}
              onChange={(e) => {
                setPage(1);
                setCreatedTypeFilter(e.target.value as any);
              }}
            >
              <option value="All">All types</option>
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
            </Select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Amount
            </label>
            <Select
              value={amountRangeValue}
              onChange={(e) => {
                const v = e.target.value;
                setPage(1);
                if (v === "any") {
                  setMinAmount("");
                  setMaxAmount("");
                } else if (v === "0-2500") {
                  setMinAmount("0");
                  setMaxAmount("2500");
                } else if (v === "2501-5000") {
                  setMinAmount("2501");
                  setMaxAmount("5000");
                } else if (v === "5001-7500") {
                  setMinAmount("5001");
                  setMaxAmount("7500");
                } else if (v === "7501+") {
                  setMinAmount("7501");
                  setMaxAmount("");
                }
              }}
            >
              <option value="any">Any amount</option>
              <option value="0-2500">Rs 0-Rs 2,500</option>
              <option value="2501-5000">Rs 2,501-Rs 5,000</option>
              <option value="5001-7500">Rs 5,001-Rs 7,500</option>
              <option value="7501+">Rs 7,501+</option>
            </Select>
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
        </div>
      </div>

      <Card>
        <CardContent className="py-0">
          <DataTable<Payment>
            data={pagedPayments}
            columns={columns}
            getRowKey={(row) => row.id}
            emptyMessage={
              isLoading ? "Loading payments..." : "No payments found."
            }
            onRowClick={(row) => router.push(`/admin/payments/${row.id}`)}
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
        title={pendingDelete ? "Delete Payment" : undefined}
      >
        {pendingDelete && (
          <div className="space-y-4 text-sm">
            <div className="text-[color:var(--color-neutral-800)]">
              Are you sure you want to delete the payment for
              <span className="font-medium">
                {" "}
                {pendingDelete.transactionId}{" "}
              </span>
              ({formatCurrency(pendingDelete.amount)}) by{" "}
              <span className="font-medium">{pendingDelete.studentName}</span>?
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

      <PaymentFormModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreate}
        title="Create Payment"
        mode="create"
        isLoading={isSubmitting}
        availableEnrollments={[]}
      />
      <PaymentFormModal
        open={!!editing}
        onClose={() => setEditing(null)}
        onSubmit={handleEdit}
        title="Edit Payment"
        mode="edit"
        initialValues={
          editing
            ? {
                enrollmentId: editing.enrollmentId,
                enrollmentTitle: editing.enrollmentTitle,
                amount: editing.amount,
                paidAt: editing.paidAtIso || editing.paidAt,
                status: editing.status,
                method: editing.method,
                paymentCreatedType: editing.paymentCreatedType,
                transactionId: editing.transactionId,
                remarks: editing.remarks,
              }
            : undefined
        }
        initialReceiptUrls={editing ? editing.receiptUrls : []}
        availableEnrollments={
          editing
            ? [
                {
                  id: editing.enrollmentId,
                  title: editing.enrollmentTitle,
                  amount: editing.amount,
                },
              ]
            : []
        }
        isLoading={isSubmitting}
      />
    </div>
  );
}
