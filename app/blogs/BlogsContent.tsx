"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Card, { CardContent } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { guestBlogPostService } from "../../lib/services/guest";
import Input from "../../components/ui/Input";
import { BookOpen, Share2, SearchX, Inbox, RotateCcw } from "lucide-react";
import ShareButtons from "@/components/ui/ShareButtons";
import Container from "@/components/Container";
import Modal from "../../components/ui/Modal";

interface MappedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  thumbnail?: string;
  author: string;
  authorAvatar?: string;
  date: string;
  readingTime: string;
}

export default function BlogsContent() {
  const [blogs, setBlogs] = React.useState<MappedPost[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [activeTag, setActiveTag] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const pageSize = 10;
  const [pagination, setPagination] = React.useState<{
    page: number;
    limit: number;
    total: number;
  } | null>(null);
  const [shareData, setShareData] = React.useState<{
    id: string;
    title: string;
    excerpt?: string;
    thumbnail?: string;
    author?: string;
    date?: string;
  } | null>(null);

  const allTags = React.useMemo(
    () => Array.from(new Set(blogs.flatMap((b) => b.tags || []))),
    [blogs],
  );

  React.useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const response = await guestBlogPostService.list({
          isPublished: true,
          limit: pageSize,
          page: page,
          keyword: query || undefined,
        });
        if (response.success && response.data) {
          const mapped = response.data.data.map((b) => {
            return {
              id: b.id,
              title: b.title,
              slug: b.slug,
              excerpt: b.excerpt || "",
              tags: b.tags || [],
              thumbnail: b.imageKey
                ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${b.imageKey}`
                : undefined,
              author: b.author || "Admin",
              authorAvatar: b.authorImageKey
                ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${b.authorImageKey}`
                : undefined,
              date: new Date(b.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              readingTime: b.estimatedReadTime
                ? `${b.estimatedReadTime} min read`
                : "5 min read",
            };
          });
          setBlogs(mapped);
          if (response.data.meta) {
            setPagination(response.data.meta);
          }
        }
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, [page, query]);

  const total = pagination?.total || 0;
  const pageCount = pagination
    ? Math.max(1, Math.ceil(total / pagination.limit))
    : 1;

  const isFilterApplied = !!query || !!activeTag;

  const filtered = blogs.filter((b) => {
    const matchesTag = !activeTag || (b.tags || []).includes(activeTag);
    return matchesTag;
  });

  const featured = page === 1 ? filtered[0] : null;
  const rest = featured ? filtered.slice(1) : filtered;

  const handleResetFilters = () => {
    setQuery("");
    setActiveTag(null);
    setPage(1);
  };

  return (
    <main>
      {/* Hero header */}
      <section className="py-5 md:py-10">
        <Container>
          <div className="relative overflow-hidden rounded-2xl border border-[color:var(--color-neutral-200)] bg-white p-6 md:p-8 shadow-sm">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_60%)]" />
            <div className="relative">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h1
                    className="text-2xl md:text-3xl font-semibold"
                    style={{ fontFamily: "var(--font-heading-sans)" }}
                  >
                    Insights & stories
                  </h1>
                  <p className="mt-1 text-sm text-[color:var(--color-neutral-600)]">
                    Learn with articles from our team and community
                  </p>
                </div>
              </div>
              <div className="mt-5 grid md:grid-cols-[1fr_auto] gap-3 items-center">
                <Input
                  placeholder="Search articles"
                  value={query}
                  className="md:max-w-md"
                  onChange={(e) => {
                    setQuery(e.currentTarget.value);
                    setPage(1);
                  }}
                />
                {allTags.length > 0 && (
                  <div className="hidden md:flex items-center gap-2">
                    <span className="text-xs text-[color:var(--color-neutral-600)]">
                      Popular tags:
                    </span>
                    {allTags.slice(0, 5).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() =>
                          setActiveTag((prev) => (prev === t ? null : t))
                        }
                        className={`h-8 rounded-full px-3 text-xs border transition ${activeTag === t ? "bg-[color:var(--color-primary-100)] border-[color:var(--color-primary-200)] text-[color:var(--color-primary-800)]" : "bg-white border-[color:var(--color-neutral-200)] text-[color:var(--color-primary-700)] hover:bg-[color:var(--color-neutral-50)]"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured post */}
      {page === 1 && (
        <section>
          <Container>
            {isLoading ? (
              <Card className="relative overflow-hidden p-0 animate-pulse shadow-sm border-0">
                <div className="relative h-56 md:h-72 lg:h-80 bg-[color:var(--color-neutral-200)]" />
              </Card>
            ) : featured ? (
              <Link href={`/blogs/${featured.slug}`} className="group block">
                <Card className="relative overflow-hidden p-0">
                  <div className="relative h-56 md:h-72 lg:h-80">
                    <Image
                      src={featured.thumbnail || "/images/thumb-1.svg"}
                      alt={`${featured.title} thumbnail`}
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute left-4 right-4 bottom-4 text-white">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {(featured.tags || []).slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center rounded-full bg-white/10 text-white px-2.5 py-1 text-[11px] font-medium backdrop-blur-md border border-white/20 transition-colors hover:bg-white/20"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <h2
                        className="text-xl md:text-2xl lg:text-3xl font-semibold leading-snug"
                        style={{ fontFamily: "var(--font-heading-sans)" }}
                      >
                        {featured.title}
                      </h2>
                      <p className="hidden sm:block text-sm text-white/90 mt-1 line-clamp-2">
                        {featured.excerpt}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-[11px] text-white/90">
                        <span>{featured.author}</span>
                        <span>·</span>
                        <span>{featured.date}</span>
                        <span>·</span>
                        <span>{featured.readingTime}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ) : null}
          </Container>
        </section>
      )}

      {/* Grid */}
      <section className="mt-8">
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Card
                    key={i}
                    className="relative p-0 overflow-hidden animate-pulse shadow-sm"
                  >
                    <div className="relative h-44 md:h-52 lg:h-56 bg-[color:var(--color-neutral-200)]" />
                    <CardContent className="py-4">
                      <div className="h-4 w-11/12 rounded bg-[color:var(--color-neutral-200)] mb-3" />
                      <div className="h-3 w-full rounded bg-[color:var(--color-neutral-100)] mb-1" />
                      <div className="h-3 w-2/3 rounded bg-[color:var(--color-neutral-100)] mb-4" />
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-1/4 rounded bg-[color:var(--color-neutral-200)]" />
                        <div className="h-3 w-1/4 rounded bg-[color:var(--color-neutral-200)]" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              : rest.map((post) => (
                  <Card
                    key={post.id}
                    className="relative p-0 overflow-hidden transition-shadow hover:shadow-md"
                  >
                    <div className="relative h-44 md:h-52 lg:h-56">
                      <Image
                        src={post.thumbnail || "/images/thumb-1.svg"}
                        alt={`${post.title} thumbnail`}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                        className="object-cover"
                      />
                      {!!post.tags?.length && (
                        <div className="absolute left-3 top-3 flex gap-1.5 flex-wrap">
                          {post.tags.slice(0, 2).map((t) => (
                            <Badge key={t}>{t}</Badge>
                          ))}
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    <CardContent className="py-4">
                      <Link href={`/blogs/${post.slug}`} className="group">
                        <h3
                          className="text-base font-semibold group-hover:text-[color:var(--color-primary-700)] transition-colors"
                          style={{ fontFamily: "var(--font-heading-sans)" }}
                        >
                          {post.title}
                        </h3>
                      </Link>
                      <p className="mt-1 text-sm text-[color:var(--color-neutral-600)] line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="mt-3 flex items-center justify-between text-[11px] text-[color:var(--color-neutral-600)]">
                        <div className="inline-flex items-center gap-2">
                          {post.authorAvatar && (
                            <Image
                              src={post.authorAvatar}
                              alt={`${post.author} avatar`}
                              width={18}
                              height={18}
                              className="h-[18px] w-[18px] rounded-full object-cover"
                            />
                          )}
                          <span>{post.author}</span>
                        </div>
                        <div className="inline-flex items-center gap-2 whitespace-nowrap">
                          <span>{post.date}</span>
                          <span>·</span>
                          <span>{post.readingTime}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-end gap-2">
                        <Link href={`/blogs/${post.slug}`}>
                          <Button
                            size="sm"
                            aria-label="Read article"
                            className="inline-flex items-center gap-2"
                          >
                            <BookOpen className="h-4 w-4" aria-hidden />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="hidden sm:inline inline-flex items-center gap-2"
                          aria-label="Share article"
                          onClick={() =>
                            setShareData({
                              id: post.slug,
                              title: post.title,
                              excerpt: post.excerpt,
                              thumbnail: post.thumbnail,
                              author: post.author,
                              date: post.date,
                            })
                          }
                        >
                          <Share2 className="h-4 w-4" aria-hidden />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
          {!isLoading && rest.length === 0 && (
            <div className="col-span-full py-8 md:py-16 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="h-20 w-20 rounded-full bg-[color:var(--color-neutral-50)] border border-[color:var(--color-neutral-100)] flex items-center justify-center mb-6 shadow-sm">
                {isFilterApplied ? (
                  <SearchX
                    size={32}
                    className="text-[color:var(--color-neutral-400)]"
                  />
                ) : (
                  <Inbox
                    size={32}
                    className="text-[color:var(--color-neutral-400)]"
                  />
                )}
              </div>
              <h3
                className="text-xl font-semibold text-[color:var(--color-neutral-900)] mb-2"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                {isFilterApplied
                  ? "No articles found"
                  : "No articles available"}
              </h3>
              <p className="text-sm text-[color:var(--color-neutral-600)] max-w-sm mb-8 leading-relaxed">
                {isFilterApplied
                  ? "We couldn't find any articles matching your search or tags. Try adjusting your filters or search keywords."
                  : "We're currently preparing new insights and stories. Please check back soon!"}
              </p>
              {isFilterApplied && (
                <Button
                  variant="secondary"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear all filters
                </Button>
              )}
            </div>
          )}

          {total > pageSize && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[color:var(--color-neutral-200)] pt-6">
              <p className="text-sm text-[color:var(--color-neutral-500)] text-center sm:text-left">
                Showing{" "}
                <span className="font-medium text-[color:var(--color-neutral-900)]">
                  {total === 0 ? 0 : (page - 1) * pageSize + 1}-
                  {Math.min(page * pageSize, total)}
                </span>{" "}
                of {total} articles
              </p>
              <div className="flex items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 px-3"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1 || isLoading}
                >
                  Previous
                </Button>
                <div className="text-sm font-medium text-[color:var(--color-neutral-600)] px-1 whitespace-nowrap">
                  {page} of {pageCount}
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 px-3"
                  onClick={() => setPage(page + 1)}
                  disabled={page === pageCount || isLoading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Container>
      </section>

      {shareData && (
        <Modal
          open={true}
          onClose={() => setShareData(null)}
          title="Share this article"
        >
          {(() => {
            const baseUrl =
              typeof window !== "undefined"
                ? window.location.origin
                : process.env.NEXT_PUBLIC_SITE_URL || "";
            const shareUrl = `${baseUrl}/blogs/${shareData.id}`;

            return (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {shareData.thumbnail && (
                    <div className="relative h-32 sm:h-24 sm:w-32 flex-shrink-0 rounded-lg overflow-hidden border border-[color:var(--color-neutral-200)]">
                      <Image
                        src={shareData.thumbnail}
                        alt={shareData.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 128px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-base font-semibold text-[color:var(--foreground)] line-clamp-2"
                      style={{ fontFamily: "var(--font-heading-sans)" }}
                    >
                      {shareData.title}
                    </h3>
                    {shareData.excerpt && (
                      <p className="mt-1 text-sm text-[color:var(--color-neutral-600)] line-clamp-2">
                        {shareData.excerpt}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-2 text-xs text-[color:var(--color-neutral-500)]">
                      {shareData.author && <span>{shareData.author}</span>}
                      {shareData.author && shareData.date && <span>·</span>}
                      {shareData.date && <span>{shareData.date}</span>}
                    </div>
                  </div>
                </div>
                <div className="border-t border-[color:var(--color-neutral-200)] pt-4">
                  <p className="text-sm text-[color:var(--color-neutral-600)]">
                    Choose a platform to share:
                  </p>
                  <div className="mt-3">
                    <ShareButtons url={shareUrl} title={shareData.title} />
                  </div>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}
    </main>
  );
}
