import { useCombinedAuthGuard } from '$lib/server/authGuard/authGuardConfig';

export const actions = {
	default: async (requestData) => {
		console.log('Test Function Is Executed');
		useCombinedAuthGuard(requestData);
	}
};
