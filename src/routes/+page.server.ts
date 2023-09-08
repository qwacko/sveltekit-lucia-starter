import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { authGuard } from '$lib/server/authGuard/authGuardConfig';

export const load = (data) => {
	authGuard(data);
};

export const actions: Actions = {
	logout: async (data) => {
		const session = await data.locals.auth.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId); // invalidate session
		data.locals.auth.setSession(null); // remove cookie
		throw redirect(302, '/login'); // redirect to login page
	},
	testFunction: async (requestData) => {
		authGuard(requestData);
		console.log('Test Fuction Is Executed');
	}
};
