"use client";
import React from "react";
import Card, { CardContent } from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import CreateAnnouncementModal from "../announcements/CreateAnnouncementModal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Wallet,
  Megaphone,
  Star,
  TrendingUp,
  CreditCard,
  GraduationCap,
  ChevronRight,
  CalendarClock,
  Lock,
  Users,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import Image from "next/image";
import {
  instructorCourseService,
  instructorDashboardService,
} from "@/lib/services/instructor";
import { Course } from "@/lib/services/admin/types";
import { InstructorDashboardCountOutput } from "@/lib/services/instructor/types";

type OpenModalKey =
  | null
  | "submissions"
  | "sessions"
  | "announcements"
  | "messages";

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

export default function InstructorDashboardPage() {
  const [openModal, setOpenModal] = React.useState<OpenModalKey>(null);
  const router = useRouter();

  const handleOpen = (key: Exclude<OpenModalKey, null>) => setOpenModal(key);
  const handleClose = () => setOpenModal(null);

  const [dashboardCounts, setDashboardCounts] =
    React.useState<InstructorDashboardCountOutput | null>(null);
  const [loadingDashboardCounts, setLoadingDashboardCounts] =
    React.useState(true);

  React.useEffect(() => {
    const fetchDashboardCounts = async () => {
      try {
        setLoadingDashboardCounts(true);
        const res = await instructorDashboardService.get();
        if (res.success) {
          setDashboardCounts(res.data);
        }
      } catch {
        // silently fail — counts are non-critical
      } finally {
        setLoadingDashboardCounts(false);
      }
    };
    fetchDashboardCounts();
  }, []);

  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = React.useState<boolean>(true);
  const [courseError, setCourseError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const res = await instructorCourseService.list({
          page: 1,
          limit: 4,
        });
        if (res.success) {
          setCourses(res.data.data || []);
        } else {
          setCourseError(res.error?.message || "Failed to load courses.");
        }
      } catch (e: any) {
        setCourseError(e.message || "An error occurred.");
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const payouts = [
    { id: "tx_01", date: "Oct 20, 2025", amount: 6200, status: "Completed" },
    { id: "tx_02", date: "Oct 12, 2025", amount: 4800, status: "Completed" },
    { id: "tx_03", date: "Oct 5, 2025", amount: 3400, status: "Processing" },
  ];

  function computeCourseProgress(startDate: string, endDate: string): number {
    const startMs = new Date(startDate).getTime();
    const endMs = new Date(endDate).getTime();
    const nowMs = Date.now();
    if (!isFinite(startMs) || !isFinite(endMs) || endMs <= startMs) return 0;
    const ratio = (nowMs - startMs) / (endMs - startMs);
    const pct = Math.round(ratio * 100);
    return Math.max(0, Math.min(100, pct));
  }

  function formatReadableDate(isoDate: string): string {
    const dt = new Date(isoDate);
    if (!isFinite(dt.getTime())) return isoDate;
    return dt.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <>
      <h1
        className="text-xl md:text-2xl font-semibold mb-6"
        style={{ fontFamily: "var(--font-heading-sans)" }}
      >
        Your Dashboard
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {/* Main column */}
        <section className="md:col-span-2 lg:col-span-2 space-y-6">
          {/* Quick stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {loadingDashboardCounts ? (
              <>
                {[0, 1, 2].map((i) => (
                  <Card key={`stat-skeleton-${i}`} className="relative overflow-hidden animate-pulse">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.06),transparent_60%)]" />
                    <CardContent className="relative py-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="space-y-2 flex-1">
                          <div className="h-3 w-16 bg-neutral-200 rounded" />
                          <div className="h-6 w-10 bg-neutral-200 rounded" />
                        </div>
                        <div className="h-9 w-9 shrink-0 rounded-lg bg-neutral-200" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {/* Payouts — always static */}
                <Card
                  className="relative overflow-hidden border-dashed bg-[color:var(--color-neutral-50)] opacity-75 cursor-not-allowed"
                  aria-disabled={true}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,0,0,0.06),transparent_60%)]" />
                  <CardContent className="relative py-4" title="Coming soon">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs text-[color:var(--color-neutral-600)]">Payouts</div>
                        <div
                          className="mt-1 text-lg font-semibold text-[color:var(--color-neutral-500)]"
                          style={{ fontFamily: "var(--font-heading-sans)" }}
                        >
                          —
                        </div>
                      </div>
                      <div className="h-9 w-9 shrink-0 rounded-lg border shadow-xs flex items-center justify-center border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-50)] text-[color:var(--color-neutral-600)]">
                        <Lock size={16} aria-hidden="true" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              [
                {
                  label: "Courses",
                  value: dashboardCounts?.courseCount ?? 0,
                  Icon: BookOpen,
                },
                {
                  label: "Students",
                  value: dashboardCounts?.studentCount ?? 0,
                  Icon: GraduationCap,
                },
                {
                  label: "Classes",
                  value: dashboardCounts?.activeEnrollmentCount ?? 0,
                  Icon: TrendingUp,
                },
                {
                  label: "Payouts",
                  value: "—",
                  Icon: Wallet,
                  comingSoon: true,
                },
              ].map((s: any) => (
                <Card
                  key={s.label}
                  className={`relative overflow-hidden ${
                    s.comingSoon
                      ? "border-dashed bg-[color:var(--color-neutral-50)] opacity-75 cursor-not-allowed"
                      : "group"
                  }`}
                  aria-disabled={s.comingSoon ? true : undefined}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 ${
                      s.comingSoon
                        ? "bg-[radial-gradient(ellipse_at_top_right,rgba(0,0,0,0.06),transparent_60%)]"
                        : "bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.10),transparent_60%)]"
                    }`}
                  />
                  <CardContent
                    className="relative py-4"
                    title={s.comingSoon ? "Coming soon" : undefined}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs text-[color:var(--color-neutral-600)]">
                          {s.label}
                        </div>
                        <div
                          className={`mt-1 text-lg font-semibold ${
                            s.comingSoon
                              ? "text-[color:var(--color-neutral-500)]"
                              : ""
                          }`}
                          style={{ fontFamily: "var(--font-heading-sans)" }}
                        >
                          {s.comingSoon ? "—" : s.value}
                        </div>
                      </div>
                      <div
                        className={`h-9 w-9 shrink-0 rounded-lg border shadow-xs flex items-center justify-center ${
                          s.comingSoon
                            ? "border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-50)] text-[color:var(--color-neutral-600)]"
                            : "border-[color:var(--color-neutral-200)] bg-white text-[color:var(--color-primary-700)]"
                        }`}
                      >
                        {s.comingSoon ? (
                          <Lock size={16} aria-hidden="true" />
                        ) : (
                          <s.Icon size={16} aria-hidden="true" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Your Active courses */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold">Your Active courses</h2>
              <Link
                href="/instructor/courses"
                className="text-sm text-[color:var(--color-primary-700)] hover:underline underline-offset-2 whitespace-nowrap"
              >
                View all
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {loadingCourses ? (
                <>
                  {[1, 2].map((idx) => (
                    <Card
                      key={`skeleton-course-${idx}`}
                      className="animate-pulse"
                    >
                      <CardContent className="py-5">
                        <div className="flex flex-col gap-3">
                          <div>
                            <div className="h-4 bg-[color:var(--color-neutral-200)] rounded w-full mb-1.5"></div>
                            <div className="h-3 bg-[color:var(--color-neutral-100)] rounded w-2/3"></div>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="h-6 w-20 bg-[color:var(--color-neutral-100)] rounded-lg"></div>
                            <div className="h-6 w-20 bg-[color:var(--color-neutral-100)] rounded-lg"></div>
                          </div>
                          <div className="h-8 w-full bg-[color:var(--color-neutral-200)] rounded-lg mt-1"></div>
                        </div>
                        <div className="mt-6">
                          <div className="flex justify-between items-center mb-2">
                            <div className="h-3 bg-[color:var(--color-neutral-100)] rounded w-24"></div>
                            <div className="h-3 bg-[color:var(--color-neutral-100)] rounded w-8"></div>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-[color:var(--color-neutral-100)]"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : courseError ? (
                <div className="col-span-1 sm:col-span-2 text-sm text-red-500 py-4 text-center border border-red-100 bg-red-50 rounded-lg">
                  {courseError}
                </div>
              ) : (
                (() => {
                  const activeCourses = courses.filter(
                    (c) => new Date(c.endDate) >= new Date(),
                  );

                  if (activeCourses.length === 0) {
                    return (
                      <div className="col-span-1 sm:col-span-2 text-sm text-[color:var(--color-neutral-500)] py-8 text-center border border-dashed rounded-lg">
                        No active courses found.
                      </div>
                    );
                  }

                  return activeCourses.map((c) => {
                    const primaryMeetingLink = c.meetingLinks?.find(
                      (l) => l.isPrimary,
                    );
                    const platformInfo = getMeetingPlatformInfo(
                      primaryMeetingLink?.platform,
                    );

                    return (
                      <Card key={c.id}>
                        <CardContent className="py-5">
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-col">
                              <div
                                className="text-sm font-medium leading-relaxed line-clamp-2"
                                title={c.title}
                              >
                                {c.title}
                              </div>
                              <div className="text-[10px] text-[color:var(--color-neutral-500)] mt-1.5 uppercase tracking-wider font-semibold">
                                {getNextSessionText(c) ||
                                  `Starts on ${formatReadableDate(c.startDate)}`}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[color:var(--color-neutral-50)] border border-[color:var(--color-neutral-200)] transition-colors hover:bg-[color:var(--color-neutral-100)]">
                                <Users
                                  size={12}
                                  className="text-[color:var(--color-primary-600)]"
                                />
                                <span className="text-[10px] font-bold text-[color:var(--color-neutral-700)] uppercase tracking-wider">
                                  {c.studentCount || 0}{" "}
                                  <span className="text-[color:var(--color-neutral-500)] font-medium">
                                    Students
                                  </span>
                                </span>
                              </div>
                              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-50 border border-amber-200 transition-colors hover:bg-amber-100">
                                <Star
                                  size={12}
                                  className="text-amber-600"
                                  fill="currentColor"
                                />
                                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">
                                  {c.averageReviewRatingCount || 0}
                                </span>
                              </div>
                            </div>

                            {primaryMeetingLink && (
                              <Button
                                size="sm"
                                variant="secondary"
                                className="w-full flex items-center justify-center gap-1.5 mt-1"
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
                                {`${platformInfo.label}`}
                              </Button>
                            )}
                          </div>

                          <div className="mt-6">
                            <div className="flex items-center justify-between text-[11px] mb-2 font-bold uppercase tracking-wider text-[color:var(--color-neutral-500)]">
                              <span>Course Duration Progress</span>
                              <span className="text-[color:var(--color-primary-600)]">
                                {computeCourseProgress(c.startDate, c.endDate)}%
                              </span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-[color:var(--color-neutral-100)] overflow-hidden shadow-inner flex items-center">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[color:var(--color-primary-400)] to-[color:var(--color-primary-600)] transition-all duration-700 ease-out"
                                style={{
                                  width: `${computeCourseProgress(
                                    c.startDate,
                                    c.endDate,
                                  )}%`,
                                }}
                              />
                            </div>
                            <div className="mt-2 flex items-center justify-between text-[10px] text-[color:var(--color-neutral-600)] font-medium">
                              <span>{formatReadableDate(c.startDate)}</span>
                              <span>{formatReadableDate(c.endDate)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  });
                })()
              )}
            </div>
          </div>

          {/* Quick overview widgets */}
          <div>
            <h2
              className="text-base font-semibold mb-3"
              style={{ fontFamily: "var(--font-heading-sans)" }}
            >
              Quick overview
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Post Announcement */}
              <Card
                className="relative overflow-hidden border-dashed bg-[color:var(--color-neutral-50)] opacity-75 cursor-not-allowed"
                title="Coming soon"
                aria-disabled={true}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,0,0,0.06),transparent_60%)]" />
                <CardContent className="relative py-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3
                      className="text-sm font-semibold"
                      style={{ fontFamily: "var(--font-heading-sans)" }}
                    >
                      Post Announcement
                    </h3>
                    <div className="h-9 w-9 rounded-lg border border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-50)] text-[color:var(--color-neutral-600)] shadow-xs flex items-center justify-center">
                      <Lock size={16} aria-hidden="true" />
                    </div>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs text-[color:var(--color-neutral-400)]">
                    <span>Coming soon</span>
                    <ChevronRight size={14} aria-hidden="true" />
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Sessions */}
              <Card
                className="relative overflow-hidden border-dashed bg-[color:var(--color-neutral-50)] opacity-75 cursor-not-allowed"
                title="Coming soon"
                aria-disabled={true}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,0,0,0.06),transparent_60%)]" />
                <CardContent className="relative py-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3
                      className="text-sm font-semibold"
                      style={{ fontFamily: "var(--font-heading-sans)" }}
                    >
                      Upcoming Sessions
                    </h3>
                    <div className="h-9 w-9 rounded-lg border border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-50)] text-[color:var(--color-neutral-600)] shadow-xs flex items-center justify-center">
                      <Lock size={16} aria-hidden="true" />
                    </div>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs text-[color:var(--color-neutral-400)]">
                    <span>Coming soon</span>
                    <ChevronRight size={14} aria-hidden="true" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Payouts (Billing style) */}
          <Card
            className="relative overflow-hidden border-dashed bg-[color:var(--color-neutral-50)] opacity-75 cursor-not-allowed"
            title="Coming soon"
            aria-disabled={true}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,0,0,0.06),transparent_60%)]" />
            <CardContent className="py-5">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium">Payouts</div>
                <div className="h-8 w-8 rounded-lg border border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-50)] text-[color:var(--color-neutral-600)] shadow-xs flex items-center justify-center">
                  <Lock size={16} aria-hidden="true" />
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="text-xs text-[color:var(--color-neutral-500)] leading-relaxed">
                  Payout management and history view are currently being
                  finalized. You'll be notified when this feature is active.
                </div>
                <div className="pt-2 inline-flex items-center gap-1 text-xs text-[color:var(--color-neutral-400)]">
                  <span>Coming soon</span>
                  <ChevronRight size={14} aria-hidden="true" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08),transparent_60%)]" />
            <CardContent className="relative py-5">
              <div className="text-sm font-medium">Need help?</div>
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
                <Link href="/faq" className="w-full">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-full inline-flex items-center gap-2"
                  >
                    FAQ
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/*  modals */}
      <Modal
        open={openModal === "sessions"}
        onClose={handleClose}
        title="Upcoming sessions"
      >
        <div className="space-y-3 text-sm">
          {[
            { when: "Wed 7:00 PM", course: "React 19" },
            { when: "Fri 6:30 PM", course: "TypeScript" },
          ].map((s) => (
            <div
              key={s.when + s.course}
              className="flex items-center justify-between gap-3"
            >
              <div>
                <div className="font-medium">{s.course}</div>
                <div className="text-xs text-[color:var(--color-neutral-600)]">
                  {s.when}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary">
                  Start
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <CreateAnnouncementModal
        open={openModal === "announcements"}
        onClose={handleClose}
        onSubmit={() => {
          handleClose();
          // Optionally navigate to announcements list after posting
          // router.push("/instructor/announcements");
        }}
      />
    </>
  );
}
