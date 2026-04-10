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
  ShieldCheck,
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
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2 text-[color:var(--color-neutral-600)]">
        {icon}
        <span>{label}</span>
      </div>
      <div className="font-medium text-right">{value}</div>
    </div>
  );

  const renderSectionHeader = (title: string, icon?: React.ReactNode) => (
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-neutral-400)] pt-4 pb-2 border-b border-[color:var(--color-neutral-100)] mb-2">
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
          <div className="overflow-auto">
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
                {loading ? (
                  Array.from({ length: pageSize }).map((_, idx) => (
                    <tr key={`skeleton-${idx}`}>
                      {Array.from({ length: 9 }).map((__, tdIdx) => (
                        <td
                          key={`skeleton-td-${tdIdx}`}
                          className="px-4 py-3 border-b border-[color:var(--color-neutral-200)]"
                        >
                          <div className="h-4 bg-neutral-100 animate-pulse rounded w-full"></div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : courses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-8 text-center text-[color:var(--color-neutral-500)]"
                    >
                      No courses found.
                    </td>
                  </tr>
                ) : (
                  courses.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-[color:var(--color-neutral-50)]"
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
                      <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                        {c.studentCount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                        {c.averageReviewRatingCount}
                      </td>
                      <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                        <Badge
                          variant="outline"
                          className={statusBadgeClass(c.status)}
                        >
                          <span className="inline-flex items-center gap-1.5 capitalize">
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
                      <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)] flex gap-2">
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
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4">
            <p className="text-sm text-[color:var(--color-neutral-600)]">
              Showing {total === 0 ? 0 : (page - 1) * pageSize + 1}-
              {Math.min(page * pageSize, total)} of {total}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <Button
                size="sm"
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={prevPage}
                disabled={page === 1 || loading}
              >
                Previous
              </Button>
              <div className="text-sm sm:hidden">
                {page}/{pageCount}
              </div>
              <div className="text-sm hidden sm:block">
                Page {page} of {pageCount}
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={nextPage}
                disabled={page === pageCount || loading}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal
        open={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
        title={selectedCourse ? selectedCourse.title : undefined}
      >
        {selectedCourse && (
          <div className="space-y-6 text-sm max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0 text-sm">
              <div className="space-y-1">
                {renderSectionHeader("General Details", <Info size={14} />)}
                {renderDetailRow(
                  "Status",
                  <Badge
                    variant="outline"
                    className={cn(
                      "px-2 py-0.5",
                      statusBadgeClass(selectedCourse.status),
                    )}
                  >
                    <span className="inline-flex items-center gap-1.5 capitalize">
                      {selectedCourse.status === "PUBLISHED" ? (
                        <CheckCircle2 size={12} />
                      ) : selectedCourse.status === "UNDER_REVIEW" ? (
                        <Clock size={12} />
                      ) : (
                        <XCircle size={12} />
                      )}
                      {selectedCourse.status.replace(/_/g, " ").toLowerCase()}
                    </span>
                  </Badge>,
                  <ShieldCheck size={14} />,
                )}
                {renderDetailRow(
                  "Category",
                  selectedCourse.category?.name || "Uncategorized",
                  <Tag size={14} />,
                )}
                {renderDetailRow(
                  "Level",
                  <Badge
                    className={cn(
                      "font-normal border px-2 py-0",
                      getCourseLevelStyles(selectedCourse.level),
                    )}
                  >
                    {formatLevel(selectedCourse.level)}
                  </Badge>,
                  <Layers size={14} />,
                )}
                {renderDetailRow(
                  "Language",
                  selectedCourse.language || "N/A",
                  <Languages size={14} />,
                )}
                {renderDetailRow(
                  "Type",
                  <span className="capitalize">
                    {selectedCourse.courseType?.toLowerCase() || "N/A"}
                  </span>,
                  <Settings size={14} />,
                )}
              </div>

              <div className="space-y-1">
                {renderSectionHeader(
                  "Schedule & Duration",
                  <Calendar size={14} />,
                )}
                {renderDetailRow(
                  "Duration",
                  formatDuration(
                    selectedCourse.duration,
                    selectedCourse.durationUnit,
                  ),
                  <Timer size={14} />,
                )}
                {renderDetailRow(
                  "Dates",
                  `${formatReadableDate(selectedCourse.startDate)} - ${formatReadableDate(selectedCourse.endDate)}`,
                  null,
                )}
                {renderDetailRow(
                  "Days",
                  formatSchedule(selectedCourse.fromDay, selectedCourse.toDay),
                  null,
                )}
                {renderDetailRow(
                  "Time",
                  `${formatTime(selectedCourse.startTime, selectedCourse.startTimeDesignator)} - ${formatTime(selectedCourse.endTime, selectedCourse.endTimeDesignator)}`,
                  <Clock size={14} />,
                )}
                {selectedCourse.timezone &&
                  renderDetailRow(
                    "Timezone",
                    selectedCourse.timezone,
                    <Globe size={14} />,
                  )}
              </div>

              <div className="space-y-1">
                {renderSectionHeader("Enrollment & Stats", <Users size={14} />)}
                {renderDetailRow(
                  "Students",
                  selectedCourse.studentCount?.toLocaleString() || 0,
                  <Users size={14} />,
                )}
                {renderDetailRow(
                  "Rating",
                  <div className="flex items-center gap-1">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span>
                      {selectedCourse.averageReviewRatingCount} (
                      {selectedCourse.reviewCount || 0})
                    </span>
                  </div>,
                  <BarChart3 size={14} />,
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 pt-4 border-t border-[color:var(--color-neutral-100)] text-xs text-[color:var(--color-neutral-500)]">
              <div className="flex items-center gap-1.5">
                <Calendar size={12} />
                <span>
                  Created: {formatReadableDate(selectedCourse.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={12} />
                <span>
                  Last Updated: {formatReadableDate(selectedCourse.updatedAt)}
                </span>
              </div>
              {selectedCourse.lessonCount && (
                <div className="flex items-center gap-1.5">
                  <Layers size={12} />
                  <span>{selectedCourse.lessonCount} Lessons</span>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
