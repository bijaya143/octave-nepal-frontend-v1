"use client";
import React from "react";
import Modal from "@/components/ui/Modal";
import { Calendar, BarChart3 } from "lucide-react";

type Newsletter = {
	id: string;
	subject: string;
	content: string;
	subscribers: number;
	createdAt: string;
};

type NewsletterViewModalProps = {
	newsletter: Newsletter | null;
	onClose: () => void;
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


export default function NewsletterViewModal({ newsletter, onClose }: NewsletterViewModalProps) {
	if (!newsletter) return null;

	return (
		<Modal open={!!newsletter} onClose={onClose} title="Newsletter Details">
			<div className="space-y-4">
				{/* Compact Header */}
				<div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
					<div className="flex items-start justify-between gap-4 mb-3">
						<h3 className="text-lg font-semibold text-gray-900 leading-tight flex-1">
							{newsletter.subject}
						</h3>
					</div>
					<div className="bg-white rounded-md p-3 border border-gray-100">
						<p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
							{newsletter.content}
						</p>
					</div>
				</div>

				{/* Compact Details */}
				<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
					<div className="divide-y divide-gray-100">
						{/* Subscribers Row */}
						<div className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
							<div className="flex items-center gap-3">
								<div className="p-1.5 bg-green-100 rounded-md">
									<BarChart3 size={14} className="text-green-600" />
								</div>
								<div>
									<p className="text-xs font-medium uppercase tracking-wide">Subscribers</p>
								</div>
							</div>
							<div className="text-right">
								<div className="text-sm font-bold text-green-600">
									{newsletter.subscribers.toLocaleString()}
								</div>
							</div>
						</div>

						{/* Created Date Row */}
						<div className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
							<div className="flex items-center gap-3">
								<div className="p-1.5 bg-purple-100 rounded-md">
									<Calendar size={14} className="text-purple-600" />
								</div>
								<div>
									<p className="text-xs font-medium uppercase tracking-wide">Created</p>
								</div>
							</div>
							<div className="text-right">
								<div className="text-sm font-bold text-purple-600">
									{formatDateTime(newsletter.createdAt)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
}
