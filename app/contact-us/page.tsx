import ContactContent from "./ContactContent";
import { SITE_NAME } from "@/lib/constant";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - " + SITE_NAME,
  description: "Contact us for any questions or feedback about " + SITE_NAME + ".",
};

export default function ContactPage() {
  return <ContactContent />;
}


