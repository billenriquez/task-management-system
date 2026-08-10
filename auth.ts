import NextAuth from "next-auth";
import { UserRole } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";

import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/User";
import { getTwoFactorConfirmationByUserId } from "@/data/TwoFactorConfirmation";
import { getAccountByUserId } from "./data/Account";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/User";

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
	update,
} = NextAuth({
	pages: {
		signIn: "/auth/login",
		error: "/auth/error",
	},
	events: {
		async linkAccount({ user }) {
			await db.user.update({
				where: { id: user.id },
				data: { emailVerified: new Date() },
			});
		},
	},
	callbacks: {
		async signIn({ user, account }) {
			// Allow OAuth without email verification
			if (account?.provider !== "credentials") return true;

			const existingUser = await getUserById(user.id);

			// Prevent sign in without email verification
			if (!existingUser?.emailVerified) return false;

			if (existingUser.isTwoFactorEnabled) {
				const twoFactorConfirmation =
					await getTwoFactorConfirmationByUserId(existingUser.id);

				if (!twoFactorConfirmation) return false;

				// Delete two factor confirmation for next sign in
				await db.twoFactorConfirmation.delete({
					where: { id: twoFactorConfirmation.id },
				});
			}

			return true;
		},
		async session({ token, session }) {
			// console.log({sessionToken: token, session});
			if (token.sub && session.user) {
				session.user.id = token.sub;
			}

			if (token.role && session.user) {
				session.user.role = token.role as UserRole;
			}

			if (session.user) {
				session.user.isTwoFactorEnabled =
					token.isTwoFactorEnabled as boolean;
			}

			if (session.user) {
				session.user.name = token.name;
				session.user.email = token.email;
				session.user.image = token.image as string | null;
				session.user.isOAuth = token.isOAuth as boolean;
			}

			return session;
		},
		async jwt({ token, trigger, session }) {
			// console.log({sessionToken: token});
			if (!token.sub) return token;

			if (trigger === "update" && session?.image) {
				token.image = session.image as string;
				return token;
			}

			const existingUser = await getUserById(token.sub);

			if (!existingUser) return token;

			const existingAccount = await getAccountByUserId(existingUser.id);

			token.isOAuth = !!existingAccount;
			token.name = existingUser.name;
			token.email = existingUser.email;
			token.image = existingUser.image;
			token.role = existingUser.role;
			token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

			return token;
		},
	},
	adapter: PrismaAdapter(db),
	session: { strategy: "jwt" },
	...authConfig,
	providers: [
		Credentials({
			async authorize(credentials) {
				const validatedFields = LoginSchema.safeParse(credentials);
				if (!validatedFields.success) return null;
				const { email, password } = validatedFields.data;
				const user = await getUserByEmail(email);
				if (!user?.password) return null;
				return await bcrypt.compare(password, user.password) ? user : null;
			},
		}),
	],
});
