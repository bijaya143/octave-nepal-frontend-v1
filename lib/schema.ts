/**
 * JSON-LD Schema Builder Helpers
 *
 * Generates structured data objects for Google and Bing rich results.
 * All schema types follow schema.org specifications.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://octavenepal.com";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Octave Nepal";

// ---------------------------------------------------------------------------
// Organization Schema
// ---------------------------------------------------------------------------

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization", // CRITICAL: Changes category from a generic company to an education entity
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
      "The leading AI-powered educational organization and online learning platform based in Kathmandu, Nepal. Explore expert-led professional courses, live classes, and e-learning certifications.",
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
    // CRITICAL: Tells Google bots "This domain owns these channels". 
    // It creates an entity cluster separating you from the restaurant's social pages.
    sameAs: [
      "https://facebook.com/profile.php?id=61583347305419",
      "https://instagram.com/octavenepal",
      "https://linkedin.com/company/octavenepal",
      "https://x.com/octave_nepal",
      "https://youtube.com/@octavenepal",
    ],
    // ADDED: Explicitly states what sector you operate within to semantic crawlers
    knowsAbout: [
        "Artificial Intelligence",
        "E-learning",
        "Online Education",
        "Software Development",
        "Professional Training",
        "Live Class",
        "Online Class",
        "Professional Courses"
    ]
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
      `Learn high-demand skills with the best online courses in Nepal. ${SITE_NAME} provides interactive live classes, expert-led professional training, and cohort-based e-learning across Nepal.`,
    publisher: {
      "@id": `${SITE_URL}/#organization`, // Inherits the "EducationalOrganization" type automatically
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
      "@type": "EducationalOrganization",
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
        "@type": "EducationalOrganization",
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
    name: `Online Courses in Nepal - ${SITE_NAME} Catalog`,
    description: `Explore the best online courses in Nepal at ${SITE_NAME}. Browse our AI-powered educational catalog featuring live classes, professional training, and cohort-based certifications.`,
    url: `${SITE_URL}/courses`,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    mainEntity: {
      "@type": "ItemList",
      name: `${SITE_NAME} Professional Course Catalog`,
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
            "@type": "EducationalOrganization",
            "@id": `${SITE_URL}/#organization`,
            name: SITE_NAME,
          },
          ...(course.price !== undefined && {
            offers: {
              "@type": "Offer",
              price: course.price,
              priceCurrency: "NPR",
              url: `${SITE_URL}/courses/${course.slug}`,
              availability: "https://schema.org",
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
