import { auth } from '$lib/server/auth/auth';
import { fail, redirect, type Cookies } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { signupSchema } from '$lib/schema/signupSchema';
import { logging } from '$lib/server/logging';
import { db } from './db/db';
import { userAccountTable } from './db/schema';
import { nanoid } from 'nanoid';

export const createUserHandler = async ({
	request,
	admin,
	setSession = false,
	cookies
}: {
	request: Request;
	admin: boolean;
	setSession?: boolean;
	cookies: Cookies;
}) => {
	const form = await superValidate(request, zod4(signupSchema));

	if (!form.valid) {
		return fail(400, { form });
	}

	if (form.data.password !== form.data.confirmPassword) {
		return setError(form, 'confirmPassword', 'Passwords do not match');
	}

	try {
		if (setSession) {
			// For first user creation or public signup - create user and sign them in
			const createdUser = await auth.api.signUpEmail({
				body: {
					email: form.data.username.toLowerCase(),
					password: form.data.password,
					name: form.data.username,
					rememberMe: true
				},
				headers: request.headers
			});

			await db.insert(userAccountTable).values({
				id: nanoid(),
				userId: createdUser.user.id,
				admin
			});
		} else {
			// For admin creating user - preserve admin session
			const sessionToken =
				cookies.get('better-auth.session_token') ||
				cookies.get('session_token') ||
				cookies.get('session');

			// Create the new user without headers to avoid session interference
			const createdUser = await auth.api.signUpEmail({
				body: {
					email: form.data.username.toLowerCase(),
					password: form.data.password,
					name: form.data.username,
					rememberMe: false
				}
			});

			await db.insert(userAccountTable).values({
				id: nanoid(),
				userId: createdUser.user.id,
				admin
			});

			// Restore the original admin session if it existed
			if (sessionToken) {
				const cookieName = cookies.get('better-auth.session_token')
					? 'better-auth.session_token'
					: cookies.get('session_token')
						? 'session_token'
						: 'session';

				cookies.set(cookieName, sessionToken, {
					path: '/',
					httpOnly: true,
					secure: true,
					sameSite: 'lax'
				});
			}
		}

		return;
	} catch (e) {
		logging.info('Error signing up email', e);
		return setError(form, 'username', 'Error creating user. Username possibly already exists.');
	}
};
