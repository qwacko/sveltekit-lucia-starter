import { t } from '$lib/server/trpc/t';
import { TRPCError } from '@trpc/server';

export const authMiddleware = t.middleware(async ({ next, ctx }) => {
	const user = await ctx.user;
	if (!user?.userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
	return next();
});
