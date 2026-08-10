"use client";

import React from "react";
import LogoArea from "./LogoArea";
import NotifButton from "./NotifButton";
import Search from "./Search";
import { UserButton } from "./auth/UserButton";

export default function Header() {
	return (
		<div className="flex sticky h-18 w-full top-0 z-50 bg-slate-300 shadow justify-between py-1 px-8">
			<LogoArea />
			<Search />
			<div className="flex gap-x-5">
				<NotifButton count={2} />
				<UserButton />
			</div>
		</div>
	);
}
