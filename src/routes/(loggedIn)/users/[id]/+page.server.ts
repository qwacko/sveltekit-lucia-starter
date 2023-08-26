import { db } from '$lib/server/db/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const actions = {
	setAdmin: async ({ params, locals }) => {
		const authUser = await locals.auth.validate();
		if (!authUser) {
			return;
		}
		if (!authUser.user.admin || authUser.user.userId === params.id) {
			return;
		}

		db.update(user).set({ admin: true }).where(eq(user.id, params.id)).run();

		return;
	},
	removeAdmin: async ({ params, locals }) => {
		const authUser = await locals.auth.validate();
		if (!authUser) {
			return;
		}
		if (!authUser.user.admin || authUser.user.userId === params.id) {
			return;
		}

		db.update(user).set({ admin: false }).where(eq(user.id, params.id)).run();

		return;
	}
};
