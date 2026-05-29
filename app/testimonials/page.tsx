import TestimonialsContent from "./TestimonialsContent";
import { SITE_NAME } from "@/lib/constant";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://octavenepal.com";

export const metadata: Metadata = {
  title: "Student Reviews & Success Stories",
  description: `Read genuine reviews and success stories from students across Nepal who have taken courses on ${SITE_NAME}. Discover their feedback and learning experiences.`,
  keywords: [
    "online course nepal testimonials",
    "octave nepal reviews",
    "online class nepal",
    "best online learning nepal",
    "student reviews nepal",
    "ai learning platform nepal",
    "online classes nepal feedback",
    "learning experience nepal",
    "student success stories nepal",
  ],
  alternates: {
    canonical: `${SITE_URL}/testimonials`,
  },
  openGraph: {
    title: `Student Reviews & Success Stories - ${SITE_NAME}`,
    description: `Read genuine reviews and success stories from students across Nepal who have taken courses on ${SITE_NAME}.`,
    url: `${SITE_URL}/testimonials`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Student Reviews & Success Stories - ${SITE_NAME}`,
    description: `Discover success stories from learners who chose ${SITE_NAME} for their education in Nepal.`,
  },
};

export default function TestimonialsPage() {
  return <TestimonialsContent />;
}



