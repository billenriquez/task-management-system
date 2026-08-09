"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function Search() {
	const [search, setSearch] = useState("");
	const router = useRouter();

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSearch("");
		router.push(`/${search}/`);
	};

	return (
		<div className="p-1">
			<form
				className="w-100 flex items-center justify-center md:justify-between"
				onSubmit={handleSubmit}
			>
				<input
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="bg-white p-2 w-80 text-xl text-black rounded-xl"
					placeholder="Search"
				/>
				<button className="p-2 text-xl rounded-xl bg-slate-400 ml-2 font-bold">
					&#128269;
				</button>
			</form>
		</div>
	);
}
