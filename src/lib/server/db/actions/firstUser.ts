import { eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { user } from '../schema';

export const dbUserCount = async () => {
	const resultCount = db
		.select({ count: sql<number>`count(*)` })
		.from(user)
		.all();

	return resultCount[0].count;
};

export const dbAdminCount = async () => {
	const resultCount = db
		.select({ count: sql<number>`count(*)` })
		.from(user)
		.where(eq(user.admin, true))
		.all();

	return resultCount[0].count;
};

export const dbIsFirstUser = async () => {
	const resultCount = await dbUserCount();

	return resultCount === 0;
};

export const dbNoAdmins = async () => {
	const resultCount = await dbAdminCount();

	return resultCount === 0;
};
