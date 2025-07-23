import { authGuard } from '$lib/authGuard/authGuardConfig.js';
import { db } from '$lib/server/db/db';
import { user } from '$lib/server/db/schema';

export const load = async (data) => {
	authGuard(data);
	// Fetch users from database
	const users = await db.query.user.findMany({});
	const userAccounts = await db.query.userAccountTable.findMany({});

	const mergesUsers = users.map((user) => {
		const userAccount = userAccounts.find((account) => account.userId === user.id);
		return {
			...user,
			admin: userAccount?.admin || false
		};
	});

	return { users: mergesUsers };
};
