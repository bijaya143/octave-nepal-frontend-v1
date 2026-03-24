"use client";
import React from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export type ManagementTeamFormValues = {
	name: string;
	position: string;
	email?: string;
	order: number;
	imageFile?: File | null;
};

type ManagementTeamFormModalProps = {
	open: boolean;
	onClose: () => void;
	onSubmit: (values: ManagementTeamFormValues) => void;
	title?: string;
	mode?: "create" | "edit";
	initialValues?: Partial<ManagementTeamFormValues>;
	initialImageUrl?: string;
};

const DEFAULTS: ManagementTeamFormValues = {
	name: "",
	position: "",
	email: "",
	order: 0,
	imageFile: null,
};

export default function ManagementTeamFormModal({
	open,
	onClose,
	onSubmit,
	title,
	mode = "create",
	initialValues,
	initialImageUrl
}: ManagementTeamFormModalProps) {
	const [values, setValues] = React.useState<ManagementTeamFormValues>({ ...DEFAULTS, ...initialValues });
	const [previewUrl, setPreviewUrl] = React.useState<string>(initialImageUrl || "");
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		setValues({ ...DEFAULTS, ...initialValues });
		setPreviewUrl(initialImageUrl || "");
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
		handleChange("imageFile", file);
		if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
		setPreviewUrl(file ? URL.createObjectURL(file) : "");
	}

	function clearImage() {
		handleChange("imageFile", null);
		setPreviewUrl("");
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	const disabled = !values.name.trim() || !values.position.trim();

	function handleFormSubmit(e: React.FormEvent) { e.preventDefault(); }

	return (
		<Modal open={open} onClose={onClose} title={title || `${mode === "edit" ? "Edit" : "Add"} Team Member`}>
			<form onSubmit={handleFormSubmit} noValidate className="space-y-5 text-sm">
				<div className="space-y-3">
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Name</label>
							<Input
								value={values.name}
								onChange={(e) => handleChange("name", e.target.value)}
								placeholder="Full name"
								required
							/>
						</div>
						<div>
							<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Position</label>
							<Input
								value={values.position}
								onChange={(e) => handleChange("position", e.target.value)}
								placeholder="Job title"
								required
							/>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Email</label>
							<Input
								type="email"
								value={values.email}
								onChange={(e) => handleChange("email", e.target.value)}
								placeholder="email@octavenepal.com"
							/>
						</div>
						<div>
							<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Display Order</label>
							<Input
								type="number"
								value={values.order}
								onChange={(e) => handleChange("order", parseInt(e.target.value) || 0)}
								placeholder="1"
								min="0"
								required
							/>
						</div>
					</div>
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

				<div className="flex items-center justify-end gap-2 pt-3 border-t border-[color:var(--color-neutral-200)]">
					<Button
						type="button"
						onClick={() => {
							const cleaned: ManagementTeamFormValues = { ...values };
							onSubmit(cleaned);
						}}
						disabled={disabled}
					>
						{mode === "edit" ? "Save changes" : "Create"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
