import Header from "@/components/HomeHeader";
import Image from "next/image";

export default function Home() {
	return (
		<main className="flex flex-col min-h-screen">
			<Header />
			<div className="flex flex-col w-full h-screen items-center justify-center ify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-200 to-blue-500">
				<h1>This homepage content area is to be implemented...</h1>
			</div>
		</main>
	);
}
