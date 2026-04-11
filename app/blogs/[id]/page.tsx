import React from "react";
import Image from "next/image";
import Link from "next/link";
import { blogs, getBlogById } from "../../../lib/blogs";
import Badge from "../../../components/ui/Badge";
import Card, { CardContent } from "../../../components/ui/Card";
import { SITE_NAME } from "@/lib/constant";
import type { Metadata } from "next";
import Container from "@/components/Container";

type PageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return blogs.map((b) => ({ id: b.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const blog = getBlogById(id);
  return {
    title: blog?.title + " - " + SITE_NAME,
    description: "Read more about " + blog?.title + " at " + SITE_NAME + ".",
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { id } = await params;
  const blog = getBlogById(id);
  if (!blog) {
    return (
      <main>
        <section className="py-16">
          <Container className="max-w-3xl">
            <h1
              className="text-xl md:text-2xl font-semibold"
              style={{ fontFamily: "var(--font-heading-sans)" }}
            >
              Blog not found
            </h1>
            <p className="mt-2 text-sm text-[color:var(--color-neutral-600)]">
              The article you are looking for does not exist.
            </p>
            <div className="mt-6">
              <Link
                href="/blogs"
                className="text-[color:var(--color-primary-700)] hover:underline underline-offset-2 text-sm"
              >
                Go back to blogs
              </Link>
            </div>
          </Container>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="py-5 md:py-10">
        <Container className="max-w-3xl">
          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-semibold"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            {blog.title}
          </h1>
          <div className="mt-3 flex items-center justify-between text-[13px] text-[color:var(--color-neutral-600)]">
            <div className="inline-flex items-center gap-2">
              {blog.authorAvatar && (
                <Image
                  src={blog.authorAvatar}
                  alt={`${blog.author} avatar`}
                  width={24}
                  height={24}
                  className="h-6 w-6 rounded-full object-cover"
                />
              )}
              <span>{blog.author}</span>
            </div>
            <div className="inline-flex items-center gap-2 whitespace-nowrap">
              <span>{blog.date}</span>
              <span>·</span>
              <span>{blog.readingTime}</span>
            </div>
          </div>

          <div className="mt-4 flex gap-2 flex-wrap">
            {blog.tags?.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>

          {blog.thumbnail && (
            <div className="mt-6">
              <Card className="p-0 overflow-hidden">
                <div className="relative h-64 md:h-80 lg:h-96">
                  <Image
                    src={blog.thumbnail}
                    alt={`${blog.title} thumbnail`}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
                <CardContent className="py-4">
                  <p className="text-xs text-[color:var(--color-neutral-600)]">
                    Cover image
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Article content */}
          <article className="prose prose-sm md:prose-base lg:prose-lg max-w-none mt-8">
            <p>
              This is a demo blog detail page. Replace this with your CMS
              content or markdown rendering. The goal here is to provide a
              styled template with consistent components and spacing.
            </p>
            <p>
              You can structure paragraphs, headings, lists, quotes, and images.
              Extend this page to fetch content from your backend in the future.
            </p>
            <h2>Key takeaways</h2>
            <ul>
              <li>Consistent UI components make content feel cohesive.</li>
              <li>Readable line length and spacing improve comprehension.</li>
              <li>Clear metadata helps users decide what to read.</li>
            </ul>
            <blockquote>
              Great design is invisible. Focus on clarity and the reader’s
              journey.
            </blockquote>
          </article>

          {/* Share section */}
          {(() => {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
            const shareUrl = `${baseUrl}/blogs/${blog.id}`;
            const encodedUrl = encodeURIComponent(shareUrl);
            const encodedTitle = encodeURIComponent(blog.title);
            const twitter = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
            const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            const linkedin = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`;
            const whatsapp = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
            const messenger = `fb-messenger://share/?link=${encodedUrl}`;
            return (
              <section className="mt-10 border-t border-[color:var(--color-neutral-200)] pt-6">
                <h3
                  className="text-sm font-medium"
                  style={{ fontFamily: "var(--font-heading-sans)" }}
                >
                  Share this article
                </h3>
                <div className="mt-3 flex items-center gap-3">
                  <a
                    href={twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on X (Twitter)"
                    className="h-10 w-10 rounded-full inline-flex items-center justify-center border border-[color:var(--color-neutral-200)] bg-white shadow-xs hover:bg-[color:var(--color-neutral-50)]"
                  >
                    <Image
                      src="/images/social-medias/twitter.png"
                      alt=""
                      width={20}
                      height={20}
                      sizes="20px"
                      className="object-contain"
                      aria-hidden
                    />
                  </a>
                  <a
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Facebook"
                    className="h-10 w-10 rounded-full inline-flex items-center justify-center border border-[color:var(--color-neutral-200)] bg-white shadow-xs hover:bg-[color:var(--color-neutral-50)]"
                  >
                    <Image
                      src="/images/social-medias/facebook.png"
                      alt=""
                      width={20}
                      height={20}
                      sizes="20px"
                      className="object-contain"
                      aria-hidden
                    />
                  </a>
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on LinkedIn"
                    className="h-10 w-10 rounded-full inline-flex items-center justify-center border border-[color:var(--color-neutral-200)] bg-white shadow-xs hover:bg-[color:var(--color-neutral-50)]"
                  >
                    <Image
                      src="/images/social-medias/linkedin.png"
                      alt=""
                      width={20}
                      height={20}
                      sizes="20px"
                      className="object-contain"
                      aria-hidden
                    />
                  </a>
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on WhatsApp"
                    className="h-10 w-10 rounded-full inline-flex items-center justify-center border border-[color:var(--color-neutral-200)] bg-white shadow-xs hover:bg-[color:var(--color-neutral-50)]"
                  >
                    <Image
                      src="/images/social-medias/whatsapp.png"
                      alt=""
                      width={20}
                      height={20}
                      sizes="20px"
                      className="object-contain"
                      aria-hidden
                    />
                  </a>
                  <a
                    href={messenger}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Messenger"
                    className="h-10 w-10 rounded-full inline-flex items-center justify-center border border-[color:var(--color-neutral-200)] bg-white shadow-xs hover:bg-[color:var(--color-neutral-50)]"
                  >
                    <Image
                      src="/images/social-medias/messenger.png"
                      alt=""
                      width={20}
                      height={20}
                      sizes="20px"
                      className="object-contain"
                      aria-hidden
                    />
                  </a>
                </div>
              </section>
            );
          })()}

          <div className="mt-12">
            <h3
              className="text-lg font-semibold mb-4"
              style={{ fontFamily: "var(--font-heading-sans)" }}
            >
              Related posts
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {blogs
                .filter((b) => b.id !== blog.id)
                .slice(0, 3)
                .map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/blogs/${rel.id}`}
                    className="group"
                  >
                    <Card className="relative p-0 overflow-hidden border border-black/5 bg-white transition-shadow hover:shadow-md">
                      <div className="relative h-36">
                        <Image
                          src={rel.thumbnail || "/images/thumb-1.svg"}
                          alt={`${rel.title} thumbnail`}
                          fill
                          sizes="(max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="py-3">
                        <div className="text-[11px] text-[color:var(--color-neutral-600)] flex items-center gap-2">
                          <span>{rel.date}</span>
                          <span>·</span>
                          <span>{rel.readingTime}</span>
                        </div>
                        <div className="mt-1.5 text-sm font-medium leading-snug line-clamp-2">
                          {rel.title}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
