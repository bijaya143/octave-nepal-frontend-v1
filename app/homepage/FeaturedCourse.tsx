"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "../../components/Container";
import Carousel from "../../components/ui/Carousel";
import CourseCard, {
  type Course as UICourse,
} from "../../components/CourseCard";
import Card, { CardContent } from "../../components/ui/Card";
import { guestCourseService } from "@/lib/services/guest";
import {
  PublishStatusType,
  CourseDiscountType,
  Course,
} from "@/lib/services/admin";

// ─── helpers ────────────────────────────────────────────────────────────────

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

function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
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

export default function FeaturedCourse() {
  const [featured, setCourses] = useState<UICourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    guestCourseService
      .list({
        beforeEnrollmentDate: new Date().toISOString().split("T")[0], // For guest only
        isSalePeriodApplied: false,
        status: PublishStatusType.PUBLISHED,
        page: 1,
        limit: 10,
      })
      .then((res) => {
        if (res.success && res.data?.data) {
          setCourses(
            res.data?.data.map((c: Course) => ({
              id: c.id,
              title: c.title,
              slug: c.slug,
              instructor:
                [c.instructor?.firstName, c.instructor?.lastName]
                  .filter(Boolean)
                  .join(" ") || "Instructor",
              instructorAvatar: c.instructor?.profilePictureKey
                ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${c.instructor.profilePictureKey}`
                : undefined,
              rating: c.averageReviewRatingCount || 0,
              ratingCount: c.reviewCount || 0,
              price: c.markedPrice,
              sellingPrice: c.sellingPrice,
              discount: getDiscountPercent(c),
              thumbnail: c.thumbnailKey
                ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${c.thumbnailKey}`
                : undefined,
            })),
          );
        }
      })
      .catch((err) => {
        console.error("Failed to fetch featured courses:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!loading && featured.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 md:mt-16">
      <Container>
        <div className="flex items-center justify-between gap-2 mb-4">
          <h2
            className="text-xl md:text-2xl font-semibold"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            Featured courses
          </h2>
          <Link
            href="/courses"
            className="text-sm text-[color:var(--color-primary-700)] hover:underline underline-offset-2 whitespace-nowrap"
          >
            View all courses
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <>
            {/* Mobile: one course per slide */}
            <div className="sm:hidden">
              <Carousel>
                {featured.map((course) => (
                  <div key={course.id}>
                    <CourseCard course={course} />
                  </div>
                ))}
              </Carousel>
            </div>

            {/* Tablets: slides of 2 items */}
            <div className="hidden sm:block lg:hidden">
              <Carousel>
                {chunkArray(featured, 2).map((group, i) => (
                  <div key={i} className="grid sm:grid-cols-2 gap-4 md:gap-6">
                    {group.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                ))}
              </Carousel>
            </div>

            {/* Desktop: slides of 3 items */}
            <div className="hidden lg:block">
              <Carousel>
                {chunkArray(featured, 3).map((group, i) => (
                  <div key={i} className="grid lg:grid-cols-3 gap-6">
                    {group.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                ))}
              </Carousel>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
