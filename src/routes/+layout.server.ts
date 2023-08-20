import { dbUserCount } from '$lib/server/db/actions/firstUser';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	const userCountValue = await dbUserCount();
	return { user: session ? session.user : undefined, userCount: userCountValue };
};
