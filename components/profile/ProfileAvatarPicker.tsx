"use client";

import { ChangeEvent, useRef, useState, useTransition } from "react";
import { Camera, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

import { updateProfileImage } from "@/actions/Profile";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const ProfileAvatarPicker = ({ image, name, email }: { image: string; name: string; email: string }) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const { update } = useSession();
	const [preview, setPreview] = useState(image);
	const [error, setError] = useState<string>();
	const [success, setSuccess] = useState<string>();
	const [isPending, startTransition] = useTransition();
	const initials = (name || email || "U").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;
		setError(undefined);
		setSuccess(undefined);
		startTransition(async () => {
			const data = new FormData();
			data.set("image", file);
			const result = await updateProfileImage(data);
			if (result.error) setError(result.error);
			if (result.image) {
				setPreview(result.image);
				await update({ image: result.image });
				setSuccess(result.success);
			}
		});
	};

	return <div className="flex flex-col items-center gap-3 sm:flex-row">
		<div className="relative"><Avatar className="h-20 w-20"><AvatarImage src={preview} alt={name || "Profile photo"} /><AvatarFallback className="bg-sky-500 text-xl font-bold text-white">{initials}</AvatarFallback></Avatar>{isPending && <div className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-950/50"><Loader2 className="h-5 w-5 animate-spin text-white" /></div>}</div>
		<div className="space-y-2"><input ref={inputRef} className="hidden" type="file" accept="image/png,image/jpeg,image/webp" onChange={onChange} /><Button type="button" variant="outline" disabled={isPending} onClick={() => inputRef.current?.click()}><Camera className="mr-2 h-4 w-4" />Change photo</Button><p className="text-xs text-muted-foreground">PNG, JPG, or WebP. Maximum 2 MB.</p><FormError message={error} /><FormSuccess message={success} /></div>
	</div>;
};
