"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Pencil,
  Trash2,
  RotateCcw,
} from "lucide-react";
import Image from "next/image";
import BlogCategoryFormModal, {
  BlogCategoryFormValues,
} from "./BlogCategoryFormModal";
import BlogCategoryViewModal from "./BlogCategoryViewModal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { toast } from "sonner";
import {
  adminBlogCategoryService,
  CreateBlogCategoryInput,
  UpdateBlogCategoryInput,
} from "@/lib/services/admin/blog-category";
import {
  BlogCategory as BlogCategoryType,
  AdminBlogCategoryFilterInput,
} from "@/lib/services/admin/types";

// UI display type
type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  postCount: number;
};

function categoryBadgeClass(isPublished: boolean): string {
  return isPublished
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-gray-50 text-gray-700 border-gray-200";
}

export default function AdminBlogCategoriesPage() {
  const [categories, setCategories] = React.useState<BlogCategory[]>([]);
  const [pagination, setPagination] = React.useState<{
    page: number;
    limit: number;
    total: number;
  } | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const pageSize = 10;
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "All" | "Published" | "Unpublished"
  >("All");

  const refreshCategories = React.useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  React.useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const queryParams: AdminBlogCategoryFilterInput = {
          page,
          limit: pageSize,
        };

        if (query.trim()) queryParams.keyword = query.trim();
        if (statusFilter !== "All")
          queryParams.isPublished = statusFilter === "Published";

        const response = await adminBlogCategoryService.list(queryParams);

        if (!response.success) {
          throw new Error(
            response.error?.message || "Failed to fetch blog categories",
          );
        }

        const transformedCategories: BlogCategory[] = response.data.data.map(
          (entity: BlogCategoryType) => ({
            id: entity.id,
            name: entity.name,
            slug: entity.slug,
            imageUrl: entity.imageKey
              ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${entity.imageKey}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(entity.name)}&background=random`,
            description: entity.description || "",
            createdAt: new Date(entity.createdAt).toISOString().split("T")[0],
            updatedAt: new Date(entity.updatedAt).toISOString().split("T")[0],
            isPublished: entity.isPublished ?? false,
            postCount: entity.postCount,
          }),
        );

        setCategories(transformedCategories);
        setPagination(response.data.meta);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch blog categories",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [page, query, statusFilter, pageSize, refreshKey]);

  const total = pagination?.total || 0;
  const pageCount = pagination
    ? Math.max(1, Math.ceil(total / pagination.limit))
    : 1;

  const [selected, setSelected] = React.useState<BlogCategory | null>(null);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [editing, setEditing] = React.useState<BlogCategory | null>(null);
  const [pendingDelete, setPendingDelete] = React.useState<BlogCategory | null>(
    null,
  );

  const handleCreate = React.useCallback(
    async (values: BlogCategoryFormValues) => {
      if (!values.imageFile) {
        toast.error("Image is required");
        return;
      }
      setIsSubmitting(true);
      try {
        const payload: CreateBlogCategoryInput = {
          name: values.name,
          slug: values.slug,
          description: values.description,
          image: values.imageFile,
          isPublished: values.isPublished,
        };

        const response = await adminBlogCategoryService.create(payload);
        if (response.success) {
          toast.success(`Blog category created: ${values.name}`);
          setOpenCreate(false);
          refreshCategories();
        } else {
          throw new Error(
            response.error?.message || "Failed to create blog category",
          );
        }
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to create blog category",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [refreshCategories],
  );

  const handleEdit = React.useCallback(
    async (values: BlogCategoryFormValues) => {
      if (!editing) return;
      setIsSubmitting(true);
      try {
        const payload: UpdateBlogCategoryInput = {
          id: editing.id,
          name: values.name,
          slug: values.slug,
          description: values.description,
          image: values.imageFile || undefined,
          isPublished: values.isPublished,
        };

        const response = await adminBlogCategoryService.update(payload);
        if (response.success) {
          toast.success(`Blog category updated: ${values.name}`);
          setEditing(null);
          refreshCategories();
        } else {
          throw new Error(
            response.error?.message || "Failed to update blog category",
          );
        }
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to update blog category",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [editing, refreshCategories],
  );

  const handleDelete = React.useCallback((category: BlogCategory) => {
    setPendingDelete(category);
  }, []);

  const confirmDelete = React.useCallback(async () => {
    if (!pendingDelete) return;
    try {
      const response = await adminBlogCategoryService.delete(pendingDelete.id);
      if (response.success) {
        toast.success(`Blog category deleted: ${pendingDelete.name}`);
        setPendingDelete(null);
        refreshCategories();
      } else {
        throw new Error(
          response.error?.message || "Failed to delete blog category",
        );
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete blog category",
      );
    }
  }, [pendingDelete, refreshCategories]);

  const cancelDelete = React.useCallback(() => {
    setPendingDelete(null);
  }, []);

  const columns: Array<DataTableColumn<BlogCategory>> = [
    { id: "name", header: "Name", accessor: "name" },
    {
      id: "imageUrl",
      header: "Image",
      accessor: (row) =>
        row.imageUrl ? (
          <Image
            src={row.imageUrl}
            alt={row.name}
            width={60}
            height={35}
            className="rounded-md object-cover h-[35px] w-[60px]"
            unoptimized
          />
        ) : (
          <div className="h-[35px] w-[60px] bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">
            No Img
          </div>
        ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Badge
          variant="outline"
          className={categoryBadgeClass(row.isPublished)}
        >
          <span className="inline-flex items-center gap-1">
            {row.isPublished ? (
              <CheckCircle2 size={14} />
            ) : (
              <XCircle size={14} />
            )}
            {row.isPublished ? "Published" : "Unpublished"}
          </span>
        </Badge>
      ),
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "postCount",
      header: "Posts",
      accessor: (row) => row.postCount,
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "createdAt",
      header: "Created",
      accessor: (row) => row.createdAt,
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
            className="gap-1 text-primary-600 border-primary-200 hover:bg-primary-50"
            aria-label="View"
            onClick={() => setSelected(row)}
          >
            <Eye size={16} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="gap-1"
            aria-label="Edit"
            onClick={() => setEditing(row)}
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
            aria-label="Delete"
            onClick={() => handleDelete(row)}
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
          <h1 className="text-xl sm:text-2xl font-semibold">Blog Categories</h1>
        </div>
        <Button size="sm" onClick={() => setOpenCreate(true)}>
          Add Category
        </Button>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-7">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Search
            </label>
            <Input
              placeholder="Search categories..."
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
              <option value="All">All statuses</option>
              <option value="Published">Published</option>
              <option value="Unpublished">Unpublished</option>
            </Select>
          </div>
          <div className="md:col-span-2 flex md:justify-end">
            <Button
              variant="secondary"
              className="w-full md:w-auto inline-flex items-center gap-2 text-primary-600 border-primary-200 hover:bg-primary-50"
              size="md"
              onClick={() => {
                setQuery("");
                setStatusFilter("All");
                setPage(1);
              }}
            >
              <RotateCcw size={16} /> Reset
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card>
        <CardContent className="py-0">
          <DataTable<BlogCategory>
            data={categories}
            columns={columns}
            getRowKey={(row) => row.id}
            emptyMessage={
              isLoading ? "Loading..." : "No blog categories found."
            }
          />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4">
            <p className="text-sm text-[color:var(--color-neutral-600)]">
              Showing {total === 0 ? 0 : (page - 1) * pageSize + 1}–
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
                {page}/{pageCount}
              </div>
              <div className="text-sm hidden sm:block">
                Page {page} of {pageCount}
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
                disabled={page === pageCount || isLoading}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal
        open={!!pendingDelete}
        onClose={cancelDelete}
        title={pendingDelete ? "Delete Blog Category" : undefined}
      >
        {pendingDelete && (
          <div className="space-y-4 text-sm">
            <div className="text-[color:var(--color-neutral-800)]">
              Are you sure you want to delete
              <span className="font-medium"> {pendingDelete.name} </span>? This
              will also remove this category from all associated blog posts.
              This action cannot be undone.
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

      <BlogCategoryViewModal
        category={selected}
        onClose={() => setSelected(null)}
      />

      <BlogCategoryFormModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreate}
        title="Create Blog Category"
        mode="create"
        isLoading={isSubmitting}
      />

      <BlogCategoryFormModal
        open={!!editing}
        onClose={() => setEditing(null)}
        onSubmit={handleEdit}
        title="Edit Blog Category"
        mode="edit"
        isLoading={isSubmitting}
        initialValues={
          editing
            ? {
                name: editing.name,
                slug: editing.slug,
                description: editing.description,
                isPublished: editing.isPublished,
              }
            : undefined
        }
        initialImageUrl={editing ? editing.imageUrl : undefined}
      />
    </div>
  );
}
