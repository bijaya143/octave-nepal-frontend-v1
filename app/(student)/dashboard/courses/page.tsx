"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Select from "@/components/ui/Select";
import {
  BookOpen,
  Hammer,
  Award,
  CalendarClock,
  PlayCircle,
} from "lucide-react";

const enrolled = [
  {
    id: "react-19",
    title: "React 19 Fundamentals",
    nextSession: "Tue 7:00 PM",
    progress: 45,
    instructor: "Jane Doe",
  },
  {
    id: "ts-mastery",
    title: "TypeScript Mastery",
    nextSession: "Fri 6:30 PM",
    progress: 70,
    instructor: "John Smith",
  },
  {
    id: "node-apis",
    title: "Node.js APIs",
    nextSession: "Sun 8:00 AM",
    progress: 20,
    instructor: "Alex Lee",
  },
  {
    id: "frontend-foundations",
    title: "Frontend Foundations",
    progress: 100,
    completedOn: "Oct 5, 2025",
    instructor: "Jane Doe",
  },
  {
    id: "git-essentials",
    title: "Git & GitHub Essentials",
    progress: 100,
    completedOn: "Sep 12, 2025",
    instructor: "John Smith",
  },
];

export default function StudentCoursesPage() {
  const activeCourses = enrolled.filter((c) => (c.progress ?? 0) < 100);
  const completedCourses = enrolled.filter((c) => (c.progress ?? 0) >= 100);
  const totalEnrolled = enrolled.length;

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Courses" },
        ]}
        className="mb-2"
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1
            className="text-xl md:text-2xl font-semibold"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            Your courses
          </h1>
          <p className="text-sm text-[color:var(--color-neutral-600)]">
            Manage and continue your enrolled courses
          </p>
        </div>
        <Link href="/courses" className="w-full sm:w-auto">
          <Button variant="secondary" className="w-full sm:w-auto">
            Browse all courses
          </Button>
        </Link>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {[
          {
            label: "Enrolled",
            value: totalEnrolled,
            Icon: BookOpen,
            accent: "rgba(59,130,246,0.10)",
          },
          {
            label: "In Progress",
            value: activeCourses.length,
            Icon: Hammer,
            accent: "rgba(99,102,241,0.10)",
          },
          {
            label: "Completed",
            value: completedCourses.length,
            Icon: Award,
            accent: "rgba(16,185,129,0.10)",
          },
        ].map((s) => (
          <Card key={s.label} className="relative overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at top right, ${s.accent}, transparent 60%)`,
              }}
            />
            <CardContent className="relative py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-[color:var(--color-neutral-600)]">
                    {s.label}
                  </div>
                  <div
                    className="mt-1 text-lg font-semibold"
                    style={{ fontFamily: "var(--font-heading-sans)" }}
                  >
                    {s.value}
                  </div>
                </div>
                <div className="h-9 w-9 shrink-0 rounded-lg border border-[color:var(--color-neutral-200)] bg-white text-[color:var(--color-primary-700)] shadow-xs flex items-center justify-center">
                  <s.Icon size={16} aria-hidden="true" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {activeCourses.map((c) => (
          <Card key={c.id} className="relative overflow-hidden group">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_60%)]" />
            <CardContent className="relative py-5">
              {c.nextSession && (
                <div className="absolute top-3 right-3 inline-flex items-center gap-1">
                  <CalendarClock size={14} aria-hidden />
                  <Badge variant="outline">{c.nextSession}</Badge>
                </div>
              )}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div
                    className="text-sm font-semibold truncate"
                    title={c.title}
                    style={{ fontFamily: "var(--font-heading-sans)" }}
                  >
                    {c.title}
                  </div>
                  <div className="mt-1 text-xs text-[color:var(--color-neutral-600)] flex items-center gap-2">
                    <span className="mr-2">Instructor: {c.instructor}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{c.progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[color:var(--color-neutral-200)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[color:var(--color-primary-500)] group-hover:bg-[color:var(--color-primary-600)] transition-all"
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <Button size="sm">View</Button>
                <Link href={``}>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="inline-flex items-center gap-1"
                  >
                    <PlayCircle size={14} aria-hidden />
                    Join
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Completed */}
      {completedCourses.length > 0 && (
        <div className="mt-10">
          <h2
            className="text-base font-semibold mb-3"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            Completed courses
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {completedCourses.map((c) => (
              <Card key={c.id} className="relative overflow-hidden group">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08),transparent_60%)]" />
                <CardContent className="relative py-5">
                  <div className="absolute top-3 right-3 inline-flex items-center gap-1">
                    <Award size={14} aria-hidden />
                    <Badge variant="outline">Completed</Badge>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div
                        className="text-sm font-semibold truncate"
                        title={c.title}
                        style={{ fontFamily: "var(--font-heading-sans)" }}
                      >
                        {c.title}
                      </div>
                      <div className="mt-1 text-xs text-[color:var(--color-neutral-600)]">
                        <span className="mr-2">Instructor: {c.instructor}</span>
                      </div>
                    </div>
                  </div>

                  {c.completedOn && (
                    <div className="mt-4 text-xs text-[color:var(--color-neutral-600)]">
                      Completed on {c.completedOn}
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-end gap-2">
                    <Button size="sm">Review</Button>
                    <Button size="sm" variant="secondary">
                      View certificate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
