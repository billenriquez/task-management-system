"use client";

import { FaUser } from "react-icons/fa";
import { ExitIcon } from "@radix-ui/react-icons";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/UseCurrentUser";
import { LogoutButton } from "@/components/auth/LogoutButton";
import {
	ChevronDown,
	KeyIcon,
	SettingsIcon,
	User2Icon,
	UserIcon,
} from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";

export const UserButton = () => {
	const user = useCurrentUser();

	return (
		<div className="flex items-center gap-2">
			<p className="font-bold">{user?.name}</p>
			<DropdownMenu>
				<DropdownMenuTrigger className="flex items-center">
					<Avatar>
						<AvatarImage src={user?.image || ""} />
						<AvatarFallback className="bg-sky-500">
							<FaUser className="text-white" />
						</AvatarFallback>
					</Avatar>
					<ChevronDown />
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end">
					<LogoutButton>
						<DropdownMenuItem>
							<UserIcon className="h-4 w-4 mr-2" />
							Profile
						</DropdownMenuItem>
						<DropdownMenuItem>
							<User2Icon className="h-4 w-4 mr-2" />
							Manage Account
						</DropdownMenuItem>
						<DropdownMenuItem>
							<KeyIcon className="h-4 w-4 mr-2" />
							Change Password
						</DropdownMenuItem>
						<DropdownMenuItem>
							<SettingsIcon className="h-4 w-4 mr-2" />
							Settings
						</DropdownMenuItem>
						<Separator />
						<DropdownMenuItem>
							<ExitIcon className="h-4 w-4 mr-2" />
							Logout
						</DropdownMenuItem>
					</LogoutButton>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
