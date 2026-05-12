"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Card, { CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import {
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Tag,
  Star,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { adminBlogPostService } from "@/lib/services/admin/blog-post";
import { BlogPost } from "@/lib/services/admin/types";

function formatDate(dateString?: string | Date | null) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function statusBadgeClass(isPublished?: boolean): string {
  if (isPublished) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  return "bg-gray-50 text-gray-700 border-gray-200";
}

export default function BlogPostDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await adminBlogPostService.get(id);
        if (response.success) {
          setPost(response.data);
        } else {
          setError(
            response.error?.message || "Failed to fetch blog post details",
          );
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Blog Post Details</h1>
        </div>
        <Card>
          <CardContent className="py-0">
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-[color:var(--color-neutral-600)]">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading blog post...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Blog Post Details</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-8 text-[color:var(--color-neutral-500)]">
              <AlertCircle className="mb-2 h-8 w-8 text-red-500" />
              <p>{error || "Blog post not found"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">
              Blog Post Details
            </h1>
            <p className="text-sm text-[color:var(--color-neutral-600)] mt-1">
              ID: {id}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-4">
                  <div className="h-20 w-32 shrink-0 overflow-hidden rounded-md ring-1 ring-[color:var(--color-neutral-200)] shadow-sm bg-gray-100 flex items-center justify-center relative">
                    {post.imageKey ? (
                      <Image
                        src={
                          post.imageKey.startsWith("http")
                            ? post.imageKey
                            : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${post.imageKey}`
                        }
                        alt={post.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="text-xs text-gray-400">No Image</div>
                    )}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-[color:var(--color-neutral-900)]">
                      {post.title}
                    </div>
                    {post.excerpt && (
                      <div className="text-sm text-[color:var(--color-neutral-600)] mt-1 max-w-3xl">
                        {post.excerpt}
                      </div>
                    )}
                    <div className="mt-1.5 text-[12px] text-[color:var(--color-neutral-500)]">
                      Slug: /blog/{post.slug}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Badge
                    variant="outline"
                    className={statusBadgeClass(post.isPublished)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {post.isPublished ? (
                        <>
                          <CheckCircle2 size={14} /> Published
                        </>
                      ) : (
                        <>
                          <XCircle size={14} /> Draft
                        </>
                      )}
                    </span>
                  </Badge>
                  {post.isFeatured && (
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200"
                    >
                      <span className="inline-flex items-center gap-1">
                        <Star
                          size={12}
                          className="fill-amber-500 text-amber-500"
                        />{" "}
                        Featured
                      </span>
                    </Badge>
                  )}
                </div>
              </div>

              <div className="h-px bg-[color:var(--color-neutral-200)]" />

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-4 py-3">
                  <div className="text-xs text-[color:var(--color-neutral-500)]">
                    Category
                  </div>
                  <div className="mt-1 font-medium text-sm text-[color:var(--color-neutral-900)] flex items-center gap-2">
                    <Tag size={14} className="text-blue-500" />
                    {post.blogCategory?.name || "Uncategorized"}
                  </div>
                </div>
                <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-4 py-3">
                  <div className="text-xs text-[color:var(--color-neutral-500)]">
                    Read Time
                  </div>
                  <div className="mt-1 font-medium text-sm text-[color:var(--color-neutral-900)] flex items-center gap-2">
                    <Clock size={14} className="text-amber-500" />
                    {post.estimatedReadTime || 0} min
                  </div>
                </div>
                <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-4 py-3">
                  <div className="text-xs text-[color:var(--color-neutral-500)]">
                    Tags
                  </div>
                  <div className="mt-1 font-medium text-sm text-[color:var(--color-neutral-900)] truncate">
                    {post.tags && post.tags.length > 0
                      ? post.tags.join(", ")
                      : "None"}
                  </div>
                </div>
                <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-4 py-3">
                  <div className="text-xs text-[color:var(--color-neutral-500)]">
                    Author
                  </div>
                  <div className="mt-1 font-medium text-sm text-[color:var(--color-neutral-900)] flex items-center gap-2 truncate">
                    <User size={14} className="text-purple-500" />
                    {post.author || "Unknown"}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-medium text-[color:var(--color-neutral-900)] mb-4">
                  Content
                </h3>
                <div className="prose prose-sm max-w-none text-[color:var(--color-neutral-700)] bg-gray-50/50 p-4 rounded-lg border border-gray-100 overflow-hidden">
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-sm font-medium text-[color:var(--color-neutral-900)]">
                  Publishing Info
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-[color:var(--color-neutral-600)]">
                    <Calendar size={16} />
                    <div>
                      <div className="text-[color:var(--color-neutral-900)] font-medium">
                        {formatDate(post.createdAt)}
                      </div>
                      <div className="text-xs">Created At</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[color:var(--color-neutral-600)]">
                    <Clock size={16} />
                    <div>
                      <div className="text-[color:var(--color-neutral-900)] font-medium">
                        {formatDate(post.updatedAt)}
                      </div>
                      <div className="text-xs">Last Updated</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-sm font-medium text-[color:var(--color-neutral-900)]">
                  SEO Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-[color:var(--color-neutral-500)] mb-1">
                      Meta Title
                    </div>
                    <div className="text-sm text-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-50)] p-2.5 rounded border border-[color:var(--color-neutral-200)]">
                      {post.metaTitle || (
                        <span className="text-[color:var(--color-neutral-400)] italic">
                          No meta title provided.
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[color:var(--color-neutral-500)] mb-1">
                      Meta Description
                    </div>
                    <div className="text-sm text-[color:var(--color-neutral-700)] bg-[color:var(--color-neutral-50)] p-2.5 rounded border border-[color:var(--color-neutral-200)]">
                      {post.metaDescription || (
                        <span className="text-[color:var(--color-neutral-400)] italic">
                          No meta description provided.
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[color:var(--color-neutral-500)] mb-1">
                      Meta Keywords
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {post.metaKeywords && post.metaKeywords.length > 0 ? (
                        post.metaKeywords.map((keyword, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs font-normal bg-[color:var(--color-neutral-100)] text-[color:var(--color-neutral-700)] border-[color:var(--color-neutral-200)]"
                          >
                            {keyword}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-[color:var(--color-neutral-400)] italic">
                          None
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-sm font-medium text-[color:var(--color-neutral-900)]">
                  Author Info
                </h3>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center relative">
                    <Image
                      src={
                        post.authorImageKey
                          ? post.authorImageKey.startsWith("http")
                            ? post.authorImageKey
                            : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${post.authorImageKey}`
                          : `/images/logo/octave-nepal-only-logo-dark.png`
                      }
                      alt={post.author || "Author"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[color:var(--color-neutral-900)]">
                      {post.author || "Unknown"}
                    </div>
                    <div className="text-xs text-[color:var(--color-neutral-500)]">
                      Author
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
