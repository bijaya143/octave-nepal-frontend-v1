import { Metadata } from "next";
import { SITE_NAME } from "@/lib/constant";
import { guestCourseService } from "@/lib/services/guest/course";
import {
  buildCourseSchema,
  serializeSchema,
} from "@/lib/schema";
import { formatDurationWithUnit } from "@/lib/utils/formatDuration";

const SITE_URL = process.env.NEXT_PUBLIC_PROD_SITE_URL || "https://octavenepal.com";
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";

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
        title: "Course Not Found",
      };
    }

    const course = resp.data;
    const courseUrl = `${SITE_URL}/courses/${slug}`;
    const thumbnailUrl = course.thumbnailKey
      ? `${IMAGE_BASE_URL}/${course.thumbnailKey}`
      : undefined;
    const instructorName = `${course.instructor.firstName} ${course.instructor.lastName}`;
    const title = course.metaTitle || course.title;
    const description =
      course.metaDescription ||
      course.subtitle ||
      `Learn more about ${course.title} at ${SITE_NAME}.`;

    return {
      title,
      description,
      keywords: course.metaKeywords,
      alternates: {
        canonical: courseUrl,
      },
      openGraph: {
        title,
        description,
        url: courseUrl,
        siteName: SITE_NAME,
        type: "website",
        images: thumbnailUrl
          ? [
              {
                url: thumbnailUrl,
                width: 1200,
                height: 675,
                alt: course.title,
              },
            ]
          : undefined,
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: thumbnailUrl ? [thumbnailUrl] : undefined,
        creator: "@octavenepal",
      },
      authors: [{ name: instructorName }],
    };
  } catch {
    return {
      title: "Course Not Found",
    };
  }
}

export default async function CourseDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;

  let schemaJson: string | null = null;

  try {
    const resp = await guestCourseService.getBySlug(slug);

    if (resp.success && resp.data) {
      const course = resp.data;
      const instructorName = `${course.instructor.firstName} ${course.instructor.lastName}`;
      const thumbnailUrl = course.thumbnailKey
        ? `${IMAGE_BASE_URL}/${course.thumbnailKey}`
        : undefined;

      const isEnrollmentOpen =
        !!course.lastEnrollmentDate &&
        course.availableSeatCount > 0 &&
        new Date(course.lastEnrollmentDate) >= new Date();

      const durationStr = formatDurationWithUnit(
        course.duration,
        course.durationUnit,
      );

      const schema = buildCourseSchema({
        title: course.metaTitle || course.title,
        description:
          course.metaDescription ||
          course.subtitle ||
          `Learn ${course.title} at ${SITE_NAME}.`,
        slug,
        thumbnailUrl,
        instructorName,
        price: course.markedPrice,
        sellingPrice: course.sellingPrice,
        currency: "NPR",
        level: course.level,
        language: course.language,
        startDate: course.startDate,
        duration: durationStr,
        averageRating: course.averageReviewRatingCount,
        reviewCount: course.reviewCount,
        availableSeats: course.availableSeatCount,
        isEnrollmentOpen,
      });

      schemaJson = serializeSchema(schema);
    }
  } catch {
    // Schema injection is best-effort — page still renders without it
  }

  return (
    <>
      {schemaJson && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaJson }}
        />
      )}
      {children}
    </>
  );
}
