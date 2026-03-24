"use client";
import React from "react";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import Image from "next/image";
import { Calendar, CheckCircle2, XCircle, Eye, Star, Tag, FolderOpen } from "lucide-react";

type BlogCategory = {
	id: string;
	name: string;
};

export type BlogPost = {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	featuredImageUrl: string;
	author: string;
	category: BlogCategory;
	tags: string[];
	status: "unpublished" | "published";
	isFeatured: boolean;
	viewCount: number;
	createdAt: string; // YYYY-MM-DD (UTC)
	updatedAt: string; // YYYY-MM-DD (UTC)
	publishedAt: string | null; // YYYY-MM-DD (UTC)
};

function statusBadgeClass(status: BlogPost["status"]): string {
	switch (status) {
		case "published": return "bg-emerald-50 text-emerald-700 border-emerald-200";
		case "unpublished": return "bg-gray-50 text-gray-700 border-gray-200";
		default: return "bg-gray-50 text-gray-700 border-gray-200";
	}
}

function statusIcon(status: BlogPost["status"]) {
	switch (status) {
		case "published": return <CheckCircle2 size={14} />;
		case "unpublished": return <XCircle size={14} />;
		default: return <XCircle size={14} />;
	}
}

type Props = {
	post: BlogPost | null;
	onClose: () => void;
};

export default function BlogPostViewModal({ post, onClose }: Props) {
	return (
		<Modal open={!!post} onClose={onClose} title={post ? "Blog Post Details" : undefined}>
			{post && (
				<div className="space-y-4 text-sm max-h-[80vh] overflow-y-auto">
					{/* Header */}
					<div className="flex items-start justify-between gap-4">
						<div className="flex-1">
							<div className="flex items-center gap-3 mb-2">
								<h2 className="text-lg font-semibold">{post.title}</h2>
								<Badge variant="outline" className={statusBadgeClass(post.status)}>
									<span className="inline-flex items-center gap-1">
										{statusIcon(post.status)}
										{post.status.charAt(0).toUpperCase() + post.status.slice(1)}
									</span>
								</Badge>
								{post.isFeatured && (
									<Star size={16} className="text-amber-500 fill-amber-500" />
								)}
							</div>
							<div className="inline-flex items-center gap-1 rounded-md border border-[color:var(--color-neutral-200)] bg-white px-2 py-0.5 font-mono text-[11px] text-[color:var(--color-neutral-700)]">/{post.slug}</div>
						</div>
						<Image src={post.featuredImageUrl} alt={post.title} width={120} height={80} className="rounded-lg ring-1 ring-[color:var(--color-neutral-200)] shadow-sm" />
					</div>

					<div className="h-px bg-[color:var(--color-neutral-200)]" />

					{/* Excerpt */}
					<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-50)] p-3">
						<div className="text-[color:var(--color-neutral-600)] mb-1">Excerpt</div>
						<div className="text-[color:var(--color-neutral-800)]">{post.excerpt || "(No excerpt)"}</div>
					</div>

					{/* Content Preview */}
					<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-50)] p-3">
						<div className="text-[color:var(--color-neutral-600)] mb-1">Content Preview</div>
						<div className="text-[color:var(--color-neutral-800)] max-h-32 overflow-hidden">
							{post.content || "(No content)"}
							{post.content && post.content.length > 200 && (
								<span className="text-[color:var(--color-neutral-500)]">...</span>
							)}
						</div>
					</div>

					{/* Author & Category */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
							<div className="text-[11px] text-[color:var(--color-neutral-600)] mb-2">Author</div>
							<div className="font-medium text-[color:var(--color-neutral-900)]">{post.author}</div>
						</div>
						<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
							<div className="text-[11px] text-[color:var(--color-neutral-600)] mb-2">Category</div>
							<div className="inline-flex items-center gap-2 font-medium text-[color:var(--color-neutral-900)]">
								<FolderOpen size={14} />
								{post.category.name}
							</div>
						</div>
					</div>

					{/* Tags */}
					{post.tags.length > 0 && (
						<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-3">
							<div className="text-[11px] text-[color:var(--color-neutral-600)] mb-2">Tags</div>
							<div className="flex flex-wrap gap-1">
								{post.tags.map((tag) => (
									<span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[color:var(--color-neutral-100)] text-[color:var(--color-neutral-700)] text-xs">
										<Tag size={10} />
										{tag}
									</span>
								))}
							</div>
						</div>
					)}

					{/* Stats */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
							<div className="text-[11px] text-[color:var(--color-neutral-600)]">Views</div>
							<div className="mt-1 inline-flex items-center gap-2 font-medium text-[color:var(--color-neutral-900)]">
								<Eye size={14} />
								{post.viewCount.toLocaleString()}
							</div>
						</div>
						<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
							<div className="text-[11px] text-[color:var(--color-neutral-600)]">Created</div>
							<div className="mt-1 inline-flex items-center gap-2 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
								<Calendar size={14} />
								{post.createdAt}
							</div>
						</div>
						<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
							<div className="text-[11px] text-[color:var(--color-neutral-600)]">Published</div>
							<div className="mt-1 inline-flex items-center gap-2 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
								<Calendar size={14} />
								{post.publishedAt || "Not published"}
							</div>
						</div>
					</div>
				</div>
			)}
		</Modal>
	);
}
