"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/User";
import { sendVerificationEmail } from "@/lib/Mail";
import { generateVerificationToken } from "@/lib/Tokens";

export const register = async (values: z.infer<typeof RegisterSchema>, inviteToken?: string | null) => {
	const validatedFields = RegisterSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: "Invalid fields!" };
	}

	const { email, password, name } = validatedFields.data;
	const hashedPassword = await bcrypt.hash(password, 10);

	const existingUser = await getUserByEmail(email);

	if (existingUser) {
		if (!existingUser.emailVerified) {
			try {
				const verificationToken = await generateVerificationToken(email);
				await sendVerificationEmail(verificationToken.email, verificationToken.token);
				return { success: "A new confirmation link was sent. Check your inbox and spam folder before signing in." };
			} catch {
				return { error: "We could not send the confirmation email. Please try again later or contact support." };
			}
		}
		return { error: "Email already in use!" };
	}

	const invitation = inviteToken ? await db.invitation.findUnique({ where: { token: inviteToken } }) : null;
	if (inviteToken && (!invitation || invitation.status !== "PENDING" || invitation.expires < new Date() || invitation.email.toLowerCase() !== email.toLowerCase())) {
		return { error: "This invitation is invalid, expired, or does not match this email address." };
	}

	await db.$transaction(async (tx) => {
		const user = await tx.user.create({
			data: { name, email, password: hashedPassword },
		});
		if (invitation) {
			await tx.workspaceMember.create({ data: { workspaceId: invitation.workspaceId, userId: user.id, role: invitation.role } });
			await tx.invitation.update({ where: { id: invitation.id }, data: { status: "ACCEPTED", acceptedAt: new Date() } });
		} else {
			const workspace = await tx.workspace.create({ data: { name: `${name}'s Workspace` } });
			await tx.workspaceMember.create({ data: { workspaceId: workspace.id, userId: user.id, role: "OWNER" } });
		}
	});

	try {
		const verificationToken = await generateVerificationToken(email);
		await sendVerificationEmail(verificationToken.email, verificationToken.token);
	} catch {
		return {
			error:
				"Your account was created, but we could not send the confirmation email. Please submit the form again to resend it.",
		};
	}

	return { success: "Confirmation email sent!" };
};
