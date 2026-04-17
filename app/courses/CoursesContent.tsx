"use client";
import React from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card, { CardContent } from "../../components/ui/Card";
import CourseCard, { type Course } from "../../components/CourseCard";
import Modal from "../../components/ui/Modal";
import { Filter, SlidersHorizontal, RotateCcw, X } from "lucide-react";
import Container from "@/components/Container";
import Select from "@/components/ui/Select";
import Slider from "@/components/ui/Slider";
import { guestCourseService, guestCategoryService } from "@/lib/services/guest";
import { CourseDiscountType } from "@/lib/services/admin";

function getDiscountPercent(course: any): number {
  if (!course.isDiscountApplied || !course.markedPrice) return 0;

  if (
    course.discountType === CourseDiscountType.PERCENTAGE &&
    course.discountValue
  ) {
    return Math.round(course.discountValue);
  }

  if (course.discountType === CourseDiscountType.FLAT && course.discountValue) {
    return Math.round((course.discountValue / course.markedPrice) * 100);
  }

  return 0;
}

interface FilterState {
  query: string;
  selectedCategoryId: string;
  maxPrice: number;
  level: string;
}

function FiltersForm({ initialFilters, onApply, onReset, onCloseModal }: any) {
  const [draft, setDraft] = React.useState<FilterState>(initialFilters);

  // Category Menu State
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = React.useState(false);
  const [categoryQuery, setCategoryQuery] = React.useState("");
  const [categoryPage, setCategoryPage] = React.useState(1);
  const [categoryList, setCategoryList] = React.useState<
    { id: string; name: string }[]
  >([]);
  const [hasMoreCategories, setHasMoreCategories] = React.useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = React.useState(false);
  const categoryMenuRef = React.useRef<HTMLDivElement>(null);

  const selectedCategory = categoryList.find(
    (c) => c.id === draft.selectedCategoryId,
  );

  React.useEffect(() => {
    setDraft(initialFilters);
  }, [initialFilters]);

  const fetchCategories = React.useCallback(
    async (page: number, keyword: string, isNewSearch: boolean = false) => {
      setIsLoadingCategories(true);
      try {
        const res = await guestCategoryService.list({
          page,
          limit: 10,
          keyword: keyword || undefined,
        });

        if (res.success && res.data) {
          const newCategories = res.data.data.map((c: any) => ({
            id: c.id,
            name: c.name,
          }));
          setCategoryList((prev) =>
            isNewSearch ? newCategories : [...prev, ...newCategories],
          );
          // @ts-ignore
          setHasMoreCategories(
            (res.data as any).meta
              ? page < Math.ceil((res.data as any).meta.total / 10)
              : false,
          );
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setIsLoadingCategories(false);
      }
    },
    [],
  );

  React.useEffect(() => {
    if (isCategoryMenuOpen) {
      const delayDebounceFn = setTimeout(() => {
        setCategoryPage(1);
        fetchCategories(1, categoryQuery, true);
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [categoryQuery, isCategoryMenuOpen, fetchCategories]);

  // Handle scroll for pagination
  const handleCategoryScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop <=
      e.currentTarget.clientHeight + 10;
    if (bottom && hasMoreCategories && !isLoadingCategories) {
      const nextPage = categoryPage + 1;
      setCategoryPage(nextPage);
      fetchCategories(nextPage, categoryQuery, false);
    }
  };

  // Close menu on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target as Node)
      ) {
        setIsCategoryMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApply = () => {
    onApply(draft);
    if (onCloseModal) onCloseModal();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[color:var(--color-neutral-200)] pr-8 lg:pr-0">
        <h2
          className="text-lg font-semibold flex items-center gap-2 text-[color:var(--foreground)]"
          style={{ fontFamily: "var(--font-heading-sans)" }}
        >
          <SlidersHorizontal className="h-5 w-5 text-[color:var(--color-primary-600)]" />
          Filters
        </h2>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-[color:var(--color-primary-600)] hover:text-[color:var(--color-primary-700)] bg-[color:var(--color-primary-50)] hover:bg-[color:var(--color-primary-100)] px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <div className="space-y-5">
        <Input
          label="Search Keyword"
          placeholder="e.g. Web Development"
          value={draft.query}
          onChange={(e) => setDraft({ ...draft, query: e.target.value })}
        />

        <div>
          <label className="text-sm font-medium text-[color:var(--foreground)]">
            Category
          </label>
          <div className="relative mt-2" ref={categoryMenuRef}>
            <button
              type="button"
              className="h-11 w-full rounded-lg bg-white border pr-9 px-3 text-left text-[color:var(--foreground)] border-[color:var(--color-neutral-200)] focus:border-[color:var(--color-primary-400)] shadow-xs focus:shadow-sm transition-all"
              onClick={() => {
                if (!isCategoryMenuOpen && categoryList.length === 0) {
                  fetchCategories(1, "", true);
                }
                setIsCategoryMenuOpen((v) => !v);
              }}
            >
              <span className="block truncate text-[color:var(--color-neutral-700)]">
                {selectedCategory ? selectedCategory.name : "All Categories"}
              </span>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[color:var(--color-neutral-500)]"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {isCategoryMenuOpen && (
              <div
                className="absolute z-50 mt-1 w-full rounded-lg border border-[color:var(--color-neutral-200)] bg-white shadow-md max-h-56 overflow-y-auto scroll-elegant"
                onScroll={handleCategoryScroll}
              >
                <div className="p-2 border-b border-[color:var(--color-neutral-200)] sticky top-0 bg-white z-10">
                  <div className="relative">
                    <Input
                      value={categoryQuery}
                      onChange={(e) => setCategoryQuery(e.target.value)}
                      placeholder="Search category"
                    />
                    {categoryQuery && (
                      <button
                        type="button"
                        aria-label="Clear search"
                        title="Clear search"
                        onClick={() => setCategoryQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--color-neutral-500)] hover:text-[color:var(--color-neutral-700)]"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <ul className="py-1">
                  <li className="px-3 py-2 hover:bg-[color:var(--color-neutral-50)]">
                    <button
                      type="button"
                      className={`w-full text-left text-sm ${
                        draft.selectedCategoryId === ""
                          ? "text-[color:var(--color-primary-800)] font-medium"
                          : ""
                      }`}
                      onClick={() => {
                        setDraft({ ...draft, selectedCategoryId: "" });
                        setIsCategoryMenuOpen(false);
                      }}
                    >
                      All Categories
                    </button>
                  </li>
                  {categoryList.length === 0 && !isLoadingCategories ? (
                    <li className="px-3 py-2 text-[12px] text-[color:var(--color-neutral-500)] text-center">
                      No categories found
                    </li>
                  ) : (
                    categoryList.map((c) => (
                      <li
                        key={c.id}
                        className="px-3 py-2 hover:bg-[color:var(--color-neutral-50)]"
                      >
                        <button
                          type="button"
                          className={`w-full text-left text-sm ${
                            draft.selectedCategoryId === c.id
                              ? "text-[color:var(--color-primary-800)] font-medium"
                              : ""
                          }`}
                          onClick={() => {
                            setDraft({ ...draft, selectedCategoryId: c.id });
                            setIsCategoryMenuOpen(false);
                          }}
                        >
                          {c.name}
                        </button>
                      </li>
                    ))
                  )}
                  {isLoadingCategories && (
                    <li className="px-3 py-2 text-[12px] text-center text-[color:var(--color-neutral-500)]">
                      Loading...
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        <Slider
          label="Price Range"
          min={0}
          max={20000}
          step={500}
          value={draft.maxPrice}
          onChange={(val) => setDraft({ ...draft, maxPrice: val })}
          formatValue={(val) =>
            val === 20000 ? "Any" : `Rs. ${val.toLocaleString()}`
          }
          minLabel="Free"
          maxLabel="Rs. 20,000"
        />

        <Select
          label="Level"
          value={draft.level}
          onChange={(e) => setDraft({ ...draft, level: e.target.value })}
        >
          <option value="all">Any Level</option>
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </Select>

        <div className="pt-2">
          <Button className="w-full" onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  );
}

function SkeletonCard() {
  return (
    <Card className="relative p-0 overflow-hidden animate-pulse shadow-sm">
      <div className="relative h-48 md:h-56 bg-[color:var(--color-neutral-200)]" />
      <CardContent className="py-4">
        <div className="flex flex-col gap-2">
          <div className="h-4 w-11/12 rounded bg-[color:var(--color-neutral-200)]" />
          <div className="h-3 w-1/2 rounded bg-[color:var(--color-neutral-100)] mt-1" />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="h-5 w-24 rounded bg-[color:var(--color-neutral-200)]" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-14 rounded bg-[color:var(--color-neutral-200)]" />
            <div className="h-8 w-16 rounded bg-[color:var(--color-neutral-200)]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const DEFAULT_FILTERS: FilterState = {
  query: "",
  selectedCategoryId: "",
  maxPrice: 20000,
  level: "all",
};

export default function CoursesContent() {
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [page, setPage] = React.useState(1);
  const pageSize = 6;
  const [pagination, setPagination] = React.useState<{
    page: number;
    limit: number;
    total: number;
  } | null>(null);

  const [filters, setFilters] = React.useState<FilterState>(DEFAULT_FILTERS);

  React.useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await guestCourseService.list({
          page,
          limit: pageSize,
          keyword: filters.query || undefined,
          categoryId: filters.selectedCategoryId || undefined,
          level: filters.level === "all" ? undefined : (filters.level as any),
          maxCoursePrice:
            filters.maxPrice === 20000 ? undefined : filters.maxPrice,
          minCoursePrice: filters.maxPrice === 20000 ? undefined : 0,
        });
        if (response.success && response.data) {
          const mappedCourses: Course[] = response.data.data.map((c: any) => ({
            id: c.id,
            title: c.title,
            slug: c.slug,
            instructor:
              `${c.instructor?.firstName || ""} ${c.instructor?.lastName || ""}`.trim() ||
              c.instructor?.email ||
              "Instructor",
            instructorAvatar: c.instructor?.profilePictureKey
              ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${c.instructor?.profilePictureKey}`
              : undefined,
            rating: c.averageReviewRatingCount || 0,
            ratingCount: c.reviewCount || 0,
            price: c.markedPrice || 0,
            sellingPrice: c.sellingPrice,
            discount: getDiscountPercent(c),
            thumbnail: c?.thumbnailKey
              ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${c.thumbnailKey}`
              : undefined,
            category: c.category?.name,
            duration: c.duration
              ? `${c.duration} ${c.durationUnit}`.toLowerCase()
              : undefined,
          }));
          setCourses(mappedCourses);

          // @ts-ignore
          if (response.data.meta) {
            setPagination(response.data.meta);
          }
        }
      } catch (error) {
        console.error("Error fetching courses", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [page, filters]);

  const total = pagination?.total || 0;
  const pageCount = pagination
    ? Math.max(1, Math.ceil(total / pagination.limit))
    : 1;

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    setFiltersOpen(false);
  };

  return (
    <main>
      <Container className="py-5 md:py-10">
        <div className="grid lg:grid-cols-[260px_1fr] gap-6 items-start">
          {/* Filters */}
          <aside className="sticky top-20 hidden lg:block">
            <Card>
              <CardContent className="py-5">
                <FiltersForm
                  initialFilters={filters}
                  onApply={handleApplyFilters}
                  onReset={handleResetFilters}
                />
              </CardContent>
            </Card>
          </aside>

          {/* Listing */}
          <section>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <h1
                  className="text-xl md:text-2xl font-semibold"
                  style={{ fontFamily: "var(--font-heading-sans)" }}
                >
                  All courses
                </h1>
                <p className="hidden sm:block text-sm text-[color:var(--color-neutral-600)]">
                  Hand-picked modern curriculum
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  aria-label="Open filters"
                  title="Filters"
                  type="button"
                  className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-0 leading-none shadow-xs hover:bg-[color:var(--color-neutral-50)] active:bg-[color:var(--color-neutral-100)] text-[color:var(--color-primary-600)] hover:text-[color:var(--color-primary-700)]"
                  onClick={() => setFiltersOpen(true)}
                >
                  <Filter className="h-5 w-5" aria-hidden />
                </button>
                {/* <Select>
                  <option>Most popular</option>
                  <option>Highest rated</option>
                  <option>Newest</option>
                </Select> */}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              ) : courses.length > 0 ? (
                courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-[color:var(--color-neutral-500)]">
                  No courses found using the selected filters.
                </div>
              )}
            </div>

            {total > pageSize && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[color:var(--color-neutral-200)] pt-6">
                <p className="text-sm text-[color:var(--color-neutral-500)] text-center sm:text-left">
                  Showing{" "}
                  <span className="font-medium text-[color:var(--color-neutral-900)]">
                    {total === 0 ? 0 : (page - 1) * pageSize + 1}-
                    {Math.min(page * pageSize, total)}
                  </span>{" "}
                  of {total} courses
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
          </section>
        </div>
      </Container>
      <Modal open={filtersOpen} onClose={() => setFiltersOpen(false)} title="">
        <div className="space-y-4">
          <FiltersForm
            initialFilters={filters}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
            onCloseModal={() => setFiltersOpen(false)}
          />
        </div>
      </Modal>
    </main>
  );
}
