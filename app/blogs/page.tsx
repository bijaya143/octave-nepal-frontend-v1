import BlogsContent from "./BlogsContent";
import { SITE_NAME } from "@/lib/constant";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://octavenepal.com";

export const metadata: Metadata = {
  title: "Latest Tech Blogs, Guides & IT Career Insights in Nepal",
  description: `Read the latest tech blogs, IT learning tutorials, software engineering guides, and career insights from ${SITE_NAME}. Stay updated on modern education and tech trends in Nepal.`,
  keywords: [
    "tech blogs nepal",
    "IT learning blogs kathmandu",
    "online training insights nepal",
    "software development articles nepal",
    "e-learning guides nepal",
    "coding blogs nepal",
    "digital marketing tips nepal",
    "tech career advice nepal",
    "octave nepal blogs",
    "educational resources nepal",
    "programming tutorials kathmandu",
  ],
  alternates: {
    canonical: `${SITE_URL}/blogs`,
  },
  openGraph: {
    title: `Latest Tech Blogs, Guides & IT Career Insights in Nepal | ${SITE_NAME}`,
    description: `Read the latest tech blogs, IT learning tutorials, software engineering guides, and career insights from ${SITE_NAME}. Stay updated on modern education and tech trends in Nepal.`,
    url: `${SITE_URL}/blogs`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Latest Tech Blogs, Guides & IT Career Insights in Nepal | ${SITE_NAME}`,
    description: `Read the latest tech blogs, IT learning tutorials, software engineering guides, and career insights from ${SITE_NAME}. Stay updated on modern education and tech trends in Nepal.`,
  },
};

export default function BlogsPage() {
  return <BlogsContent />;
}


