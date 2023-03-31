import type { AuthRequest } from 'lucia-auth';
import { auth } from '$lib/server/lucia';

export const createUser = async ({
	username,
	password,
	confirmPassword,
	localAuth,
	autoLogin
}: {
	username: string;
	password: string;
	confirmPassword: string;
	localAuth: AuthRequest;
	autoLogin: boolean;
}) => {
	if (password !== confirmPassword) {
		return {
			error: {
				location: 'confirmPassword' as const,
				message: "Passwords don't match"
			}
		};
	}
	try {
		const user = await auth.createUser({
			primaryKey: {
				providerId: 'username',
				providerUserId: username,
				password
			},
			attributes: {
				username
			}
		});

		if (autoLogin) {
			const session = await auth.createSession(user.userId);
			localAuth.setSession(session);
		}
		return { valid: true };
	} catch (error) {
		console.log('Error:', error);
		return {
			error: {
				location: 'username' as const,
				message: 'Error Creating User or Username already in use'
			}
		};
	}
};
