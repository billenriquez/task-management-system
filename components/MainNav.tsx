import React from "react";
import Link from "next/link";

export default function NavBar() {
	return (
		<nav className="p-4">
			<ul className="flex justify-evenly text-base font-bold text-black gap-x-5">
				<li>
					<span className="hover:text-violet-600">
						<Link href="/">Home</Link>
					</span>
				</li>
				<li>
					<span className="hover:text-violet-600">
						<Link href="/links">Links</Link>
					</span>
				</li>
				<li>
					<span className="hover:text-violet-600">
						<Link href="/api/auth/signin">Sign In</Link>
					</span>
				</li>
				<li>
					<span className="bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 text-white py-2 px-4 rounded-lg">
						<Link href="/api/auth/signout">Sign Out</Link>
					</span>
				</li>
			</ul>
		</nav>
	);
}
