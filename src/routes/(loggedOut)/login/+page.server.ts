import { auth } from '$lib/server/auth/auth';
import { fail, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';
import { setMessage, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/schema/loginSchema';
import { serverEnv } from '$lib/server/serverEnv';
import { authGuard } from '$lib/authGuard/authGuardConfig';
import { logging } from '$lib/server/logging';

export const load = async (data) => {
	authGuard(data);
	const form = await superValidate(zod4(loginSchema));

	return { form, enableSignup: serverEnv.ALLOW_SIGNUP };
};

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		const form = await superValidate(request, zod4(loginSchema));

		// Convenient validation check:
		if (!form.valid) {
			// Again, always return { form } and things will just work.
			return fail(400, { form });
		}
		try {
			const user = await auth.api.signInEmail({
				body: {
					email: form.data.username.toLowerCase(),
					password: form.data.password,
					rememberMe: true
				},
				// This endpoint requires session cookies.
				headers: request.headers
			});

			if (!user) {
				return setMessage(form, 'Incorrect username or password', { status: 400 });
			}
		} catch (e) {
			logging.error('Error Logging In', e);
			return setMessage(form, 'Incorrect username or password', { status: 400 });
		}
		redirect(302, '/');
	}
};
