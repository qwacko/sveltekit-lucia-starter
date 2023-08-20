import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { signupSchema } from '$lib/schema/signupSchema';
import { logging } from '$lib/server/logging';

export const createUserHandler = async ({
	request,
	locals,
	admin
}: {
	request: Request;
	locals: App.Locals;
	admin: boolean;
}) => {
	const form = await superValidate(request, signupSchema);

	if (!form.valid) {
		return fail(400, { form });
	}

	try {
		const user = await auth.createUser({
			key: {
				providerId: 'username',
				providerUserId: form.data.username.toLowerCase(),
				password: form.data.password // hashed by Lucia
			},
			attributes: {
				username: form.data.username,
				admin: admin ? 1 : 0
			}
		});
		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});
		locals.auth.setSession(session); // set session cookie
	} catch (e) {
		logging.info('Error creating user', e);
		form.message = 'Error creating user. Username possibly already exists.';
		return fail(500, { form });
	}
	// redirect to
	// make sure you don't throw inside a try/catch block!
	throw redirect(302, '/user');
};
