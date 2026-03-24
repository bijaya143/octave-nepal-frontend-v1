"use client";
import React from "react";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import { Calendar, Users, MessageSquare, BarChart3 } from "lucide-react";

type Broadcast = {
	id: string;
	title: string;
	message: string;
	targetAudience: "all" | "students" | "instructors" | "admins";
	recipients: number;
	createdAt: string;
};

type BroadcastViewModalProps = {
	broadcast: Broadcast | null;
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
		timeZoneName: 'short',
	});
}


export default function BroadcastViewModal({ broadcast, onClose }: BroadcastViewModalProps) {
	if (!broadcast) return null;

	return (
		<Modal open={!!broadcast} onClose={onClose} title="Broadcast Details">
			<div className="space-y-4">
				{/* Compact Header */}
				<div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
					<div className="flex items-start justify-between gap-4 mb-3">
						<h3 className="text-lg font-semibold text-gray-900 leading-tight flex-1">
							{broadcast.title}
						</h3>
					</div>
					<div className="bg-white rounded-md p-3 border border-gray-100">
						<p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
							{broadcast.message}
						</p>
					</div>
				</div>

				{/* Compact Details */}
				<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
					<div className="divide-y divide-gray-100">
						{/* Target Audience Row */}
						<div className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
							<div className="flex items-center gap-3">
								<div className="p-1.5 bg-blue-100 rounded-md">
									<Users size={14} className="text-blue-600" />
								</div>
								<div>
									<p className="text-xs font-medium uppercase tracking-wide">Target Audience</p>
								</div>
							</div>
							<Badge
								variant="outline"
								className="capitalize bg-blue-50 text-blue-700 border-blue-200 text-sm"
							>
								{broadcast.targetAudience}
							</Badge>
						</div>

						{/* Recipients Row */}
						<div className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
							<div className="flex items-center gap-3">
								<div className="p-1.5 bg-green-100 rounded-md">
									<BarChart3 size={14} className="text-green-600" />
								</div>
								<div>
									<p className="text-xs font-medium uppercase tracking-wide">Recipients</p>
								</div>
							</div>
							<div className="text-right">
								<div className="text-sm font-bold text-green-600">
									{broadcast.recipients.toLocaleString()}
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
                                    {formatDateTime(broadcast.createdAt)}
                                </div>
                            </div>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
}
