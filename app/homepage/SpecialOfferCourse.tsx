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
import { Clock, Calendar, Armchair, Hourglass } from "lucide-react";
import {
  Course,
  DayType,
  TimeDesignator,
  CourseDiscountType,
  PublishStatusType,
} from "@/lib/services/admin";
import { formatDuration } from "@/lib/utils/formatDuration";

// ─── helpers ────────────────────────────────────────────────────────────────

function formatDay(day: DayType): string {
  return day.charAt(0) + day.slice(1).toLowerCase();
}

function formatDays(from: DayType, to: DayType): string {
  return from === to
    ? formatDay(from)
    : `${formatDay(from)} – ${formatDay(to)}`;
}

function formatTime(time: string, designator: TimeDesignator): string {
  return `${time} ${designator}`;
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
        beforeEnrollmentDate: new Date().toISOString().split("T")[0], // For guest only
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

  if (!loading && courses.length === 0) return null;

  return (
    <section id="offers" className="mt-12 md:mt-16">
      <Container>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div>
            <h2
              className="text-xl md:text-2xl font-semibold"
              style={{ fontFamily: "var(--font-heading-sans)" }}
            >
              Special Offers
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
            : courses.map((course) => {
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
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50/95 backdrop-blur px-2 py-1 border border-red-200 shadow">
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
                        // unoptimized
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
                        className="text-base font-semibold"
                        style={{ fontFamily: "var(--font-heading-sans)" }}
                      >
                        {course.title}
                      </h3>

                      <div className="mt-2 flex flex-col gap-1 text-xs text-[color:var(--color-neutral-600)]">
                        <span className="inline-flex items-start gap-1.5 min-w-0">
                          <Clock
                            size={12}
                            className="mt-0.5 shrink-0 text-[color:var(--color-neutral-600)]"
                          />
                          <span className="min-w-0 break-words">
                            {days} · {timeStart} – {timeEnd}
                          </span>
                        </span>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="inline-flex items-center gap-1.5">
                            <Hourglass
                              size={12}
                              className="shrink-0 text-[color:var(--color-neutral-600)]"
                            />
                            {duration}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar
                              size={12}
                              className="shrink-0 text-[color:var(--color-neutral-600)]"
                            />
                            Starts {formatStartDate(course.startDate)}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 ${
                              limited ? "text-red-700" : "text-green-700"
                            }`}
                          >
                            <Armchair
                              size={12}
                              className={
                                limited
                                  ? "shrink-0 text-red-600"
                                  : "shrink-0 text-green-600"
                              }
                            />
                            {limited
                              ? `Limited seats (${seatsLeft} left)`
                              : `Seats available (${seatsLeft} left)`}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex min-w-0 flex-wrap items-baseline gap-2">
                          <span className="text-lg font-bold text-[color:var(--color-primary-700)]">
                            Rs {price}
                          </span>
                          {course.isDiscountApplied && (
                            <span className="text-sm line-through text-[color:var(--color-neutral-500)]">
                              Rs {originalPrice}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/courses/${course.slug}`}>
                            <Button size="sm">
                              <span className="lg:hidden">View</span>
                              <span className="hidden lg:inline">
                                View Details
                              </span>
                            </Button>
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
