import type { Actions } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { signupSchema } from '$lib/schema/signupSchema';
import { createUserHandler } from '$lib/server/createUserHandler';
import { serverEnv } from '$lib/server/serverEnv';
import { redirect } from '@sveltejs/kit';
import { authGuard } from '$lib/authGuard/authGuardConfig';

export const load = async (data) => {
	authGuard(data);
	const form = await superValidate(signupSchema);
	if (!serverEnv.ALLOW_SIGNUP) {
		throw redirect(302, '/login');
	}

	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		return createUserHandler({ request, locals, admin: false, setSession: true });
	}
};
