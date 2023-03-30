import delay from 'delay';
import { z } from 'zod';
import { auth } from './middleware/auth';
import { t } from './t';

export const router = t.router({
	greeting: t.procedure.query(async () => {
		await delay(500); // 👈 simulate an expensive operation
		return `Hello tRPC v10 @ ${new Date().toLocaleTimeString()}`;
	}),
	greetingProtected: t.procedure
		.use(auth)
		.input(z.number().int().default(500))
		.query(async ({ ctx, input }) => {
			const user = await ctx.user;
			await delay(input); // 👈 simulate an expensive operation
			const random = Math.random();
			return `User Auth : ${user?.userId} - ${random}`;
		}),
	users: t.procedure.use(auth).query(async ({ ctx }) => {
		const users = await ctx.prisma.authUser.findMany();

		return users;
	})
});

export type Router = typeof router;
