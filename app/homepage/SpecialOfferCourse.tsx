"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Container from "../../components/Container";
import Badge from "../../components/ui/Badge";
import Card, { CardContent } from "../../components/ui/Card";
import OfferTimer from "../../components/ui/OfferTimer";
import Link from "next/link";
import Button from "../../components/ui/Button";
import { guestCourseService } from "@/lib/services/guest";
import {
  Course,
  DayType,
  DurationUnit,
  TimeDesignator,
  CourseDiscountType,
  PublishStatusType,
} from "@/lib/services/admin";

// ─── helpers ────────────────────────────────────────────────────────────────

const DAY_SHORT: Record<DayType, string> = {
  [DayType.SUNDAY]: "Sun",
  [DayType.MONDAY]: "Mon",
  [DayType.TUESDAY]: "Tue",
  [DayType.WEDNESDAY]: "Wed",
  [DayType.THURSDAY]: "Thu",
  [DayType.FRIDAY]: "Fri",
  [DayType.SATURDAY]: "Sat",
};

const UNIT_LABEL: Record<DurationUnit, string> = {
  [DurationUnit.MINUTE]: "min",
  [DurationUnit.HOUR]: "hr",
  [DurationUnit.DAY]: "day",
  [DurationUnit.WEEK]: "week",
  [DurationUnit.MONTH]: "month",
  [DurationUnit.YEAR]: "year",
};

function formatDays(from: DayType, to: DayType): string {
  return `${DAY_SHORT[from]}–${DAY_SHORT[to]}`;
}

function formatTime(time: string, designator: TimeDesignator): string {
  return `${time} ${designator}`;
}

function formatDuration(val: number, unit: DurationUnit): string {
  const label = UNIT_LABEL[unit] ?? unit.toLowerCase();
  return `${val} ${label}${val !== 1 ? "s" : ""}`;
}

function formatStartDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function getDiscountPercent(course: Course): number {
  if (!course.isDiscountApplied || !course.markedPrice) return 0;

  if (
    course.discountType === CourseDiscountType.PERCENTAGE &&
    course.discountValue
  ) {
    return Math.round(course.discountValue);
  }

  if (course.discountType === CourseDiscountType.FLAT && course.discountValue) {
    return Math.round((course.discountValue / course.markedPrice) * 100);
  }

  if (course.sellingPrice && course.sellingPrice < course.markedPrice) {
    return Math.round(
      ((course.markedPrice - course.sellingPrice) / course.markedPrice) * 100,
    );
  }

  return 0;
}

// ─── skeleton ───────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <Card className="relative p-0 overflow-hidden animate-pulse">
      <div className="h-44 sm:h-48 md:h-56 bg-[color:var(--color-neutral-200)]" />
      <CardContent className="py-4 space-y-3">
        <div className="h-4 w-3/4 rounded bg-[color:var(--color-neutral-200)]" />
        <div className="h-3 w-1/2 rounded bg-[color:var(--color-neutral-100)]" />
        <div className="h-3 w-2/3 rounded bg-[color:var(--color-neutral-100)]" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-4 w-20 rounded bg-[color:var(--color-neutral-200)]" />
          <div className="h-8 w-24 rounded-lg bg-[color:var(--color-neutral-200)]" />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── component ──────────────────────────────────────────────────────────────

export default function SpecialOfferCourse() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    guestCourseService
      .list({
        isSalePeriodApplied: true,
        status: PublishStatusType.PUBLISHED,
        page: 1,
        limit: 10,
      })
      .then((res) => {
        if (res.success && res.data?.data) {
          setCourses(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Hide section entirely if no offer courses exist
  const now = new Date();
  const visibleCourses = courses.filter((course) => {
    if (!course.lastEnrollmentDate) return true;
    const lastDate = new Date(course.lastEnrollmentDate);
    lastDate.setHours(23, 59, 59, 999);
    return lastDate >= now;
  });

  if (!loading && visibleCourses.length === 0) return null;

  return (
    <section id="offers" className="mt-12 md:mt-16">
      <Container>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div>
            <h2
              className="text-xl md:text-2xl font-semibold"
              style={{ fontFamily: "var(--font-heading-sans)" }}
            >
              Special offers
            </h2>
            <p className="hidden sm:block text-sm text-[color:var(--color-neutral-600)] mt-1">
              Live cohorts starting soon · Limited seats
            </p>
          </div>
          <Badge variant="outline" className="shrink-0 whitespace-nowrap">
            Limited time
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : visibleCourses.map((course) => {
                const discountPercent = getDiscountPercent(course);
                const originalPrice = course.markedPrice;
                const price = course.sellingPrice ?? course.markedPrice;
                const timeStart = formatTime(
                  course.startTime,
                  course.startTimeDesignator,
                );
                const timeEnd = formatTime(
                  course.endTime,
                  course.endTimeDesignator,
                );
                const days = formatDays(course.fromDay, course.toDay);
                const duration = formatDuration(
                  course.duration,
                  course.durationUnit,
                );
                const seatsLeft =
                  course.seatCapacityCount - course.occupiedSeatCount;
                const ratio =
                  course.occupiedSeatCount / course.seatCapacityCount;
                const limited = ratio >= 0.7;

                return (
                  <Card
                    key={course.id}
                    className="relative p-0 overflow-hidden"
                  >
                    <div className="absolute right-3 top-3 z-10">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50/95 backdrop-blur px-2 py-1 border border-amber-200 shadow">
                        <OfferTimer
                          startDate={course.startDate}
                          timeStart={timeStart}
                          totalSeats={course.seatCapacityCount}
                          reservedSeats={course.occupiedSeatCount}
                        />
                      </div>
                    </div>
                    <div className="relative h-44 sm:h-48 md:h-56">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${course.thumbnailKey}`}
                        alt={course.title}
                        fill
                        sizes="(max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 16vw"
                        className="object-cover"
                        unoptimized
                      />
                      {course.isDiscountApplied && discountPercent > 0 && (
                        <div className="absolute left-3 top-3">
                          <Badge>{`Save ${discountPercent}%`}</Badge>
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    <CardContent className="py-4">
                      <h3
                        className="text-base font-semibold leading-snug"
                        style={{ fontFamily: "var(--font-heading-sans)" }}
                      >
                        {course.title}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-[color:var(--color-neutral-600)]">
                        <span className="inline-flex items-center gap-1">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-[color:var(--color-neutral-600)]"
                          >
                            <path
                              d="M12 8v5l3 2"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <circle
                              cx="12"
                              cy="12"
                              r="9"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                          </svg>
                          {days} · {timeStart} – {timeEnd}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-[color:var(--color-neutral-600)]"
                          >
                            <path
                              d="M7 3h10M7 21h10M7 3c0 3 5 5 5 9s-5 6-5 9M17 3c0 3-5 5-5 9s5 6 5 9"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {duration}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-[color:var(--color-neutral-600)]">
                        <span className="inline-flex items-center gap-1">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-[color:var(--color-neutral-600)]"
                          >
                            <path
                              d="M7 2v3M17 2v3M3.5 9.5h17M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Starts {formatStartDate(course.startDate)}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 ${
                            limited ? "text-red-700" : "text-green-700"
                          }`}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={
                              limited ? "text-red-600" : "text-green-600"
                            }
                          >
                            <path
                              d="M7 11v6M12 11v6M17 11v6M5 21h14a2 2 0 002-2v-7a2 2 0 00-2-2h-1V7a4 4 0 00-8 0v3H5a2 2 0 00-2 2v7a2 2 0 002 2z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {limited
                            ? `Limited seats (${seatsLeft} left)`
                            : `Seats available (${seatsLeft} left)`}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="flex items-baseline gap-2 whitespace-nowrap">
                          <span className="text-base font-semibold text-[color:var(--color-primary-700)]">
                            Rs {price}
                          </span>
                          {course.isDiscountApplied && (
                            <span className="text-xs text-[color:var(--color-neutral-500)] line-through">
                              Rs {originalPrice}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/courses/${course.id}`}>
                            <Button size="sm">View Details</Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
        </div>
      </Container>
    </section>
  );
}
