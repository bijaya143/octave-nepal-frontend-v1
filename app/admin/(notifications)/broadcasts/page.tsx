"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import BroadcastFormModal, { BroadcastFormValues } from "./BroadcastFormModal";
import BroadcastViewModal from "./BroadcastViewModal";

type Broadcast = {
	id: string;
	title: string;
	message: string;
	targetAudience: "all" | "students" | "instructors" | "admins";
    recipients: number;
	createdAt: string; // ISO date string
};

function formatDateTime(isoString: string): string {
	const date = new Date(isoString);
	return date.toLocaleString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}

export default function AdminBroadcastsPage() {
	const baseBroadcasts = [
		{
			id: "1",
			title: "Welcome to Octave Nepal",
			message: "Welcome to our learning platform! We're excited to have you join our community of learners.",
			targetAudience: "all" as const,
			recipients: 100,
			createdAt: "2025-11-10T14:30:00Z",
		},
		{
			id: "2",
			title: "New Course Launch: Advanced React",
			message: "We're thrilled to announce the launch of our Advanced React course! Enroll now and take your React skills to the next level.",
			targetAudience: "students" as const,
			recipients: 50,
			createdAt: "2025-11-12T16:45:00Z",
		},
		{
			id: "3",
			title: "Monthly Instructor Meetup",
			message: "Join us for our monthly instructor meetup this Friday at 3 PM. We'll discuss best practices and share teaching tips.",
			targetAudience: "instructors" as const,
			recipients: 20,
			createdAt: "2025-11-14T11:20:00Z",
		},
		{
			id: "4",
			title: "System Maintenance Notice",
			message: "We will be performing scheduled maintenance on Saturday from 2 AM to 4 AM UTC. The platform will be unavailable during this time.",
			targetAudience: "all" as const,
			recipients: 100,
			createdAt: "2025-11-13T09:15:00Z",
		},
		{
			id: "5",
			title: "Holiday Schedule Update",
			message: "Due to the upcoming holidays, our customer support hours will be adjusted. Please check our support page for updated hours.",
			targetAudience: "all" as const,
			recipients: 100,
			createdAt: "2025-11-11T13:40:00Z",
		},
	];

	const broadcasts: Broadcast[] = baseBroadcasts.map((b, idx) => ({
		...b,
		createdAt: new Date(Date.now() - idx * 86400000).toISOString(),
	}));

	// Sort by created date (newest first)
	const sortedBroadcasts = React.useMemo(() => {
		return [...broadcasts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	}, [broadcasts]);

	// Pagination
	const [page, setPage] = React.useState(1);
	const pageSize = 10;
	const total = sortedBroadcasts.length;
	const pageCount = Math.max(1, Math.ceil(total / pageSize));
	const currentPage = Math.min(Math.max(1, page), pageCount);
	const start = (currentPage - 1) * pageSize;
	const end = Math.min(start + pageSize, total);
	const pagedBroadcasts = sortedBroadcasts.slice(start, end);

	const nextPage = () => setPage((p) => Math.min(p + 1, pageCount));
	const prevPage = () => setPage((p) => Math.max(p - 1, 1));

	const [selected, setSelected] = React.useState<Broadcast | null>(null);
	const [openCreate, setOpenCreate] = React.useState(false);

	const handleCreate = React.useCallback((values: BroadcastFormValues) => {
		toast.success(`Broadcast created: ${values.title}`);
		setOpenCreate(false);
	}, []);

	const handleTest = React.useCallback((values: BroadcastFormValues) => {
		toast.success(`Test broadcast sent to: ${values.testEmails}`);
	}, []);

	const columns: Array<DataTableColumn<Broadcast>> = [
		{ id: "title", header: "Title", accessor: "title", cellClassName: "font-medium" },
		{
			id: "message",
			header: "Message",
			accessor: (row) => (
				<div className="max-w-xs truncate text-sm text-gray-600">
					{row.message}
				</div>
			),
		},
		{
			id: "targetAudience",
			header: "Audience",
			accessor: "targetAudience",
			cell: (row) => (
				<Badge variant="outline" className="capitalize">
					{row.targetAudience}
				</Badge>
			),
			cellClassName: "whitespace-nowrap",
		},
		{
			id: "createdAt",
			header: "Created",
			accessor: (row) => formatDateTime(row.createdAt),
			cellClassName: "whitespace-nowrap text-sm",
		},
		{
			id: "actions",
			header: "Actions",
			align: "center",
			cell: (row) => (
				<Button variant="secondary" size="sm" className="gap-1 text-primary-600 border-primary-200 hover:bg-primary-50" aria-label="View" onClick={() => setSelected(row)}>
					<Eye size={16} />
				</Button>
			),
		},
	];

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between gap-3">
				<div>
					<h1 className="text-xl sm:text-2xl font-semibold">Broadcasts</h1>
				</div>
				<Button size="sm" onClick={() => setOpenCreate(true)}>Create Broadcast</Button>
			</div>


			<Card>
				<CardContent className="py-0">
					<DataTable<Broadcast>
						data={pagedBroadcasts}
						columns={columns}
						getRowKey={(row) => row.id}
						emptyMessage="No broadcasts found."
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

			<BroadcastViewModal broadcast={selected} onClose={() => setSelected(null)} />
			<BroadcastFormModal
				open={openCreate}
				onClose={() => setOpenCreate(false)}
				onSubmit={handleCreate}
				onTest={handleTest}
				title="Create Broadcast"
				mode="create"
			/>
		</div>
	);
}
