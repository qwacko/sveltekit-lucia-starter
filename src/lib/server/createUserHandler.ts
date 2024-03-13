import { auth } from '$lib/server/lucia';
import { fail, redirect, type Cookies } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { signupSchema } from '$lib/schema/signupSchema';
import { logging } from '$lib/server/logging';
import { Argon2id } from 'oslo/password';
import { nanoid } from 'nanoid';
import { db } from './db/db';
import { user } from './db/schema';
import { eq } from 'drizzle-orm';

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
	const form = await superValidate(request, zod(signupSchema));

	if (!form.valid) {
		return fail(400, { form });
	}

	const userInfo = await db
		.select()
		.from(user)
		.where(eq(user.username, form.data.username.toLowerCase()))
		.execute();

	if (userInfo.length > 0) {
		return setError(form, 'username', 'Error creating user. Username possibly already exists.');
	}

	try {
		const userId = nanoid();
		const hashedPassword = await new Argon2id().hash(form.data.password);

		await db
			.insert(user)
			.values({
				id: userId,
				username: form.data.username.toLowerCase(),
				hashedPassword: hashedPassword,
				admin: admin
			})
			.execute();

		const createdUser = await db.select().from(user).where(eq(user.id, userId)).execute();

		if (createdUser.length === 0) {
			throw new Error('Error creating user');
		}

		if (setSession) {
			const session = await auth.createSession(userId, {});
			const sessionCookie = auth.createSessionCookie(session.id);

			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}
	} catch (e) {
		logging.info('Error creating user', e);
		return setError(form, 'username', 'Error creating user. Username possibly already exists.');
	}

	redirect(302, '/user');
};
