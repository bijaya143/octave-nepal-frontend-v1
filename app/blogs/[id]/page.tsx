"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { guestBlogPostService } from "@/lib/services/guest";
import Badge from "@/components/ui/Badge";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Container from "@/components/Container";
import { SearchX, ArrowLeft } from "lucide-react";
import ShareButtons from "@/components/ui/ShareButtons";

interface MappedPost {
  id: string;
  slug: string;
  title: string;
  author: string;
  authorAvatar?: string;
  date: string;
  readingTime: string;
  tags: string[];
  thumbnail?: string;
  content: string;
  excerpt: string;
}

function BlogDetailSkeleton() {
  return (
    <Container className="py-5 md:py-10 animate-pulse">
      <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        <section className="space-y-6">
          <div className="h-10 w-3/4 bg-neutral-200 rounded-lg" />
          <div className="flex items-center justify-between">
            <div className="h-6 w-32 bg-neutral-100 rounded-lg" />
            <div className="h-6 w-32 bg-neutral-100 rounded-lg" />
          </div>
          <div className="h-64 md:h-80 lg:h-96 w-full bg-neutral-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-4 bg-neutral-100 rounded w-full" />
            <div className="h-4 bg-neutral-100 rounded w-full" />
            <div className="h-4 bg-neutral-100 rounded w-2/3" />
          </div>
        </section>
        <aside className="hidden lg:block">
          <div className="h-[400px] w-full bg-neutral-50 border border-neutral-100 rounded-2xl" />
        </aside>
      </div>
    </Container>
  );
}

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.id as string;

  const [blog, setBlog] = useState<MappedPost | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!slug) return;

    try {
      setIsLoading(true);
      const resp = await guestBlogPostService.getBySlug(slug);

      if (!resp.success || !resp.data) {
        setError("Blog post not found");
        return;
      }

      const b = resp.data;
      const mappedBlog: MappedPost = {
        id: b.id,
        slug: b.slug,
        title: b.title,
        author: b.author || "Admin",
        authorAvatar: b.authorImageKey
          ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${b.authorImageKey}`
          : "/images/logo/octave-nepal-only-logo-dark.png",
        date: new Date(b.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        readingTime: b.estimatedReadTime
          ? `${b.estimatedReadTime} min read`
          : "5 min read",
        tags: b.tags || [],
        thumbnail: b.imageKey
          ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${b.imageKey}`
          : undefined,
        content: b.content || "",
        excerpt: b.excerpt || "",
      };
      setBlog(mappedBlog);

      // Fetch related posts
      const relatedResp = await guestBlogPostService.list({
        limit: 4,
        page: 1,
        isPublished: true,
        ...(b.blogCategory?.id ? { blogCategoryId: b.blogCategory.id } : {}),
      });

      if (relatedResp.success && relatedResp.data) {
        const mappedRelated = relatedResp.data.data
          .filter((item) => item.id !== b.id)
          .slice(0, 3)
          .map((item) => ({
            id: item.id,
            slug: item.slug,
            title: item.title,
            date: new Date(item.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            readingTime: item.estimatedReadTime
              ? `${item.estimatedReadTime} min read`
              : "5 min read",
            thumbnail: item.imageKey
              ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${item.imageKey}`
              : undefined,
          }));
        setRelatedBlogs(mappedRelated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return <BlogDetailSkeleton />;
  }

  if (error || !blog) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="h-20 w-20 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-6 shadow-sm">
          <SearchX size={32} className="text-neutral-400" />
        </div>
        <h2
          className="text-xl md:text-2xl font-semibold mb-2"
          style={{ fontFamily: "var(--font-heading-sans)" }}
        >
          Blog post not found
        </h2>
        <p className="text-sm text-neutral-600 max-w-sm mb-8 leading-relaxed">
          The article you are looking for does not exist or has been removed.
        </p>
        <Link href="/blogs">
          <Button
            variant="secondary"
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back to blogs
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main>
      <Container className="py-5 md:py-10">
        <div className="grid lg:grid-cols-[1fr_360px] gap-6 md:gap-8 items-start">
          {/* Main Content */}
          <section>
            <h1
              className="text-2xl md:text-3xl lg:text-4xl font-semibold"
              style={{ fontFamily: "var(--font-heading-sans)" }}
            >
              {blog.title}
            </h1>
            <div className="mt-3 flex items-center justify-between text-[13px] text-neutral-600">
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
                <Card className="p-0 overflow-hidden border-neutral-200 shadow-sm">
                  <div className="relative h-64 md:h-80 lg:h-96">
                    <Image
                      src={blog.thumbnail}
                      alt={`${blog.title} thumbnail`}
                      fill
                      sizes="(min-width: 1024px) 66vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </Card>
              </div>
            )}

            {/* Article content */}
            <article
              className="prose prose-sm md:prose-base lg:prose-lg max-w-none mt-8"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Share section */}
            {(() => {
              const baseUrl =
                typeof window !== "undefined"
                  ? window.location.origin
                  : process.env.NEXT_PUBLIC_SITE_URL || "";
              const shareUrl = `${baseUrl}/blogs/${blog.slug}`;

              return (
                <section className="mt-10 border-t border-[color:var(--color-neutral-200)] pt-6">
                  <h3
                    className="text-sm font-medium"
                    style={{ fontFamily: "var(--font-heading-sans)" }}
                  >
                    Share this article
                  </h3>
                  <div className="mt-3">
                    <ShareButtons url={shareUrl} title={blog.title} />
                  </div>
                </section>
              );
            })()}
          </section>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 space-y-10">
            {relatedBlogs.length > 0 && (
              <div>
                <h3
                  className="text-lg font-bold mb-5 flex items-center gap-2"
                  style={{ fontFamily: "var(--font-heading-sans)" }}
                >
                  <span className="w-1.5 h-6 bg-[color:var(--color-primary-600)] rounded-full" />
                  Related posts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                  {relatedBlogs.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/blogs/${rel.slug}`}
                      className="group"
                    >
                      <Card className="relative p-0 overflow-hidden border border-black/5 bg-white transition-shadow hover:shadow-md">
                        <div className="relative h-36">
                          <Image
                            src={rel.thumbnail || "/images/thumb-1.svg"}
                            alt={`${rel.title} thumbnail`}
                            fill
                            sizes="(max-width: 1024px) 50vw, 360px"
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="py-3">
                          <div className="text-[11px] text-neutral-600 flex items-center gap-2">
                            <span>{rel.date}</span>
                            <span>·</span>
                            <span>{rel.readingTime}</span>
                          </div>
                          <div className="mt-1.5 text-sm font-medium leading-snug line-clamp-2 group-hover:text-[color:var(--color-primary-700)] transition-colors">
                            {rel.title}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </Container>
    </main>
  );
}
