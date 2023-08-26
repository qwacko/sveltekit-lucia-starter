import { signupSchema } from '$lib/schema/signupSchema';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { createUserHandler } from '$lib/server/createUserHandler';

export const load = async ({ locals }) => {
	const user = await locals.auth.validate();

	//User Must Be Admin To Access
	if (!user || !user.user.admin) {
		throw redirect(302, '/users');
	}

	const form = await superValidate(signupSchema);

	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const admin = (await locals.auth.validate())?.user.admin;

		//Admin Cannot Do This
		if (!admin) {
			return {};
		}
		return createUserHandler({ request, locals, admin: false, setSession: false });
	}
};
