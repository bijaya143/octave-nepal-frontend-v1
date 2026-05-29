import { SITE_NAME } from "@/lib/constant";
import type { Metadata } from "next";
import CoursesContent from "./CoursesContent";
import { Suspense } from "react";
import { buildCourseListSchema, serializeSchema } from "@/lib/schema";
import { guestCourseService } from "@/lib/services/guest/course";
import { PublishStatusType } from "@/lib/services/admin/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://octavenepal.com";
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";

export const metadata: Metadata = {
  title: "Online Courses & Professional Training",
  description: `Browse all online courses and live classes offered by ${SITE_NAME}. Learn technology, business, creative arts, and professional skills from industry experts in Nepal.`,
  keywords: [
    "online courses nepal",
    "online class nepal",
    "best online training kathmandu",
    "professional certification nepal",
    "it courses nepal",
    "business training nepal",
    "creative arts learning nepal",
    "octave nepal courses",
  ],
  alternates: {
    canonical: `${SITE_URL}/courses`,
  },
  openGraph: {
    title: `Online Courses & Professional Training - ${SITE_NAME}`,
    description: `Browse all online courses and live classes offered by ${SITE_NAME}. Learn technology, business, creative arts, and professional skills in Nepal.`,
    url: `${SITE_URL}/courses`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Online Courses & Professional Training - ${SITE_NAME}`,
    description: `Browse all online courses and live classes offered by ${SITE_NAME}. Learn technology, business, creative arts, and professional skills in Nepal.`,
  },
};

export default async function CoursesPage() {
  // Fetch published courses for CollectionPage/ItemList schema
  let schemaJson: string | null = null;

  try {
    const resp = await guestCourseService.list({
      status: PublishStatusType.PUBLISHED,
      limit: 10,
      page: 1,
    });

    if (resp.success && resp.data?.data?.length) {
      const schema = buildCourseListSchema(
        resp.data.data.map((c) => ({
          title: c.title,
          slug: c.slug,
          description: c.subtitle || c.metaDescription,
          thumbnailUrl: c.thumbnailKey
            ? `${IMAGE_BASE_URL}/${c.thumbnailKey}`
            : undefined,
          price: c.sellingPrice ?? c.markedPrice,
          instructorName: `${c.instructor.firstName} ${c.instructor.lastName}`,
        })),
      );
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
      <Suspense>
        <CoursesContent />
      </Suspense>
    </>
  );
}
