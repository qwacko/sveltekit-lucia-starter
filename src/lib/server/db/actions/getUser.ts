import { auth } from '$lib/server/auth/auth';
import { db } from '../db';

export const getUser = async (headers: Headers) => {
	const session = await auth.api.getSession({
		headers: headers
	});

	if (!session) {
		return null;
	}

	const user = session.user;

	if (!user) {
		return null;
	}

	const userAccount = await db.query.userAccountTable.findFirst({
		where: (table, { eq }) => eq(table.userId, user.id)
	});

	return { ...user, admin: userAccount?.admin || false };
};

export type User = Awaited<ReturnType<typeof getUser>>;
