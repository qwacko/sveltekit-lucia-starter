export const load = async (event) => {
	const user = await event.locals.auth.validateUser();
	return { user };
};

export const actions = {
	logout: async (event) => {
		event.locals.auth.setSession(null);
	}
};
