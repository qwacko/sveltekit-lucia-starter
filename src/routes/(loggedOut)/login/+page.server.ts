import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia';
import { fail, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { loginSchema } from '$lib/schema/loginSchema';

export const load = async () => {
	const form = await superValidate(loginSchema);
	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, loginSchema);
		console.log('POST', form);

		// Convenient validation check:
		if (!form.valid) {
			// Again, always return { form } and things will just work.
			return fail(400, { form });
		}
		try {
			// find user by key
			// and validate password
			const user = await auth.useKey(
				'username',
				form.data.username.toLowerCase(),
				form.data.password
			);
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});
			locals.auth.setSession(session); // set session cookie
		} catch (e) {
			if (
				e instanceof LuciaError &&
				(e.message === 'AUTH_INVALID_KEY_ID' || e.message === 'AUTH_INVALID_PASSWORD')
			) {
				form.message = 'Incorrect username or password';
				return fail(400, { form });
			}

			form.message = 'An unknown error occurred';
			return fail(500, { form });
		}
		// redirect to
		// make sure you don't throw inside a try/catch block!
		throw redirect(302, '/');
	}
};
