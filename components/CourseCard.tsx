"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Card, { CardContent } from "./ui/Card";
import Button from "./ui/Button";
import Link from "next/link";
import Rating from "./ui/Rating";
import Badge from "./ui/Badge";
import Image from "next/image";

export type Course = {
  id: string;
  title: string;
  slug: string;
  instructor: string;
  instructorAvatar?: string;
  rating: number;
  ratingCount?: number;
  price: number; // Original/Marked price
  sellingPrice?: number; // Final price (after discount)
  discount?: number; // percentage
  thumbnail?: string;
  category?: string;
  duration?: string;
};

export default function CourseCard({ course }: { course: Course }) {
  const router = useRouter();
  const hasDiscount =
    typeof course.discount === "number" && course.discount! > 0;
  const discounted =
    course.sellingPrice ??
    (hasDiscount
      ? Math.round(course.price * (1 - (course.discount as number) / 100))
      : course.price);

  return (
    <Card className="relative p-0 overflow-hidden">
      <div className="relative h-48 md:h-56">
        <Image
          src={course.thumbnail || "/images/thumb-3.svg"}
          alt="Course thumbnail"
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
          className="object-cover"
          unoptimized
          onError={(e) => {
            e.currentTarget.src = "/images/thumb-3.svg";
          }}
        />
        {hasDiscount && (
          <div className="absolute left-3 top-3">
            <Badge>Save {course.discount}%</Badge>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      <CardContent className="py-4">
        <div className="flex flex-col gap-2">
          <h3
            className="text-base font-semibold"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            {course.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-[color:var(--color-neutral-600)]">
            {course.instructorAvatar && (
              <Image
                src={course.instructorAvatar}
                alt={`${course.instructor} avatar`}
                width={18}
                height={18}
                className="h-[18px] w-[18px] rounded-full object-cover"
                unoptimized
                onError={(e) => {
                  e.currentTarget.src = "/images/thumb-3.svg";
                }}
              />
            )}
            <span>{course.instructor}</span>
          </div>
          {/* <div className="flex items-center gap-2">
            <Rating value={course.rating} count={course.ratingCount} />
          </div> */}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-lg font-bold text-[color:var(--color-primary-700)]">
              Rs {discounted}
            </span>
            {hasDiscount && (
              <span className="text-sm line-through text-[color:var(--color-neutral-500)]">
                Rs {course.price}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/courses/${course.slug}`);
              }}
            >
              View
            </Button>
            <Link
              href={`/checkout?course=${course.slug}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Button size="sm" variant="secondary">
                Enroll
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
