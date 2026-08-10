import Link from "next/link";
import { FolderKanban, Plus } from "lucide-react";

import { addProjectMember, createProject, delegateProject } from "@/actions/Work";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { currentUser } from "@/lib/Auth";
import { db } from "@/lib/db";
import { currentWorkspace } from "@/lib/Workspace";

export default async function ProjectsPage() {
	const user = await currentUser();
	if (!user?.id) return null;
	const workspaceMembership = await currentWorkspace();
	if (!workspaceMembership) return null;
	const canCreateProjects = ["OWNER", "ADMIN", "DEPARTMENT_MANAGER"].includes(workspaceMembership.role);
	const canDelegateProjects = ["OWNER", "ADMIN"].includes(workspaceMembership.role);
	const departmentManagers = canDelegateProjects ? await db.workspaceMember.findMany({ where: { workspaceId: workspaceMembership.workspaceId, role: "DEPARTMENT_MANAGER" }, include: { user: { select: { id: true, name: true, email: true } } }, orderBy: { createdAt: "asc" } }) : [];
	const projects = await db.project.findMany({
		where: canCreateProjects
			? { workspaceId: workspaceMembership.workspaceId }
			: { workspaceId: workspaceMembership.workspaceId, OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }] },
		include: { _count: { select: { tasks: true } }, owner: { select: { name: true, email: true } }, members: { include: { user: { select: { id: true, name: true, email: true } } }, orderBy: { createdAt: "asc" } } },
		orderBy: { updatedAt: "desc" },
	});

	return (
		<div className="mx-auto max-w-6xl space-y-6 p-5 md:p-8">
			<div><p className="text-sm font-medium text-blue-700">Workspace</p><h1 className="text-3xl font-bold tracking-tight">Projects</h1><p className="mt-1 text-muted-foreground">Create projects, then add tasks that make progress visible.</p></div>
			{canCreateProjects && <Card><CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5" /> New project</CardTitle><CardDescription>Start with a clear name and an optional outcome or context.</CardDescription></CardHeader><CardContent>
				<form action={createProject} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
					<Input name="name" placeholder="e.g. Portfolio refresh" required maxLength={80} />
					<Textarea name="description" className="min-h-9" placeholder="What does success look like?" maxLength={280} />
					<Button type="submit" className="self-start">Create project</Button>
				</form>
			</CardContent></Card>}
			{projects.length ? <div className="grid gap-4 md:grid-cols-2">{projects.map((project) => <Card key={project.id}><CardHeader><CardTitle className="flex items-center gap-2 text-xl"><FolderKanban className="h-5 w-5 text-blue-600" />{project.name}</CardTitle><CardDescription>{project.description || "No description yet."}</CardDescription></CardHeader><CardContent className="space-y-4"><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">{project._count.tasks} {project._count.tasks === 1 ? "task" : "tasks"}</span><Button asChild variant="outline" size="sm"><Link href={`/dashboard/tasks?projects=${encodeURIComponent(project.id)}`}>View tasks</Link></Button></div><div className="border-t pt-3"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Project members</p><p className="mt-1 text-sm text-slate-700">{project.ownerId === user.id ? "You (owner)" : `${project.owner.name || project.owner.email} (owner)`}{project.members.length ? ` · ${project.members.map((member) => member.user.name || member.user.email).join(", ")}` : ""}</p>{project.ownerId === user.id && <form action={addProjectMember.bind(null, project.id)} className="mt-3 flex gap-2"><Input name="email" type="email" required placeholder="Approved workspace member email" className="h-8" /><Button type="submit" size="sm" variant="outline">Add</Button></form>}{canDelegateProjects && departmentManagers.length > 0 && <form action={delegateProject.bind(null, project.id)} className="mt-3 flex gap-2"><select name="newOwnerId" defaultValue="" className="h-8 min-w-0 flex-1 rounded-md border border-input bg-transparent px-2 text-xs"><option value="" disabled>Delegate to a department manager</option>{departmentManagers.map((manager) => <option key={manager.user.id} value={manager.user.id}>{manager.user.name || manager.user.email}</option>)}</select><Button type="submit" size="sm" variant="outline">Delegate</Button></form>}</div></CardContent></Card>)}</div> : <Card className="border-dashed"><CardContent className="py-14 text-center"><FolderKanban className="mx-auto h-10 w-10 text-muted-foreground" /><h2 className="mt-4 text-lg font-semibold">Create your first project</h2><p className="mt-1 text-sm text-muted-foreground">Your projects and tasks will remain private to your account.</p></CardContent></Card>}
		</div>
	);
}
