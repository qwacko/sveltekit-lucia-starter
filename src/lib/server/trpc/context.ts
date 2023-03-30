import type { RequestEvent } from '@sveltejs/kit';
import type { inferAsyncReturnType } from '@trpc/server';
import { prisma } from '../db';

// we're not using the event parameter is this example,
// hence the eslint-disable rule
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createContext(event: RequestEvent) {
	const user = event.locals.auth.validate();
	return {
		user,
		prisma,
		auth: event.locals.auth,
		event
	};
}

export type Context = inferAsyncReturnType<typeof createContext>;
