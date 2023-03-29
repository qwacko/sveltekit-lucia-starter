export const actions = {
	logout: async (event) => {
		console.log('Event', JSON.stringify(event));
		event.locals.auth.setSession(null);
	}
};
