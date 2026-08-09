import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "TaskMate",
	description: "Task Management System",
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.className} overflow-hidden`}>
				<SessionProvider session={session}>
					<Toaster />
					{children}
				</SessionProvider>
			</body>
		</html>
	);
}
