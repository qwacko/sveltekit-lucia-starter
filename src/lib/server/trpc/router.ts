import delay from 'delay';
import type { AuthRequest } from 'lucia-auth';
import { z } from 'zod';
import { auth } from '../lucia';
import { authMiddleware } from './middleware/auth';
import { userRouter } from './routers/user';
import { t } from './t';

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
