import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { loginSchema } from '$lib/schema/loginSchema';

// If the user exists, redirect authenticated users to the profile page.
export const load = async (event) => {
	const form = await superValidate(event, loginSchema);
	const firstUser = await event.locals.trpc.users.firstUser();
	if (firstUser.userCountZero) {
		throw redirect(302, '/signup');
	}

	return { form, firstUser };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, loginSchema);
		if (!form.valid) {
			return fail(400, { form });
		}
		const result = await event.locals.trpc.users.login(form.data);
		if (result.error) {
			return fail(400, { form: { ...form, message: result.error.message } });
		}
		return { form };
	}
};
