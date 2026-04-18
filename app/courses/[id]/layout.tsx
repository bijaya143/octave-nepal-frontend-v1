import { Metadata } from "next";
import { SITE_NAME } from "@/lib/constant";
import { guestCourseService } from "@/lib/services/guest/course";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: slug } = await params;

  try {
    const resp = await guestCourseService.getBySlug(slug);

    if (!resp.success || !resp.data) {
      return {
        title: "Course Not Found - " + SITE_NAME,
      };
    }

    const course = resp.data;
    return {
      title: (course.metaTitle || course.title) + " - " + SITE_NAME,
      description:
        course.metaDescription ||
        course.subtitle ||
        `Learn more about ${course.title} at ${SITE_NAME}.`,
    };
  } catch (error) {
    return {
      title: "Course Not Found - " + SITE_NAME,
    };
  }
}

export default function CourseDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
