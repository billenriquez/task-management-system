"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/CardWrapper";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";
import { register } from "@/actions/Register";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export const RegisterForm = () => {
	const searchParams = useSearchParams();
	const inviteToken = searchParams.get("invite");
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
	const [accountCreated, setAccountCreated] = useState(false);
	const [isPending, startTransition] = useTransition();
	const isFormDisabled = isPending || accountCreated;

	const form = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			email: "",
			password: "",
			name: "",
		},
	});

	const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
		setError("");
		setSuccess("");
		setAccountCreated(false);

		startTransition(() => {
			register(values, inviteToken).then((data) => {
				setError(data.error);
				if (data.success) {
					setSuccess(
						"Account created. Check your email inbox (and spam folder) for the confirmation link before signing in."
					);
					setAccountCreated(true);
				}
			});
		});
	};

	return (
		<CardWrapper
			headerTitle="Register your account"
			headerLabel="Create an account"
			backButtonLabel="Already have an account?"
			backButtonHref="/auth/login"
			showSocial
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={isFormDisabled}
											placeholder="John Doe"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={isFormDisabled}
											placeholder="john.doe@example.com"
											type="email"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={isFormDisabled}
											placeholder="******"
											type="password"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormError message={error} />
					<FormSuccess message={success} />
					<Button
						disabled={isFormDisabled}
						type="submit"
						className="w-full"
					>
						{accountCreated ? "Account created — check your email" : "Create an account"}
						{isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" aria-label="Creating account" />}
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};
