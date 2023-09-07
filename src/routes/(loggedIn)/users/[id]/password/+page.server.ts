import { updatePasswordSchema } from '$lib/schema/signupSchema.js';
import { useCombinedAuthGuard } from '$lib/server/authGuard/authGuardConfig.js';
import { db } from '$lib/server/db/db.js';
import { user } from '$lib/server/db/schema';
import { auth } from '$lib/server/lucia.js';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { message, superValidate } from 'sveltekit-superforms/server';

const passwordSchema = updatePasswordSchema;

export type passwordSchemaType = typeof passwordSchema;

export const load = async ({ locals, route }) => {
	useCombinedAuthGuard({ locals, route });

	const form = await superValidate(passwordSchema);

	return { form };
};

export const actions = {
	default: async ({ locals, params, request }) => {
		const form = await superValidate(request, passwordSchema);
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

		console.log('Target User: ', targetUser);

		try {
			await auth.updateKeyPassword(
				'username',
				targetUser.username.toLowerCase(),
				form.data.password
			);
		} catch (e) {
			return message(form, 'Error Updating Password', { status: 400 });
		}

		throw redirect(302, `/users/${targetUserId}`);
	}
};
