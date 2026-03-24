"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { Star, Eye, Pencil, Trash2, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import TestimonialFormModal, { TestimonialFormValues } from "./TestimonialFormModal";

type Testimonial = {
	id: string;
	name: string;
	message: string;
	rating: number;
	imageUrl: string;
	isPublished: boolean;
	createdAt: string; // YYYY-MM-DD (UTC)
};

function pad2(n: number) { return String(n).padStart(2, "0"); }
function formatUTCDate(d: Date) { return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`; }
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
					className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
				/>
			))}
		</div>
	);
}

export default function AdminTestimonialsPage() {
	const BASE_UTC_MS = Date.UTC(2025, 9, 1); // 2025-10-01 UTC

	const baseTestimonials = [
		{
			id: "1",
			name: "Sarah Johnson",
			message: "The courses at Octave Nepal transformed my career. The instructors are knowledgeable and the hands-on projects helped me gain real-world experience. Highly recommended!",
			rating: 5,
			imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80"
		},
		{
			id: "2",
			name: "Michael Chen",
			message: "I completed the full-stack development course and landed my dream job. The curriculum is up-to-date and the learning platform is intuitive. Great investment in my future!",
			rating: 5,
			imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80"
		},
		{
			id: "3",
			name: "Emma Rodriguez",
			message: "The UI/UX design course was excellent. I learned modern design principles and tools that I use daily in my work. The portfolio projects really helped me stand out.",
			rating: 4,
			imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=256&q=80"
		},
		{
			id: "4",
			name: "David Kumar",
			message: "Octave Nepal's data science courses gave me the skills I needed to transition into tech. The statistics and Python modules were particularly well-structured.",
			rating: 5,
			imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80"
		},
		{
			id: "5",
			name: "Lisa Thompson",
			message: "The digital marketing course covered everything from SEO to social media marketing. The practical assignments helped me implement what I learned immediately.",
			rating: 4,
			imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=256&q=80"
		},
		{
			id: "6",
			name: "James Wilson",
			message: "The DevOps and cloud computing courses were comprehensive and practical. I now have certifications and the skills to excel in my role. Thank you Octave Nepal!",
			rating: 5,
			imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80"
		},
		{
			id: "7",
			name: "Priya Sharma",
			message: "As someone with no prior coding experience, the beginner-friendly approach at Octave Nepal was perfect. I'm now working as a developer and loving it!",
			rating: 5,
			imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
		},
		{
			id: "8",
			name: "Robert Davis",
			message: "We hired several graduates from Octave Nepal and they all perform exceptionally well. The quality of education and practical focus is outstanding.",
			rating: 5,
			imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80"
		}
	];

	const testimonials: Testimonial[] = baseTestimonials.map((t, idx) => ({
		...t,
		imageUrl: `${t.imageUrl}?auto=format&fit=crop&w=256&q=80`,
		createdAt: formatUTCDate(new Date(BASE_UTC_MS - idx * 86400000)),
		isPublished: idx % 5 !== 0, // Some testimonials are unpublished
	}));

	// Pagination state
	const [page, setPage] = React.useState(1);
	const pageSize = 10;
	const [query, setQuery] = React.useState("");
	const [statusFilter, setStatusFilter] = React.useState<"All" | "Published" | "Unpublished">("All");
	const [ratingFilter, setRatingFilter] = React.useState<"All" | "5" | "4" | "3" | "2" | "1">("All");

	// Modal state
	const [openCreate, setOpenCreate] = React.useState(false);
	const [editing, setEditing] = React.useState<Testimonial | null>(null);
	const [viewing, setViewing] = React.useState<Testimonial | null>(null);
	const [pendingDelete, setPendingDelete] = React.useState<Testimonial | null>(null);

	// Filtered testimonials
	const filteredTestimonials = testimonials.filter(testimonial => {
		const matchesQuery = !query || testimonial.name.toLowerCase().includes(query.toLowerCase()) ||
			testimonial.message.toLowerCase().includes(query.toLowerCase());
		const matchesStatus = statusFilter === "All" ||
			(statusFilter === "Published" && testimonial.isPublished) ||
			(statusFilter === "Unpublished" && !testimonial.isPublished);
		const matchesRating = ratingFilter === "All" || testimonial.rating === parseInt(ratingFilter);

		return matchesQuery && matchesStatus && matchesRating;
	});

	const totalPages = Math.ceil(filteredTestimonials.length / pageSize);
	const paginatedTestimonials = filteredTestimonials.slice((page - 1) * pageSize, page * pageSize);

	// Handle create/edit
	function handleCreate(values: TestimonialFormValues) {
		// TODO: Implement actual API call
		toast.success(`Testimonial for "${values.name}" created successfully!`);
		setOpenCreate(false);
	}

	function handleEdit(values: TestimonialFormValues) {
		if (!editing) return;
		// TODO: Implement actual API call
		toast.success(`Testimonial for "${values.name}" updated successfully!`);
		setEditing(null);
	}

	const handleView = React.useCallback((testimonial: Testimonial) => {
		setViewing(testimonial);
	}, []);

	const handleDelete = React.useCallback((testimonial: Testimonial) => {
		setPendingDelete(testimonial);
	}, []);

	const confirmDelete = React.useCallback(() => {
		if (!pendingDelete) return;
		// TODO: Implement actual API call
		toast.error(`Testimonial from ${pendingDelete.name} deleted`);
		setPendingDelete(null);
	}, [pendingDelete]);

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
				<div className="h-10 w-10 overflow-hidden rounded-full">
					<Image src={testimonial.imageUrl} alt={testimonial.name} width={40} height={40} className="h-full w-full object-cover" />
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
					<p className="text-sm text-gray-600 line-clamp-2">{testimonial.message}</p>
				</div>
			),
		},
		{
			id: "rating",
			header: "Rating",
			accessor: "rating",
			align: "center",
			cell: (testimonial) => renderStars(testimonial.rating),
		},
		{
			id: "status",
			header: "Status",
			accessor: "isPublished",
			align: "center",
			cell: (testimonial) => (
				<Badge variant="outline" className={statusBadgeClass(testimonial.isPublished)}>
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
					<Button variant="secondary" size="sm" className="gap-1 text-primary-600 border-primary-200 hover:bg-primary-50" aria-label="View" onClick={(e) => { e.stopPropagation(); handleView(testimonial); }}>
						<Eye size={16} />
					</Button>
					<Button variant="secondary" size="sm" className="gap-1" aria-label="Edit" onClick={(e) => { e.stopPropagation(); setEditing(testimonial); }}>
						<Pencil size={16} />
					</Button>
					<Button variant="secondary" size="sm" className="gap-1 text-red-600 border-red-200 hover:bg-red-50" aria-label="Delete" onClick={(e) => { e.stopPropagation(); handleDelete(testimonial); }}>
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
				<Button size="sm" onClick={() => setOpenCreate(true)}>Add Testimonial</Button>
			</div>

			{/* Filters */}
			<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-3">
				<div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
					<div className="md:col-span-5">
						<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Search</label>
						<Input
							placeholder="Search testimonials..."
							value={query}
							onChange={(e) => { setPage(1); setQuery(e.target.value); }}
						/>
					</div>
					<div className="md:col-span-3">
						<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Status</label>
						<Select value={statusFilter} onChange={(e) => { setPage(1); setStatusFilter(e.target.value as "All" | "Published" | "Unpublished"); }}>
							<option value="All">Statuses</option>
							<option value="Published">Published</option>
							<option value="Unpublished">Unpublished</option>
						</Select>
					</div>
					<div className="md:col-span-2">
						<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Rating</label>
						<Select value={ratingFilter} onChange={(e) => { setPage(1); setRatingFilter(e.target.value as "All" | "5" | "4" | "3" | "2" | "1"); }}>
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
							onClick={() => { setQuery(""); setStatusFilter("All"); setRatingFilter("All"); setPage(1); }}
						>
							<RotateCcw size={16} /> Reset
						</Button>
					</div>
				</div>
			</div>

			<Card>
				<CardContent className="p-0">
					<DataTable
						columns={columns}
						data={paginatedTestimonials}
						getRowKey={(testimonial) => testimonial.id}
						emptyMessage="No testimonials found"
					/>
					<div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4">
						<p className="text-sm text-[color:var(--color-neutral-600)]">
							Showing {filteredTestimonials.length === 0 ? 0 : (page - 1) * pageSize + 1}-{Math.min(page * pageSize, filteredTestimonials.length)} of {filteredTestimonials.length}
						</p>
						<div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
							<Button
								variant="secondary"
								size="sm"
								className="w-full sm:w-auto"
								disabled={page === 1}
								onClick={() => setPage(page - 1)}
							>
								Previous
							</Button>
							<div className="text-sm sm:hidden">{page}/{totalPages}</div>
							<div className="text-sm hidden sm:block">Page {page} of {totalPages}</div>
							<Button
								variant="secondary"
								size="sm"
								className="w-full sm:w-auto"
								disabled={page === totalPages}
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
				onClose={() => { setOpenCreate(false); setEditing(null); }}
				onSubmit={editing ? handleEdit : handleCreate}
				title={editing ? 'Edit Testimonial' : 'Add Testimonial'}
				mode={editing ? "edit" : "create"}
				initialValues={editing ? {
					name: editing.name,
					message: editing.message,
					rating: editing.rating,
					isPublished: editing.isPublished,
				} : undefined}
				initialImageUrl={editing?.imageUrl}
			/>

			{/* View Modal */}
			<Modal open={!!viewing} onClose={closeView} title={viewing ? 'Testimonial Details' : undefined}>
				{viewing && (
					<div className="space-y-6">
						{/* Header */}
						<div className="bg-gradient-to-r from-[color:var(--color-primary-50)] to-[color:var(--color-primary-25)] rounded-lg p-4 border border-[color:var(--color-primary-100)]">
							<div className="flex items-start gap-4">
								<Image src={viewing.imageUrl} alt={viewing.name} width={60} height={60} className="w-[60px] h-[60px] rounded-full object-cover flex-shrink-0" />
								<div className="flex-1">
									<h3 className="text-lg font-semibold text-[color:var(--color-neutral-900)] mb-1">
										{viewing.name}
									</h3>
									<div className="flex items-center gap-2">
										{renderStars(viewing.rating)}
										<span className="text-xs text-[color:var(--color-neutral-500)]">
											Received on {new Date(viewing.createdAt).toLocaleDateString('en-US', {
												weekday: 'long',
												year: 'numeric',
												month: 'long',
												day: 'numeric'
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
								<h4 className="text-base font-medium text-[color:var(--color-neutral-900)]">Testimonial</h4>
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
								Status: <Badge variant="outline" className={statusBadgeClass(viewing.isPublished)}>
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
			<Modal open={!!pendingDelete} onClose={cancelDelete} title={pendingDelete ? 'Delete Testimonial' : undefined}>
				{pendingDelete && (
					<div className="space-y-4 text-sm">
						<div className="text-[color:var(--color-neutral-800)]">
							Are you sure you want to delete the testimonial from
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
		</div>
	);
}
