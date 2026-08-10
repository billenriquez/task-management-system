import Header from "@/components/DashboardHeader";
import SideBar from "@/components/SideBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "TaskMate - Dashboard",
	description: "Dashboard for Task Management System",
};

interface ProtectedLayoutProps {
	children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
	return (
		<div className="flex h-screen flex-col overflow-hidden">
			<Header />
			<div className="flex min-h-0 flex-1 w-full overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-200 to-blue-500">
				<SideBar />
				<main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
			</div>
		</div>
	);
};

export default ProtectedLayout;
