import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { useCombinedAuthGuard } from '$lib/server/authGuard/authGuardConfig';

export const load = (data) => {
	useCombinedAuthGuard(data);
};

export const actions: Actions = {
	logout: async (data) => {
		const session = await data.locals.auth.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId); // invalidate session
		data.locals.auth.setSession(null); // remove cookie
		throw redirect(302, '/login'); // redirect to login page
	},
	testFunction: async () => {
		console.log('Test Fuction Is Executed');
	}
};
