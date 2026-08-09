import React from "react";
import LogoArea from "./LogoArea";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Header() {
	return (
		<div className="flex sticky h-18 w-full top-0 z-50 bg-slate-300 border-y-2 border-slate-400 shadow-lg items-center justify-between py-1 px-8">
			<LogoArea />
			<Button asChild size={"lg"}>
				<Link href="/auth/login">Login</Link>
			</Button>
		</div>
	);
}
