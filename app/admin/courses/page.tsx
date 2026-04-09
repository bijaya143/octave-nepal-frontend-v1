"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Image from "next/image";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DateRangePicker from "@/components/ui/DateRangePicker";
import {
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Avatar from "@/components/ui/Avatar";
import CourseFormModal, { CourseFormValues } from "./CourseFormModal";
import { adminCourseService } from "@/lib/services/admin/course";
import { adminInstructorService } from "@/lib/services/admin/instructor";
import { adminCategoryService } from "@/lib/services/admin/category";
import {
  Course,
  AdminCourseFilterInput,
  PublishStatusType,
  CourseLevel,
  Category,
  Instructor,
} from "@/lib/services/admin/types";

function statusBadgeClass(status: PublishStatusType): string {
  if (status === PublishStatusType.PUBLISHED)
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === PublishStatusType.UNDER_REVIEW)
    return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-gray-50 text-gray-700 border-gray-200";
}

function mapValuesToInput(values: CourseFormValues) {
  const {
    syllabus,
    saleStartDate,
    saleEndDate,
    metaKeywords,
    markedPrice,
    discountValue,
    sellingPrice,
    seatCapacityCount,
    occupiedSeatCount,
    availableSeatCount,
    waitlistCapacityCount,
    duration,
    lessonCount,
    ...rest
  } = values;

  return {
    ...rest,
    syllabus: {
      sections: syllabus.map((s) => ({
        title: s.title,
        items: s.items.map((it) => ({
          type: it.type.toUpperCase(), // Ensure uppercase for enum matching if needed
          title: it.title,
          description: it.description,
          isPublished: !!it.isPreview,
          duration: Number(it.durationMinutes) || 0,
          durationUnit: "MINUTE",
        })),
      })),
    },
    salePeriodDateRange:
      saleStartDate && saleEndDate
        ? { startDate: saleStartDate, endDate: saleEndDate }
        : undefined,
    metaKeywords: metaKeywords
      ? metaKeywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean)
      : [],
    markedPrice: Number(markedPrice) || 0,
    discountValue: Number(discountValue) || 0,
    sellingPrice: Number(sellingPrice) || 0,
    seatCapacityCount: Number(seatCapacityCount) || 0,
    occupiedSeatCount: Number(occupiedSeatCount) || 0,
    availableSeatCount: Number(availableSeatCount) || 0,
    waitlistCapacityCount: Number(waitlistCapacityCount) || 0,
    duration: Number(duration) || 0,
    lessonCount: Number(lessonCount) || 0,
  };
}

function formatLabel(str: string) {
  return str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function AdminCoursesPage() {
  const router = useRouter();

  const [courses, setCourses] = React.useState<Course[]>([]);
  const [pagination, setPagination] = React.useState<{
    page: number;
    limit: number;
    total: number;
  } | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const [availableCategories, setAvailableCategories] = React.useState<
    Category[]
  >([]);
  const [availableInstructors, setAvailableInstructors] = React.useState<
    Instructor[]
  >([]);
  const availableLevels = Object.values(CourseLevel);

  const [page, setPage] = React.useState(1);
  const pageSize = 10;
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "All" | PublishStatusType
  >("All");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [levelFilter, setLevelFilter] = React.useState<string>("all");
  const [createdFrom, setCreatedFrom] = React.useState<string>("");
  const [createdTo, setCreatedTo] = React.useState<string>("");
  const [priceMin, setPriceMin] = React.useState<string>("");
  const [priceMax, setPriceMax] = React.useState<string>("");

  const fetchDropdownData = React.useCallback(async () => {
    try {
      const [catResp, insResp] = await Promise.all([
        adminCategoryService.list({ page: 1, limit: 100 }),
        adminInstructorService.list({ page: 1, limit: 100 }),
      ]);
      if (catResp.success) setAvailableCategories(catResp.data.data);
      if (insResp.success) setAvailableInstructors(insResp.data.data);
    } catch (error) {
      console.error("Failed to fetch dropdown data", error);
    }
  }, []);

  React.useEffect(() => {
    fetchDropdownData();
  }, [fetchDropdownData]);

  const fetchCourses = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const filters: AdminCourseFilterInput = {
        page,
        limit: pageSize,
        keyword: query || undefined,
        status: statusFilter === "All" ? undefined : statusFilter,
        categoryId: categoryFilter === "all" ? undefined : categoryFilter,
        level: levelFilter === "all" ? undefined : (levelFilter as CourseLevel),
        startDate: createdFrom || undefined,
        endDate: createdTo || undefined,
        minCoursePrice: priceMin ? Number(priceMin) : undefined,
        maxCoursePrice: priceMax ? Number(priceMax) : undefined,
      };

      const response = await adminCourseService.list(filters);
      if (response.success) {
        setCourses(response.data.data);
        setPagination(response.data.meta);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch courses",
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    pageSize,
    query,
    statusFilter,
    categoryFilter,
    levelFilter,
    createdFrom,
    createdTo,
    priceMin,
    priceMax,
  ]);

  const priceRangeValue = React.useMemo(() => {
    const min = priceMin.trim();
    const max = priceMax.trim();
    if (min === "" && max === "") return "any";
    if (min === "0" && max === "1000") return "0-1000";
    if (min === "1001" && max === "3000") return "1001-3000";
    if (min === "3001" && max === "") return "3001+";
    return "custom";
  }, [priceMin, priceMax]);

  React.useEffect(() => {
    fetchCourses();
  }, [fetchCourses, refreshKey]);

  const total = pagination?.total || 0;
  const pageCount = pagination
    ? Math.ceil(pagination.total / pagination.limit)
    : 1;
  const currentPage = pagination?.page || 1;
  const start = (currentPage - 1) * (pagination?.limit || pageSize);
  const end = Math.min(start + (pagination?.limit || pageSize), total);
  const pageItems = courses;

  const nextPage = () => setPage((p) => Math.min(p + 1, pageCount));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));

  const [pendingDelete, setPendingDelete] = React.useState<Course | null>(null);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [editing, setEditing] = React.useState<Course | null>(null);

  const handleDelete = React.useCallback((course: Course) => {
    setPendingDelete(course);
  }, []);
  const cancelDelete = React.useCallback(() => setPendingDelete(null), []);

  const handleCreate = React.useCallback(async (values: CourseFormValues) => {
    try {
      setIsSubmitting(true);
      const input = mapValuesToInput(values);
      const response = await adminCourseService.create(input as any);
      if (response.success) {
        toast.success(`Course created: ${values.title}`);
        setOpenCreate(false);
        setRefreshKey((k) => k + 1);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create course",
      );
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleEdit = React.useCallback(
    async (values: CourseFormValues) => {
      if (!editing) return;
      try {
        setIsSubmitting(true);
        const input = mapValuesToInput(values);
        const response = await adminCourseService.update({
          id: editing.id,
          ...input,
        } as any);
        if (response.success) {
          toast.success(`Course updated: ${values.title}`);
          setEditing(null);
          setRefreshKey((k) => k + 1);
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to update course",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [editing],
  );

  const confirmDelete = React.useCallback(async () => {
    if (!pendingDelete) return;
    try {
      const response = await adminCourseService.delete(pendingDelete.id);
      if (response.success) {
        toast.error(`Course deleted: ${pendingDelete.title}`);
        setPendingDelete(null);
        setRefreshKey((k) => k + 1);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete course",
      );
    }
  }, [pendingDelete]);

  const columns: Array<DataTableColumn<Course>> = [
    {
      id: "thumbnail",
      header: "Thumbnail",
      accessor: (row) => (
        <div className="h-12 w-20 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
          {row.thumbnailKey ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${row.thumbnailKey}`}
              alt={row.title}
              width={80}
              height={48}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <span className="text-xs text-gray-400">No Image</span>
          )}
        </div>
      ),
    },
    {
      id: "title",
      header: "Title",
      accessor: (row) => (
        <div className="flex flex-col">
          <span
            className="font-medium truncate max-w-[200px]"
            title={row.title}
          >
            {row.title}
          </span>
          <span className="text-xs text-[color:var(--color-neutral-500)]">
            {row.category.name}
          </span>
        </div>
      ),
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "instructor",
      header: "Instructor",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-100">
            <Avatar
              src={
                row.instructor?.profilePictureKey
                  ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${row.instructor?.profilePictureKey}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      [
                        row.instructor?.firstName,
                        row.instructor?.middleName,
                        row.instructor?.lastName,
                      ]
                        .filter(Boolean)
                        .join(" "),
                    )}&background=random`
              }
              alt={row.instructor?.firstName || ""}
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          </div>
          <span>{`${row.instructor?.firstName || ""} ${
            row.instructor?.lastName || ""
          }`}</span>
        </div>
      ),
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "level",
      header: "Level",
      accessor: (row) => formatLabel(row.level),
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "price",
      header: "Price",
      accessor: (row) => `Rs ${row.markedPrice.toLocaleString()}`,
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "students",
      header: "Students",
      accessor: (row) => row.studentCount,
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "rating",
      header: "Rating",
      accessor: (row) => row.averageReviewRatingCount,
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Badge variant="outline" className={statusBadgeClass(row.status)}>
          <span className="inline-flex items-center gap-1">
            {row.status === PublishStatusType.PUBLISHED ? (
              <CheckCircle2 size={14} />
            ) : row.status === PublishStatusType.UNDER_REVIEW ? (
              <Clock size={14} />
            ) : (
              <XCircle size={14} />
            )}
            {row.status.replace(/_/g, " ")}
          </span>
        </Badge>
      ),
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "actions",
      header: "Actions",
      align: "center",
      cell: (row) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="gap-1"
            aria-label="Edit"
            onClick={(e) => {
              e.stopPropagation();
              setEditing(row);
            }}
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
            aria-label="Delete"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Courses</h1>
        </div>
        <Button size="sm" onClick={() => setOpenCreate(true)}>
          Create Course
        </Button>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* Row 1: Search, Date Range, Reset */}
          <div className="md:col-span-5">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Search
            </label>
            <Input
              placeholder="Search courses..."
              value={query}
              onChange={(e) => {
                setPage(1);
                setQuery(e.target.value);
              }}
            />
          </div>
          <div className="md:col-span-5">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Created Date
            </label>
            <DateRangePicker
              value={{ from: createdFrom || null, to: createdTo || null }}
              onChange={(r) => {
                setPage(1);
                setCreatedFrom(r.from || "");
                setCreatedTo(r.to || "");
              }}
              placeholder="Created date range"
            />
          </div>
          <div className="md:col-span-2 flex md:justify-end">
            <Button
              variant="secondary"
              size="md"
              className="w-full md:w-auto inline-flex items-center gap-2 text-primary-600 border-primary-200 hover:bg-primary-50"
              onClick={() => {
                setQuery("");
                setStatusFilter("All");
                setCategoryFilter("all");
                setLevelFilter("all");
                setCreatedFrom("");
                setCreatedTo("");
                setPriceMin("");
                setPriceMax("");
                setPage(1);
              }}
            >
              <RotateCcw size={16} /> Reset
            </Button>
          </div>

          {/* Row 2: Category, Level, Status, Price */}
          <div className="md:col-span-3">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Category
            </label>
            <Select
              value={categoryFilter}
              onChange={(e) => {
                setPage(1);
                setCategoryFilter(e.target.value);
              }}
            >
              <option value="all">All categories</option>
              {availableCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Level
            </label>
            <Select
              value={levelFilter}
              onChange={(e) => {
                setPage(1);
                setLevelFilter(e.target.value);
              }}
            >
              <option value="all">All levels</option>
              {availableLevels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {formatLabel(lvl)}
                </option>
              ))}
            </Select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Status
            </label>
            <Select
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value as any);
              }}
            >
              <option value="All">All statuses</option>
              {Object.values(PublishStatusType).map((st) => (
                <option key={st} value={st}>
                  {formatLabel(st)}
                </option>
              ))}
            </Select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Price
            </label>
            <Select
              value={priceRangeValue}
              onChange={(e) => {
                const v = e.target.value;
                setPage(1);
                if (v === "any") {
                  setPriceMin("");
                  setPriceMax("");
                } else if (v === "0-1000") {
                  setPriceMin("0");
                  setPriceMax("1000");
                } else if (v === "1001-3000") {
                  setPriceMin("1001");
                  setPriceMax("3000");
                } else if (v === "3001+") {
                  setPriceMin("3001");
                  setPriceMax("");
                }
              }}
            >
              <option value="any">Price (Any)</option>
              <option value="0-1000">Rs 0 - 1,000</option>
              <option value="1001-3000">Rs 1,001 - 3,000</option>
              <option value="3001+">Rs 3,001+</option>
            </Select>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="py-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-[color:var(--color-neutral-600)]">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading courses...</span>
              </div>
            </div>
          ) : (
            <>
              <DataTable<Course>
                data={pageItems}
                columns={columns}
                getRowKey={(row) => row.id}
                emptyMessage="No courses found."
                onRowClick={(row) => router.push(`/admin/courses/${row.id}`)}
              />
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 w-full px-6 py-4">
                <div className="text-sm text-[color:var(--color-neutral-600)]">
                  Showing {start + 1} to {end} of {total} results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full sm:w-auto"
                    disabled={currentPage === 1}
                    onClick={prevPage}
                  >
                    Previous
                  </Button>
                  <div className="text-sm sm:hidden">
                    {currentPage}/{pageCount}
                  </div>
                  <div className="text-sm hidden sm:block">
                    Page {currentPage} of {pageCount}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full sm:w-auto"
                    disabled={currentPage === pageCount}
                    onClick={nextPage}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Modal
        open={!!pendingDelete}
        onClose={cancelDelete}
        title={pendingDelete ? "Delete Course" : undefined}
      >
        {pendingDelete && (
          <div className="space-y-4 text-sm">
            <div className="text-[color:var(--color-neutral-800)]">
              Are you sure you want to delete
              <span className="font-medium"> {pendingDelete.title} </span>? This
              action cannot be undone.
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button
                variant="secondary"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
      <CourseFormModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreate}
        title="Create New Course"
        mode="create"
        availableCategories={availableCategories}
        availableInstructors={availableInstructors}
        isLoading={isSubmitting}
      />

      <CourseFormModal
        open={!!editing}
        onClose={() => setEditing(null)}
        onSubmit={handleEdit}
        title="Edit Course"
        mode="edit"
        initialValues={
          editing
            ? {
                title: editing.title,
                subtitle: editing.subtitle,
                instructorId: editing.instructor.id,
                categoryId: editing.category.id,
                level: editing.level,
                language: editing.language,
                shortDescription: editing.shortDescription || "",
                longDescription: editing.longDescription || "",
                prerequisite: editing.prerequisite || "",
                learningOutcome: editing.learningOutcome || "",
                duration: editing.duration,
                durationUnit: editing.durationUnit,
                lessonCount: editing.lessonCount,
                syllabus:
                  editing.syllabus?.sections?.map((s) => ({
                    id: Math.random().toString(36).slice(2, 10),
                    title: s.title,
                    description: "", // Fallback if missing
                    items:
                      s.items?.map((it) => ({
                        id: Math.random().toString(36).slice(2, 10),
                        type: it.type.toLowerCase() as any,
                        title: it.title,
                        description: it.description,
                        durationMinutes: it.duration,
                        isPreview: it.isPublished,
                      })) || [],
                  })) || [],
                markedPrice: editing.markedPrice,
                isDiscountApplied: editing.isDiscountApplied,
                discountType: editing.discountType,
                discountValue: editing.discountValue,
                isSalePeriodApplied: editing.isSalePeriodApplied,
                saleStartDate: editing.salePeriodDateRange?.startDate || "",
                saleEndDate: editing.salePeriodDateRange?.endDate || "",
                isTaxIncluded: editing.isTaxIncluded,
                startDate: editing.startDate,
                endDate: editing.endDate,
                fromDay: editing.fromDay,
                toDay: editing.toDay,
                startTime: editing.startTime,
                startTimeDesignator: editing.startTimeDesignator,
                endTime: editing.endTime,
                endTimeDesignator: editing.endTimeDesignator,
                timezone: editing.timezone,
                seatCapacityCount: editing.seatCapacityCount,
                availableSeatCount: editing.availableSeatCount,
                occupiedSeatCount: editing.occupiedSeatCount,
                lastEnrollmentDate: editing.lastEnrollmentDate,
                isWaitlistApplied: editing.isWaitlistApplied,
                waitlistCapacityCount: editing.waitlistCapacityCount,
                status: editing.status,
                isFeatured: editing.isFeatured,
                isReviewAllowed: editing.isReviewAllowed,
                additionalResourceLinks:
                  editing.additionalResourceLinks?.map((l) => ({
                    ...l,
                    label: l.label || "",
                    id: Math.random().toString(36).slice(2, 10),
                  })) || [],
                meetingLinks:
                  editing.meetingLinks?.map((l) => ({
                    ...l,
                    id: Math.random().toString(36).slice(2, 10),
                  })) || [],
                metaTitle: editing.metaTitle || "",
                metaDescription: editing.metaDescription || "",
                metaKeywords: Array.isArray(editing.metaKeywords)
                  ? editing.metaKeywords.join(", ")
                  : editing.metaKeywords || "",
              }
            : undefined
        }
        initialThumbnailUrl={
          editing?.thumbnailKey
            ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${editing.thumbnailKey}`
            : ""
        }
        availableCategories={availableCategories}
        availableInstructors={availableInstructors}
        isLoading={isSubmitting}
      />
    </div>
  );
}
