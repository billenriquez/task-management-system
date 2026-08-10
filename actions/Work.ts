"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { currentUser } from "@/lib/Auth";
import { db } from "@/lib/db";
import { currentWorkspace } from "@/lib/Workspace";

const getAuthenticatedUser = async () => {
	const user = await currentUser();
	if (!user?.id) redirect("/auth/login");
	return user;
};

const text = (value: FormDataEntryValue | null) =>
	typeof value === "string" ? value.trim() : "";

const revalidateWork = () => {
	revalidatePath("/dashboard");
	revalidatePath("/dashboard/projects");
	revalidatePath("/dashboard/tasks");
};

const taskStatusForProgress = (progress: number) => progress === 0 ? "TODO" : progress === 100 ? "DONE" : "IN_PROGRESS";

// Parent tasks are roll-ups: their progress and status always come from their direct children.
const syncParentProgress = async (parentId: string | null) => {
	if (!parentId) return;
	const parent = await db.task.findUnique({
		where: { id: parentId },
		select: { id: true, parentId: true, children: { select: { progress: true } } },
	});
	if (!parent || parent.children.length === 0) return;
	const progress = Math.round(parent.children.reduce((total, child) => total + child.progress, 0) / parent.children.length);
	await db.task.update({ where: { id: parent.id }, data: { progress, status: taskStatusForProgress(progress) } });
	await syncParentProgress(parent.parentId);
};

export const createProject = async (formData: FormData) => {
	const user = await getAuthenticatedUser();
	const membership = await currentWorkspace();
	const name = text(formData.get("name"));
	const description = text(formData.get("description"));

	if (!name || !membership || !["OWNER", "ADMIN", "DEPARTMENT_MANAGER"].includes(membership.role)) return;

	await db.project.create({
		data: { name, description: description || null, ownerId: user.id, workspaceId: membership.workspaceId },
	});

	revalidatePath("/dashboard");
	revalidatePath("/dashboard/projects");
	revalidatePath("/dashboard/tasks");
};

export const createTask = async (formData: FormData) => {
	const user = await getAuthenticatedUser();
	const title = text(formData.get("title"));
	const projectId = text(formData.get("projectId"));
	const description = text(formData.get("description"));
	const priority = text(formData.get("priority"));
	const dueDate = text(formData.get("dueDate"));

	if (!title || !projectId) return;

	const project = await db.project.findFirst({
		where: { id: projectId, OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }] },
		select: { id: true },
	});
	if (!project) return;

	await db.task.create({
		data: {
			title,
			description: description || null,
			priority: priority === "HIGH" || priority === "LOW" ? priority : "MEDIUM",
			dueDate: dueDate ? new Date(`${dueDate}T12:00:00`) : null,
			projectId: project.id,
			assigneeId: user.id,
		},
	});

	revalidatePath("/dashboard");
	revalidatePath("/dashboard/projects");
	revalidatePath("/dashboard/tasks");
};

export const addProjectMember = async (projectId: string, formData: FormData) => {
	const user = await getAuthenticatedUser();
	const workspaceMembership = await currentWorkspace();
	const email = text(formData.get("email")).toLowerCase();
	if (!email) return;

	const project = await db.project.findFirst({ where: { id: projectId, ownerId: user.id, workspaceId: workspaceMembership?.workspaceId }, select: { id: true } });
	const member = await db.user.findUnique({ where: { email }, select: { id: true } });
	if (!project || !member || member.id === user.id || !workspaceMembership) return;
	const isApprovedWorkspaceMember = await db.workspaceMember.findUnique({
		where: { workspaceId_userId: { workspaceId: workspaceMembership.workspaceId, userId: member.id } },
		select: { id: true },
	});
	if (!isApprovedWorkspaceMember) return;

	await db.projectMember.upsert({
		where: { projectId_userId: { projectId: project.id, userId: member.id } },
		update: {},
		create: { projectId: project.id, userId: member.id },
	});

	revalidatePath("/dashboard");
	revalidatePath("/dashboard/projects");
	revalidatePath("/dashboard/tasks");
};

export const delegateProject = async (projectId: string, formData: FormData) => {
	const user = await getAuthenticatedUser();
	const workspaceMembership = await currentWorkspace();
	const newOwnerId = text(formData.get("newOwnerId"));
	if (!workspaceMembership || !newOwnerId || !["OWNER", "ADMIN"].includes(workspaceMembership.role)) return;

	const [project, newOwnerMembership] = await Promise.all([
		db.project.findFirst({ where: { id: projectId, workspaceId: workspaceMembership.workspaceId }, select: { id: true } }),
		db.workspaceMember.findUnique({ where: { workspaceId_userId: { workspaceId: workspaceMembership.workspaceId, userId: newOwnerId } }, select: { role: true } }),
	]);
	if (!project || newOwnerMembership?.role !== "DEPARTMENT_MANAGER") return;

	await db.project.update({ where: { id: project.id }, data: { ownerId: newOwnerId } });
	revalidatePath("/dashboard");
	revalidatePath("/dashboard/projects");
	revalidatePath("/dashboard/tasks");
};

export const assignTask = async (taskId: string, formData: FormData) => {
	const user = await getAuthenticatedUser();
	const assigneeId = text(formData.get("assigneeId"));
	if (!assigneeId) return;

	const task = await db.task.findFirst({
		where: { id: taskId },
		include: { project: { select: { ownerId: true } } },
	});
	if (!task || task.project.ownerId !== user.id) return;

	const isProjectMember = assigneeId === user.id || await db.projectMember.findUnique({
		where: { projectId_userId: { projectId: task.projectId, userId: assigneeId } },
		select: { id: true },
	});
	if (!isProjectMember) return;

	await db.task.update({ where: { id: task.id }, data: { assigneeId } });
	revalidatePath("/dashboard");
	revalidatePath("/dashboard/tasks");
};

export const createSubtask = async (parentId: string, formData: FormData) => {
	const user = await getAuthenticatedUser();
	const title = text(formData.get("title"));
	const assigneeId = text(formData.get("assigneeId"));
	const priority = text(formData.get("priority"));
	const dueDate = text(formData.get("dueDate"));
	if (!title || !assigneeId) return;

	const parent = await db.task.findFirst({
		where: { id: parentId },
		include: { project: { include: { members: { select: { userId: true } } } } },
	});
	if (!parent) return;
	const isProjectOwner = parent.project.ownerId === user.id;
	const isTaskLead = parent.assigneeId === user.id && parent.delegationScope === "PROJECT_MEMBERS";
	if (!isProjectOwner && !isTaskLead) return;
	const allowedAssignees = [parent.project.ownerId, ...parent.project.members.map((member) => member.userId)];
	if (!allowedAssignees.includes(assigneeId)) return;

	await db.task.create({
		data: {
			title,
			priority: priority === "HIGH" || priority === "LOW" ? priority : "MEDIUM",
			dueDate: dueDate ? new Date(`${dueDate}T12:00:00`) : null,
			projectId: parent.projectId,
			assigneeId,
			parentId: parent.id,
			delegationScope: "NONE",
		},
	});
	await syncParentProgress(parent.id);
	revalidateWork();
};

export const updateTaskDelegation = async (taskId: string, scope: "NONE" | "PROJECT_MEMBERS") => {
	const user = await getAuthenticatedUser();
	const task = await db.task.findFirst({ where: { id: taskId }, include: { project: { select: { ownerId: true } } } });
	if (!task || (task.project.ownerId !== user.id && task.assigneeId !== user.id)) return;
	await db.task.update({ where: { id: task.id }, data: { delegationScope: scope } });
	revalidateWork();
};

export const updateTaskProgress = async (taskId: string, formData: FormData) => {
	const user = await getAuthenticatedUser();
	const requestedProgress = Number(text(formData.get("progress")));
	if (!Number.isInteger(requestedProgress) || requestedProgress < 0 || requestedProgress > 100) return;
	const task = await db.task.findUnique({
		where: { id: taskId },
		select: { id: true, parentId: true, assigneeId: true, children: { select: { id: true } }, collaborators: { where: { userId: user.id }, select: { id: true } } },
	});
	if (!task || task.children.length > 0 || (task.assigneeId !== user.id && task.collaborators.length === 0)) return;
	await db.task.update({ where: { id: task.id }, data: { progress: requestedProgress, status: taskStatusForProgress(requestedProgress) } });
	await syncParentProgress(task.parentId);
	revalidateWork();
};

export const addTaskCollaborator = async (taskId: string, formData: FormData) => {
	const user = await getAuthenticatedUser();
	const collaboratorId = text(formData.get("collaboratorId"));
	if (!collaboratorId) return;
	const task = await db.task.findUnique({ where: { id: taskId }, include: { project: { select: { ownerId: true, members: { select: { userId: true } } } } } });
	if (!task || (task.project.ownerId !== user.id && task.assigneeId !== user.id) || collaboratorId === task.assigneeId) return;
	const permitted = collaboratorId === task.project.ownerId || task.project.members.some((member) => member.userId === collaboratorId);
	if (!permitted) return;
	await db.taskCollaborator.upsert({ where: { taskId_userId: { taskId: task.id, userId: collaboratorId } }, update: {}, create: { taskId: task.id, userId: collaboratorId } });
	revalidateWork();
};

export const removeTaskCollaborator = async (taskId: string, collaboratorId: string) => {
	const user = await getAuthenticatedUser();
	const task = await db.task.findUnique({ where: { id: taskId }, include: { project: { select: { ownerId: true } } } });
	if (!task || (task.project.ownerId !== user.id && task.assigneeId !== user.id && collaboratorId !== user.id)) return;
	await db.taskCollaborator.deleteMany({ where: { taskId: task.id, userId: collaboratorId } });
	revalidateWork();
};
