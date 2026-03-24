import React from "react";
import Link from "next/link";
import Image from "next/image";
import Card, { CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Calendar, CheckCircle2, XCircle, Clock, CreditCard, BookOpen, Mail, Phone, MapPin, Building2, Monitor, LogIn, FileText, HelpCircle, Award } from "lucide-react";
import CopyButton from "../../../../components/ui/CopyButton";

type Student = {
	id: string;
	name: string;
	email: string;
	bio: string;
	isActive: boolean;
	isVerified?: boolean;
	isSuspended?: boolean;
	phone?: string;
	address?: string;
	billingAddress?: string;
	taxId?: string;
	billingEmail?: string;
	joinedAt: string; // YYYY-MM-DD (UTC)
	updatedAt: string; // YYYY-MM-DD (UTC)
	coursesEnrolled: number;
	avatarUrl: string;
};

type Enrollment = {
	id: string;
	courseId: string;
	courseTitle: string;
	courseCategory: string;
	enrolledAt: string;
	status: "Active" | "Completed" | "Cancelled";
	progress: number; // 0-100
};

type Payment = {
	id: string;
	courseTitle: string;
	amount: number;
	method: string;
	date: string;
	status: "Paid" | "Pending" | "Failed";
};

type Activity = {
	id: string;
	type: "login" | "course_access" | "assignment_submit" | "quiz_attempt" | "payment";
	description: string;
	date: string;
	ipAddress?: string;
	userAgent?: string;
};

type Certificate = {
	id: string;
	courseTitle: string;
	courseCategory: string;
	issuedAt: string;
	certificateId: string;
	downloadUrl?: string;
};

type TabKey = "overview" | "enrollments" | "payments" | "certificates" | "activity";

function pad2(n: number) { return String(n).padStart(2, "0"); }
function formatUTCDate(d: Date) { return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`; }

function statusBadgeClass(isActive: boolean): string {
	return isActive
		? "bg-emerald-50 text-emerald-700 border-emerald-200"
		: "bg-gray-50 text-gray-700 border-gray-200";
}

function getSeededStudents(): Student[] {
	const baseStudents = [
		{ id: "1", name: "Aayush Shrestha", email: "aayush.shrestha@example.com", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80" },
		{ id: "2", name: "Pragati Thapa", email: "pragati.thapa@example.com", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80" },
		{ id: "3", name: "Rohit Karki", email: "rohit.karki@example.com", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80" },
		{ id: "4", name: "Kritika Shah", email: "kritika.shah@example.com", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=256&q=80" },
		{ id: "5", name: "Sagar Bista", email: "sagar.bista@example.com", avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80" },
		{ id: "6", name: "Sneha Maharjan", email: "sneha.maharjan@example.com", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80" },
		{ id: "7", name: "Bibek Adhikari", email: "bibek.adhikari@example.com", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80" },
		{ id: "8", name: "Asmita Gurung", email: "asmita.gurung@example.com", avatarUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=256&q=80" },
		{ id: "9", name: "Nisha Rai", email: "nisha.rai@example.com", avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80" },
		{ id: "10", name: "Aarav KC", email: "aarav.kc@example.com", avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80" },
	];

	const BASE_UTC_MS = Date.UTC(2025, 9, 1); // 2025-10-01 UTC
	return baseStudents.map((b, idx) => {
		const created = new Date(BASE_UTC_MS - idx * 86400000);
		const updated = new Date(BASE_UTC_MS + 86400000 - idx * 86400000);
		return {
			id: b.id,
			name: b.name,
			email: b.email,
			avatarUrl: `${b.avatarUrl}?auto=format&fit=crop&w=256&q=80`,
			bio: `${b.name} is passionate about learning and building new skills.`,
			coursesEnrolled: (idx % 8) + 1,
			joinedAt: formatUTCDate(created),
			updatedAt: formatUTCDate(updated),
			isActive: idx % 5 !== 0,
			isVerified: idx % 2 === 0,
			isSuspended: idx % 7 === 0,
			phone: idx % 3 === 0 ? "+977-9841234567" : "",
			address: idx % 4 === 0 ? "Kathmandu, Nepal" : "",
			billingAddress: idx % 5 === 0 ? "Kathmandu, Nepal" : "",
			taxId: idx % 6 === 0 ? "123456789" : "",
			billingEmail: idx % 8 === 0 ? b.email : "",
		};
	});
}

function getSeededEnrollments(studentId: string): Enrollment[] {
	const courseCategories = ["Development", "Design", "Business", "Marketing", "Data Science"];
	const courseTitles = [
		"Introduction to React", "Advanced JavaScript", "UI/UX Design Fundamentals",
		"Business Analytics", "Digital Marketing", "Python Programming", "Machine Learning Basics"
	];

	return Array.from({ length: 4 }).map((_, i) => ({
		id: `${studentId}-enr-${i + 1}`,
		courseId: `course_${i + 1}`,
		courseTitle: courseTitles[i % courseTitles.length],
		courseCategory: courseCategories[i % courseCategories.length],
		enrolledAt: formatUTCDate(new Date(Date.UTC(2025, 8, 15) + i * 86400000)),
		status: (["Active", "Active", "Completed"][i % 3]) as "Active" | "Completed" | "Cancelled",
		progress: i === 2 ? 100 : Math.floor(Math.random() * 80) + 20, // 100% for completed, random for others
	}));
}

function getSeededPayments(studentId: string): Payment[] {
	const courseTitles = [
		"Introduction to React", "Advanced JavaScript", "UI/UX Design Fundamentals",
		"Business Analytics", "Digital Marketing"
	];
	const methods = ["Esewa", "Khalti", "Bank Transfer", "Cash"];

	return Array.from({ length: 3 }).map((_, i) => ({
		id: `${studentId}-pay-${i + 1}`,
		courseTitle: courseTitles[i % courseTitles.length],
		amount: 3000 + (i * 1000),
		method: methods[i % methods.length],
		date: formatUTCDate(new Date(Date.UTC(2025, 8, 20) + i * 86400000)),
		status: (["Paid", "Paid", "Pending"][i % 3]) as "Paid" | "Pending" | "Failed",
	}));
}

function getSeededActivities(studentId: string): Activity[] {
	const activities = [
		{ type: "login" as const, description: "Logged in to platform" },
		{ type: "course_access" as const, description: "Accessed Introduction to React" },
		{ type: "assignment_submit" as const, description: "Submitted assignment for Advanced JavaScript" },
		{ type: "quiz_attempt" as const, description: "Completed quiz for UI/UX Design Fundamentals" },
		{ type: "payment" as const, description: "Made payment for Business Analytics" },
		{ type: "login" as const, description: "Logged in to platform" },
		{ type: "course_access" as const, description: "Accessed Digital Marketing course" },
	];

	return Array.from({ length: 6 }).map((_, i) => ({
		id: `${studentId}-activity-${i + 1}`,
		type: activities[i % activities.length].type,
		description: activities[i % activities.length].description,
		date: formatUTCDate(new Date(Date.UTC(2025, 9, 10) - i * 86400000 * 2)),
		ipAddress: i % 3 === 0 ? "192.168.1." + (100 + i) : undefined,
		userAgent: i % 2 === 0 ? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" : undefined,
	}));
}

function getSeededCertificates(studentId: string): Certificate[] {
	const courseTitles = [
		"Introduction to React", "Advanced JavaScript", "UI/UX Design Fundamentals",
		"Business Analytics", "Digital Marketing", "Python Programming"
	];
	const categories = ["Development", "Design", "Business", "Marketing", "Data Science"];

	return Array.from({ length: 3 }).map((_, i) => ({
		id: `${studentId}-cert-${i + 1}`,
		courseTitle: courseTitles[i % courseTitles.length],
		courseCategory: categories[i % categories.length],
		issuedAt: formatUTCDate(new Date(Date.UTC(2025, 8, 20) + i * 86400000 * 7)),
		certificateId: `CERT-${String(1000 + i).padStart(4, '0')}`,
		downloadUrl: i % 2 === 0 ? `/api/certificates/${studentId}-cert-${i + 1}` : undefined,
	}));
}

export default async function StudentDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string }> }) {
	const { id } = await params;
	const { tab } = await searchParams;
	const students = getSeededStudents();
	const student = students.find((s) => s.id === id) || null;
	const tabParam = (tab || "overview").toString().toLowerCase();
	const activeTab: TabKey = (['overview', 'enrollments', 'payments', 'certificates', 'activity'] as const).includes(tabParam as TabKey) ? (tabParam as TabKey) : "overview";
	const enrollments = student ? getSeededEnrollments(student.id) : [];
	const payments = student ? getSeededPayments(student.id) : [];
	const certificates = student ? getSeededCertificates(student.id) : [];
	const activities = student ? getSeededActivities(student.id) : [];

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between gap-3">
				<div>
					<h1 className="text-xl sm:text-2xl font-semibold">Student Details</h1>
					<p className="text-sm text-[color:var(--color-neutral-600)] mt-1">ID: {id}</p>
				</div>
			</div>

			{/* Tabs */}
			<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-1">
				<div className="grid grid-cols-5 gap-1">
					{([
						{ key: 'overview', label: 'Overview' },
						{ key: 'enrollments', label: 'Enrollments' },
						{ key: 'payments', label: 'Payments' },
						{ key: 'certificates', label: 'Certificates' },
						{ key: 'activity', label: 'Activity' },
					] as Array<{ key: TabKey; label: string }>).map(t => (
						<Link key={t.key} href={`/admin/students/${id}?tab=${t.key}`} className={
							(t.key === activeTab
								? "px-3 py-1.5 rounded-md border border-[color:var(--color-primary-200)] text-[color:var(--color-primary-700)] bg-[color:var(--color-primary-50)]"
								: "px-3 py-1.5 rounded-md border border-[color:var(--color-neutral-200)] text-[color:var(--color-neutral-700)] hover:bg-[color:var(--color-neutral-50)]") + " w-full text-center"
						}>
							{t.label}
						</Link>
					))}
				</div>
			</div>

			{!student ? (
				<Card>
					<CardContent className="p-6">
						<div className="text-[color:var(--color-neutral-700)]">Student not found.</div>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-4">
					{activeTab === "overview" && (
						<Card>
							<CardContent className="p-6">
								<div className="flex items-start gap-4">
									<div className="relative">
										<div className="h-16 w-16 overflow-hidden rounded-full ring-2 ring-[color:var(--color-neutral-200)] shadow-sm">
											<Image src={student.avatarUrl} alt={student.name} width={64} height={64} className="h-full w-full object-cover" />
										</div>
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
											<div>
												<div className="text-xl font-semibold text-[color:var(--color-neutral-900)]">{student.name}</div>
												<div className="text-sm text-[color:var(--color-neutral-600)] mt-1">{student.email}</div>
												{student.bio && (
													<div className="text-sm text-[color:var(--color-neutral-700)] mt-2">{student.bio}</div>
												)}
											</div>
											<div className="flex flex-wrap gap-2">
												<Badge variant="outline" className={statusBadgeClass(student.isActive)}>
													<span className="inline-flex items-center gap-1">
														{student.isActive ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
														{student.isActive ? "Active" : "Inactive"}
													</span>
												</Badge>
												{student.isVerified !== undefined && (
													<Badge variant="outline" className={statusBadgeClass(student.isVerified)}>
														<span className="inline-flex items-center gap-1">
															<CheckCircle2 size={14} />
															Verified
														</span>
													</Badge>
												)}
												{student.isSuspended !== undefined && (
													<Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
														<span className="inline-flex items-center gap-1">
															<XCircle size={14} />
															Suspended
														</span>
													</Badge>
												)}
											</div>
										</div>

										<div className="h-px bg-[color:var(--color-neutral-200)] my-4" />

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="space-y-3">
												<div className="text-sm font-medium text-[color:var(--color-neutral-800)]">Contact Information</div>
												<div className="space-y-2">
													<div className="flex items-center gap-2 text-sm">
														<Mail size={16} className="text-[color:var(--color-neutral-500)]" />
														<span className="text-[color:var(--color-neutral-700)]">{student.email}</span>
														<CopyButton text={student.email} />
													</div>
													{student.phone && (
														<div className="flex items-center gap-2 text-sm">
															<Phone size={16} className="text-[color:var(--color-neutral-500)]" />
															<span className="text-[color:var(--color-neutral-700)]">{student.phone}</span>
															<CopyButton text={student.phone} />
														</div>
													)}
													{student.address && (
														<div className="flex items-center gap-2 text-sm">
															<MapPin size={16} className="text-[color:var(--color-neutral-500)]" />
															<span className="text-[color:var(--color-neutral-700)]">{student.address}</span>
														</div>
													)}
												</div>
											</div>
											<div className="space-y-3">
												<div className="text-sm font-medium text-[color:var(--color-neutral-800)]">Statistics</div>
												<div className="space-y-2">
													<div className="flex items-center gap-2 text-sm">
														<BookOpen size={16} className="text-[color:var(--color-neutral-500)]" />
														<span className="text-[color:var(--color-neutral-700)]">{student.coursesEnrolled} courses enrolled</span>
													</div>
													<div className="flex items-center gap-2 text-sm">
														<Calendar size={16} className="text-[color:var(--color-neutral-500)]" />
														<span className="text-[color:var(--color-neutral-700)]">Joined {student.joinedAt}</span>
													</div>
													<div className="flex items-center gap-2 text-sm">
														<Clock size={16} className="text-[color:var(--color-neutral-500)]" />
														<span className="text-[color:var(--color-neutral-700)]">Last updated {student.updatedAt}</span>
													</div>
												</div>
											</div>
										</div>

										{(student.billingAddress || student.billingEmail || student.taxId) && (
											<>
												<div className="h-px bg-[color:var(--color-neutral-200)] my-4" />
												<div className="space-y-3">
													<div className="text-sm font-medium text-[color:var(--color-neutral-800)]">Billing Information</div>
													<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
														{student.billingEmail && (
															<div className="flex items-center gap-2 text-sm">
																<Mail size={16} className="text-[color:var(--color-neutral-500)]" />
																<span className="text-[color:var(--color-neutral-700)]">{student.billingEmail}</span>
															</div>
														)}
														{student.billingAddress && (
															<div className="flex items-center gap-2 text-sm">
																<MapPin size={16} className="text-[color:var(--color-neutral-500)]" />
																<span className="text-[color:var(--color-neutral-700)]">{student.billingAddress}</span>
															</div>
														)}
														{student.taxId && (
															<div className="flex items-center gap-2 text-sm">
																<Building2 size={16} className="text-[color:var(--color-neutral-500)]" />
																<span className="text-[color:var(--color-neutral-700)]">Tax ID: {student.taxId}</span>
															</div>
														)}
													</div>
												</div>
											</>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{activeTab === "enrollments" && (
						<Card>
							<CardContent className="p-6 space-y-3">
								<div className="text-[color:var(--color-neutral-800)] font-medium">Course Enrollments</div>
								<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white overflow-hidden">
									<table className="w-full text-sm">
										<thead>
											<tr className="text-left">
												<th className="py-2 px-3 text-[color:var(--color-neutral-700)]">Course</th>
												<th className="py-2 px-3 text-[color:var(--color-neutral-700)]">Category</th>
												<th className="py-2 px-3 text-[color:var(--color-neutral-700)]">Progress</th>
												<th className="py-2 px-3 text-[color:var(--color-neutral-700)]">Enrolled Date</th>
												<th className="py-2 px-3 text-[color:var(--color-neutral-700)]">Status</th>
											</tr>
										</thead>
										<tbody>
											{enrollments.map((enrollment) => (
												<tr key={enrollment.id} className="border-t border-[color:var(--color-neutral-200)]">
													<td className="py-2 px-3">
														<div className="font-medium text-[color:var(--color-neutral-900)]">{enrollment.courseTitle}</div>
													</td>
													<td className="py-2 px-3">{enrollment.courseCategory}</td>
													<td className="py-2 px-3">
														<div className="flex items-center gap-2">
															<span className="text-sm">{enrollment.progress}%</span>
															<div className="w-16 bg-[color:var(--color-neutral-200)] rounded-full h-1.5">
																<div
																	className="bg-[color:var(--color-primary-500)] h-1.5 rounded-full"
																	style={{ width: `${enrollment.progress}%` }}
																></div>
															</div>
														</div>
													</td>
													<td className="py-2 px-3">{enrollment.enrolledAt}</td>
													<td className="py-2 px-3">
														<Badge variant="outline" className={
															enrollment.status === "Completed" ? "text-[11px] bg-emerald-50 text-emerald-700 border-emerald-200" :
															enrollment.status === "Active" ? "text-[11px] bg-blue-50 text-blue-700 border-blue-200" :
															"text-[11px] bg-gray-50 text-gray-700 border-gray-200"
														}>
															{enrollment.status}
														</Badge>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					)}

					{activeTab === "payments" && (
						<Card>
							<CardContent className="p-6 space-y-3">
								<div className="text-[color:var(--color-neutral-800)] font-medium">Payments</div>
								<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white overflow-hidden">
									<table className="w-full text-sm">
										<thead>
											<tr className="text-left">
												<th className="py-2 px-3 text-[color:var(--color-neutral-700)]">Date</th>
												<th className="py-2 px-3 text-[color:var(--color-neutral-700)]">Course</th>
												<th className="py-2 px-3 text-[color:var(--color-neutral-700)]">Amount (NPR)</th>
												<th className="py-2 px-3 text-[color:var(--color-neutral-700)]">Method</th>
												<th className="py-2 px-3 text-[color:var(--color-neutral-700)]">Status</th>
											</tr>
										</thead>
										<tbody>
											{payments.map((p) => (
												<tr key={p.id} className="border-t border-[color:var(--color-neutral-200)]">
													<td className="py-2 px-3">{p.date}</td>
													<td className="py-2 px-3">{p.courseTitle}</td>
													<td className="py-2 px-3">Rs {p.amount.toLocaleString()}</td>
													<td className="py-2 px-3">{p.method}</td>
													<td className="py-2 px-3">
														<Badge variant="outline" className={
															p.status === "Paid" ? "text-[11px] bg-emerald-50 text-emerald-700 border-emerald-200" :
															p.status === "Pending" ? "text-[11px] bg-amber-50 text-amber-700 border-amber-200" :
															"text-[11px] bg-red-50 text-red-700 border-red-200"
														}>
															{p.status}
														</Badge>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					)}

					{activeTab === "certificates" && (
						<Card>
							<CardContent className="p-6 space-y-3">
								<div className="text-[color:var(--color-neutral-800)] font-medium">Certificates</div>
								<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white overflow-hidden">
									<table className="w-full text-sm">
										<thead>
											<tr className="text-left">
												<th className="py-2 px-3 text-[color:var(--color-neutral-700)]">Course</th>
												<th className="py-2 px-3 text-[color:var(--color-neutral-700)]">Category</th>
												<th className="py-2 px-3 text-[color:var(--color-neutral-700)]">Certificate ID</th>
												<th className="py-2 px-3 text-[color:var(--color-neutral-700)]">Issued Date</th>
												<th className="py-2 px-3 text-[color:var(--color-neutral-700)] text-center">Actions</th>
											</tr>
										</thead>
										<tbody>
											{certificates.map((certificate) => (
												<tr key={certificate.id} className="border-t border-[color:var(--color-neutral-200)]">
													<td className="py-2 px-3">
														<div className="font-medium text-[color:var(--color-neutral-900)]">{certificate.courseTitle}</div>
													</td>
													<td className="py-2 px-3">{certificate.courseCategory}</td>
													<td className="py-2 px-3">
														<span className="font-mono text-xs text-[color:var(--color-neutral-600)]">{certificate.certificateId}</span>
													</td>
													<td className="py-2 px-3">{certificate.issuedAt}</td>

													<td className="py-2 px-3 text-center">
														{certificate.downloadUrl ? (
															<Button
																variant="secondary"
																size="sm"
                                                                className="gap-1"
																
															>
																Download
															</Button>
														) : (
															<span className="text-sm text-[color:var(--color-neutral-400)]">N/A</span>
														)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					)}

					{activeTab === "activity" && (
						<Card>
							<CardContent className="p-6 space-y-3">
								<div className="text-[color:var(--color-neutral-800)] font-medium">Recent Activity</div>
								<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white overflow-hidden">
									<table className="w-full text-sm">
										<thead>
											<tr className="text-left">
												<th className="py-2 px-3 text-[color:var(--color-neutral-700)]">Activity</th>
												<th className="py-2 px-3 text-[color:var(--color-neutral-700)]">Description</th>
												<th className="py-2 px-3 text-[color:var(--color-neutral-700)]">Date</th>
												<th className="py-2 px-3 text-[color:var(--color-neutral-700)]">IP Address</th>
											</tr>
										</thead>
										<tbody>
											{activities.map((activity) => {
												const getActivityIcon = (type: Activity['type']) => {
													switch (type) {
														case 'login': return <LogIn size={16} className="text-blue-600" />;
														case 'course_access': return <BookOpen size={16} className="text-green-600" />;
														case 'assignment_submit': return <FileText size={16} className="text-purple-600" />;
														case 'quiz_attempt': return <HelpCircle size={16} className="text-orange-600" />;
														case 'payment': return <CreditCard size={16} className="text-emerald-600" />;
														default: return <Monitor size={16} className="text-gray-600" />;
													}
												};

												const getActivityBadge = (type: Activity['type']) => {
													const styles = {
														login: "text-[11px] bg-blue-50 text-blue-700 border-blue-200",
														course_access: "text-[11px] bg-green-50 text-green-700 border-green-200",
														assignment_submit: "text-[11px] bg-purple-50 text-purple-700 border-purple-200",
														quiz_attempt: "text-[11px] bg-orange-50 text-orange-700 border-orange-200",
														payment: "text-[11px] bg-emerald-50 text-emerald-700 border-emerald-200",
													};
													return styles[type] || "text-[11px] bg-gray-50 text-gray-700 border-gray-200";
												};

												return (
													<tr key={activity.id} className="border-t border-[color:var(--color-neutral-200)]">
														<td className="py-2 px-3">
															<div className="flex items-center gap-2">
																<div className="p-1 bg-[color:var(--color-neutral-100)] rounded-full">
																	{getActivityIcon(activity.type)}
																</div>
																<Badge variant="outline" className={getActivityBadge(activity.type)}>
																	{activity.type.replace('_', ' ')}
																</Badge>
															</div>
														</td>
														<td className="py-2 px-3">
															<div className="text-[color:var(--color-neutral-900)]">{activity.description}</div>
														</td>
														<td className="py-2 px-3">{activity.date}</td>
														<td className="py-2 px-3">
															{activity.ipAddress || <span className="text-[color:var(--color-neutral-400)]">-</span>}
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			)}
		</div>
	);
}
