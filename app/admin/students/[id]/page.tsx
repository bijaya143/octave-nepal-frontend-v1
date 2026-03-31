"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import Card, { CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Calendar, CheckCircle2, XCircle, AlertCircle, Lock } from "lucide-react";
import { adminStudentService } from "@/lib/services/admin/student";
import { Student } from "@/lib/services/student/types";
import StudentEnrollmentView from "./StudentEnrollmentView";
import StudentPaymentView from "./StudentPaymentView";
import StudentCertificateView from "./StudentCertificateView";

type TabKey =
  | "overview"
  | "enrollments"
  | "payments"
  | "certificates"
  | "activities";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function formatUTCDate(dateString?: string | Date | null) {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}

function statusBadgeClass(isActive: boolean): string {
  return isActive
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-gray-50 text-gray-700 border-gray-200";
}

export default function StudentDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const tab = searchParams.get("tab");

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeTab: TabKey = (
    [
      "overview",
      "enrollments",
      "payments",
      "certificates",
      "activities",
    ] as const
  ).includes((tab || "overview") as TabKey)
    ? ((tab || "overview") as TabKey)
    : "overview";

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await adminStudentService.get(id);
        if (response.success) {
          setStudent(response.data);
        } else {
          setError(response.error.message || "Failed to fetch student details");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudent();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Student Details</h1>
        </div>
        <Card>
          <CardContent className="py-0">
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-[color:var(--color-neutral-600)]">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading student...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Student Details</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-8 text-[color:var(--color-neutral-500)]">
              <AlertCircle className="mb-2 h-8 w-8 text-red-500" />
              <p>{error || "Student not found"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Student Details</h1>
          <p className="text-sm text-[color:var(--color-neutral-600)] mt-1">
            ID: {id}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-1">
        <div className="grid grid-cols-5 gap-1">
          {(
            [
              { key: "overview", label: "Overview", disabled: false },
              { key: "enrollments", label: "Enrollments", disabled: false },
              { key: "payments", label: "Payments", disabled: false },
              { key: "certificates", label: "Certificates", disabled: false },
              { key: "activities", label: "Activities", disabled: true },
            ] as Array<{ key: TabKey; label: string; disabled?: boolean }>
          ).map((t) => {
            if (t.disabled) {
              return (
                <div
                  key={t.key}
                  title="Coming soon"
                  className="flex items-center justify-center gap-1.5 w-full text-center px-3 py-1.5 rounded-md border border-transparent text-[color:var(--color-neutral-400)] bg-[color:var(--color-neutral-50)] cursor-not-allowed select-none"
                >
                  <Lock size={12} className="opacity-70" />
                  <span>{t.label}</span>
                </div>
              );
            }
            return (
              <Link
                key={t.key}
                href={`/admin/students/${id}?tab=${t.key}`}
                className={
                  (t.key === activeTab
                    ? "px-3 py-1.5 rounded-md border border-[color:var(--color-primary-200)] text-[color:var(--color-primary-700)] bg-[color:var(--color-primary-50)]"
                    : "px-3 py-1.5 rounded-md border border-[color:var(--color-neutral-200)] text-[color:var(--color-neutral-700)] hover:bg-[color:var(--color-neutral-50)]") +
                  " w-full text-center"
                }
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {activeTab === "overview" && (
          <>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-16 overflow-hidden rounded-full ring-1 ring-[color:var(--color-neutral-200)] shadow-sm">
                      <Image
                        src={
                          student.profilePictureKey
                            ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${student.profilePictureKey}`
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                [
                                  student.firstName,
                                  student.middleName,
                                  student.lastName,
                                ]
                                  .filter(Boolean)
                                  .join(" ") || student.email,
                              )}&background=random`
                        }
                        alt={
                          [student.firstName, student.lastName]
                            .filter(Boolean)
                            .join(" ") || "Student"
                        }
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <div className="text-base font-semibold">
                        {[
                          student.firstName,
                          student.middleName,
                          student.lastName,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      </div>
                      <div className="mt-0.5 text-[color:var(--color-neutral-700)]">
                        {student.email}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={statusBadgeClass(student.isActive)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {student.isActive ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <XCircle size={14} />
                      )}
                      {student.isActive ? "Active" : "Inactive"}
                    </span>
                  </Badge>
                </div>

                <div className="h-px bg-[color:var(--color-neutral-200)]" />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                    <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                      Courses Enrolled
                    </div>
                    <div className="mt-1 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
                      {student.enrolledCourseCount || 0}
                    </div>
                  </div>
                  <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                    <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                      Joined
                    </div>
                    <div className="mt-1 inline-flex items-center gap-2 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
                      <Calendar size={14} />
                      {student.createdAt
                        ? formatUTCDate(new Date(student.createdAt))
                        : "(Not provided)"}
                    </div>
                  </div>
                  <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                    <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                      Updated
                    </div>
                    <div className="mt-1 inline-flex items-center gap-2 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
                      <Calendar size={14} />
                      {student.updatedAt
                        ? formatUTCDate(new Date(student.updatedAt))
                        : "(Not provided)"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <div className="text-[11px] text-[color:var(--color-neutral-600)] mb-1">
                        Bio
                      </div>
                      <div className="text-[color:var(--color-neutral-800)]">
                        {student.bio || "(No bio)"}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                        <div className="text-[11px] text-[color:var(--color-neutral-600)] mb-1">
                          Contact
                        </div>
                        <div className="space-y-1 text-[color:var(--color-neutral-800)]">
                          <div>
                            <span className="text-[11px] text-[color:var(--color-neutral-600)]">
                              Phone
                            </span>
                            <div className="mt-0.5">
                              {student.phoneNumber
                                ? [
                                    student.phoneCountryCode,
                                    student.phoneNumber,
                                  ]
                                    .filter(Boolean)
                                    .join(" ")
                                : "(Not provided)"}
                            </div>
                          </div>
                          <div>
                            <span className="text-[11px] text-[color:var(--color-neutral-600)]">
                              Address
                            </span>
                            <div className="mt-0.5">
                              {student.address ? (
                                <>
                                  {student.address.addressLine1 && (
                                    <div>{student.address.addressLine1}</div>
                                  )}
                                  {student.address.addressLine2 && (
                                    <div>{student.address.addressLine2}</div>
                                  )}
                                  {(student.address.city ||
                                    student.address.state ||
                                    student.address.zipCode) && (
                                    <div>
                                      {[
                                        student.address.city,
                                        student.address.state,
                                        student.address.zipCode,
                                      ]
                                        .filter(Boolean)
                                        .join(", ")}
                                    </div>
                                  )}
                                  {student.address.country && (
                                    <div>{student.address.country}</div>
                                  )}
                                </>
                              ) : (
                                "(Not provided)"
                              )}
                            </div>
                          </div>
                          <div>
                            <span className="text-[11px] text-[color:var(--color-neutral-600)]">
                              Date of birth
                            </span>
                            <div className="mt-0.5">
                              {student.dateOfBirth || "(Not provided)"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                        <div className="text-[11px] text-[color:var(--color-neutral-600)] mb-1">
                          Account Information
                        </div>
                        <div className="space-y-1 text-[color:var(--color-neutral-800)]">
                          <div>
                            <span className="text-[11px] text-[color:var(--color-neutral-600)]">
                              User type
                            </span>
                            <div className="mt-0.5 capitalize">
                              {student.userType || "(Not provided)"}
                            </div>
                          </div>
                          <div>
                            <span className="text-[11px] text-[color:var(--color-neutral-600)]">
                              Creation method
                            </span>
                            <div className="mt-0.5 capitalize">
                              {student.creationMethod || "(Not provided)"}
                            </div>
                          </div>
                          <div>
                            <span className="text-[11px] text-[color:var(--color-neutral-600)]">
                              Last login
                            </span>
                            <div className="mt-0.5">
                              {student.lastLoginAt
                                ? formatUTCDate(new Date(student.lastLoginAt))
                                : "(Not provided)"}
                            </div>
                          </div>
                          <div>
                            <span className="text-[11px] text-[color:var(--color-neutral-600)]">
                              Created by
                            </span>
                            <div className="mt-0.5">
                              {student.createdBy
                                ? [
                                    student.createdBy.firstName,
                                    student.createdBy.middleName,
                                    student.createdBy.lastName,
                                  ]
                                    .filter(Boolean)
                                    .join(" ") ||
                                  student.createdBy.email ||
                                  student.createdBy.id
                                : "(Not provided)"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-[11px] text-[color:var(--color-neutral-600)] mb-1">
                      Status & Flags
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div
                        className={
                          (student.isActive
                            ? "bg-emerald-50 border-emerald-200"
                            : "bg-gray-50 border-gray-200") +
                          " rounded-md border p-2"
                        }
                        title={
                          student.isActive
                            ? "Active — account is in good standing"
                            : "Inactive — account is disabled"
                        }
                      >
                        <div className="flex items-center gap-1.5">
                          {student.isActive ? (
                            <CheckCircle2
                              size={14}
                              className="text-emerald-600"
                            />
                          ) : (
                            <XCircle size={14} className="text-gray-500" />
                          )}
                          <span className="text-[12px] font-medium text-[color:var(--color-neutral-900)]">
                            {student.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="mt-0.5 text-[11px] text-[color:var(--color-neutral-700)]">
                          {student.isActive
                            ? "Account in good standing"
                            : "Account is disabled"}
                        </div>
                      </div>

                      <div
                        className={
                          (student.isVerified
                            ? "bg-emerald-50 border-emerald-200"
                            : "bg-gray-50 border-gray-200") +
                          " rounded-md border p-2"
                        }
                        title={
                          student.isVerified
                            ? "Verified — identity confirmed"
                            : "Unverified — pending verification"
                        }
                      >
                        <div className="flex items-center gap-1.5">
                          {student.isVerified ? (
                            <CheckCircle2
                              size={14}
                              className="text-emerald-600"
                            />
                          ) : (
                            <XCircle size={14} className="text-gray-500" />
                          )}
                          <span className="text-[12px] font-medium text-[color:var(--color-neutral-900)]">
                            {student.isVerified ? "Verified" : "Unverified"}
                          </span>
                        </div>
                        <div className="mt-0.5 text-[11px] text-[color:var(--color-neutral-700)]">
                          {student.isVerified
                            ? "Identity confirmed"
                            : "Awaiting verification"}
                        </div>
                      </div>

                      <div
                        className={
                          (student.isSuspended
                            ? "bg-red-50 border-red-200"
                            : "bg-emerald-50 border-emerald-200") +
                          " rounded-md border p-2"
                        }
                        title={
                          student.isSuspended
                            ? "Suspended — restricted due to policy"
                            : "Not suspended — in good standing"
                        }
                      >
                        <div className="flex items-center gap-1.5">
                          {student.isSuspended ? (
                            <XCircle size={14} className="text-red-600" />
                          ) : (
                            <CheckCircle2
                              size={14}
                              className="text-emerald-600"
                            />
                          )}
                          <span className="text-[12px] font-medium text-[color:var(--color-neutral-900)]">
                            {student.isSuspended
                              ? "Suspended"
                              : "Not suspended"}
                          </span>
                        </div>
                        <div className="mt-0.5 text-[11px] text-[color:var(--color-neutral-700)]">
                          {student.isSuspended
                            ? "Access restricted"
                            : "In good standing"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {(student.billing?.billingEmail ||
                  student.billing?.billingAddress ||
                  student.billing?.billingTaxId) && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-[11px] text-[color:var(--color-neutral-600)] mb-1">
                        Billing Information
                      </div>
                      <div className="space-y-1 text-[color:var(--color-neutral-800)]">
                        {student.billing?.billingEmail && (
                          <div>
                            <span className="text-[11px] text-[color:var(--color-neutral-600)]">
                              Email:{" "}
                            </span>
                            <span>{student.billing.billingEmail}</span>
                          </div>
                        )}
                        {student.billing?.billingAddress && (
                          <div>
                            <span className="text-[11px] text-[color:var(--color-neutral-600)]">
                              Address:{" "}
                            </span>
                            <span>{student.billing.billingAddress}</span>
                          </div>
                        )}
                        {student.billing?.billingTaxId && (
                          <div>
                            <span className="text-[11px] text-[color:var(--color-neutral-600)]">
                              Tax ID:{" "}
                            </span>
                            <span>{student.billing.billingTaxId}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "enrollments" && (
          <StudentEnrollmentView studentId={student.id} />
        )}

        {activeTab === "payments" && (
          <StudentPaymentView studentId={student.id} />
        )}

        {activeTab === "certificates" && (
          <StudentCertificateView studentId={student.id} />
        )}
      </div>
    </div>
  );
}
