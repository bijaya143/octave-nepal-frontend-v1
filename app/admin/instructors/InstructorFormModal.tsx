"use client";
import React from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { X } from "lucide-react";
import Image from "next/image";

// Address input type matching backend
export type InstructorAddressInput = {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
};


// Billing input type matching backend
export type InstructorBillingInput = {
  billingEmail?: string;
  billingAddress?: string;
  billingPaymentMethod?: string;
  billingTaxId?: string;
};

export type InstructorFormValues = {
	firstName: string;
    middleName?: string;
    lastName: string;
	email: string;
	bio: string;
	isActive: boolean;
	isVerified?: boolean;
	isSuspended?: boolean;
	isFeatured?: boolean;
	avatarFile: File | null;
    skills: string[];
    phoneNumber?: string;
    phoneCountryCode?: string;
    role?: string;
    experience?: string; // years of experience as string to match edit profile
    address?: InstructorAddressInput;
    socialLinks?: Array<{ name: string; url: string }>;
    billing?: InstructorBillingInput;
};

type InstructorFormModalProps = {
	open: boolean;
	onClose: () => void;
	onSubmit: (values: InstructorFormValues) => void;
	title?: string;
	mode?: "create" | "edit";
	initialValues?: Partial<InstructorFormValues>;
	initialAvatarUrl?: string; // for edit preview
    isLoading?: boolean;
};

const DEFAULTS: InstructorFormValues = {
	firstName: "",
    middleName: "",
    lastName: "",
	email: "",
	bio: "",
	isActive: true,
	isVerified: false,
	isSuspended: false,
	isFeatured: false,
	avatarFile: null,
    skills: [],
    phoneNumber: "",
    phoneCountryCode: "",
    role: "",
    experience: "",
    address: {
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
    },
    socialLinks: [],
    billing: {
        billingEmail: "",
        billingAddress: "",
        billingPaymentMethod: "",
        billingTaxId: "",
    },
};

export default function InstructorFormModal({ open, onClose, onSubmit, title, mode = "create", initialValues, initialAvatarUrl, isLoading = false }: InstructorFormModalProps) {
	const [values, setValues] = React.useState<InstructorFormValues>({ ...DEFAULTS, ...initialValues });
	const [previewAvatarUrl, setPreviewAvatarUrl] = React.useState<string>(initialAvatarUrl || "");
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	const [expertiseInput, setExpertiseInput] = React.useState("");
	const [activeTab, setActiveTab] = React.useState<"profile" | "contact" | "role" | "skills" | "status" | "billing" | "social">("profile");
	const [openSocialMenuIndex, setOpenSocialMenuIndex] = React.useState<number | null>(null);
    const platforms = React.useMemo(() => ([
        { value: "Website", placeholder: "https://your-site.com", icon: "/images/social-medias/internet.png" },
        { value: "LinkedIn", placeholder: "https://www.linkedin.com/in/username", icon: "/images/social-medias/linkedin.png" },
        { value: "X", placeholder: "https://x.com/username", icon: "/images/social-medias/twitter.png" },
        { value: "Facebook", placeholder: "https://www.facebook.com/username", icon: "/images/social-medias/facebook.png" },
        { value: "Instagram", placeholder: "https://www.instagram.com/username", icon: "/images/social-medias/instagram.png" },
        { value: "YouTube", placeholder: "https://www.youtube.com/@channel", icon: "/images/social-medias/youtube.png" },
        { value: "GitHub", placeholder: "https://github.com/username", icon: "/images/social-medias/github.png" },
    ] as const), []);

	const tabs = React.useMemo(() => ([
		{ key: "profile", label: "Profile" },
		{ key: "contact", label: "Contact" },
		{ key: "role", label: "Role" },
		{ key: "skills", label: "Skills" },
		{ key: "status", label: "Status" },
		{ key: "billing", label: "Billing" },
		{ key: "social", label: "Social" },
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

	// Minimal outside-click and Escape handling for Social dropdown
	React.useEffect(() => {
		if (activeTab !== "social") { setOpenSocialMenuIndex(null); return; }
		function handleDocumentClick(ev: MouseEvent) {
			const target = ev.target as HTMLElement | null;
			if (!target) return;
			if (!target.closest(".social-picker")) setOpenSocialMenuIndex(null);
		}
		function handleKeydown(ev: KeyboardEvent) {
			if (ev.key === "Escape") setOpenSocialMenuIndex(null);
		}
		document.addEventListener("click", handleDocumentClick, { passive: true });
		document.addEventListener("keydown", handleKeydown);
		return () => {
			document.removeEventListener("click", handleDocumentClick as EventListener);
			document.removeEventListener("keydown", handleKeydown as EventListener);
		};
	}, [activeTab]);

	function capitalizeFirstAlphabet(text: string): string {
		if (!text) return text;
		const first = text.charAt(0);
		if (/[a-zA-Z]/.test(first)) {
			return first.toUpperCase() + text.slice(1);
		}
		return text;
	}

    function addExpertise(name: string) {
		const trimmed = name.trim();
		const normalized = capitalizeFirstAlphabet(trimmed);
		if (!normalized) return;
		const exists = (values.skills || []).some((t) => t.toLowerCase() === normalized.toLowerCase());
		if (exists) return;
		handleChange("skills", [ ...(values.skills || []), normalized ]);
	}

    function removeExpertise(name: string) {
        handleChange("skills", (values.skills || []).filter((t) => t.toLowerCase() !== name.toLowerCase()));
	}

	function handleChange<K extends keyof InstructorFormValues>(key: K, value: InstructorFormValues[K]) {
		setValues((v) => ({ ...v, [key]: value }));
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) {
			handleChange("avatarFile", file);
			const url = URL.createObjectURL(file);
			setPreviewAvatarUrl((prev) => {
				if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
				return url;
			});
		}
	}

	function clearAvatar() {
		handleChange("avatarFile", null);
		if (previewAvatarUrl?.startsWith("blob:")) URL.revokeObjectURL(previewAvatarUrl);
		setPreviewAvatarUrl("");
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

function handleFormSubmit(e: React.FormEvent) {
    // Block any native submission entirely; we submit explicitly from the final button
    e.preventDefault();
}

	const disabled = !values.firstName || !values.lastName || !values.email;

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
		<Modal open={open} onClose={onClose} title={title ?? (mode === "edit" ? "Edit Instructor" : "Create Instructor") }>
			<form onSubmit={handleFormSubmit} noValidate className="space-y-5 text-sm">
				{/* Tabs */}
				<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-1">
					<div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1">
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
                                <Input label="Last Name" value={values.lastName} onChange={(e) => handleChange("lastName", e.target.value)} placeholder="Last name" required />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<Input label="Email" type="email" value={values.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="name@example.com" required />
							</div>
						</div>

						<div className="space-y-3">
							<div className="rounded-lg border border-dashed border-[color:var(--color-neutral-300)] bg-[color:var(--color-neutral-50)] p-3">
								<label htmlFor="instructor-avatar-input" className="block text-xs text-[color:var(--color-neutral-600)] mb-2">Avatar</label>
								<div className="flex items-center gap-3">
									{previewAvatarUrl ? (
										<img src={previewAvatarUrl} alt="Preview" className="h-20 w-20 rounded-full object-cover ring-1 ring-[color:var(--color-neutral-200)]" />
									) : (
										<div className="h-20 w-20 flex items-center justify-center rounded-full bg-white text-[color:var(--color-neutral-400)] ring-1 ring-[color:var(--color-neutral-200)]">No image</div>
									)}
									<div className="flex-1">
										<p className="text-xs text-[color:var(--color-neutral-600)]">Upload a square image for the instructor.</p>
										<div className="mt-2 flex items-center gap-2">
											<input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="instructor-avatar-input" />
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
							<Textarea label="Bio" value={values.bio} onChange={(e) => handleChange("bio", e.target.value)} placeholder="Short bio" rows={3} />
						</div>
					</div>
				)}

				{/* Tab: Contact */}
				{activeTab === "contact" && (
					<div className="space-y-3">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input label="Phone number" type="tel" inputMode="tel" value={values.phoneNumber || ""} onChange={(e) => handleChange("phoneNumber", e.target.value)} placeholder="98X XXX XXXX" />
                            <Input label="Country Code" value={values.phoneCountryCode || ""} onChange={(e) => handleChange("phoneCountryCode", e.target.value)} placeholder="+977" />
						</div>

                        <div className="space-y-3">
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
                            <Input label="Role" value={values.role || ""} onChange={(e) => handleChange("role", e.target.value)} placeholder="Senior Web Instructor" />
                            <Input label="Experience (years)" type="number" inputMode="numeric" min={1} step={1} value={values.experience || ""} onChange={(e) => handleChange("experience", e.target.value)} placeholder="5" />
						</div>
					</div>
				)}

				{/* Tab: Skills */}
				{activeTab === "skills" && (
					<div className="space-y-3">
						{values.skills.length > 0 ? (
							<div className="flex flex-wrap gap-1.5">
								{values.skills.map((s) => (
							<Badge key={s} variant="outline" className="text-sm gap-1.5 px-3 py-1.5">
										{s}
								<button
									type="button"
									aria-label="Remove skill"
									title="Remove"
									className="group inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full p-0 border-0 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-200)] hover:bg-[color:var(--color-primary-50)]"
									onClick={() => removeExpertise(s)}
								>
									<X className="h-3.5 w-3.5 text-[color:var(--color-neutral-500)] group-hover:text-[color:var(--color-neutral-800)]" aria-hidden />
								</button>
									</Badge>
								))}
							</div>
						) : (
							<p className="text-[11px] text-[color:var(--color-neutral-500)]">No skills added</p>
						)}
						<div>
							<Input
								placeholder="Type skill and press Enter"
								value={expertiseInput}
							onChange={(e) => setExpertiseInput(capitalizeFirstAlphabet(e.target.value))}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										addExpertise(expertiseInput);
										setExpertiseInput("");
									}
								}}
							/>
						</div>
					</div>
				)}

				{/* Tab: Status & flags */}
				{activeTab === "status" && (
					<div className="space-y-3">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Select label="Account Status" hint="Mark the instructor as actively participating in the platform." value={values.isActive ? "Active" : "Inactive"} onChange={(e) => handleChange("isActive", e.target.value === "Active") }>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </Select>
                            <Select label="Verification" hint="Mark instructors with identity or credential verification." value={values.isVerified ? "Verified" : "Unverified"} onChange={(e) => handleChange("isVerified", e.target.value === "Verified") }>
                                <option value="Verified">Verified</option>
                                <option value="Unverified">Unverified</option>
                            </Select>
                            <Select label="Suspension" hint="Temporarily disable instructor activities." value={values.isSuspended ? "Suspended" : "Active"} onChange={(e) => handleChange("isSuspended", e.target.value === "Suspended") }>
                                <option value="Active">Active</option>
                                <option value="Suspended">Suspended</option>
                            </Select>
                            <Select label="Featured" hint="Highlight this instructor in discovery surfaces." value={values.isFeatured ? "Featured" : "Not Featured"} onChange={(e) => handleChange("isFeatured", e.target.value === "Featured") }>
                                <option value="Featured">Featured</option>
                                <option value="Not Featured">Not Featured</option>
                            </Select>
						</div>
					</div>
				)}

				{/* Tab: Billing */}
				{activeTab === "billing" && (
					<div className="space-y-3">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input
                                label="Billing Email"
                                hint="Email for billing and payment notifications."
                                type="email"
                                value={values.billing?.billingEmail || ""}
                                onChange={(e) => handleChange("billing", { ...values.billing, billingEmail: e.target.value })}
                                placeholder="billing@example.com"
                            />
                             <Input
                                label="Tax ID / PAN"
                                hint="Tax identification number for compliance."
								value={values.billing?.billingTaxId || ""}
								onChange={(e) => handleChange("billing", { ...values.billing, billingTaxId: e.target.value })}
								placeholder="123456789"
							/>
						</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Select
                                label="Payment Method"
                                hint="Preferred payment method for payouts."
                                value={values.billing?.billingPaymentMethod || ""}
                                onChange={(e) => handleChange("billing", { ...values.billing, billingPaymentMethod: e.target.value })}
                            >
                                <option value="">Select payment method</option>
                                <option value="QR">QR</option>
                                <option value="BANK_TRANSFER">Bank Transfer</option>
                                <option value="ONLINE_BANKING">Online Banking</option>
                                <option value="CARD">Card</option>
                                <option value="WALLET">Wallet</option>
                                <option value="OTHER">Other</option>
                            </Select>
                        </div>

						<div className="space-y-2">
							<Textarea
                                label="Billing Address"
                                hint="Complete address for tax and billing purposes."
								value={values.billing?.billingAddress || ""}
								onChange={(e) => handleChange("billing", { ...values.billing, billingAddress: e.target.value })}
								placeholder="Street address, city, state, postal code, country"
								rows={3}
							/>
						</div>
					</div>
				)}

				{/* Tab: Social */}
				{activeTab === "social" && (
					<div className="space-y-3 min-h-[45vh]">
						<div className="space-y-3">
							{(values.socialLinks || []).map((item, idx) => {
								const current = platforms.find((p) => p.value === item.name) || platforms[0];
								return (
									<div key={idx} className="grid grid-cols-1 sm:grid-cols-[160px_1fr_auto] gap-2 items-center">
										{/* Platform picker */}
										<div className="relative social-picker">
											<button
												type="button"
												className="h-11 w-full rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 shadow-xs hover:bg-[color:var(--color-neutral-50)] inline-flex items-center justify-between gap-2"
												aria-haspopup="listbox"
												aria-expanded={false}
												onClick={() => setOpenSocialMenuIndex(openSocialMenuIndex === idx ? null : idx)}
											>
												<span className="inline-flex items-center gap-2 text-sm">
													<Image src={current.icon} alt="" width={18} height={18} className="h-[18px] w-[18px] object-contain" aria-hidden />
													{current.value}
												</span>
												<svg className="h-4 w-4 text-[color:var(--color-neutral-500)]" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
													<path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
												</svg>
											</button>
										<div className={`${openSocialMenuIndex === idx ? "" : "hidden"} absolute z-50 mt-1 w-full rounded-lg border border-[color:var(--color-neutral-200)] bg-white shadow-md`}>
										<ul className="py-1 max-h-72 overflow-auto scroll-elegant">
													{platforms.map((p) => (
														<li key={p.value}>
															<button
																type="button"
																className="w-full px-3 py-2 text-left hover:bg-[color:var(--color-neutral-50)] inline-flex items-center gap-2 text-sm"
																onClick={(ev) => {
																	const next = (values.socialLinks || []).slice();
																	next[idx] = { ...next[idx], name: p.value };
																	handleChange("socialLinks", next);
															// close menu
															setOpenSocialMenuIndex(null);
																}}
																role="option"
																aria-selected={p.value === item.name}
															>
															<Image src={p.icon} alt="" width={18} height={18} className="h-[18px] w-[18px] object-contain" aria-hidden />
															{p.value}
														</button>
													</li>
												))}
											</ul>
										</div>
									</div>
									<Input
										type="url"
										placeholder={current.placeholder}
										value={item.url}
										onChange={(e) => {
											const next = (values.socialLinks || []).slice();
											next[idx] = { ...next[idx], url: e.currentTarget.value };
											handleChange("socialLinks", next);
										}}
									/>
									<Button
										type="button"
										variant="secondary"
										size="md"
										onClick={() => {
											const next = (values.socialLinks || []).filter((_, i) => i !== idx);
											handleChange("socialLinks", next);
										}}
									>
										Remove
									</Button>
								</div>
							);
						})}
						<div>
							<Button
								type="button"
								variant="secondary"
								size="sm"
								onClick={() => {
									handleChange("socialLinks", [ ...(values.socialLinks || []), {  name: platforms[0].value, url: "" } ]);
								}}
							>
								Add link
							</Button>
						</div>
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

