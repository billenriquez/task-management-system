import BreadCrumb from "@/components/BreadCrumb";
import { UserClient } from "@/components/tables/user-tables/Client";
import { Members } from "@/constants/Members";

const breadcrumbItems = [{ title: "User", link: "/dashboard/user" }];
export default function MembersPage() {
	return (
		<>
			<div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
				<BreadCrumb items={breadcrumbItems} />
				<UserClient data={Members} />
			</div>
		</>
	);
}
