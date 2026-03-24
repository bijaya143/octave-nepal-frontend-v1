"use client";
import React from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import { Grip } from "lucide-react";

export type HiringFormValues = {
	title: string;
	department: string;
	location: string;
	type: "Full-time" | "Part-time" | "Contract" | "Internship";
	level: "Entry" | "Mid" | "Senior" | "Lead" | "Executive";
	workArrangement: "On-site" | "Remote" | "Hybrid";
	isPaid: "Paid" | "Unpaid";
	salary: string;
	numberOfPositions: number;
	startDate: string;
	endDate: string;
	description: string;
	requirements: string[];
	status: "Open" | "Closed" | "On Hold" | "Draft";
};

type HiringFormModalProps = {
	open: boolean;
	onClose: () => void;
	onSubmit: (values: HiringFormValues) => void;
	title?: string;
	mode?: "create" | "edit";
	initialValues?: Partial<HiringFormValues>;
};

const DEFAULTS: HiringFormValues = {
	title: "",
	department: "",
	location: "",
	type: "Full-time",
	level: "Mid",
	workArrangement: "On-site",
	isPaid: "Paid",
	salary: "",
	numberOfPositions: 1,
	startDate: "",
	endDate: "",
	description: "",
	requirements: [],
	status: "Open",
};

const TYPE_OPTIONS = [
	{ value: "Full-time", label: "Full-time" },
	{ value: "Part-time", label: "Part-time" },
	{ value: "Contract", label: "Contract" },
	{ value: "Internship", label: "Internship" },
];

const LEVEL_OPTIONS = [
	{ value: "Entry", label: "Entry Level" },
	{ value: "Mid", label: "Mid Level" },
	{ value: "Senior", label: "Senior Level" },
	{ value: "Lead", label: "Lead" },
	{ value: "Executive", label: "Executive" },
];

const WORK_ARRANGEMENT_OPTIONS = [
	{ value: "On-site", label: "On-site" },
	{ value: "Remote", label: "Remote" },
	{ value: "Hybrid", label: "Hybrid" },
];

const PAID_OPTIONS = [
	{ value: "Paid", label: "Paid" },
	{ value: "Unpaid", label: "Unpaid" },
];

const STATUS_OPTIONS = [
	{ value: "Open", label: "Open" },
	{ value: "Closed", label: "Closed" },
	{ value: "On Hold", label: "On Hold" },
	{ value: "Draft", label: "Draft" },
];

function DraggableRequirement({
	requirement,
	index,
	onUpdate,
	onRemove,
	onMove
}: {
	requirement: string;
	index: number;
	onUpdate: (index: number, value: string) => void;
	onRemove: (index: number) => void;
	onMove: (fromIndex: number, toIndex: number) => void;
}) {
	const [isDragging, setIsDragging] = React.useState(false);
	const [isDraggedOver, setIsDraggedOver] = React.useState(false);

	function handleDragStart(e: React.DragEvent) {
		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData("text/html", e.currentTarget.outerHTML);
		e.dataTransfer.setData("text/plain", index.toString());
		setIsDragging(true);
	}

	function handleDragEnd() {
		setIsDragging(false);
		setIsDraggedOver(false);
	}

	function handleDragOver(e: React.DragEvent) {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
		setIsDraggedOver(true);
	}

	function handleDragLeave() {
		setIsDraggedOver(false);
	}

	function handleDrop(e: React.DragEvent) {
		e.preventDefault();
		setIsDraggedOver(false);
		setIsDragging(false);

		const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
		const toIndex = index;

		if (fromIndex !== toIndex) {
			onMove(fromIndex, toIndex);
		}
	}

	return (
		<div
			draggable
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			className={`flex items-center gap-2 p-2 rounded-md transition-all ${
				isDragging ? "opacity-50" : ""
			} ${
				isDraggedOver ? "bg-[color:var(--color-primary-50)] border border-[color:var(--color-primary-200)]" : ""
			}`}
		>
			<div className="cursor-grab active:cursor-grabbing text-[color:var(--color-neutral-400)] hover:text-[color:var(--color-neutral-600)]">
				<Grip size={16} />
			</div>
			<Input
				value={requirement}
				onChange={(e) => onUpdate(index, e.target.value)}
				placeholder="e.g. 3+ years of React experience"
				className="flex-1"
			/>
			<Button
				type="button"
				variant="secondary"
				className="text-red-600 border-red-200 hover:bg-red-50 px-2 py-1 h-9"
				onClick={() => onRemove(index)}
				title="Remove requirement"
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</Button>
		</div>
	);
}

function AddRequirementInput({ onAdd }: { onAdd: (requirement: string) => void }) {
	const [newRequirement, setNewRequirement] = React.useState("");

	function handleAdd() {
		if (newRequirement.trim()) {
			onAdd(newRequirement.trim());
			setNewRequirement("");
		}
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAdd();
		}
	}

	return (
		<div className="flex items-center gap-2">
			<Input
				value={newRequirement}
				onChange={(e) => setNewRequirement(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="Add a requirement..."
				className="flex-1"
			/>
			<Button
				type="button"
				variant="secondary"
				onClick={handleAdd}
				disabled={!newRequirement.trim()}
				className="px-3 py-1 h-9"
				title="Add requirement"
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<line x1="12" y1="5" x2="12" y2="19"></line>
					<line x1="5" y1="12" x2="19" y2="12"></line>
				</svg>
			</Button>
		</div>
	);
}

export default function HiringFormModal({
	open,
	onClose,
	onSubmit,
	title,
	mode = "create",
	initialValues
}: HiringFormModalProps) {
	const [values, setValues] = React.useState<HiringFormValues>({ ...DEFAULTS, ...initialValues });
	const [activeTab, setActiveTab] = React.useState<"basic" | "details" | "description" | "settings">("basic");
	const tabs = React.useMemo(() => ([
		{ key: "basic", label: "Basic Info" },
		{ key: "details", label: "Details" },
		{ key: "description", label: "Description" },
		{ key: "settings", label: "Settings" },
	] as const), []);

	React.useEffect(() => {
		setValues({ ...DEFAULTS, ...initialValues });
		setActiveTab("basic");
	}, [initialValues, open]);

	function handleChange<K extends keyof HiringFormValues>(key: K, value: HiringFormValues[K]) {
		setValues((prev) => ({ ...prev, [key]: value }));
	}

	function addRequirement(requirement: string) {
		if (requirement.trim()) {
			handleChange("requirements", [...values.requirements, requirement.trim()]);
		}
	}

	function removeRequirement(index: number) {
		handleChange("requirements", values.requirements.filter((_, i) => i !== index));
	}

	function updateRequirement(index: number, requirement: string) {
		const newRequirements = [...values.requirements];
		newRequirements[index] = requirement;
		handleChange("requirements", newRequirements);
	}

	function moveRequirement(fromIndex: number, toIndex: number) {
		const newRequirements = [...values.requirements];
		const [moved] = newRequirements.splice(fromIndex, 1);
		newRequirements.splice(toIndex, 0, moved);
		handleChange("requirements", newRequirements);
	}

	const disabled = !values.title.trim() || !values.department.trim() || !values.location.trim();

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
		<Modal open={open} onClose={onClose} title={title || `${mode === "edit" ? "Edit" : "Create"} Job Position`}>
			<form onSubmit={handleFormSubmit} noValidate className="space-y-5 text-sm">
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

				{activeTab === "basic" && (
					<div className="space-y-3">
						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Job Title</label>
								<Input
									value={values.title}
									onChange={(e) => handleChange("title", e.target.value)}
									placeholder="e.g. Frontend Developer"
									required
								/>
							</div>
							<div>
								<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Department</label>
								<Input
									value={values.department}
									onChange={(e) => handleChange("department", e.target.value)}
									placeholder="e.g. Engineering"
									required
								/>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Location</label>
								<Input
									value={values.location}
									onChange={(e) => handleChange("location", e.target.value)}
									placeholder="e.g. Kathmandu, Nepal"
									required
								/>
							</div>
							<div>
								<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Employment Type</label>
								<Select
									value={values.type}
									onChange={(e) => handleChange("type", e.target.value as HiringFormValues["type"])}
								>
									{TYPE_OPTIONS.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</Select>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Experience Level</label>
								<Select
									value={values.level}
									onChange={(e) => handleChange("level", e.target.value as HiringFormValues["level"])}
								>
									{LEVEL_OPTIONS.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</Select>
							</div>
							<div>
								<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Work Arrangement</label>
								<Select
									value={values.workArrangement}
									onChange={(e) => handleChange("workArrangement", e.target.value as HiringFormValues["workArrangement"])}
								>
									{WORK_ARRANGEMENT_OPTIONS.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</Select>
							</div>
						</div>
					</div>
				)}

				{activeTab === "details" && (
					<div className="space-y-3">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<div>
								<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Compensation Type</label>
								<Select
									value={values.isPaid}
									onChange={(e) => handleChange("isPaid", e.target.value as HiringFormValues["isPaid"])}
								>
									{PAID_OPTIONS.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</Select>
								<p className="mt-1 text-[10px] text-[color:var(--color-neutral-500)]">Choose whether this position is paid or unpaid.</p>
							</div>
							<div>
								<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Number of Positions</label>
								<Input
									type="number"
									min="1"
									value={values.numberOfPositions}
									onChange={(e) => handleChange("numberOfPositions", parseInt(e.target.value) || 1)}
									placeholder="1"
								/>
								<p className="mt-1 text-[10px] text-[color:var(--color-neutral-500)]">How many positions are you hiring for this role?</p>
							</div>
						</div>
						{values.isPaid === "Paid" && (
							<div>
								<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Salary Range</label>
								<Input
									value={values.salary}
									onChange={(e) => handleChange("salary", e.target.value)}
									placeholder="e.g. Rs 50,000 - 80,000"
								/>
								<p className="mt-1 text-[10px] text-[color:var(--color-neutral-500)]">Specify the salary range for this position.</p>
							</div>
						)}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<div>
								<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Start Date</label>
								<Input
									type="date"
									value={values.startDate}
									onChange={(e) => handleChange("startDate", e.target.value)}
								/>
								<p className="mt-1 text-[10px] text-[color:var(--color-neutral-500)]">When should this position become active?</p>
							</div>
							<div>
								<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">End Date (Optional)</label>
								<Input
									type="date"
									value={values.endDate}
									onChange={(e) => handleChange("endDate", e.target.value)}
								/>
								<p className="mt-1 text-[10px] text-[color:var(--color-neutral-500)]">When does this position close? Leave empty for ongoing.</p>
							</div>
						</div>
					</div>
				)}

				{activeTab === "description" && (
					<div className="space-y-3">
						<div>
							<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Job Description</label>
							<Textarea
								value={values.description}
								onChange={(e) => handleChange("description", e.target.value)}
								placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
								rows={6}
							/>
							<p className="mt-1 text-[10px] text-[color:var(--color-neutral-500)]">Provide a detailed description of the role and responsibilities.</p>
						</div>
						<div>
							<label className="block text-xs text-[color:var(--color-neutral-600)] mb-2">Requirements</label>
							<div className="space-y-2">
								{values.requirements.map((requirement, index) => (
									<DraggableRequirement
										key={index}
										requirement={requirement}
										index={index}
										onUpdate={updateRequirement}
										onRemove={removeRequirement}
										onMove={moveRequirement}
									/>
								))}
								<AddRequirementInput onAdd={addRequirement} />
							</div>
							<p className="mt-2 text-[10px] text-[color:var(--color-neutral-500)]">Drag to reorder, click to edit, or use the X to remove requirements.</p>
						</div>
					</div>
				)}

				{activeTab === "settings" && (
					<div className="space-y-3">
						<div>
							<label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Status</label>
							<Select
								value={values.status}
								onChange={(e) => handleChange("status", e.target.value as HiringFormValues["status"])}
							>
								{STATUS_OPTIONS.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</Select>
							<p className="mt-1 text-[10px] text-[color:var(--color-neutral-500)]">Controls the visibility and status of this job position.</p>
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
								const cleaned: HiringFormValues = { ...values };
								onSubmit(cleaned);
							}}
							disabled={disabled}
						>
							{mode === "edit" ? "Save changes" : "Create Position"}
						</Button>
					)}
				</div>
			</form>
		</Modal>
	);
}
