import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import type { PageServerLoad, Actions } from './$types';
import { superValidate, setError } from 'sveltekit-superforms/server';
import { signupSchema } from './signupSchema';

// If the user exists, redirect authenticated users to the profile page.
export const load = (async (event) => {
	const form = await superValidate(event, signupSchema);
	const session = await event.locals.validate();
	if (session) throw redirect(302, '/');

	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, signupSchema);
		if (!form.valid) {
			// Again, always return { form } and things will just work.
			return fail(400, { form });
		}

		const { username, password } = form.data;

		if (form.data.password !== form.data.confirmPassword) {
			return setError(form, 'confirmPassword', "Passwords don't match");
		}

		try {
			const user = await auth.createUser({
				primaryKey: {
					providerId: 'username',
					providerUserId: username,
					password
				},
				attributes: {
					username
				}
			});
			const session = await auth.createSession(user.userId);
			event.locals.setSession(session);
			return { form };
		} catch {
			// username already in use
			return setError(form, 'username', 'Username already in use');
		}
	}
} satisfies Actions;
