import React from "react";
import Link from "next/link";
import Button from "../../../components/ui/Button";
import Card, { CardContent } from "../../../components/ui/Card";
import CourseCard, { type Course } from "../../../components/CourseCard";
import Rating from "../../../components/ui/Rating";
import Image from "next/image";
import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constant";
import Container from "@/components/Container";

const related: Course[] = [
  {
    id: "2",
    title: "TypeScript Deep Dive",
    instructor: "John Smith",
    instructorAvatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=96&q=80",
    rating: 4.8,
    ratingCount: 860,
    price: 119,
    discount: 25,
    thumbnail:
      "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "3",
    title: "Next.js 15 Pro",
    instructor: "Alex Kim",
    instructorAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=96&q=80",
    rating: 4.9,
    ratingCount: 540,
    price: 139,
    discount: 30,
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "4",
    title: "UI Design Principles",
    instructor: "Sam Lee",
    instructorAvatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=96&q=80",
    rating: 4.6,
    ratingCount: 320,
    price: 109,
    discount: 20,
    thumbnail:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=1200&q=80",
  },
];

const reviews = [
  {
    name: "Aarav Shrestha",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=128&q=80",
    rating: 4.5,
    text: "Great pacing and crystal-clear explanations. Projects felt practical and relevant.",
  },
  {
    name: "Prerana Karki",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=128&q=80",
    rating: 5,
    text: "Loved the design of the platform and the depth of content. Highly recommended!",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const course = await getCourse(id);
  return {
    title: course.title + " - " + SITE_NAME,
    description: "Learn more about " + course.title + " at " + SITE_NAME + ".",
  };
}

async function getCourse(id: string): Promise<Course> {
  // Mock fetch: derive title from id for demo
  return {
    id,
    title: `Professional Course ${id}`,
    instructor: "Jane Doe",
    instructorAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80",
    rating: 4.7,
    ratingCount: 1120,
    price: 129,
    discount: 35,
    duration: "12h 30m",
    thumbnail:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourse(id);

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
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center gap-2 text-sm text-[color:var(--color-neutral-700)]">
                {course.instructorAvatar && (
                  <Image
                    src={course.instructorAvatar}
                    alt={`${course.instructor} avatar`}
                    width={20}
                    height={20}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                )}
                By {course.instructor}
              </span>
              <Rating value={course.rating} count={course.ratingCount} />
              <span className="text-sm text-[color:var(--color-neutral-600)]">
                • {course.duration}
              </span>
            </div>

            <Card className="overflow-hidden mb-6">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={course.thumbnail || "/images/thumb-1.svg"}
                  alt="Course thumbnail"
                  fill
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Card>

            <section className="space-y-4">
              <h2
                className="text-lg font-semibold"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                Description
              </h2>
              <p className="text-sm text-[color:var(--color-neutral-700)]">
                Build real-world React 19 apps using modern patterns, server
                actions, and performance best practices. Learn by doing with
                hands-on projects.
              </p>
            </section>

            <section className="space-y-3 mt-8">
              <h2
                className="text-lg font-semibold"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                Syllabus
              </h2>
              <ul className="list-disc pl-6 text-sm space-y-2">
                <li>Modern React mental model</li>
                <li>State and performance</li>
                <li>Server components basics</li>
                <li>Data fetching and caching</li>
                <li>Testing and deployment</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2
                className="text-lg font-semibold mb-3"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                Reviews
              </h2>
              <Card>
                <CardContent className="py-5">
                  <div className="space-y-4">
                    {reviews.map((r) => (
                      <div
                        key={r.name}
                        className="border-b last:border-0 border-[color:var(--color-neutral-200)] pb-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Image
                              src={r.avatar}
                              alt={`${r.name} avatar`}
                              width={32}
                              height={32}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                            <span className="text-sm font-medium">
                              {r.name}
                            </span>
                          </div>
                          <Rating value={r.rating} />
                        </div>
                        <p className="text-sm text-[color:var(--color-neutral-700)] mt-1">
                          {r.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          </section>

          {/* Sidebar */}
          <aside>
            <Card>
              <CardContent className="py-5">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl text-[color:var(--color-primary-700)] font-bold">
                    Rs 84
                  </span>
                  <span className="text-sm line-through text-[color:var(--color-neutral-500)]">
                    Rs 129
                  </span>
                </div>
                <Link href={`/checkout?courseId=${id}`} className="block">
                  <Button className="w-full">Enroll now</Button>
                </Link>
                <p className="text-xs text-[color:var(--color-neutral-600)] mt-3">
                  30-day money-back guarantee
                </p>
              </CardContent>
            </Card>

            <div className="mt-8">
              <h3
                className="text-base font-semibold mb-3"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                Related courses
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
                {related.map((r) => (
                  <CourseCard key={r.id} course={r} />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}
