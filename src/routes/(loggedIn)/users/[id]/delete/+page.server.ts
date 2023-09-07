import { useCombinedAuthGuard } from '$lib/server/authGuard/authGuardConfig';
import { auth } from '$lib/server/lucia.js';
import { redirect } from '@sveltejs/kit';

export const load = ({ locals, route }) => {
	useCombinedAuthGuard({ locals, route });
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

		await auth.deleteUser(params.id);

		throw redirect(302, '/users');
	}
};
