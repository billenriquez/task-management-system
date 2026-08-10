"use client";

import Link from "next/link";
import { ExitIcon } from "@radix-ui/react-icons";
import { FaUser } from "react-icons/fa";
import { ChevronDown, KeyRound, ShieldCheck, UserRound } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/UseCurrentUser";
import { LogoutButton } from "@/components/auth/LogoutButton";

export const UserButton = () => {
	const user = useCurrentUser();
	return <div className="flex items-center gap-2">
		<p className="font-bold">{user?.name}</p>
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-blue-600"><Avatar><AvatarImage src={user?.image || ""} /><AvatarFallback className="bg-sky-500"><FaUser className="text-white" /></AvatarFallback></Avatar><ChevronDown /></DropdownMenuTrigger>
			<DropdownMenuContent className="w-64" align="end">
				<DropdownMenuLabel className="font-normal"><p className="font-semibold text-slate-900">{user?.name || "Your account"}</p><p className="mt-1 truncate text-xs text-muted-foreground">{user?.email}</p></DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild><Link href="/dashboard/profile"><UserRound className="mr-2 h-4 w-4" />Profile</Link></DropdownMenuItem>
				<DropdownMenuItem asChild><Link href="/settings"><KeyRound className="mr-2 h-4 w-4" />Account & security</Link></DropdownMenuItem>
				{user?.role === "ADMIN" && <DropdownMenuItem asChild><Link href="/dashboard/admin"><ShieldCheck className="mr-2 h-4 w-4" />Workspace admin</Link></DropdownMenuItem>}
				<DropdownMenuSeparator />
				<LogoutButton><DropdownMenuItem className="text-red-600 focus:text-red-600"><ExitIcon className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem></LogoutButton>
			</DropdownMenuContent>
		</DropdownMenu>
	</div>;
};
