"use client";

import React, { useEffect, useState } from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import { adminEnrollmentPaymentService } from "@/lib/services/admin/enrollment-payment";
import { PaymentStatus } from "@/lib/services/admin/types";
import { CheckCircle2, Clock, XCircle, RotateCcw } from "lucide-react";

type PaymentRow = {
  id: string;
  courseTitle: string;
  amount: number;
  method: string;
  date: string;
  status: PaymentStatus;
};

function paymentStatusBadgeClass(status?: PaymentStatus): string {
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

interface StudentPaymentViewProps {
  studentId: string;
}

export default function StudentPaymentView({
  studentId,
}: StudentPaymentViewProps) {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [paymentMeta, setPaymentMeta] = useState<{
    page: number;
    limit: number;
    total: number;
  } | null>(null);
  const [paymentPage, setPaymentPage] = useState(1);
  const paymentPageSize = 10;
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!studentId) return;
      try {
        setPaymentsLoading(true);
        setPaymentsError(null);
        const response = await adminEnrollmentPaymentService.list({
          page: paymentPage,
          limit: paymentPageSize,
          studentId: studentId,
        });
        if (response.success) {
          const mapped: PaymentRow[] = response.data.data.map((p: any) => ({
            id: p.id,
            courseTitle: p.enrollment?.course?.title || "N/A",
            amount: p.amount || 0,
            method: p.paymentMethod || "N/A",
            date: p.paidAt
              ? new Date(p.paidAt).toISOString().split("T")[0]
              : "N/A",
            status: p.status,
          }));
          setPayments(mapped);
          setPaymentMeta(response.data.meta);
        } else {
          setPayments([]);
          setPaymentMeta(null);
          setPaymentsError(
            response.error.message || "Failed to fetch payments",
          );
        }
      } catch (err: any) {
        setPayments([]);
        setPaymentMeta(null);
        setPaymentsError(err.message || "Failed to fetch payments");
      } finally {
        setPaymentsLoading(false);
      }
    };

    fetchPayments();
  }, [studentId, paymentPage]);

  const paymentColumns: Array<DataTableColumn<PaymentRow>> = [
    {
      id: "date",
      header: "Date",
      accessor: (row) => row.date,
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "courseTitle",
      header: "Course",
      accessor: (row) => row.courseTitle,
      cellClassName: "font-medium",
    },
    {
      id: "amount",
      header: "Amount (NPR)",
      accessor: (row) => `Rs ${row.amount.toLocaleString()}`,
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "method",
      header: "Method",
      accessor: (row) => row.method,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Badge
          variant="outline"
          className={paymentStatusBadgeClass(row.status)}
        >
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
            {row.status ? row.status.charAt(0) + row.status.slice(1).toLowerCase() : "N/A"}
          </span>
        </Badge>
      ),
      cellClassName: "whitespace-nowrap",
    },
  ];

  const paymentTotal = paymentMeta?.total || 0;
  const paymentPageCount = paymentMeta
    ? Math.ceil(paymentMeta.total / paymentMeta.limit)
    : 1;
  const paymentCurrentPage = paymentMeta?.page || paymentPage;
  const paymentStart =
    paymentTotal === 0
      ? 0
      : (paymentCurrentPage - 1) *
          (paymentMeta?.limit || paymentPageSize) +
        1;
  const paymentEnd = Math.min(
    paymentStart +
      (paymentMeta?.limit || paymentPageSize) -
      (paymentTotal === 0 ? 0 : 1),
    paymentTotal,
  );

  return (
    <Card>
      <CardContent className="p-0">
        {paymentsError ? (
          <div className="px-6 py-8 text-sm text-red-600">
            {paymentsError}
          </div>
        ) : (
          <>
            <DataTable<PaymentRow>
              data={payments}
              columns={paymentColumns}
              getRowKey={(row) => row.id}
              emptyMessage={
                paymentsLoading
                  ? "Loading payments..."
                  : "No payments found for this student."
              }
            />
            {paymentTotal > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4">
                <p className="text-sm text-[color:var(--color-neutral-600)]">
                  Showing{" "}
                  {paymentTotal === 0
                    ? 0
                    : `${paymentStart}-${paymentEnd}`}{" "}
                  of {paymentTotal}
                </p>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full sm:w-auto"
                    disabled={paymentsLoading || paymentCurrentPage === 1}
                    onClick={() => setPaymentPage((p) => Math.max(p - 1, 1))}
                  >
                    Previous
                  </Button>
                  <div className="text-sm text-[color:var(--color-neutral-700)] hidden sm:block">
                    Page {paymentCurrentPage} of {paymentPageCount}
                  </div>
                  <div className="text-sm text-[color:var(--color-foreground)] sm:hidden text-center flex-1">
                    {paymentCurrentPage}/{paymentPageCount}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full sm:w-auto"
                    disabled={
                      paymentsLoading ||
                      paymentCurrentPage === paymentPageCount
                    }
                    onClick={() =>
                      setPaymentPage((p) =>
                        Math.min(p + 1, paymentPageCount),
                      )
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
