import { dbAdminCount, dbUserCount } from '$lib/server/db/actions/firstUser';
import { serverEnv } from '$lib/server/serverEnv';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const userCountValue = await dbUserCount();
	const adminCountValue = await dbAdminCount();
	return {
		user: locals.user,
		userCount: userCountValue,
		adminCount: adminCountValue,
		viewTransitions: serverEnv.ENABLE_TRANSITIONS
	};
};
