import { auth } from '$lib/server/auth/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { authGuard } from '$lib/authGuard/authGuardConfig';

export const load = (data) => {
	authGuard(data);
};

export const actions: Actions = {
	logout: async (data) => {
		const loggedout = await auth.api.signOut({
			headers: data.request.headers
		});

		if (!loggedout) {
			return fail(500, { message: 'Failed to log out' });
		}

		redirect(302, '/login'); // redirect to login page
	},
	testFunction: async (requestData) => {
		authGuard(requestData);
		console.log('Test Fuction Is Executed');
	}
};
