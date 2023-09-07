import { signupSchema } from '$lib/schema/signupSchema';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions } from './$types';
import { createUserHandler } from '$lib/server/createUserHandler';
import { useCombinedAuthGuard } from '$lib/server/authGuard/authGuardConfig';

export const load = async ({ locals, route }) => {
	useCombinedAuthGuard({ route, locals });

	const form = await superValidate(signupSchema);

	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const admin = locals.user?.admin;

		//Admin Cannot Do This
		if (!admin) {
			return {};
		}
		return createUserHandler({ request, locals, admin: false, setSession: false });
	}
};
