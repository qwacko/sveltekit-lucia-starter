import { db } from '$lib/server/db/db';
import { user } from '$lib/server/db/schema';

export const load = async () => {
	// Fetch users from database
	const users = db.select().from(user).all();

	return { users };
};
