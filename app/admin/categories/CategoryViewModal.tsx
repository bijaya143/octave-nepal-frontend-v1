"use client";
import React from "react";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import Image from "next/image";
import { Calendar, CheckCircle2, XCircle } from "lucide-react";

type Tag = { id: string; name: string };

export type Category = {
	id: string;
	name: string;
	slug: string;
	imageUrl: string;
	iconUrl?: string;
	description: string;
	popularity: number;
	courseCount: number;
	learnerCount: number;
	createdAt: string; // YYYY-MM-DD
	updatedAt: string; // YYYY-MM-DD
	isPublished: boolean;
	tags: Tag[];
};

function statusBadgeClass(isPublished: boolean): string {
	return isPublished
		? "bg-emerald-50 text-emerald-700 border-emerald-200"
		: "bg-gray-50 text-gray-700 border-gray-200";
}

type Props = {
	category: Category | null;
	onClose: () => void;
};

export default function CategoryViewModal({ category, onClose }: Props) {
	return (
		<Modal open={!!category} onClose={onClose} title={category ? "Category Details" : undefined}>
			{category && (
				<div className="space-y-4 text-sm">
					{/* Header */}
					<div className="flex items-center justify-between gap-3">
						<div className="flex items-center gap-3">
							<div className="h-16 w-16 overflow-hidden rounded-lg ring-1 ring-[color:var(--color-neutral-200)] shadow-sm">
								<Image src={category.imageUrl} alt={category.name} width={64} height={64} className="h-full w-full object-cover" />
							</div>
							<div>
								<div className="text-base font-semibold">{category.name}</div>
								<div className="mt-1 inline-flex items-center gap-1 rounded-md border border-[color:var(--color-neutral-200)] bg-white px-2 py-0.5 font-mono text-[11px] text-[color:var(--color-neutral-700)]">/{category.slug}</div>
							</div>
							{category.iconUrl && (
								<div className="ml-2 h-10 w-10 overflow-hidden rounded-md ring-1 ring-[color:var(--color-neutral-200)] shadow-sm">
									<Image src={category.iconUrl} alt={`${category.name} icon`} width={40} height={40} className="h-full w-full object-cover" />
								</div>
							)}
						</div>
						<Badge variant="outline" className={statusBadgeClass(category.isPublished)}>
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
							<div className="text-[11px] text-[color:var(--color-neutral-600)]">Popularity</div>
							<div className="mt-1 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">{category.popularity}</div>
						</div>
						<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
							<div className="text-[11px] text-[color:var(--color-neutral-600)]">Courses</div>
							<div className="mt-1 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">{category.courseCount}</div>
						</div>
						<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
							<div className="text-[11px] text-[color:var(--color-neutral-600)]">Learners</div>
							<div className="mt-1 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">{category.learnerCount}</div>
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

					{/* Tags */}
					<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
						<div className="text-[11px] text-[color:var(--color-neutral-600)] mb-1">Tags</div>
						{category.tags.length === 0 ? (
							<div className="text-[color:var(--color-neutral-600)]">(No tags)</div>
						) : (
							<div className="flex flex-wrap gap-1.5">
								{category.tags.map((t) => (
									<Badge key={t.id} variant="outline" className="text-[11px]">{t.name}</Badge>
								))}
							</div>
						)}
					</div>
				</div>
			)}
		</Modal>
	);
}


