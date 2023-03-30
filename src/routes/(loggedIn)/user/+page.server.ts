export const load = async (event) => {
	const user = await event.locals.auth.validateUser();
	const trpcUser = event.locals.trpc.greetingProtected(0);
	const trpcUserStreaming = event.locals.trpc.greetingProtected(5000);
	return { user, trpcUser, streaming: { trpcUserStreaming } };
};

export const actions = {
	logout: async (event) => {
		event.locals.auth.setSession(null);
	}
};
