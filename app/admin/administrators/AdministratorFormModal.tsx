"use client";
import React from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { AdminRoleType } from "@/lib/services/admin/self";

// Address input type matching backend AdminAddressInput
export type AdminAddressInput = {
	addressLine1?: string;
	addressLine2?: string;
	city?: string;
	state?: string;
	zipCode?: string;
	country?: string;
};

export type AdministratorFormValues = {
	firstName: string;
	middleName?: string;
	lastName?: string;
	email: string;
	phoneNumber?: string;
	phoneCountryCode?: string;
	bio?: string;
	address?: AdminAddressInput;
	roleType: AdminRoleType;
	isActive?: boolean;
	isVerified?: boolean;
	isSuspended?: boolean;
	profilePicture?: File | null;
};

type AdministratorFormModalProps = {
	open: boolean;
	onClose: () => void;
	onSubmit: (values: AdministratorFormValues) => void;
	title?: string;
	mode?: "create" | "edit";
	initialValues?: Partial<AdministratorFormValues>;
	initialAvatarUrl?: string; // for edit preview
	isLoading?: boolean;
};

const DEFAULTS: AdministratorFormValues = {
	firstName: "",
	middleName: "",
	lastName: "",
	email: "",
	phoneNumber: "",
	phoneCountryCode: "",
	bio: "",
	address: {
		addressLine1: "",
		addressLine2: "",
		city: "",
		state: "",
		zipCode: "",
		country: "",
	},
	roleType: AdminRoleType.ADMIN,
	isActive: true,
	isVerified: false,
	isSuspended: false,
	profilePicture: null,
};

export default function AdministratorFormModal({
	open,
	onClose,
	onSubmit,
	title,
	mode = "create",
	initialValues,
	initialAvatarUrl,
	isLoading = false,
}: AdministratorFormModalProps) {
	const [values, setValues] = React.useState<AdministratorFormValues>({ ...DEFAULTS, ...initialValues });
	const [previewAvatarUrl, setPreviewAvatarUrl] = React.useState<string>(initialAvatarUrl || "");
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	const [activeTab, setActiveTab] = React.useState<"profile" | "contact" | "role" | "status">("profile");

	const tabs = React.useMemo(() => ([
		{ key: "profile", label: "Profile" },
		{ key: "contact", label: "Contact" },
		{ key: "role", label: "Role" },
		{ key: "status", label: "Status" },
	] as const), []);

	// Reset tab when modal opens
	React.useEffect(() => {
		if (open) {
			setActiveTab("profile");
		}
	}, [open]);

	// Update values when initialValues change (or when opening)
	React.useEffect(() => {
		if (open) {
			setValues({ ...DEFAULTS, ...initialValues });
			setPreviewAvatarUrl(initialAvatarUrl || "");
		}
	}, [open, initialValues, initialAvatarUrl]);

	React.useEffect(() => {
		return () => {
			if (previewAvatarUrl?.startsWith("blob:")) URL.revokeObjectURL(previewAvatarUrl);
		};
	}, [previewAvatarUrl]);

	function handleChange<K extends keyof AdministratorFormValues>(key: K, value: AdministratorFormValues[K]) {
		setValues((v) => ({ ...v, [key]: value }));
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) {
			handleChange("profilePicture", file);
			const url = URL.createObjectURL(file);
			setPreviewAvatarUrl((prev) => {
				if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
				return url;
			});
		}
	}

	function clearAvatar() {
		handleChange("profilePicture", null);
		if (previewAvatarUrl?.startsWith("blob:")) URL.revokeObjectURL(previewAvatarUrl);
		setPreviewAvatarUrl("");
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	function handleFormSubmit(e: React.FormEvent) {
		e.preventDefault();
	}

	const disabled = !values.firstName || !values.email;

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
		<Modal open={open} onClose={onClose} title={title ?? (mode === "edit" ? "Edit Administrator" : "Create Administrator")}>
			<form onSubmit={handleFormSubmit} noValidate className="space-y-5 text-sm">
				{/* Tabs */}
				<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-1">
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
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

				{/* Tab: Profile (Details, Photo, Bio) */}
				{activeTab === "profile" && (
					<div className="space-y-5">
						<div className="space-y-3">
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
								<Input label="First Name" value={values.firstName} onChange={(e) => handleChange("firstName", e.target.value)} placeholder="First name" required />
								<Input label="Middle Name" value={values.middleName || ""} onChange={(e) => handleChange("middleName", e.target.value)} placeholder="Middle name" />
								<Input label="Last Name" value={values.lastName || ""} onChange={(e) => handleChange("lastName", e.target.value)} placeholder="Last name" required/>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<Input label="Email" type="email" value={values.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="name@example.com" required />
							</div>
						</div>

						<div className="space-y-3">
							<div className="rounded-lg border border-dashed border-[color:var(--color-neutral-300)] bg-[color:var(--color-neutral-50)] p-3">
								<label htmlFor="admin-avatar-input" className="block text-xs text-[color:var(--color-neutral-600)] mb-2">Profile Picture</label>
								<div className="flex items-center gap-3">
									{previewAvatarUrl ? (
										<img src={previewAvatarUrl} alt="Preview" className="h-20 w-20 rounded-full object-cover ring-1 ring-[color:var(--color-neutral-200)]" />
									) : (
										<div className="h-20 w-20 flex items-center justify-center rounded-full bg-white text-[color:var(--color-neutral-400)] ring-1 ring-[color:var(--color-neutral-200)]">No image</div>
									)}
									<div className="flex-1">
										<p className="text-xs text-[color:var(--color-neutral-600)]">Upload a profile picture for the administrator.</p>
										<div className="mt-2 flex items-center gap-2">
											<input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="admin-avatar-input" />
											<Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>Browse</Button>
											{previewAvatarUrl && (
												<Button type="button" variant="secondary" className="text-red-600 border-red-200 hover:bg-red-50" onClick={clearAvatar}>Remove</Button>
											)}
										</div>
										<p className="mt-1 text-[10px] text-[color:var(--color-neutral-500)]">PNG or JPG. Max ~2MB.</p>
									</div>
								</div>
							</div>
						</div>

						<div className="space-y-2">
							<Textarea label="Bio" value={values.bio || ""} onChange={(e) => handleChange("bio", e.target.value)} placeholder="Short bio" rows={3} />
						</div>
					</div>
				)}

				{/* Tab: Contact */}
				{activeTab === "contact" && (
					<div className="space-y-3">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<Input label="Phone Number" type="tel" inputMode="tel" value={values.phoneNumber || ""} onChange={(e) => handleChange("phoneNumber", e.target.value)} placeholder="98X XXX XXXX" />
							<Input label="Country Code" value={values.phoneCountryCode || ""} onChange={(e) => handleChange("phoneCountryCode", e.target.value)} placeholder="+977" />
						</div>

						<div className="space-y-3">
							<label className="block text-xs text-[color:var(--color-neutral-600)] mb-2">Address</label>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<Input label="Address Line 1" value={values.address?.addressLine1 || ""} onChange={(e) => handleChange("address", { ...values.address, addressLine1: e.target.value })} placeholder="Street address" />
								<Input label="Address Line 2" value={values.address?.addressLine2 || ""} onChange={(e) => handleChange("address", { ...values.address, addressLine2: e.target.value })} placeholder="Apartment, suite, etc." />
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
								<Input label="City" value={values.address?.city || ""} onChange={(e) => handleChange("address", { ...values.address, city: e.target.value })} placeholder="City" />
								<Input label="State/Province" value={values.address?.state || ""} onChange={(e) => handleChange("address", { ...values.address, state: e.target.value })} placeholder="State" />
								<Input label="ZIP/Postal Code" value={values.address?.zipCode || ""} onChange={(e) => handleChange("address", { ...values.address, zipCode: e.target.value })} placeholder="ZIP code" />
							</div>
							<div>
								<Input label="Country" value={values.address?.country || ""} onChange={(e) => handleChange("address", { ...values.address, country: e.target.value })} placeholder="Country" />
							</div>
						</div>
					</div>
				)}

				{/* Tab: Role */}
				{activeTab === "role" && (
					<div className="space-y-3">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<Select label="Role Type" value={values.roleType} onChange={(e) => handleChange("roleType", e.target.value as AdminRoleType)}>
								<option value={AdminRoleType.ADMIN}>Admin</option>
								<option value={AdminRoleType.SUPER_ADMIN}>Super Admin</option>
								<option value={AdminRoleType.MODERATOR}>Moderator</option>
							</Select>
						</div>
					</div>
				)}

				{/* Tab: Status & flags */}
				{activeTab === "status" && (
					<div className="space-y-3">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<Select label="Account Status" hint="Mark the administrator as actively participating in the platform." value={values.isActive ? "Active" : "Inactive"} onChange={(e) => handleChange("isActive", e.target.value === "Active")}>
								<option value="Active">Active</option>
								<option value="Inactive">Inactive</option>
							</Select>
							<Select label="Verification" hint="Mark administrators with verified identity." value={values.isVerified ? "Verified" : "Unverified"} onChange={(e) => handleChange("isVerified", e.target.value === "Verified")}>
								<option value="Verified">Verified</option>
								<option value="Unverified">Unverified</option>
							</Select>
							<Select label="Suspension" hint="Temporarily disable administrator activities." value={values.isSuspended ? "Suspended" : "Active"} onChange={(e) => handleChange("isSuspended", e.target.value === "Suspended")}>
								<option value="Active">Active</option>
								<option value="Suspended">Suspended</option>
							</Select>
						</div>
					</div>
				)}

				<div className="flex items-center justify-end gap-2 pt-3 border-t border-[color:var(--color-neutral-200)]">
					{/* <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button> */}
					{!isFirstTab && (
						<Button type="button" variant="secondary" onClick={goPrevTab}>Previous</Button>
					)}
					{!isLastTab ? (
						<Button type="button" onClick={goNextTab}>Next</Button>
					) : (
						<Button type="button" onClick={() => onSubmit(values)} disabled={disabled || isLoading}>
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
