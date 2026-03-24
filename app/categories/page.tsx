import CategoriesContent from "./CategoriesContent";
import { SITE_NAME } from "@/lib/constant";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories - " + SITE_NAME,
  description: "Browse our collection of categories for " + SITE_NAME + " students.",
};

export default function CategoriesPage() {
  return <CategoriesContent />;
}

