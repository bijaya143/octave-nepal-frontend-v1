import React from "react";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";
import { Users, BookOpen, Wallet, BookCheck } from "lucide-react";

export default function AdminDashboardPage() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-xl sm:text-2xl font-semibold">Dashboard</h1>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<StatCard title="Total Users" value="1,248" Icon={Users} />
				<StatCard title="Active Courses" value="38" Icon={BookOpen} />
				<StatCard title="Enrollments" value="562" Icon={BookCheck} />
				<StatCard title="Revenue" value="Rs. 4,52,300" Icon={Wallet} />
			</div>

			<Card>
				<CardHeader>
					<h2 className="text-lg font-semibold">Recent Activity</h2>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-[color:var(--color-neutral-600)]">No recent activity to display.</p>
				</CardContent>
			</Card>
		</div>
	);
}

function StatCard({
	title,
	value,
	Icon,
}: {
	title: string;
	value: string;
	Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
	return (
		<Card>
			<CardHeader className="pt-4">
				<div className="flex items-center gap-3 text-[color:var(--color-neutral-600)]">
					<Icon className="h-4 w-4" />
					<span className="text-sm">{title}</span>
				</div>
			</CardHeader>
			<CardContent className="pb-4">
				<div className="text-2xl font-semibold">{value}</div>
			</CardContent>
		</Card>
	);
}


