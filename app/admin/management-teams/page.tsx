"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import Modal from "@/components/ui/Modal";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import ManagementTeamFormModal, { ManagementTeamFormValues } from "./ManagementTeamFormModal";

type TeamMember = {
	id: string;
	name: string;
	position: string;
	imageUrl: string;
	email?: string;
	order: number;
};

export default function AdminManagementTeamsPage() {
	// Pagination state
	const [page, setPage] = React.useState(1);
	const pageSize = 10;

	const teamMembers: TeamMember[] = [
		{
			id: "1",
			name: "Surya Prasad Adhikari",
			position: "Chief Executive Officer",
			imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80",
			email: "surya.adhikari@octavenepal.com",
			order: 1,
		},
		{
			id: "2",
			name: "Maya Sharma",
			position: "Chief Technology Officer",
			imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
			email: "maya.sharma@octavenepal.com",
			order: 2,
		},
		{
			id: "3",
			name: "Rajendra Karki",
			position: "Chief Operating Officer",
			imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
			email: "rajendra.karki@octavenepal.com",
			order: 3,
		},
		{
			id: "4",
			name: "Priya Thapa",
			position: "Head of Customer Success",
			imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=256&q=80",
			email: "priya.thapa@octavenepal.com",
			order: 4,
		},
		{
			id: "5",
			name: "Bikash Bista",
			position: "Head of Marketing",
			imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80",
			email: "bikash.bista@octavenepal.com",
			order: 5,
		},
		{
			id: "6",
			name: "Anjali Maharjan",
			position: "Lead Software Engineer",
			imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
			email: "anjali.maharjan@octavenepal.com",
			order: 6,
		},
		{
			id: "7",
			name: "Sanjay Adhikari",
			position: "Head of Human Resources",
			imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
			email: "sanjay.adhikari@octavenepal.com",
			order: 7,
		},
		{
			id: "8",
			name: "Kumari Gurung",
			position: "Head of Content",
			imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=256&q=80",
			email: "kumari.gurung@octavenepal.com",
			order: 8,
		},
	];

	// Sort by order field
	const sortedTeamMembers = [...teamMembers].sort((a, b) => a.order - b.order);

	// Pagination calculation
	const totalPages = Math.ceil(sortedTeamMembers.length / pageSize);
	const paginatedTeamMembers = sortedTeamMembers.slice((page - 1) * pageSize, page * pageSize);

	// Modal state
	const [openCreate, setOpenCreate] = React.useState(false);
	const [editing, setEditing] = React.useState<TeamMember | null>(null);
	const [pendingDelete, setPendingDelete] = React.useState<TeamMember | null>(null);

	// Handle create/edit
	function handleCreate(values: ManagementTeamFormValues) {
		// TODO: Implement actual API call
		toast.success(`Team member "${values.name}" created successfully!`);
		setOpenCreate(false);
	}

	function handleEdit(values: ManagementTeamFormValues) {
		if (!editing) return;
		// TODO: Implement actual API call
		toast.success(`Team member "${values.name}" updated successfully!`);
		setEditing(null);
	}

	const handleDelete = React.useCallback((member: TeamMember) => {
		setPendingDelete(member);
	}, []);

	const confirmDelete = React.useCallback(() => {
		if (!pendingDelete) return;
		// TODO: Implement actual API call
		toast.error(`Team member deleted: ${pendingDelete.name}`);
		setPendingDelete(null);
	}, [pendingDelete]);

	const cancelDelete = React.useCallback(() => {
		setPendingDelete(null);
	}, []);

	const columns: Array<DataTableColumn<TeamMember>> = [
		{
			id: "image",
			header: "Image",
			accessor: "imageUrl",
			cell: (member) => (
				<div className="h-10 w-10 overflow-hidden rounded-full">
					<Image src={member.imageUrl} alt={member.name} width={40} height={40} className="h-full w-full object-cover" />
				</div>
			),
		},
		{
			id: "name",
			header: "Name",
			accessor: "name",
			cell: (member) => (
				<div>
					<div className="font-medium text-gray-900">{member.name}</div>
				</div>
			),
		},
		{
			id: "position",
			header: "Position",
			accessor: "position",
			cell: (member) => (
				<span className="text-sm text-gray-600">{member.position}</span>
			),
		},
		{
			id: "email",
			header: "Email",
			accessor: "email",
			cell: (member) => (
				<span className="text-sm text-gray-600">{member.email || "—"}</span>
			),
		},
		{
			id: "order",
			header: "Order",
			accessor: "order",
			cell: (member) => (
				<span className="text-sm text-gray-600">{member.order}</span>
			),
		},
		{
			id: "actions",
			header: "Actions",
			align: "center",
			accessor: (member) => "",
			cell: (member) => (
				<div className="flex items-center justify-center gap-2">
					<Button variant="secondary" size="sm" className="gap-1" aria-label="Edit" onClick={(e) => { e.stopPropagation(); setEditing(member); }}>
						<Pencil size={16} />
					</Button>
					<Button variant="secondary" size="sm" className="gap-1 text-red-600 border-red-200 hover:bg-red-50" aria-label="Delete" onClick={(e) => { e.stopPropagation(); handleDelete(member); }}>
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
					<h1 className="text-xl sm:text-2xl font-semibold">Management Teams</h1>
				</div>
				<Button size="sm" onClick={() => setOpenCreate(true)}>Add Team Member</Button>
			</div>

			<Card>
				<CardContent className="p-0">
					<DataTable
						columns={columns}
						data={paginatedTeamMembers}
						getRowKey={(member) => member.id}
						emptyMessage="No team members found"
					/>
					<div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4">
						<p className="text-sm text-[color:var(--color-neutral-600)]">
							Showing {sortedTeamMembers.length === 0 ? 0 : (page - 1) * pageSize + 1}-{Math.min(page * pageSize, sortedTeamMembers.length)} of {sortedTeamMembers.length}
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
			<ManagementTeamFormModal
				open={openCreate}
				onClose={() => setOpenCreate(false)}
				onSubmit={handleCreate}
				mode="create"
			/>
			<ManagementTeamFormModal
				open={!!editing}
				onClose={() => setEditing(null)}
				onSubmit={handleEdit}
				mode="edit"
				initialValues={editing ? {
					name: editing.name,
					position: editing.position,
					email: editing.email,
					order: editing.order,
				} : undefined}
				initialImageUrl={editing?.imageUrl}
			/>

			{/* Delete Confirmation Modal */}
			<Modal open={!!pendingDelete} onClose={cancelDelete} title={pendingDelete ? 'Delete Team Member' : undefined}>
				{pendingDelete && (
					<div className="space-y-4 text-sm">
						<div className="text-[color:var(--color-neutral-800)]">
							Are you sure you want to delete
							<span className="font-medium"> {pendingDelete.name} </span>
							from the team? This action cannot be undone.
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
