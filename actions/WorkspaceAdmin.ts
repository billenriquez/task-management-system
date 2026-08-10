"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

import { currentUser } from "@/lib/Auth";
import { db } from "@/lib/db";
import { currentWorkspace } from "@/lib/Workspace";
import { sendWorkspaceInvitationEmail } from "@/lib/Mail";

const isAdministrator = (role: string) => role === "OWNER" || role === "ADMIN";

export const inviteWorkspaceMember = async (formData: FormData) => {
	const user = await currentUser();
	const membership = await currentWorkspace();
	const email = String(formData.get("email") || "").trim().toLowerCase();
	const role = String(formData.get("role") || "MEMBER");
	if (!user?.id || !membership || !isAdministrator(membership.role) || !email) return;
	if (!["ADMIN", "DEPARTMENT_MANAGER", "SENIOR_MEMBER", "MEMBER"].includes(role)) return;

	const token = randomUUID();
	const existingUser = await db.user.findUnique({ where: { email }, select: { id: true } });
	if (existingUser) {
		await db.workspaceMember.upsert({
			where: { workspaceId_userId: { workspaceId: membership.workspaceId, userId: existingUser.id } },
			update: { role: role as "ADMIN" | "DEPARTMENT_MANAGER" | "SENIOR_MEMBER" | "MEMBER" },
			create: { workspaceId: membership.workspaceId, userId: existingUser.id, role: role as "ADMIN" | "DEPARTMENT_MANAGER" | "SENIOR_MEMBER" | "MEMBER" },
		});
		revalidatePath("/dashboard/admin");
		revalidatePath("/dashboard/projects");
		return;
	}
	await db.invitation.create({
		data: { workspaceId: membership.workspaceId, email, role: role as "ADMIN" | "DEPARTMENT_MANAGER" | "SENIOR_MEMBER" | "MEMBER", token, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), invitedById: user.id },
	});
	await sendWorkspaceInvitationEmail(email, token, membership.workspace.name);
	revalidatePath("/dashboard/admin");
};
