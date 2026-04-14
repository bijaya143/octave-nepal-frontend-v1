"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import {
  Star,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import TestimonialFormModal, {
  TestimonialFormValues,
} from "./TestimonialFormModal";
import {
  adminTestimonialService,
  CreateTestimonialInput,
  UpdateTestimonialInput,
} from "@/lib/services/admin/testimonial";
import { AdminTestimonialFilterInput } from "@/lib/services/admin/types";

type Testimonial = {
  id: string;
  name: string;
  message: string;
  rating: number;
  imageUrl: string;
  isPublished: boolean;
  createdAt: string; // YYYY-MM-DD (UTC)
};

function statusBadgeClass(isPublished: boolean): string {
  return isPublished
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-gray-50 text-gray-700 border-gray-200";
}

function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }
        />
      ))}
    </div>
  );
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = React.useState<Testimonial[]>([]);
  const [pagination, setPagination] = React.useState<{
    page: number;
    limit: number;
    total: number;
  } | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Pagination state
  const [page, setPage] = React.useState(1);
  const pageSize = 10;
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "All" | "Published" | "Unpublished"
  >("All");
  const [ratingFilter, setRatingFilter] = React.useState<
    "All" | "5" | "4" | "3" | "2" | "1"
  >("All");

  // Modal state
  const [openCreate, setOpenCreate] = React.useState(false);
  const [editing, setEditing] = React.useState<Testimonial | null>(null);
  const [viewing, setViewing] = React.useState<Testimonial | null>(null);
  const [pendingDelete, setPendingDelete] = React.useState<Testimonial | null>(
    null,
  );

  const refreshTestimonials = React.useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  React.useEffect(() => {
    const fetchTestimonials = async () => {
      setIsLoading(true);
      try {
        const queryParams: AdminTestimonialFilterInput = {
          page,
          limit: pageSize,
        };

        if (query.trim()) queryParams.keyword = query.trim();
        if (statusFilter !== "All")
          queryParams.isPublished = statusFilter === "Published";
        if (ratingFilter !== "All")
          queryParams.rating = parseInt(ratingFilter, 10);

        const response = await adminTestimonialService.list(queryParams);

        if (!response.success) {
          throw new Error(
            response.error?.message || "Failed to fetch testimonials",
          );
        }

        const transformedTestimonials: Testimonial[] = response.data.data.map(
          (entity) => ({
            id: entity.id,
            name: entity.fullName,
            message: entity.message || "",
            rating: entity.rating,
            imageUrl: entity.profilePictureKey
              ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${entity.profilePictureKey}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(entity.fullName)}&background=random`,
            isPublished: entity.isPublished || false,
            createdAt: new Date(entity.createdAt).toISOString().split("T")[0],
          }),
        );

        setTestimonials(transformedTestimonials);
        setPagination(response.data.meta);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch testimonials",
        );
        toast.error("Failed to load testimonials.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, [page, query, statusFilter, ratingFilter, pageSize, refreshKey]);

  const total = pagination?.total || 0;
  const totalPages = pagination
    ? Math.max(1, Math.ceil(total / pagination.limit))
    : 1;
  const paginatedTestimonials = testimonials;

  // Handle create/edit
  async function handleCreate(values: TestimonialFormValues) {
    if (!values.imageFile) {
      toast.error("Profile image is required");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload: CreateTestimonialInput = {
        fullName: values.name,
        rating: values.rating,
        message: values.message,
        profilePicture: values.imageFile,
        isPublished: values.isPublished,
      };

      const response = await adminTestimonialService.create(payload);
      if (response.success) {
        toast.success(`Testimonial for "${values.name}" created successfully!`);
        setOpenCreate(false);
        refreshTestimonials();
      } else {
        throw new Error(
          response.error?.message || "Failed to create testimonial",
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create testimonial",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEdit(values: TestimonialFormValues) {
    if (!editing) return;
    setIsSubmitting(true);
    try {
      const payload: UpdateTestimonialInput = {
        id: editing.id,
        fullName: values.name,
        rating: values.rating,
        message: values.message,
        profilePicture: values.imageFile || undefined,
        isPublished: values.isPublished,
      };

      const response = await adminTestimonialService.update(payload);
      if (response.success) {
        toast.success(`Testimonial for "${values.name}" updated successfully!`);
        setEditing(null);
        refreshTestimonials();
      } else {
        throw new Error(
          response.error?.message || "Failed to update testimonial",
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update testimonial",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleView = React.useCallback((testimonial: Testimonial) => {
    setViewing(testimonial);
  }, []);

  const handleDelete = React.useCallback((testimonial: Testimonial) => {
    setPendingDelete(testimonial);
  }, []);

  const confirmDelete = React.useCallback(async () => {
    if (!pendingDelete) return;
    try {
      const response = await adminTestimonialService.delete(pendingDelete.id);
      if (response.success) {
        toast.success(`Testimonial from ${pendingDelete.name} deleted`);
        setPendingDelete(null);
        refreshTestimonials();
      } else {
        throw new Error(
          response.error?.message || "Failed to delete testimonial",
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete testimonial",
      );
    }
  }, [pendingDelete, refreshTestimonials]);

  const cancelDelete = React.useCallback(() => {
    setPendingDelete(null);
  }, []);

  const closeView = React.useCallback(() => {
    setViewing(null);
  }, []);

  const columns: Array<DataTableColumn<Testimonial>> = [
    {
      id: "avatar",
      header: "Avatar",
      accessor: "imageUrl",
      cell: (testimonial) => (
        <div className="h-10 w-10 overflow-hidden rounded-full flex-shrink-0">
          <Image
            src={testimonial.imageUrl}
            alt={testimonial.name}
            width={40}
            height={40}
            className="h-full w-full object-cover"
            unoptimized
          />
        </div>
      ),
    },
    {
      id: "name",
      header: "Name",
      accessor: "name",
      cell: (testimonial) => (
        <div className="font-medium text-gray-900">{testimonial.name}</div>
      ),
    },
    {
      id: "message",
      header: "Message",
      accessor: "message",
      cell: (testimonial) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-600 line-clamp-2">
            {testimonial.message}
          </p>
        </div>
      ),
    },
    {
      id: "rating",
      header: "Rating",
      accessor: "rating",
      cell: (testimonial) => renderStars(testimonial.rating),
    },
    {
      id: "status",
      header: "Status",
      accessor: "isPublished",
      cell: (testimonial) => (
        <Badge
          variant="outline"
          className={statusBadgeClass(testimonial.isPublished)}
        >
          {testimonial.isPublished ? (
            <>
              <CheckCircle2 size={12} className="mr-1" />
              Published
            </>
          ) : (
            <>
              <XCircle size={12} className="mr-1" />
              Unpublished
            </>
          )}
        </Badge>
      ),
    },
    {
      id: "createdAt",
      header: "Date",
      accessor: "createdAt",
      cell: (testimonial) => (
        <span className="text-sm text-gray-600">{testimonial.createdAt}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      align: "center",
      accessor: (testimonial) => "",
      cell: (testimonial) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="gap-1 text-primary-600 border-primary-200 hover:bg-primary-50"
            aria-label="View"
            onClick={(e) => {
              e.stopPropagation();
              handleView(testimonial);
            }}
          >
            <Eye size={16} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="gap-1"
            aria-label="Edit"
            onClick={(e) => {
              e.stopPropagation();
              setEditing(testimonial);
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
              handleDelete(testimonial);
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
          <h1 className="text-xl sm:text-2xl font-semibold">Testimonials</h1>
        </div>
        <Button size="sm" onClick={() => setOpenCreate(true)}>
          Add Testimonial
        </Button>
      </div>

      {/* Filters */}
      {/* <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-5">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Search
            </label>
            <Input
              placeholder="Search testimonials..."
              value={query}
              onChange={(e) => {
                setPage(1);
                setQuery(e.target.value);
              }}
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Status
            </label>
            <Select
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(
                  e.target.value as "All" | "Published" | "Unpublished",
                );
              }}
            >
              <option value="All">Statuses</option>
              <option value="Published">Published</option>
              <option value="Unpublished">Unpublished</option>
            </Select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Rating
            </label>
            <Select
              value={ratingFilter}
              onChange={(e) => {
                setPage(1);
                setRatingFilter(
                  e.target.value as "All" | "5" | "4" | "3" | "2" | "1",
                );
              }}
            >
              <option value="All">Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </Select>
          </div>
          <div className="md:col-span-2 flex md:justify-end">
            <Button
              variant="secondary"
              size="md"
              className="w-full md:w-auto inline-flex items-center gap-2 text-primary-600 border-primary-200 hover:bg-primary-50"
              onClick={() => {
                setQuery("");
                setStatusFilter("All");
                setRatingFilter("All");
                setPage(1);
              }}
            >
              <RotateCcw size={16} /> Reset
            </Button>
          </div>
        </div>
      </div> */}

      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={paginatedTestimonials}
            getRowKey={(testimonial) => testimonial.id}
            emptyMessage={
              isLoading ? "Loading testimonials..." : "No testimonials found"
            }
          />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4">
            <p className="text-sm text-[color:var(--color-neutral-600)]">
              Showing {total === 0 ? 0 : (page - 1) * pageSize + 1}-
              {Math.min(page * pageSize, total)} of {total}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <Button
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
                disabled={page === 1 || isLoading}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <div className="text-sm sm:hidden">
                {page}/{totalPages}
              </div>
              <div className="text-sm hidden sm:block">
                Page {page} of {totalPages}
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
                disabled={page === totalPages || isLoading}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <TestimonialFormModal
        open={openCreate || !!editing}
        onClose={() => {
          setOpenCreate(false);
          setEditing(null);
        }}
        onSubmit={editing ? handleEdit : handleCreate}
        title={editing ? "Edit Testimonial" : "Add Testimonial"}
        mode={editing ? "edit" : "create"}
        initialValues={
          editing
            ? {
                name: editing.name,
                message: editing.message,
                rating: editing.rating,
                isPublished: editing.isPublished,
              }
            : undefined
        }
        initialImageUrl={editing?.imageUrl}
        isLoading={isSubmitting}
      />

      {/* View Modal */}
      <Modal
        open={!!viewing}
        onClose={closeView}
        title={viewing ? "Testimonial Details" : undefined}
      >
        {viewing && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-[color:var(--color-primary-50)] to-[color:var(--color-primary-25)] rounded-lg p-4 border border-[color:var(--color-primary-100)]">
              <div className="flex items-start gap-4">
                <Image
                  src={viewing.imageUrl}
                  alt={viewing.name}
                  width={60}
                  height={60}
                  className="w-[60px] h-[60px] rounded-full object-cover flex-shrink-0"
                  unoptimized
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[color:var(--color-neutral-900)] mb-1">
                    {viewing.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    {renderStars(viewing.rating)}
                    <span className="text-xs text-[color:var(--color-neutral-500)]">
                      Received on{" "}
                      {new Date(viewing.createdAt).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-[color:var(--color-primary-500)] rounded-full"></div>
                <h4 className="text-base font-medium text-[color:var(--color-neutral-900)]">
                  Testimonial
                </h4>
              </div>
              <div className="bg-white border border-[color:var(--color-neutral-200)] rounded-lg p-5 shadow-sm">
                <div className="text-[color:var(--color-neutral-800)] leading-relaxed whitespace-pre-wrap italic">
                  "{viewing.message}"
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-[color:var(--color-neutral-200)]">
              <div className="text-xs text-[color:var(--color-neutral-500)]">
                Status:{" "}
                <Badge
                  variant="outline"
                  className={statusBadgeClass(viewing.isPublished)}
                >
                  {viewing.isPublished ? "Published" : "Unpublished"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={closeView}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!pendingDelete}
        onClose={cancelDelete}
        title={pendingDelete ? "Delete Testimonial" : undefined}
      >
        {pendingDelete && (
          <div className="space-y-4 text-sm">
            <div className="text-[color:var(--color-neutral-800)]">
              Are you sure you want to delete the testimonial from
              <span className="font-medium"> {pendingDelete.name} </span>? This
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
                disabled={isSubmitting}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
