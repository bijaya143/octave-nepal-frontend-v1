"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Card, { CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  BookOpen,
  Shield,
  GraduationCap,
  AlertCircle,
  Clock,
  RotateCcw,
  User,
} from "lucide-react";
import { adminEnrollmentService } from "@/lib/services/admin/enrollment";
import {
  Enrollment,
  EnrollmentStatus,
  PaymentStatus,
} from "@/lib/services/admin/types";

function formatUTCDate(dateString?: string | Date | null) {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  return d.toISOString().split("T")[0];
}

function formatFullDate(dateString?: string | Date | null) {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusBadgeClass(status?: EnrollmentStatus): string {
  const s = String(status).toLowerCase();
  if (s === "active")
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "completed") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-gray-50 text-gray-700 border-gray-200";
}

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

function statusLabel(s?: PaymentStatus) {
  if (s === PaymentStatus.PAID) return "Paid";
  if (s === PaymentStatus.PENDING) return "Pending";
  if (s === PaymentStatus.FAILED) return "Failed";
  if (s === PaymentStatus.REFUNDED) return "Refunded";
  return s ? String(s) : "N/A";
}

export default function EnrollmentDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await adminEnrollmentService.get(id);
        if (response.success) {
          setEnrollment(response.data);
        } else {
          setError(
            response.error.message || "Failed to fetch enrollment details",
          );
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEnrollment();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Enrollment Details</h1>
        </div>
        <Card>
          <CardContent className="py-0">
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-[color:var(--color-neutral-600)]">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading enrollment details...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !enrollment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Enrollment Details</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-8 text-[color:var(--color-neutral-500)]">
              <AlertCircle className="mb-2 h-8 w-8 text-red-500" />
              <p>{error || "Enrollment not found"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">
              Enrollment Details
            </h1>
            <p className="text-sm text-[color:var(--color-neutral-600)] mt-1">
              ID: {id}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Enrollment Overview */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="h-16 w-24 overflow-hidden rounded-md ring-1 ring-[color:var(--color-neutral-200)] shadow-sm bg-gray-50 flex items-center justify-center">
                    {enrollment.course?.thumbnailKey ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${enrollment.course.thumbnailKey}`}
                        alt={enrollment.course.title}
                        width={96}
                        height={64}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="text-[10px] text-gray-400">No Image</div>
                    )}
                  </div>
                  <div>
                    <div className="text-base font-semibold">
                      {enrollment.course?.title || "N/A"}
                    </div>
                    <div className="text-[12px] text-[color:var(--color-neutral-600)]">
                      {enrollment.course?.category?.name || "N/A"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={paymentStatusBadgeClass(
                      enrollment.paymentStatus,
                    )}
                  >
                    <span className="inline-flex items-center gap-1">
                      {enrollment.paymentStatus === PaymentStatus.PAID ? (
                        <CheckCircle2 size={14} />
                      ) : enrollment.paymentStatus === PaymentStatus.PENDING ? (
                        <Clock size={14} />
                      ) : enrollment.paymentStatus === PaymentStatus.FAILED ? (
                        <XCircle size={14} />
                      ) : (
                        <RotateCcw size={14} />
                      )}
                      {statusLabel(enrollment.paymentStatus)}
                    </span>
                  </Badge>
                  <Badge
                    variant="outline"
                    className={statusBadgeClass(enrollment.status)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {enrollment.status === EnrollmentStatus.ACTIVE ? (
                        <CheckCircle2 size={14} />
                      ) : enrollment.status === EnrollmentStatus.COMPLETED ? (
                        <BookOpen size={14} />
                      ) : (
                        <XCircle size={14} />
                      )}
                      {enrollment.status
                        ? enrollment.status.charAt(0) +
                          enrollment.status.slice(1).toLowerCase()
                        : "N/A"}
                    </span>
                  </Badge>
                  <div
                    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                      enrollment.creationMethod === "MANUAL"
                        ? "bg-purple-50 text-purple-700 border border-purple-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {enrollment.creationMethod === "MANUAL" ? (
                      <>
                        <Shield size={12} className="text-purple-600" />
                        <span>Admin</span>
                      </>
                    ) : (
                      <>
                        <GraduationCap size={12} className="text-blue-600" />
                        <span>Self</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="h-px bg-[color:var(--color-neutral-200)]" />

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                  <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                    Progress
                  </div>
                  <div className="mt-1 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
                    {enrollment.progressPercentage || 0}%
                  </div>
                </div>
                <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                  <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                    Amount
                  </div>
                  <div className="mt-1 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
                    Rs {enrollment.amount?.toLocaleString() || 0}
                  </div>
                </div>
                <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                  <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                    Enrolled Date
                  </div>
                  <div className="mt-1 inline-flex items-center gap-2 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
                    <Calendar size={14} />
                    {formatUTCDate(enrollment.createdAt)}
                  </div>
                </div>
                <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                  <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                    Completed Date
                  </div>
                  <div className="mt-1 inline-flex items-center gap-2 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
                    <Clock size={14} />
                    {enrollment.completedAt
                      ? formatUTCDate(enrollment.completedAt)
                      : "Not completed"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                  <div className="text-[11px] text-[color:var(--color-neutral-600)] mb-1">
                    Student Information
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full ring-1 ring-[color:var(--color-neutral-200)] shadow-sm bg-gray-50 flex items-center justify-center">
                      {enrollment.student?.profilePictureKey ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${enrollment.student.profilePictureKey}`}
                          alt={`${enrollment.student.firstName} ${enrollment.student.lastName}`}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <Image
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            [
                              enrollment.student?.firstName,
                              enrollment.student?.middleName,
                              enrollment.student?.lastName,
                            ]
                              .filter(Boolean)
                              .join(" ") ||
                              enrollment.student?.email ||
                              "U",
                          )}&background=random`}
                          alt="Avatar"
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-[color:var(--color-neutral-900)]">
                        {[
                          enrollment.student?.firstName,
                          enrollment.student?.middleName,
                          enrollment.student?.lastName,
                        ]
                          .filter(Boolean)
                          .join(" ") || "N/A"}
                      </div>
                      <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                        {enrollment.student?.email || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                  <div className="text-[11px] text-[color:var(--color-neutral-600)] mb-1">
                    Course Information
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-[color:var(--color-neutral-900)]">
                      {enrollment.course?.title || "N/A"}
                    </div>
                    <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                      {enrollment.course?.category?.name || "N/A"}
                    </div>
                    <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                      Course ID: {enrollment.course?.id || "N/A"}
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                  <div className="text-[11px] text-[color:var(--color-neutral-600)] mb-1">
                    Flags & Status
                  </div>
                  <div className="space-y-1.5 mt-1">
                    <div className="flex items-center gap-2 text-xs">
                      {enrollment.isCertificateCreated ? (
                        <CheckCircle2 size={12} className="text-emerald-500" />
                      ) : (
                        <XCircle size={12} className="text-gray-300" />
                      )}
                      <span className="text-[color:var(--color-neutral-700)]">
                        Certificate Created
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {enrollment.isReviewCreated ? (
                        <CheckCircle2 size={12} className="text-emerald-500" />
                      ) : (
                        <XCircle size={12} className="text-gray-300" />
                      )}
                      <span className="text-[color:var(--color-neutral-700)]">
                        Review Submitted
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-[color:var(--color-neutral-200)]" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                  <div className="text-[11px] text-[color:var(--color-neutral-600)] mb-1">
                    System Information
                  </div>
                  <div className="space-y-1 mt-1">
                    <div className="flex items-center gap-2 text-xs text-[color:var(--color-neutral-700)]">
                      <User
                        size={14}
                        className="text-[color:var(--color-neutral-400)]"
                      />
                      <span>
                        Created by:{" "}
                        {enrollment.createdBy
                          ? `${enrollment.createdBy.firstName || ""} ${enrollment.createdBy.lastName || ""}`.trim() ||
                            enrollment.createdBy.email
                          : enrollment.creationMethod === "AUTOMATIC"
                            ? "System (Automatic)"
                            : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[color:var(--color-neutral-700)]">
                      <Clock
                        size={14}
                        className="text-[color:var(--color-neutral-400)]"
                      />
                      <span>
                        Last updated: {formatFullDate(enrollment.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
