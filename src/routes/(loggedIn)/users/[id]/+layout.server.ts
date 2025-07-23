import { db } from '$lib/server/db/db';
import { user } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ params }) => {
	// Fetch users from database
	const currentUser = await db.select().from(user).where(eq(user.id, params.id)).get();

	if (!currentUser) {
		throw redirect(302, '/users');
	}
	const currentUserAccount = await db.query.userAccountTable.findFirst({
		where: (table, { eq }) => eq(table.userId, currentUser.id)
	});

	const combinedCurrentUser = {
		...currentUser,
		admin: currentUserAccount?.admin || false
	};

	return { currentUser: combinedCurrentUser };
};
