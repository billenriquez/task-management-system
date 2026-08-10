import Link from "next/link";
import type { ReactNode } from "react";
import { ListTodo, Users } from "lucide-react";
import { format } from "date-fns";
import { addTaskCollaborator, assignTask, createSubtask, createTask, removeTaskCollaborator, updateTaskDelegation, updateTaskProgress } from "@/actions/Work";
import { TaskStatusBadge } from "@/components/work/TaskStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { currentUser } from "@/lib/Auth";
import { db } from "@/lib/db";

export default async function TasksPage({ searchParams }: { searchParams?: { projects?: string | string[] } }) {
	const user = await currentUser();
	if (!user?.id) return null;
	const projects = await db.project.findMany({
		where: { OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }] },
		include: { owner: { select: { id: true, name: true, email: true } }, members: { include: { user: { select: { id: true, name: true, email: true } } } } },
		orderBy: { name: "asc" },
	});
	const requested = Array.isArray(searchParams?.projects) ? searchParams.projects : searchParams?.projects ? [searchParams.projects] : [];
	const selected = requested.filter((id) => projects.some((project) => project.id === id));
	const tasks = await db.task.findMany({
		where: { OR: [{ assigneeId: user.id }, { collaborators: { some: { userId: user.id } } }, { project: { ownerId: user.id } }], ...(selected.length ? { projectId: { in: selected } } : {}) },
		include: { collaborators: { include: { user: { select: { id: true, name: true, email: true } } } }, project: { include: { owner: { select: { id: true, name: true, email: true } }, members: { include: { user: { select: { id: true, name: true, email: true } } } } } } },
		orderBy: { createdAt: "asc" },
	});
	const taskIds = new Set(tasks.map((task) => task.id));
	const byParent = new Map<string | null, typeof tasks>();
	for (const task of tasks) {
		const key = task.parentId && taskIds.has(task.parentId) ? task.parentId : null;
		byParent.set(key, [...(byParent.get(key) || []), task]);
	}
	const rootTasks = byParent.get(null) || [];

	const renderTask = (task: (typeof tasks)[number], depth: number): ReactNode => {
		const people = [task.project.owner, ...task.project.members.map((member) => member.user)].filter((person, index, all) => all.findIndex((item) => item.id === person.id) === index);
		const children = byParent.get(task.id) || [];
		const childCount = children.length;
		const isLeaf = childCount === 0;
		const isContributor = task.assigneeId === user.id || task.collaborators.some((collaborator) => collaborator.userId === user.id);
		const canManage = task.project.ownerId === user.id || task.assigneeId === user.id;
		const availableCollaborators = people.filter((person) => person.id !== task.assigneeId && !task.collaborators.some((collaborator) => collaborator.userId === person.id));
		return <div key={task.id} className="space-y-3" style={{ marginLeft: depth * 24 }}>
			<div className="rounded-lg border bg-white p-4">
				<div className="flex flex-wrap items-center justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{task.title}</p><TaskStatusBadge status={task.status} />{depth > 0 && <span className="text-xs text-muted-foreground">Subtask</span>}</div><p className="text-sm text-muted-foreground">{task.project.name}{task.dueDate ? " · Due " + format(task.dueDate, "MMM d") : ""}</p></div>{task.project.ownerId === user.id && <form action={assignTask.bind(null, task.id)}><select name="assigneeId" defaultValue={task.assigneeId} className="h-8 rounded-md border px-2 text-xs">{people.map((person) => <option key={person.id} value={person.id}>{person.name || person.email}</option>)}</select><Button size="sm" variant="outline" className="ml-1">Assign</Button></form>}</div>
				<div className="mt-3 flex flex-wrap items-center gap-3 rounded-md bg-slate-50 px-3 py-2 text-sm"><span><strong>Primary:</strong> {people.find((person) => person.id === task.assigneeId)?.name || people.find((person) => person.id === task.assigneeId)?.email}</span><span className="font-medium">{task.progress}% complete</span>{!isLeaf && <span className="text-muted-foreground">{childCount} immediate subtask{childCount === 1 ? "" : "s"}</span>}</div>
				{isLeaf && isContributor && <form action={updateTaskProgress.bind(null, task.id)} className="mt-3 flex max-w-sm items-center gap-2"><label htmlFor={"progress-" + task.id} className="text-sm font-medium">Progress</label><Input id={"progress-" + task.id} name="progress" type="number" min="0" max="100" defaultValue={task.progress} required /><span className="text-sm text-muted-foreground">%</span><Button size="sm" type="submit">Save</Button></form>}
				<div className="mt-3 flex flex-wrap items-center gap-2 text-sm"><Users className="h-4 w-4 text-muted-foreground" /><span className="font-medium">Collaborators:</span>{task.collaborators.length ? task.collaborators.map((collaborator) => <span key={collaborator.id} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-800">{collaborator.user.name || collaborator.user.email}{(canManage || collaborator.userId === user.id) && <form action={removeTaskCollaborator.bind(null, task.id, collaborator.userId)}><button type="submit" aria-label={"Remove " + (collaborator.user.name || collaborator.user.email)} className="font-bold">×</button></form>}</span>) : <span className="text-muted-foreground">None</span>}</div>
				{canManage && availableCollaborators.length > 0 && <form action={addTaskCollaborator.bind(null, task.id)} className="mt-2 flex max-w-sm gap-2"><select name="collaboratorId" defaultValue="" className="h-8 flex-1 rounded-md border px-2 text-xs"><option value="" disabled>Add collaborator</option>{availableCollaborators.map((person) => <option key={person.id} value={person.id}>{person.name || person.email}</option>)}</select><Button size="sm" type="submit" variant="outline">Add</Button></form>}
				{canManage && <details className="mt-4"><summary className="cursor-pointer text-sm font-medium text-blue-700">Add subtask or manage delegation</summary><div className="mt-3 grid gap-3"><form action={updateTaskDelegation.bind(null, task.id, task.delegationScope === "PROJECT_MEMBERS" ? "NONE" : "PROJECT_MEMBERS")}><Button size="sm" variant="outline">{task.delegationScope === "PROJECT_MEMBERS" ? "Disallow assignee to create subtasks" : "Allow assignee to create subtasks"}</Button></form>{(task.project.ownerId === user.id || task.delegationScope === "PROJECT_MEMBERS") && <form action={createSubtask.bind(null, task.id)} className="grid gap-2 md:grid-cols-4"><Input name="title" required placeholder="Subtask title" /><select name="assigneeId" required defaultValue="" className="h-9 rounded-md border px-2 text-sm"><option value="" disabled>Primary assignee</option>{people.map((person) => <option key={person.id} value={person.id}>{person.name || person.email}</option>)}</select><select name="priority" defaultValue="MEDIUM" className="h-9 rounded-md border px-2 text-sm"><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select><Button type="submit">Add subtask</Button></form>}</div></details>}
			</div>
			{childCount > 0 && <details className="rounded-lg border border-dashed bg-white/70 px-4 py-3"><summary className="cursor-pointer text-sm font-medium text-blue-700">Show or hide {childCount} immediate subtask{childCount === 1 ? "" : "s"}</summary><div className="mt-3 space-y-3">{children.map((child) => renderTask(child, depth + 1))}</div></details>}
		</div>;
	};

	return <div className="mx-auto max-w-6xl space-y-6 p-5 md:p-8">
		<div><p className="text-sm font-medium text-blue-700">Workspace</p><h1 className="text-3xl font-bold">Tasks</h1><p className="mt-1 text-muted-foreground">Organize work into accountable task hierarchies.</p></div>
		{projects.length ? <Card><CardHeader><CardTitle>Add a root task</CardTitle><CardDescription>Every task starts with one primary assignee.</CardDescription></CardHeader><CardContent><form action={createTask} className="grid gap-3 md:grid-cols-2"><Input name="title" required placeholder="What needs to be done?" /><select name="projectId" required className="h-9 rounded-md border px-3 text-sm"><option value="">Choose a project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select><Textarea name="description" placeholder="Optional context" /><div className="grid grid-cols-2 gap-3"><select name="priority" defaultValue="MEDIUM" className="h-9 rounded-md border px-3 text-sm"><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select><Input name="dueDate" type="date" /></div><Button type="submit" className="md:col-span-2">Create task</Button></form></CardContent></Card> : <Card><CardContent className="py-8 text-center"><Button asChild><Link href="/dashboard/projects">Create a project first</Link></Button></CardContent></Card>}
		<Card><CardHeader><CardTitle className="flex items-center gap-2"><ListTodo className="h-5 w-5" /> Task hierarchy</CardTitle><CardDescription>Parent tasks stay compact until you choose to inspect their immediate subtasks.</CardDescription></CardHeader><CardContent className="space-y-3">{rootTasks.map((task) => renderTask(task, 0))}{!rootTasks.length && <p className="py-8 text-center text-sm text-muted-foreground">No tasks in this view.</p>}</CardContent></Card>
	</div>;
}
