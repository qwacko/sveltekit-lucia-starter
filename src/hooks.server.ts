import { initateCronJobs } from '$lib/server/cron/cron';
import { dbNoAdmins } from '$lib/server/db/actions/firstUser';
import { auth } from '$lib/server/lucia';
import type { Handle } from '@sveltejs/kit';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const runningJobs = initateCronJobs();

export const handle: Handle = async ({ event, resolve }) => {
	// we can pass `event` because we used the SvelteKit middleware

	event.locals.auth = auth.handleRequest(event);

	const user = await event.locals.auth.validate();

	const noAdmin = await dbNoAdmins();

	if (noAdmin && !event.route.id?.startsWith('/(loggedOut)/firstUser')) {
		console.log('No Admin Exists - Redirecting to First User Creation');
		return Response.redirect(`${event.url.origin}/firstUser`, 302);
	}

	if (!noAdmin && event.route.id?.startsWith('/(loggedOut)/firstUser')) {
		console.log('Admin Exists - Redirecting to Home');
		if (user) {
			return Response.redirect(`${event.url.origin}/user`, 302);
		} else {
			return Response.redirect(`${event.url.origin}/login`, 302);
		}
	}

	if (event.route.id?.startsWith('/(loggedIn)') && !user) {
		console.log('User Not Logged In - Redirecting to Login');
		return Response.redirect(`${event.url.origin}/login`, 302);
	}

	if (event.route.id?.startsWith('/(loggedOut)') && user) {
		console.log('User Logged In - Redirecting to User');
		return Response.redirect(`${event.url.origin}/user`, 302);
	}

	return await resolve(event);
};
