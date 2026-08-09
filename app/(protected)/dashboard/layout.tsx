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
		<>
			<Header />
			<div className="flex h-screen w-full overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-200 to-blue-500">
				<SideBar />
				<main className="w-full">{children}</main>
			</div>
		</>
	);
};

export default ProtectedLayout;
