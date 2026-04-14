"use client";
import React from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card, { CardContent } from "../../components/ui/Card";
import CourseCard, { type Course } from "../../components/CourseCard";
import Modal from "../../components/ui/Modal";
import { Filter } from "lucide-react";
import Container from "@/components/Container";
import Select from "@/components/ui/Select";

const thumbs = [
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
];
const instructorAvatars = [
  "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=96&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=96&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80",
];

const allCourses: Course[] = Array.from({ length: 9 }).map((_, i) => ({
  id: String(i + 1),
  title: `Professional Course ${i + 1}`,
  slug: `professional-course-${i + 1}`,
  instructor: i % 2 === 0 ? "Jane Doe" : "John Smith",
  instructorAvatar: instructorAvatars[i % instructorAvatars.length],
  rating: 4.5,
  ratingCount: 200 + i * 3,
  price: 99 + i * 5,
  discount: i % 3 === 0 ? 20 : 0,
  thumbnail: thumbs[i % thumbs.length],
}));

function FiltersForm() {
  return (
    <>
      <h2
        className="text-base font-semibold mb-4"
        style={{ fontFamily: "var(--font-heading-sans)" }}
      >
        Filters
      </h2>
      <div className="space-y-4">
        <Input label="Search" placeholder="Search courses" />
        <div>
          <label className="text-sm font-medium">Category</label>
          <Select className="mt-2">
            <option>All</option>
            <option>Development</option>
            <option>Design</option>
            <option>Business</option>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Price</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Input placeholder="Min" />
            <Input placeholder="Max" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Duration</label>
          <Select className="mt-2">
            <option>Any</option>
            <option>0-2 hours</option>
            <option>2-10 hours</option>
            <option>10+ hours</option>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Rating</label>
          <select className="mt-2 h-11 w-full rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 shadow-xs">
            <option value="4.5+">4.5+ stars</option>
            <option>4.0+ stars</option>
            <option>3.5+ stars</option>
          </select>
        </div>
        <Button variant="secondary" className="w-full">
          Reset filters
        </Button>
      </div>
    </>
  );
}

export default function CoursesContent() {
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  return (
    <main>
      <Container className="py-5 md:py-10">
        <div className="grid lg:grid-cols-[260px_1fr] gap-6 items-start">
          {/* Filters */}
          <aside className="sticky top-20 hidden lg:block">
            <Card>
              <CardContent className="py-5">
                <FiltersForm />
              </CardContent>
            </Card>
          </aside>

          {/* Listing */}
          <section>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <h1
                  className="text-xl md:text-2xl font-semibold"
                  style={{ fontFamily: "var(--font-heading-sans)" }}
                >
                  All courses
                </h1>
                <p className="hidden sm:block text-sm text-[color:var(--color-neutral-600)]">
                  Hand-picked modern curriculum
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  aria-label="Open filters"
                  title="Filters"
                  type="button"
                  className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-0 leading-none shadow-xs hover:bg-[color:var(--color-neutral-50)] active:bg-[color:var(--color-neutral-100)] text-[color:var(--color-primary-600)] hover:text-[color:var(--color-primary-700)]"
                  onClick={() => setFiltersOpen(true)}
                >
                  <Filter className="h-5 w-5" aria-hidden />
                </button>
                <Select>
                  <option>Most popular</option>
                  <option>Highest rated</option>
                  <option>Newest</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {allCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        </div>
      </Container>
      <Modal open={filtersOpen} onClose={() => setFiltersOpen(false)} title="">
        <div className="space-y-4">
          <FiltersForm />
        </div>
      </Modal>
    </main>
  );
}
