import { trpc } from '$lib/clientTRPC';

// 👇 this method will be invoked on BOTH the server and the client, as needed ⚠️

//TODO : This Should Be Reinstated.

export const load = async (event) => {
	return {
		...(event.data ? event.data : {}),
		users: trpc(event).users.users.query()
	};
};
