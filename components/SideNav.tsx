// components/SideNav.tsx
"use client";
import { useState } from "react";
import Link from "next/link";

export default function SideNav() {
	const [isMenuOpen, setMenuOpen] = useState(true);

	const toggleMenu = () => {
		setMenuOpen(!isMenuOpen);
	};

	return (
		<div
			className={`fixed left-0 top-0 h-full w-56 bg-white overflow-x-hidden transition-transform ${
				isMenuOpen ? "translate-x-0" : "-translate-x-56"
			}`}
		>
			<div className="p-4 cursor-pointer" onClick={toggleMenu}>
				<div className="w-6 h-px bg-white mb-1"></div>
				<div className="w-6 h-px bg-white mb-1"></div>
				<div className="w-6 h-px bg-white"></div>
			</div>
			<ul className="list-none p-0 m-0">
				<li className="p-4 border-b border-gray-700">
					<Link href="/" className="text-gray-900">
						Home
					</Link>
				</li>
				<li className="p-4 border-b border-gray-700">
					<div
						className="flex justify-between items-center cursor-pointer"
						onClick={toggleMenu}
					>
						<span className="text-gray-900">Products</span>
						<div className="w-4 h-4 border-t border-r transform rotate-45 border-white transition-transform"></div>
					</div>
					<ul className="list-none p-0 m-0 ml-4">
						<li className="p-2">
							<Link href="../login" className="text-gray-900">
								Login
							</Link>
						</li>
						<li className="p-2">
							<Link href="../register" className="text-gray-900">
								Register
							</Link>
						</li>
					</ul>
				</li>
				{/* Add more menu items as needed */}
			</ul>
		</div>
	);
}
