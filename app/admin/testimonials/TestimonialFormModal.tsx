"use client";
import React from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Star } from "lucide-react";
import Image from "next/image";

export type TestimonialFormValues = {
	name: string;
	message: string;
	rating: number;
	imageFile?: File | null;
	isPublished: boolean;
};

type TestimonialFormModalProps = {
	open: boolean;
	onClose: () => void;
	onSubmit: (values: TestimonialFormValues) => void;
	title?: string;
	mode?: "create" | "edit";
	initialValues?: Partial<TestimonialFormValues>;
	initialImageUrl?: string;
};

const DEFAULTS: TestimonialFormValues = {
	name: "",
	message: "",
	rating: 5,
	imageFile: null,
	isPublished: true,
};

export default function TestimonialFormModal({
	open,
	onClose,
	onSubmit,
	title,
	mode = "create",
	initialValues,
	initialImageUrl
}: TestimonialFormModalProps) {
	const [values, setValues] = React.useState<TestimonialFormValues>({
		...DEFAULTS,
		...initialValues
	});

	const [previewUrl, setPreviewUrl] = React.useState<string>(initialImageUrl || "");
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	const [activeTab, setActiveTab] = React.useState<"details" | "media" | "visibility">("details");

	const tabs = React.useMemo(() => ([
		{ key: "details", label: "Details" },
		{ key: "media", label: "Media" },
		{ key: "visibility", label: "Visibility" },
	] as const), []);

	React.useEffect(() => {
		setValues({
			...DEFAULTS,
			...initialValues
		});
		setPreviewUrl(initialImageUrl || "");
		setActiveTab("details");
	}, [initialValues, initialImageUrl, open]);

	function handleChange<K extends keyof TestimonialFormValues>(key: K, value: TestimonialFormValues[K]) {
		setValues((prev) => ({ ...prev, [key]: value }));
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0] || null;
		handleChange("imageFile", file);
		if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
		setPreviewUrl(file ? URL.createObjectURL(file) : "");
	}

	function clearImage() {
		handleChange("imageFile", null);
		setPreviewUrl("");
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	const disabled = !values.name.trim() || !values.message.trim();

	function handleFormSubmit(e: React.FormEvent) { e.preventDefault(); }

	const currentTabIndexRaw = tabs.findIndex((t) => t.key === activeTab);
	const currentTabIndex = currentTabIndexRaw < 0 ? 0 : currentTabIndexRaw;
	const isFirstTab = currentTabIndex <= 0;
	const isLastTab = currentTabIndex >= tabs.length - 1;

	function goNextTab() {
		if (!isLastTab) {
			const next = tabs[currentTabIndex + 1]?.key || tabs[tabs.length - 1].key;
			setActiveTab(next as typeof activeTab);
		}
	}

	function goPrevTab() {
		if (!isFirstTab) {
			const prev = tabs[currentTabIndex - 1]?.key || tabs[0].key;
			setActiveTab(prev as typeof activeTab);
		}
	}

	return (
		<Modal open={open} onClose={onClose} title={title || `${mode === "edit" ? "Edit" : "Add"} Testimonial`}>
			<form onSubmit={handleFormSubmit} noValidate className="space-y-5 text-sm">
				{/* Tab Navigation */}
				<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-1">
					<div className="grid grid-cols-3 gap-1">
						{tabs.map((tab) => (
							<button
								key={tab.key}
								type="button"
								onClick={() => setActiveTab(tab.key)}
								className={tab.key === activeTab ? "w-full text-center px-3 py-1.5 rounded-md border border-[color:var(--color-primary-200)] text-[color:var(--color-primary-700)] bg-[color:var(--color-primary-50)]" : "w-full text-center px-3 py-1.5 rounded-md border border-[color:var(--color-neutral-200)] text-[color:var(--color-neutral-700)] hover:bg-[color:var(--color-neutral-50)]"}
							>
								{tab.label}
							</button>
						))}
					</div>
				</div>

				{activeTab === "details" && (
					<div className="space-y-3">
						<div className="grid grid-cols-1 gap-3">
							<div>
								<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Name</label>
								<Input
									value={values.name}
									onChange={(e) => handleChange("name", e.target.value)}
									placeholder="Full name"
									required
								/>
							</div>
						</div>
						<div className="space-y-3">
							<div>
								<label className="block text-xs text-[color:var(--color-neutral-600)] mb-2">Rating</label>
								<div className="flex items-center gap-2">
									<div className="flex items-center gap-1">
										{Array.from({ length: 5 }, (_, i) => (
											<button
												key={i}
												type="button"
												onClick={() => handleChange("rating", i + 1)}
												className="p-1 hover:scale-110 transition-transform"
											>
												<Star
													size={24}
													className={i < values.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
												/>
											</button>
										))}
									</div>
									<span className="text-sm text-[color:var(--color-neutral-600)] ml-2">
										{values.rating} star{values.rating !== 1 ? 's' : ''}
									</span>
								</div>
							</div>
							<div>
								<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Testimonial Message</label>
								<Textarea
									value={values.message}
									onChange={(e) => handleChange("message", e.target.value)}
									placeholder="Share the testimonial message..."
									rows={4}
									required
								/>
							</div>
						</div>
					</div>
				)}

				{activeTab === "media" && (
					<div className="space-y-3">
						<div className="rounded-lg border border-dashed border-[color:var(--color-neutral-300)] bg-[color:var(--color-neutral-50)] p-3">
							<label htmlFor="testimonial-image-input" className="block text-xs text-[color:var(--color-neutral-600)] mb-2">Profile Image</label>
							<div className="flex items-center gap-3">
								{previewUrl ? (
									<Image src={previewUrl} alt="Profile preview" width={80} height={80} className="h-20 w-20 rounded-full object-cover ring-1 ring-[color:var(--color-neutral-200)]" />
								) : (
									<div className="h-20 w-20 flex items-center justify-center rounded-full bg-white text-[color:var(--color-neutral-400)] ring-1 ring-[color:var(--color-neutral-200)]">
										No image
									</div>
								)}
								<div className="flex-1">
									<p className="text-xs text-[color:var(--color-neutral-600)]">Upload a profile image for the testimonial.</p>
									<div className="mt-2 flex items-center gap-2">
										<input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="testimonial-image-input" />
										<Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>Browse</Button>
										{previewUrl && (
											<Button type="button" variant="secondary" className="text-red-600 border-red-200 hover:bg-red-50" onClick={clearImage}>Remove</Button>
										)}
									</div>
									<p className="mt-1 text-[10px] text-[color:var(--color-neutral-500)]">PNG or JPG. Max ~2MB. Square images work best.</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{activeTab === "visibility" && (
					<div className="space-y-3">
						<div className="grid grid-cols-1 gap-3">
							<div>
								<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Status</label>
								<Select value={values.isPublished ? "Published" : "Unpublished"} onChange={(e) => handleChange("isPublished", e.target.value === "Published")}>
									<option value="Published">Published</option>
									<option value="Unpublished">Unpublished</option>
								</Select>
								<p className="mt-1 text-[10px] text-[color:var(--color-neutral-500)]">Controls whether this testimonial is displayed on the website.</p>
							</div>
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
								const cleaned: TestimonialFormValues = { ...values };
								onSubmit(cleaned);
							}}
							disabled={disabled}
						>
							{mode === "edit" ? "Save changes" : "Create"}
						</Button>
					)}
				</div>
			</form>
		</Modal>
	);
}
