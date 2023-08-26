import { auth } from '$lib/server/lucia.js';
import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ params, locals }) => {
		const authUser = await locals.auth.validate();
		if (!authUser) {
			return;
		}
		if (!authUser.user.admin || authUser.user.userId === params.id) {
			return;
		}

		await auth.deleteUser(params.id);

		throw redirect(302, '/users');
	}
};
