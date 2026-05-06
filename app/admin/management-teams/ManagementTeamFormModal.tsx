"use client";
import React from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

export type ManagementTeamFormValues = {
	name: string;
	position: string;
	email?: string;
	order: number;
	imageFile?: File | null;
	isPublished: boolean;
};

type ManagementTeamFormModalProps = {
	open: boolean;
	onClose: () => void;
	onSubmit: (values: ManagementTeamFormValues) => void;
	title?: string;
	mode?: "create" | "edit";
	initialValues?: Partial<ManagementTeamFormValues>;
	initialImageUrl?: string;
	isLoading?: boolean;
};

const DEFAULTS: ManagementTeamFormValues = {
	name: "",
	position: "",
	email: "",
	order: 0,
	imageFile: null,
	isPublished: true,
};

export default function ManagementTeamFormModal({
	open,
	onClose,
	onSubmit,
	title,
	mode = "create",
	initialValues,
	initialImageUrl,
	isLoading = false,
}: ManagementTeamFormModalProps) {
	const [values, setValues] = React.useState<ManagementTeamFormValues>({ ...DEFAULTS, ...initialValues });
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

	React.useEffect(() => {
		if (open) {
			setValues({ ...DEFAULTS, ...initialValues });
			setPreviewUrl(initialImageUrl || "");
		}
	}, [initialValues, initialImageUrl, open]);

	React.useEffect(() => {
		return () => {
			if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
		};
	}, [previewUrl]);

	function handleChange<K extends keyof ManagementTeamFormValues>(key: K, value: ManagementTeamFormValues[K]) {
		setValues((prev) => ({ ...prev, [key]: value }));
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

	function handleFormSubmit(e: React.FormEvent) { e.preventDefault(); }

	const disabled = !values.name.trim() || !values.position.trim();

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
		<Modal open={open} onClose={onClose} title={title ?? (mode === "edit" ? "Edit Team Member" : "Add Team Member")}>
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
							<Input
								label="Name"
								value={values.name}
								onChange={(e) => handleChange("name", e.target.value)}
								placeholder="Full name"
								required
							/>
							<Input
								label="Position"
								value={values.position}
								onChange={(e) => handleChange("position", e.target.value)}
								placeholder="Job title"
								required
							/>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<Input
								label="Email"
								type="email"
								value={values.email || ""}
								onChange={(e) => handleChange("email", e.target.value)}
								placeholder="email@octavenepal.com"
							/>
							<Input
								label="Display Order"
								type="number"
								value={values.order}
								onChange={(e) => handleChange("order", parseInt(e.target.value) || 0)}
								placeholder="1"
								min="0"
								required
							/>
						</div>
					</div>
				)}

				{/* Tab: Media */}
				{activeTab === "media" && (
					<div className="space-y-3">
						<div className="rounded-lg border border-dashed border-[color:var(--color-neutral-300)] bg-[color:var(--color-neutral-50)] p-3">
							<label htmlFor="team-member-image-input" className="block text-xs text-[color:var(--color-neutral-600)] mb-2">Profile Image</label>
							<div className="flex items-center gap-3">
								{previewUrl ? (
									<img src={previewUrl} alt="Profile preview" className="h-20 w-20 rounded-lg object-cover ring-1 ring-[color:var(--color-neutral-200)]" />
								) : (
									<div className="h-20 w-20 flex items-center justify-center rounded-lg bg-white text-[color:var(--color-neutral-400)] ring-1 ring-[color:var(--color-neutral-200)]">
										No image
									</div>
								)}
								<div className="flex-1">
									<p className="text-xs text-[color:var(--color-neutral-600)]">Upload a profile image for this team member.</p>
									<div className="mt-2 flex items-center gap-2">
										<input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="team-member-image-input" />
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

				{/* Tab: Visibility */}
				{activeTab === "visibility" && (
					<div className="space-y-3">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<Select 
								label="Status" 
								hint="Controls whether this team member is visible to users." 
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
								const cleaned: ManagementTeamFormValues = { ...values };
								onSubmit(cleaned);
							}}
							disabled={disabled || isLoading}
						>
							{isLoading
								? mode === "edit" ? "Saving..." : "Creating..."
								: mode === "edit" ? "Save changes" : "Create"}
						</Button>
					)}
				</div>
			</form>
		</Modal>
	);
}
