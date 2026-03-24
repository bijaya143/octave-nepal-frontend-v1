import BlogsContent from "./BlogsContent";
import { SITE_NAME } from "@/lib/constant";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs - " + SITE_NAME,
  description: "Read our latest blogs and stay updated with the latest news and trends.",
};

export default function BlogsPage() {
  return <BlogsContent />;
}


