"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Card, { CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  RotateCcw,
  DollarSign,
  Smartphone,
  Building2,
  Pencil,
  Download,
  AlertCircle,
} from "lucide-react";
import { adminEnrollmentPaymentService } from "@/lib/services/admin/enrollment-payment";
import {
  AdminEnrollmentPayment,
  PaymentStatus,
  PaymentMethod,
} from "@/lib/services/admin/types";

function formatUTCDate(dateString?: string | Date | null) {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  return d.toISOString().split("T")[0];
}

function formatCurrency(amount: number) {
  return `Rs ${amount.toLocaleString()}`;
}

function statusBadgeClass(status?: PaymentStatus | string): string {
  const s = String(status).toUpperCase();
  if (s === PaymentStatus.PAID)
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === PaymentStatus.PENDING)
    return "bg-amber-50 text-amber-700 border-amber-200";
  if (s === PaymentStatus.FAILED)
    return "bg-red-50 text-red-700 border-red-200";
  if (s === PaymentStatus.REFUNDED)
    return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-gray-50 text-gray-700 border-gray-200";
}

function getMethodIcon(method?: PaymentMethod | string) {
  const m = String(method).toUpperCase();
  if (
    m === PaymentMethod.WALLET ||
    m.includes("KHALTI") ||
    m.includes("ESEWA") ||
    m.includes("FONEPAY")
  )
    return <Smartphone size={14} />;
  if (m === PaymentMethod.BANK_TRANSFER || m === PaymentMethod.ONLINE_BANKING)
    return <Building2 size={14} />;
  if (m.includes("CASH")) return <DollarSign size={14} />;
  return <CreditCard size={14} />;
}

function getStatusIcon(status?: PaymentStatus | string) {
  const s = String(status).toUpperCase();
  if (s === PaymentStatus.PAID) return <CheckCircle2 size={14} />;
  if (s === PaymentStatus.PENDING) return <Clock size={14} />;
  if (s === PaymentStatus.FAILED) return <XCircle size={14} />;
  if (s === PaymentStatus.REFUNDED) return <RotateCcw size={14} />;
  return <CreditCard size={14} />;
}

function getMethodLabel(method?: PaymentMethod | string) {
  const m = String(method).toUpperCase();
  if (m === PaymentMethod.QR) return "QR";
  if (m === PaymentMethod.BANK_TRANSFER) return "Bank Transfer";
  if (m === PaymentMethod.ONLINE_BANKING) return "Online Banking";
  if (m === PaymentMethod.CARD) return "Card";
  if (m === PaymentMethod.WALLET) return "Wallet";
  if (m === PaymentMethod.OTHER) return "Other";
  return m.charAt(0) + m.slice(1).toLowerCase().replace(/_/g, " ");
}

export default function PaymentDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [payment, setPayment] = useState<AdminEnrollmentPayment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await adminEnrollmentPaymentService.get(id);
        if (response.success) {
          setPayment(response.data);
        } else {
          setError(response.error.message || "Failed to fetch payment details");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPayment();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Payment Details</h1>
        </div>
        <Card>
          <CardContent className="py-0">
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-[color:var(--color-neutral-600)]">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading payment details...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Payment Details</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-8 text-[color:var(--color-neutral-500)]">
              <AlertCircle className="mb-2 h-8 w-8 text-red-500" />
              <p>{error || "Payment not found"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const studentName = payment.enrollment?.student
    ? `${payment.enrollment?.student.firstName ?? ""} ${payment.enrollment?.student.lastName ?? ""}`.trim() ||
      payment.enrollment?.student.email ||
      "N/A"
    : "N/A";

  const enrollmentTitle = payment.enrollment?.course?.title || "N/A";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">
              Payment Details
            </h1>
            <p className="text-sm text-[color:var(--color-neutral-600)] mt-1">
              ID: {id}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Payment Overview */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div>
                    <div className="text-base font-semibold">
                      {enrollmentTitle} - {studentName}
                    </div>
                    <div className="text-[12px] text-[color:var(--color-neutral-600)]">
                      Enrollment ID: {payment.enrollment?.id || "N/A"}
                    </div>
                    <div className="text-[12px] text-[color:var(--color-neutral-600)]">
                      Transaction ID: {payment.transactionId || "N/A"}
                    </div>
                    <div className="text-[12px] text-[color:var(--color-neutral-600)]">
                      Payment ID: {payment.enrollmentPaymentId || "N/A"}
                    </div>
                    {payment.createdBy && (
                      <div className="text-[12px] text-[color:var(--color-neutral-600)]">
                        Created By:{" "}
                        {`${(payment.createdBy as any).firstName ?? ""} ${(payment.createdBy as any).lastName ?? ""}`.trim() ||
                          (payment.createdBy as any).email ||
                          "N/A"}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={statusBadgeClass(payment.status)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {getStatusIcon(payment.status)}
                      {payment.status
                        ? payment.status.charAt(0) +
                          payment.status.slice(1).toLowerCase()
                        : "N/A"}
                    </span>
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      payment.creationMethod === "AUTOMATIC"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                    }
                  >
                    <span className="inline-flex items-center gap-1">
                      {payment.creationMethod === "AUTOMATIC" ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <Pencil size={14} />
                      )}
                      {payment.creationMethod
                        ? payment.creationMethod.toLowerCase()
                        : "N/A"}
                    </span>
                  </Badge>
                </div>
              </div>

              <div className="h-px bg-[color:var(--color-neutral-200)]" />

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                  <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                    Amount
                  </div>
                  <div className="mt-1 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
                    {formatCurrency(payment.amount)}
                  </div>
                </div>
                <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                  <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                    Payment Method
                  </div>
                  <div className="mt-1 inline-flex items-center gap-2 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
                    {getMethodIcon(payment.paymentMethod)}
                    {getMethodLabel(payment.paymentMethod)}
                  </div>
                </div>
                <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                  <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                    Created Date
                  </div>
                  <div className="mt-1 inline-flex items-center gap-2 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
                    <Calendar size={14} />
                    {formatUTCDate(payment.createdAt)}
                  </div>
                </div>
                <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                  <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                    Paid Date
                  </div>
                  <div className="mt-1 inline-flex items-center gap-2 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
                    {payment.paidAt ? (
                      <>
                        <CheckCircle2 size={14} />
                        {formatUTCDate(payment.paidAt)}
                      </>
                    ) : (
                      <span className="text-[color:var(--color-neutral-500)]">
                        -
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {payment.remarks && (
                <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                  <div className="text-[11px] text-[color:var(--color-neutral-600)] mb-1">
                    Remarks
                  </div>
                  <div className="text-[color:var(--color-neutral-900)]">
                    {payment.remarks}
                  </div>
                </div>
              )}

              {payment.details && Object.keys(payment.details).length > 0 && (
                <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                  <div className="text-[11px] text-[color:var(--color-neutral-600)] mb-2">
                    Payment Details
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(payment.details).map(([key, value]) => {
                      if (value === null || value === undefined) return null;

                      const formattedKey = key
                        .replace(/_/g, " ")
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())
                        .trim();

                      return (
                        <div key={key} className="flex flex-col">
                          <span className="text-[10px] text-[color:var(--color-neutral-500)] uppercase tracking-wider">
                            {formattedKey}
                          </span>
                          <span className="mt-0.5 text-sm font-medium text-[color:var(--color-neutral-900)] break-all">
                            {typeof value === "object"
                              ? JSON.stringify(value)
                              : String(value)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {payment.receiptKeys && payment.receiptKeys.length > 0 && (
                <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                  <div className="text-[11px] text-[color:var(--color-neutral-600)] mb-2">
                    Files ({payment.receiptKeys.length})
                  </div>
                  <div className="space-y-2">
                    {payment.receiptKeys.map((key, index) => {
                      const url = `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${key}`;
                      const fileName =
                        key.split("/").pop() || `File ${index + 1}`;
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 underline text-sm"
                          >
                            {fileName}
                          </a>
                          <a
                            href={url}
                            download
                            className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
                            title="Download file"
                          >
                            <Download size={14} />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
