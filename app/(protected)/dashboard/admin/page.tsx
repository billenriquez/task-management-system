import { redirect } from "next/navigation";

import { inviteWorkspaceMember } from "@/actions/WorkspaceAdmin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { currentWorkspace } from "@/lib/Workspace";

export default async function WorkspaceAdminPage() {
	const membership = await currentWorkspace();
	if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) redirect("/dashboard");
	const members = await (await import("@/lib/db")).db.workspaceMember.findMany({ where: { workspaceId: membership.workspaceId }, include: { user: { select: { name: true, email: true } } }, orderBy: { createdAt: "asc" } });
	const invitations = await (await import("@/lib/db")).db.invitation.findMany({ where: { workspaceId: membership.workspaceId, status: "PENDING" }, orderBy: { createdAt: "desc" }, take: 10 });
	return <div className="mx-auto max-w-5xl space-y-6 p-5 md:p-8"><div><p className="text-sm font-medium text-blue-700">Workspace administration</p><h1 className="text-3xl font-bold">{membership.workspace.name}</h1><p className="mt-1 text-muted-foreground">Invite people and manage who can access this company workspace.</p></div><Card><CardHeader><CardTitle>Invite a member</CardTitle><CardDescription>Invitations are restricted to workspace Owners and Admins.</CardDescription></CardHeader><CardContent><form action={inviteWorkspaceMember} className="grid gap-3 md:grid-cols-[1fr_220px_auto]"><Input name="email" type="email" required placeholder="person@example.com" /><select name="role" defaultValue="MEMBER" className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"><option value="MEMBER">Member</option><option value="SENIOR_MEMBER">Senior member</option><option value="DEPARTMENT_MANAGER">Department manager</option><option value="ADMIN">Admin</option></select><Button type="submit">Send invitation</Button></form></CardContent></Card><Card><CardHeader><CardTitle>Members</CardTitle></CardHeader><CardContent className="space-y-3">{members.map((member) => <div key={member.id} className="flex items-center justify-between rounded-lg border p-3"><span>{member.user.name || member.user.email}</span><span className="text-sm font-medium text-muted-foreground">{member.role.replaceAll("_", " ")}</span></div>)}</CardContent></Card><Card><CardHeader><CardTitle>Pending invitations</CardTitle></CardHeader><CardContent className="space-y-3">{invitations.length ? invitations.map((invitation) => <div key={invitation.id} className="flex items-center justify-between rounded-lg border p-3 text-sm"><span>{invitation.email}</span><span className="text-muted-foreground">{invitation.role.replaceAll("_", " ")}</span></div>) : <p className="text-sm text-muted-foreground">No pending invitations.</p>}</CardContent></Card></div>;
}
