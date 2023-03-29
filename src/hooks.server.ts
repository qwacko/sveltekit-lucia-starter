import { auth } from '$lib/server/lucia';
import type { Handle } from '@sveltejs/kit';

const authHandler: Handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);
	const user = await event.locals.auth.validate();

	const authCookie = event.cookies.get('auth_session');
	console.log('User:', user);
	console.log('Auth Cookie:', authCookie);

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

export const handle = authHandler;
