import delay from 'delay';
import type { AuthRequest } from 'lucia-auth';
import { z } from 'zod';
import { auth } from '../lucia';
import { authMiddleware } from './middleware/auth';
import { userRouter } from './routers/user';
import { t } from './t';

const createUser = async ({
	username,
	password,
	confirmPassword,
	localAuth
}: {
	username: string;
	password: string;
	confirmPassword: string;
	localAuth: AuthRequest<any, any>;
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
		const session = await auth.createSession(user.userId);
		localAuth.setSession(session);
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

export const router = t.router({
	users: userRouter,
	greeting: t.procedure.query(async () => {
		await delay(500); // 👈 simulate an expensive operation
		return `Hello tRPC v10 @ ${new Date().toLocaleTimeString()}`;
	}),
	greetingProtected: t.procedure
		.use(authMiddleware)
		.input(z.number().int().default(500))
		.query(async ({ ctx, input }) => {
			const user = await ctx.user;
			await delay(input); // 👈 simulate an expensive operation
			const random = Math.random();
			return `User Auth : ${user?.userId} - ${random}`;
		})
});

export type Router = typeof router;
export type CalledRouter = ReturnType<Router['createCaller']>;
