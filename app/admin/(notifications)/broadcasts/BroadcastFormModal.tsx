"use client";
import React from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";

export type BroadcastFormValues = {
	title: string;
	message: string;
	targetAudience: "all" | "students" | "instructors" | "admins";
	testEmails: string;
};

type BroadcastFormModalProps = {
	open: boolean;
	onClose: () => void;
	onSubmit: (values: BroadcastFormValues) => void;
	onTest?: (values: BroadcastFormValues) => void;
	title?: string;
	mode?: "create" | "edit";
	initialValues?: Partial<BroadcastFormValues>;
};

const DEFAULTS: BroadcastFormValues = {
	title: "",
	message: "",
	targetAudience: "all",
	testEmails: "",
};

export default function BroadcastFormModal({
	open,
	onClose,
	onSubmit,
	onTest,
	title,
	mode = "create",
	initialValues,
}: BroadcastFormModalProps) {
	const [values, setValues] = React.useState<BroadcastFormValues>({ ...DEFAULTS, ...initialValues });

	React.useEffect(() => {
		setValues({ ...DEFAULTS, ...initialValues });
	}, [initialValues, open]);

	function handleChange<K extends keyof BroadcastFormValues>(key: K, value: BroadcastFormValues[K]) {
		setValues((prev) => ({ ...prev, [key]: value }));
	}

	const disabled = !values.title.trim() || !values.message.trim();

	const testDisabled = !values.title.trim() || !values.message.trim() || !values.testEmails.trim();

	function handleFormSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (disabled) return;

		onSubmit(values);
	}

	function handleTest() {
		if (testDisabled || !onTest) return;
		onTest(values);
	}

	return (
		<Modal open={open} onClose={onClose} title={title || `${mode === "edit" ? "Edit" : "Create"} Broadcast`}>
			<form onSubmit={handleFormSubmit} noValidate className="space-y-5 text-sm">
				<div className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Input
								value={values.title}
								label="Title"
								onChange={(e) => handleChange("title", e.target.value)}
								placeholder="Enter broadcast title"
								required
							/>
						</div>

						<div>
							<Select
								value={values.targetAudience}
								onChange={(e) => handleChange("targetAudience", e.target.value as BroadcastFormValues['targetAudience'])}
								label="Target Audience"
								required
							>
								<option value="all">All Users</option>
								<option value="students">Students Only</option>
								<option value="instructors">Instructors Only</option>
								<option value="admins">Admins Only</option>
							</Select>
							<p className="text-xs text-gray-500 mt-1">
								Who should receive this broadcast?
							</p>
						</div>
					</div>

					<div>
						<Textarea
							value={values.message}
							label="Message"
							onChange={(e) => handleChange("message", e.target.value)}
							placeholder="Enter your broadcast message..."
							rows={4}
							required
						/>
						<p className="text-xs text-gray-500 mt-1">
							{values.message.length}/500 characters
						</p>
					</div>

					<div>
						<Input
							value={values.testEmails}
							label="Test Email Addresses"
							onChange={(e) => handleChange("testEmails", e.target.value)}
							placeholder="test@example.com, test2@example.com"
						/>
						<p className="text-xs text-gray-500 mt-1">
							Comma-separated email addresses for testing (optional)
						</p>
					</div>
				</div>

				<div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
					<Button type="button" variant="secondary" onClick={handleTest} disabled={testDisabled}>
						Test
					</Button>
					<Button type="submit" disabled={disabled}>
						{mode === "edit" ? "Update" : "Create"} Broadcast
					</Button>
				</div>
			</form>
		</Modal>
	);
}
