import { authGuard } from '$lib/authGuard/authGuardConfig';
import { db } from '$lib/server/db/db.js';
import { session, user } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = (requestData) => {
	authGuard(requestData);
};

export const actions = {
	default: async ({ params, locals }) => {
		const authUser = locals.user;
		if (!authUser) {
			return;
		}
		if (!authUser.admin || authUser.userId === params.id) {
			return;
		}

		await db.delete(user).where(eq(user.id, params.id)).execute();
		await db.delete(session).where(eq(session.userId, params.id)).execute();

		throw redirect(302, '/users');
	}
};
