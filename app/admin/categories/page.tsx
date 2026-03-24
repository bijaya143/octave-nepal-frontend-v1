"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { CheckCircle2, XCircle, Eye, Pencil, Trash2, RotateCcw } from "lucide-react";
import Image from "next/image";
import CategoryFormModal, { CategoryFormValues } from "./CategoryFormModal";
import CategoryViewModal from "./CategoryViewModal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { toast } from "sonner";
import { adminCategoryService, CreateCategoryInput, UpdateCategoryInput } from "@/lib/services/admin/category";
import { Category as CategoryType, AdminCategoryFilterInput } from "@/lib/services/admin/types";


// UI Type matching service
type Category = {
	id: string;
	name: string;
	slug: string;
	description: string;
	imageUrl: string;
	iconUrl: string;
	isPublished: boolean;
	popularity: number;
	courseCount: number;
	learnerCount: number;
	tagsCount: number;
	tags: { id: string; name: string }[];
	createdAt: string;
	updatedAt: string;
};

function statusBadgeClass(isPublished: boolean): string {
	return isPublished
		? "bg-emerald-50 text-emerald-700 border-emerald-200"
		: "bg-gray-50 text-gray-700 border-gray-200";
}

export default function AdminCategoriesPage() {
	const [categories, setCategories] = React.useState<Category[]>([]);
	const [pagination, setPagination] = React.useState<{ page: number; limit: number; total: number } | null>(null);
	const [isLoading, setIsLoading] = React.useState(false);
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const [page, setPage] = React.useState(1);
	const pageSize = 10;
	const [refreshKey, setRefreshKey] = React.useState(0);

	// Filter states
	const [query, setQuery] = React.useState("");
	const [statusFilter, setStatusFilter] = React.useState<"All" | "Published" | "Unpublished">("All");

	const fetchCategories = React.useCallback(async () => {
		try {
			setIsLoading(true);
			const filters: AdminCategoryFilterInput = {
				page,
				limit: pageSize,
				keyword: query || undefined,
				isPublished: statusFilter === "All" ? undefined : statusFilter === "Published",
			};

			const response = await adminCategoryService.list(filters);
			
			if (response.success) {
				const transformed: Category[] = response.data.data.map((item: CategoryType) => ({
					id: item.id,
					name: item.name,
					slug: item.slug,
					description: item.description || "",
					imageUrl: item.imageKey ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${item.imageKey}` : "",
					iconUrl: item.iconKey ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${item.iconKey}` : "",
					isPublished: item.isPublished,
					popularity: item.popularityCount,
					courseCount: item.courseCount,
					learnerCount: item.studentCount,
					tagsCount: item.tagCount,
					tags: item.categoryToTags?.map((ct) => ({ id: ct.tag.id, name: ct.tag.name })) || [],
					createdAt: new Date(item.createdAt).toISOString().split('T')[0],
					updatedAt: new Date(item.updatedAt).toISOString().split('T')[0],
				}));
				setCategories(transformed);
				setPagination(response.data.meta);
			}
		} catch (error) {
			setError(error instanceof Error ? error.message : "Failed to fetch categories");
		} finally {
			setIsLoading(false);
		}
	}, [page, pageSize, query, statusFilter]);

	React.useEffect(() => {
		fetchCategories();
	}, [fetchCategories, refreshKey]);

	const [selected, setSelected] = React.useState<Category | null>(null);
	const [openCreate, setOpenCreate] = React.useState(false);
	const [editing, setEditing] = React.useState<Category | null>(null);
	const [pendingDelete, setPendingDelete] = React.useState<Category | null>(null);

	const handleCreate = async (values: CategoryFormValues) => {
		if (!values.image) {
			toast.error("Image is required");
			return;
		}

		try {
			setIsSubmitting(true);
			const input: CreateCategoryInput = {
				name: values.name,
				slug: values.slug,
				description: values.description,
				image: values.image,
				icon: values.icon || undefined,
				isPublished: values.isPublished,
				tagIds: values.tags.map(t => t.id),
			};

			await adminCategoryService.create(input);
			toast.success("Category created successfully");
			setOpenCreate(false);
			setRefreshKey((k) => k + 1);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to create category");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleEdit = async (values: CategoryFormValues) => {
		if (!editing) return;

		try {
			setIsSubmitting(true);
			const input: UpdateCategoryInput = {
				id: editing.id,
				name: values.name,
				slug: values.slug,
				description: values.description,
				isPublished: values.isPublished,
				tagIds: values.tags.map(t => t.id),
			};

			if (values.image) input.image = values.image;
			if (values.icon) input.icon = values.icon;

			await adminCategoryService.update(input);
			toast.success("Category updated successfully");
			setEditing(null);
			setRefreshKey((k) => k + 1);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to update category");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = (category: Category) => {
		setPendingDelete(category);
	};

	const confirmDelete = async () => {
		if (!pendingDelete) return;
		try {
			await adminCategoryService.delete(pendingDelete.id);
			toast.success("Category deleted successfully");
			setPendingDelete(null);
			setRefreshKey((k) => k + 1);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to delete category");
		}
	};

	const cancelDelete = () => {
		setPendingDelete(null);
	};

	const columns: Array<DataTableColumn<Category>> = [
		{ id: "name", header: "Name", accessor: "name" },
		{ id: "imageUrl", header: "Image", accessor: (row) => (
			<div className="h-12 w-12 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
				{row.imageUrl ? (
					<Image src={row.imageUrl} alt={row.name} width={48} height={48} className="h-full w-full object-cover" unoptimized />
				) : (
					<span className="text-xs text-gray-400">No Img</span>
				)}
			</div>
		)},
		{ id: "iconUrl", header: "Icon", accessor: (row) => (
			<div className="h-12 w-12 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
				{row.iconUrl ? (
					<Image src={row.iconUrl} alt={`${row.name} icon`} width={48} height={48} className="h-full w-full object-cover" unoptimized />
				) : (
					<span className="text-xs text-gray-400">No Icon</span>
				)}
			</div>
		)},
		{
			id: "status",
			header: "Status",
			cell: (row) => (
				<Badge variant="outline" className={statusBadgeClass(row.isPublished)}>
					<span className="inline-flex items-center gap-1">
						{row.isPublished ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
						{row.isPublished ? "Published" : "Unpublished"}
					</span>
				</Badge>
			),
			cellClassName: "whitespace-nowrap",
		},
		{ id: "popularity", header: "Popularity", accessor: (row) => row.popularity, cellClassName: "whitespace-nowrap" },
		{ id: "courseCount", header: "Courses", accessor: (row) => row.courseCount, cellClassName: "whitespace-nowrap" },
		{ id: "tagsCount", header: "Tags", accessor: (row) => row.tagsCount, cellClassName: "whitespace-nowrap" },
		{ id: "learnerCount", header: "Learners", accessor: (row) => row.learnerCount, cellClassName: "whitespace-nowrap" },
		{
			id: "actions",
			header: "Actions",
			align: "center",
			cell: (row) => (
				<div className="flex items-center justify-center gap-2">
					<Button variant="secondary" size="sm" className="gap-1 text-primary-600 border-primary-200 hover:bg-primary-50" aria-label="View" onClick={() => setSelected(row)}>
						<Eye size={16} />
					</Button>
					<Button variant="secondary" size="sm" className="gap-1" aria-label="Edit" onClick={() => setEditing(row)}>
						<Pencil size={16} />
					</Button>
					<Button variant="secondary" size="sm" className="gap-1 text-red-600 border-red-200 hover:bg-red-50" aria-label="Delete" onClick={() => handleDelete(row)}>
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
					<h1 className="text-xl sm:text-2xl font-semibold">Categories</h1>
				</div>
				<Button size="sm" onClick={() => setOpenCreate(true)}>Add Category</Button>
			</div>

			{/* Filters */}
			<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-3">
				<div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
					<div className="md:col-span-5">
						<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Search</label>
						<Input
							placeholder="Search categories..."
							value={query}
							onChange={(e) => { setPage(1); setQuery(e.target.value); }}
						/>
					</div>
					<div className="md:col-span-3">
						<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Status</label>
						<Select value={statusFilter} onChange={(e) => { setPage(1); setStatusFilter(e.target.value as any); }}>
							<option value="All">All statuses</option>
							<option value="Published">Published</option>
							<option value="Unpublished">Unpublished</option>
						</Select>
					</div>
					<div className="md:col-span-4 flex md:justify-end">
						<Button
							variant="secondary"
							className="w-full md:w-auto inline-flex items-center gap-2 text-primary-600 border-primary-200 hover:bg-primary-50"
							size="md"
							onClick={() => { setQuery(""); setStatusFilter("All"); setPage(1); }}
						>
							<RotateCcw size={16} /> Reset
						</Button>
					</div>
				</div>
			</div>

			<Card>
				<CardContent className="py-0">
					<DataTable<Category>
						data={categories}
						columns={columns}
						getRowKey={(row) => row.id}
						emptyMessage={isLoading ? "Loading categories..." : "No categories found."}
					/>
					<div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4">
						<p className="text-sm text-[color:var(--color-neutral-600)]">
							Showing {categories.length} of {pagination?.total || 0}
						</p>
						<div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
							<Button
								variant="secondary"
								size="sm"
								className="w-full sm:w-auto"
								disabled={page === 1 || isLoading}
								onClick={() => setPage(p => Math.max(1, p - 1))}
							>
								Previous
							</Button>
							<div className="text-sm hidden sm:block">Page {page} of {Math.ceil((pagination?.total || 0) / pageSize) || 1}</div>
							<Button
								variant="secondary"
								size="sm"
								className="w-full sm:w-auto"
								disabled={!pagination || page >= Math.ceil(pagination.total / pageSize) || isLoading}
								onClick={() => setPage(p => p + 1)}
							>
								Next
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
			<Modal open={!!pendingDelete} onClose={cancelDelete} title={pendingDelete ? 'Delete Category' : undefined}>
				{pendingDelete && (
					<div className="space-y-4 text-sm">
						<div className="text-[color:var(--color-neutral-800)]">
							Are you sure you want to delete
							<span className="font-medium"> {pendingDelete.name} </span>?
							This action cannot be undone.
						</div>
						<div className="flex items-center justify-end gap-2">
							<Button variant="secondary" onClick={cancelDelete}>Cancel</Button>
							<Button variant="secondary" className="text-red-600 border-red-200 hover:bg-red-50" onClick={confirmDelete}>Delete</Button>
						</div>
					</div>
				)}
			</Modal>
			<CategoryViewModal category={selected} onClose={() => setSelected(null)} />
			<CategoryFormModal
				open={openCreate}
				onClose={() => setOpenCreate(false)}
				onSubmit={handleCreate}
				title="Create Category"
				mode="create"
				isLoading={isSubmitting}
			/>
			<CategoryFormModal
				open={!!editing}
				onClose={() => setEditing(null)}
				onSubmit={handleEdit}
				title="Edit Category"
				mode="edit"
				initialValues={editing ? {
					name: editing.name,
					slug: editing.slug,
					description: editing.description,
					isPublished: editing.isPublished,
					tags: editing.tags,
				} : undefined}
				initialImageUrl={editing ? editing.imageUrl : undefined}
				initialIconUrl={editing ? editing.iconUrl : undefined}
				isLoading={isSubmitting}
			/>
		</div>
	);
}


