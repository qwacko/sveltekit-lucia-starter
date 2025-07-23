import { authGuard } from '$lib/authGuard/authGuardConfig';
import { db } from '$lib/server/db/db.js';
import { account, session, user, userAccountTable } from '$lib/server/db/schema';
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
		if (!authUser.admin || authUser.id === params.id) {
			return;
		}

		await db.transaction(async (tx) => {
			await tx.delete(user).where(eq(user.id, params.id)).execute();
			await tx.delete(session).where(eq(session.userId, params.id)).execute();
			await tx.delete(userAccountTable).where(eq(userAccountTable.userId, params.id)).execute();
			await tx.delete(account).where(eq(account.userId, params.id)).execute();
		});

		throw redirect(302, '/users');
	}
};
