"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { BookOpen, Hammer, Award, CalendarClock } from "lucide-react";
import Image from "next/image";
import { studentEnrollmentService } from "@/lib/services/student/enrollment";
import { Enrollment } from "@/lib/services/admin/types";
import StudentCourseCertificateViewModal from "./StudentCourseCertificateViewModal";
import StudentCourseReviewModal from "./StudentCourseReviewModal";

const getCourseLevelStyles = (level: string) => {
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

const getMeetingPlatformInfo = (platform?: string) => {
  switch (platform) {
    case "GOOGLE_MEET":
      return { label: "Google Meet", icon: "/images/meeting/meet.png" };
    case "ZOOM":
      return { label: "Zoom", icon: "/images/meeting/zoom.png" };
    case "MICROSOFT_TEAMS":
      return { label: "Microsoft Teams", icon: "/images/meeting/teams.png" };
    case "WEBEX":
      return { label: "Webex", icon: "/images/meeting/video-call.png" };
    default:
      return { label: "Meeting", icon: "/images/meeting/video-call.png" };
  }
};

const getNextSessionText = (course: any) => {
  if (!course?.fromDay || !course?.startTime) return null;
  const daysMap: Record<string, number> = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
  };
  const daysReverse = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const fromIdx = daysMap[course.fromDay];
  const toIdx = course.toDay ? daysMap[course.toDay] : fromIdx;
  const now = new Date();
  const currentDayIdx = now.getDay();
  let courseHour = parseInt(course.startTime.split(":")[0]) || 0;
  const courseMinute = parseInt(course.startTime.split(":")[1]) || 0;
  if (course.startTimeDesignator === "PM" && courseHour !== 12)
    courseHour += 12;
  if (course.startTimeDesignator === "AM" && courseHour === 12) courseHour = 0;
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  let nextDayIdx = -1;
  for (let i = 0; i < 7; i++) {
    const testDay = (currentDayIdx + i) % 7;
    let inRange = false;
    if (fromIdx <= toIdx) {
      inRange = testDay >= fromIdx && testDay <= toIdx;
    } else {
      inRange = testDay >= fromIdx || testDay <= toIdx;
    }
    if (inRange) {
      if (i === 0) {
        if (
          currentHour < courseHour ||
          (currentHour === courseHour && currentMinute < courseMinute)
        ) {
          nextDayIdx = testDay;
          break;
        }
      } else {
        nextDayIdx = testDay;
        break;
      }
    }
  }
  if (nextDayIdx !== -1) {
    let prefix = daysReverse[nextDayIdx];
    if (nextDayIdx === currentDayIdx) prefix = "Today";
    else if (nextDayIdx === (currentDayIdx + 1) % 7) prefix = "Tomorrow";
    return `Next session: ${prefix} ${course.startTime} ${course.startTimeDesignator}`;
  }
  return null;
};

export default function StudentCoursesPage() {
  const [enrollments, setEnrollments] = React.useState<Enrollment[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [certificateEnrollmentId, setCertificateEnrollmentId] = React.useState<string | null>(null);
  const [reviewEnrollmentId, setReviewEnrollmentId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const res = await studentEnrollmentService.list({ page: 1, limit: 50 });
        if (res.success) {
          setEnrollments(res.data.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const activeCourses = enrollments.filter((c) => c.status === "ACTIVE");
  const completedCourses = enrollments.filter((c) => c.status === "COMPLETED");
  const totalEnrolled = enrollments.length;

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Courses" },
        ]}
        className="mb-2"
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1
            className="text-xl md:text-2xl font-semibold"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            Your courses
          </h1>
          <p className="text-sm text-[color:var(--color-neutral-600)]">
            Manage and continue your enrolled courses
          </p>
        </div>
        <Link href="/courses" className="w-full sm:w-auto">
          <Button variant="secondary" className="w-full sm:w-auto">
            Browse all courses
          </Button>
        </Link>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {[
          {
            label: "Enrolled",
            value: totalEnrolled,
            Icon: BookOpen,
            accent: "rgba(59,130,246,0.10)",
          },
          {
            label: "In Progress",
            value: activeCourses.length,
            Icon: Hammer,
            accent: "rgba(99,102,241,0.10)",
          },
          {
            label: "Completed",
            value: completedCourses.length,
            Icon: Award,
            accent: "rgba(16,185,129,0.10)",
          },
        ].map((s) => (
          <Card key={s.label} className="relative overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at top right, ${s.accent}, transparent 60%)`,
              }}
            />
            <CardContent className="relative py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-[color:var(--color-neutral-600)]">
                    {s.label}
                  </div>
                  <div
                    className="mt-1 text-lg font-semibold"
                    style={{ fontFamily: "var(--font-heading-sans)" }}
                  >
                    {s.value}
                  </div>
                </div>
                <div className="h-9 w-9 shrink-0 rounded-lg border border-[color:var(--color-neutral-200)] bg-white text-[color:var(--color-primary-700)] shadow-xs flex items-center justify-center">
                  <s.Icon size={16} aria-hidden="true" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <Card
                key={`skeleton-course-${idx}`}
                className="animate-pulse relative overflow-hidden group"
              >
                <CardContent className="relative py-5">
                  <div className="flex flex-col gap-3">
                    <div className="h-5 bg-[color:var(--color-neutral-200)] rounded w-3/4 mb-1"></div>
                    <div className="h-4 bg-[color:var(--color-neutral-100)] rounded w-1/2"></div>
                  </div>
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-1">
                      <div className="h-3 bg-[color:var(--color-neutral-200)] rounded w-12"></div>
                      <div className="h-3 bg-[color:var(--color-neutral-200)] rounded w-8"></div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[color:var(--color-neutral-100)]"></div>
                  </div>
                  <div className="mt-5 flex justify-end gap-2">
                    <div className="h-9 bg-[color:var(--color-neutral-200)] rounded w-16"></div>
                    <div className="h-9 bg-[color:var(--color-neutral-200)] rounded w-20"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          : activeCourses.map((c) => {
              const primaryMeetingLink = c.course?.meetingLinks?.find(
                (l) => l.isPrimary,
              );
              const platformInfo = getMeetingPlatformInfo(
                primaryMeetingLink?.platform,
              );
              const nextSession = getNextSessionText(c.course);

              return (
                <Card key={c.id} className="relative overflow-hidden group">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_60%)]" />
                  <CardContent className="relative py-5">
                    {(nextSession || c.course?.level) && (
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        {nextSession && (
                          <div className="inline-flex items-center gap-1">
                            <CalendarClock
                              size={14}
                              aria-hidden
                              strokeWidth={1.5}
                              className="text-[color:var(--color-primary-600)]"
                            />
                            <Badge
                              variant="outline"
                              className="font-normal text-xs border-[color:var(--color-primary-200)] text-[color:var(--color-primary-700)] bg-[color:var(--color-primary-50)]"
                            >
                              {nextSession.split(": ")[1] || nextSession}
                            </Badge>
                          </div>
                        )}

                        {c.course?.level && (
                          <Badge
                            variant="outline"
                            className={`font-normal text-xs ${getCourseLevelStyles(c.course.level)}`}
                          >
                            {c.course.level.charAt(0) +
                              c.course.level.slice(1).toLowerCase()}
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="flex flex-col gap-1">
                      <div
                        className="text-base font-semibold leading-tight line-clamp-2"
                        title={c.course?.title || "Unknown Course"}
                        style={{ fontFamily: "var(--font-heading-sans)" }}
                      >
                        {c.course?.title || "Unknown Course"}
                      </div>
                      <div className="text-xs text-[color:var(--color-neutral-600)]">
                        Instructor: {c.course?.instructor?.firstName}{" "}
                        {c.course?.instructor?.lastName}
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between text-[11px] mb-2 font-bold uppercase tracking-wider text-[color:var(--color-neutral-500)]">
                        <span>Course Progress</span>
                        <span className="text-[color:var(--color-primary-600)]">
                          {c.progressPercentage || 0}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[color:var(--color-neutral-100)] overflow-hidden shadow-inner flex items-center">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[color:var(--color-primary-400)] to-[color:var(--color-primary-600)] transition-all duration-700 ease-out"
                          style={{ width: `${c.progressPercentage || 0}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-end gap-2">
                      <Link href={`/dashboard/courses/${c.course?.id || ""}`}>
                        <Button size="sm">View</Button>
                      </Link>
                      {primaryMeetingLink && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="inline-flex items-center gap-1.5"
                          onClick={() => {
                            if (primaryMeetingLink.link) {
                              window.open(
                                primaryMeetingLink.link,
                                "_blank",
                                "noopener,noreferrer",
                              );
                            }
                          }}
                        >
                          <Image
                            src={platformInfo.icon}
                            alt={platformInfo.label}
                            width={14}
                            height={14}
                            className="w-3.5 h-3.5 object-contain"
                          />
                          {platformInfo.label}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {/* Completed */}
      {completedCourses.length > 0 && (
        <div className="mt-10">
          <h2
            className="text-base font-semibold mb-3"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            Completed courses
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {completedCourses.map((c) => (
              <Card key={c.id} className="relative overflow-hidden group">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08),transparent_60%)]" />
                <CardContent className="relative py-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="inline-flex items-center gap-1">
                      <Award
                        size={14}
                        aria-hidden
                        strokeWidth={1.5}
                        className="text-[color:var(--color-primary-600)]"
                      />
                      <Badge
                        variant="outline"
                        className="font-normal text-xs border-[color:var(--color-primary-200)] text-[color:var(--color-primary-700)] bg-[color:var(--color-primary-50)]"
                      >
                        Completed
                      </Badge>
                    </div>

                    {c.course?.level && (
                      <Badge
                        variant="outline"
                        className={`font-normal text-xs ${getCourseLevelStyles(c.course.level)}`}
                      >
                        {c.course.level.charAt(0) +
                          c.course.level.slice(1).toLowerCase()}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div
                      className="text-base font-semibold leading-tight line-clamp-2"
                      title={c.course?.title || "Unknown Course"}
                      style={{ fontFamily: "var(--font-heading-sans)" }}
                    >
                      {c.course?.title || "Unknown Course"}
                    </div>
                    <div className="text-xs text-[color:var(--color-neutral-600)]">
                      Instructor: {c.course?.instructor?.firstName}{" "}
                      {c.course?.instructor?.lastName}
                    </div>
                  </div>

                  <div className="mt-5 text-xs text-[color:var(--color-neutral-600)]">
                    Completed on{" "}
                    {new Date(c.course?.endDate || "").toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-end gap-2">
                    <Button size="sm" onClick={() => setReviewEnrollmentId(c.id)}>
                      Review
                    </Button>

                    {c.isCertificateCreated && (
                      <Button size="sm" variant="secondary" onClick={() => setCertificateEnrollmentId(c.id)}>
                        View certificate
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      <StudentCourseCertificateViewModal
        enrollmentId={certificateEnrollmentId}
        onClose={() => setCertificateEnrollmentId(null)}
      />

      {/* Review Modal */}
      <StudentCourseReviewModal
        enrollmentId={reviewEnrollmentId}
        onClose={() => setReviewEnrollmentId(null)}
      />
    </>
  );
}
