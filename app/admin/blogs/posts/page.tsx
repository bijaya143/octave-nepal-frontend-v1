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
import { useRouter } from "next/navigation";
import BlogPostFormModal, { BlogPostFormValues } from "./BlogPostFormModal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { toast } from "sonner";
import {
  adminBlogPostService,
  CreateBlogPostInput,
  UpdateBlogPostInput,
} from "@/lib/services/admin/blog-post";
import { adminBlogCategoryService } from "@/lib/services/admin/blog-category";
import {
  BlogPost as BlogPostEntity,
  BlogCategory as BlogCategoryEntity,
  AdminBlogPostFilterInput,
} from "@/lib/services/admin/types";

// ─── UI types ────────────────────────────────────────────────────────────────

type BlogCategory = {
  id: string;
  name: string;
};

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImageUrl: string;
  author: string;
  authorImageUrl: string;
  category: BlogCategory;
  tags: string[];
  status: "unpublished" | "published";
  isFeatured: boolean;
  estimatedReadTime: number;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusBadgeClass(status: BlogPost["status"]): string {
  switch (status) {
    case "published":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "unpublished":
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

function statusIcon(status: BlogPost["status"]) {
  switch (status) {
    case "published":
      return <CheckCircle2 size={14} />;
    case "unpublished":
    default:
      return <XCircle size={14} />;
  }
}

function transformPost(entity: BlogPostEntity): BlogPost {
  return {
    id: entity.id,
    title: entity.title,
    slug: entity.slug,
    excerpt: entity.excerpt || "",
    content: entity.content,
    featuredImageUrl: entity.imageKey
      ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${entity.imageKey}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(entity.title)}&background=random`,
    author: entity.author || "",
    authorImageUrl: entity.authorImageKey
      ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${entity.authorImageKey}`
      : `/images/logo/octave-nepal-only-logo.png`,
    category: entity.blogCategory
      ? { id: entity.blogCategory.id, name: entity.blogCategory.name }
      : { id: "", name: "Uncategorized" },
    tags: entity.tags || [],
    status: entity.isPublished ? "published" : "unpublished",
    isFeatured: entity.isFeatured ?? false,
    estimatedReadTime: entity.estimatedReadTime || 0,
    metaTitle: entity.metaTitle || "",
    metaDescription: entity.metaDescription || "",
    metaKeywords: Array.isArray(entity.metaKeywords)
      ? entity.metaKeywords.join(", ")
      : typeof entity.metaKeywords === "string"
        ? entity.metaKeywords
        : "",
    viewCount: 0, // not returned by list API
    createdAt: new Date(entity.createdAt).toISOString().split("T")[0],
    updatedAt: new Date(entity.updatedAt).toISOString().split("T")[0],
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminBlogPostsPage() {
  const router = useRouter();

  // ── Data state ──────────────────────────────────────────────────────────────
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [pagination, setPagination] = React.useState<{
    page: number;
    limit: number;
    total: number;
  } | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);

  // Categories for filter dropdown and form
  const [availableCategories, setAvailableCategories] = React.useState<
    BlogCategory[]
  >([]);

  // ── Filter state ─────────────────────────────────────────────────────────────
  const [page, setPage] = React.useState(1);
  const pageSize = 10;
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "All" | "Published" | "Unpublished"
  >("All");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");

  // ── Modal state ──────────────────────────────────────────────────────────────
  const [openCreate, setOpenCreate] = React.useState(false);
  const [editing, setEditing] = React.useState<BlogPost | null>(null);
  const [pendingDelete, setPendingDelete] = React.useState<BlogPost | null>(
    null,
  );

  // ── Fetch categories (once) ──────────────────────────────────────────────────
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const resp = await adminBlogCategoryService.list({
          page: 1,
          limit: 100,
        });
        if (resp.success) {
          setAvailableCategories(
            resp.data.data.map((c: BlogCategoryEntity) => ({
              id: c.id,
              name: c.name,
            })),
          );
        }
      } catch {
        // non-critical — filters/form still work with empty list
      }
    };
    fetchCategories();
  }, []);

  // ── Fetch posts ───────────────────────────────────────────────────────────────
  React.useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const filters: AdminBlogPostFilterInput = {
          page,
          limit: pageSize,
        };
        if (query.trim()) filters.keyword = query.trim();
        if (statusFilter !== "All")
          filters.isPublished = statusFilter === "Published";
        if (categoryFilter !== "all") filters.blogCategoryId = categoryFilter;

        const response = await adminBlogPostService.list(filters);
        if (!response.success) {
          throw new Error(
            response.error?.message || "Failed to fetch blog posts",
          );
        }

        setPosts(response.data.data.map(transformPost));
        setPagination(response.data.meta);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch blog posts",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [page, query, statusFilter, categoryFilter, pageSize, refreshKey]);

  const refresh = React.useCallback(() => setRefreshKey((k) => k + 1), []);

  // ── Pagination ────────────────────────────────────────────────────────────────
  const total = pagination?.total || 0;
  const pageCount = pagination
    ? Math.max(1, Math.ceil(total / pagination.limit))
    : 1;

  // ── CRUD handlers ─────────────────────────────────────────────────────────────
  const handleCreate = React.useCallback(
    async (values: BlogPostFormValues) => {
      if (!values.featuredImageFile) {
        toast.error("Featured image is required");
        return;
      }
      setIsSubmitting(true);
      try {
        const payload: CreateBlogPostInput = {
          title: values.title,
          author: values.author || undefined,
          authorImage: values.authorImageFile || undefined,
          blogCategoryId: values.categoryId,
          content: values.content,
          image: values.featuredImageFile,
          isPublished: values.status === "published",
          isFeatured: values.isFeatured,
          excerpt: values.excerpt || undefined,
          tags: values.tags.length ? values.tags : undefined,
          estimatedReadTime: values.estimatedReadTime
            ? Number(values.estimatedReadTime)
            : undefined,
          metaTitle: values.metaTitle || undefined,
          metaDescription: values.metaDescription || undefined,
          metaKeywords: values.metaKeywords
            ? values.metaKeywords
                .split(",")
                .map((k) => k.trim())
                .filter(Boolean)
            : undefined,
        };

        const response = await adminBlogPostService.create(payload);
        if (response.success) {
          toast.success(`Blog post created: ${values.title}`);
          setOpenCreate(false);
          refresh();
        } else {
          throw new Error(
            response.error?.message || "Failed to create blog post",
          );
        }
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to create blog post",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [refresh],
  );

  const handleEdit = React.useCallback(
    async (values: BlogPostFormValues) => {
      if (!editing) return;
      setIsSubmitting(true);
      try {
        const payload: UpdateBlogPostInput = {
          id: editing.id,
          title: values.title,
          author: values.author || undefined,
          authorImage: values.authorImageFile || undefined,
          blogCategoryId: values.categoryId,
          content: values.content,
          image: values.featuredImageFile || undefined,
          isPublished: values.status === "published",
          isFeatured: values.isFeatured,
          excerpt: values.excerpt || undefined,
          tags: values.tags.length ? values.tags : undefined,
          estimatedReadTime: values.estimatedReadTime
            ? Number(values.estimatedReadTime)
            : undefined,
          metaTitle: values.metaTitle || undefined,
          metaDescription: values.metaDescription || undefined,
          metaKeywords: values.metaKeywords
            ? values.metaKeywords
                .split(",")
                .map((k) => k.trim())
                .filter(Boolean)
            : undefined,
        };

        const response = await adminBlogPostService.update(payload);
        if (response.success) {
          toast.success(`Blog post updated: ${values.title}`);
          setEditing(null);
          refresh();
        } else {
          throw new Error(
            response.error?.message || "Failed to update blog post",
          );
        }
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to update blog post",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [editing, refresh],
  );

  const handleDelete = React.useCallback((post: BlogPost) => {
    setPendingDelete(post);
  }, []);

  const confirmDelete = React.useCallback(async () => {
    if (!pendingDelete) return;
    try {
      const response = await adminBlogPostService.delete(pendingDelete.id);
      if (response.success) {
        toast.success(`Blog post deleted: ${pendingDelete.title}`);
        setPendingDelete(null);
        refresh();
      } else {
        throw new Error(
          response.error?.message || "Failed to delete blog post",
        );
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete blog post",
      );
    }
  }, [pendingDelete, refresh]);

  const cancelDelete = React.useCallback(() => setPendingDelete(null), []);

  // ── Table columns ──────────────────────────────────────────────────────────────
  const columns: Array<DataTableColumn<BlogPost>> = [
    {
      id: "featuredImageUrl",
      header: "Image",
      accessor: (row) => (
        <div className="h-12 w-20 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
          {row.featuredImageUrl ? (
            <Image
              src={row.featuredImageUrl}
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
      id: "author",
      header: "Author",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-100">
            <Image
              src={row.authorImageUrl}
              alt={row.author || "Author"}
              width={32}
              height={32}
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>
          <span className="whitespace-nowrap">{row.author || "—"}</span>
        </div>
      ),
      cellClassName: "whitespace-nowrap",
    },

    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <div className="flex flex-col gap-1">
          <Badge variant="outline" className={statusBadgeClass(row.status)}>
            <span className="inline-flex items-center gap-1">
              {statusIcon(row.status)}
              {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
            </span>
          </Badge>
        </div>
      ),
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "updatedAt",
      header: "Updated",
      accessor: (row) => row.updatedAt || "—",
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

  // ── Render ─────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Blog Posts</h1>
        </div>
        <Button size="sm" onClick={() => setOpenCreate(true)}>
          Add Post
        </Button>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-4">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Search
            </label>
            <Input
              placeholder="Search posts..."
              value={query}
              onChange={(e) => {
                setPage(1);
                setQuery(e.target.value);
              }}
            />
          </div>
          <div className="md:col-span-2">
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
          <div className="md:col-span-3 flex md:justify-end">
            <Button
              variant="secondary"
              className="w-full md:w-auto inline-flex items-center gap-2 text-primary-600 border-primary-200 hover:bg-primary-50"
              size="md"
              onClick={() => {
                setQuery("");
                setStatusFilter("All");
                setCategoryFilter("all");
                setPage(1);
              }}
            >
              <RotateCcw size={16} /> Reset
            </Button>
          </div>
        </div>
      </div>
      <Card>
        <CardContent className="py-0">
          <DataTable<BlogPost>
            data={posts}
            columns={columns}
            getRowKey={(row) => row.id}
            emptyMessage={isLoading ? "Loading..." : "No blog posts found."}
            onRowClick={(row) => router.push(`/admin/blogs/posts/${row.id}`)}
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

      {/* Delete confirmation */}
      <Modal
        open={!!pendingDelete}
        onClose={cancelDelete}
        title={pendingDelete ? "Delete Blog Post" : undefined}
      >
        {pendingDelete && (
          <div className="space-y-4 text-sm">
            <div className="text-[color:var(--color-neutral-800)]">
              Are you sure you want to delete
              <span className="font-medium"> {pendingDelete.title} </span>? This
              will permanently remove the post and all associated comments. This
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

      {/* Create modal */}
      <BlogPostFormModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreate}
        title="Create Blog Post"
        mode="create"
        availableCategories={availableCategories}
        isLoading={isSubmitting}
      />

      {/* Edit modal */}
      <BlogPostFormModal
        open={!!editing}
        onClose={() => setEditing(null)}
        onSubmit={handleEdit}
        title="Edit Blog Post"
        mode="edit"
        isLoading={isSubmitting}
        availableCategories={availableCategories}
        initialValues={
          editing
            ? {
                title: editing.title,
                excerpt: editing.excerpt,
                content: editing.content,
                status: editing.status,
                isFeatured: editing.isFeatured,
                categoryId: editing.category.id,
                author: editing.author,
                tags: editing.tags,
                estimatedReadTime: editing.estimatedReadTime || "",
                metaTitle: editing.metaTitle,
                metaDescription: editing.metaDescription,
                metaKeywords: editing.metaKeywords,
              }
            : undefined
        }
        initialImageUrl={editing ? editing.featuredImageUrl : undefined}
        initialAuthorImageUrl={editing ? editing.authorImageUrl : undefined}
      />
    </div>
  );
}
