"use client";
import React from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = React.useState(false);
	
	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};
	
	return (
		<button
			type="button"
			onClick={handleCopy}
			className="shrink-0 p-1 rounded hover:bg-[color:var(--color-neutral-100)] transition-colors"
			title="Copy link"
			aria-label="Copy link"
		>
			{copied ? (
				<Check size={14} className="text-[color:var(--color-emerald-600)]" />
			) : (
				<Copy size={14} className="text-[color:var(--color-neutral-500)]" />
			)}
		</button>
	);
}

