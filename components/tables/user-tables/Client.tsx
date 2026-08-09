"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { User } from "@/constants/Members";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { columns } from "./Columns";

interface ProductsClientProps {
	data: User[];
}

export const UserClient: React.FC<ProductsClientProps> = ({ data }) => {
	const router = useRouter();

	return (
		<>
			<div className="flex items-start justify-between">
				<Heading
					title={`Members (${data.length})`}
					description="Manage users (Client side table functionalities.)"
				/>
				<Button
					className="text-xs md:text-sm"
					onClick={() => router.push(`/dashboard/members/new-member`)}
				>
					<Plus className="mr-2 h-4 w-4" /> Add New
				</Button>
			</div>
			<Separator />
			<div className="bg-slate-100 dark:bg-slate-800 px-3">
				<DataTable searchKey="name" columns={columns} data={data} />
			</div>
		</>
	);
};
