"use client";
import React from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";

export type NewsletterFormValues = {
	subject: string;
	content: string;
	testEmails: string;
};

type NewsletterFormModalProps = {
	open: boolean;
	onClose: () => void;
	onSubmit: (values: NewsletterFormValues) => void;
	onTest?: (values: NewsletterFormValues) => void;
	title?: string;
	mode?: "create" | "edit";
	initialValues?: Partial<NewsletterFormValues>;
};

const DEFAULTS: NewsletterFormValues = {
	subject: "",
	content: "",
	testEmails: "",
};

export default function NewsletterFormModal({
	open,
	onClose,
	onSubmit,
	onTest,
	title,
	mode = "create",
	initialValues,
}: NewsletterFormModalProps) {
	const [values, setValues] = React.useState<NewsletterFormValues>({ ...DEFAULTS, ...initialValues });

	React.useEffect(() => {
		setValues({ ...DEFAULTS, ...initialValues });
	}, [initialValues, open]);

	function handleChange<K extends keyof NewsletterFormValues>(key: K, value: NewsletterFormValues[K]) {
		setValues((prev) => ({ ...prev, [key]: value }));
	}

	const disabled = !values.subject.trim() || !values.content.trim();

	const testDisabled = !values.subject.trim() || !values.content.trim() || !values.testEmails.trim();

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
		<Modal open={open} onClose={onClose} title={title || `${mode === "edit" ? "Edit" : "Create"} Newsletter`}>
			<form onSubmit={handleFormSubmit} noValidate className="space-y-5 text-sm">
				<div className="space-y-4">
					<div>
						<Input
							value={values.subject}
							label="Subject Line"
							onChange={(e) => handleChange("subject", e.target.value)}
							placeholder="Enter email subject"
							required
						/>
					</div>

					<div>
						<Textarea
							value={values.content}
							label="Content"
							onChange={(e) => handleChange("content", e.target.value)}
							placeholder="Enter newsletter content..."
							rows={6}
							required
						/>
						<p className="text-xs text-gray-500 mt-1">
							{values.content.length}/1000 characters
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
						{mode === "edit" ? "Update" : "Create"} Newsletter
					</Button>
				</div>
			</form>
		</Modal>
	);
}
