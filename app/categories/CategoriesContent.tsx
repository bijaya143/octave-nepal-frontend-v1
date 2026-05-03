"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Card, { CardContent } from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import {
  LayoutGrid,
  BookOpen,
  GraduationCap,
  Tag,
  TrendingUp,
  Users,
  SearchX,
} from "lucide-react";
import Container from "../../components/Container";
import { guestCategoryService } from "@/lib/services/guest";
import { Category } from "@/lib/services/admin/types";

function formatNumber(n: number) {
  return new Intl.NumberFormat().format(n);
}

function formatCompact(n: number) {
  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

function CategorySkeleton() {
  return (
    <Card className="relative overflow-hidden p-0 group border border-black/5 bg-white/95 backdrop-blur-sm flex flex-col h-full animate-pulse shadow-sm">
      <div className="relative aspect-[16/9] w-full bg-[color:var(--color-neutral-200)]">
        <div className="absolute top-3 right-3 h-6 w-20 rounded-lg bg-[color:var(--color-neutral-300)]" />
      </div>
      <CardContent className="py-4 flex-1 flex flex-col">
        <div className="flex items-start">
          <div className="h-5 w-1/2 rounded bg-[color:var(--color-neutral-200)]" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-1.5 md:gap-2 lg:gap-2">
          <div className="h-14 md:h-12 lg:h-20 rounded-lg md:rounded-lg lg:rounded-xl border border-black/5 bg-[color:var(--color-neutral-100)]" />
          <div className="h-14 md:h-12 lg:h-20 rounded-lg md:rounded-lg lg:rounded-xl border border-black/5 bg-[color:var(--color-neutral-100)]" />
          <div className="h-14 md:h-12 lg:h-20 rounded-lg md:rounded-lg lg:rounded-xl border border-black/5 bg-[color:var(--color-neutral-100)]" />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <div className="h-6 w-12 rounded bg-[color:var(--color-neutral-200)]" />
          <div className="h-6 w-16 rounded bg-[color:var(--color-neutral-200)]" />
        </div>
        <div className="mt-auto pt-4 flex">
          <div className="h-9 w-full rounded bg-[color:var(--color-neutral-200)]" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function CategoriesContent() {
  const [query, setQuery] = React.useState("");
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const res = await guestCategoryService.list({
          isPublished: true,
          limit: 100,
          page: 1,
        });
        if (res.success && res.data) {
          setCategories(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? categories.filter((c) =>
          [
            c.name.toLowerCase(),
            (c.description || "").toLowerCase(),
            ...(c.categoryToTags?.map((ct) => ct.tag.name.toLowerCase()) || []),
          ].some((v) => v.includes(q)),
        )
      : categories;
    return base;
  }, [categories, query]);

  const totals = React.useMemo(() => {
    const totalCourses = categories.reduce(
      (sum, c) => sum + (c.courseCount || 0),
      0,
    );
    const totalLearners = categories.reduce(
      (sum, c) => sum + (c.studentCount || 0),
      0,
    );
    return { totalCategories: categories.length, totalCourses, totalLearners };
  }, [categories]);

  return (
    <main>
      <Container className="py-5 md:py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1
              className="text-xl md:text-2xl font-semibold"
              style={{ fontFamily: "var(--font-heading-sans)" }}
            >
              Browse categories
            </h1>
            <p className="hidden sm:block text-sm text-[color:var(--color-neutral-600)]">
              Explore topics and find your next course
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-5">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="w-full sm:w-80">
              <Input
                placeholder="Search categories…"
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setQuery(e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* Stats summary - mobile compact */}
        <div className="sm:hidden mb-6">
          <Card>
            <CardContent className="py-3">
              <div className="grid grid-cols-3 divide-x divide-[color:var(--color-neutral-200)]">
                <div className="text-center px-2">
                  <div className="text-[10px] uppercase tracking-wide text-[color:var(--color-neutral-600)]">
                    Categories
                  </div>
                  <div className="text-base font-semibold">
                    {totals.totalCategories}
                  </div>
                </div>
                <div className="text-center px-2">
                  <div className="text-[10px] uppercase tracking-wide text-[color:var(--color-neutral-600)]">
                    Courses
                  </div>
                  <div className="text-base font-semibold">
                    {formatNumber(totals.totalCourses)}
                  </div>
                </div>
                <div className="text-center px-2">
                  <div className="text-[10px] uppercase tracking-wide text-[color:var(--color-neutral-600)]">
                    Learners
                  </div>
                  <div className="text-base font-semibold">
                    {formatNumber(totals.totalLearners)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats summary - colored cards on sm+ */}
        <div className="hidden sm:grid grid-cols-3 gap-3 mb-6">
          {/* Categories */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="py-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center">
                  {/* grid icon */}
                  <LayoutGrid size={18} aria-hidden />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wide text-blue-700/80">
                    Categories
                  </div>
                  <div className="text-lg font-semibold">
                    {totals.totalCategories}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Courses */}
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="py-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
                  {/* book icon */}
                  <BookOpen size={18} aria-hidden />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wide text-emerald-700/80">
                    Courses
                  </div>
                  <div className="text-lg font-semibold">
                    {formatNumber(totals.totalCourses)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learners */}
          <Card className="bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200">
            <CardContent className="py-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-violet-600/10 text-violet-600 flex items-center justify-center">
                  {/* graduation cap icon */}
                  <GraduationCap size={18} aria-hidden />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wide text-violet-700/80">
                    Learners
                  </div>
                  <div className="text-lg font-semibold">
                    {formatNumber(totals.totalLearners)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <CategorySkeleton key={i} />
              ))
            : filtered.map((c) => (
                <Card
                  key={c.id}
                  className="relative overflow-hidden p-0 group border border-black/5 bg-white/95 backdrop-blur-sm flex flex-col h-full"
                >
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src={
                        c.imageKey
                          ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${c.imageKey}`
                          : "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
                      }
                      alt={`${c.name} background`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-orange-50/90 backdrop-blur-sm text-orange-700 border border-orange-100/50 shadow-sm z-10">
                      <Users size={12} className="text-orange-600" />
                      <span className="text-[10px] font-bold">
                        {formatCompact(c.studentCount || 0)} learners
                      </span>
                    </div>
                  </div>
                  <CardContent className="py-4 flex-1 flex flex-col">
                    {/* Header row */}
                    <div className="flex items-start">
                      <div className="min-w-0">
                        <h3
                          className="text-base font-semibold leading-snug truncate"
                          style={{ fontFamily: "var(--font-heading-sans)" }}
                        >
                          {c.name}
                        </h3>
                      </div>
                    </div>

                    {/* Quick Stats Grid - Responsive Layout */}
                    <div className="mt-4 grid grid-cols-3 gap-1.5 md:gap-2">
                      <div className="flex flex-col items-center p-2 md:p-2.5 rounded-lg md:rounded-xl bg-blue-50 border border-blue-100 group/stat hover:bg-blue-100/50 transition-colors duration-300">
                        <div className="flex-shrink-0 h-7 w-7 md:h-8 md:w-8 rounded-lg md:rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs md:shadow-sm mb-1">
                          <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </div>
                        <div className="flex flex-col items-center text-center min-w-0">
                          <span className="text-xs md:text-sm font-bold text-blue-900 leading-none truncate">
                            {c.courseCount || 0}
                          </span>
                          <span className="text-[9px] md:text-[10px] font-semibold text-blue-700 uppercase tracking-tight truncate mt-0.5 md:mt-1">
                            Courses
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center p-2 md:p-2.5 rounded-lg md:rounded-xl bg-emerald-50 border border-emerald-100 group/stat hover:bg-emerald-100/50 transition-colors duration-300">
                        <div className="flex-shrink-0 h-7 w-7 md:h-8 md:w-8 rounded-lg md:rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs md:shadow-sm mb-1">
                          <Tag className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </div>
                        <div className="flex flex-col items-center text-center min-w-0">
                          <span className="text-xs md:text-sm font-bold text-emerald-900 leading-none truncate">
                            {c.categoryToTags?.length || 0}
                          </span>
                          <span className="text-[9px] md:text-[10px] font-semibold text-emerald-700 uppercase tracking-tight truncate mt-0.5 md:mt-1">
                            Tags
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center p-2 md:p-2.5 rounded-lg md:rounded-xl bg-violet-50 border border-violet-100 group/stat hover:bg-violet-100/50 transition-colors duration-300">
                        <div className="flex-shrink-0 h-7 w-7 md:h-8 md:w-8 rounded-lg md:rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shadow-xs md:shadow-sm mb-1">
                          <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </div>
                        <div className="flex flex-col items-center text-center min-w-0">
                          <span className="text-xs md:text-sm font-bold text-violet-900 leading-none truncate">
                            {formatCompact(c.popularityCount || 0)}
                          </span>
                          <span className="text-[9px] md:text-[10px] font-semibold text-violet-700 uppercase tracking-tight truncate mt-0.5 md:mt-1">
                            Popularity
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tag chips */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {c.categoryToTags?.slice(0, 3).map((ct) => (
                        <Badge
                          key={ct.tag.id}
                          variant="outline"
                          className="text-[11px]"
                        >
                          {ct.tag.name}
                        </Badge>
                      ))}
                      {(c.categoryToTags?.length || 0) > 3 && (
                        <Badge variant="outline" className="text-[11px]">
                          +{(c.categoryToTags?.length || 0) - 3}
                        </Badge>
                      )}
                    </div>

                    {/* CTA row pinned (no divider) */}
                    <div className="mt-auto pt-4 flex items-center">
                      <Link
                        href={`/courses?category=${c.slug}`}
                        className="block w-full"
                      >
                        <Button
                          variant="secondary"
                          size="md"
                          className="w-full"
                        >
                          Browse
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <div className="mt-12 mb-20 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="h-20 w-20 rounded-full bg-[color:var(--color-neutral-50)] border border-[color:var(--color-neutral-100)] flex items-center justify-center mb-6 shadow-sm">
              <SearchX
                size={32}
                className="text-[color:var(--color-neutral-400)]"
              />
            </div>
            <h3
              className="text-xl font-semibold text-[color:var(--color-neutral-900)] mb-2"
              style={{ fontFamily: "var(--font-heading-sans)" }}
            >
              No categories found
            </h3>
            <p className="text-sm text-[color:var(--color-neutral-600)] max-w-sm mb-8 leading-relaxed">
              We couldn't find any categories matching{" "}
              {query ? `"${query}"` : "your criteria"}. Try adjusting your
              search or clearing all filters.
            </p>
            {query && (
              <Button
                variant="secondary"
                onClick={() => setQuery("")}
                className="inline-flex items-center gap-2"
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </Container>
    </main>
  );
}
