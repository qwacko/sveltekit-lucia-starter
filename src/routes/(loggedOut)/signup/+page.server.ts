import type { Actions } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { signupSchema } from '$lib/schema/signupSchema';
import { createUserHandler } from './createUserHandler';

export const load = async () => {
	const form = await superValidate(signupSchema);
	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		return createUserHandler({ request, locals, admin: false });
	}
};
