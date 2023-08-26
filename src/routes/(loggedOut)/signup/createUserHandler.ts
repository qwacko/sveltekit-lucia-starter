import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { signupSchema } from '$lib/schema/signupSchema';
import { logging } from '$lib/server/logging';

export const createUserHandler = async ({
	request,
	locals,
	admin,
	setSession = false
}: {
	request: Request;
	locals: App.Locals;
	admin: boolean;
	setSession?: boolean;
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
				admin: (admin ? 1 : 0) as unknown as boolean
			}
		});
		if (setSession) {
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});
			locals.auth.setSession(session); // set session cookie}
		} else {
			//Returns a new form to reset the form
			const newForm = await superValidate(signupSchema);
			return { form: newForm };
		}
	} catch (e) {
		logging.info('Error creating user', e);
		return setError(form, 'username', 'Error creating user. Username possibly already exists.');
	}
	// redirect to
	// make sure you don't throw inside a try/catch block!
	throw redirect(302, '/user');
};
