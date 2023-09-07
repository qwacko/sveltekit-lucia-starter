import { useCombinedAuthGuard, type AuthRouteOptions } from '$lib/server/authGuard/authGuardConfig';
import { initateCronJobs } from '$lib/server/cron/cron';
import { dbNoAdmins } from '$lib/server/db/actions/firstUser';

import { auth } from '$lib/server/lucia';
import { redirect, type Handle } from '@sveltejs/kit';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const runningJobs = initateCronJobs();

export const handle: Handle = async ({ event, resolve }) => {
	// we can pass `event` because we used the SvelteKit middleware

	event.locals.auth = auth.handleRequest(event);

	const [user, noAdmin] = await Promise.all([event.locals.auth.validate(), dbNoAdmins()]);

	event.locals.user = user?.user;

	if (!event.route.id) {
		throw redirect(302, '/login');
	}
	if (event.route.id !== '/(loggedOut)/firstUser' && noAdmin) {
		throw redirect(302, '/firstUser');
	}

	if (event.route.id) {
		useCombinedAuthGuard({ locals: event.locals, route: event.route as AuthRouteOptions });
	}

	return await resolve(event);
};
