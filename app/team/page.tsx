import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constant";
import TeamContent from "./TeamContent";

export const metadata: Metadata = {
  title: `Our Team - ${SITE_NAME}`,
  description: `Meet the team behind ${SITE_NAME}: experts, mentors, and community builders shaping the future of learning.`,
};

export default function TeamPage() {
  return <TeamContent />;
}


