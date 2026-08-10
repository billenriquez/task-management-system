import { currentUser } from "@/lib/Auth";
import { db } from "@/lib/db";

export const currentWorkspace = async () => {
	const user = await currentUser();
	if (!user?.id) return null;

	return db.workspaceMember.findFirst({
		where: { userId: user.id },
		include: { workspace: true },
		orderBy: [{ role: "asc" }, { createdAt: "asc" }],
	});
};
