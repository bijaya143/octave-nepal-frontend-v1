"use client";
import React from "react";
import Card, { CardContent } from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import {
  BookOpen,
  Hammer,
  Award,
  Sparkles,
  Lock,
  Megaphone,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Modal from "../../../components/ui/Modal";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { studentEnrollmentService } from "@/lib/services/student/enrollment";
import { Enrollment } from "@/lib/services/admin/types";
import StudentCertificateViewModal from "./StudentCertificateViewModal";

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

export default function StudentDashboardPage() {
  const [openModal, setOpenModal] = React.useState<
    null | "assignments" | "sessions" | "announcements" | "certificates"
  >(null);
  const router = useRouter();

  const [enrollments, setEnrollments] = React.useState<Enrollment[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] =
    React.useState<boolean>(true);
  const [enrollmentError, setEnrollmentError] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoadingEnrollments(true);
        const res = await studentEnrollmentService.list({
          status: "ACTIVE" as any,
          page: 1,
          limit: 4,
        });
        if (res.success) {
          setEnrollments(res.data.data || []);
        } else {
          setEnrollmentError(
            res.error?.message || "Failed to load enrollments.",
          );
        }
      } catch (e: any) {
        setEnrollmentError(e.message || "An error occurred.");
      } finally {
        setLoadingEnrollments(false);
      }
    };
    fetchEnrollments();
  }, []);

  const handleOpen = (key: NonNullable<typeof openModal>) => setOpenModal(key);
  const handleClose = () => setOpenModal(null);
  return (
    <>
      <h1
        className="text-xl md:text-2xl font-semibold mb-6"
        style={{ fontFamily: "var(--font-heading-sans)" }}
      >
        Your dashboard
      </h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {/* Main column */}
        <section className="md:col-span-2 lg:col-span-2 space-y-6">
          {/* Quick stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Enrolled", value: 3, Icon: BookOpen },
              { label: "In Progress", value: 2, Icon: Hammer },
              { label: "Certificates", value: 1, Icon: Award },
              {
                label: "Octave Points",
                value: 0,
                Icon: Sparkles,
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
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-[color:var(--color-neutral-600)]">
                          {s.label}
                        </div>
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
            ))}
          </div>

          {/* Active Enrolled courses */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold">
                Active Enrolled courses
              </h2>
              <Link
                href="/dashboard/courses"
                className="text-sm text-[color:var(--color-primary-700)] hover:underline underline-offset-2 whitespace-nowrap"
              >
                View all
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {loadingEnrollments ? (
                <>
                  {[1, 2].map((idx) => (
                    <Card
                      key={`skeleton-enrollment-${idx}`}
                      className="animate-pulse"
                    >
                      <CardContent className="py-5">
                        <div className="flex flex-col gap-3">
                          <div>
                            <div className="h-4 bg-[color:var(--color-neutral-200)] rounded w-full mb-1"></div>
                            <div className="h-4 bg-[color:var(--color-neutral-200)] rounded w-2/3"></div>
                            <div className="h-3 bg-[color:var(--color-neutral-100)] rounded w-1/2 mt-3"></div>
                          </div>
                          <div className="h-8 w-full bg-[color:var(--color-neutral-200)] rounded"></div>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-1">
                            <div className="h-3 bg-[color:var(--color-neutral-200)] rounded w-12"></div>
                            <div className="h-3 bg-[color:var(--color-neutral-200)] rounded w-8"></div>
                          </div>
                          <div className="h-2 w-full rounded-full bg-[color:var(--color-neutral-100)]"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : enrollmentError ? (
                <div className="col-span-1 sm:col-span-2 text-sm text-red-500 py-4 text-center border border-red-100 bg-red-50 rounded-lg">
                  {enrollmentError}
                </div>
              ) : enrollments.length === 0 ? (
                <div className="col-span-1 sm:col-span-2 text-sm text-[color:var(--color-neutral-500)] py-8 text-center border border-dashed rounded-lg">
                  No active enrollments found.
                </div>
              ) : (
                enrollments.map((enrollment) => {
                  const primaryMeetingLink =
                    enrollment.course?.meetingLinks?.find((l) => l.isPrimary);
                  const platformInfo = getMeetingPlatformInfo(
                    primaryMeetingLink?.platform,
                  );

                  return (
                    <Card key={enrollment.id}>
                      <CardContent className="py-5">
                        <div className="flex flex-col gap-3">
                          <div>
                            <div
                              className="text-sm font-medium leading-relaxed line-clamp-2"
                              title={
                                enrollment.course?.title || "Unknown Course"
                              }
                            >
                              {enrollment.course?.title || "Unknown Course"}
                            </div>
                            <div className="text-xs text-[color:var(--color-neutral-600)] mt-1.5">
                              {getNextSessionText(enrollment.course) ||
                                `Enrolled on ${new Date(enrollment.createdAt).toLocaleDateString()}`}
                            </div>
                          </div>
                          {primaryMeetingLink && (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="w-full flex items-center justify-center gap-1.5"
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
                              {/* Join */}
                            </Button>
                          )}
                        </div>
                        <div className="mt-6">
                          <div className="flex items-center justify-between text-[11px] mb-2 font-bold uppercase tracking-wider text-[color:var(--color-neutral-500)]">
                            <span>Course Progress</span>
                            <span className="text-[color:var(--color-primary-600)]">
                              {enrollment.progressPercentage || 0}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-[color:var(--color-neutral-100)] overflow-hidden shadow-inner flex items-center">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[color:var(--color-primary-400)] to-[color:var(--color-primary-600)] transition-all duration-700 ease-out"
                              style={{
                                width: `${enrollment.progressPercentage || 0}%`,
                              }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>

          {/* Widgets grid: Assignments, Upcoming Sessions, Announcements, Certificates */}
          <div>
            <h2
              className="text-base font-semibold mb-3"
              style={{ fontFamily: "var(--font-heading-sans)" }}
            >
              Quick overview
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Assignments */}
              {/* <Card
                className="relative overflow-hidden group cursor-pointer"
                onClick={() => handleOpen("assignments")}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_60%)]" />
                <CardContent className="relative py-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3
                      className="text-sm font-semibold"
                      style={{ fontFamily: "var(--font-heading-sans)" }}
                    >
                      Assignments
                    </h3>
                    <div className="h-9 w-9 rounded-lg border border-[color:var(--color-neutral-200)] bg-white text-[color:var(--color-primary-700)] shadow-xs flex items-center justify-center">
                      <ClipboardList size={16} aria-hidden="true" />
                    </div>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs text-[color:var(--color-primary-700)]">
                    <span>View</span>
                    <ChevronRight size={14} aria-hidden="true" />
                  </div>
                </CardContent>
              </Card> */}

              {/* Upcoming Sessions */}
              {/* <Card
                className="relative overflow-hidden group cursor-pointer"
                onClick={() => handleOpen("sessions")}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.07),transparent_60%)]" />
                <CardContent className="relative py-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3
                      className="text-sm font-semibold"
                      style={{ fontFamily: "var(--font-heading-sans)" }}
                    >
                      Upcoming Sessions
                    </h3>
                    <div className="h-9 w-9 rounded-lg border border-[color:var(--color-neutral-200)] bg-white text-[color:var(--color-primary-700)] shadow-xs flex items-center justify-center">
                      <CalendarClock size={16} aria-hidden="true" />
                    </div>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs text-[color:var(--color-primary-700)]">
                    <span>View</span>
                    <ChevronRight size={14} aria-hidden="true" />
                  </div>
                </CardContent>
              </Card> */}

              {/* Announcements */}
              <Card
                className="relative overflow-hidden group cursor-pointer"
                onClick={() => handleOpen("announcements")}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08),transparent_60%)]" />
                <CardContent className="relative py-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3
                      className="text-sm font-semibold"
                      style={{ fontFamily: "var(--font-heading-sans)" }}
                    >
                      Announcements
                    </h3>
                    <div className="h-9 w-9 rounded-lg border border-[color:var(--color-neutral-200)] bg-white text-[color:var(--color-primary-700)] shadow-xs flex items-center justify-center">
                      <Megaphone size={16} aria-hidden="true" />
                    </div>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs text-[color:var(--color-primary-700)]">
                    <span>View</span>
                    <ChevronRight size={14} aria-hidden="true" />
                  </div>
                </CardContent>
              </Card>

              {/* Certificates */}
              <Card
                className="relative overflow-hidden group cursor-pointer"
                onClick={() => handleOpen("certificates")}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(234,179,8,0.10),transparent_60%)]" />
                <CardContent className="relative py-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3
                      className="text-sm font-semibold"
                      style={{ fontFamily: "var(--font-heading-sans)" }}
                    >
                      Certificates
                    </h3>
                    <div className="h-9 w-9 rounded-lg border border-[color:var(--color-neutral-200)] bg-white text-[color:var(--color-primary-700)] shadow-xs flex items-center justify-center">
                      <Award size={16} aria-hidden="true" />
                    </div>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs text-[color:var(--color-primary-700)]">
                    <span>View</span>
                    <ChevronRight size={14} aria-hidden="true" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recommendations */}
          {/* <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold">Recommended for you</h2>
                <Badge variant="outline">Based on your courses</Badge>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {["UI Design Basics", "Node.js APIs"].map((title) => (
                  <Card key={title}>
                    <CardContent className="py-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium">{title}</div>
                          <div className="text-xs text-[color:var(--color-neutral-600)]">Popular this week</div>
                        </div>
                        <Button size="sm" variant="secondary">View</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div> */}
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Profile */}
          {/* <Card>
              <CardContent className="py-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[color:var(--color-primary-300)]" />
                  <div>
                    <div className="text-sm font-medium">Your Name</div>
                    <div className="text-xs text-[color:var(--color-neutral-600)]">you@example.com</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button size="sm" variant="secondary">Edit profile</Button>
                  <Button size="sm" variant="secondary">Change Password</Button>
                </div>
                <div className="mt-4 text-xs text-[color:var(--color-neutral-600)]">
                  Email reminders are sent 1 hour before each session with links.
                </div>
              </CardContent>
            </Card> */}

          {/* Billing */}
          <Card
            className="relative overflow-hidden group cursor-pointer"
            onClick={() => router.push("/dashboard/billing")}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_60%)]" />
            <CardContent className="py-5">
              <div className="text-sm font-medium">Billing</div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Latest payment</span>
                  <span className="font-medium">Rs 2,499 on Nov 5</span>
                </div>
                <div className="inline-flex items-center gap-1 text-xs text-[color:var(--color-primary-700)]">
                  <span>Manage</span>
                  <ChevronRight size={14} aria-hidden="true" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardContent className="py-5">
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

      {/* Modals */}
      <Modal
        open={openModal === "assignments"}
        onClose={handleClose}
        title="Assignments"
      >
        <div className="space-y-3 text-sm">
          {[
            { title: "Build a todo app", due: "Oct 28", course: "React 19" },
            {
              title: "Type utility types",
              due: "Oct 30",
              course: "TypeScript",
            },
          ].map((a) => (
            <div
              key={a.title}
              className="flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="font-medium truncate">{a.title}</div>
                <div className="text-xs text-[color:var(--color-neutral-600)]">
                  {a.course} · Due {a.due}
                </div>
              </div>
              <Button size="sm" variant="secondary">
                Submit
              </Button>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        open={openModal === "sessions"}
        onClose={handleClose}
        title="Upcoming Sessions"
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
                  Join
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        open={openModal === "announcements"}
        onClose={handleClose}
        title="Announcements"
      >
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="text-sm text-[color:var(--color-neutral-600)] font-medium">
            No announcements found.
          </p>
          <p className="text-xs text-[color:var(--color-neutral-500)] mt-1">
            You will be notified when there are new announcements.
          </p>
        </div>
      </Modal>

      <StudentCertificateViewModal
        open={openModal === "certificates"}
        onClose={handleClose}
      />
    </>
  );
}
