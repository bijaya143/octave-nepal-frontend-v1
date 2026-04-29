"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "../../components/Container";
import Card from "../../components/ui/Card";
import { guestCategoryService } from "@/lib/services/guest";
import { Category } from "@/lib/services/admin";

// ─── skeleton ───────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <Card className="relative p-0 overflow-hidden animate-pulse">
      <div className="relative h-28 bg-[color:var(--color-neutral-200)]">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 text-center">
          <div className="h-12 w-12 rounded-full bg-[color:var(--color-neutral-300)]" />
          <div className="h-4 w-3/4 rounded bg-[color:var(--color-neutral-300)]" />
        </div>
      </div>
    </Card>
  );
}

// ─── component ──────────────────────────────────────────────────────────────

export default function FeaturedCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    guestCategoryService
      .list({
        isPublished: true,
        page: 1,
        limit: 6,
      })
      .then((res) => {
        if (res.success && res.data?.data) {
          setCategories(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch featured categories:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!loading && categories.length === 0) {
    return null;
  }

  return (
    <section id="categories" className="mt-12 md:mt-16">
      <Container>
        <h2
          className="text-xl md:text-2xl font-semibold mb-4"
          style={{ fontFamily: "var(--font-heading-sans)" }}
        >
          Popular Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : categories.map((cat) => (
                <Link href={`/courses?category=${cat.slug}`} key={cat.id}>
                  <Card className="relative overflow-hidden p-0 group">
                    <div className="relative h-28">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${cat.imageKey}`}
                        alt={`${cat.name} background`}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, (max-width: 1280px) 16vw, 12vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 text-center">
                        <div className="h-12 w-12 rounded-full bg-white/90 backdrop-blur border border-white/60 shadow flex items-center justify-center">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${cat.iconKey}`}
                            alt={`${cat.name} icon`}
                            width={24}
                            height={24}
                            // unoptimized
                          />
                        </div>
                        <span className="text-sm font-medium text-white/95 px-2 py-0.5 rounded bg-black/35">
                          {cat.name}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
        </div>
      </Container>
    </section>
  );
}
