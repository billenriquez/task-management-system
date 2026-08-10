"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

import { updateProfile } from "@/actions/Profile";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ProfileForm = ({ name, jobTitle, department }: { name: string; jobTitle: string; department: string }) => {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string>();
	const [success, setSuccess] = useState<string>();

	const onSubmit = (formData: FormData) => {
		setError(undefined);
		setSuccess(undefined);
		startTransition(async () => {
			const result = await updateProfile({
				name: String(formData.get("name") || ""),
				jobTitle: String(formData.get("jobTitle") || ""),
				department: String(formData.get("department") || ""),
			});
			setError(result.error);
			setSuccess(result.success);
		});
	};

	return <form action={onSubmit} className="space-y-5">
		<div className="grid gap-5 sm:grid-cols-2">
			<div className="space-y-2"><Label htmlFor="name">Display name</Label><Input id="name" name="name" defaultValue={name} disabled={isPending} required /></div>
			<div className="space-y-2"><Label htmlFor="jobTitle">Job title</Label><Input id="jobTitle" name="jobTitle" defaultValue={jobTitle} disabled={isPending} placeholder="e.g. Product Manager" /></div>
		</div>
		<div className="space-y-2"><Label htmlFor="department">Department</Label><Input id="department" name="department" defaultValue={department} disabled={isPending} placeholder="e.g. Operations" /></div>
		<FormError message={error} /><FormSuccess message={success} />
		<Button type="submit" disabled={isPending}>{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save profile</Button>
	</form>;
};
