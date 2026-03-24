"use client";

import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Calendar, CheckCircle2, XCircle, Clock, CreditCard, RotateCcw, DollarSign, Smartphone, Building2, Pencil, Download } from "lucide-react";

type Payment = {
	id: string;
	enrollmentId: string;
	enrollmentTitle: string;
	amount: number;
	status: "Paid" | "Pending" | "Failed" | "Refunded";
	method: "Khalti" | "eSewa" | "FonePay" | "Bank Transfer" | "Connect IPS" | "Cash";
	paymentCreatedType: "automatic" | "manual";
	transactionId: string;
	fileUrls: string[];
	remarks: string;
	paidAt: string; // YYYY-MM-DD (UTC)
	createdAt: string; // YYYY-MM-DD (UTC)
};

function pad2(n: number) { return String(n).padStart(2, "0"); }
function formatUTCDate(d: Date) { return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`; }
function formatCurrency(amount: number) { return `Rs ${amount.toLocaleString()}`; }

function statusBadgeClass(status: Payment["status"]): string {
	const s = String(status).toLowerCase();
	if (s === "paid") return "bg-emerald-50 text-emerald-700 border-emerald-200";
	if (s === "pending") return "bg-amber-50 text-amber-700 border-amber-200";
	if (s === "failed") return "bg-red-50 text-red-700 border-red-200";
	if (s === "refunded") return "bg-blue-50 text-blue-700 border-blue-200";
	return "bg-gray-50 text-gray-700 border-gray-200";
}

function getMethodIcon(method: Payment["method"]) {
	const m = String(method).toLowerCase();
	if (m.includes("khalti")) return <Smartphone size={14} />;
	if (m.includes("esewa")) return <Smartphone size={14} />;
	if (m.includes("fonepay")) return <Smartphone size={14} />;
	if (m.includes("bank transfer")) return <Building2 size={14} />;
	if (m.includes("connect ips")) return <Building2 size={14} />;
	if (m.includes("cash")) return <DollarSign size={14} />;
	return <CreditCard size={14} />;
}

function getStatusIcon(status: Payment["status"]) {
	const s = String(status).toLowerCase();
	if (s === "paid") return <CheckCircle2 size={14} />;
	if (s === "pending") return <Clock size={14} />;
	if (s === "failed") return <XCircle size={14} />;
	if (s === "refunded") return <RotateCcw size={14} />;
	return <CreditCard size={14} />;
}

/**
 * Generates mock payment data with realistic patterns
 */
function getSeededPayments(): Payment[] {
	const enrollmentTitles = [
		"Introduction to React - Aayush Shrestha",
		"Advanced JavaScript - Pragati Thapa",
		"UI/UX Design Fundamentals - Rohit Karki",
		"Business Analytics - Kritika Shah",
		"Digital Marketing - Sagar Bista",
		"Python Programming - Sneha Maharjan",
		"Machine Learning Basics - Bibek Adhikari",
		"Introduction to React - Asmita Gurung"
	];

	const paymentMethods: Payment["method"][] = ["Khalti", "eSewa", "FonePay", "Bank Transfer", "Connect IPS", "Cash"];

	const BASE_UTC_MS = Date.UTC(2025, 9, 1); // 2025-10-01 UTC

	return Array.from({ length: 48 }).map((_, i) => {
		const created = new Date(BASE_UTC_MS - i * 86400000 * 7); // Spread over weeks
		const enrollmentIdx = i % enrollmentTitles.length;
		const methodIdx = i % paymentMethods.length;

		// Status distribution: Most payments are successful
		const statusWeights = ["Paid", "Paid", "Paid", "Paid", "Paid", "Pending", "Failed", "Refunded"];
		const status: Payment["status"] = statusWeights[i % statusWeights.length] as Payment["status"];

		// Amount based on enrollment (deterministic)
		const amounts = [2500, 3000, 2800, 3200, 2600, 3500, 4000, 2500];
		const amount = amounts[enrollmentIdx];

		// Paid date - only if status is Paid
		let paidAt = "";
		if (status === "Paid") {
			const paidDate = new Date(created.getTime() + Math.floor(Math.random() * 7) * 86400000);
			paidAt = formatUTCDate(paidDate);
		}

		// Payment type distribution
		const typeWeights = ["automatic", "automatic", "automatic", "manual"];
		const paymentCreatedType: Payment["paymentCreatedType"] = typeWeights[i % typeWeights.length] as Payment["paymentCreatedType"];

		return {
			id: `payment_${i + 1}`,
			enrollmentId: `enrollment_${enrollmentIdx + 1}`,
			enrollmentTitle: enrollmentTitles[enrollmentIdx],
			amount,
			status,
			method: paymentMethods[methodIdx],
			paymentCreatedType,
			transactionId: `TXN${String(i + 1).padStart(6, '0')}`,
			fileUrls: i % 7 === 0 ? [
				"https://example.com/receipt_001.pdf",
				"https://example.com/payment_proof.jpg"
			] : i % 11 === 0 ? [
				"https://example.com/transaction_receipt.png"
			] : [], // Add files to some payments for demo
			remarks: i % 3 === 0 ? `Payment for ${enrollmentTitles[enrollmentIdx].split(' - ')[0]}` : "",
			paidAt,
			createdAt: formatUTCDate(created),
		};
	});
}

export default function PaymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const [paramsResolved, setParamsResolved] = React.useState<{ id: string } | null>(null);

	// Resolve params promise
	React.useEffect(() => {
		params.then(setParamsResolved);
	}, [params]);

	if (!paramsResolved) {
		return <div>Loading...</div>;
	}

	const { id } = paramsResolved;
	const payments = getSeededPayments();
	const payment = payments.find((p) => p.id === id) || null;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<div>
						<h1 className="text-xl sm:text-2xl font-semibold">Payment Details</h1>
						<p className="text-sm text-[color:var(--color-neutral-600)] mt-1">ID: {id}</p>
					</div>
				</div>
			</div>

			{!payment ? (
				<Card>
					<CardContent className="p-6">
						<div className="text-[color:var(--color-neutral-700)]">Payment not found.</div>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-6">
					{/* Payment Overview */}
					<Card>
						<CardContent className="p-6 space-y-4">
							<div className="flex flex-col gap-3">
								<div className="flex items-start justify-between gap-3">
									<div className="flex items-start gap-3">
										<div>
											<div className="text-base font-semibold">{payment.enrollmentTitle}</div>
											<div className="text-[12px] text-[color:var(--color-neutral-600)]">Enrollment ID: {payment.enrollmentId}</div>
											<div className="text-[12px] text-[color:var(--color-neutral-600)]">Transaction: {payment.transactionId}</div>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Badge variant="outline" className={statusBadgeClass(payment.status)}>
											<span className="inline-flex items-center gap-1">
												{getStatusIcon(payment.status)}
												{payment.status}
											</span>
										</Badge>
										<Badge variant="outline" className={payment.paymentCreatedType === "automatic" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-700 border-gray-200"}>
											<span className="inline-flex items-center gap-1">
												{payment.paymentCreatedType === "automatic" ? <CheckCircle2 size={14} /> : <Pencil size={14} />}
												{payment.paymentCreatedType}
											</span>
										</Badge>
									</div>
								</div>

								<div className="h-px bg-[color:var(--color-neutral-200)]" />

								<div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
									<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
										<div className="text-[11px] text-[color:var(--color-neutral-600)]">Amount</div>
										<div className="mt-1 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">{formatCurrency(payment.amount)}</div>
									</div>
									<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
										<div className="text-[11px] text-[color:var(--color-neutral-600)]">Payment Method</div>
										<div className="mt-1 inline-flex items-center gap-2 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
											{getMethodIcon(payment.method)}
											{payment.method}
										</div>
									</div>
									<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
										<div className="text-[11px] text-[color:var(--color-neutral-600)]">Created Date</div>
										<div className="mt-1 inline-flex items-center gap-2 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
											<Calendar size={14} />
											{payment.createdAt}
										</div>
									</div>
									<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
										<div className="text-[11px] text-[color:var(--color-neutral-600)]">Paid Date</div>
										<div className="mt-1 inline-flex items-center gap-2 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
											{payment.paidAt ? (
												<>
													<CheckCircle2 size={14} />
													{payment.paidAt}
												</>
											) : (
												<span className="text-[color:var(--color-neutral-500)]">-</span>
											)}
										</div>
									</div>
								</div>

								{payment.remarks && (
									<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
										<div className="text-[11px] text-[color:var(--color-neutral-600)] mb-1">Remarks</div>
										<div className="text-[color:var(--color-neutral-900)]">{payment.remarks}</div>
									</div>
								)}

								{payment.fileUrls && payment.fileUrls.length > 0 && (
									<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
										<div className="text-[11px] text-[color:var(--color-neutral-600)] mb-2">Files ({payment.fileUrls.length})</div>
										<div className="space-y-2">
											{payment.fileUrls.map((url, index) => {
												const fileName = url.split('/').pop() || `File ${index + 1}`;
												return (
													<div key={index} className="flex items-center justify-between">
														<a
															href={url}
															target="_blank"
															rel="noopener noreferrer"
															className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 underline text-sm"
														>
															{fileName}
														</a>
														<a
															href={url}
															download
															className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
															title="Download file"
														>
															<Download size={14} />
														</a>
													</div>
												);
											})}
										</div>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}
