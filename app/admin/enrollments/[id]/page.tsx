import React from "react";
import Image from "next/image";
import Card, { CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Calendar, CheckCircle2, XCircle, BookOpen, Shield, GraduationCap } from "lucide-react";

type EnrollmentStatus = "Active" | "Completed" | "Cancelled";

type Enrollment = {
	id: string;
	studentId: string;
	studentName: string;
	studentEmail: string;
	studentAvatarUrl: string;
	courseId: string;
	courseTitle: string;
	courseCategory: string;
	courseThumbnailUrl: string;
	enrolledAt: string; // YYYY-MM-DD (UTC)
	enrolledBy: "Admin" | "Student"; // Who enrolled this student
	status: EnrollmentStatus;
	progress: number; // 0-100
	amount: number;
};

function pad2(n: number) { return String(n).padStart(2, "0"); }
function formatUTCDate(d: Date) { return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`; }

function statusBadgeClass(status: EnrollmentStatus): string {
	const s = String(status).toLowerCase();
	if (s === "active") return "bg-emerald-50 text-emerald-700 border-emerald-200";
	if (s === "completed") return "bg-amber-50 text-amber-700 border-amber-200";
	return "bg-gray-50 text-gray-700 border-gray-200";
}

/**
 * Generates creative mock enrollment data with realistic patterns
 * Features: Varied pricing, diverse avatars, time-based progress, realistic status distribution
 */
function getSeededEnrollments(): Enrollment[] {
	const courseCategories = ["Web Development", "UI/UX Design", "Business Strategy", "Digital Marketing", "Data Science & AI"];
	const courseTitles = [
		"React Mastery: From Basics to Advanced", // Comprehensive React course
		"JavaScript Ninja Techniques", // Advanced JS patterns and best practices
		"UI/UX Design Fundamentals & Figma", // Design thinking and tools
		"Business Intelligence & Analytics", // Data-driven decision making
		"Digital Marketing in 2025", // Modern marketing strategies
		"Python for Data Science", // Programming for analytics
		"Machine Learning with Python" // AI and ML fundamentals
	];

	const courseThumbnailUrls = [
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=256&q=80", // React/Web Dev
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80", // Team collaboration
        "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=256&q=80", // Data visualization
        "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=256&q=80", // Analytics
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=256&q=80", // Digital marketing
        "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=256&q=80", // Python coding
        "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=256&q=80", // AI/ML
    ];

	const studentNames = [
		"Aayush Shrestha", "Pragati Thapa", "Rohit Karki", "Kritika Shah",
		"Sagar Bista", "Sneha Maharjan", "Bibek Adhikari", "Asmita Gurung"
	];
	const studentEmails = [
		"aayush.shrestha@octavestudents.edu.np", "pragati.thapa@outlook.com", "rohit.karki@gmail.com",
		"kritika.shah@businessinsights.com", "sagar.bista@techlearner.org", "sneha.maharjan@designstudio.np",
		"bibek.adhikari@datascience.academy", "asmita.gurung@innovatorshub.com"
	];

    const studentAvatarUrls = [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80", // Male student 1
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80", // Female student 1
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80", // Male student 2
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=256&q=80", // Female student 2
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80", // Male student 3
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80", // Non-binary student
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80", // Male student 4
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=256&q=80", // Female student 3
    ];

	const BASE_UTC_MS = Date.UTC(2025, 9, 1); // 2025-10-01 UTC

	// Creative pricing tiers based on course complexity and demand
	const coursePricingTiers = [2999, 4999, 3499, 5999, 4499, 3999, 7999]; // Varied pricing for each course

	return Array.from({ length: 48 }).map((_, i) => {
		const enrolled = new Date(BASE_UTC_MS - i * 86400000);
		const studentIdx = i % studentNames.length;
		const courseIdx = i % courseTitles.length;
		const categoryIdx = i % courseCategories.length;

		// More realistic status distribution with creative weighting
		const statusWeights = ["Active", "Active", "Active", "Active", "Completed", "Completed", "Cancelled"];
		const status: EnrollmentStatus = statusWeights[i % statusWeights.length] as EnrollmentStatus;

		// Creative progress calculation based on enrollment patterns
		let progress: number;
		const daysSinceEnrollment = Math.floor((Date.now() - enrolled.getTime()) / (1000 * 60 * 60 * 24));

		if (status === "Completed") {
			progress = 100;
		} else if (status === "Cancelled") {
			// Cancelled students typically drop out early
			progress = Math.floor(Math.random() * 25) + 5;
		} else {
			// Active students show varied progress based on time and motivation
			const baseProgress = Math.min(daysSinceEnrollment * 3, 85); // Max 85% for active courses
			const motivationFactor = Math.random() * 0.4 + 0.8; // 0.8-1.2 multiplier
			progress = Math.floor(baseProgress * motivationFactor);
		}

		return {
			id: `enrollment_${i + 1}`,
			studentId: `student_${studentIdx + 1}`,
			studentName: studentNames[studentIdx],
			studentEmail: studentEmails[studentIdx],
			studentAvatarUrl: studentAvatarUrls[studentIdx],
			courseId: `course_${courseIdx + 1}`,
			courseTitle: courseTitles[courseIdx],
			courseCategory: courseCategories[categoryIdx],
			courseThumbnailUrl: courseThumbnailUrls[courseIdx],
			enrolledAt: formatUTCDate(enrolled),
			enrolledBy: Math.random() > 0.3 ? "Student" : "Admin", // Students enroll themselves more often
			status,
			progress: Math.max(0, Math.min(100, progress)), // Ensure 0-100 range
			amount: coursePricingTiers[courseIdx], // Creative tiered pricing
		};
	});
}


export default async function EnrollmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const enrollments = getSeededEnrollments();
	const enrollment = enrollments.find((e) => e.id === id) || null;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<div>
						<h1 className="text-xl sm:text-2xl font-semibold">Enrollment Details</h1>
						<p className="text-sm text-[color:var(--color-neutral-600)] mt-1">ID: {id}</p>
					</div>
				</div>
			</div>


			{!enrollment ? (
				<Card>
					<CardContent className="p-6">
						<div className="text-[color:var(--color-neutral-700)]">Enrollment not found.</div>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-6">
					{/* Enrollment Overview */}
					<Card>
						<CardContent className="p-6 space-y-4">
							<div className="flex flex-col gap-3">
								<div className="flex items-start justify-between gap-3">
									<div className="flex items-start gap-3">
										<div className="h-16 w-24 overflow-hidden rounded-md ring-1 ring-[color:var(--color-neutral-200)] shadow-sm">
											<Image src={enrollment.courseThumbnailUrl} alt={enrollment.courseTitle} width={96} height={64} className="h-full w-full object-cover" />
										</div>
										<div>
											<div className="text-base font-semibold">{enrollment.courseTitle}</div>
											<div className="text-[12px] text-[color:var(--color-neutral-600)]">{enrollment.courseCategory}</div>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Badge variant="outline" className={statusBadgeClass(enrollment.status)}>
											<span className="inline-flex items-center gap-1">
												{enrollment.status === "Active" ? <CheckCircle2 size={14} /> :
												 enrollment.status === "Completed" ? <BookOpen size={14} /> :
												 <XCircle size={14} />}
												{enrollment.status}
											</span>
										</Badge>
										<div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
											enrollment.enrolledBy === "Admin"
												? "bg-purple-50 text-purple-700 border border-purple-200"
												: "bg-blue-50 text-blue-700 border border-blue-200"
										}`}>
											{enrollment.enrolledBy === "Admin" ? (
												<>
													<Shield size={12} className="text-purple-600" />
													<span>Admin</span>
												</>
											) : (
												<>
													<GraduationCap size={12} className="text-blue-600" />
													<span>Self</span>
												</>
											)}
										</div>
									</div>
								</div>

								<div className="h-px bg-[color:var(--color-neutral-200)]" />

								<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
									<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
										<div className="text-[11px] text-[color:var(--color-neutral-600)]">Progress</div>
										<div className="mt-1 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">{enrollment.progress}%</div>
									</div>
									<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
										<div className="text-[11px] text-[color:var(--color-neutral-600)]">Amount</div>
										<div className="mt-1 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">Rs {enrollment.amount.toLocaleString()}</div>
									</div>
									<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
										<div className="text-[11px] text-[color:var(--color-neutral-600)]">Enrolled Date</div>
										<div className="mt-1 inline-flex items-center gap-2 font-medium text-[color:var(--color-neutral-900)] whitespace-nowrap">
											<Calendar size={14} />
											{enrollment.enrolledAt}
										</div>
									</div>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
									<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
										<div className="text-[11px] text-[color:var(--color-neutral-600)] mb-1">Student Information</div>
										<div className="flex items-center gap-3">
											<div className="h-10 w-10 overflow-hidden rounded-full">
												<Image src={enrollment.studentAvatarUrl} alt={enrollment.studentName} width={40} height={40} className="h-full w-full object-cover" />
											</div>
											<div>
												<div className="font-medium text-[color:var(--color-neutral-900)]">{enrollment.studentName}</div>
												<div className="text-[11px] text-[color:var(--color-neutral-600)]">{enrollment.studentEmail}</div>
											</div>
										</div>
									</div>
									<div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 py-2">
										<div className="text-[11px] text-[color:var(--color-neutral-600)] mb-1">Course Information</div>
										<div className="space-y-1">
											<div className="font-medium text-[color:var(--color-neutral-900)]">{enrollment.courseTitle}</div>
											<div className="text-[11px] text-[color:var(--color-neutral-600)]">{enrollment.courseCategory}</div>
											<div className="text-[11px] text-[color:var(--color-neutral-600)]">Course ID: {enrollment.courseId}</div>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}
