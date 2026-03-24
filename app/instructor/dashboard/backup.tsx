// "use client";
// import React from "react";
// import Card, { CardContent } from "../../../components/ui/Card";
// import Button from "../../../components/ui/Button";
// import Container from "../../../components/Container";
// import Badge from "../../../components/ui/Badge";
// import Modal from "../../../components/ui/Modal";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import {
//   BookOpen,
//   Users,
//   Wallet,
//   ClipboardList,
//   CalendarClock,
//   Megaphone,
//   MessageSquare,
//   Star,
//   TrendingUp,
//   ChevronRight,
//   Plus,
//   CreditCard,
// } from "lucide-react";

// type OpenModalKey =
//   | null
//   | "submissions"
//   | "sessions"
//   | "announcements"
//   | "messages";

// export default function InstructorDashboardPage() {
//   const [openModal, setOpenModal] = React.useState<OpenModalKey>(null);
//   const router = useRouter();

//   const handleOpen = (key: Exclude<OpenModalKey, null>) => setOpenModal(key);
//   const handleClose = () => setOpenModal(null);

//   const stats = [
//     { label: "Published Courses", value: 4, Icon: BookOpen },
//     { label: "Active Students", value: 128, Icon: Users },
//     { label: "Active Enrollments", value: 176, Icon: TrendingUp },
//     { label: "Pending Payouts", value: "Rs 12400", Icon: Wallet },
//   ];

//   const courses = [
//     { id: "react-19", title: "React 19 Fundamentals", students: 64, rating: 4.7, revenue: 54000 },
//     { id: "ts-mastery", title: "TypeScript Mastery", students: 38, rating: 4.6, revenue: 31200 },
//     { id: "node-api", title: "Node.js APIs", students: 22, rating: 4.5, revenue: 19800 },
//   ];

//   const payouts = [
//     { id: "tx_01", date: "Oct 20, 2025", amount: 6200, status: "Completed" },
//     { id: "tx_02", date: "Oct 12, 2025", amount: 4800, status: "Completed" },
//     { id: "tx_03", date: "Oct 5, 2025", amount: 3400, status: "Processing" },
//   ];

//   const getStatusBadgeClassName = (status: string): string => {
//     const s = status.toLowerCase();
//     if (s.includes("complete")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
//     if (s.includes("process") || s.includes("pending")) return "bg-amber-50 text-amber-700 border-amber-200";
//     if (s.includes("fail") || s.includes("cancel")) return "bg-rose-50 text-rose-700 border-rose-200";
//     return "bg-gray-50 text-gray-700 border-gray-200";
//   };

//   return (
//     <main className="py-10">
//       <Container>
//         {/* Instructor dashboard header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
//           <h1 className="text-xl md:text-2xl font-semibold" style={{ fontFamily: "var(--font-heading-sans)" }}>
//             Dashboard
//           </h1>
//           <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
//             {/* <Button size="sm" variant="secondary" className="inline-flex items-center gap-2 w-full sm:w-auto justify-center" onClick={() => router.push("/courses") }>
//               <Plus size={16} className="md:hidden lg:inline" />
//               Create course
//             </Button> */}
//             <Button size="sm" variant="secondary" className="inline-flex items-center gap-2 w-full sm:w-auto justify-center" onClick={() => handleOpen("sessions") }>
//               <CalendarClock size={16} className="md:hidden lg:inline" />
//               Schedule session
//             </Button>
//             <Button size="sm" className="inline-flex items-center gap-2 w-full sm:w-auto justify-center" onClick={() => handleOpen("announcements") }>
//               <Megaphone size={16} className="md:hidden lg:inline" />
//               Post announcement
//             </Button>
//           </div>
//         </div>

//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
//           {/* Main column */}
//           <section className="md:col-span-2 lg:col-span-2 space-y-6">
//             {/* Stats */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//               {stats.map((s) => (
//                 <Card key={s.label} className="relative overflow-hidden group">
//                   <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.10),transparent_60%)]" />
//                   <CardContent className="relative py-4">
//                     <div className="flex items-center justify-between gap-3">
//                       <div>
//                         <div className="text-xs text-[color:var(--color-neutral-600)]">{s.label}</div>
//                         <div className="mt-1 text-lg font-semibold" style={{ fontFamily: "var(--font-heading-sans)" }}>
//                           {s.value}
//                         </div>
//                       </div>
//                       <div className="h-9 w-9 shrink-0 rounded-lg border border-[color:var(--color-neutral-200)] bg-white text-[color:var(--color-primary-700)] shadow-xs flex items-center justify-center lg:hidden">
//                         <s.Icon size={16} aria-hidden="true" />
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>

//             {/* Your courses */}
//             <div>
//               <div className="flex items-center justify-between mb-3">
//                 <h2 className="text-base font-semibold" style={{ fontFamily: "var(--font-heading-sans)" }}>Your courses</h2>
//                 <Link href="/instructor/courses" className="text-sm text-[color:var(--color-primary-700)] hover:underline underline-offset-2 whitespace-nowrap">View all</Link>
//               </div>
//               <div className="grid sm:grid-cols-2 gap-4">
//                 {courses.map((c) => (
//                   <Card key={c.id} className="relative overflow-hidden">
//                     <CardContent className="py-5">
//                       <div className="flex items-start justify-between gap-3">
//                         <div>
//                           <div className="text-sm font-medium">{c.title}</div>
//                           <div className="mt-1 flex items-center gap-3 text-xs text-[color:var(--color-neutral-600)]">
//                             <span className="inline-flex items-center gap-1"><Users size={14} /> {c.students} students</span>
//                             <span className="inline-flex items-center gap-1"><Star size={14} /> {c.rating}</span>
//                           </div>
//                         </div>
//                         <Button size="sm" variant="secondary" onClick={() => router.push(`/courses/${c.id}`)}>View</Button>
//                       </div>
//                       <div className="mt-4">
//                         <div className="flex items-center justify-between text-xs mb-1">
//                           <span>Revenue</span>
//                           <span>Rs {c.revenue.toLocaleString()}</span>
//                         </div>
//                         <div className="h-2 w-full rounded-full bg-[color:var(--color-neutral-200)] overflow-hidden">
//                           <div className="h-full w-[60%] rounded-full bg-[color:var(--color-primary-500)]" />
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </div>

//             {/* Quick overview */}
//             <div>
//               <h2 className="text-base font-semibold mb-3" style={{ fontFamily: "var(--font-heading-sans)" }}>Quick overview</h2>
//               <div className="grid sm:grid-cols-2 gap-4">
//                 {/* Submissions to review */}
//                 <Card className="relative overflow-hidden group cursor-pointer" onClick={() => handleOpen("submissions")}>
//                   <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_60%)]" />
//                   <CardContent className="relative py-5">
//                     <div className="flex items-center justify-between gap-3">
//                       <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-heading-sans)" }}>Submissions to review</h3>
//                       <div className="h-9 w-9 rounded-lg border border-[color:var(--color-neutral-200)] bg-white text-[color:var(--color-primary-700)] shadow-xs flex items-center justify-center">
//                         <ClipboardList size={16} aria-hidden="true" />
//                       </div>
//                     </div>
//                     <div className="mt-3 inline-flex items-center gap-1 text-xs text-[color:var(--color-primary-700)]">
//                       <span>View</span>
//                       <ChevronRight size={14} aria-hidden="true" />
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* Upcoming sessions */}
//                 <Card className="relative overflow-hidden group cursor-pointer" onClick={() => handleOpen("sessions")}>
//                   <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.07),transparent_60%)]" />
//                   <CardContent className="relative py-5">
//                     <div className="flex items-center justify-between gap-3">
//                       <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-heading-sans)" }}>Upcoming sessions</h3>
//                       <div className="h-9 w-9 rounded-lg border border-[color:var(--color-neutral-200)] bg-white text-[color:var(--color-primary-700)] shadow-xs flex items-center justify-center">
//                         <CalendarClock size={16} aria-hidden="true" />
//                       </div>
//                     </div>
//                     <div className="mt-3 inline-flex items-center gap-1 text-xs text-[color:var(--color-primary-700)]">
//                       <span>View</span>
//                       <ChevronRight size={14} aria-hidden="true" />
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* Announcements */}
//                 <Card className="relative overflow-hidden group cursor-pointer" onClick={() => handleOpen("announcements")}>
//                   <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08),transparent_60%)]" />
//                   <CardContent className="relative py-5">
//                     <div className="flex items-center justify-between gap-3">
//                       <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-heading-sans)" }}>Announcements</h3>
//                       <div className="h-9 w-9 rounded-lg border border-[color:var(--color-neutral-200)] bg-white text-[color:var(--color-primary-700)] shadow-xs flex items-center justify-center">
//                         <Megaphone size={16} aria-hidden="true" />
//                       </div>
//                     </div>
//                     <div className="mt-3 inline-flex items-center gap-1 text-xs text-[color:var(--color-primary-700)]">
//                       <span>View</span>
//                       <ChevronRight size={14} aria-hidden="true" />
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* Messages */}
//                 <Card className="relative overflow-hidden group cursor-pointer" onClick={() => handleOpen("messages")}>
//                   <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(234,179,8,0.10),transparent_60%)]" />
//                   <CardContent className="relative py-5">
//                     <div className="flex items-center justify-between gap-3">
//                       <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-heading-sans)" }}>Messages</h3>
//                       <div className="h-9 w-9 rounded-lg border border-[color:var(--color-neutral-200)] bg-white text-[color:var(--color-primary-700)] shadow-xs flex items-center justify-center">
//                         <MessageSquare size={16} aria-hidden="true" />
//                       </div>
//                     </div>
//                     <div className="mt-3 inline-flex items-center gap-1 text-xs text-[color:var(--color-primary-700)]">
//                       <span>View</span>
//                       <ChevronRight size={14} aria-hidden="true" />
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           </section>

//           {/* Sidebar */}
//           <aside className="space-y-6">
//             {/* Payouts */}
//             <Card className="relative overflow-hidden">
//               <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_60%)]" />
//               <CardContent className="relative py-5">
//                 <div className="flex items-center justify-between">
//                   <div className="text-sm font-medium">Payouts</div>
//                   <div className="h-8 w-8 rounded-lg border border-[color:var(--color-neutral-200)] bg-white text-[color:var(--color-primary-700)] shadow-xs flex items-center justify-center">
//                     <CreditCard size={16} aria-hidden="true" />
//                   </div>
//                 </div>
//                 <div className="mt-3 space-y-2 text-sm">
//                   {payouts.map((p) => (
//                     <div key={p.id} className="flex items-center justify-between">
//                       <div className="min-w-0">
//                         <div className="font-medium">Rs {p.amount.toLocaleString()}</div>
//                         <div className="text-xs text-[color:var(--color-neutral-600)]">{p.date}</div>
//                       </div>
//                       <Badge variant="outline" className={getStatusBadgeClassName(p.status)}>{p.status}</Badge>
//                     </div>
//                   ))}
//                 </div>
//                 <Button onClick={() => router.push("/instructor/payouts")} size="sm" variant="secondary" className="mt-4 w-full">Manage</Button>
//               </CardContent>
//             </Card>

//             {/* Support */}
//             <Card>
//               <CardContent className="py-5">
//                 <div className="text-sm font-medium">Need help?</div>
//                 <div className="mt-2 text-xs text-[color:var(--color-neutral-600)]">Chat with support or browse FAQs.</div>
//                 <div className="mt-3 grid grid-cols-2 gap-2">
//                   <Link href="/contact" className="w-full">
//                     <Button size="sm" variant="secondary" className="w-full">Contact</Button>
//                   </Link>
//                   <Link href="/faq" className="w-full">
//                     <Button size="sm" variant="secondary" className="w-full">FAQ</Button>
//                   </Link>
//                 </div>
//               </CardContent>
//             </Card>
//           </aside>
//         </div>

//         {/* Modals */}
//         <Modal open={openModal === "submissions"} onClose={handleClose} title="Submissions to review">
//           <div className="space-y-3 text-sm">
//             {[{ title: "Todo App – Final Project", course: "React 19", student: "Aayush" }, { title: "Utility Types", course: "TypeScript", student: "Sita" }].map((a) => (
//               <div key={a.title} className="flex items-center justify-between gap-3">
//                 <div className="min-w-0">
//                   <div className="font-medium truncate">{a.title}</div>
//                   <div className="text-xs text-[color:var(--color-neutral-600)]">{a.course} · {a.student}</div>
//                 </div>
//                 <Button size="sm" variant="secondary">Review</Button>
//               </div>
//             ))}
//           </div>
//         </Modal>

//         <Modal open={openModal === "sessions"} onClose={handleClose} title="Upcoming sessions">
//           <div className="space-y-3 text-sm">
//             {[{ when: "Wed 7:00 PM", course: "React 19" }, { when: "Fri 6:30 PM", course: "TypeScript" }].map((s) => (
//               <div key={s.when + s.course} className="flex items-center justify-between gap-3">
//                 <div>
//                   <div className="font-medium">{s.course}</div>
//                   <div className="text-xs text-[color:var(--color-neutral-600)]">{s.when}</div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Button size="sm" variant="secondary">Start</Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Modal>

//         <Modal open={openModal === "announcements"} onClose={handleClose} title="Announcements">
//           <div className="space-y-3 text-sm">
//             {[{ title: "New resource uploaded", detail: "TS cheatsheet added to course files" }, { title: "Schedule change", detail: "Node.js API session moved to Sat 10AM" }].map((n) => (
//               <div key={n.title}>
//                 <div className="font-medium">{n.title}</div>
//                 <div className="text-xs text-[color:var(--color-neutral-600)] mt-0.5">{n.detail}</div>
//               </div>
//             ))}
//             <Button size="sm" className="mt-2">Create announcement</Button>
//           </div>
//         </Modal>

//         <Modal open={openModal === "messages"} onClose={handleClose} title="Recent messages">
//           <div className="space-y-3 text-sm">
//             {[{ from: "Prakash", about: "Assignment deadline" }, { from: "Nirmala", about: "Course access" }].map((m) => (
//               <div key={m.from + m.about} className="flex items-center justify-between">
//                 <div>
//                   <div className="font-medium">{m.from}</div>
//                   <div className="text-xs text-[color:var(--color-neutral-600)]">{m.about}</div>
//                 </div>
//                 <Button size="sm" variant="secondary">Reply</Button>
//               </div>
//             ))}
//           </div>
//         </Modal>
//       </Container>
//     </main>
//   );
// }


