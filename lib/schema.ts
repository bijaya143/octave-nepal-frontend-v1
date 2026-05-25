/**
 * JSON-LD Schema Builder Helpers
 *
 * Generates structured data objects for Google and Bing rich results.
 * All schema types follow schema.org specifications.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_PROD_SITE_URL || "https://octavenepal.com";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Octave Nepal";

// ---------------------------------------------------------------------------
// Organization Schema
// ---------------------------------------------------------------------------

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/android-chrome-512x512.png`,
      width: 512,
      height: 512,
    },
    description:
      "AI-powered online learning platform in Nepal offering practical, project-based and cohort-based courses taught by industry experts.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "NP",
      addressLocality: "Kathmandu",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${SITE_URL}/contact-us`,
      availableLanguage: ["English", "Nepali"],
    },
    sameAs: [
      "https://facebook.com/profile.php?id=61583347305419",
      "https://instagram.com/octavenepal",
      "https://linkedin.com/company/octavenepal",
      "https://x.com/octave_nepal",
      "https://youtube.com/@octavenepal",
    ],
  };
}

// ---------------------------------------------------------------------------
// WebSite Schema (enables Google Sitelinks Search Box)
// ---------------------------------------------------------------------------

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "AI-powered online courses with a modern learning experience for Nepalese students.",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/courses?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ---------------------------------------------------------------------------
// FAQPage Schema
// ---------------------------------------------------------------------------

export function buildFaqSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ---------------------------------------------------------------------------
// Course Schema (Google's preferred type for online learning)
// ---------------------------------------------------------------------------

export interface CourseSchemaInput {
  title: string;
  description: string;
  slug: string;
  thumbnailUrl?: string;
  instructorName: string;
  price: number;
  sellingPrice?: number;
  currency?: string;
  level?: string;
  language?: string;
  startDate?: string;
  duration?: string;
  averageRating?: number;
  reviewCount?: number;
  availableSeats?: number;
  isEnrollmentOpen?: boolean;
}

export function buildCourseSchema(course: CourseSchemaInput) {
  const courseUrl = `${SITE_URL}/courses/${course.slug}`;
  const effectivePrice = course.sellingPrice ?? course.price;
  const isAvailable =
    course.isEnrollmentOpen !== false && (course.availableSeats ?? 1) > 0;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${courseUrl}#course`,
    name: course.title,
    description: course.description,
    url: courseUrl,
    provider: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    author: {
      "@type": "Person",
      name: course.instructorName,
    },
    educationalLevel: course.level ?? "Beginner",
    inLanguage: course.language ?? "Nepali",
    offers: {
      "@type": "Offer",
      "@id": `${courseUrl}#offer`,
      price: effectivePrice,
      priceCurrency: course.currency ?? "NPR",
      availability: isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
      url: courseUrl,
      seller: {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
      },
      validFrom: new Date().toISOString().split("T")[0],
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      inLanguage: course.language ?? "Nepali",
      ...(course.startDate && { startDate: course.startDate }),
      ...(course.duration && { duration: course.duration }),
      courseWorkload: course.duration ?? "Self-paced",
      instructor: {
        "@type": "Person",
        name: course.instructorName,
      },
    },
  };

  if (course.thumbnailUrl) {
    schema.image = {
      "@type": "ImageObject",
      url: course.thumbnailUrl,
    };
  }

  if (
    course.averageRating !== undefined &&
    course.reviewCount !== undefined &&
    course.reviewCount > 0
  ) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: course.averageRating.toFixed(1),
      reviewCount: course.reviewCount,
      bestRating: "5",
      worstRating: "1",
    };
  }

  return schema;
}

// ---------------------------------------------------------------------------
// CollectionPage / ItemList Schema (for /courses listing)
// ---------------------------------------------------------------------------

export function buildCourseListSchema(
  courses: Array<{
    title: string;
    slug: string;
    description?: string;
    thumbnailUrl?: string;
    price?: number;
    instructorName?: string;
  }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/courses#collection`,
    name: `Online Courses - ${SITE_NAME}`,
    description: `Browse all online courses offered by ${SITE_NAME}. Learn in-demand skills with expert instructors.`,
    url: `${SITE_URL}/courses`,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    mainEntity: {
      "@type": "ItemList",
      name: `${SITE_NAME} Course Catalog`,
      itemListElement: courses.map((course, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Course",
          name: course.title,
          url: `${SITE_URL}/courses/${course.slug}`,
          ...(course.description && { description: course.description }),
          ...(course.thumbnailUrl && { image: course.thumbnailUrl }),
          ...(course.instructorName && {
            author: {
              "@type": "Person",
              name: course.instructorName,
            },
          }),
          provider: {
            "@type": "Organization",
            "@id": `${SITE_URL}/#organization`,
            name: SITE_NAME,
          },
          ...(course.price !== undefined && {
            offers: {
              "@type": "Offer",
              price: course.price,
              priceCurrency: "NPR",
              url: `${SITE_URL}/courses/${course.slug}`,
            },
          }),
        },
      })),
    },
  };
}

// ---------------------------------------------------------------------------
// Serialize to JSON-LD string (for use in <script> tags)
// ---------------------------------------------------------------------------

export function serializeSchema(schema: Record<string, unknown>): string {
  return JSON.stringify(schema);
}
