import { trpc } from '$lib/clientTRPC';

// 👇 this method will be invoked on BOTH the server and the client, as needed ⚠️
export const load = async (event) => {
	return {
		...(event.data ? event.data : {}),
		users: trpc(event).users.users.query()
	};
};
