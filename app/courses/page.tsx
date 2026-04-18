import { SITE_NAME } from "@/lib/constant";
import type { Metadata } from "next";
import CoursesContent from "./CoursesContent";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Courses - " + SITE_NAME,
  description:
    "Browse our collection of courses for " + SITE_NAME + " students.",
};

export default function CoursesPage() {
  return (
    <Suspense>
      <CoursesContent />
    </Suspense>
  );
}


