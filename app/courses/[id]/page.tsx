"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Card, { CardContent } from "@/components/ui/Card";
import CourseCard, { type Course as CardCourse } from "@/components/CourseCard";
import Rating from "@/components/ui/Rating";
import Image from "next/image";
import {
  SearchX,
  ArrowLeft,
  Globe,
  BarChart2,
  BookOpen,
  CheckCircle2,
  ListChecks,
  Timer,
  Clock,
  Star,
  Link2,
  ExternalLink,
  TableOfContents,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Container from "@/components/Container";
import { guestCourseService, guestReviewService } from "@/lib/services/guest";
import {
  Course as ApiCourse,
  CourseDiscountType,
  PublishStatusType,
  AdminReview,
} from "@/lib/services/admin/types";
import Badge from "@/components/ui/Badge";

function getDiscountPercent(course: any): number {
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

  return 0;
}

function mapToCardCourse(c: ApiCourse): CardCourse {
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";
  return {
    id: c.id,
    title: c.title,
    slug: c.slug,
    instructor: `${c.instructor.firstName} ${c.instructor.lastName}`,
    instructorAvatar: c.instructor.profilePictureKey
      ? `${baseUrl}/${c.instructor.profilePictureKey}`
      : undefined,
    rating: c.averageReviewRatingCount,
    ratingCount: c.reviewCount,
    price: c.markedPrice,
    sellingPrice: c.sellingPrice,
    discount: getDiscountPercent(c),
    thumbnail: c.thumbnailKey ? `${baseUrl}/${c.thumbnailKey}` : undefined,
    category: c.category.name,
    duration: `${c.duration} ${c.durationUnit.toLowerCase()}`,
  };
}

function CourseDetailSkeleton() {
  return (
    <Container className="py-5 md:py-10 animate-pulse">
      <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        <section className="space-y-8">
          <div className="space-y-3">
            <div className="h-10 w-3/4 bg-neutral-200 rounded-lg" />
            <div className="h-5 w-1/2 bg-neutral-100 rounded-lg" />
          </div>
          <div className="aspect-[16/9] w-full bg-neutral-100 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-4 bg-neutral-100 rounded w-full" />
            <div className="h-4 bg-neutral-100 rounded w-full" />
            <div className="h-4 bg-neutral-100 rounded w-2/3" />
          </div>
        </section>
        <aside className="hidden lg:block">
          <div className="h-[400px] w-full bg-neutral-50 border border-neutral-100 rounded-2xl" />
        </aside>
      </div>
    </Container>
  );
}

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params?.id as string;

  const [course, setCourse] = useState<ApiCourse | null>(null);
  const [relatedCourses, setRelatedCourses] = useState<CardCourse[]>([]);
  const [courseReviews, setCourseReviews] = useState<AdminReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isEnrollmentClosed = course
    ? !course.lastEnrollmentDate ||
      course.availableSeatCount <= 0 ||
      new Date(course.lastEnrollmentDate) < new Date()
    : false;

  const [expandedSections, setExpandedSections] = useState<
    Record<number, boolean>
  >({ 0: true });

  const toggleSection = (idx: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const fetchData = useCallback(async () => {
    if (!slug) return;

    try {
      setIsLoading(true);
      const resp = await guestCourseService.getBySlug(slug);

      if (!resp.success || !resp.data) {
        setError("Course not found");
        return;
      }

      const courseData = resp.data;
      setCourse(courseData);

      // Fetch related courses
      const relatedResp = await guestCourseService.list({
        beforeEnrollmentDate: new Date().toISOString().split("T")[0], // For guest only
        categoryId: courseData.category.id,
        status: PublishStatusType.PUBLISHED,
        limit: 4,
        page: 1,
      });

      if (relatedResp.success) {
        const mapped = relatedResp.data.data
          .filter((c) => c.id !== courseData.id)
          .slice(0, 3)
          .map(mapToCardCourse);
        setRelatedCourses(mapped);
      }

      // Fetch reviews
      setIsReviewsLoading(true);
      const reviewsResp = await guestReviewService.list({
        courseId: courseData.id,
        isPublished: true,
        limit: 10,
        page: 1,
      });

      if (reviewsResp.success) {
        setCourseReviews(reviewsResp.data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
      setIsReviewsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <main>
        <CourseDetailSkeleton />
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="h-20 w-20 rounded-full bg-[color:var(--color-neutral-50)] border border-[color:var(--color-neutral-100)] flex items-center justify-center mb-6 shadow-sm">
          <SearchX
            size={32}
            className="text-[color:var(--color-neutral-400)]"
          />
        </div>
        <h2
          className="text-xl md:text-2xl font-semibold text-[color:var(--color-neutral-900)] mb-2"
          style={{ fontFamily: "var(--font-heading-sans)" }}
        >
          Course not found
        </h2>
        <p className="text-sm text-[color:var(--color-neutral-600)] max-w-sm mb-8 leading-relaxed">
          We couldn't find the course you're looking for. It might have been
          removed, or the link might be incorrect.
        </p>
        <Link href="/courses">
          <Button
            variant="secondary"
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse all courses
          </Button>
        </Link>
      </main>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";
  const instructorName = `${course.instructor.firstName} ${course.instructor.lastName}`;
  const instructorAvatar = course.instructor.profilePictureKey
    ? `${baseUrl}/${course.instructor.profilePictureKey}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        instructorName,
      )}&background=random`;

  return (
    <main>
      <Container className="py-5 md:py-10">
        <div className="grid lg:grid-cols-[1fr_360px] gap-6 md:gap-8 items-start">
          {/* Content */}
          <section>
            <h1
              className="text-2xl md:text-3xl font-bold tracking-tight text-balance mb-2"
              style={{ fontFamily: "var(--font-heading-sans)" }}
            >
              {course.title}
            </h1>
            <p className="text-[color:var(--color-neutral-600)] mb-6">
              {course.subtitle}
            </p>
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 mb-8">
              <span className="flex items-center gap-2 text-sm text-[color:var(--color-neutral-700)]">
                <Image
                  src={instructorAvatar}
                  alt={`${instructorName} avatar`}
                  width={24}
                  height={24}
                  className="h-6 w-6 rounded-full object-cover border border-[color:var(--color-neutral-200)]"
                  // unoptimized
                />
                By {instructorName}
              </span>
              <Rating
                value={course.averageReviewRatingCount}
                count={course.reviewCount}
              />

              {/* Desktop & Tablet: Inline pill (md breakpoint and above) */}
              <div className="hidden md:flex items-center gap-4 text-xs font-medium text-[color:var(--color-neutral-600)] bg-[color:var(--color-neutral-50)] px-3 py-2 rounded-lg border border-[color:var(--color-neutral-100)]">
                <span className="flex items-center gap-1.5">
                  <BarChart2
                    size={14}
                    className="text-[color:var(--color-primary-600)]"
                  />
                  {course.level}
                </span>
                <span className="h-3 w-px bg-[color:var(--color-neutral-200)]" />
                <span className="flex items-center gap-1.5">
                  <Globe
                    size={14}
                    className="text-[color:var(--color-primary-600)]"
                  />
                  {course.language}
                </span>
                <span className="h-3 w-px bg-[color:var(--color-neutral-200)]" />
                <span className="flex items-center gap-1.5">
                  <BookOpen
                    size={14}
                    className="text-[color:var(--color-primary-600)]"
                  />
                  {course.lessonCount || "N/A"} lessons
                </span>
                <span className="h-3 w-px bg-[color:var(--color-neutral-200)]" />
                <span className="flex items-center gap-1.5">
                  <Clock
                    size={14}
                    className="text-[color:var(--color-primary-600)]"
                  />
                  {course.duration} {course.durationUnit.toLowerCase()}(s)
                </span>
              </div>

              {/* Mobile: Full-width Grid (Below md breakpoint) */}
              <div className="md:hidden w-full grid grid-cols-4 divide-x divide-[color:var(--color-neutral-200)] border border-[color:var(--color-neutral-200)] rounded-xl bg-[color:var(--color-neutral-50)] overflow-hidden">
                <div className="flex flex-col items-center justify-center gap-1 py-3 px-1">
                  <BarChart2
                    size={15}
                    className="text-[color:var(--color-primary-600)]"
                  />
                  <span className="text-[10px] font-semibold text-[color:var(--color-neutral-700)] text-center leading-tight">
                    {course.level}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 py-3 px-1">
                  <Globe
                    size={15}
                    className="text-[color:var(--color-primary-600)]"
                  />
                  <span className="text-[10px] font-semibold text-[color:var(--color-neutral-700)] text-center leading-tight">
                    {course.language}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 py-3 px-1">
                  <BookOpen
                    size={15}
                    className="text-[color:var(--color-primary-600)]"
                  />
                  <span className="text-[10px] font-semibold text-[color:var(--color-neutral-700)] text-center leading-tight">
                    {course.lessonCount || "N/A"} lessons
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 py-3 px-1">
                  <Clock
                    size={15}
                    className="text-[color:var(--color-primary-600)]"
                  />
                  <span className="text-[10px] font-semibold text-[color:var(--color-neutral-700)] text-center leading-tight">
                    {course.duration} {course.durationUnit.toLowerCase()}(s)
                  </span>
                </div>
              </div>
            </div>

            <Card className="overflow-hidden mb-8 border-[color:var(--color-neutral-200)] shadow-sm">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={
                    course.thumbnailKey
                      ? `${baseUrl}/${course.thumbnailKey}`
                      : "/images/hero.svg"
                  }
                  alt={course.title}
                  fill
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="object-cover"
                  // unoptimized
                />
              </div>
            </Card>

            {course.learningOutcome && (
              <section className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Card className="bg-[color:var(--color-primary-50)]/30 border-[color:var(--color-primary-100)] p-6">
                  <h2
                    className="text-lg font-bold mb-4 flex items-center gap-2"
                    style={{ fontFamily: "var(--font-heading-sans)" }}
                  >
                    <CheckCircle2
                      className="text-[color:var(--color-primary-600)]"
                      size={20}
                    />
                    What you'll learn
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                    {course.learningOutcome
                      .split("\n")
                      .filter((l) => l.trim())
                      .map((outcome, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <div className="mt-1 h-5 w-5 rounded-full bg-[color:var(--color-primary-50)] text-[color:var(--color-primary-600)] flex items-center justify-center shrink-0 border border-[color:var(--color-primary-100)]">
                            <Star size={12} />
                          </div>
                          <span className="text-sm font-medium text-[color:var(--color-neutral-700)] leading-relaxed pt-0.5">
                            {outcome.trim()}
                          </span>
                        </div>
                      ))}
                  </div>
                </Card>
              </section>
            )}

            <section className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2
                className="text-xl font-bold border-b border-[color:var(--color-neutral-200)] pb-2 mb-6"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                About this course
              </h2>
              <div className="space-y-6">
                {course.shortDescription && (
                  <p className="text-base font-semibold text-[color:var(--color-neutral-900)] leading-relaxed italic border-l-4 border-[color:var(--color-primary-500)] pl-4 py-1">
                    {course.shortDescription}
                  </p>
                )}
                {course.longDescription && (
                  <div className="text-sm text-[color:var(--color-neutral-700)] leading-relaxed prose prose-sm max-w-none">
                    {course.longDescription}
                  </div>
                )}
              </div>
            </section>

            {course.prerequisite && (
              <section className="space-y-4 mb-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <h2
                  className="text-xl font-bold border-b border-[color:var(--color-neutral-200)] pb-2 flex items-center gap-2"
                  style={{ fontFamily: "var(--font-heading-sans)" }}
                >
                  <ListChecks
                    className="text-[color:var(--color-primary-600)]"
                    size={20}
                  />
                  Requirements
                </h2>
                <div className="text-sm text-[color:var(--color-neutral-700)] leading-relaxed">
                  <ul className="list-disc pl-5 space-y-2">
                    {course.prerequisite
                      .split("\n")
                      .filter((p) => p.trim())
                      .map((req, i) => (
                        <li key={i}>{req.trim()}</li>
                      ))}
                  </ul>
                </div>
              </section>
            )}

            {course.syllabus && course.syllabus.sections.length > 0 && (
              <section className="space-y-4 mb-10">
                <h2
                  className="text-xl font-bold border-b border-[color:var(--color-neutral-200)] pb-2 flex items-center gap-2"
                  style={{ fontFamily: "var(--font-heading-sans)" }}
                >
                  <TableOfContents
                    className="text-[color:var(--color-primary-600)]"
                    size={20}
                  />
                  Course Syllabus
                </h2>
                <div className="space-y-4">
                  {course.syllabus.sections.map((section, idx) => {
                    const isExpanded = expandedSections[idx];
                    return (
                      <div
                        key={idx}
                        className="rounded-lg border border-[color:var(--color-neutral-200)] overflow-hidden transition-all duration-300"
                      >
                        <button
                          onClick={() => toggleSection(idx)}
                          className={`w-full flex items-center justify-between bg-[color:var(--color-neutral-50)] px-4 py-3 text-left transition-colors hover:bg-[color:var(--color-neutral-100)] border-b ${
                            isExpanded
                              ? "border-[color:var(--color-neutral-200)]"
                              : "border-transparent"
                          }`}
                        >
                          <h3 className="font-semibold text-sm">
                            {section.title}
                          </h3>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-[color:var(--color-neutral-500)]" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-[color:var(--color-neutral-500)]" />
                          )}
                        </button>
                        <div
                          className={`grid transition-all duration-300 ease-in-out ${
                            isExpanded
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="divide-y divide-[color:var(--color-neutral-200)] bg-white">
                              {section.items.map((item, iIdx) => (
                                <div
                                  key={iIdx}
                                  className="px-4 py-3 flex items-center justify-between gap-4"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-[color:var(--color-primary-500)] shrink-0" />
                                    <div>
                                      <div className="text-sm font-medium">
                                        {item.title}
                                      </div>
                                      <div className="text-[10px] text-[color:var(--color-neutral-500)] uppercase tracking-wider">
                                        {item.type}
                                      </div>
                                    </div>
                                  </div>
                                  {item.duration !== 0 && (
                                    <div className="text-xs text-[color:var(--color-neutral-500)]">
                                      {item.duration}{" "}
                                      {item.durationUnit.toLowerCase()}(s)
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {course.startDate && course.fromDay && (
              <section className="space-y-4 mb-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <h2
                  className="text-xl font-bold border-b border-[color:var(--color-neutral-200)] pb-2 flex items-center gap-2"
                  style={{ fontFamily: "var(--font-heading-sans)" }}
                >
                  <Timer
                    className="text-[color:var(--color-primary-600)]"
                    size={20}
                  />
                  Class Schedule
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {/* Date Card */}
                  <div className="relative overflow-hidden">
                    <div className="relative p-5 rounded-2xl border border-[color:var(--color-neutral-200)] bg-white/50 backdrop-blur-sm shadow-sm">
                      <div className="flex items-start gap-5">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-primary-600)]">
                            Days & Dates
                          </span>
                          <span className="text-lg font-bold text-[color:var(--color-neutral-900)] leading-tight">
                            {course.fromDay} - {course.toDay}
                          </span>
                          <span className="text-sm font-medium text-[color:var(--color-neutral-500)] leading-tight">
                            Starts{" "}
                            {new Date(course.startDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Time Card */}
                  <div className="relative overflow-hidden">
                    <div className="relative p-5 rounded-2xl border border-[color:var(--color-neutral-200)] bg-white/50 backdrop-blur-sm shadow-sm">
                      <div className="flex items-start gap-5">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-primary-600)]">
                            Time & Zone
                          </span>
                          <span className="text-lg font-bold text-[color:var(--color-neutral-900)] leading-tight">
                            {course.startTime} {course.startTimeDesignator} -{" "}
                            {course.endTime} {course.endTimeDesignator}
                          </span>
                          <span className="text-xs font-medium text-[color:var(--color-neutral-500)] leading-tight">
                            {course.timezone} Standard Time
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {course.additionalResourceLinks &&
              course.additionalResourceLinks.length > 0 && (
                <section className="space-y-4 mb-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <h2
                    className="text-xl font-bold border-b border-[color:var(--color-neutral-200)] pb-2 flex items-center gap-2"
                    style={{ fontFamily: "var(--font-heading-sans)" }}
                  >
                    <Link2
                      className="text-[color:var(--color-primary-600)]"
                      size={20}
                    />
                    Resources & Links
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {course.additionalResourceLinks.map((res, idx) => (
                      <a
                        key={idx}
                        href={res.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg border border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-50)]/50 hover:bg-white hover:border-[color:var(--color-primary-200)] transition-all group shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded bg-white flex items-center justify-center border border-[color:var(--color-neutral-100)]">
                            <ExternalLink
                              size={14}
                              className="text-[color:var(--color-neutral-400)] group-hover:text-[color:var(--color-primary-600)]"
                            />
                          </div>
                          <span className="text-sm font-medium text-[color:var(--color-neutral-700)] group-hover:text-[color:var(--color-primary-700)]">
                            {res.label || "External Resource"}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              )}

            {(isReviewsLoading || courseReviews.length > 0) && (
              <section className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className="text-xl font-bold text-[color:var(--color-neutral-900)]"
                    style={{ fontFamily: "var(--font-heading-sans)" }}
                  >
                    Student Reviews
                  </h2>
                </div>

                {/* Card container */}
                <div className="rounded-2xl border border-[color:var(--color-neutral-200)] bg-white shadow-sm overflow-hidden">
                  {isReviewsLoading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex gap-4 px-5 py-5 animate-pulse border-b border-[color:var(--color-neutral-100)] last:border-0"
                        >
                          <div className="h-9 w-9 rounded-full bg-[color:var(--color-neutral-100)] shrink-0" />
                          <div className="flex-1 space-y-2.5 pt-0.5">
                            <div className="flex items-center justify-between">
                              <div className="h-3.5 w-32 bg-[color:var(--color-neutral-100)] rounded-full" />
                              <div className="h-3 w-20 bg-[color:var(--color-neutral-100)] rounded-full" />
                            </div>
                            <div className="h-3 w-full bg-[color:var(--color-neutral-50)] rounded-full" />
                            <div className="h-3 w-3/4 bg-[color:var(--color-neutral-50)] rounded-full" />
                          </div>
                        </div>
                      ))
                    : courseReviews.map((r) => {
                        const studentName =
                          [r.student?.firstName, r.student?.lastName]
                            .filter(Boolean)
                            .join(" ") || "Anonymous Student";
                        const studentAvatar = r.student?.profilePictureKey
                          ? `${baseUrl}/${r.student.profilePictureKey}`
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              studentName,
                            )}&background=random`;

                        return (
                          <div
                            key={r.id}
                            className="px-5 py-5 border-b border-[color:var(--color-neutral-100)] last:border-0"
                          >
                            {/* avatar + name on left, stars on right */}
                            <div className="flex items-center justify-between gap-4 mb-2">
                              <div className="flex items-center gap-3 min-w-0">
                                <Image
                                  src={studentAvatar}
                                  alt={`${studentName} avatar`}
                                  width={36}
                                  height={36}
                                  className="h-9 w-9 rounded-full object-cover shrink-0"
                                  // unoptimized
                                />
                                <span className="text-sm font-semibold text-[color:var(--color-neutral-900)] truncate">
                                  {studentName}
                                </span>
                              </div>
                              <Rating value={r.rating} />
                            </div>
                            {/* comment starts flush below avatar */}
                            <p className="text-sm text-[color:var(--color-neutral-600)] leading-relaxed">
                              {r.comment || "Great course!"}
                            </p>
                          </div>
                        );
                      })}
                </div>
              </section>
            )}
          </section>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 space-y-10">
            {/* Pricing Card */}
            <Card className="border-[color:var(--color-primary-100)]">
              <CardContent className="py-6 px-6">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-3xl font-black text-[color:var(--color-primary-700)]">
                      Rs{" "}
                      {(
                        course.sellingPrice || course.markedPrice
                      ).toLocaleString()}
                    </span>
                    {!isEnrollmentClosed && course.isDiscountApplied && (
                      <Badge className="bg-[color:var(--color-primary-50)] text-[color:var(--color-primary-700)] border-[color:var(--color-primary-200)]">
                        Save {getDiscountPercent(course)}%
                      </Badge>
                    )}
                  </div>
                  {!isEnrollmentClosed && course.isDiscountApplied && (
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm line-through text-[color:var(--color-neutral-400)]">
                        Rs {course.markedPrice.toLocaleString()}
                      </span>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-rose-50 to-orange-50 text-rose-600 border border-rose-100 shadow-sm animate-in fade-in zoom-in duration-700">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider">
                          Limited time offer
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {isEnrollmentClosed ? (
                    <Button
                      disabled
                      className="w-full h-12 text-base font-bold opacity-80 cursor-not-allowed"
                    >
                      {course.availableSeatCount <= 0
                        ? "Batch Full"
                        : "Registration Closed"}
                    </Button>
                  ) : (
                    <Link
                      href={`/checkout?course=${course.slug}`}
                      className="block"
                    >
                      <Button className="w-full h-12 text-base font-bold shadow-md shadow-primary-600/10">
                        Enroll now
                      </Button>
                    </Link>
                  )}
                  <div className="space-y-2">
                    <p className="text-center text-[11px] text-[color:var(--color-neutral-500)] font-medium">
                      {isEnrollmentClosed
                        ? "Check related courses for upcoming batches"
                        : "7-Day Money-Back Guarantee"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Courses */}
            {relatedCourses.length > 0 && (
              <div>
                <h3
                  className="text-lg font-bold mb-5 flex items-center gap-2"
                  style={{ fontFamily: "var(--font-heading-sans)" }}
                >
                  <span className="w-1.5 h-6 bg-[color:var(--color-primary-600)] rounded-full" />
                  Related courses
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                  {relatedCourses.map((r) => (
                    <CourseCard key={r.id} course={r} />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </Container>
    </main>
  );
}
