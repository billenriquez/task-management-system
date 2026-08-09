import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

export default function CalendarPage() {
	return (
		<ScrollArea className="h-full">
			<div className="flex-1 space-y-4 p-4 md:p-8">
				<div className="flex items-center justify-between space-y-2">
					<div className="flex w-full h-full content-center items-center text-white text-2xl">
						Calendar Page
					</div>
				</div>
			</div>
		</ScrollArea>
	);
}
