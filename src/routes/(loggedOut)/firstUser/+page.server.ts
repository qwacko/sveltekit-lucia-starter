import type { Actions } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { signupSchema } from '$lib/schema/signupSchema';
import { createUserHandler } from './../signup/createUserHandler';
import { dbNoAdmins } from '$lib/server/db/actions/firstUser';

export const load = async () => {
	const form = await superValidate(signupSchema);
	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		//Only allow creation of a first user as an admin if there is no existing admins.
		const noAdmin = await dbNoAdmins();
		if (noAdmin) {
			return createUserHandler({ request, locals, admin: true });
		}
	}
};
