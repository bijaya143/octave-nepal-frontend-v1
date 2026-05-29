import ContactContent from "./ContactContent";
import { SITE_NAME } from "@/lib/constant";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://octavenepal.com";

export const metadata: Metadata = {
  title: "Contact Us & Course Inquiries",
  description: `Get in touch with ${SITE_NAME} for support, partnerships, or inquiries about our online courses and live classes in Nepal.`,
  keywords: [
    "contact octave nepal",
    "octave nepal support",
    "online courses nepal",
    "online class nepal",
    "career guidance nepal",
    "business courses nepal",
    "creative arts courses nepal",
    "professional development nepal",
    "course consultation kathmandu",
  ],
  alternates: {
    canonical: `${SITE_URL}/contact-us`,
  },
  openGraph: {
    title: `Contact Us & Course Inquiries - ${SITE_NAME}`,
    description: `Get in touch with ${SITE_NAME} for support, partnerships, or inquiries about our online courses and live classes in Nepal.`,
    url: `${SITE_URL}/contact-us`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Contact Us & Course Inquiries - ${SITE_NAME}`,
    description: `Get in touch with ${SITE_NAME} for support, partnerships, or inquiries about our online courses and live classes in Nepal.`,
  },
};

export default function ContactPage() {
  return <ContactContent />;
}


