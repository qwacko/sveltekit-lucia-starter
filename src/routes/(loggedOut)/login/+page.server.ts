import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';
import { setMessage, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/schema/loginSchema';
import { serverEnv } from '$lib/server/serverEnv';
import { authGuard } from '$lib/authGuard/authGuardConfig';
import { db } from '$lib/server/db/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';
import { logging } from '$lib/server/logging';

export const load = async (data) => {
	authGuard(data);
	const form = await superValidate(zod(loginSchema));

	return { form, enableSignup: serverEnv.ALLOW_SIGNUP };
};

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		const form = await superValidate(request, zod(loginSchema));

		// Convenient validation check:
		if (!form.valid) {
			// Again, always return { form } and things will just work.
			return fail(400, { form });
		}
		try {
			const existingUser = await db
				.select()
				.from(user)
				.where(eq(user.username, form.data.username.toLowerCase()))
				.execute();
			if (existingUser.length === 0 || existingUser.length > 1) {
				await new Argon2id().hash(form.data.password);
				return setMessage(form, 'Incorrect username or password', { status: 400 });
			}

			const targetUser = existingUser[0];

			const validPassword = await new Argon2id().verify(
				targetUser.hashedPassword,
				form.data.password
			);

			if (!validPassword) {
				return setMessage(form, 'Incorrect username or password', { status: 400 });
			}

			const session = await auth.createSession(targetUser.id, {});
			const sessionCookie = auth.createSessionCookie(session.id);

			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} catch (e) {
			logging.error('Error Logging In', e);
			return setMessage(form, 'Incorrect username or password', { status: 400 });
		}
		redirect(302, '/');
	}
};
