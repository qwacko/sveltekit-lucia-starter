import { dbAdminCount, dbUserCount } from '$lib/server/db/actions/firstUser';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	const userCountValue = await dbUserCount();
	const adminCountValue = await dbAdminCount();
	return {
		user: session ? session.user : undefined,
		userCount: userCountValue,
		adminCount: adminCountValue
	};
};
