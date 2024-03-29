import { updatePasswordSchema } from '$lib/schema/signupSchema.js';
import { authGuard } from '$lib/authGuard/authGuardConfig.js';
import { db } from '$lib/server/db/db.js';
import { session, user } from '$lib/server/db/schema';
import { auth } from '$lib/server/lucia.js';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { Argon2id } from 'oslo/password';

const passwordSchema = updatePasswordSchema;

export type passwordSchemaType = typeof passwordSchema;

export const load = async (requestData) => {
	authGuard(requestData);

	const form = await superValidate(zod(passwordSchema));

	return { form };
};

export const actions = {
	default: async ({ locals, params, request }) => {
		const form = await superValidate(request, zod(passwordSchema));
		const currentUser = locals.user;
		const targetUserId = params.id;

		if (!form.valid) {
			return { form };
		}

		//Admin Cannot Do This
		if (!currentUser) {
			return message(form, "You're not logged in");
		}

		if (!(currentUser.userId === targetUserId) && !currentUser.admin) {
			return message(form, "You're not allowed to do this");
		}

		const targetUser = db.select().from(user).where(eq(user.id, targetUserId)).get();

		if (!targetUser) {
			return message(form, 'User Not Found');
		}

		try {
			const hashedPassword = await new Argon2id().hash(form.data.password);
			await db.update(user).set({ hashedPassword }).where(eq(user.id, targetUserId)).execute();
			await db.delete(session).where(eq(session.userId, targetUserId)).execute();
		} catch (e) {
			return message(form, 'Error Updating Password', { status: 400 });
		}

		redirect(302, `/users/${targetUserId}`);
	}
};
