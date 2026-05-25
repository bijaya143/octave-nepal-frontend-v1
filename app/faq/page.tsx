import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constant";
import FaqContent from "./FaqContent";
import { faqs } from "@/lib/faq-data";
import { buildFaqSchema, serializeSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: `FAQ - ${SITE_NAME}`,
  description: `Frequently asked questions about ${SITE_NAME}, courses, pricing, certificates, and more.`,
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_PROD_SITE_URL || "https://octavenepal.com"}/faq`,
  },
  openGraph: {
    title: `FAQ - ${SITE_NAME}`,
    description: `Frequently asked questions about ${SITE_NAME}, courses, pricing, certificates, and more.`,
    type: "website",
  },
};

export default function FaqPage() {
  const faqSchema = buildFaqSchema(faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(faqSchema) }}
      />
      <FaqContent />
    </>
  );
}
