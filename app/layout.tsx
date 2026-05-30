import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import AppContent from "@/components/AppContent";
import ToasterProvider from "@/providers/ToasterProvider";
import { SITE_NAME } from "@/lib/constant";
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
  serializeSchema,
} from "@/lib/schema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const headingSans = Plus_Jakarta_Sans({
  variable: "--font-heading-sans",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://octavenepal.com";
const SITE_DESCRIPTION =
  "The leading AI-powered educational organization and online learning platform based in Kathmandu, Nepal. Explore expert-led professional courses, live classes, and e-learning certifications.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - AI-Powered Online Learning Platform in Nepal`,
    template: `%s - ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Online Courses in Nepal",
    "Online Class Nepal",
    "E-learning Nepal",
    "AI Learning Platform",
    "Online Education Nepal",
    "Professional Courses Nepal",
    "Cohort Based Courses",
    "Octave Nepal",
    "Octave Nepal courses"
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "education",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - AI-Powered Online Learning Platform in Nepal`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/images/og/og-v1.png`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - AI-Powered Online Learning Platform`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - AI-Powered Online Learning Platform in Nepal`,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/images/og/og-v1.png`],
    creator: "@octavenepal",
    site: "@octavenepal",
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
        {/* Organization JSON-LD — brand signals for Google Knowledge Panel & Bing */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeSchema(buildOrganizationSchema()),
          }}
        />
        {/* WebSite JSON-LD — enables Google Sitelinks Search Box */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeSchema(buildWebSiteSchema()),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${headingSans.variable} antialiased`}
      >
        <AppContent>{children}</AppContent>
        <ToasterProvider />
      </body>
    </html>
  );
}
