"use client";
import React from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

function slugify(input: string): string {
	return input
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}

export type BlogCategoryFormValues = {
	name: string;
	slug: string;
	imageFile?: File | null;
	description: string;
	isPublished: boolean;
};

type BlogCategoryFormModalProps = {
	open: boolean;
	onClose: () => void;
	onSubmit: (values: BlogCategoryFormValues) => void;
	title?: string;
	mode?: "create" | "edit";
	initialValues?: Partial<BlogCategoryFormValues>;
	initialImageUrl?: string; // for edit preview
	isLoading?: boolean;
};

const DEFAULTS: BlogCategoryFormValues = {
	name: "",
	slug: "",
	imageFile: null,
	description: "",
	isPublished: true,
};

export default function BlogCategoryFormModal({
	open,
	onClose,
	onSubmit,
	title,
	mode = "create",
	initialValues,
	initialImageUrl,
	isLoading = false,
}: BlogCategoryFormModalProps) {
	const [values, setValues] = React.useState<BlogCategoryFormValues>({ ...DEFAULTS, ...initialValues });
	const [previewUrl, setPreviewUrl] = React.useState<string>(initialImageUrl || "");
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	const [activeTab, setActiveTab] = React.useState<"details" | "media" | "visibility">("details");

	const tabs = React.useMemo(() => ([
		{ key: "details", label: "Details" },
		{ key: "media", label: "Media" },
		{ key: "visibility", label: "Visibility" },
	] as const), []);

	// Reset tab when modal opens
	React.useEffect(() => {
		if (open) {
			setActiveTab("details");
		}
	}, [open]);

	// Update values and preview when modal opens or initialValues change
	React.useEffect(() => {
		if (open) {
			setValues({ ...DEFAULTS, ...initialValues });
			setPreviewUrl(initialImageUrl || "");
		}
	}, [open, initialValues, initialImageUrl]);

	React.useEffect(() => {
		return () => {
			if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
		};
	}, [previewUrl]);

	function handleChange<K extends keyof BlogCategoryFormValues>(key: K, value: BlogCategoryFormValues[K]) {
		setValues((prev) => ({ ...prev, [key]: value }));
	}

	function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
		const name = e.target.value;
		handleChange("name", name);
		if (!initialValues?.slug) {
			handleChange("slug", slugify(name));
		}
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0] || null;
		if (file) {
			handleChange("imageFile", file);
			const url = URL.createObjectURL(file);
			setPreviewUrl((prev) => {
				if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
				return url;
			});
		}
	}

	function clearImage() {
		handleChange("imageFile", null);
		if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
		setPreviewUrl("");
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	function handleFormSubmit(e: React.FormEvent) {
		e.preventDefault();
	}

	const disabled = !values.name || !values.slug;

	const currentTabIndexRaw = tabs.findIndex((t) => t.key === activeTab);
	const currentTabIndex = currentTabIndexRaw < 0 ? 0 : currentTabIndexRaw;
	const isFirstTab = currentTabIndex <= 0;
	const isLastTab = currentTabIndex >= tabs.length - 1;

	function goNextTab() {
		if (!isLastTab) {
			const next = tabs[currentTabIndex + 1]?.key || tabs[tabs.length - 1].key;
			setActiveTab(next);
		}
	}

	function goPrevTab() {
		if (!isFirstTab) {
			const prev = tabs[currentTabIndex - 1]?.key || tabs[0].key;
			setActiveTab(prev);
		}
	}

	return (
		<Modal open={open} onClose={onClose} title={title ?? (mode === "edit" ? "Edit Blog Category" : "Create Blog Category")}>
			<form onSubmit={handleFormSubmit} noValidate className="space-y-5 text-sm">
				{/* Tabs */}
				<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-1">
					<div className="grid grid-cols-3 gap-1">
						{tabs.map((t) => (
							<button
								key={t.key}
								type="button"
								onClick={() => setActiveTab(t.key)}
								className={t.key === activeTab ? "w-full text-center px-3 py-1.5 rounded-md border border-[color:var(--color-primary-200)] text-[color:var(--color-primary-700)] bg-[color:var(--color-primary-50)]" : "w-full text-center px-3 py-1.5 rounded-md border border-[color:var(--color-neutral-200)] text-[color:var(--color-neutral-700)] hover:bg-[color:var(--color-neutral-50)]"}
							>
								{t.label}
							</button>
						))}
					</div>
				</div>

				{/* Tab: Details */}
				{activeTab === "details" && (
					<div className="space-y-3">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<Input label="Name" value={values.name} onChange={handleNameChange} placeholder="Category name" required />
							<div>
								<Input label="Slug" value={values.slug} onChange={(e) => handleChange("slug", e.target.value)} placeholder="category-slug" required />
								<div className="mt-1 inline-flex items-center gap-1 rounded-md border border-[color:var(--color-neutral-200)] bg-white px-2 py-0.5 font-mono text-[11px] text-[color:var(--color-neutral-700)]">/{values.slug || "your-slug"}</div>
							</div>
						</div>
						<div className="space-y-2">
							<Textarea label="Description" value={values.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Short description of the blog category" rows={3} />
						</div>
					</div>
				)}

				{/* Tab: Media */}
				{activeTab === "media" && (
					<div className="space-y-3">
						<div className="rounded-lg border border-dashed border-[color:var(--color-neutral-300)] bg-[color:var(--color-neutral-50)] p-3">
							<label htmlFor="category-image-input" className="block text-xs text-[color:var(--color-neutral-600)] mb-2">Category Image</label>
							<div className="flex items-center gap-3">
								{previewUrl ? (
									<img src={previewUrl} alt="Preview" className="h-20 w-20 rounded-lg object-cover ring-1 ring-[color:var(--color-neutral-200)]" />
								) : (
									<div className="h-20 w-20 flex items-center justify-center rounded-lg bg-white text-[color:var(--color-neutral-400)] ring-1 ring-[color:var(--color-neutral-200)]">No image</div>
								)}
								<div className="flex-1">
									<p className="text-xs text-[color:var(--color-neutral-600)]">Upload a cover image for this blog category.</p>
									<div className="mt-2 flex items-center gap-2">
										<input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="category-image-input" />
										<Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>Browse</Button>
										{previewUrl && (
											<Button type="button" variant="secondary" className="text-red-600 border-red-200 hover:bg-red-50" onClick={clearImage}>Remove</Button>
										)}
									</div>
									<p className="mt-1 text-[10px] text-[color:var(--color-neutral-500)]">PNG or JPG. Max ~2MB. Recommended: 400x300px.</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Tab: Visibility */}
				{activeTab === "visibility" && (
					<div className="space-y-3">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<Select
								label="Status"
								hint="Controls whether this category is visible to users when creating blog posts."
								value={values.isPublished ? "Published" : "Unpublished"}
								onChange={(e) => handleChange("isPublished", e.target.value === "Published")}
							>
								<option value="Published">Published</option>
								<option value="Unpublished">Unpublished</option>
							</Select>
						</div>
					</div>
				)}

				<div className="flex items-center justify-end gap-2 pt-3 border-t border-[color:var(--color-neutral-200)]">
					{!isFirstTab && (
						<Button type="button" variant="secondary" onClick={goPrevTab}>Previous</Button>
					)}
					{!isLastTab ? (
						<Button type="button" onClick={goNextTab}>Next</Button>
					) : (
						<Button
							type="button"
							onClick={() => {
								const cleaned: BlogCategoryFormValues = {
									...values,
									slug: values.slug || slugify(values.name),
								};
								onSubmit(cleaned);
							}}
							disabled={disabled || isLoading}
						>
							{isLoading
								? mode === "edit"
									? "Saving..."
									: "Creating..."
								: mode === "edit"
									? "Save changes"
									: "Create"}
						</Button>
					)}
				</div>
			</form>
		</Modal>
	);
}
