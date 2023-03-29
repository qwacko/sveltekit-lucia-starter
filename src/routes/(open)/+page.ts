import { trpc } from '$lib/clientTRPC';

export const load = async (event) => {
	const data = trpc(event).greetingProtected.query();

	return { data };
};
