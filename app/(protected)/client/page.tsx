"use client";

import { UserInfo } from "@/components/UserInfo";
import { useCurrentUser } from "@/hooks/UseCurrentUser";

const ClientPage = () => {
	const user = useCurrentUser();

	return <UserInfo label="📱 Client component" user={user} />;
};

export default ClientPage;
