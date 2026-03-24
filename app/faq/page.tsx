import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constant";
import FaqContent from "./FaqContent";

export const metadata: Metadata = {
  title: `FAQ - ${SITE_NAME}`,
  description: `Frequently asked questions about ${SITE_NAME}, courses, pricing, certificates, and more.`,
};

export default function FaqPage() {
  return <FaqContent />;
}


