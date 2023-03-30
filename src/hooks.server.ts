import { auth } from '$lib/server/lucia';
import { createContext } from '$lib/server/trpc/context';
import { router } from '$lib/server/trpc/router';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createTRPCHandle } from 'trpc-sveltekit';

const authHandler: Handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);
	const user = await event.locals.auth.validate();

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

const trpcInEvent: Handle = async ({ event, resolve }) => {
	const trpcCaller = router.createCaller(await createContext(event));
	event.locals.trpc = trpcCaller;
	return await resolve(event);
};

export const handle = sequence(
	authHandler,
	createTRPCHandle({ router, createContext }),
	trpcInEvent
);
