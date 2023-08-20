export const actions = {
	logout: async (event) => {
		event.locals.auth.setSession(null);
	}
};
