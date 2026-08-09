import { currentUser } from "@/lib/Auth";
import { UserInfo } from "@/components/UserInfo";

const ServerPage = async () => {
	const user = await currentUser();

	return <UserInfo label="💻 Server component" user={user} />;
};

export default ServerPage;
