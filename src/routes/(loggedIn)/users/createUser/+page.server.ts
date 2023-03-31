import { fail, redirect } from '@sveltejs/kit';
import { superValidate, setError } from 'sveltekit-superforms/server';
import { signupSchema } from '$lib/schema/signupSchema';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

// If the user exists, redirect authenticated users to the profile page.
export const load = (async (event) => {
	const form = await superValidate(event, signupSchema);

	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, signupSchema);

		if (!form.valid) {
			// Again, always return { form } and things will just work.
			return fail(400, { form });
		}

		const result = await event.locals.trpc.users.createUser(form.data);

		if (result.error) {
			return setError(form, result.error.location, result.error.message);
		}

		throw redirect(302, '/users');
	}
};
