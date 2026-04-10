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
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import Image from "next/image";

type OpenModalKey =
  | null
  | "submissions"
  | "sessions"
  | "announcements"
  | "messages";

export default function InstructorDashboardPage() {
  const [openModal, setOpenModal] = React.useState<OpenModalKey>(null);
  const router = useRouter();

  const handleOpen = (key: Exclude<OpenModalKey, null>) => setOpenModal(key);
  const handleClose = () => setOpenModal(null);

  const stats = [
    { label: "Courses", value: 4, Icon: BookOpen },
    { label: "Total Students", value: 500, Icon: GraduationCap },
    { label: "Enrollments", value: 176, Icon: TrendingUp },
    { label: "Total Payouts", value: "Rs 12400", Icon: Wallet, comingSoon: true },
  ];

  const courses = [
    {
      id: "react-19",
      title: "React 19 Fundamentals",
      students: 64,
      rating: 4.7,
      revenue: 54000,
      startDate: "2025-09-12",
      endDate: "2026-01-12",
    },
    {
      id: "ts-mastery",
      title: "TypeScript Mastery",
      students: 38,
      rating: 4.6,
      revenue: 31200,
      startDate: "2025-08-26",
      endDate: "2025-11-10",
    },
    {
      id: "node-api",
      title: "Node.js APIs",
      students: 22,
      rating: 4.5,
      revenue: 19800,
      startDate: "2025-10-26",
      endDate: "2025-11-10",
    },
  ];

  const payouts = [
    { id: "tx_01", date: "Oct 20, 2025", amount: 6200, status: "Completed" },
    { id: "tx_02", date: "Oct 12, 2025", amount: 4800, status: "Completed" },
    { id: "tx_03", date: "Oct 5, 2025", amount: 3400, status: "Processing" },
  ];

  const getStatusBadgeClassName = (status: string): string => {
    const s = status.toLowerCase();
    if (s.includes("complete"))
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (s.includes("process") || s.includes("pending"))
      return "bg-amber-50 text-amber-700 border-amber-200";
    if (s.includes("fail") || s.includes("cancel"))
      return "bg-rose-50 text-rose-700 border-rose-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

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
            {stats.map((s: any) => (
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
            ))}
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
              {courses.map((c) => (
                <Card key={c.id}>
                  <CardContent className="py-5">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-3 font-semibold">
                        <div
                          className="text-sm font-medium leading-relaxed line-clamp-2"
                          title={c.title}
                        >
                          {c.title}
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="shrink-0"
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="mt-1 flex items-center gap-4 text-xs text-[color:var(--color-neutral-600)]">
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          <GraduationCap size={14} className="opacity-70" />{" "}
                          {c.students} students
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                          <Star size={14} fill="currentColor" /> {c.rating}
                        </span>
                      </div>
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
                      <div className="mt-2 flex items-center justify-between text-[10px] text-[color:var(--color-neutral-400)] font-medium">
                        <span>{formatReadableDate(c.startDate)}</span>
                        <span>{formatReadableDate(c.endDate)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
