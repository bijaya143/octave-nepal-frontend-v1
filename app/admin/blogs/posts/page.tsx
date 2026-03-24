"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { CheckCircle2, XCircle, Eye, Pencil, Trash2, RotateCcw, Star } from "lucide-react";
import Image from "next/image";
import BlogPostFormModal, { BlogPostFormValues } from "./BlogPostFormModal";
import BlogPostViewModal from "./BlogPostViewModal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { toast } from "sonner";

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
	category: BlogCategory;
	tags: string[];
	status: "unpublished" | "published";
	isFeatured: boolean;
	viewCount: number;
	createdAt: string; // YYYY-MM-DD (UTC)
	updatedAt: string; // YYYY-MM-DD (UTC)
	publishedAt: string | null; // YYYY-MM-DD (UTC)
};

function pad2(n: number) { return String(n).padStart(2, "0"); }
function formatUTCDate(d: Date) { return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`; }

function statusBadgeClass(status: BlogPost["status"]): string {
	switch (status) {
		case "published": return "bg-emerald-50 text-emerald-700 border-emerald-200";
		case "unpublished": return "bg-gray-50 text-gray-700 border-gray-200";
		default: return "bg-gray-50 text-gray-700 border-gray-200";
	}
}

function statusIcon(status: BlogPost["status"]) {
	switch (status) {
		case "published": return <CheckCircle2 size={14} />;
		case "unpublished": return <XCircle size={14} />;
		default: return <XCircle size={14} />;
	}
}

export default function AdminBlogPostsPage() {
	const availableCategories: BlogCategory[] = [
		{ id: "1", name: "Technology" },
		{ id: "2", name: "Web Development" },
		{ id: "3", name: "Data Science" },
		{ id: "4", name: "Mobile Development" },
		{ id: "5", name: "DevOps" },
	];

	const basePosts = [
		{
			id: "1",
			title: "Getting Started with React 18",
			slug: "getting-started-with-react-18",
			excerpt: "Learn the new features in React 18 and how to migrate your existing applications.",
			content: "React 18 brings several exciting new features...",
			featuredImageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
			author: "Team Octave",
			categoryId: "2",
			tags: ["JavaScript", "React"],
			status: "published" as const,
			isFeatured: true,
			viewCount: 1250,
		},
		{
			id: "2",
			title: "Machine Learning Fundamentals",
			slug: "machine-learning-fundamentals",
			excerpt: "A comprehensive guide to understanding machine learning concepts and algorithms.",
			content: "Machine learning is a subset of AI...",
			featuredImageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop",
			author: "Dr. Sarah Chen",
			categoryId: "3",
			tags: ["Python"],
			status: "published" as const,
			isFeatured: false,
			viewCount: 890,
		},
		{
			id: "3",
			title: "Building Scalable APIs with Node.js",
			slug: "building-scalable-apis-nodejs",
			excerpt: "Best practices for creating robust and scalable REST APIs using Node.js and Express.",
			content: "When building APIs, scalability is crucial...",
			featuredImageUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
			author: "Team Octave",
			categoryId: "2",
			tags: ["JavaScript", "Node.js"],
			status: "unpublished" as const,
			isFeatured: false,
			viewCount: 0,
		},
		{
			id: "4",
			title: "Cloud Architecture Patterns",
			slug: "cloud-architecture-patterns",
			excerpt: "Explore common patterns and best practices for designing cloud-native applications.",
			content: "Cloud architecture has evolved significantly...",
			featuredImageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
			author: "Mike Johnson",
			categoryId: "5",
			tags: ["DevOps", "Cloud"],
			status: "unpublished" as const,
			isFeatured: true,
			viewCount: 0,
		},
		{
			id: "5",
			title: "Mobile App Development Trends 2025",
			slug: "mobile-app-development-trends-2025",
			excerpt: "Stay ahead of the curve with the latest trends in mobile app development.",
			content: "The mobile app landscape is constantly evolving...",
			featuredImageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
			author: "Jane Smith",
			categoryId: "4",
			tags: ["JavaScript", "React"],
			status: "published" as const,
			isFeatured: false,
			viewCount: 2100,
		},
	];

	const BASE_UTC_MS = Date.UTC(2025, 9, 1); // 2025-10-01 UTC
	const posts: BlogPost[] = basePosts.map((p, idx) => {
		const created = new Date(BASE_UTC_MS - idx * 86400000);
		const updated = new Date(BASE_UTC_MS + 86400000 - idx * 86400000);
		const published = p.status === "published" ? new Date(BASE_UTC_MS - idx * 172800000) : null; // 2 days ago if published

		return {
			...p,
			category: availableCategories.find(c => c.id === p.categoryId)!,
			createdAt: formatUTCDate(created),
			updatedAt: formatUTCDate(updated),
			publishedAt: published ? formatUTCDate(published) : null,
		};
	});

	const [page, setPage] = React.useState(1);
	const pageSize = 10;
	const [query, setQuery] = React.useState("");
	const [statusFilter, setStatusFilter] = React.useState<"All" | "Published" | "Unpublished">("All");
	const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
	const [authorFilter, setAuthorFilter] = React.useState<string>("");

	const filteredPosts = React.useMemo(() => {
		const q = query.trim().toLowerCase();
		return posts.filter((p) => {
			const matchesQuery = q === "" || p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.author.toLowerCase().includes(q);
			const matchesStatus = statusFilter === "All" || (statusFilter === "Published" ? p.status === "published" : statusFilter === "Unpublished" ? p.status === "unpublished" : false);
			const matchesCategory = categoryFilter === "all" || p.category.id === categoryFilter;
			const matchesAuthor = authorFilter === "" || p.author.toLowerCase().includes(authorFilter.toLowerCase());
			return matchesQuery && matchesStatus && matchesCategory && matchesAuthor;
		});
	}, [posts, query, statusFilter, categoryFilter, authorFilter]);

	const total = filteredPosts.length;
	const pageCount = Math.max(1, Math.ceil(total / pageSize));
	const currentPage = Math.min(Math.max(1, page), pageCount);
	const start = (currentPage - 1) * pageSize;
	const end = Math.min(start + pageSize, total);
	const pagedPosts = filteredPosts.slice(start, end);

	const nextPage = () => setPage((p) => Math.min(p + 1, pageCount));
	const prevPage = () => setPage((p) => Math.max(p - 1, 1));
	const [selected, setSelected] = React.useState<BlogPost | null>(null);
	const [openCreate, setOpenCreate] = React.useState(false);
	const [editing, setEditing] = React.useState<BlogPost | null>(null);
	const [pendingDelete, setPendingDelete] = React.useState<BlogPost | null>(null);

	const handleCreate = React.useCallback((values: BlogPostFormValues) => {
		toast.success(`Blog post created: ${values.title}`);
		setOpenCreate(false);
	}, []);

	const handleEdit = React.useCallback((values: BlogPostFormValues) => {
		toast.info(`Blog post updated: ${values.title}`);
		setEditing(null);
	}, []);

	const handleDelete = React.useCallback((post: BlogPost) => {
		setPendingDelete(post);
	}, []);

	const confirmDelete = React.useCallback(() => {
		if (!pendingDelete) return;
		toast.error(`Blog post deleted: ${pendingDelete.title}`);
		setPendingDelete(null);
	}, [pendingDelete]);

	const cancelDelete = React.useCallback(() => {
		setPendingDelete(null);
	}, []);

	const columns: Array<DataTableColumn<BlogPost>> = [
		{ id: "featuredImageUrl", header: "Image", accessor: (row) => (
			<div className="h-12 w-12 overflow-hidden rounded-md">
				<Image src={row.featuredImageUrl} alt={row.title} width={48} height={48} className="h-full w-full object-cover" />
			</div>
		)},
		{
			id: "title",
			header: "Title",
			accessor: (row) => (
				<div className="max-w-xs">
					<div className="font-medium text-[color:var(--color-neutral-900)] truncate" title={row.title}>{row.title}</div>
				</div>
			),
		},
		{
			id: "author",
			header: "Author",
			accessor: (row) => row.author,
			cellClassName: "whitespace-nowrap",
		},
		{ id: "category", header: "Category", accessor: (row) => row.category.name, cellClassName: "whitespace-nowrap" },
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
					{row.isFeatured && (
						<Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
							<span className="inline-flex items-center gap-1">
								<Star size={12} className="text-amber-700" />
								Featured
							</span>
						</Badge>
					)}
				</div>
			),
			cellClassName: "whitespace-nowrap",
		},
		{ id: "publishedAt", header: "Published", accessor: (row) => row.publishedAt || "-", cellClassName: "whitespace-nowrap" },
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
					<h1 className="text-xl sm:text-2xl font-semibold">Blog Posts</h1>
				</div>
				<Button size="sm" onClick={() => setOpenCreate(true)}>Add Post</Button>
			</div>

			{/* Filters */}
			<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-3">
				<div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
					<div className="md:col-span-4">
						<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Search</label>
						<Input
							placeholder="Search posts, authors..."
							value={query}
							onChange={(e) => { setPage(1); setQuery(e.target.value); }}
						/>
					</div>
					<div className="md:col-span-2">
						<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Status</label>
						<Select value={statusFilter} onChange={(e) => { setPage(1); setStatusFilter(e.target.value as any); }}>
							<option value="All">All statuses</option>
							<option value="Published">Published</option>
							<option value="Unpublished">Unpublished</option>
						</Select>
					</div>
					<div className="md:col-span-3">
						<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Category</label>
						<Select value={categoryFilter} onChange={(e) => { setPage(1); setCategoryFilter(e.target.value); }}>
							<option value="all">All categories</option>
							{availableCategories.map((c) => (
								<option key={c.id} value={c.id}>{c.name}</option>
							))}
						</Select>
					</div>
					<div className="md:col-span-3 flex md:justify-end">
						<Button
							variant="secondary"
							className="w-full md:w-auto inline-flex items-center gap-2 text-primary-600 border-primary-200 hover:bg-primary-50"
							size="md"
							onClick={() => { setQuery(""); setStatusFilter("All"); setCategoryFilter("all"); setAuthorFilter(""); setPage(1); }}
						>
							<RotateCcw size={16} /> Reset
						</Button>
					</div>
				</div>
			</div>

			<Card>
				<CardContent className="py-0">
					<DataTable<BlogPost>
						data={pagedPosts}
						columns={columns}
						getRowKey={(row) => row.id}
						emptyMessage="No blog posts found."
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
			<Modal open={!!pendingDelete} onClose={cancelDelete} title={pendingDelete ? 'Delete Blog Post' : undefined}>
				{pendingDelete && (
					<div className="space-y-4 text-sm">
						<div className="text-[color:var(--color-neutral-800)]">
							Are you sure you want to delete
							<span className="font-medium"> {pendingDelete.title} </span>? This will permanently remove the post and all associated comments.
							This action cannot be undone.
						</div>
						<div className="flex items-center justify-end gap-2">
							<Button variant="secondary" onClick={cancelDelete}>Cancel</Button>
							<Button variant="secondary" className="text-red-600 border-red-200 hover:bg-red-50" onClick={confirmDelete}>Delete</Button>
						</div>
					</div>
				)}
			</Modal>
			<BlogPostViewModal post={selected} onClose={() => setSelected(null)} />
			<BlogPostFormModal
				open={openCreate}
				onClose={() => setOpenCreate(false)}
				onSubmit={handleCreate}
				title="Create Blog Post"
				mode="create"
				availableCategories={availableCategories}
			/>
			<BlogPostFormModal
				open={!!editing}
				onClose={() => setEditing(null)}
				onSubmit={handleEdit}
				title="Edit Blog Post"
				mode="edit"
				initialValues={editing ? {
					title: editing.title,
					slug: editing.slug,
					excerpt: editing.excerpt,
					content: editing.content,
					status: editing.status,
					isFeatured: editing.isFeatured,
					categoryId: editing.category.id,
					author: editing.author,
					tags: editing.tags,
				} : undefined}
				initialImageUrl={editing ? editing.featuredImageUrl : undefined}
				availableCategories={availableCategories}
			/>
		</div>
	);
}
