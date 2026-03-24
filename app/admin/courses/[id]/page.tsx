"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Card, { CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  AlertCircle,
  Users,
  MonitorPlay,
  FileText,
  HelpCircle,
  Layout,
  Link as LinkIcon,
} from "lucide-react";
import CopyButton from "@/components/ui/CopyButton";
import CourseEnrollmentView from "./CourseEnrollmentView";
import { adminCourseService } from "@/lib/services/admin/course";
import {
  Course,
  PublishStatusType,
  CourseType,
  CourseDiscountType,
  CourseSyllabusSectionItemType,
} from "@/lib/services/admin/types";
import CourseReviewView from "./CourseReviewView";

type TabKey = "overview" | "enrollments" | "reviews";

function formatDate(dateString?: string | Date | null) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function statusBadgeClass(status: PublishStatusType | string): string {
  const s = String(status).toUpperCase();
  if (s === "PUBLISHED")
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "UNDER_REVIEW")
    return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-gray-50 text-gray-700 border-gray-200";
}

function getMeetingPlatformLogo(type: string): React.ReactNode {
  const logoSize = 18;
  const typeLower = type.toLowerCase();
  const imageMap: Record<string, string> = {
    zoom: "/images/meeting/zoom.png",
    "google-meet": "/images/meeting/meet.png",
    google_meet: "/images/meeting/meet.png",
    teams: "/images/meeting/teams.png",
    microsoft_teams: "/images/meeting/teams.png",
    custom: "/images/meeting/video-call.png",
    other: "/images/meeting/video-call.png",
  };
  const imageSrc = imageMap[typeLower] || imageMap.custom;

  return (
    <Image
      src={imageSrc}
      alt={type}
      width={logoSize}
      height={logoSize}
      className="object-contain"
    />
  );
}

function getItemIcon(type: CourseSyllabusSectionItemType | string) {
  switch (type) {
    case "LESSON":
      return <MonitorPlay size={14} className="text-blue-500" />;
    case "QUIZ":
      return <HelpCircle size={14} className="text-purple-500" />;
    case "ASSIGNMENT":
      return <FileText size={14} className="text-orange-500" />;
    case "RESOURCE":
      return <LinkIcon size={14} className="text-green-500" />;
    case "GROUP":
      return <Layout size={14} className="text-gray-500" />;
    default:
      return <FileText size={14} className="text-gray-500" />;
  }
}

export default function CourseDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const tab = searchParams.get("tab");

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeTab: TabKey = (
    ["overview", "enrollments", "reviews"] as const
  ).includes((tab || "overview") as TabKey)
    ? ((tab || "overview") as TabKey)
    : "overview";

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await adminCourseService.get(id);
        if (response.success) {
          setCourse(response.data);
        } else {
          setError(response.error.message || "Failed to fetch course details");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Course Details</h1>
        </div>
        <Card>
          <CardContent className="py-0">
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-[color:var(--color-neutral-600)]">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading course...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Course Details</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-8 text-[color:var(--color-neutral-500)]">
              <AlertCircle className="mb-2 h-8 w-8 text-red-500" />
              <p>{error || "Course not found"}</p>
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
              Course Details
            </h1>
            <p className="text-sm text-[color:var(--color-neutral-600)] mt-1">
              ID: {id}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-1">
        <div className="grid grid-cols-3 gap-1">
          {(
            [
              { key: "overview", label: "Overview" },
              { key: "enrollments", label: "Enrollments" },
              { key: "reviews", label: "Reviews" },
            ] as Array<{ key: TabKey; label: string }>
          ).map((t) => (
            <Link
              key={t.key}
              href={`/admin/courses/${id}?tab=${t.key}`}
              className={
                (t.key === activeTab
                  ? "px-3 py-1.5 rounded-md border border-[color:var(--color-primary-200)] text-[color:var(--color-primary-700)] bg-[color:var(--color-primary-50)]"
                  : "px-3 py-1.5 rounded-md border border-[color:var(--color-neutral-200)] text-[color:var(--color-neutral-700)] hover:bg-[color:var(--color-neutral-50)]") +
                " w-full text-center"
              }
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {activeTab === "overview" && (
          <>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="h-16 w-24 overflow-hidden rounded-md ring-1 ring-[color:var(--color-neutral-200)] shadow-sm bg-gray-100 flex items-center justify-center">
                        {course.thumbnailKey ? (
                          <Image
                            src={
                              course.thumbnailKey.startsWith("http")
                                ? course.thumbnailKey
                                : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${course.thumbnailKey}`
                            }
                            alt={course.title}
                            width={96}
                            height={64}
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="text-xs text-gray-400">No Image</div>
                        )}
                      </div>
                      <div>
                        <div className="text-base font-semibold">
                          {course.title}
                        </div>
                        {course.subtitle ? (
                          <div className="text-[12px] text-[color:var(--color-neutral-600)]">
                            {course.subtitle}
                          </div>
                        ) : null}
                        <div className="mt-0.5 text-[color:var(--color-neutral-700)] text-sm">
                          {course.category?.name || "Uncategorized"} •{" "}
                          {course.level} • {course.language}
                        </div>
                        <div className="mt-0.5 text-[11px] text-[color:var(--color-neutral-600)]">
                          Slug: /courses/{course.slug}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={statusBadgeClass(course.status)}
                    >
                      <span className="inline-flex items-center gap-1">
                        {String(course.status).toUpperCase() === "PUBLISHED" ? (
                          <CheckCircle2 size={14} />
                        ) : String(course.status).toUpperCase() ===
                          "UNDER_REVIEW" ? (
                          <Clock size={14} />
                        ) : (
                          <XCircle size={14} />
                        )}
                        {course.status}
                      </span>
                    </Badge>
                  </div>

                  <div className="h-px bg-[color:var(--color-neutral-200)]" />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                      <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                        Course type
                      </div>
                      <div className="mt-1 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
                        {course.courseType === CourseType.FREE
                          ? "Free"
                          : "Paid"}
                      </div>
                    </div>
                    <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                      <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                        Marked price
                      </div>
                      <div className="mt-1 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
                        Rs {course.markedPrice?.toLocaleString() || 0}
                      </div>
                    </div>
                    <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                      <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                        Selling price
                      </div>
                      <div className="mt-1 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
                        Rs {course.sellingPrice?.toLocaleString() || 0}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                      <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                        Discount
                      </div>
                      <div className="mt-1 text-[color:var(--color-neutral-900)] whitespace-nowrap">
                        {course.courseType === CourseType.FREE
                          ? "N/A"
                          : course.discountType ===
                              CourseDiscountType.PERCENTAGE
                            ? `${course.discountValue}%`
                            : `Rs ${course.discountValue?.toLocaleString() || 0}`}
                      </div>
                    </div>
                    <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                      <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                        Tax
                      </div>
                      <div className="mt-1 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
                        {course.isTaxIncluded ? "Included" : "Excluded"}
                      </div>
                    </div>
                    <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                      <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                        Instructor
                      </div>
                      <div className="mt-1 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap flex items-center gap-2">
                        {course.instructor ? (
                          <>
                            {course.instructor.firstName}{" "}
                            {course.instructor.lastName}
                          </>
                        ) : (
                          "N/A"
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                      <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                        Students
                      </div>
                      <div className="mt-1 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap flex items-center gap-2">
                        <Users size={14} className="text-blue-500" />
                        <span>
                          {course.studentCount?.toLocaleString() || 0}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                      <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                        Reviews
                      </div>
                      <div className="mt-1 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap flex items-center gap-2">
                        <Star size={14} className="text-yellow-500" />
                        <span>{course.reviewCount?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                    <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                      <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                        Avg rating
                      </div>
                      <div className="mt-1 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap flex items-center gap-2">
                        <Star size={14} className="text-amber-500" />
                        <span>{course.averageReviewRatingCount || "0.0"}</span>
                      </div>
                    </div>
                    <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
                      <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                        Lessons
                      </div>
                      <div className="mt-1 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap flex items-center gap-2">
                        <MonitorPlay size={14} className="text-indigo-500" />
                        <span>{course.lessonCount ?? 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-sm font-medium text-[color:var(--color-neutral-900)] mb-3">
                      Description
                    </h3>
                    <div className="prose prose-sm max-w-none text-[color:var(--color-neutral-600)]">
                      <p>{course.shortDescription}</p>
                      <div className="mt-4 whitespace-pre-wrap">
                        {course.longDescription}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Syllabus */}
                {course.syllabus &&
                  course.syllabus.sections &&
                  course.syllabus.sections.length > 0 && (
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-sm font-medium text-[color:var(--color-neutral-900)] mb-4">
                          Syllabus
                        </h3>
                        <div className="space-y-4">
                          {course.syllabus.sections.map((section, idx) => (
                            <div
                              key={idx}
                              className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white overflow-hidden"
                            >
                              <div className="bg-[color:var(--color-neutral-50)] px-4 py-3 border-b border-[color:var(--color-neutral-200)] flex justify-between items-center">
                                <span className="font-medium text-sm">
                                  {section.title}
                                </span>
                                <span className="text-xs text-[color:var(--color-neutral-500)]">
                                  {section.items?.length || 0} items
                                </span>
                              </div>
                              <div className="divide-y divide-[color:var(--color-neutral-100)]">
                                {section.items?.map((item, iIdx) => (
                                  <div
                                    key={iIdx}
                                    className="px-4 py-3 flex items-center gap-3 hover:bg-[color:var(--color-neutral-50)]"
                                  >
                                    {getItemIcon(item.type)}
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-medium text-[color:var(--color-neutral-800)]">
                                        {item.title}
                                      </div>
                                      {item.description && (
                                        <div className="text-xs text-[color:var(--color-neutral-500)] truncate">
                                          {item.description}
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-xs text-[color:var(--color-neutral-500)] whitespace-nowrap">
                                      {item.duration}{" "}
                                      {String(item.durationUnit).toLowerCase()}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
              </div>

              <div className="space-y-6">
                {/* Schedule */}
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-sm font-medium text-[color:var(--color-neutral-900)]">
                      Schedule
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-[color:var(--color-neutral-600)]">
                        <Calendar size={16} />
                        <div>
                          <div className="text-[color:var(--color-neutral-900)] font-medium">
                            {formatDate(course.startDate)} -{" "}
                            {formatDate(course.endDate)}
                          </div>
                          <div className="text-xs">Duration</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-[color:var(--color-neutral-600)]">
                        <Clock size={16} />
                        <div>
                          <div className="text-[color:var(--color-neutral-900)] font-medium">
                            {course.startTime} {course.startTimeDesignator} -{" "}
                            {course.endTime} {course.endTimeDesignator}
                          </div>
                          <div className="text-xs">
                            {course.fromDay} - {course.toDay}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Enrollment Stats */}
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-sm font-medium text-[color:var(--color-neutral-900)]">
                      Enrollment
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Occupied</span>
                          <span className="font-medium">
                            {course.occupiedSeatCount} /{" "}
                            {course.seatCapacityCount}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{
                              width: `${Math.min(100, (course.occupiedSeatCount / course.seatCapacityCount) * 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                        <span className="text-gray-600">Available</span>
                        <span className="font-medium">
                          {course.availableSeatCount}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Waitlist</span>
                        <span className="font-medium">
                          {course.waitlistCapacityCount || 0} (
                          {course.isWaitlistApplied ? "Enabled" : "Disabled"})
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Meeting Links */}
                {course.meetingLinks && course.meetingLinks.length > 0 && (
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-sm font-medium text-[color:var(--color-neutral-900)]">
                        Meeting Links
                      </h3>
                      <div className="space-y-3">
                        {course.meetingLinks.map((link, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="mt-0.5">
                              {getMeetingPlatformLogo(link.platform)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-[color:var(--color-neutral-900)]">
                                  {link.platform}
                                </span>
                                {link.isPrimary && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] h-4 px-1"
                                  >
                                    Primary
                                  </Badge>
                                )}
                              </div>
                              <div className="mt-1 flex items-center gap-2">
                                <a
                                  href={link.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="truncate text-xs text-[color:var(--color-primary-600)] hover:underline"
                                >
                                  {link.link}
                                </a>
                                <CopyButton text={link.link} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "enrollments" && <CourseEnrollmentView courseId={id} />}

        {activeTab === "reviews" && <CourseReviewView courseId={id} />}
      </div>
    </div>
  );
}
