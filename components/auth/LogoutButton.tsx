"use client";

import { signOut } from "next-auth/react";

interface LogoutButtonProps {
	children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
	const onClick = () => {
		void signOut({ callbackUrl: "/" });
	};

	return (
		<span onClick={onClick} className="cursor-pointer">
			{children}
		</span>
	);
};
