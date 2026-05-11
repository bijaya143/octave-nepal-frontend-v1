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

    if (!resp.success) {
      console.error("Blog fetch failed:", resp);
      return {
        title: "Blog Not Found - " + SITE_NAME,
      };
    }

    const blog = resp.data;

    if (!blog) {
      console.error("Blog data is missing:", resp);
      return {
        title: "Blog Not Found - " + SITE_NAME,
      };
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://octavenepal.com";
    const blogUrl = `${baseUrl}/blogs/${slug}`;
    const imageUrl = blog.imageKey
      ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${blog.imageKey}`
      : undefined;

    const title = blog.metaTitle || blog.title;
    const description =
      blog.metaDescription ||
      blog.excerpt ||
      `Read more about ${blog.title} at ${SITE_NAME}.`;

    return {
      title: title + " - " + SITE_NAME,
      description,
      keywords: blog.metaKeywords,
      openGraph: {
        title,
        description,
        url: blogUrl,
        siteName: SITE_NAME,
        images: imageUrl
          ? [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: blog.title,
              },
            ]
          : undefined,
        locale: "en_US",
        type: "article",
        publishedTime: new Date(blog.createdAt).toISOString(),
        modifiedTime: new Date(blog.updatedAt).toISOString(),
        authors: blog.author ? [blog.author] : undefined,
        tags: blog.tags,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: imageUrl ? [imageUrl] : undefined,
        creator: "@octavenepal",
      },
      alternates: {
        canonical: blogUrl,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
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
