import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
	// await resend.emails.send({
	// 	from: "mail@auth-masterclass-tutorial.com",
	// 	to: email,
	// 	subject: "2FA Code",
	// 	html: `<p>Your 2FA code: ${token}</p>`,
	// });

	console.log("2FA TOKEN is sent to: ", email, " 2FA Token: ", token);

	await resend.emails.send({
		from: "TaskMate <onboarding@resend.dev>",
		to: [email],
		subject: "2FA Code",
		html: `<p>Your 2FA code: ${token}</p>`,
	});
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
	const resetLink = `${domain}/auth/new-password?token=${token}`;
	console.log("RESET LINK is sent to: ", email, " Reset link: ", resetLink);

	// await resend.emails.send({
	// 	from: "mail@auth-masterclass-tutorial.com",
	// 	to: email,
	// 	subject: "Reset your password",
	// 	html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
	// });
	await resend.emails.send({
		from: "TaskMate <onboarding@resend.dev>",
		to: [email],
		subject: "Reset your password",
		html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
	});
};

export const sendVerificationEmail = async (email: string, token: string) => {
	const confirmLink = `${domain}/auth/new-verification?token=${token}`;
	console.log(
		"VERIFICATION SENT TO: ",
		email,
		"   Confirmation code: ",
		confirmLink
	);
	// await resend.emails.send({
	// 	from: "mail@auth-masterclass-tutorial.com",
	// 	to: email,
	// 	subject: "Confirm your email",
	// 	html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
	// });
	await resend.emails.send({
		from: "TaskMate <onboarding@resend.dev>",
		to: [email],
		subject: "Confirm your email",
		html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
	});
};
