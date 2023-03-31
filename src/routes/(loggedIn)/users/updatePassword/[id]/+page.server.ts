import { updatePasswordSchema } from '$lib/schema/updatePasswordSchema';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';

export const load = async (event) => {
	const form = await superValidate(event, updatePasswordSchema);
	const userId = event.params.id;
	const user = await event.locals.trpc.users.getUserInfo(userId);
	if (!user) {
		throw redirect(302, '/users');
	}
	return { form, userId };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, updatePasswordSchema);

		if (!form.valid) {
			// Again, always return { form } and things will just work.
			return fail(400, { form });
		}

		const result = await event.locals.trpc.users.updatePassword(form.data);

		if ('error' in result) {
			return setError(form, result.error.location, result.error.message);
		}

		throw redirect(302, '/users');
	}
};
