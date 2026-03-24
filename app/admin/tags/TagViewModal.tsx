"use client";
import React from "react";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import Image from "next/image";
import { Calendar, CheckCircle2, XCircle, TrendingUp } from "lucide-react";

export type Tag = {
	id: string;
	name: string;
	slug: string;
	imageUrl: string;
	popularity: number;
	description: string;
	createdAt: string; // YYYY-MM-DD (UTC)
	updatedAt: string; // YYYY-MM-DD (UTC)
	isPublished: boolean;
};

function tagBadgeClass(isPublished: boolean): string {
	return isPublished
		? "bg-emerald-50 text-emerald-700 border-emerald-200"
		: "bg-gray-50 text-gray-700 border-gray-200";
}

type Props = {
	tag: Tag | null;
	onClose: () => void;
};

export default function TagViewModal({ tag, onClose }: Props) {
	return (
		<Modal open={!!tag} onClose={onClose} title={tag ? "Tag Details" : undefined}>
			{tag && (
				<div className="space-y-4 text-sm">
					{/* Header */}
					<div className="flex items-center justify-between gap-3">
						<div className="flex items-center gap-3">
							<Image src={tag.imageUrl} alt={tag.name} width={64} height={64} className="rounded-lg ring-1 ring-[color:var(--color-neutral-200)] shadow-sm" unoptimized/>
							<div>
								<div className="text-base font-semibold">{tag.name}</div>
								<div className="mt-1 inline-flex items-center gap-1 rounded-md border border-[color:var(--color-neutral-200)] bg-white px-2 py-0.5 font-mono text-[11px] text-[color:var(--color-neutral-700)]">/{tag.slug}</div>
							</div>
						</div>
						<Badge variant="outline" className={tagBadgeClass(tag.isPublished)}>
							<span className="inline-flex items-center gap-1">
								{tag.isPublished ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
								{tag.isPublished ? "Published" : "Unpublished"}
							</span>
						</Badge>
					</div>

					<div className="h-px bg-[color:var(--color-neutral-200)]" />

					{/* Description */}
					<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-50)] p-3">
						<div className="text-[color:var(--color-neutral-600)] mb-1">Description</div>
						<div className="text-[color:var(--color-neutral-800)]">{tag.description || "(No description)"}</div>
					</div>

					{/* Stats */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
						<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
							<div className="text-[11px] text-[color:var(--color-neutral-600)]">Popularity</div>
							<div className="mt-1 inline-flex items-center gap-2 font-medium text-[color:var(--color-neutral-900)]">
								<TrendingUp size={14} />
								{tag.popularity}
							</div>
						</div>
						<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
							<div className="text-[11px] text-[color:var(--color-neutral-600)]">Created</div>
							<div className="mt-1 inline-flex items-center gap-2 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
								<Calendar size={14} />
								{tag.createdAt}
							</div>
						</div>
						<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
							<div className="text-[11px] text-[color:var(--color-neutral-600)]">Updated</div>
							<div className="mt-1 inline-flex items-center gap-2 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
								<Calendar size={14} />
								{tag.updatedAt}
							</div>
						</div>
					</div>
				</div>
			)}
		</Modal>
	);
}


