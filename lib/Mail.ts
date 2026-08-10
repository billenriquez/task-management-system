const appUrl = process.env.NEXT_PUBLIC_APP_URL;
const senderEmail = process.env.BREVO_SENDER_EMAIL;
const senderName = process.env.BREVO_SENDER_NAME || "TaskMate";

class EmailDeliveryError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "EmailDeliveryError";
	}
}

const sendEmail = async ({ email, subject, html }: { email: string; subject: string; html: string }) => {
	const apiKey = process.env.BREVO_API_KEY;
	if (!apiKey || !senderEmail) {
		throw new EmailDeliveryError("Email delivery is not configured.");
	}

	const response = await fetch("https://api.brevo.com/v3/smtp/email", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"api-key": apiKey,
		},
		body: JSON.stringify({
			sender: { email: senderEmail, name: senderName },
			to: [{ email }],
			subject,
			htmlContent: html,
		}),
	});

	const result = await response.json().catch(() => null);
	if (!response.ok || !result?.messageId) {
		console.error("Brevo failed to deliver an email:", {
			status: response.status,
			message: result?.message,
		});
		throw new EmailDeliveryError("The email could not be sent.");
	}

	return result.messageId as string;
};

const getAppUrl = () => {
	if (!appUrl) throw new EmailDeliveryError("The application URL has not been configured.");
	return appUrl.replace(/\/$/, "");
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) =>
	sendEmail({
		email,
		subject: "Your TaskMate verification code",
		html: `<p>Your TaskMate verification code is <strong>${token}</strong>.</p><p>This code expires in 5 minutes.</p>`,
	});

export const sendPasswordResetEmail = async (email: string, token: string) => {
	const resetLink = `${getAppUrl()}/auth/new-password?token=${encodeURIComponent(token)}`;
	return sendEmail({
		email,
		subject: "Reset your TaskMate password",
		html: `<p>We received a request to reset your TaskMate password.</p><p><a href="${resetLink}">Reset your password</a></p><p>If you did not request this, you can safely ignore this email.</p>`,
	});
};

export const sendVerificationEmail = async (email: string, token: string) => {
	const confirmLink = `${getAppUrl()}/auth/new-verification?token=${encodeURIComponent(token)}`;
	return sendEmail({
		email,
		subject: "Confirm your TaskMate account",
		html: `<p>Welcome to TaskMate.</p><p><a href="${confirmLink}">Confirm your email address</a></p><p>This link expires in one hour.</p>`,
	});
};

export const sendWorkspaceInvitationEmail = async (email: string, token: string, workspaceName: string) => {
	const inviteLink = `${getAppUrl()}/auth/register?invite=${encodeURIComponent(token)}`;
	return sendEmail({
		email,
		subject: `You're invited to ${workspaceName} on TaskMate`,
		html: `<p>You have been invited to join <strong>${workspaceName}</strong> on TaskMate.</p><p><a href="${inviteLink}">Create your account and join the workspace</a></p><p>This invitation expires in 7 days.</p>`,
	});
};
