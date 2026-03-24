"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Card, { CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Calendar, CheckCircle2, XCircle } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { adminInstructorService } from "@/lib/services/admin/instructor";
import { Instructor } from "@/lib/services/instructor/types";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function formatUTCDate(d: Date) {
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}

const statusBadgeClass = (isActive: boolean) => {
  return isActive
    ? "bg-green-50 text-green-600 ring-green-600/20"
    : "bg-red-50 text-red-600 ring-red-600/20";
};

type TabKey = "overview" | "courses" | "payouts" | "activities";

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const tab = searchParams.get("tab");

  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        setLoading(true);
        const response = await adminInstructorService.get(id);
        if (response.success) {
          setInstructor(response.data);
        } else {
          setError(
            response.error?.message || "Failed to fetch instructor details",
          );
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInstructor();
    }
  }, [id]);

  const tabParam = (tab || "overview").toString().toLowerCase();
  const activeTab: TabKey = (
    ["overview", "courses", "payouts", "activities"] as const
  ).includes(tabParam as TabKey)
    ? (tabParam as TabKey)
    : "overview";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">
            Instructor Details
          </h1>
          <p className="text-sm text-[color:var(--color-neutral-600)] mt-1">
            ID: {id}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-1">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
          {(
            [
              { key: "overview", label: "Overview" },
              { key: "courses", label: "Courses" },
              { key: "payouts", label: "Payouts" },
              { key: "activities", label: "Recent activities" },
            ] as Array<{ key: TabKey; label: string }>
          ).map((t) => (
            <Link
              key={t.key}
              href={`/admin/instructors/${id}?tab=${t.key}`}
              className={
                t.key === activeTab
                  ? "w-full text-center px-3 py-1.5 rounded-md border border-[color:var(--color-primary-200)] text-[color:var(--color-primary-700)] bg-[color:var(--color-primary-50)]"
                  : "w-full text-center px-3 py-1.5 rounded-md border border-[color:var(--color-neutral-200)] text-[color:var(--color-neutral-700)] hover:bg-[color:var(--color-neutral-50)]"
              }
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-[color:var(--color-neutral-700)]">
              Loading instructor details...
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-red-500">{error}</div>
          </CardContent>
        </Card>
      ) : !instructor ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-[color:var(--color-neutral-700)]">
              Instructor not found.
            </div>
          </CardContent>
        </Card>
      ) : (
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
                            instructor.profilePictureKey
                              ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${instructor.profilePictureKey}`
                              : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  [
                                    instructor.firstName,
                                    instructor.middleName,
                                    instructor.lastName,
                                  ]
                                    .filter(Boolean)
                                    .join(" ") || instructor.email,
                                )}&background=random`
                          }
                          alt={
                            [instructor.firstName, instructor.lastName]
                              .filter(Boolean)
                              .join(" ") || "Instructor"
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
                            instructor.firstName,
                            instructor.middleName,
                            instructor.lastName,
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        </div>
                        <div className="mt-0.5 text-[color:var(--color-neutral-700)]">
                          {instructor.email}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={statusBadgeClass(instructor.isActive)}
                    >
                      <span className="inline-flex items-center gap-1">
                        {instructor.isActive ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <XCircle size={14} />
                        )}
                        {instructor.isActive ? "Active" : "Inactive"}
                      </span>
                    </Badge>
                  </div>

                  <div className="h-px bg-[color:var(--color-neutral-200)]" />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                      <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                        Courses
                      </div>
                      <div className="mt-1 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
                        {instructor.courseCount}
                      </div>
                    </div>
                    <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                      <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                        Joined
                      </div>
                      <div className="mt-1 inline-flex items-center gap-2 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
                        <Calendar size={14} />
                        {instructor.createdAt
                          ? formatUTCDate(new Date(instructor.createdAt))
                          : "(Not provided)"}
                      </div>
                    </div>
                    <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                      <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                        Updated
                      </div>
                      <div className="mt-1 inline-flex items-center gap-2 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
                        <Calendar size={14} />
                        {instructor.updatedAt
                          ? formatUTCDate(new Date(instructor.updatedAt))
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
                          {instructor.bio || "(No bio)"}
                        </div>
                      </div>

                      <div className="h-px bg-[color:var(--color-neutral-200)]" />

                      <div>
                        <div className="text-[11px] text-[color:var(--color-neutral-600)] mb-1">
                          Skills
                        </div>
                        {instructor.skills && instructor.skills.length === 0 ? (
                          <div className="text-[color:var(--color-neutral-600)]">
                            (No skills)
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {instructor.skills?.map((s) => (
                              <Badge
                                key={s}
                                variant="outline"
                                className="text-[11px]"
                              >
                                {s}
                              </Badge>
                            ))}
                          </div>
                        )}
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
                                {instructor.phoneNumber
                                  ? [
                                      instructor.phoneCountryCode,
                                      instructor.phoneNumber,
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
                                {instructor.address ? (
                                  <>
                                    {instructor.address.addressLine1 && (
                                      <div>
                                        {instructor.address.addressLine1}
                                      </div>
                                    )}
                                    {instructor.address.addressLine2 && (
                                      <div>
                                        {instructor.address.addressLine2}
                                      </div>
                                    )}
                                    {(instructor.address.city ||
                                      instructor.address.state ||
                                      instructor.address.zipCode) && (
                                      <div>
                                        {[
                                          instructor.address.city,
                                          instructor.address.state,
                                          instructor.address.zipCode,
                                        ]
                                          .filter(Boolean)
                                          .join(", ")}
                                      </div>
                                    )}
                                    {instructor.address.country && (
                                      <div>{instructor.address.country}</div>
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
                                {instructor.dateOfBirth || "(Not provided)"}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                          <div className="text-[11px] text-[color:var(--color-neutral-600)] mb-1">
                            Role & Experience
                          </div>
                          <div className="space-y-1 text-[color:var(--color-neutral-800)]">
                            <div>
                              <span className="text-[11px] text-[color:var(--color-neutral-600)]">
                                Role
                              </span>
                              <div className="mt-0.5">
                                {instructor.role || "(Not provided)"}
                              </div>
                            </div>
                            <div>
                              <span className="text-[11px] text-[color:var(--color-neutral-600)]">
                                Experience
                              </span>
                              <div className="mt-0.5">
                                {instructor.experienceInYears
                                  ? `${instructor.experienceInYears} years`
                                  : "(Not provided)"}
                              </div>
                            </div>
                            <div>
                              <span className="text-[11px] text-[color:var(--color-neutral-600)]">
                                User type
                              </span>
                              <div className="mt-0.5">
                                {instructor.userType || "(Not provided)"}
                              </div>
                            </div>
                            <div>
                              <span className="text-[11px] text-[color:var(--color-neutral-600)]">
                                Creation method
                              </span>
                              <div className="mt-0.5">
                                {instructor.creationMethod || "(Not provided)"}
                              </div>
                            </div>
                            <div>
                              <span className="text-[11px] text-[color:var(--color-neutral-600)]">
                                Last login
                              </span>
                              <div className="mt-0.5">
                                {instructor.lastLoginAt
                                  ? formatUTCDate(
                                      new Date(instructor.lastLoginAt),
                                    )
                                  : "(Not provided)"}
                              </div>
                            </div>
                            <div>
                              <span className="text-[11px] text-[color:var(--color-neutral-600)]">
                                Created by
                              </span>
                              <div className="mt-0.5">
                                {instructor.createdBy
                                  ? [
                                      instructor.createdBy.firstName,
                                      instructor.createdBy.middleName,
                                      instructor.createdBy.lastName,
                                    ]
                                      .filter(Boolean)
                                      .join(" ") ||
                                    instructor.createdBy.email ||
                                    instructor.createdBy.id
                                  : "(Not provided)"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 space-y-3">
                      <div className="text-[11px] text-[color:var(--color-neutral-600)] mb-1">
                        Social Links
                      </div>
                      {instructor.socialLinks &&
                      instructor.socialLinks.length > 0 ? (
                        <ul className="space-y-1">
                          {instructor.socialLinks?.map((link, index) => (
                            <li
                              key={index}
                              className="flex items-center justify-between gap-2"
                            >
                              <span className="text-[color:var(--color-neutral-800)]">
                                {link.name}
                              </span>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[color:var(--color-primary-700)] hover:underline break-all"
                              >
                                {link.url}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-[color:var(--color-neutral-600)]">
                          (No social links)
                        </div>
                      )}
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
                            (instructor.isActive
                              ? "bg-emerald-50 border-emerald-200"
                              : "bg-gray-50 border-gray-200") +
                            " rounded-md border p-2"
                          }
                          title={
                            instructor.isActive
                              ? "Active — listed and enrollable"
                              : "Inactive — hidden from listings"
                          }
                        >
                          <div className="flex items-center gap-1.5">
                            {instructor.isActive ? (
                              <CheckCircle2
                                size={14}
                                className="text-emerald-600"
                              />
                            ) : (
                              <XCircle size={14} className="text-gray-500" />
                            )}
                            <span className="text-[12px] font-medium text-[color:var(--color-neutral-900)]">
                              {instructor.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <div className="mt-0.5 text-[11px] text-[color:var(--color-neutral-700)]">
                            {instructor.isActive
                              ? "Listed and enrollable"
                              : "Hidden from listings; enrollments disabled"}
                          </div>
                        </div>

                        <div
                          className={
                            (instructor.isVerified
                              ? "bg-emerald-50 border-emerald-200"
                              : "bg-gray-50 border-gray-200") +
                            " rounded-md border p-2"
                          }
                          title={
                            instructor.isVerified
                              ? "Verified — identity confirmed"
                              : "Unverified — pending verification"
                          }
                        >
                          <div className="flex items-center gap-1.5">
                            {instructor.isVerified ? (
                              <CheckCircle2
                                size={14}
                                className="text-emerald-600"
                              />
                            ) : (
                              <XCircle size={14} className="text-gray-500" />
                            )}
                            <span className="text-[12px] font-medium text-[color:var(--color-neutral-900)]">
                              {instructor.isVerified
                                ? "Verified"
                                : "Unverified"}
                            </span>
                          </div>
                          <div className="mt-0.5 text-[11px] text-[color:var(--color-neutral-700)]">
                            {instructor.isVerified
                              ? "Identity confirmed"
                              : "Awaiting verification"}
                          </div>
                        </div>

                        <div
                          className={
                            (instructor.isSuspended
                              ? "bg-red-50 border-red-200"
                              : "bg-emerald-50 border-emerald-200") +
                            " rounded-md border p-2"
                          }
                          title={
                            instructor.isSuspended
                              ? "Suspended — restricted due to policy"
                              : "Not suspended — in good standing"
                          }
                        >
                          <div className="flex items-center gap-1.5">
                            {instructor.isSuspended ? (
                              <XCircle size={14} className="text-red-600" />
                            ) : (
                              <CheckCircle2
                                size={14}
                                className="text-emerald-600"
                              />
                            )}
                            <span className="text-[12px] font-medium text-[color:var(--color-neutral-900)]">
                              {instructor.isSuspended
                                ? "Suspended"
                                : "Not suspended"}
                            </span>
                          </div>
                          <div className="mt-0.5 text-[11px] text-[color:var(--color-neutral-700)]">
                            {instructor.isSuspended
                              ? "Access restricted"
                              : "In good standing"}
                          </div>
                        </div>

                        <div
                          className={
                            (instructor.isFeatured
                              ? "bg-amber-50 border-amber-200"
                              : "bg-gray-50 border-gray-200") +
                            " rounded-md border p-2"
                          }
                          title={
                            instructor.isFeatured
                              ? "Featured — highlighted in discovery"
                              : "Not featured — standard visibility"
                          }
                        >
                          <div className="flex items-center gap-1.5">
                            {instructor.isFeatured ? (
                              <CheckCircle2
                                size={14}
                                className="text-amber-600"
                              />
                            ) : (
                              <XCircle size={14} className="text-gray-500" />
                            )}
                            <span className="text-[12px] font-medium text-[color:var(--color-neutral-900)]">
                              {instructor.isFeatured
                                ? "Featured"
                                : "Not featured"}
                            </span>
                          </div>
                          <div className="mt-0.5 text-[11px] text-[color:var(--color-neutral-700)]">
                            {instructor.isFeatured
                              ? "Highlighted in discovery"
                              : "Standard visibility"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {(instructor.billing?.billingEmail ||
                    instructor.billing?.billingAddress ||
                    instructor.billing?.billingTaxId ||
                    instructor.billing?.billingPaymentMethod) && (
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-[11px] text-[color:var(--color-neutral-600)] mb-1">
                          Billing Information
                        </div>
                        <div className="space-y-1 text-[color:var(--color-neutral-800)]">
                          {instructor.billing?.billingEmail && (
                            <div>
                              <span className="text-[11px] text-[color:var(--color-neutral-600)]">
                                Email:{" "}
                              </span>
                              <span>{instructor.billing.billingEmail}</span>
                            </div>
                          )}
                          {instructor.billing?.billingAddress && (
                            <div>
                              <span className="text-[11px] text-[color:var(--color-neutral-600)]">
                                Address:{" "}
                              </span>
                              <span>{instructor.billing.billingAddress}</span>
                            </div>
                          )}
                          {instructor.billing?.billingTaxId && (
                            <div>
                              <span className="text-[11px] text-[color:var(--color-neutral-600)]">
                                Tax ID:{" "}
                              </span>
                              <span>{instructor.billing.billingTaxId}</span>
                            </div>
                          )}
                          {instructor.billing?.billingPaymentMethod && (
                            <div>
                              <span className="text-[11px] text-[color:var(--color-neutral-600)]">
                                Payment Method:{" "}
                              </span>
                              <span className="capitalize">
                                {instructor.billing.billingPaymentMethod.replace(
                                  "_",
                                  " ",
                                )}
                              </span>
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
        </div>
      )}
    </div>
  );
}
