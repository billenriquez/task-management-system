"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { currentUser } from "@/lib/Auth";
import { db } from "@/lib/db";

const ProfileSchema = z.object({
	name: z.string().trim().min(2).max(80),
	jobTitle: z.string().trim().max(80).optional(),
	department: z.string().trim().max(80).optional(),
});

export const updateProfile = async (values: z.infer<typeof ProfileSchema>) => {
	const user = await currentUser();
	if (!user?.id) return { error: "Unauthorized" };
	const parsed = ProfileSchema.safeParse(values);
	if (!parsed.success) return { error: "Please enter a name between 2 and 80 characters." };

	await db.user.update({
		where: { id: user.id },
		data: {
			name: parsed.data.name,
			jobTitle: parsed.data.jobTitle || null,
			department: parsed.data.department || null,
		},
	});
	revalidatePath("/dashboard/profile");
	revalidatePath("/dashboard");
	return { success: "Profile updated." };
};

export const updateProfileImage = async (formData: FormData) => {
	const user = await currentUser();
	if (!user?.id) return { error: "Unauthorized" };
	const image = formData.get("image");
	if (!(image instanceof File) || image.size === 0) return { error: "Choose an image file first." };
	if (!image.type.startsWith("image/")) return { error: "Please choose an image file." };
	if (image.size > 2 * 1024 * 1024) return { error: "Choose an image smaller than 2 MB." };

	const buffer = Buffer.from(await image.arrayBuffer());
	const imageUrl = "data:" + image.type + ";base64," + buffer.toString("base64");
	await db.user.update({ where: { id: user.id }, data: { image: imageUrl } });
	revalidatePath("/dashboard/profile");
	revalidatePath("/dashboard");
	return { success: "Profile photo updated.", image: imageUrl };
};
