import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constant";
import FaqContent from "./FaqContent";
import { faqs } from "@/lib/faq-data";
import { buildFaqSchema, serializeSchema } from "@/lib/schema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://octavenepal.com";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) & Course Help",
  description: `Get answers to frequently asked questions about online courses, live interactive classes, payments, certificates, and learning on ${SITE_NAME}.`,
  keywords: [
    "octave nepal faq",
    "online course help nepal",
    "online class nepal",
    "e-learning support kathmandu",
    "how to learn online nepal",
    "online course payment methods nepal",
    "verified certificates online courses nepal",
    "esewa payment online classes",
    "khalti online course payment",
    "it training center kathmandu help",
  ],
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
  openGraph: {
    title: `Frequently Asked Questions (FAQ) & Course Help - ${SITE_NAME}`,
    description: `Get answers to frequently asked questions about online courses, live interactive classes, payments, certificates, and learning on ${SITE_NAME}.`,
    url: `${SITE_URL}/faq`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Frequently Asked Questions (FAQ) & Course Help - ${SITE_NAME}`,
    description: `Get answers to frequently asked questions about online courses, live interactive classes, payments, certificates, and learning on ${SITE_NAME}.`,
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
