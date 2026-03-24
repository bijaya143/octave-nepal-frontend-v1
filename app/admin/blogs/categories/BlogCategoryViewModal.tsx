"use client";
import React from "react";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import Image from "next/image";
import { Calendar, CheckCircle2, XCircle, FileText } from "lucide-react";

export type BlogCategory = {
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

function categoryBadgeClass(isPublished: boolean): string {
	return isPublished
		? "bg-emerald-50 text-emerald-700 border-emerald-200"
		: "bg-gray-50 text-gray-700 border-gray-200";
}

type Props = {
	category: BlogCategory | null;
	onClose: () => void;
};

export default function BlogCategoryViewModal({ category, onClose }: Props) {
	return (
		<Modal open={!!category} onClose={onClose} title={category ? "Blog Category Details" : undefined}>
			{category && (
				<div className="space-y-4 text-sm">
					{/* Header */}
					<div className="flex items-center justify-between gap-3">
						<div className="flex items-center gap-3">
							<Image src={category.imageUrl} alt={category.name} width={64} height={64} className="rounded-lg ring-1 ring-[color:var(--color-neutral-200)] shadow-sm" />
							<div>
								<div className="text-base font-semibold">{category.name}</div>
								<div className="mt-1 inline-flex items-center gap-1 rounded-md border border-[color:var(--color-neutral-200)] bg-white px-2 py-0.5 font-mono text-[11px] text-[color:var(--color-neutral-700)]">/{category.slug}</div>
							</div>
						</div>
						<Badge variant="outline" className={categoryBadgeClass(category.isPublished)}>
							<span className="inline-flex items-center gap-1">
								{category.isPublished ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
								{category.isPublished ? "Published" : "Unpublished"}
							</span>
						</Badge>
					</div>

					<div className="h-px bg-[color:var(--color-neutral-200)]" />

					{/* Description */}
					<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-50)] p-3">
						<div className="text-[color:var(--color-neutral-600)] mb-1">Description</div>
						<div className="text-[color:var(--color-neutral-800)]">{category.description || "(No description)"}</div>
					</div>

					{/* Stats */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
						<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
							<div className="text-[11px] text-[color:var(--color-neutral-600)]">Blog Posts</div>
							<div className="mt-1 inline-flex items-center gap-2 font-medium text-[color:var(--color-neutral-900)]">
								<FileText size={14} />
								{category.postCount}
							</div>
						</div>
						<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
							<div className="text-[11px] text-[color:var(--color-neutral-600)]">Created</div>
							<div className="mt-1 inline-flex items-center gap-2 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
								<Calendar size={14} />
								{category.createdAt}
							</div>
						</div>
						<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
							<div className="text-[11px] text-[color:var(--color-neutral-600)]">Updated</div>
							<div className="mt-1 inline-flex items-center gap-2 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
								<Calendar size={14} />
								{category.updatedAt}
							</div>
						</div>
					</div>
				</div>
			)}
		</Modal>
	);
}
