"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Card, { CardContent } from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { LayoutGrid, BookOpen, GraduationCap } from "lucide-react";
import Container from "../../components/Container";
import Select from "../../components/ui/Select";

type Category = {
  name: string;
  icon: string;
  bg: string;
  description: string;
  courseCount: number;
  learners: number;
  tags: string[];
  accent: string; // tailwind color token e.g. bg-blue-600
};

const categories: Category[] = [
  {
    name: "Development",
    icon: "https://placehold.co/40x40/png?text=</>",
    bg: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    description: "Frontend, backend, mobile and DevOps with modern stacks.",
    courseCount: 58,
    learners: 12400,
    tags: ["React", "Next.js", "Node", "Docker"],
    accent: "bg-blue-600",
  },
  {
    name: "Design",
    icon: "https://placehold.co/40x40/png?text=UI",
    bg: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1200&q=80",
    description: "UI/UX, prototyping, and visual systems that scale.",
    courseCount: 34,
    learners: 8400,
    tags: ["Figma", "Design Systems", "UX"],
    accent: "bg-pink-600",
  },
  {
    name: "Marketing",
    icon: "https://placehold.co/40x40/png?text=Ad",
    bg: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80",
    description: "Performance, content, and brand growth strategies.",
    courseCount: 21,
    learners: 6100,
    tags: ["SEO", "Ads", "Content"],
    accent: "bg-emerald-600",
  },
  {
    name: "Data Science",
    icon: "https://placehold.co/40x40/png?text=DS",
    bg: "https://images.unsplash.com/photo-1517148815978-75f6acaaf32c?auto=format&fit=crop&w=1200&q=80",
    description: "Analytics, ML, and real-world data pipelines.",
    courseCount: 27,
    learners: 7300,
    tags: ["Python", "Pandas", "ML"],
    accent: "bg-purple-600",
  },
  {
    name: "Business",
    icon: "https://placehold.co/40x40/png?text=Biz",
    bg: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
    description: "Strategy, finance, and operations for modern teams.",
    courseCount: 19,
    learners: 5400,
    tags: ["Finance", "Strategy"],
    accent: "bg-amber-600",
  },
  {
    name: "Photography",
    icon: "https://placehold.co/40x40/png?text=📷",
    bg: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    description: "Composition, lighting, and editing workflows.",
    courseCount: 14,
    learners: 3200,
    tags: ["Lighting", "Editing"],
    accent: "bg-slate-700",
  },
];

function formatNumber(n: number) {
  return new Intl.NumberFormat().format(n);
}

function formatCompact(n: number) {
  return new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export default function CategoriesContent() {
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<"popular" | "courses" | "az">("popular");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? categories.filter((c) =>
          [
            c.name.toLowerCase(),
            c.description.toLowerCase(),
            ...c.tags.map((t) => t.toLowerCase()),
          ].some((v) => v.includes(q))
        )
      : categories;
    const sorted = [...base].sort((a, b) => {
      if (sort === "popular") return b.learners - a.learners;
      if (sort === "courses") return b.courseCount - a.courseCount;
      return a.name.localeCompare(b.name);
    });
    return sorted;
  }, [query, sort]);

  const totals = React.useMemo(() => {
    const totalCourses = categories.reduce((sum, c) => sum + c.courseCount, 0);
    const totalLearners = categories.reduce((sum, c) => sum + c.learners, 0);
    return { totalCategories: categories.length, totalCourses, totalLearners };
  }, []);

  return (
    <main>
      <Container className="py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold" style={{ fontFamily: "var(--font-heading-sans)" }}>Browse categories</h1>
          <p className="hidden sm:block text-sm text-[color:var(--color-neutral-600)]">Explore topics and find your next course</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-5">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="w-full sm:w-80">
            <Input placeholder="Search categories, tags…" value={query} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)} />
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="w-full sm:w-56">
            <Select value={sort} onChange={(e) => setSort(e.target.value as any)}>
              <option value="popular">Most popular</option>
              <option value="courses">Most courses</option>
              <option value="az">A–Z</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Stats summary - mobile compact */}
      <div className="sm:hidden mb-6">
        <Card>
          <CardContent className="py-3">
            <div className="grid grid-cols-3 divide-x divide-[color:var(--color-neutral-200)]">
              <div className="text-center px-2">
                <div className="text-[10px] uppercase tracking-wide text-[color:var(--color-neutral-600)]">Categories</div>
                <div className="text-base font-semibold">{totals.totalCategories}</div>
              </div>
              <div className="text-center px-2">
                <div className="text-[10px] uppercase tracking-wide text-[color:var(--color-neutral-600)]">Courses</div>
                <div className="text-base font-semibold">{formatNumber(totals.totalCourses)}</div>
              </div>
              <div className="text-center px-2">
                <div className="text-[10px] uppercase tracking-wide text-[color:var(--color-neutral-600)]">Learners</div>
                <div className="text-base font-semibold">{formatNumber(totals.totalLearners)}</div>
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
                <div className="text-[11px] uppercase tracking-wide text-blue-700/80">Categories</div>
                <div className="text-lg font-semibold">{totals.totalCategories}</div>
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
                <div className="text-[11px] uppercase tracking-wide text-emerald-700/80">Courses</div>
                <div className="text-lg font-semibold">{formatNumber(totals.totalCourses)}</div>
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
                <div className="text-[11px] uppercase tracking-wide text-violet-700/80">Learners</div>
                <div className="text-lg font-semibold">{formatNumber(totals.totalLearners)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filtered.map((c) => (
          <Card key={c.name} className="relative overflow-hidden p-0 group border border-black/5 bg-white/95 backdrop-blur-sm flex flex-col h-full">
            <div className="relative aspect-[16/9] w-full">
              <Image src={c.bg} alt={`${c.name} background`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
            <CardContent className="py-4 flex-1 flex flex-col">
              {/* Header row (no icon or inline tag) */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold leading-snug truncate" style={{ fontFamily: "var(--font-heading-sans)" }}>{c.name}</h3>
                </div>
                <div className="text-[11px] text-[color:var(--color-neutral-600)] whitespace-nowrap">{formatCompact(c.learners)} learners</div>
              </div>
              {/* description removed as per request */}

              {/* Dense stats strip */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-black/5 px-2 py-2 text-center">
                  <div className="text-[10px] uppercase tracking-wide text-[color:var(--color-neutral-600)]">Courses</div>
                  <div className="text-sm font-semibold">{c.courseCount}</div>
                </div>
                <div className="rounded-lg border border-black/5 px-2 py-2 text-center">
                  <div className="text-[10px] uppercase tracking-wide text-[color:var(--color-neutral-600)]">Tags</div>
                  <div className="text-sm font-semibold">{c.tags.length}</div>
                </div>
                <div className="rounded-lg border border-black/5 px-2 py-2 text-center">
                  <div className="text-[10px] uppercase tracking-wide text-[color:var(--color-neutral-600)]">Popularity</div>
                  <div className="text-sm font-semibold">{formatCompact(c.learners)}</div>
                </div>
              </div>

              {/* Tag chips */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.tags.slice(0, 3).map((t) => (
                  <Badge key={t} variant="outline" className="text-[11px]">{t}</Badge>
                ))}
                {c.tags.length > 3 && (
                  <Badge variant="outline" className="text-[11px]">+{c.tags.length - 3}</Badge>
                )}
              </div>

              {/* CTA row pinned (no divider) */}
              <div className="mt-auto pt-4 flex items-center justify-end">
                <Link href={`/courses?category=${encodeURIComponent(c.name)}`} className="block w-full sm:w-auto">
                  <Button size="sm" className="w-full sm:w-auto">Browse</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="mt-10 text-center text-sm text-[color:var(--color-neutral-600)]">No categories match your search.</div>
      )}
      </Container>
    </main>
  );
}

