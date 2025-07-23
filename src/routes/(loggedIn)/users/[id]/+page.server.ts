import { authGuard } from '$lib/authGuard/authGuardConfig.js';
import { db } from '$lib/server/db/db';
import { user, userAccountTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = (data) => {
	authGuard(data);
};

export const actions = {
	setAdmin: async ({ params, locals }) => {
		const authUser = locals.user;
		if (!authUser) {
			return;
		}
		if (!authUser.admin || authUser.id === params.id) {
			return;
		}

		db.update(userAccountTable)
			.set({ admin: true })
			.where(eq(userAccountTable.userId, params.id))
			.run();

		return;
	},
	removeAdmin: async ({ params, locals }) => {
		const authUser = locals.user;
		if (!authUser) {
			return;
		}
		if (!authUser.admin || authUser.id === params.id) {
			return;
		}

		db.update(userAccountTable)
			.set({ admin: false })
			.where(eq(userAccountTable.userId, params.id))
			.run();

		return;
	}
};
