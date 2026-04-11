"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Card, { CardContent } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { blogs } from "../../lib/blogs";
import Input from "../../components/ui/Input";
import { BookOpen, Share2 } from "lucide-react";
import Container from "@/components/Container";
import Modal from "../../components/ui/Modal";

export default function BlogsContent() {
  const [query, setQuery] = React.useState("");
  const allTags = Array.from(new Set(blogs.flatMap((b) => b.tags || [])));
  const [activeTag, setActiveTag] = React.useState<string | null>(null);
  const [shareData, setShareData] = React.useState<{
    id: string;
    title: string;
  } | null>(null);

  const filtered = blogs.filter((b) => {
    const matchesQuery =
      !query ||
      b.title.toLowerCase().includes(query.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(query.toLowerCase());
    const matchesTag = !activeTag || (b.tags || []).includes(activeTag);
    return matchesQuery && matchesTag;
  });

  const featured = filtered[0] || blogs[0];
  const rest = filtered.filter((b) => b.id !== featured.id);

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
                  onChange={(e) => setQuery(e.currentTarget.value)}
                />
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
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured post */}
      <section className="mt-8">
        <Container>
          <Link href={`/blogs/${featured.id}`} className="group block">
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
                        className="inline-flex items-center rounded-full bg-white/90 text-[color:var(--color-primary-800)] px-2.5 py-1 text-xs font-medium backdrop-blur border border-white/60"
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
        </Container>
      </section>

      {/* Grid */}
      <section className="mt-8">
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {rest.map((post) => (
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
                  <Link href={`/blogs/${post.id}`} className="group">
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
                    <Link href={`/blogs/${post.id}`}>
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
                        setShareData({ id: post.id, title: post.title })
                      }
                    >
                      <Share2 className="h-4 w-4" aria-hidden />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {rest.length === 0 && (
            <p className="text-sm text-[color:var(--color-neutral-600)] mt-6">
              No articles match your search.
            </p>
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
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
            const shareUrl = `${baseUrl}/blogs/${shareData.id}`;
            const encodedUrl = encodeURIComponent(shareUrl);
            const encodedTitle = encodeURIComponent(shareData.title);
            const twitter = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
            const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            const linkedin = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`;
            const whatsapp = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
            const messenger = `fb-messenger://share/?link=${encodedUrl}`;
            return (
              <div>
                <p className="text-sm text-[color:var(--color-neutral-600)]">
                  Choose a platform to share:
                </p>
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
              </div>
            );
          })()}
        </Modal>
      )}
    </main>
  );
}
