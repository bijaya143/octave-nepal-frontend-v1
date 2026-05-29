import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constant";
import TeamContent from "./TeamContent";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://octavenepal.com";

export const metadata: Metadata = {
  title: "Meet the Team & Mentors",
  description: `Meet the passionate team of educators, technologists, and mentors at ${SITE_NAME} who are revolutionizing online education in Nepal. Learn about our story, our mission, and the people behind the platform.`,
  keywords: [
    "octave nepal team",
    "online class nepal",
    "online education nepal",
    "who is behind octave nepal",
    "learning platform nepal",
    "ai learning nepal",
    "online course nepal team",
    "founder of octave nepal",
    "education technology nepal",
    "team members octave nepal",
  ],
  alternates: {
    canonical: `${SITE_URL}/our-team`,
  },
  openGraph: {
    title: `Meet the Team & Mentors - ${SITE_NAME}`,
    description: `Meet the passionate team of educators, technologists, and mentors at ${SITE_NAME} who are revolutionizing online education in Nepal.`,
    url: `${SITE_URL}/our-team`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Meet the Team & Mentors - ${SITE_NAME}`,
    description: `Meet the passionate team behind ${SITE_NAME}, your trusted platform for online learning in Nepal.`,
  },
};


export default function TeamPage() {
  return <TeamContent />;
}


