import TestimonialsContent from "./TestimonialsContent";
import { SITE_NAME } from "@/lib/constant";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonials - " + SITE_NAME,
  description: "Read what our students say about " + SITE_NAME + ".",
};

export default function TestimonialsPage() {
  return <TestimonialsContent />;
}



