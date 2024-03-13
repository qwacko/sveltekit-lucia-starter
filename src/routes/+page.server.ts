import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { authGuard } from '$lib/authGuard/authGuardConfig';

export const load = (data) => {
	authGuard(data);
};

export const actions: Actions = {
	logout: async (data) => {
		const session = data.locals.session;
		if (!session) return fail(401);

		await auth.invalidateSession(session.id); // invalidate session
		const sessionCookie = auth.createBlankSessionCookie();
		data.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		redirect(302, '/login'); // redirect to login page
	},
	testFunction: async (requestData) => {
		authGuard(requestData);
		console.log('Test Fuction Is Executed');
	}
};
