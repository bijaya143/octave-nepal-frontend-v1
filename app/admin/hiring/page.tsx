"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { Pencil, Trash2, Eye, Users, MapPin, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import HiringFormModal, { HiringFormValues } from "./HiringFormModal";

type JobPosition = {
	id: string;
	title: string;
	department: string;
	location: string;
	type: "Full-time" | "Part-time" | "Contract" | "Internship";
	level: "Entry" | "Mid" | "Senior" | "Lead" | "Executive";
	workArrangement: "On-site" | "Remote" | "Hybrid";
	isPaid: "Paid" | "Unpaid";
	salary: string;
	numberOfPositions: number;
	startDate: string;
	endDate: string;
	status: "Open" | "Closed" | "On Hold" | "Draft";
	applicantsCount: number;
	createdAt: string; // YYYY-MM-DD
	updatedAt: string; // YYYY-MM-DD
};

function statusBadgeClass(status: JobPosition["status"]): string {
	const s = String(status).toLowerCase();
	if (s.includes("open")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
	if (s.includes("closed")) return "bg-red-50 text-red-700 border-red-200";
	if (s.includes("on hold")) return "bg-amber-50 text-amber-700 border-amber-200";
	return "bg-gray-50 text-gray-700 border-gray-200";
}

export default function AdminHiringPage() {
	const router = useRouter();

	// Pagination state
	const [page, setPage] = React.useState(1);
	const pageSize = 10;

	const jobPositions: JobPosition[] = [
		{
			id: "1",
			title: "Frontend Developer",
			department: "Engineering",
			location: "Kathmandu, Nepal",
			type: "Full-time",
			level: "Mid",
			workArrangement: "Hybrid",
			isPaid: "Paid",
			salary: "Rs 60,000 - 90,000",
			numberOfPositions: 2,
			startDate: "2024-12-01",
			endDate: "",
			status: "Open",
			applicantsCount: 12,
			createdAt: "2024-11-01",
			updatedAt: "2024-11-15",
		},
		{
			id: "2",
			title: "UI/UX Designer",
			department: "Design",
			location: "Kathmandu, Nepal",
			type: "Full-time",
			level: "Senior",
			workArrangement: "On-site",
			isPaid: "Paid",
			salary: "Rs 70,000 - 100,000",
			numberOfPositions: 1,
			startDate: "2024-12-15",
			endDate: "",
			status: "Open",
			applicantsCount: 8,
			createdAt: "2024-11-05",
			updatedAt: "2024-11-12",
		},
		{
			id: "3",
			title: "Backend Developer",
			department: "Engineering",
			location: "Kathmandu, Nepal",
			type: "Full-time",
			level: "Mid",
			workArrangement: "Remote",
			isPaid: "Paid",
			salary: "Rs 65,000 - 95,000",
			numberOfPositions: 3,
			startDate: "2024-11-20",
			endDate: "",
			status: "Open",
			applicantsCount: 15,
			createdAt: "2024-11-03",
			updatedAt: "2024-11-18",
		},
		{
			id: "4",
			title: "Marketing Manager",
			department: "Marketing",
			location: "Kathmandu, Nepal",
			type: "Full-time",
			level: "Senior",
			workArrangement: "Hybrid",
			isPaid: "Paid",
			salary: "Rs 75,000 - 110,000",
			numberOfPositions: 1,
			startDate: "2024-10-15",
			endDate: "2024-11-15",
			status: "Closed",
			applicantsCount: 6,
			createdAt: "2024-10-20",
			updatedAt: "2024-11-10",
		},
		{
			id: "5",
			title: "DevOps Engineer",
			department: "Engineering",
			location: "Kathmandu, Nepal",
			type: "Full-time",
			level: "Senior",
			workArrangement: "On-site",
			isPaid: "Paid",
			salary: "Rs 80,000 - 120,000",
			numberOfPositions: 1,
			startDate: "2024-11-01",
			endDate: "2024-11-15",
			status: "Closed",
			applicantsCount: 9,
			createdAt: "2024-10-25",
			updatedAt: "2024-11-08",
		},
		{
			id: "6",
			title: "Data Analyst",
			department: "Analytics",
			location: "Kathmandu, Nepal",
			type: "Full-time",
			level: "Mid",
			workArrangement: "Remote",
			isPaid: "Paid",
			salary: "Rs 50,000 - 75,000",
			numberOfPositions: 2,
			startDate: "2024-12-01",
			endDate: "",
			status: "On Hold",
			applicantsCount: 4,
			createdAt: "2024-11-10",
			updatedAt: "2024-11-14",
		},
		{
			id: "7",
			title: "Product Manager",
			department: "Product",
			location: "Kathmandu, Nepal",
			type: "Full-time",
			level: "Senior",
			workArrangement: "Hybrid",
			isPaid: "Paid",
			salary: "Rs 90,000 - 130,000",
			numberOfPositions: 1,
			startDate: "2024-12-01",
			endDate: "",
			status: "Open",
			applicantsCount: 7,
			createdAt: "2024-11-08",
			updatedAt: "2024-11-16",
		},
		{
			id: "8",
			title: "Content Writer",
			department: "Marketing",
			location: "Remote",
			type: "Contract",
			level: "Mid",
			workArrangement: "Remote",
			isPaid: "Paid",
			salary: "Rs 30,000 - 45,000",
			numberOfPositions: 1,
			startDate: "2024-11-20",
			endDate: "2024-12-20",
			status: "Draft",
			applicantsCount: 0,
			createdAt: "2024-11-15",
			updatedAt: "2024-11-15",
		},
		{
			id: "9",
			title: "Community Volunteer",
			department: "Community",
			location: "Kathmandu, Nepal",
			type: "Part-time",
			level: "Entry",
			workArrangement: "On-site",
			isPaid: "Unpaid",
			salary: "",
			numberOfPositions: 5,
			startDate: "2024-11-15",
			endDate: "",
			status: "Open",
			applicantsCount: 3,
			createdAt: "2024-11-12",
			updatedAt: "2024-11-12",
		},
	];

	// Pagination calculation
	const totalPages = Math.ceil(jobPositions.length / pageSize);
	const paginatedPositions = jobPositions.slice((page - 1) * pageSize, page * pageSize);

	// Modal state
	const [openCreate, setOpenCreate] = React.useState(false);
	const [editing, setEditing] = React.useState<JobPosition | null>(null);
	const [pendingDelete, setPendingDelete] = React.useState<JobPosition | null>(null);

	// Handle create/edit
	function handleCreate(values: HiringFormValues) {
		// TODO: Implement actual API call
		toast.success(`Job position "${values.title}" created successfully!`);
		setOpenCreate(false);
	}

	function handleEdit(values: HiringFormValues) {
		if (!editing) return;
		// TODO: Implement actual API call
		toast.success(`Job position "${values.title}" updated successfully!`);
		setEditing(null);
	}

	const handleDelete = React.useCallback((position: JobPosition) => {
		setPendingDelete(position);
	}, []);

	const confirmDelete = React.useCallback(() => {
		if (!pendingDelete) return;
		// TODO: Implement actual API call
		toast.error(`Job position deleted: ${pendingDelete.title}`);
		setPendingDelete(null);
	}, [pendingDelete]);

	const cancelDelete = React.useCallback(() => {
		setPendingDelete(null);
	}, []);

	const columns: Array<DataTableColumn<JobPosition>> = [
		{
			id: "title",
			header: "Position",
			accessor: "title",
			cell: (position) => (
				<div>
					<div className="font-medium text-gray-900">{position.title}</div>
					<div className="text-sm text-gray-500">{position.department}</div>
				</div>
			),
		},
		{
			id: "details",
			header: "Details",
			accessor: (position) => `${position.type} ${position.level} ${position.workArrangement}`,
			cell: (position) => (
				<div className="space-y-1">
					<div className="flex items-center gap-1 text-sm">
						<Briefcase size={12} className="text-gray-400" />
						<span className="text-gray-600">{position.type} • {position.level}</span>
					</div>
					<div className="flex items-center gap-1 text-sm">
						<MapPin size={12} className="text-gray-400" />
						<span className="text-gray-600">{position.workArrangement} • {position.location}</span>
					</div>
				</div>
			),
		},
		{
			id: "duration",
			header: "Duration",
			accessor: "startDate",
			cell: (position) => {
				const startDate = position.startDate ? new Date(position.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD';
				const endDate = position.endDate ? new Date(position.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Ongoing';
				return (
					<span className="text-sm font-medium text-gray-900">
						{startDate} - {endDate}
					</span>
				);
			},
		},
		{
			id: "applicants",
			header: "Applicants",
			accessor: "applicantsCount",
			cell: (position) => (
				<div className="flex items-center gap-1">
					<Users size={14} className="text-gray-400" />
					<span className="text-sm font-medium text-gray-900">{position.applicantsCount}</span>
				</div>
			),
		},
		{
			id: "status",
			header: "Status",
			accessor: "status",
			cell: (position) => (
				<Badge variant="outline" className={statusBadgeClass(position.status)}>
					{position.status}
				</Badge>
			),
		},
		{
			id: "actions",
			header: "Actions",
			align: "center",
			accessor: (position) => "",
			cell: (position) => (
				<div className="flex items-center justify-center gap-2">
					<Button
						variant="secondary"
						size="sm"
						className="gap-1"
						aria-label="Edit"
						onClick={(e) => {
							e.stopPropagation();
							setEditing(position);
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
							handleDelete(position);
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
					<h1 className="text-xl sm:text-2xl font-semibold">Job Positions</h1>
				</div>
				<Button size="sm" onClick={() => setOpenCreate(true)}>Create Position</Button>
			</div>

			<Card>
				<CardContent className="p-0">
					<DataTable
						columns={columns}
						data={paginatedPositions}
						getRowKey={(position) => position.id}
						emptyMessage="No job positions found"
                        onRowClick={(position) => router.push(`/admin/hiring/${position.id}`)}
					/>
					<div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4">
						<p className="text-sm text-[color:var(--color-neutral-600)]">
							Showing {jobPositions.length === 0 ? 0 : (page - 1) * pageSize + 1}-{Math.min(page * pageSize, jobPositions.length)} of {jobPositions.length}
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

			{/* Modals */}
			<HiringFormModal
				open={openCreate}
				onClose={() => setOpenCreate(false)}
				onSubmit={handleCreate}
				mode="create"
			/>
			<HiringFormModal
				open={!!editing}
				onClose={() => setEditing(null)}
				onSubmit={handleEdit}
				mode="edit"
				initialValues={editing ? {
					title: editing.title,
					department: editing.department,
					location: editing.location,
					type: editing.type,
					level: editing.level,
					workArrangement: editing.workArrangement,
					isPaid: editing.isPaid,
					salary: editing.salary,
					numberOfPositions: editing.numberOfPositions,
					startDate: "", // Would need to be fetched from API
					endDate: "", // Would need to be fetched from API
					description: "", // Would need to be fetched from API
					requirements: [], // Would need to be fetched from API
					status: editing.status,
				} : undefined}
			/>

			{/* Delete Confirmation Modal */}
			<Modal open={!!pendingDelete} onClose={cancelDelete} title={pendingDelete ? 'Delete Job Position' : undefined}>
				{pendingDelete && (
					<div className="space-y-4 text-sm">
						<div className="text-[color:var(--color-neutral-800)]">
							Are you sure you want to delete the job position
							<span className="font-medium"> {pendingDelete.title} </span>
							in <span className="font-medium">{pendingDelete.department}</span>?
							This will also delete all associated applications. This action cannot be undone.
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
