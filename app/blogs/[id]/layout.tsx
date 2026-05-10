import { Metadata } from "next";
import { SITE_NAME } from "@/lib/constant";
import { guestBlogPostService } from "@/lib/services/guest";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: slug } = await params;

  try {
    const resp = await guestBlogPostService.getBySlug(slug);

    if (!resp.success || !resp.data) {
      return {
        title: "Blog Not Found - " + SITE_NAME,
      };
    }

    const blog = resp.data;
    return {
      title: (blog.metaTitle || blog.title) + " - " + SITE_NAME,
      description:
        blog.metaDescription ||
        blog.excerpt ||
        `Read more about ${blog.title} at ${SITE_NAME}.`,
    };
  } catch (error) {
    return {
      title: "Blog Not Found - " + SITE_NAME,
    };
  }
}

export default function BlogDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
