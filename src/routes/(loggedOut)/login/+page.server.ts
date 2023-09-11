import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia';
import { fail, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';
import { setMessage, superValidate } from 'sveltekit-superforms/server';
import { loginSchema } from '$lib/schema/loginSchema';
import { serverEnv } from '$lib/server/serverEnv';
import { authGuard } from '$lib/authGuard/authGuardConfig';

export const load = async (data) => {
	authGuard(data);
	const form = await superValidate(loginSchema);

	return { form, enableSignup: serverEnv.ALLOW_SIGNUP };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, loginSchema);

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
				return setMessage(form, 'Incorrect username or password', { status: 400 });
			}

			return setMessage(form, 'An unknown error occurred', { status: 500 });
		}
		// redirect to
		// make sure you don't throw inside a try/catch block!
		throw redirect(302, '/');
	}
};
