"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { cn } from "@/lib/cn";
import {
  CheckCircle2,
  CirclePlay,
  Clock,
  XCircle,
  Languages,
  Calendar,
  Users,
  BarChart3,
  Info,
  Tag,
  Layers,
  Timer,
  Star,
  Settings,
  Globe,
} from "lucide-react";

import { instructorCourseService } from "@/lib/services/instructor";
import { Course } from "@/lib/services/admin/types";
import { PaginationOutput } from "@/lib/services/common-types";

export default function InstructorCoursesPage() {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [meta, setMeta] = React.useState<PaginationOutput>({
    page: 1,
    limit: 10,
    total: 0,
  });

  const [page, setPage] = React.useState(1);
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(
    null,
  );
  const pageSize = 10;
  const total = meta.total || 0;
  const pageCount = Math.max(1, Math.ceil(total / (meta.limit || pageSize)));

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await instructorCourseService.list({
          page,
          limit: pageSize,
        });
        if (res.success) {
          setCourses(res.data.data || []);
          setMeta(res.data.meta);
        } else {
          setError(res.error?.message || "Failed to load courses.");
        }
      } catch (e: any) {
        setError(e.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [page]);

  const nextPage = () => setPage((p) => Math.min(p + 1, pageCount));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));

  const statusBadgeClass = (status?: string) => {
    if (!status) return "bg-gray-50 text-gray-700 border-gray-200";
    const s = status.toUpperCase();
    if (s === "PUBLISHED")
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (s === "UNDER_REVIEW")
      return "bg-amber-50 text-amber-700 border-amber-200";
    if (s === "UNPUBLISHED") return "bg-gray-50 text-gray-700 border-gray-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getCourseLevelStyles = (level?: string) => {
    switch (level?.toUpperCase()) {
      case "BEGINNER":
        return "border-emerald-200 text-emerald-700 bg-emerald-50";
      case "INTERMEDIATE":
        return "border-indigo-200 text-indigo-700 bg-indigo-50";
      case "ADVANCED":
        return "border-rose-200 text-rose-700 bg-rose-50";
      default:
        return "border-[color:var(--color-neutral-200)] text-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-50)]";
    }
  };

  const formatLevel = (level?: string) => {
    if (!level) return "";
    return level.charAt(0) + level.slice(1).toLowerCase();
  };

  const isCourseOngoing = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  const formatReadableDate = (isoDate?: string | Date) => {
    if (!isoDate) return "";
    const dt = new Date(isoDate);
    return dt.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDuration = (val: number, unit: string) => {
    return `${val} ${unit.toLowerCase()}${val > 1 ? "s" : ""}`;
  };

  const formatTime = (time: string, designator: string) => {
    if (!time) return "";
    return `${time} ${designator}`;
  };

  const formatSchedule = (from: string, to: string) => {
    if (!from || !to) return from || to || "N/A";
    if (from === to) return from.charAt(0) + from.slice(1).toLowerCase();
    return `${from.charAt(0) + from.slice(1).toLowerCase()} - ${
      to.charAt(0) + to.slice(1).toLowerCase()
    }`;
  };

  const renderDetailRow = (
    label: string,
    value: React.ReactNode,
    icon?: React.ReactNode,
  ) => (
    <div className="flex items-start justify-between gap-3 py-2">
      <div className="flex items-center gap-1.5 text-[color:var(--color-neutral-500)] shrink-0">
        {icon && (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[color:var(--color-neutral-100)] text-[color:var(--color-neutral-500)]">
            {icon}
          </span>
        )}
        <span className="text-xs font-medium text-[color:var(--color-neutral-500)]">
          {label}
        </span>
      </div>
      <div className="font-medium text-right text-[color:var(--color-neutral-900)] text-sm leading-snug">
        {value}
      </div>
    </div>
  );

  const renderSectionHeader = (title: string, icon?: React.ReactNode) => (
    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-neutral-400)] pb-2 mb-1">
      {icon}
      {title}
    </div>
  );

  return (
    <>
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h1
            className="text-xl md:text-2xl font-semibold"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            Your Courses
          </h1>
          <p className="text-sm text-[color:var(--color-neutral-600)]">
            Manage and review your courses
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="py-0">
          {loading ? (
            <>
              {/* Desktop Skeleton */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                        Title
                      </th>
                      <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                        Category
                      </th>
                      <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                        Level
                      </th>
                      <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                        Students
                      </th>
                      <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                        Rating
                      </th>
                      <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                        Status
                      </th>
                      <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                        Updated
                      </th>
                      <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: pageSize }).map((_, idx) => (
                      <tr key={`skeleton-desktop-${idx}`}>
                        {Array.from({ length: 8 }).map((__, tdIdx) => (
                          <td
                            key={`skeleton-td-${tdIdx}`}
                            className="px-4 py-3 border-b border-[color:var(--color-neutral-200)]"
                          >
                            <div className="h-4 bg-neutral-100 animate-pulse rounded w-full"></div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile & Tablet Skeleton */}
              <div className="lg:hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 md:px-0 -mx-6 md:mx-0">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={`skeleton-mobile-${idx}`}
                      className="px-6 py-4 animate-pulse border-t border-[color:var(--color-neutral-100)] md:border md:rounded-xl md:bg-white"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="space-y-3 flex-1">
                          <div className="h-4 bg-neutral-100 rounded w-3/4"></div>
                          <div className="flex gap-2">
                            <div className="h-5 bg-neutral-100 rounded-full w-20"></div>
                            <div className="h-5 bg-neutral-100 rounded-full w-16"></div>
                          </div>
                        </div>
                        <div className="h-6 bg-neutral-100 rounded-full w-24"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : courses.length === 0 ? (
            <div className="px-4 py-12 text-center text-[color:var(--color-neutral-500)] border-t border-[color:var(--color-neutral-200)]">
              No courses found.
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                        Title
                      </th>
                      <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                        Category
                      </th>
                      <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                        Level
                      </th>
                      <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                        Students
                      </th>
                      <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                        Rating
                      </th>
                      <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                        Status
                      </th>
                      <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                        Updated
                      </th>
                      <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((c) => (
                      <tr
                        key={c.id}
                        className="hover:bg-[color:var(--color-neutral-50)] transition-colors"
                      >
                        <td className="px-6 py-3 border-b border-[color:var(--color-neutral-200)]">
                          <div
                            className="font-medium truncate max-w-[260px]"
                            title={c.title}
                          >
                            {c.title}
                          </div>
                        </td>
                        <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                          {c.category?.name || "Uncategorized"}
                        </td>
                        <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                          <Badge
                            className={cn(
                              "font-normal border",
                              getCourseLevelStyles(c.level),
                            )}
                          >
                            {formatLevel(c.level)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)] text-center sm:text-left">
                          {c.studentCount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                          <div className="flex items-center gap-1">
                            <Star
                              size={12}
                              className="fill-amber-400 text-amber-400"
                            />
                            <span>{c.averageReviewRatingCount}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                          <Badge
                            variant="outline"
                            className={statusBadgeClass(c.status)}
                          >
                            <span className="inline-flex items-center gap-1.5 capitalize whitespace-nowrap">
                              {c.status === "PUBLISHED" ? (
                                <CheckCircle2 size={14} />
                              ) : c.status === "UNDER_REVIEW" ? (
                                <Clock size={14} />
                              ) : (
                                <XCircle size={14} />
                              )}
                              {c.status.replace(/_/g, " ").toLowerCase()}
                            </span>
                          </Badge>
                        </td>
                        <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)] whitespace-nowrap">
                          {formatReadableDate(c.updatedAt)}
                        </td>
                        <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                          <div className="flex items-center gap-2">
                            {(() => {
                              const meetingLink =
                                c.meetingLinks.find((l) => l.isPrimary)?.link ||
                                c.meetingLinks[0]?.link;

                              if (
                                isCourseOngoing(c.startDate, c.endDate) &&
                                meetingLink
                              ) {
                                return (
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() =>
                                      window.open(meetingLink, "_blank")
                                    }
                                  >
                                    <CirclePlay size={14} className="mr-1" />
                                    Join
                                  </Button>
                                );
                              }
                              return null;
                            })()}

                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setSelectedCourse(c)}
                            >
                              View
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile & Tablet list view */}
              <div className="lg:hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 md:px-0 -mx-6 md:mx-0">
                  {courses.map((c) => (
                    <div
                      key={c.id}
                      className="px-6 py-5 hover:bg-[color:var(--color-neutral-50)] transition-colors border-t border-[color:var(--color-neutral-100)] md:border md:rounded-xl md:bg-white md:shadow-sm"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div
                              className="font-semibold text-[15px] leading-tight text-neutral-900 line-clamp-2"
                              title={c.title}
                            >
                              {c.title}
                            </div>
                            <div className="flex flex-wrap gap-2 items-center">
                              <span className="text-[11px] font-medium text-[color:var(--color-neutral-500)] uppercase tracking-wider">
                                {c.category?.name || "Uncategorized"}
                              </span>
                              <span className="text-[color:var(--color-neutral-300)]">
                                •
                              </span>
                              <Badge
                                className={cn(
                                  "font-normal border scale-90 origin-left h-5 px-2",
                                  getCourseLevelStyles(c.level),
                                )}
                              >
                                {formatLevel(c.level)}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "shrink-0 py-0.5 px-2",
                                  statusBadgeClass(c.status),
                                )}
                              >
                                <span className="inline-flex items-center gap-1.5 capitalize text-[10px] font-semibold">
                                  {c.status === "PUBLISHED" ? (
                                    <CheckCircle2 size={10} />
                                  ) : c.status === "UNDER_REVIEW" ? (
                                    <Clock size={10} />
                                  ) : (
                                    <XCircle size={10} />
                                  )}
                                  {c.status.replace(/_/g, " ").toLowerCase()}
                                </span>
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs font-medium text-[color:var(--color-neutral-600)]">
                            <div className="flex items-center gap-1.5">
                              <Users
                                size={14}
                                className="text-[color:var(--color-neutral-400)]"
                              />
                              <span>{c.studentCount.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Star
                                size={14}
                                className="fill-amber-400 text-amber-400"
                              />
                              <span>{c.averageReviewRatingCount}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {(() => {
                              const meetingLink =
                                c.meetingLinks.find((l) => l.isPrimary)?.link ||
                                c.meetingLinks[0]?.link;
                              if (
                                isCourseOngoing(c.startDate, c.endDate) &&
                                meetingLink
                              ) {
                                return (
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    className="h-8 text-[11px] px-3 font-semibold"
                                    onClick={() =>
                                      window.open(meetingLink, "_blank")
                                    }
                                  >
                                    <CirclePlay size={14} className="mr-1" />
                                    Join
                                  </Button>
                                );
                              }
                              return null;
                            })()}
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-8 text-[11px] px-3 font-semibold"
                              onClick={() => setSelectedCourse(c)}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Pagination Controls */}
          {total > pageSize && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-[color:var(--color-neutral-100)]">
              <p className="text-sm text-[color:var(--color-neutral-500)] text-center sm:text-left">
                Showing{" "}
                <span className="font-medium text-[color:var(--color-neutral-900)]">
                  {total === 0 ? 0 : (page - 1) * pageSize + 1}-
                  {Math.min(page * pageSize, total)}
                </span>{" "}
                of {total}
              </p>
              <div className="flex items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 px-3"
                  onClick={prevPage}
                  disabled={page === 1 || loading}
                >
                  Previous
                </Button>
                <div className="text-sm font-medium text-[color:var(--color-neutral-600)] px-1 whitespace-nowrap">
                  {page} of {pageCount}
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 px-3"
                  onClick={nextPage}
                  disabled={page === pageCount || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        open={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
        title={selectedCourse ? selectedCourse.title : undefined}
      >
        {selectedCourse && (
          <div className="text-sm max-h-[72vh] overflow-y-auto custom-scrollbar">
            {/* Status banner */}
            <div className="flex flex-wrap items-center gap-2 mb-5 pb-4 border-b border-[color:var(--color-neutral-100)]">
              <Badge
                variant="outline"
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold capitalize rounded-full",
                  statusBadgeClass(selectedCourse.status),
                )}
              >
                {selectedCourse.status === "PUBLISHED" ? (
                  <CheckCircle2 size={11} />
                ) : selectedCourse.status === "UNDER_REVIEW" ? (
                  <Clock size={11} />
                ) : (
                  <XCircle size={11} />
                )}
                {selectedCourse.status.replace(/_/g, " ").toLowerCase()}
              </Badge>
              <Badge
                className={cn(
                  "font-semibold border px-2.5 py-1 text-xs rounded-full",
                  getCourseLevelStyles(selectedCourse.level),
                )}
              >
                {formatLevel(selectedCourse.level)}
              </Badge>
              {selectedCourse.language && (
                <span className="inline-flex items-center gap-1 text-xs text-[color:var(--color-neutral-500)] bg-[color:var(--color-neutral-100)] px-2.5 py-1 rounded-full font-medium">
                  <Languages size={11} />
                  {selectedCourse.language}
                </span>
              )}
              {selectedCourse.lessonCount ? (
                <span className="inline-flex items-center gap-1 text-xs text-[color:var(--color-neutral-500)] bg-[color:var(--color-neutral-100)] px-2.5 py-1 rounded-full font-medium">
                  <Layers size={11} />
                  {selectedCourse.lessonCount} Lessons
                </span>
              ) : null}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* General Details card */}
              <div className="rounded-xl border border-[color:var(--color-neutral-100)] bg-[color:var(--color-neutral-50)] p-4">
                {renderSectionHeader("General Details", <Info size={11} />)}
                <div className="divide-y divide-[color:var(--color-neutral-100)]">
                  {renderDetailRow(
                    "Category",
                    selectedCourse.category?.name || "Uncategorized",
                    <Tag size={12} />,
                  )}
                  {renderDetailRow(
                    "Type",
                    <span className="capitalize">
                      {selectedCourse.courseType?.toLowerCase() || "N/A"}
                    </span>,
                    <Settings size={12} />,
                  )}
                </div>
              </div>

              {/* Enrollment & Stats card */}
              <div className="rounded-xl border border-[color:var(--color-neutral-100)] bg-[color:var(--color-neutral-50)] p-4">
                {renderSectionHeader("Stats", <BarChart3 size={11} />)}
                <div className="divide-y divide-[color:var(--color-neutral-100)]">
                  {renderDetailRow(
                    "Students",
                    <span className="font-semibold text-[color:var(--color-neutral-900)]">
                      {selectedCourse.studentCount?.toLocaleString() || "0"}
                    </span>,
                    <Users size={12} />,
                  )}
                  {renderDetailRow(
                    "Rating",
                    <span className="inline-flex items-center gap-1 font-semibold text-[color:var(--color-neutral-900)]">
                      <Star
                        size={12}
                        className="fill-amber-400 text-amber-400"
                      />
                      {selectedCourse.averageReviewRatingCount}
                      <span className="font-normal text-[color:var(--color-neutral-400)] text-xs">
                        ({selectedCourse.reviewCount || 0} reviews)
                      </span>
                    </span>,
                    <BarChart3 size={12} />,
                  )}
                </div>
              </div>

              {/* Schedule & Duration card — full width */}
              <div className="sm:col-span-2 rounded-xl border border-[color:var(--color-neutral-100)] bg-[color:var(--color-neutral-50)] p-4">
                {renderSectionHeader(
                  "Schedule & Duration",
                  <Calendar size={11} />,
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[color:var(--color-neutral-100)]">
                  <div className="sm:pr-4 divide-y divide-[color:var(--color-neutral-100)]">
                    {renderDetailRow(
                      "Duration",
                      formatDuration(
                        selectedCourse.duration,
                        selectedCourse.durationUnit,
                      ),
                      <Timer size={12} />,
                    )}
                    {renderDetailRow(
                      "Start Date",
                      <span className="text-right">
                        {formatReadableDate(selectedCourse.startDate)}
                      </span>,
                      <Calendar size={12} />,
                    )}
                    {renderDetailRow(
                      "End Date",
                      <span className="text-right">
                        {formatReadableDate(selectedCourse.endDate)}
                      </span>,
                      <Calendar size={12} />,
                    )}
                  </div>
                  <div className="sm:pl-4 pt-2 sm:pt-0 divide-y divide-[color:var(--color-neutral-100)]">
                    {renderDetailRow(
                      "Days",
                      formatSchedule(
                        selectedCourse.fromDay,
                        selectedCourse.toDay,
                      ),
                      <Clock size={12} />,
                    )}
                    {renderDetailRow(
                      "Time",
                      `${formatTime(selectedCourse.startTime, selectedCourse.startTimeDesignator)} – ${formatTime(selectedCourse.endTime, selectedCourse.endTimeDesignator)}`,
                      <Clock size={12} />,
                    )}
                    {selectedCourse.timezone &&
                      renderDetailRow(
                        "Timezone",
                        selectedCourse.timezone,
                        <Globe size={12} />,
                      )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer metadata */}
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4 pt-4 border-t border-[color:var(--color-neutral-100)]">
              <span className="inline-flex items-center gap-1.5 text-xs text-[color:var(--color-neutral-400)]">
                <Calendar size={11} />
                Created {formatReadableDate(selectedCourse.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-[color:var(--color-neutral-400)]">
                <Clock size={11} />
                Updated {formatReadableDate(selectedCourse.updatedAt)}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
