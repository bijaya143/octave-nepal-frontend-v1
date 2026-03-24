"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { CheckCircle2, XCircle, Eye, Pencil, Trash2, RotateCcw } from "lucide-react";
import Image from "next/image";
import BlogCategoryFormModal, { BlogCategoryFormValues } from "./BlogCategoryFormModal";
import BlogCategoryViewModal from "./BlogCategoryViewModal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { toast } from "sonner";

type BlogCategory = {
	id: string;
	name: string;
	slug: string;
	imageUrl: string;
	description: string;
	createdAt: string; // YYYY-MM-DD (UTC)
	updatedAt: string; // YYYY-MM-DD (UTC)
	isPublished: boolean;
	postCount: number;
};

function pad2(n: number) { return String(n).padStart(2, "0"); }
function formatUTCDate(d: Date) { return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`; }
function categoryBadgeClass(isPublished: boolean): string {
	return isPublished
		? "bg-emerald-50 text-emerald-700 border-emerald-200"
		: "bg-gray-50 text-gray-700 border-gray-200";
}

export default function AdminBlogCategoriesPage() {
	const baseCategories = [
		{ id: "1", name: "Technology", slug: "technology", imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475", postCount: 15 },
		{ id: "2", name: "Web Development", slug: "web-development", imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085", postCount: 23 },
		{ id: "3", name: "Data Science", slug: "data-science", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71", postCount: 18 },
		{ id: "4", name: "Mobile Development", slug: "mobile-development", imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c", postCount: 12 },
		{ id: "5", name: "DevOps", slug: "devops", imageUrl: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9", postCount: 9 },
		{ id: "6", name: "AI & Machine Learning", slug: "ai-machine-learning", imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995", postCount: 14 },
		{ id: "7", name: "Cybersecurity", slug: "cybersecurity", imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b", postCount: 8 },
		{ id: "8", name: "Cloud Computing", slug: "cloud-computing", imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8", postCount: 11 },
		{ id: "9", name: "Programming Languages", slug: "programming-languages", imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3", postCount: 20 },
		{ id: "10", name: "Career Advice", slug: "career-advice", imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d", postCount: 7 },
	];

	const BASE_UTC_MS = Date.UTC(2025, 9, 1); // 2025-10-01 UTC
	const categories: BlogCategory[] = baseCategories.map((c, idx) => {
		const created = new Date(BASE_UTC_MS - idx * 86400000);
		const updated = new Date(BASE_UTC_MS + 86400000 - idx * 86400000);
		return {
			...c,
			description: `${c.name} related blog posts and articles`,
			createdAt: formatUTCDate(created),
			updatedAt: formatUTCDate(updated),
			isPublished: idx % 5 === 0 ? false : true,
		};
	});

	const [page, setPage] = React.useState(1);
	const pageSize = 10;
	const [query, setQuery] = React.useState("");
	const [statusFilter, setStatusFilter] = React.useState<"All" | "Published" | "Unpublished">("All");

	const filteredCategories = React.useMemo(() => {
		const q = query.trim().toLowerCase();
		return categories.filter((c) => {
			const matchesQuery = q === "" || c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
			const matchesStatus = statusFilter === "All" || (statusFilter === "Published" ? c.isPublished : !c.isPublished);
			return matchesQuery && matchesStatus;
		});
	}, [categories, query, statusFilter]);

	const total = filteredCategories.length;
	const pageCount = Math.max(1, Math.ceil(total / pageSize));
	const currentPage = Math.min(Math.max(1, page), pageCount);
	const start = (currentPage - 1) * pageSize;
	const end = Math.min(start + pageSize, total);
	const pagedCategories = filteredCategories.slice(start, end);

	const nextPage = () => setPage((p) => Math.min(p + 1, pageCount));
	const prevPage = () => setPage((p) => Math.max(p - 1, 1));
	const [selected, setSelected] = React.useState<BlogCategory | null>(null);
	const [openCreate, setOpenCreate] = React.useState(false);
	const [editing, setEditing] = React.useState<BlogCategory | null>(null);
	const [pendingDelete, setPendingDelete] = React.useState<BlogCategory | null>(null);

	const handleCreate = React.useCallback((values: BlogCategoryFormValues) => {
		toast.success(`Blog category created: ${values.name}`);
		setOpenCreate(false);
	}, []);

	const handleEdit = React.useCallback((values: BlogCategoryFormValues) => {
		toast.info(`Blog category updated: ${values.name}`);
		setEditing(null);
	}, []);

	const handleDelete = React.useCallback((category: BlogCategory) => {
		setPendingDelete(category);
	}, []);

	const confirmDelete = React.useCallback(() => {
		if (!pendingDelete) return;
		toast.error(`Blog category deleted: ${pendingDelete.name}`);
		setPendingDelete(null);
	}, [pendingDelete]);

	const cancelDelete = React.useCallback(() => {
		setPendingDelete(null);
	}, []);

	const columns: Array<DataTableColumn<BlogCategory>> = [
		{ id: "name", header: "Name", accessor: "name" },
		{ id: "imageUrl", header: "Image", accessor: (row) => (
			<div className="h-12 w-12 overflow-hidden rounded-md">
				<Image src={row.imageUrl} alt={row.name} width={48} height={48} className="h-full w-full object-cover" />
			</div>
		)},
		{
			id: "status",
			header: "Status",
			cell: (row) => (
				<Badge variant="outline" className={categoryBadgeClass(row.isPublished)}>
					<span className="inline-flex items-center gap-1">
						{row.isPublished ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
						{row.isPublished ? "Published" : "Unpublished"}
					</span>
				</Badge>
			),
			cellClassName: "whitespace-nowrap",
		},
		{ id: "postCount", header: "Posts", accessor: (row) => row.postCount, cellClassName: "whitespace-nowrap" },
		{ id: "createdAt", header: "Created", accessor: (row) => row.createdAt, cellClassName: "whitespace-nowrap" },
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
					<h1 className="text-xl sm:text-2xl font-semibold">Blog Categories</h1>
				</div>
				<Button size="sm" onClick={() => setOpenCreate(true)}>Add Category</Button>
			</div>

			{/* Filters */}
			<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-3">
				<div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
					<div className="md:col-span-7">
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
					<div className="md:col-span-2 flex md:justify-end">
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
					<DataTable<BlogCategory>
						data={pagedCategories}
						columns={columns}
						getRowKey={(row) => row.id}
						emptyMessage="No blog categories found."
					/>
					<div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4">
						<p className="text-sm text-[color:var(--color-neutral-600)]">
							Showing {total === 0 ? 0 : start + 1}-{end} of {total}
						</p>
						<div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
							<Button
								variant="secondary"
								size="sm"
								className="w-full sm:w-auto"
								disabled={currentPage === 1}
								onClick={prevPage}
							>
								Previous
							</Button>
							<div className="text-sm sm:hidden">{currentPage}/{pageCount}</div>
							<div className="text-sm hidden sm:block">Page {currentPage} of {pageCount}</div>
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
				</CardContent>
			</Card>
			<Modal open={!!pendingDelete} onClose={cancelDelete} title={pendingDelete ? 'Delete Blog Category' : undefined}>
				{pendingDelete && (
					<div className="space-y-4 text-sm">
						<div className="text-[color:var(--color-neutral-800)]">
							Are you sure you want to delete
							<span className="font-medium"> {pendingDelete.name} </span>? This will also remove this category from all associated blog posts.
							This action cannot be undone.
						</div>
						<div className="flex items-center justify-end gap-2">
							<Button variant="secondary" onClick={cancelDelete}>Cancel</Button>
							<Button variant="secondary" className="text-red-600 border-red-200 hover:bg-red-50" onClick={confirmDelete}>Delete</Button>
						</div>
					</div>
				)}
			</Modal>
			<BlogCategoryViewModal category={selected} onClose={() => setSelected(null)} />
			<BlogCategoryFormModal
				open={openCreate}
				onClose={() => setOpenCreate(false)}
				onSubmit={handleCreate}
				title="Create Blog Category"
				mode="create"
			/>
			<BlogCategoryFormModal
				open={!!editing}
				onClose={() => setEditing(null)}
				onSubmit={handleEdit}
				title="Edit Blog Category"
				mode="edit"
				initialValues={editing ? {
					name: editing.name,
					slug: editing.slug,
					description: editing.description,
					isPublished: editing.isPublished,
				} : undefined}
				initialImageUrl={editing ? editing.imageUrl : undefined}
			/>
		</div>
	);
}
