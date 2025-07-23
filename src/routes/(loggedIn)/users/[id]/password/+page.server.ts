import { updatePasswordSchema } from '$lib/schema/signupSchema.js';
import { authGuard } from '$lib/authGuard/authGuardConfig.js';
import { db } from '$lib/server/db/db.js';
import { user } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { auth } from '$lib/server/auth/auth.js';

const passwordSchema = updatePasswordSchema;

export type passwordSchemaType = typeof passwordSchema;

export const load = async (requestData) => {
	authGuard(requestData);

	const form = await superValidate(zod4(passwordSchema));

	return { form };
};

export const actions = {
	default: async ({ locals, params, request }) => {
		const form = await superValidate(request, zod4(passwordSchema));
		const currentUser = locals.user;
		const targetUserId = params.id;

		if (!form.valid) {
			return { form };
		}

		//Admin Cannot Do This
		if (!currentUser) {
			return message(form, "You're not logged in");
		}

		if (!(currentUser.id === targetUserId) && !currentUser.admin) {
			return message(form, "You're not allowed to do this");
		}

		const targetUser = db.select().from(user).where(eq(user.id, targetUserId)).get();

		if (!targetUser) {
			return message(form, 'User Not Found');
		}

		try {
			const ctx = await auth.$context;
			const hash = await ctx.password.hash('your-new-password');
			await ctx.internalAdapter.updatePassword(targetUserId, hash);
		} catch (e) {
			return message(form, 'Error Updating Password', { status: 400 });
		}

		redirect(302, `/users/${targetUserId}`);
	}
};
