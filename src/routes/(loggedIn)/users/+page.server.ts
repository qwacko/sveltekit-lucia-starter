import { useCombinedAuthGuard } from '$lib/server/authGuard/authGuardConfig.js';
import { db } from '$lib/server/db/db';
import { user } from '$lib/server/db/schema';

export const load = async (data) => {
	useCombinedAuthGuard(data);
	// Fetch users from database
	const users = db.select().from(user).all();

	return { users };
};
