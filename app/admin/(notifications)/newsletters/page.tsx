"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import NewsletterFormModal, { NewsletterFormValues } from "./NewsletterFormModal";
import NewsletterViewModal from "./NewsletterViewModal";

type Newsletter = {
	id: string;
	subject: string;
	content: string;
	subscribers: number;
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

export default function AdminNewslettersPage() {
	const baseNewsletters = [
		{
			id: "1",
			subject: "New Courses Available This Week!",
			content: "Discover our latest course offerings and special promotions. This week we have new courses in React, Python, and Data Science.",
			subscribers: 1250,
			createdAt: "2025-11-10T14:30:00Z",
		},
		{
			id: "2",
			subject: "Meet Our Top Performing Students",
			content: "Read inspiring stories from students who have successfully completed our courses and landed their dream jobs.",
			subscribers: 850,
			createdAt: "2025-11-12T16:45:00Z",
		},
		{
			id: "3",
			subject: "Featured Instructor: Sarah Johnson",
			content: "Get to know Sarah Johnson, our featured instructor this month. Learn about her teaching philosophy and course creation process.",
			subscribers: 120,
			createdAt: "2025-11-14T11:20:00Z",
		},
		{
			id: "4",
			subject: "Scheduled Maintenance Notice",
			content: "We'll be performing scheduled maintenance this weekend. Here's what you need to know about the downtime and what to expect.",
			subscribers: 1250,
			createdAt: "2025-11-13T09:15:00Z",
		},
		{
			id: "5",
			subject: "Holiday Learning Resources",
			content: "Don't let the holidays slow down your learning! Check out our special holiday learning resources and festive coding challenges.",
			subscribers: 850,
			createdAt: "2025-11-11T13:40:00Z",
		},
	];

	const newsletters: Newsletter[] = baseNewsletters.map((b, idx) => ({
		...b,
		createdAt: new Date(Date.now() - idx * 86400000).toISOString(),
	}));

	// Sort by created date (newest first)
	const sortedNewsletters = React.useMemo(() => {
		return [...newsletters].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	}, [newsletters]);

	// Pagination
	const [page, setPage] = React.useState(1);
	const pageSize = 10;
	const total = sortedNewsletters.length;
	const pageCount = Math.max(1, Math.ceil(total / pageSize));
	const currentPage = Math.min(Math.max(1, page), pageCount);
	const start = (currentPage - 1) * pageSize;
	const end = Math.min(start + pageSize, total);
	const pagedNewsletters = sortedNewsletters.slice(start, end);

	const nextPage = () => setPage((p) => Math.min(p + 1, pageCount));
	const prevPage = () => setPage((p) => Math.max(p - 1, 1));

	const [selected, setSelected] = React.useState<Newsletter | null>(null);
	const [openCreate, setOpenCreate] = React.useState(false);

	const handleCreate = React.useCallback((values: NewsletterFormValues) => {
		toast.success(`Newsletter created: ${values.subject}`);
		setOpenCreate(false);
	}, []);

	const handleTest = React.useCallback((values: NewsletterFormValues) => {
		toast.success(`Test newsletter sent to: ${values.testEmails}`);
	}, []);

	const columns: Array<DataTableColumn<Newsletter>> = [
		{
			id: "subject",
			header: "Subject",
			accessor: "subject",
			cellClassName: "font-medium",
		},
		{
			id: "content",
			header: "Content",
			accessor: (row) => (
				<div className="max-w-xs truncate text-sm text-gray-600">
					{row.content}
				</div>
			),
		},
		{
			id: "subscribers",
			header: "Subscribers",
			accessor: (row) => row.subscribers.toLocaleString(),
			cellClassName: "whitespace-nowrap text-sm",
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
					<h1 className="text-xl sm:text-2xl font-semibold">Newsletters</h1>
				</div>
				<Button size="sm" onClick={() => setOpenCreate(true)}>Create Newsletter</Button>
			</div>

			<Card>
				<CardContent className="py-0">
					<DataTable<Newsletter>
						data={pagedNewsletters}
						columns={columns}
						getRowKey={(row) => row.id}
						emptyMessage="No newsletters found."
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

			<NewsletterViewModal newsletter={selected} onClose={() => setSelected(null)} />
			<NewsletterFormModal
				open={openCreate}
				onClose={() => setOpenCreate(false)}
				onSubmit={handleCreate}
				onTest={handleTest}
				title="Create Newsletter"
				mode="create"
			/>
		</div>
	);
}
