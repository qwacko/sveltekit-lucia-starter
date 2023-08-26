import { db } from '$lib/server/db/db';
import { user } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ params }) => {
	// Fetch users from database
	const currentUser = db.select().from(user).where(eq(user.id, params.id)).get();

	if (!currentUser) {
		throw redirect(302, '/users');
	}

	return { currentUser };
};
