"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Image from "next/image";
import Breadcrumb from "@/components/ui/Breadcrumb";
import {
  AdminEnrollmentPayment,
  PaymentStatus,
} from "@/lib/services/admin/types";
import type { Student } from "@/lib/services/student/types";
import { CheckCircle2, XCircle, Clock, RotateCcw } from "lucide-react";
import { studentEnrollmentPaymentService } from "@/lib/services";

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

function statusLabel(s: PaymentStatus) {
  if (s === PaymentStatus.PAID) return "Paid";
  if (s === PaymentStatus.PENDING) return "Pending";
  if (s === PaymentStatus.FAILED) return "Failed";
  if (s === PaymentStatus.REFUNDED) return "Refunded";
  return String(s);
}

export default function StudentBillingPage() {
  const [payments, setPayments] = React.useState<AdminEnrollmentPayment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [student, setStudent] = React.useState<Student | null>(null);
  const [page, setPage] = React.useState(1);
  const pageSize = 10;
  const [pagination, setPagination] = React.useState<{
    page: number;
    limit: number;
    total: number;
  } | null>(null);

  React.useEffect(() => {
    // Load student data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setStudent(JSON.parse(userData));
      } catch (err) {
        console.error("Failed to parse user data:", err);
      }
    }
  }, []);

  React.useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await studentEnrollmentPaymentService.list({
          page,
          limit: pageSize,
        });
        if (res.success) {
          setPayments(res.data.data || []);
          setPagination(res.data.meta);
        }
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [page]);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Billing" },
        ]}
        className="mb-2"
      />
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1
          className="text-xl md:text-2xl font-semibold"
          style={{ fontFamily: "var(--font-heading-sans)" }}
        >
          Billing
        </h1>
        <Badge variant="outline">Student</Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Main */}
        <section className="lg:col-span-2 space-y-6">
          {/* Payment history */}
          <Card className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_60%)]" />
            <CardContent className="relative py-5">
              <div className="flex items-center justify-between mb-3">
                <h2
                  className="text-base font-semibold"
                  style={{ fontFamily: "var(--font-heading-sans)" }}
                >
                  Payment history
                </h2>
              </div>
              {/* Mobile list view */}
              <div className="sm:hidden -mx-5 border-t border-neutral-200 divide-y divide-neutral-200 mt-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      key={`skeleton-payment-mobile-${idx}`}
                      className="px-5 py-4 animate-pulse shrink-0"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 bg-neutral-200 rounded-lg"></div>
                          <div className="space-y-2">
                            <div className="h-3.5 bg-neutral-200 rounded w-32"></div>
                            <div className="h-2.5 bg-neutral-100 rounded w-24"></div>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="h-4 bg-neutral-200 rounded w-16 ml-auto"></div>
                          <div className="h-5 bg-neutral-100 rounded-full w-20 ml-auto"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : payments.length > 0 ? (
                  payments.map((p) => (
                    <div
                      key={p.id}
                      className="px-5 py-4 relative group cursor-pointer transition-colors hover:bg-neutral-50"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="min-w-0">
                            <div
                              className="text-sm font-semibold leading-relaxed text-neutral-900"
                              style={{
                                fontFamily: "var(--font-heading-sans)",
                              }}
                              title={p.enrollment?.course?.title}
                            >
                              {p.enrollment?.course?.title || "Unknown Course"}
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-[11px] text-neutral-500">
                              <span>
                                {new Date(p.paidAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "2-digit",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                              <span className="text-neutral-300">•</span>
                              <span className="truncate">
                                {p.transactionId}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <div
                            className="text-[13px] font-bold text-primary-800"
                            style={{ fontFamily: "var(--font-heading-sans)" }}
                          >
                            Rs {p.amount.toLocaleString()}
                          </div>
                          <Badge
                            variant="outline"
                            className={`${statusBadgeClass(p.status as PaymentStatus)} scale-90 origin-right shadow-sm px-2`}
                          >
                            <span className="inline-flex items-center gap-1">
                              {p.status === PaymentStatus.PAID ? (
                                <CheckCircle2 size={10} />
                              ) : p.status === PaymentStatus.PENDING ? (
                                <Clock size={10} />
                              ) : p.status === PaymentStatus.FAILED ? (
                                <XCircle size={10} />
                              ) : (
                                <RotateCcw size={10} />
                              )}
                              {statusLabel(p.status as PaymentStatus)}
                            </span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-sm text-neutral-500">
                    No payment records found.
                  </div>
                )}
              </div>
              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-[color:var(--color-neutral-600)]">
                      <th className="py-2 pr-4 font-medium">Transaction ID</th>
                      <th className="py-2 pr-4 font-medium">Course</th>
                      <th className="py-2 pr-4 font-medium">Date</th>
                      <th className="py-2 pr-4 font-medium">Amount</th>
                      <th className="py-2 pr-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 3 }).map((_, idx) => (
                        <tr
                          key={`skeleton-payment-desktop-${idx}`}
                          className="border-t border-[color:var(--color-neutral-200)] animate-pulse"
                        >
                          <td className="py-3 pr-4">
                            <div className="h-4 bg-[color:var(--color-neutral-200)] rounded w-16"></div>
                          </td>
                          <td className="py-3 pr-4">
                            <div className="h-4 bg-[color:var(--color-neutral-200)] rounded w-32"></div>
                          </td>
                          <td className="py-3 pr-4">
                            <div className="h-4 bg-[color:var(--color-neutral-200)] rounded w-24"></div>
                          </td>
                          <td className="py-3 pr-4">
                            <div className="h-4 bg-[color:var(--color-neutral-200)] rounded w-16"></div>
                          </td>
                          <td className="py-3 pr-4">
                            <div className="h-7 bg-[color:var(--color-neutral-200)] rounded-full w-16"></div>
                          </td>
                        </tr>
                      ))
                    ) : payments.length > 0 ? (
                      payments.map((p) => (
                        <tr
                          key={p.id}
                          className="border-t border-[color:var(--color-neutral-200)]"
                        >
                          <td className="py-3 pr-4 font-medium">
                            {p.transactionId}
                          </td>
                          <td
                            className="py-3 pr-4 truncate max-w-[200px]"
                            title={p.enrollment?.course?.title}
                          >
                            {p.enrollment?.course?.title || "Unknown Course"}
                          </td>
                          <td className="py-3 pr-4">
                            {new Date(p.paidAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-3 pr-4 font-semibold text-primary-800">
                            Rs {p.amount.toLocaleString()}
                          </td>
                          <td className="py-3 pr-4">
                            <Badge
                              variant="outline"
                              className={statusBadgeClass(
                                p.status as PaymentStatus,
                              )}
                            >
                              <span className="inline-flex items-center gap-1">
                                {p.status === PaymentStatus.PAID ? (
                                  <CheckCircle2 size={14} />
                                ) : p.status === PaymentStatus.PENDING ? (
                                  <Clock size={14} />
                                ) : p.status === PaymentStatus.FAILED ? (
                                  <XCircle size={14} />
                                ) : (
                                  <RotateCcw size={14} />
                                )}
                                {statusLabel(p.status as PaymentStatus)}
                              </span>
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-10 text-center text-sm text-[color:var(--color-neutral-500)]"
                        >
                          No payment records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {pagination && pagination.total > pageSize && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-neutral-100 mt-4 relative z-10">
                  <p className="text-sm text-neutral-600">
                    Showing {(page - 1) * pageSize + 1}-
                    {Math.min(page * pageSize, pagination.total)} of{" "}
                    {pagination.total}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={page === 1 || loading}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </Button>
                    <div className="text-sm text-neutral-600 hidden sm:block">
                      Page {page} of {Math.ceil(pagination.total / pageSize)}
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={
                        page === Math.ceil(pagination.total / pageSize) ||
                        loading
                      }
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          <Card className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_60%)]" />
            <CardContent className="relative py-5">
              <div
                className="text-sm font-semibold"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                Billing details
              </div>
              <dl className="mt-3 grid grid-cols-1 gap-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-[color:var(--color-neutral-600)]">
                    Student
                  </dt>
                  <dd className="font-medium truncate max-w-[150px]">
                    {student?.firstName || student?.lastName
                      ? `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim()
                      : "You"}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-[color:var(--color-neutral-600)]">
                    Email
                  </dt>
                  <dd className="font-medium truncate max-w-[300px]">
                    {student?.billing?.billingEmail || student?.email || "—"}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-[color:var(--color-neutral-600)]">
                    Address
                  </dt>
                  <dd
                    className="font-medium truncate max-w-[150px]"
                    title={student?.billing?.billingAddress}
                  >
                    {student?.billing?.billingAddress || "—"}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-[color:var(--color-neutral-600)]">
                    Tax ID
                  </dt>
                  <dd className="font-medium">
                    {student?.billing?.billingTaxId || "—"}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-[color:var(--color-neutral-600)]">
                    Currency
                  </dt>
                  <dd className="font-medium">NPR (Rs)</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08),transparent_60%)]" />
            <CardContent className="relative py-5">
              <div
                className="text-sm font-semibold"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                Need help?
              </div>
              <div className="mt-2 text-xs text-[color:var(--color-neutral-600)]">
                Chat with support or browse FAQs.
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="inline-flex items-center gap-2 w-full"
                >
                  <Image
                    src="/images/social-medias/whatsapp.png"
                    alt="WhatsApp"
                    width={16}
                    height={16}
                    className="h-4 w-4"
                  />
                  Chat
                </Button>
                <a href="/faq" className="w-full">
                  <Button size="sm" variant="secondary" className="w-full">
                    FAQ
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </>
  );
}
