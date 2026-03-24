"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import Modal from "@/components/ui/Modal";
import { Mail, Phone, Eye, FileText, Download, ArrowLeft } from "lucide-react";

type JobPosition = {
	id: string;
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
	createdAt: string;
	updatedAt: string;
};

type JobApplication = {
	id: string;
	name: string;
	email: string;
	phone: string;
	coverLetter: string;
	appliedAt: string; // YYYY-MM-DD
	resumeUrls?: string[];
	notes?: string;
};

// Mock data - replace with actual API call
function getMockPosition(id: string): JobPosition | null {
	const positions: JobPosition[] = [
		{
			id: "1",
			title: "Frontend Developer",
			department: "Engineering",
			location: "Kathmandu, Nepal",
			type: "Full-time",
			level: "Mid",
			workArrangement: "Hybrid",
			isPaid: "Paid",
			salary: "Rs 60,000 - 90,000",
			numberOfPositions: 2,
			startDate: "2024-12-01",
			endDate: "",
			description: "We are looking for a skilled Frontend Developer to join our team. You will be responsible for implementing visual elements that users see and interact with in a web application. You will work closely with our design and backend teams to deliver exceptional user experiences.",
			requirements: [
				"3+ years of experience with React and modern JavaScript",
				"Proficiency in HTML, CSS, and JavaScript",
				"Experience with state management (Redux, Zustand)",
				"Knowledge of responsive design and cross-browser compatibility",
				"Familiarity with version control systems (Git)",
				"Experience with testing frameworks (Jest, React Testing Library)"
			],
			status: "Open",
			createdAt: "2024-11-01T09:00:00Z",
			updatedAt: "2024-11-15T14:20:00Z",
		},
		{
			id: "2",
			title: "UI/UX Designer",
			department: "Design",
			location: "Kathmandu, Nepal",
			type: "Full-time",
			level: "Senior",
			workArrangement: "On-site",
			isPaid: "Paid",
			salary: "Rs 70,000 - 100,000",
			numberOfPositions: 1,
			startDate: "2024-12-15",
			endDate: "",
			description: "We are seeking a talented UI/UX Designer to create amazing user experiences. You will be responsible for researching, designing, and prototyping user interfaces for our web and mobile applications. You will work closely with product managers and developers to ensure our designs are both beautiful and functional.",
			requirements: [
				"4+ years of UI/UX design experience",
				"Proficiency in Figma, Sketch, or Adobe Creative Suite",
				"Strong portfolio demonstrating design process",
				"Experience with user research and usability testing",
				"Knowledge of design systems and component libraries",
				"Understanding of mobile-first and responsive design principles"
			],
			status: "Open",
			createdAt: "2024-11-05T10:30:00Z",
			updatedAt: "2024-11-12T16:45:00Z",
		},
	];

	return positions.find(pos => pos.id === id) || null;
}

function getMockApplicationsForPosition(positionId: string): JobApplication[] {
	const applicationsByPosition: Record<string, JobApplication[]> = {
		"1": [
			{
				id: "app_1_1",
				name: "Aarav Sharma",
				email: "aarav.sharma@email.com",
				phone: "+977 9841234567",
				coverLetter: "I am passionate about creating beautiful and functional user interfaces. With 3 years of experience in React and modern JavaScript frameworks, I believe I can contribute significantly to your team's success.",
				appliedAt: "2024-11-15",
				resumeUrls: ["https://example.com/resume-aarav.pdf"],
				notes: "Strong React experience, good portfolio."
			},
			{
				id: "app_1_2",
				name: "Sujita Rai",
				email: "sujita.rai@email.com",
				phone: "+977 9842345678",
				coverLetter: "Frontend development is my passion. I have extensive experience with React, TypeScript, and modern web technologies. I'm excited about the opportunity to work on innovative projects.",
				appliedAt: "2024-11-18",
				resumeUrls: ["https://example.com/resume-sujita.pdf"],
				notes: "TypeScript expert, great technical skills."
			},
			{
				id: "app_1_3",
				name: "Rohan Kumar",
				email: "rohan.kumar@email.com",
				phone: "+977 9843456789",
				coverLetter: "Experienced frontend developer with a passion for clean code and user experience. Proficient in React, Vue.js, and modern CSS frameworks.",
				appliedAt: "2024-11-20",
				resumeUrls: ["https://example.com/resume-rohan.pdf"],
				notes: "Solid experience with multiple frameworks."
			},
			{
				id: "app_1_4",
				name: "Anita Gurung",
				email: "anita.gurung@email.com",
				phone: "+977 9844567890",
				coverLetter: "Frontend specialist with 4 years of experience building scalable web applications. Expertise in React ecosystem and performance optimization.",
				appliedAt: "2024-11-22",
				resumeUrls: ["https://example.com/resume-anita.pdf"],
				notes: "Performance optimization specialist."
			},
			{
				id: "app_1_5",
				name: "Bibek Tamang",
				email: "bibek.tamang@email.com",
				phone: "+977 9845678901",
				coverLetter: "Passionate about creating exceptional user experiences through clean, efficient code. Strong background in React and modern web development.",
				appliedAt: "2024-11-25",
				resumeUrls: ["https://example.com/resume-bibek.pdf"],
				notes: "Clean code advocate, good communication skills."
			},
			{
				id: "app_1_6",
				name: "Poonam Shrestha",
				email: "poonam.shrestha@email.com",
				phone: "+977 9846789012",
				coverLetter: "Frontend developer with expertise in React, TypeScript, and state management. Experience building complex applications with great attention to detail.",
				appliedAt: "2024-11-28",
				resumeUrls: ["https://example.com/resume-poonam.pdf"],
				notes: "Detail-oriented, strong problem solver."
			},
			{
				id: "app_1_7",
				name: "Sandeep Acharya",
				email: "sandeep.acharya@email.com",
				phone: "+977 9847890123",
				coverLetter: "Full-stack developer transitioning to frontend specialization. Strong foundation in React, JavaScript, and modern development practices.",
				appliedAt: "2024-11-30",
				resumeUrls: ["https://example.com/resume-sandeep.pdf"],
				notes: "Full-stack background, quick learner."
			},
			{
				id: "app_1_8",
				name: "Kavita Bhandari",
				email: "kavita.bhandari@email.com",
				phone: "+977 9848901234",
				coverLetter: "Creative frontend developer with experience in React and design systems. Passionate about accessible and inclusive web development.",
				appliedAt: "2024-12-02",
				resumeUrls: ["https://example.com/resume-kavita.pdf"],
				notes: "Accessibility focus, creative problem solver."
			},
			{
				id: "app_1_9",
				name: "Nabin Khadka",
				email: "nabin.khadka@email.com",
				phone: "+977 9849012345",
				coverLetter: "Experienced React developer with a focus on performance and scalability. Background in computer science with practical development experience.",
				appliedAt: "2024-12-05",
				resumeUrls: ["https://example.com/resume-nabin.pdf"],
				notes: "Performance-focused, CS background."
			},
			{
				id: "app_1_10",
				name: "Sunita Lama",
				email: "sunita.lama@email.com",
				phone: "+977 9850123456",
				coverLetter: "Frontend developer with strong skills in React, Next.js, and modern web technologies. Experience working in agile development environments.",
				appliedAt: "2024-12-08",
				resumeUrls: ["https://example.com/resume-sunita.pdf"],
				notes: "Agile experience, team player."
			},
			{
				id: "app_1_11",
				name: "Rajesh Thakur",
				email: "rajesh.thakur@email.com",
				phone: "+977 9851234567",
				coverLetter: "Dedicated frontend developer with expertise in React ecosystem. Strong problem-solving skills and commitment to code quality.",
				appliedAt: "2024-12-10",
				resumeUrls: ["https://example.com/resume-rajesh.pdf"],
				notes: "Quality-focused, strong problem solver."
			},
			{
				id: "app_1_12",
				name: "Maya Pandey",
				email: "maya.pandey@email.com",
				phone: "+977 9852345678",
				coverLetter: "Frontend specialist with experience in large-scale applications. Proficient in React, Redux, and testing frameworks.",
				appliedAt: "2024-12-12",
				resumeUrls: ["https://example.com/resume-maya.pdf"],
				notes: "Large-scale app experience, testing expert."
			},
		],
		"2": [
			{
				id: "app_2_1",
				name: "Priya Thapa",
				email: "priya.thapa@email.com",
				phone: "+977 9851234567",
				coverLetter: "As a UI/UX designer with 4 years of experience, I specialize in creating intuitive and visually appealing designs. My expertise includes user research, wireframing, prototyping, and design systems.",
				appliedAt: "2024-11-12",
				resumeUrls: ["https://example.com/resume-priya.pdf"],
				notes: "Excellent design portfolio, Figma expert."
			},
			{
				id: "app_2_2",
				name: "Sarita Basnet",
				email: "sarita.basnet@email.com",
				phone: "+977 9852345678",
				coverLetter: "Creative UI/UX designer with a passion for user-centered design. Experience with Figma, Adobe Creative Suite, and design systems.",
				appliedAt: "2024-11-15",
				resumeUrls: ["https://example.com/resume-sarita.pdf"],
				notes: "User-centered design approach."
			},
			{
				id: "app_2_3",
				name: "Kiran Adhikari",
				email: "kiran.adhikari@email.com",
				phone: "+977 9853456789",
				coverLetter: "UX designer with strong research background and prototyping skills. Experience designing for web and mobile platforms.",
				appliedAt: "2024-11-18",
				resumeUrls: ["https://example.com/resume-kiran.pdf"],
				notes: "Research-focused, prototyping expert."
			},
		],
	};

	return applicationsByPosition[positionId] || [];
}

export default function HiringDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const [id, setId] = React.useState<string>("");
	const [position, setPosition] = React.useState<JobPosition | null>(null);
	const [applications, setApplications] = React.useState<JobApplication[]>([]);

	// Pagination state
	const [page, setPage] = React.useState(1);
	const pageSize = 10;

	// Modal state
	const [selectedApplication, setSelectedApplication] = React.useState<JobApplication | null>(null);
	const [viewMode, setViewMode] = React.useState<'cover-letter' | 'resume' | null>(null);

	// Resolve params and load data
	React.useEffect(() => {
		params.then((paramsData) => {
			setId(paramsData.id);
			const pos = getMockPosition(paramsData.id);
			setPosition(pos);
			if (pos) {
				setApplications(getMockApplicationsForPosition(paramsData.id));
			}
		});
	}, [params]);

	// Pagination calculation
	const totalPages = Math.ceil(applications.length / pageSize);
	const paginatedApplications = applications.slice((page - 1) * pageSize, page * pageSize);

	// Don't render until we have data
	if (!id || !position) return null;

	const applicationColumns: Array<DataTableColumn<JobApplication>> = [
		{
			id: "name",
			header: "Applicant",
			accessor: "name",
			cell: (application) => (
				<div>
					<div className="font-medium text-gray-900">{application.name}</div>
					<div className="flex items-center gap-1 text-sm text-gray-500">
						<Mail size={12} />
						{application.email}
					</div>
				</div>
			),
		},
		{
			id: "contact",
			header: "Contact",
			accessor: "phone",
			cell: (application) => (
				<div className="flex items-center gap-1 text-sm text-gray-600">
					<Phone size={12} />
					{application.phone}
				</div>
			),
		},
		{
			id: "appliedAt",
			header: "Applied Date",
			accessor: "appliedAt",
			cell: (application) => (
				<span className="text-sm text-gray-600">
					{new Date(application.appliedAt).toLocaleDateString()}
				</span>
			),
		},
		{
			id: "actions",
			header: "Actions",
			align: "center",
			accessor: (application) => "",
			cell: (application) => (
				<Button
					variant="secondary"
					size="sm"
					className="gap-1"
					aria-label="View details"
					onClick={() => setSelectedApplication(application)}
				>
					<Eye size={16} />
					View
				</Button>
			),
		},
	];

	return (
		<>
			<div className="space-y-6">
				{/* Existing content */}
				<div className="flex items-center justify-between gap-3">
					<div>
						<h1 className="text-xl sm:text-2xl font-semibold">{position?.title || 'Job Position'} Applicants</h1>
					</div>
				</div>

				{!position ? (
					<Card>
						<CardContent className="p-6">
							<div className="text-[color:var(--color-neutral-700)]">Position not found.</div>
						</CardContent>
					</Card>
				) : (
					<Card>
						<CardContent className="p-0">
							<DataTable
								columns={applicationColumns}
								data={paginatedApplications}
								getRowKey={(application) => application.id}
								emptyMessage="No applicants found for this position"
							/>
							{/* Pagination */}
							{applications.length > pageSize && (
								<div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4">
									<p className="text-sm text-[color:var(--color-neutral-600)]">
										Showing {applications.length === 0 ? 0 : (page - 1) * pageSize + 1}-{Math.min(page * pageSize, applications.length)} of {applications.length}
									</p>
									<div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
										<Button
											variant="secondary"
											size="sm"
											className="w-full sm:w-auto"
											disabled={page === 1}
											onClick={() => setPage(page - 1)}
										>
											Previous
										</Button>
										<div className="text-sm sm:hidden">{page}/{totalPages}</div>
										<div className="text-sm hidden sm:block">Page {page} of {totalPages}</div>
										<Button
											variant="secondary"
											size="sm"
											className="w-full sm:w-auto"
											disabled={page === totalPages}
											onClick={() => setPage(page + 1)}
										>
											Next
										</Button>
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				)}
			</div>

			{/* Application View Modal */}
			<Modal
				open={!!selectedApplication}
				onClose={() => {
					setSelectedApplication(null);
					setViewMode(null);
				}}
				title={`${selectedApplication?.name || 'Applicant'} - ${position?.title || 'Position'}`}
			>
				{selectedApplication && (
					<div className="space-y-6">
						{/* View Options */}
						{!viewMode && (
							<div className="space-y-4">
								<div className="text-center">
									<h3 className="text-xl font-semibold text-[color:var(--color-neutral-900)]">Choose Content to View</h3>
									<p className="text-sm text-[color:var(--color-neutral-600)] mt-1">Select what you'd like to review for this applicant</p>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div
										className="cursor-pointer rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-6 hover:bg-[color:var(--color-neutral-50)] transition-colors"
										onClick={() => setViewMode('cover-letter')}
									>
										<div className="flex flex-col items-center text-center space-y-3">
											<div className="h-12 w-12 rounded-full bg-[color:var(--color-blue-100)] flex items-center justify-center">
												<FileText size={24} className="text-[color:var(--color-blue-600)]" />
											</div>
											<div>
												<div className="font-medium text-[color:var(--color-neutral-900)]">Cover Letter</div>
												<div className="text-sm text-[color:var(--color-neutral-600)] mt-1">Read the applicant's personal letter</div>
											</div>
										</div>
									</div>
									<div
										className="cursor-pointer rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-6 hover:bg-[color:var(--color-neutral-50)] transition-colors"
										onClick={() => setViewMode('resume')}
									>
										<div className="flex flex-col items-center text-center space-y-3">
											<div className="h-12 w-12 rounded-full bg-[color:var(--color-emerald-100)] flex items-center justify-center">
												<Download size={24} className="text-[color:var(--color-emerald-600)]" />
											</div>
											<div>
												<div className="font-medium text-[color:var(--color-neutral-900)]">Resume Files</div>
												<div className="text-sm text-[color:var(--color-neutral-600)] mt-1">
													{selectedApplication.resumeUrls?.length || 0} file{selectedApplication.resumeUrls?.length !== 1 ? 's' : ''} available
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Cover Letter View */}
						{viewMode === 'cover-letter' && (
							<div className="space-y-4">
								<div className="flex items-center justify-start">
									<Button
										variant="secondary"
										size="sm"
										onClick={() => setViewMode(null)}
										className="gap-2 mr-2"
									>
										<ArrowLeft size={16} />
									</Button>
									<h3 className="text-lg font-semibold text-[color:var(--color-neutral-900)]">Cover Letter</h3>
								</div>
								<div className="border border-[color:var(--color-neutral-200)] rounded-lg overflow-hidden">
									<div className="bg-white p-6 max-h-96 overflow-y-auto">
										<div className="prose prose-sm max-w-none">
											<div className="whitespace-pre-wrap text-[color:var(--color-neutral-800)] leading-relaxed">
												{selectedApplication.coverLetter}
											</div>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Resume Files View */}
						{viewMode === 'resume' && (
							<div className="space-y-4">
								<div className="flex items-center justify-start">
                                <Button
										variant="secondary"
										size="sm"
										onClick={() => setViewMode(null)}
										className="gap-2 mr-2"
									>
										<ArrowLeft size={16} />
									</Button>
									<h3 className="text-lg font-semibold text-[color:var(--color-neutral-900)]">Resume Files</h3>
									
								</div>
								{selectedApplication.resumeUrls && selectedApplication.resumeUrls.length > 0 ? (
									<div className="space-y-3">
										<div className="space-y-3">
											{selectedApplication.resumeUrls.map((url, index) => (
												<div key={index} className="border border-[color:var(--color-neutral-200)] rounded-lg p-4 bg-white hover:bg-[color:var(--color-neutral-50)] transition-colors">
													<div className="flex items-center justify-between">
														<div className="flex items-center gap-3">
															<div className="h-10 w-10 rounded-lg bg-[color:var(--color-emerald-100)] flex items-center justify-center">
																<FileText size={20} className="text-[color:var(--color-emerald-600)]" />
															</div>
															<div>
																<div className="text-sm text-[color:var(--color-neutral-600)]">
																	{url.split('/').pop() || 'resume.pdf'}
																</div>
															</div>
														</div>
														<a
															href={url}
															target="_blank"
															rel="noopener noreferrer"
															className="inline-flex items-center justify-center rounded-lg font-medium h-10 px-4 text-sm text-white bg-[color:var(--color-primary-600)] hover:bg-[color:var(--color-primary-700)] shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer gap-2"
														>
															<Download size={16} />
															Download
														</a>
													</div>
												</div>
											))}
										</div>
									</div>
								) : (
									<div className="text-center py-12">
										<div className="h-16 w-16 rounded-full bg-[color:var(--color-neutral-100)] flex items-center justify-center mx-auto mb-4">
											<FileText size={32} className="text-[color:var(--color-neutral-400)]" />
										</div>
										<h4 className="text-lg font-medium text-[color:var(--color-neutral-900)] mb-2">No Resume Files</h4>
										<p className="text-sm text-[color:var(--color-neutral-600)]">
											This applicant hasn't uploaded any resume files yet.
										</p>
									</div>
								)}
							</div>
						)}
					</div>
				)}
			</Modal>
		</>
	);
}