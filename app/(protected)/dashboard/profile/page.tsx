import Link from "next/link";
import { UserRound } from "lucide-react";

import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileAvatarPicker } from "@/components/profile/ProfileAvatarPicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { currentUser } from "@/lib/Auth";
import { db } from "@/lib/db";
import { currentWorkspace } from "@/lib/Workspace";

export default async function ProfilePage() {
	const sessionUser = await currentUser();
	if (!sessionUser?.id) return null;
	const [user, membership] = await Promise.all([
		db.user.findUnique({ where: { id: sessionUser.id }, select: { name: true, email: true, image: true, jobTitle: true, department: true } }),
		currentWorkspace(),
	]);
	if (!user) return null;
	return <div className="mx-auto max-w-3xl space-y-6 p-5 md:p-8">
		<div><p className="text-sm font-medium text-blue-700">Personal profile</p><h1 className="text-3xl font-bold">Profile</h1><p className="mt-1 text-muted-foreground">How you appear to people in this workspace.</p></div>
		<Card><CardContent className="flex flex-wrap items-center gap-4 pt-6"><ProfileAvatarPicker image={user.image || ""} name={user.name || ""} email={user.email || ""} /><div><h2 className="text-lg font-semibold">{user.name || "Your profile"}</h2><p className="text-sm text-muted-foreground">{user.email}</p><p className="mt-1 text-xs font-medium uppercase tracking-wide text-blue-700">{membership?.role.replaceAll("_", " ") || "Member"} · {membership?.workspace.name || "Workspace"}</p></div></CardContent></Card>
		<Card><CardHeader><CardTitle className="flex items-center gap-2"><UserRound className="h-5 w-5" /> Profile details</CardTitle><CardDescription>Update the information teammates use to recognize you.</CardDescription></CardHeader><CardContent><ProfileForm name={user.name || ""} jobTitle={user.jobTitle || ""} department={user.department || ""} /></CardContent></Card>
		<Card><CardHeader><CardTitle>Account & security</CardTitle><CardDescription>Manage sign-in details, password, and two-factor authentication separately.</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link href="/settings">Open account & security</Link></Button></CardContent></Card>
	</div>;
}
