"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Course } from "@/lib/services/admin/types";
import Image from "next/image";
import Card from "@/components/ui/Card";
import {
  BarChart2,
  Globe,
  BookOpen,
  CheckCircle2,
  Star,
  ListChecks,
  TableOfContents,
  ChevronDown,
  ChevronUp,
  Timer,
  Link2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface StudentCourseViewModalProps {
  open: boolean;
  onClose: () => void;
  course: Course | null;
}

export default function StudentCourseViewModal({
  open,
  onClose,
  course,
}: StudentCourseViewModalProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<number, boolean>
  >({ 0: true });

  const toggleSection = (idx: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  if (!course) return null;

  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";
  const instructorName = `${course.instructor?.firstName || ""} ${course.instructor?.lastName || ""}`;
  const instructorAvatar = course.instructor?.profilePictureKey
    ? `${baseUrl}/${course.instructor.profilePictureKey}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(instructorName)}&background=random`;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Course Details"
      panelClassName="max-w-4xl"
    >
      <div className="custom-scrollbar">
        {/* Header Section */}
        <div className="mb-8">
          <h1
            className="text-2xl font-bold tracking-tight mb-2"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            {course.title}
          </h1>
          <p className="text-[color:var(--color-neutral-600)] text-sm mb-6">
            {course.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-y-3 gap-x-6 mb-8">
            <span className="flex items-center gap-2 text-sm text-[color:var(--color-neutral-700)]">
              <Image
                src={instructorAvatar}
                alt={instructorName}
                width={24}
                height={24}
                className="h-6 w-6 rounded-full object-cover border border-[color:var(--color-neutral-200)]"
              />
              By {instructorName}
            </span>

            {/* Desktop & Tablet: Inline pill */}
            <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-[color:var(--color-neutral-600)] bg-[color:var(--color-neutral-50)] px-3 py-2 rounded-lg border border-[color:var(--color-neutral-100)]">
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
                {course.lessonCount || 0} lessons
              </span>
            </div>

            {/* Mobile: Grid */}
            <div className="sm:hidden w-full grid grid-cols-3 divide-x divide-[color:var(--color-neutral-200)] border border-[color:var(--color-neutral-200)] rounded-xl bg-[color:var(--color-neutral-50)] overflow-hidden">
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
                  {course.lessonCount || 0} lessons
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
                className="object-cover"
              />
            </div>
          </Card>
        </div>

        <div className="space-y-10">
          {/* Learning Outcomes */}
          {course.learningOutcome && (
            <section>
              <div className="bg-[color:var(--color-primary-50)]/30 border border-[color:var(--color-primary-100)] rounded-xl p-5 md:p-6">
                <h2
                  className="text-base font-bold mb-4 flex items-center gap-2"
                  style={{ fontFamily: "var(--font-heading-sans)" }}
                >
                  <CheckCircle2
                    className="text-[color:var(--color-primary-600)]"
                    size={18}
                  />
                  What you'll learn
                </h2>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                  {course.learningOutcome
                    .split("\n")
                    .filter((l) => l.trim())
                    .map((outcome, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="mt-1 h-4 w-4 rounded-full bg-[color:var(--color-primary-50)] text-[color:var(--color-primary-600)] flex items-center justify-center shrink-0 border border-[color:var(--color-primary-100)]">
                          <Star size={10} />
                        </div>
                        <span className="text-sm text-[color:var(--color-neutral-700)] leading-relaxed pt-0.5">
                          {outcome.trim()}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </section>
          )}

          {/* Description */}
          <section>
            <h2
              className="text-lg font-bold border-b border-[color:var(--color-neutral-200)] pb-2 mb-4"
              style={{ fontFamily: "var(--font-heading-sans)" }}
            >
              About this course
            </h2>
            <div className="space-y-4">
              {course.shortDescription && (
                <p className="text-sm font-semibold text-[color:var(--color-neutral-900)] leading-relaxed italic border-l-4 border-[color:var(--color-primary-500)] pl-4 py-1">
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

          {/* Syllabus */}
          {course.syllabus && course.syllabus.sections.length > 0 && (
            <section>
              <h2
                className="text-lg font-bold border-b border-[color:var(--color-neutral-200)] pb-2 mb-4 flex items-center gap-2"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                <TableOfContents
                  className="text-[color:var(--color-primary-600)]"
                  size={18}
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
                          <ChevronUp
                            size={16}
                            className="text-[color:var(--color-neutral-500)]"
                          />
                        ) : (
                          <ChevronDown
                            size={16}
                            className="text-[color:var(--color-neutral-500)]"
                          />
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

          {/* Class Schedule */}
          {course.startDate && (
            <section className="space-y-4">
              <h2
                className="text-lg font-bold border-b border-[color:var(--color-neutral-200)] pb-2 flex items-center gap-2"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                <Timer
                  className="text-[color:var(--color-primary-600)]"
                  size={18}
                />
                Class Schedule
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-50)]/50">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-primary-600)] mb-1">
                    Days & Dates
                  </div>
                  <div className="text-base font-bold text-[color:var(--color-neutral-900)]">
                    {course.fromDay} {course.toDay ? `- ${course.toDay}` : ""}
                  </div>
                  <div className="text-xs text-[color:var(--color-neutral-500)] mt-1">
                    Starts{" "}
                    {new Date(course.startDate).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div className="p-5 rounded-xl border border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-50)]/50">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-primary-600)] mb-1">
                    Time & Zone
                  </div>
                  <div className="text-base font-bold text-[color:var(--color-neutral-900)]">
                    {course.startTime} {course.startTimeDesignator} -{" "}
                    {course.endTime} {course.endTimeDesignator}
                  </div>
                  <div className="text-xs text-[color:var(--color-neutral-500)] mt-1">
                    {course.timezone} Standard Time
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Requirements */}
          {course.prerequisite && (
            <section className="space-y-4">
              <h2
                className="text-lg font-bold border-b border-[color:var(--color-neutral-200)] pb-2 flex items-center gap-2"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                <ListChecks
                  className="text-[color:var(--color-primary-600)]"
                  size={18}
                />
                Requirements
              </h2>
              <ul className="text-sm text-[color:var(--color-neutral-700)] list-disc pl-5 space-y-2">
                {course.prerequisite
                  .split("\n")
                  .filter((p) => p.trim())
                  .map((req, i) => (
                    <li key={i}>{req.trim()}</li>
                  ))}
              </ul>
            </section>
          )}

          {/* Resources */}
          {course.additionalResourceLinks &&
            course.additionalResourceLinks.length > 0 && (
              <section className="space-y-4">
                <h2
                  className="text-lg font-bold border-b border-[color:var(--color-neutral-200)] pb-2 flex items-center gap-2"
                  style={{ fontFamily: "var(--font-heading-sans)" }}
                >
                  <Link2
                    className="text-[color:var(--color-primary-600)]"
                    size={18}
                  />
                  Additional Resources
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.additionalResourceLinks.map((res, idx) => (
                    <a
                      key={idx}
                      href={res.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3.5 rounded-lg border border-[color:var(--color-neutral-200)] bg-white hover:border-[color:var(--color-primary-200)] transition-all group shadow-sm"
                    >
                      <div className="h-9 w-9 rounded-lg bg-[color:var(--color-neutral-50)] flex items-center justify-center border border-[color:var(--color-neutral-100)] shrink-0">
                        <ExternalLink
                          size={16}
                          className="text-[color:var(--color-neutral-400)] group-hover:text-[color:var(--color-primary-600)]"
                        />
                      </div>
                      <span className="text-sm font-medium text-[color:var(--color-neutral-700)] group-hover:text-[color:var(--color-primary-700)] leading-snug">
                        {res.label || "External Resource"}
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            )}
        </div>
      </div>
    </Modal>
  );
}
