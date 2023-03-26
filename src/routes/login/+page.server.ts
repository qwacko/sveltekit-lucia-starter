import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { loginSchema } from './loginSchema';

// If the user exists, redirect authenticated users to the profile page.
export const load = (async (event) => {
	const form = await superValidate(event, loginSchema);
	const session = await event.locals.validate();
	if (session) throw redirect(302, '/');

	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, loginSchema);

		if (!form.valid) {
			// Again, always return { form } and things will just work.
			return fail(400, { form });
		}

		try {
			const key = await auth.useKey('username', form.data.username, form.data.password);
			const session = await auth.createSession(key.userId);
			event.locals.setSession(session);
			return { form };
		} catch {
			// invalid credentials
			return fail(400);
		}
	}
} satisfies Actions;
