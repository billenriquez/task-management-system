"use client";

import * as z from "zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { ArrowLeft, KeyRound, Loader2, Mail, ShieldCheck } from "lucide-react";

import { settings } from "@/actions/Settings";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useCurrentUser } from "@/hooks/UseCurrentUser";
import { SettingsSchema } from "@/schemas";

const SettingsPage = () => {
	const user = useCurrentUser();
	const { update } = useSession();
	const [error, setError] = useState<string>();
	const [success, setSuccess] = useState<string>();
	const [isPending, startTransition] = useTransition();
	const isOAuth = user?.isOAuth === true;
	const form = useForm<z.infer<typeof SettingsSchema>>({
		resolver: zodResolver(SettingsSchema),
		defaultValues: {
			email: user?.email || "",
			password: "",
			newPassword: "",
			isTwoFactorEnabled: user?.isTwoFactorEnabled || false,
		},
	});

	const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
		setError(undefined);
		setSuccess(undefined);
		startTransition(() => {
			settings(values).then((result) => {
				if (result.error) setError(result.error);
				if (result.success) {
					void update();
					form.setValue("password", "");
					form.setValue("newPassword", "");
					setSuccess(result.success);
				}
			}).catch(() => setError("Something went wrong. Please try again."));
		});
	};

	return <main className="h-screen overflow-y-auto bg-slate-50 px-5 py-8 md:px-8 md:py-12">
		<div className="mx-auto max-w-3xl space-y-6">
			<div className="text-center"><div className="flex justify-start"><Button asChild variant="ghost" className="px-0"><Link href="/dashboard/profile"><ArrowLeft className="mr-2 h-4 w-4" />Back to profile</Link></Button></div><div className="mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700"><ShieldCheck className="h-6 w-6" /></div><p className="mt-4 text-sm font-medium text-blue-700">Your account</p><h1 className="text-3xl font-bold tracking-tight text-slate-950">Account & security</h1><p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">Manage your sign-in information and the protections on your TaskMate account.</p></div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
					<Card><CardHeader><CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5 text-blue-700" /> Email address</CardTitle><CardDescription>Use an email address you can access. Changing it sends a confirmation link to the new address.</CardDescription></CardHeader><CardContent><FormField control={form.control} name="email" render={({ field }) => <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} type="email" disabled={isPending || isOAuth} /></FormControl>{isOAuth && <FormDescription>Your sign-in email is managed by your connected provider.</FormDescription>}<FormMessage /></FormItem>} /></CardContent></Card>
					<Card><CardHeader><CardTitle className="flex items-center gap-2"><KeyRound className="h-5 w-5 text-blue-700" /> Password</CardTitle><CardDescription>Leave these fields blank unless you want to change your password.</CardDescription></CardHeader><CardContent className="grid gap-5 sm:grid-cols-2"><FormField control={form.control} name="password" render={({ field }) => <FormItem><FormLabel>Current password</FormLabel><FormControl><Input {...field} value={field.value || ""} type="password" autoComplete="current-password" disabled={isPending || isOAuth} /></FormControl><FormMessage /></FormItem>} /><FormField control={form.control} name="newPassword" render={({ field }) => <FormItem><FormLabel>New password</FormLabel><FormControl><Input {...field} value={field.value || ""} type="password" autoComplete="new-password" disabled={isPending || isOAuth} /></FormControl><FormDescription>At least 6 characters.</FormDescription><FormMessage /></FormItem>} />{isOAuth && <p className="sm:col-span-2 text-sm text-muted-foreground">Your password is managed by your connected sign-in provider.</p>}</CardContent></Card>
					<Card><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-blue-700" /> Two-factor authentication</CardTitle><CardDescription>Add a verification code step when you sign in with your password.</CardDescription></CardHeader><CardContent><FormField control={form.control} name="isTwoFactorEnabled" render={({ field }) => <FormItem className="flex items-center justify-between rounded-lg border bg-slate-50 p-4"><div className="space-y-1"><FormLabel>Require a verification code</FormLabel><FormDescription>{field.value ? "Two-factor authentication is enabled." : "Two-factor authentication is currently off."}</FormDescription></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} disabled={isPending || isOAuth} /></FormControl></FormItem>} /></CardContent></Card>
					<FormError message={error} /><FormSuccess message={success} />
					<div className="flex justify-end"><Button type="submit" size="lg" disabled={isPending}>{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save security changes</Button></div>
				</form>
			</Form>
		</div>
	</main>;
};

export default SettingsPage;
