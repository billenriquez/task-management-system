import Link from "next/link";
import type { ElementType } from "react";
import { AlertTriangle, CheckCircle2, CircleDot, FolderKanban, ListTodo, Plus } from "lucide-react";
import { format } from "date-fns";

import { TaskStatusBadge } from "@/components/work/TaskStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { currentUser } from "@/lib/Auth";
import { db } from "@/lib/db";

const Metric = ({ title, value, detail, icon: Icon }: { title: string; value: number; detail: string; icon: ElementType }) => <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{title}</CardTitle><Icon className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{value}</div><p className="text-xs text-muted-foreground">{detail}</p></CardContent></Card>;

export default async function DashboardPage() {
	const user = await currentUser();
	if (!user?.id) return null;
	const today = new Date();
	const [projectCount, taskCount, inProgressCount, completedCount, overdueCount, upcomingTasks] = await Promise.all([
		db.project.count({ where: { OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }] } }),
		db.task.count({ where: { assigneeId: user.id } }),
		db.task.count({ where: { assigneeId: user.id, status: "IN_PROGRESS" } }),
		db.task.count({ where: { assigneeId: user.id, status: "DONE" } }),
		db.task.count({ where: { assigneeId: user.id, status: { not: "DONE" }, dueDate: { lt: today } } }),
		db.task.findMany({ where: { assigneeId: user.id, status: { not: "DONE" } }, include: { project: { select: { name: true } } }, orderBy: [{ dueDate: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }], take: 6 }),
	]);

	return <div className="mx-auto max-w-6xl space-y-6 p-5 md:p-8">
		<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-blue-700">Workspace overview</p><h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name?.split(" ")[0] || "there"}</h1><p className="mt-1 text-muted-foreground">Here is what needs your attention today.</p></div><div className="flex gap-2"><Button asChild variant="outline"><Link href="/dashboard/projects"><FolderKanban className="mr-2 h-4 w-4" />Projects</Link></Button><Button asChild><Link href="/dashboard/tasks"><Plus className="mr-2 h-4 w-4" />Add task</Link></Button></div></div>
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"><Metric title="Projects" value={projectCount} detail="Active workspace projects" icon={FolderKanban} /><Metric title="All tasks" value={taskCount} detail="Tasks you created" icon={ListTodo} /><Metric title="In progress" value={inProgressCount} detail="Currently underway" icon={CircleDot} /><Metric title="Completed" value={completedCount} detail="Work marked done" icon={CheckCircle2} /><Metric title="Overdue" value={overdueCount} detail="Needs attention" icon={AlertTriangle} /></div>
		<Card><CardHeader><CardTitle>Next tasks</CardTitle><CardDescription>Open tasks ordered by due date, then newest first.</CardDescription></CardHeader><CardContent className="space-y-3">{upcomingTasks.map((task) => <Link key={task.id} href="/dashboard/tasks" className="flex flex-col gap-2 rounded-lg border p-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">{task.title}</p><p className="mt-1 text-sm text-muted-foreground">{task.project.name}{task.dueDate ? ` · Due ${format(task.dueDate, "MMM d")}` : " · No due date"}</p></div><TaskStatusBadge status={task.status} /></Link>)}{!upcomingTasks.length && <div className="rounded-lg border border-dashed py-12 text-center"><p className="font-medium">Your workspace is ready.</p><p className="mt-1 text-sm text-muted-foreground">Create a project and add your first task to see real progress here.</p><Button asChild className="mt-4"><Link href="/dashboard/projects">Create a project</Link></Button></div>}</CardContent></Card>
	</div>;
}
