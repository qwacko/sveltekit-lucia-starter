import { createContext } from '$lib/server/trpc/context';
import { router } from '$lib/server/trpc/router';

export const load = async (event) => {
	const user = await event.locals.auth.validateUser();
	const trpcUser = router.createCaller(await createContext(event)).greetingProtected(0);
	const trpcUserStreaming = router.createCaller(await createContext(event)).greetingProtected(5000);
	return { user, trpcUser, streaming: { trpcUserStreaming } };
};

export const actions = {
	logout: async (event) => {
		event.locals.auth.setSession(null);
	}
};
